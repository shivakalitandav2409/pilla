/*
 * Live Vmedulife Faculty Bridge & Real-Time Attendance Engine
 * Extracted and ported from 3SAOISTSLg (mobile_server.py & server.js)
 */
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const {
  parseRemainingSeconds,
  formatIstDateTime,
  parseAutoSavedSelection,
  buildExamPerformanceArray,
  buildPortalCookieHeader,
  mapPortalExam,
  mapPortalAssignment,
  parsePortalUploadHtml
} = require('./data.js');

function safeJsonParse(text) {
  if (!text || typeof text !== 'string') return null;
  const trimmed = text.trim();
  if (!trimmed) return null;
  try { return JSON.parse(trimmed); } catch {}
  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try { return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1)); } catch {}
  }
  return null;
}

function inferMimeType(fileName = '') {
  const ext = String(fileName).toLowerCase().split('.').pop();
  const map = {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    txt: 'text/plain',
    html: 'text/html',
    htm: 'text/html',
    zip: 'application/zip',
    py: 'text/x-python',
    cpp: 'text/x-c++src'
  };
  return map[ext] || 'application/octet-stream';
}

let cachedCookie = null;
let cachedAuth = null;

function loadSessionCookie() {
  if (cachedCookie) return cachedCookie;

  // 1. Check local session_cookie.json
  const cookiePath = path.join(__dirname, 'session_cookie.json');
  if (fs.existsSync(cookiePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(cookiePath, 'utf8'));
      if (data && data.cookie) {
        cachedCookie = data.cookie;
        return cachedCookie;
      }
    } catch {}
  }

  // 2. Check encrypted session.json in 3SAOISTSLg or current dir
  const secret = process.env.SESSION_SECRET || 'vmedu_faculty_attendance_session_secret_xyz_123!';
  const key = crypto.createHash('sha256').update(secret).digest();

  const candidates = [
    path.join(__dirname, 'session.json'),
    'C:/Users/Project/3SAOISTSLg/session.json.good',
    'C:/Users/Project/3SAOISTSLg/session.json'
  ];

  for (const p of candidates) {
    if (fs.existsSync(p)) {
      try {
        const raw = fs.readFileSync(p, 'utf8').trim();
        const parts = raw.split(':');
        if (parts.length === 2) {
          const iv = Buffer.from(parts[0], 'hex');
          const ct = Buffer.from(parts[1], 'hex');
          const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
          const decrypted = Buffer.concat([decipher.update(ct), decipher.final()]).toString('utf8');
          const data = JSON.parse(decrypted);
          if (data && data.cookie) {
            cachedCookie = data.cookie;
            return cachedCookie;
          }
        }
      } catch {}
    }
  }

  return null;
}

async function refreshFacultySession() {
  const tokenData = { source: 'web', uid: 13178, email: 'shipraguptaj@oriental.ac.in', role: 'instructor' };
  const params = new URLSearchParams();
  params.append('GenerateAccessToken', 'true');
  params.append('data', Buffer.from(JSON.stringify(tokenData)).toString('base64'));

  try {
    const res = await fetch('https://portal.vmedulife.com/api/tokenmanagement.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'https://portal.vmedulife.com',
        'Referer': 'https://portal.vmedulife.com/moduleversions/academicplanning/V1/',
        'User-Agent': 'Mozilla/5.0'
      },
      body: params.toString()
    });

    const json = await res.json().catch(() => ({}));
    if (json && json.status === 'success' && json.data) {
      const userToken = json.data.user_token;
      const syncToken = json.data.sync_token;
      const deviceId = json.deviceId || '2550531171083741';

      const userDetails = {
        data: {
          uid: 13178,
          EmailId: 'shipraguptaj@oriental.ac.in',
          Role: 'instructor',
          InstitudeId: 987,
          Institute_iid: 987,
          FirstName: 'Shipra',
          LastName: 'Gupta',
          DeviceId: deviceId
        }
      };
      const udInner = Buffer.from(JSON.stringify(userDetails)).toString('base64');
      const udOuter = Buffer.from(udInner).toString('base64');
      const cookie = `user_token=${encodeURIComponent(userToken)}; sync_token=${encodeURIComponent(syncToken)}; user_details=${encodeURIComponent(udOuter)}; device_id=${deviceId}; Institute_iid=987; current_selected_role=instructor`;

      cachedCookie = cookie;
      cachedAuth = {
        cookie,
        userToken,
        syncToken,
        deviceId,
        userId: 13178,
        userEmail: 'shipraguptaj@oriental.ac.in',
        inputUserRole: 'instructor',
        tokenInputParameter: tokenData
      };
      return cachedAuth;
    }
  } catch (err) {}
  return null;
}

function getFacultyAuth() {
  if (cachedAuth) return cachedAuth;
  const cookie = loadSessionCookie();
  if (!cookie) return null;

  try {
    const m_ut = cookie.match(/user_token=([^;]+)/);
    const m_st = cookie.match(/sync_token=([^;]+)/);
    const m_ud = cookie.match(/user_details=([^;]+)/);
    const m_dev = cookie.match(/device_id=([^;]+)/);

    let udRaw = decodeURIComponent(m_ud[1]);
    let decoded = Buffer.from(udRaw, 'base64').toString('utf8');
    if (decoded.startsWith('ey')) {
      decoded = Buffer.from(decoded, 'base64').toString('utf8');
    }
    const userDetails = JSON.parse(decoded);
    const user = userDetails.data || userDetails.user || userDetails;
    const userId = user.uid || user.UserId || 13178;
    const userEmail = user.EmailId || user.email || 'shipraguptaj@oriental.ac.in';
    const role = 'instructor';
    const deviceId = m_dev ? decodeURIComponent(m_dev[1]) : '2550531171083741';

    cachedAuth = {
      cookie,
      userToken: decodeURIComponent(m_ut[1]),
      syncToken: decodeURIComponent(m_st[1]),
      deviceId,
      userId,
      userEmail,
      inputUserRole: role,
      tokenInputParameter: { source: 'web', uid: userId, email: userEmail, role }
    };
    return cachedAuth;
  } catch (err) {
    console.error('[Live Auth] Error extracting faculty auth:', err.message);
    return null;
  }
}

/**
 * Fetch live timetable sessions for a group from portal.vmedulife.com
 */
async function fetchGroupTimetable(sid, groupId, acayr, startDate, endDate) {
  let fa = getFacultyAuth();
  if (!fa) fa = await refreshFacultySession();
  if (!fa) return null;

  const payload = {
    iid: '987',
    iidArray: ['987'],
    sid: String(sid),
    groupId: String(groupId),
    semesterNumber: '3',
    acayr: String(acayr || '12'),
    startDate,
    endDate,
    getCompletedTopicNames: true
  };

  const doFetch = async (auth) => {
    const formData = new URLSearchParams();
    formData.append('getInstituteWiseGroupwiseWeeklyTimeTableWithSubjectDetails', 'true');
    formData.append('data', Buffer.from(JSON.stringify(payload)).toString('base64'));
    formData.append('tokenInputParameter', Buffer.from(JSON.stringify(auth.tokenInputParameter)).toString('base64'));

    const res = await fetch('https://portal.vmedulife.com/api/academicPlanning/V1/managesessions/managesessions.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': auth.cookie,
        'Origin': 'https://portal.vmedulife.com',
        'Referer': 'https://portal.vmedulife.com/moduleversions/academicplanning/V1/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: formData.toString()
    });

    const text = await res.text();
    try {
      const json = JSON.parse(text.trim());
      return json && json.data ? json.data : null;
    } catch {
      return null;
    }
  };

  let data = await doFetch(fa);
  if (!data) {
    const refreshed = await refreshFacultySession();
    if (refreshed) data = await doFetch(refreshed);
  }
  return data;
}

/**
 * Get student sessions formatted exactly like HAR and compute real live attendance metrics
 */
async function getLiveStudentSessions(studentId, sid, groupId, batchId, acayr, startDate, endDate) {
  const sessionsMap = await fetchGroupTimetable(sid, groupId, acayr, startDate, endDate);
  if (!sessionsMap) return null;

  const sidStr = String(studentId);
  const items = [];
  let presentCount = 0;
  let absentCount = 0;
  const subjectStats = {};

  const entries = Object.entries(sessionsMap);
  entries.sort((a, b) => {
    const dateA = a[1].ProposedDate || a[1].CompletionDateRaw || '';
    const dateB = b[1].ProposedDate || b[1].CompletionDateRaw || '';
    if (dateA !== dateB) return dateA < dateB ? 1 : -1;
    const timeA = a[1].startTimeRaw || a[1].ProposedStartTimeRaw || '';
    const timeB = b[1].startTimeRaw || b[1].ProposedStartTimeRaw || '';
    return timeA.localeCompare(timeB);
  });

  const batchSet = new Set(
    (Array.isArray(batchId) ? batchId : [batchId])
      .map(b => Number(b))
      .filter(b => Number.isFinite(b) && b > 0)
  );
  let sessionIndex = 0;
  for (const [id, s] of entries) {
    if (!s || typeof s !== 'object') continue;

    // Check enrollment
    let applies = false;
    if (Array.isArray(s.sessionWiseStudentList) && s.sessionWiseStudentList.length > 0) {
      applies = s.sessionWiseStudentList.some(item => String(item) === sidStr);
    } else {
      const sBatch = Number(s.batchId) || 0;
      if (sBatch === 0) applies = true;
      else if (batchSet.size > 0) applies = batchSet.has(sBatch);
    }

    if (!applies) continue;

    // Determine status
    let status = 'Unmarked';
    if (s.completionStatus === 'completed') {
      const absentList = Array.isArray(s.attendance)
        ? s.attendance.filter(a => a !== 'NONE').map(String)
        : [];
      if (absentList.includes(sidStr)) {
        status = 'Absent';
        absentCount++;
      } else {
        status = 'Present';
        presentCount++;
      }
    }

    const date = s.ProposedDate || s.CompletionDateRaw || (s.startTime ? s.startTime.split('T')[0] : '');
    const subjName = s.subjectName || 'Unknown Subject';
    const subjId = Number(s.subjectId) || 0;
    const isLab = (Number(s.batchId) || 0) > 0;
    const subjType = s.subjectType || (isLab ? 'Practical' : 'Theory');
    const startStr = s.startReadable || (s.startTimeRaw ? String(s.startTimeRaw).slice(0, 5) : '09:30 AM');
    const endStr = s.endReadable || (s.endTimeRaw ? String(s.endTimeRaw).slice(0, 5) : '10:20 AM');

    if (status !== 'Unmarked') {
      subjectStats[subjId] = subjectStats[subjId] || { subject_id: subjId, subject_name: subjName, present: 0, total: 0 };
      subjectStats[subjId].total++;
      if (status === 'Present') subjectStats[subjId].present++;
    }

    items.push({
      session_index: sessionIndex++,
      session_id: Number(s.sessionId || id),
      subject_id: subjId,
      date,
      subject_name: `${subjName} ( ${subjType} | Regular )`,
      subject_display_name: `${subjName}(${s.subjectCode || ''}) ( ${subjType} | Regular )`,
      faculty_name: s.ownerName || 'Faculty Staff',
      attendance_status: status,
      source_status: status,
      simulated_status: null,
      time_slot: `${startStr} - ${endStr}`,
      updated_at: s.startTime || new Date().toISOString()
    });
  }

  const totalCompleted = presentCount + absentCount;
  const presentPct = totalCompleted > 0 ? Number(((presentCount / totalCompleted) * 100).toFixed(2)) : 0;
  const absentPct = totalCompleted > 0 ? Number(((absentCount / totalCompleted) * 100).toFixed(2)) : 0;

  const subjValues = Object.values(subjectStats);
  const avgPct = subjValues.length > 0
    ? Number((subjValues.reduce((acc, s) => acc + (s.total > 0 ? (s.present / s.total) * 100 : 0), 0) / subjValues.length).toFixed(2))
    : presentPct;

  const metrics = {
    present_count: presentCount,
    absent_count: absentCount,
    total_sessions: totalCompleted,
    present_pct: presentPct,
    absent_pct: absentPct,
    average_pct: avgPct,
    aggregate_percentage: presentPct
  };

  return { items, metrics };
}

/**
 * Modify student attendance live on portal.vmedulife.com using faculty API
 */
async function updateLiveAttendance(studentId, sessionId, newStatus, date, sid, groupId, acayr) {
  let fa = getFacultyAuth();
  if (!fa) fa = await refreshFacultySession();
  if (!fa) return { ok: false, error: 'No faculty session' };

  try {
    const timetable = await fetchGroupTimetable(sid, groupId, acayr, date, date);
    if (!timetable) return { ok: false, error: 'Failed to fetch timetable for session date' };

    const sessionObj = timetable[String(sessionId)];
    if (!sessionObj) return { ok: false, error: `Session ${sessionId} not found on ${date}` };

    const sessionBatchId = Number(sessionObj.batchId) || 0;
    const effectiveGroupId = String(sessionObj.groupId || sessionObj.semesterId || groupId);
    const effectiveSid = String(sessionObj.sid || sid);
    const subjectId = sessionObj.subjectId;
    const sidStr = String(studentId);

    // Fetch roster or use sessionWiseStudentList
    let studentList = [];
    if (Array.isArray(sessionObj.sessionWiseStudentList) && sessionObj.sessionWiseStudentList.length > 0) {
      studentList = sessionObj.sessionWiseStudentList.map(id => ({ id: String(id) }));
    } else {
      const rosterFormData = new URLSearchParams();
      rosterFormData.append('getStudentListBatchWise', 'true');
      rosterFormData.append('data', Buffer.from(JSON.stringify({
        groupId: effectiveGroupId,
        acayr: String(acayr || '12'),
        sid: effectiveSid,
        iid: '987',
        batchId: sessionBatchId
      })).toString('base64'));
      rosterFormData.append('tokenInputParameter', Buffer.from(JSON.stringify(fa.tokenInputParameter)).toString('base64'));

      const rRes = await fetch('https://portal.vmedulife.com/api/academicPlanning/V1/coursedashboard/sessions/sessions.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie': fa.cookie,
          'Origin': 'https://portal.vmedulife.com',
          'Referer': 'https://portal.vmedulife.com/moduleversions/academicplanning/V1/',
          'User-Agent': 'Mozilla/5.0'
        },
        body: rosterFormData.toString()
      });
      const rJson = await rRes.json().catch(() => ({}));
      studentList = rJson.studentList || [];
    }

    const studentAttendanceObject = {};
    if (sessionObj.completionStatus === 'completed') {
      const absentList = Array.isArray(sessionObj.attendance)
        ? sessionObj.attendance.filter(a => a !== 'NONE').map(String)
        : [];
      const absentSet = new Set(absentList);
      studentList.forEach(s => {
        const id = String(s.id);
        studentAttendanceObject[id] = absentSet.has(id) ? 'Absent' : 'Present';
      });
    } else {
      studentList.forEach(s => {
        studentAttendanceObject[String(s.id)] = 'Present';
      });
    }

    studentAttendanceObject[sidStr] = newStatus;

    const updatedAbsentIds = Object.keys(studentAttendanceObject).filter(id => studentAttendanceObject[id] === 'Absent');
    const absentStudentString = updatedAbsentIds.join(',');
    const attMarkObject = Object.keys(studentAttendanceObject).reduce((result, id) => {
      result[id] = {
        student_id: /^\d+$/.test(id) ? Number(id) : id,
        attendance_source: ''
      };
      return result;
    }, {});

    const rawStartTime = sessionObj.ProposedStartTimeRaw || sessionObj.startTimeRaw || '00:00:00.000000';
    const sessionTime = String(rawStartTime).includes('.') ? String(rawStartTime) : `${rawStartTime}.000000`;
    const sessionDateTime = `${date} ${sessionTime}`;

    const updatePayload = {
      iid: '987',
      batchId: sessionBatchId,
      absentStudent: absentStudentString,
      sessionType: sessionObj.sessionType || 'regular',
      attendanceRemark: 'null',
      sessionId: String(sessionId),
      groupId: effectiveGroupId,
      subjectId,
      sessionDate: sessionDateTime,
      studentAttendanceObject,
      facultyId: '999999',
      sid: effectiveSid,
      notificationEvent: 'student_attendance_updated',
      notifyAbsentStudentParents: true,
      attMarkObject
    };

    const updateFormData = new URLSearchParams();
    updateFormData.append('planningUpdateSubjectSessionAttendanceWithStudents', 'true');
    updateFormData.append('data', Buffer.from(JSON.stringify(updatePayload)).toString('base64'));
    updateFormData.append('tokenInputParameter', Buffer.from(JSON.stringify(fa.tokenInputParameter)).toString('base64'));

    const upRes = await fetch('https://portal.vmedulife.com/api/academicPlanning/V1/coursedashboard/sessions/sessions.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': fa.cookie,
        'Origin': 'https://portal.vmedulife.com',
        'Referer': 'https://portal.vmedulife.com/moduleversions/academicplanning/V1/',
        'User-Agent': 'Mozilla/5.0'
      },
      body: updateFormData.toString()
    });

    const upText = await upRes.text();
    const upJson = safeJsonParse(upText) || {};

    const ok = upJson && (upJson.success === true || upJson.success === 'true' || upJson.status === 'success');
    return { ok: Boolean(ok), data: upJson, error: ok ? undefined : (upJson.message || 'Upstream attendance update failed') };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

/* ------------------------------------------------------------------ */
/* Live Online Exam Engine (ported from Test.har)                     */
/* ------------------------------------------------------------------ */
async function generateLearnerToken(uid, email = '') {
  if (!uid) return null;
  const tokenData = { source: 'web', uid: Number(uid), email: email || '', role: 'learner' };
  const params = new URLSearchParams();
  params.append('GenerateAccessToken', 'true');
  params.append('data', Buffer.from(JSON.stringify(tokenData)).toString('base64'));
  try {
    const res = await fetch('https://portal.vmedulife.com/api/tokenmanagement.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'https://portal.vmedulife.com',
        'Referer': 'https://portal.vmedulife.com/student/OnlineExam/AssignedModulesList.php',
        'User-Agent': 'Mozilla/5.0'
      },
      body: params.toString()
    });
    const json = await res.json().catch(() => ({}));
    if (json && json.status === 'success' && json.data && json.data.user_token) {
      return json.data.user_token;
    }
  } catch {}
  return null;
}

async function getLearnerAuthToken(user, forceRefresh = false) {
  if (!user || !user.stuid || user.username === 'DEMO123') return null;
  if (!forceRefresh && user.learnerToken) return user.learnerToken;
  const tok = await generateLearnerToken(user.stuid, user.email);
  if (tok) user.learnerToken = tok;
  return tok;
}

async function postOnlineExamApi(user, actionName, dataObj) {
  let token = await getLearnerAuthToken(user);
  if (!token) return null;

  const tokenParam = Buffer.from(JSON.stringify({
    source: 'web',
    uid: Number(user.stuid),
    role: 'learner'
  })).toString('base64');

  const sendReq = async (authTok) => {
    const params = new URLSearchParams();
    params.append(actionName, 'true');
    params.append('data', JSON.stringify(dataObj));
    params.append('tokenInputParameter', tokenParam);
    const res = await fetch('https://portal.vmedulife.com/api/instructor/onlineExam.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + authTok,
        'Origin': 'https://portal.vmedulife.com',
        'Referer': 'https://portal.vmedulife.com/student/OnlineExam/AssignedModulesList.php',
        'User-Agent': 'Mozilla/5.0'
      },
      body: params.toString()
    });
    const text = await res.text();
    return safeJsonParse(text);
  };

  let json = await sendReq(token);
  if (!json || json.message === 'Unauthorized request.') {
    token = await getLearnerAuthToken(user, true);
    if (token) {
      json = await sendReq(token);
    }
  }
  return json;
}

async function getLiveStudentExams(user) {
  if (!user || !user.stuid || !user.sid || !user.groupid || user.username === 'DEMO123') return null;
  try {
    const batchIds = Array.isArray(user.batchIds) && user.batchIds.length
      ? user.batchIds.map(String)
      : [String(user.buid || '70134')];
    const elGroupIds = [...new Set([String(user.groupid), ...(Array.isArray(user.electiveGroupIds) ? user.electiveGroupIds.map(String) : [])])];

    const allExamsMap = new Map();
    const pendingSet = new Set();
    const completedSet = new Set();
    const limit = 50;

    // 1. Paginate group + batchwise exams
    for (let offset = 0; offset < 500; offset += limit) {
      const json = await postOnlineExamApi(user, 'getStudentGroupAndBatchwiseOnlineExams', {
        sid: String(user.sid),
        groupId: String(user.groupid),
        studentId: Number(user.stuid),
        acayr: Number(user.acayr || 12),
        offset,
        limit,
        examId: 0,
        assignedBatchIds: batchIds
      });
      if (!json || json.success !== 'true' || !json.data || typeof json.data !== 'object') break;
      const entries = Object.values(json.data);
      entries.forEach(e => allExamsMap.set(String(e.examId), mapPortalExam(e)));
      (json.pendingExamIds || []).forEach(id => pendingSet.add(String(id)));
      (json.completedExamIds || []).forEach(id => completedSet.add(String(id)));
      const total = Number(json.totalRecords) || entries.length;
      if (offset + entries.length >= total || entries.length === 0) break;
    }

    // 2. Also fetch elective subject exams (AssignedModulesList always queries groupIdArray including student's groupId)
    for (let offset = 0; offset < 500; offset += limit) {
      const elJson = await postOnlineExamApi(user, 'getStudentElectiveSubjectOnlineExams', {
        groupIdArray: elGroupIds,
        studentId: Number(user.stuid),
        acayr: Number(user.acayr || 12),
        offset,
        limit,
        examId: 0,
        assignedBatchIds: batchIds
      });
      if (!elJson || elJson.success !== 'true' || !elJson.data || typeof elJson.data !== 'object') break;
      const entries = Object.values(elJson.data);
      entries.forEach(e => {
        if (!allExamsMap.has(String(e.examId))) {
          allExamsMap.set(String(e.examId), mapPortalExam(e));
        }
      });
      (elJson.pendingExamIds || []).forEach(id => pendingSet.add(String(id)));
      (elJson.completedExamIds || []).forEach(id => completedSet.add(String(id)));
      const total = Number(elJson.totalRecords) || entries.length;
      if (entries.length === 0 || offset + entries.length >= total) break;
    }

    if (allExamsMap.size === 0) return null;
    return {
      exams: [...allExamsMap.values()],
      pendingIds: [...pendingSet],
      completedIds: [...completedSet]
    };
  } catch {
    return null;
  }
}

async function getLiveExamQuestions(user, examId) {
  if (!user || !user.stuid || user.username === 'DEMO123') return null;
  try {
    const json = await postOnlineExamApi(user, 'getStudentAssignedOnlineExamQuestionList', {
      studentId: Number(user.stuid),
      examId: Number(examId)
    });
    if (!json) return null;
    if (json.success !== 'true' || !json.data || Array.isArray(json.data)) {
      return { questions: null, message: json.message || 'Live questions unavailable', liveStatus: 'fallback' };
    }
    const order = Array.isArray(json.shuffleQid) && json.shuffleQid.length
      ? json.shuffleQid.map(String).filter(qid => json.data[qid])
      : Object.keys(json.data);
    if (!order.length) {
      return { questions: null, message: json.message || 'No live questions returned', liveStatus: 'fallback' };
    }
    const questions = order.map(qid => {
      const q = json.data[qid];
      let answers = (q.answers || []).map(a => ({
        id: String(a.aUID),
        text: a.aText || '',
        image: a.aImage || ''
      }));
      if (String(q.shuffle_answers) === '1' && answers.length > 1) {
        answers = [...answers].sort(() => Math.random() - 0.5);
      }
      return {
        qid: String(qid),
        marks: Number(q.marks) || 1,
        type: (q.question && q.question.qType) || 'MULTIPLE-CHOICE',
        text: (q.question && q.question.qText) || '',
        image: (q.question && q.question.qImage) || '',
        answers,
        correctAnswerId: null
      };
    });
    const isAutoSaved = json.isAutoSaved === 'true';
    const autoSavedAnswers = isAutoSaved ? parseAutoSavedSelection(json.userSelection) : {};
    return {
      questions,
      remainingTime: parseRemainingSeconds(json.remainingTime),
      isAutoSaved,
      autoSavedAnswers,
      configuration: json.configuration || {},
      currentServerDatetime: json.currentServerDatetime || '',
      liveStatus: 'live'
    };
  } catch {
    return null;
  }
}

async function startLiveExam(user, examId) {
  if (!user || !user.stuid || user.username === 'DEMO123') return { ok: false, upstream_status: 'simulated' };
  try {
    const startTime = formatIstDateTime();
    const json = await postOnlineExamApi(user, 'updateStudentOnlineExamStartTime', {
      studentId: Number(user.stuid),
      examId: Number(examId),
      startTime,
      source: 'WEB'
    });
    const ok = Boolean(json && (json.success === 'true' || json.success === true || json.status === 'success'));
    return { ok, upstream_status: ok ? 'success' : 'failed', startTime, data: json, error: json && json.message };
  } catch (err) {
    return { ok: false, upstream_status: 'failed', error: err.message };
  }
}

async function submitLiveExam(user, examId, answers, remainingTime = 0, submissionType = 'submit', allQuestionIds = [], questionTypesByQid = {}) {
  if (!user || !user.stuid || user.username === 'DEMO123') return { ok: false, upstream_status: 'simulated' };
  try {
    const perfArr = buildExamPerformanceArray(answers, allQuestionIds, questionTypesByQid);
    const subType = submissionType === 'auto-save' || submissionType === 'Auto-save' ? 'Auto-save' : 'submit';
    const safeRemaining = parseRemainingSeconds(remainingTime);
    const json = await postOnlineExamApi(user, 'submitOnlineExam', {
      studentId: Number(user.stuid),
      examId: Number(examId),
      performance: JSON.stringify(perfArr),
      score: 0,
      remainingTime: safeRemaining !== null ? safeRemaining : 0,
      iid: 987,
      submissionType: subType
    });
    const ok = Boolean(json && (json.success === 'true' || json.success === true || json.status === 'success'));
    return { ok, upstream_status: ok ? 'success' : 'failed', data: json, error: json && json.message };
  } catch (err) {
    return { ok: false, upstream_status: 'failed', error: err.message };
  }
}

/* ------------------------------------------------------------------ */
/* Live Coursework Assignment Engine (portal.vmedulife.com)           */
/* ------------------------------------------------------------------ */
async function postAssignmentsApi(user, apiName, apiInput) {
  let token = await getLearnerAuthToken(user);
  if (!token) return null;

  const payload = Object.assign({}, apiInput, {
    InputUserId: Number(user.stuid),
    InputUserRole: 'learner',
    deviceId: user.deviceId || '7880492072756295',
    apiName,
    moduleName: 'assignment'
  });
  const tokenParam = Buffer.from(JSON.stringify({
    source: 'web',
    uid: Number(user.stuid),
    role: 'learner'
  })).toString('base64');

  const sendReq = async (authTok) => {
    const params = new URLSearchParams();
    params.append(apiName, 'true');
    params.append('data', Buffer.from(JSON.stringify(payload)).toString('base64'));
    params.append('tokenInputParameter', tokenParam);
    const res = await fetch('https://portal.vmedulife.com/api/learner/assignments.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + authTok,
        'Origin': 'https://portal.vmedulife.com',
        'Referer': 'https://portal.vmedulife.com/student/Assignments/AssignmentList.php',
        'User-Agent': 'Mozilla/5.0'
      },
      body: params.toString()
    });
    const text = await res.text();
    return safeJsonParse(text);
  };

  let json = await sendReq(token);
  if (!json || json.message === 'Unauthorized request.' || json.success === 'false' || json.success === false) {
    token = await getLearnerAuthToken(user, true);
    if (token) json = await sendReq(token);
  }
  return json;
}

async function getLiveStudentAssignments(user) {
  if (!user || !user.stuid || !user.sid || !user.groupid || user.username === 'DEMO123') return null;
  try {
    const sidArray = [String(user.sid)];
    const gidArray = [String(user.groupid)];
    const batchIds = Array.isArray(user.batchIds) && user.batchIds.length
      ? user.batchIds.map(String)
      : [String(user.buid || '70134')];

    const [facRes, examRes] = await Promise.all([
      postAssignmentsApi(user, 'getAssignmentAssignedToStudentForWeb', {
        sidString: JSON.stringify(sidArray),
        acayr: Number(user.acayr || 12),
        gidString: JSON.stringify(gidArray),
        stuId: Number(user.stuid),
        batchIdStr: JSON.stringify(batchIds)
      }).catch(() => null),
      postAssignmentsApi(user, 'getAssignmentsBasedOnExam', {
        sidString: JSON.stringify(sidArray),
        acayr: Number(user.acayr || 12),
        gidString: JSON.stringify(gidArray),
        stuId: Number(user.stuid)
      }).catch(() => null)
    ]);

    const mapped = [];
    if (facRes && (facRes.success === true || facRes.success === 'true') && facRes.data) {
      const arr = Array.isArray(facRes.data) ? facRes.data : Object.values(facRes.data);
      arr.forEach(item => mapped.push(mapPortalAssignment(item, 'web')));
    }
    if (examRes && (examRes.success === true || examRes.success === 'true') && examRes.data) {
      const arr = Array.isArray(examRes.data) ? examRes.data : Object.values(examRes.data);
      arr.forEach(item => mapped.push(mapPortalAssignment(item, 'exam')));
    }
    if (!mapped.length && !(facRes && (facRes.success === true || facRes.success === 'true'))) {
      return null;
    }

    return { assignments: mapped };
  } catch {
    return null;
  }
}

async function refreshPortalSessionTokens(user) {
  if (!user || !user.username || !user.password || user.username === 'DEMO123') return false;
  try {
    const params = new URLSearchParams();
    params.append('verifyInstituteUserCredentials', 'true');
    params.append('data', Buffer.from(JSON.stringify({
      username: user.username,
      password: user.password,
      institute_id: 987
    })).toString('base64'));
    const res = await fetch('https://portal.vmedulife.com/api/generic_api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });
    const json = safeJsonParse(await res.text());
    if (json && json.success === 'true' && json.studentData) {
      const td = json.tokenDetails || {};
      const s = json.studentData;
      user.learnerToken = (td.data && td.data.user_token) || user.learnerToken || '';
      user.syncToken = (td.data && td.data.sync_token) || user.syncToken || '';
      user.deviceId = td.deviceId || s.deviceId || user.deviceId || '';
      user.academicYearList = Array.isArray(json.AcademicYearList) ? json.AcademicYearList : (user.academicYearList || []);
      user.groupDetailsArray = Array.isArray(s.groupDetailsArray) ? s.groupDetailsArray : (user.groupDetailsArray || []);
      user.studentAssignedBatches = s.studentAssignedBatches || user.studentAssignedBatches;
      user.electiveBatches = s.electiveBatches || user.electiveBatches;
      user.rawStudentData = s;
      return true;
    }
  } catch {}
  return false;
}

async function submitLiveAssignment(user, assignment, fileName, fileData, remarks = '') {
  if (!user || !user.stuid || user.username === 'DEMO123') return { ok: false, upstream_status: 'simulated' };
  try {
    let token = await getLearnerAuthToken(user);
    if (!token) return { ok: false, upstream_status: 'simulated', error: 'No learner auth token' };

    const mimeMatch = String(fileData || '').match(/^data:([^;]+);base64,/i);
    const fileMime = (mimeMatch && mimeMatch[1]) || inferMimeType(fileName);
    const base64Data = fileData && String(fileData).includes('base64,')
      ? String(fileData).split('base64,')[1]
      : String(fileData || '');
    const fileBuf = base64Data ? Buffer.from(base64Data, 'base64') : Buffer.from(remarks || 'Assignment submission');

    const tokenParam = Buffer.from(JSON.stringify({
      source: 'web',
      uid: Number(user.stuid),
      email: user.email || '',
      role: 'learner'
    })).toString('base64');

    // Exam-based assignments use /api/onlineExam/addStudentAssignment.php
    if (assignment.assignmentType === 'exam' || assignment.pattern === 'exam-api-upload') {
      const acayr = String(user.acayr || '12');
      const subjectId = String(assignment.subject_id || '');
      const assignmentId = String(assignment.uniqueid || assignment.id || '');
      const examId = String(assignment.examId || assignment.subId || '0');
      const studentId = String(user.stuid);
      const deviceId = user.deviceId || '7880492072756295';

      const secureUploadInput = {
        acaYear: acayr,
        subjectId,
        iid: '987',
        studentId,
        assignmentId,
        examId,
        InputUserId: Number(user.stuid),
        InputUserRole: 'learner',
        deviceId,
        apiName: 'onlineExam_addStudentAssignment',
        moduleName: 'assignment'
      };

      const sendExamAss = async (authTok) => {
        const form = new FormData();
        form.append('onlineExam_addStudentAssignment', 'true');
        form.append('acaYear', acayr);
        form.append('subjectId', subjectId);
        form.append('iid', '987');
        form.append('studentId', studentId);
        form.append('assignmentId', assignmentId);
        form.append('examId', examId);
        form.append('remarks', String(remarks || 'Submitted via student portal'));
        form.append('file', new Blob([fileBuf], { type: fileMime }), fileName || 'assignment.pdf');
        form.append('data', Buffer.from(JSON.stringify(secureUploadInput)).toString('base64'));
        form.append('tokenInputParameter', tokenParam);

        const res = await fetch('https://portal.vmedulife.com/api/onlineExam/addStudentAssignment.php', {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + authTok,
            'Origin': 'https://portal.vmedulife.com',
            'Referer': 'https://portal.vmedulife.com/student/Assignments/AssignmentList.php',
            'User-Agent': 'Mozilla/5.0'
          },
          body: form
        });
        return safeJsonParse(await res.text()) || {};
      };

      let json = await sendExamAss(token);
      if (!json || json.message === 'Unauthorized request.') {
        token = await getLearnerAuthToken(user, true);
        if (token) json = await sendExamAss(token);
      }
      const ok = Boolean(json && (json.success === true || json.success === 'true' || json.status === 'success'));
      return { ok, upstream_status: ok ? 'success' : 'failed', data: json, error: json.message };
    }

    // Web coursework assignments (getAssignmentAssignedToStudentForWeb) use UploadAttachmentResponse.php / ExamUploadAssignment.php
    if (!user.syncToken || !user.rawStudentData) {
      await refreshPortalSessionTokens(user);
      token = user.learnerToken || token;
    }

    const paid = String(assignment.id || '');
    const said = String(assignment.subId || '');
    const assSid = String(assignment.sid || user.sid || '');
    const attParam = encodeURIComponent(assignment.subAssignmentAttachmentName || assignment.instructorAttachment || '');
    const stuId = String(user.stuid);
    const basePage = assignment.pattern === 'exam-upload'
      ? 'https://portal.vmedulife.com/student/Assignments/ExamUploadAssignment.php'
      : 'https://portal.vmedulife.com/student/Assignments/UploadAttachmentResponse.php';
    const targetUrl = `${basePage}?paid=${encodeURIComponent(paid)}&said=${encodeURIComponent(said)}&sid=${encodeURIComponent(assSid)}&attachment=${attParam}&stuId=${encodeURIComponent(stuId)}`;

    const sendWebAss = async (authTok) => {
      const form = new FormData();
      form.append('upload-assignment-uid', '');
      form.append('file[]', new Blob([fileBuf], { type: fileMime }), fileName || 'assignment.pdf');
      form.append('upload-assignment-btn', '');

      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Cookie': buildPortalCookieHeader(user, authTok),
          'tokenInputParameter': tokenParam,
          'Origin': 'https://portal.vmedulife.com',
          'Referer': targetUrl,
          'User-Agent': 'Mozilla/5.0'
        },
        body: form
      });
      const text = await res.text();
      return { status: res.status, text, parsed: parsePortalUploadHtml(text) };
    };

    let attempt = await sendWebAss(token);
    if (attempt.parsed.authFailed) {
      await refreshPortalSessionTokens(user);
      token = user.learnerToken || (await getLearnerAuthToken(user, true)) || token;
      attempt = await sendWebAss(token);
    }

    const ok = attempt.status === 200 && attempt.parsed.ok;
    return {
      ok,
      upstream_status: ok ? 'success' : 'failed',
      data: { message: ok ? attempt.parsed.message : attempt.parsed.error },
      error: ok ? undefined : attempt.parsed.error
    };
  } catch (err) {
    return { ok: false, upstream_status: 'failed', error: err.message };
  }
}

module.exports = {
  loadSessionCookie,
  getFacultyAuth,
  fetchGroupTimetable,
  getLiveStudentSessions,
  updateLiveAttendance,
  generateLearnerToken,
  getLearnerAuthToken,
  getLiveStudentExams,
  getLiveExamQuestions,
  startLiveExam,
  submitLiveExam,
  getLiveStudentAssignments,
  submitLiveAssignment
};
