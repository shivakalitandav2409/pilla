/*
 * Cloudflare Worker entry point for Pilla Portal
 * Compatible with Cloudflare Workers (nodejs_compat) + Workers Assets
 */

import crypto from 'node:crypto';
import data from './data.js';
import sessionConfig from './session_cookie.json';

const {
  INSTITUTE,
  USERS,
  EXAMS,
  EXAM_QUESTIONS_125821,
  NOTIFICATIONS,
  ASSIGNMENTS,
  NAVIGATION_MODULES,
  getExamQuestions,
  parseRemainingSeconds,
  formatIstDateTime,
  parseAutoSavedSelection,
  buildExamPerformanceArray,
  parseExamAnswersInput
} = data;

const JWT_SECRET = 'local-demo-secret-not-for-production-pilla';

/* ---------------- JWT Helpers ---------------- */
const b64url = (buf) =>
  Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const b64urlJson = (obj) => b64url(JSON.stringify(obj));

function signJwt(sub, ttlSeconds = 86400) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = { sub, exp };
  const dataStr = `${b64urlJson(header)}.${b64urlJson(payload)}`;
  const sig = b64url(crypto.createHmac('sha256', JWT_SECRET).update(dataStr).digest());
  return `${dataStr}.${sig}`;
}

function verifyJwt(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const dataStr = `${parts[0]}.${parts[1]}`;
    const expected = b64url(crypto.createHmac('sha256', JWT_SECRET).update(dataStr).digest());
    const a = Buffer.from(expected);
    const b = Buffer.from(parts[2]);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
    const payload = JSON.parse(Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString());
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

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

function istDateStr(ms = Date.now()) {
  return new Date(ms + 19800000).toISOString().slice(0, 10);
}

/* ---------------- Live Portal Authentication ---------------- */
async function liveAuthenticate(username, password) {
  try {
    const payload = {
      username: username,
      password: password,
      institute_id: 987
    };

    const formData = new URLSearchParams();
    formData.append('verifyInstituteUserCredentials', 'true');
    formData.append('data', Buffer.from(JSON.stringify(payload)).toString('base64'));

    const res = await fetch('https://portal.vmedulife.com/api/generic_api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    });

    const text = await res.text();
    const json = safeJsonParse(text) || {};

    if (json.success === 'true' && json.studentData) {
      return { ok: true, data: json };
    }
    return { ok: false, detail: json.message || 'Portal authentication failed' };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

/* ---------------- In-Memory State & Session Seeding ---------------- */
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TIME_SLOTS = [
  '09:30 AM - 10:20 AM', '10:20 AM - 11:10 AM', '11:40 AM - 12:30 PM',
  '12:30 PM - 01:20 PM', '02:00 PM - 02:50 PM', '02:50 PM - 03:40 PM',
  '03:40 PM - 04:30 PM'
];

function seedSessionsForUser(user) {
  const sessions = [];
  const captured = user.capturedSessions || [];
  const subjects = user.subjects || [];

  captured.forEach((cs, idx) => {
    sessions.push({
      session_index: idx,
      session_id: cs.session_id,
      subject_id: cs.subject_id,
      date: cs.date,
      subject_name: cs.subject_name,
      subject_display_name: cs.subject_display_name || cs.subject_name,
      faculty_name: cs.faculty_name,
      attendance_status: cs.attendance_status,
      source_status: cs.source_status || cs.attendance_status,
      simulated_status: null,
      time_slot: cs.time_slot,
      updated_at: cs.updated_at || new Date().toISOString()
    });
  });

  const targetTotal = (user.targetMetrics && user.targetMetrics.total_sessions) || 68;
  const targetPresent = (user.targetMetrics && user.targetMetrics.present_count) || 38;
  const currentPresent = sessions.filter(s => s.attendance_status === 'Present').length;
  let neededPresent = targetPresent - currentPresent;
  let remainingSlots = targetTotal - sessions.length;

  const rand = mulberry32((user.sid || 1084) * 1000 + (parseInt(user.stuid) || 580000));
  let curId = 13735000;
  const refDate = new Date('2026-09-11T12:00:00Z');

  const faculties = [...new Set(captured.map(c => c.faculty_name).filter(Boolean))];
  if (faculties.length === 0) faculties.push('Faculty Staff', 'Sarvagya Jain', 'Rahul Gupta', 'Sapna Raikwar', 'Ritu Bhadauria');

  for (let back = 1; sessions.length < targetTotal; back++) {
    const d = new Date(refDate);
    d.setDate(refDate.getDate() - back);
    if (d.getDay() === 0) continue;

    const dayStr = d.toISOString().slice(0, 10);
    const classesToday = 1 + Math.floor(rand() * 3);

    for (let c = 0; c < classesToday && sessions.length < targetTotal; c++) {
      const subj = subjects[Math.floor(rand() * subjects.length)];
      const isPresent = neededPresent > 0 && (remainingSlots <= neededPresent || rand() < (neededPresent / remainingSlots));
      if (isPresent) neededPresent--;
      remainingSlots--;

      const status = isPresent ? 'Present' : 'Absent';
      const slot = TIME_SLOTS[Math.floor(rand() * TIME_SLOTS.length)];
      const faculty = faculties[Math.floor(rand() * faculties.length)];

      sessions.push({
        session_index: sessions.length,
        session_id: curId++,
        subject_id: subj.subject_id,
        date: dayStr,
        subject_name: subj.display_name || subj.subject_name,
        subject_display_name: subj.display_name || subj.subject_name,
        faculty_name: faculty,
        attendance_status: status,
        source_status: status,
        simulated_status: null,
        time_slot: slot,
        updated_at: new Date(d.getTime() + 10 * 3600e3).toISOString()
      });
    }
  }

  sessions.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  sessions.forEach((s, idx) => { s.session_index = idx; });
  return sessions;
}

const DB = {
  users: JSON.parse(JSON.stringify(USERS)),
  sessionsByUser: {},
  examsByUser: {},
  assignmentsByUser: {},
  liveQuestionsByUser: {},
  liveSubmittedAnswersByUser: {},
  exams: JSON.parse(JSON.stringify(EXAMS)),
  examQuestions: JSON.parse(JSON.stringify(EXAM_QUESTIONS_125821)),
  notifications: JSON.parse(JSON.stringify(NOTIFICATIONS)),
  assignments: JSON.parse(JSON.stringify(ASSIGNMENTS)),
  revokedTokens: new Set()
};

function getUserExams(username) {
  if (!DB.examsByUser[username]) {
    DB.examsByUser[username] = JSON.parse(JSON.stringify(EXAMS));
  }
  return DB.examsByUser[username];
}

function getUserAssignments(username) {
  if (!DB.assignmentsByUser[username]) {
    DB.assignmentsByUser[username] = JSON.parse(JSON.stringify(ASSIGNMENTS));
  }
  return DB.assignmentsByUser[username];
}

for (const [username, user] of Object.entries(DB.users)) {
  DB.sessionsByUser[username] = seedSessionsForUser(user);
}

function computeMetrics(sessions) {
  const marked = sessions.filter(s => s.attendance_status === 'Present' || s.attendance_status === 'Absent');
  const total = marked.length;
  const present = marked.filter(s => s.attendance_status === 'Present').length;
  const absent = total - present;

  const bySub = {};
  for (const x of marked) {
    (bySub[x.subject_id] = bySub[x.subject_id] || []).push(x.attendance_status === 'Present');
  }
  const perSub = Object.values(bySub).map(arr => (arr.filter(Boolean).length / arr.length) * 100);
  const avg = perSub.reduce((a, b) => a + b, 0) / (perSub.length || 1);
  const r2 = n => Math.round(n * 100) / 100;

  return {
    present_count: present,
    absent_count: absent,
    total_sessions: total,
    present_pct: r2((present / (total || 1)) * 100),
    absent_pct: r2((absent / (total || 1)) * 100),
    average_pct: r2(avg)
  };
}

function jsonResponse(obj, status = 200, headers = {}) {
  return new Response(typeof obj === 'string' ? obj : JSON.stringify(obj), {
    status,
    headers: Object.assign({
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Api-Key',
      'Access-Control-Allow-Methods': 'GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS',
    }, headers)
  });
}

function authUser(body, url, request) {
  let token = (body && body.dex_token) || url.searchParams.get('dex_token');
  if (!token && request.headers.get('authorization')) {
    const m = request.headers.get('authorization').match(/^Bearer\s+(.+)$/i);
    if (m) token = m[1];
  }
  if (!token || DB.revokedTokens.has(token)) return null;
  const payload = verifyJwt(token);
  if (!payload || !payload.sub) return null;
  return payload.sub;
}

/* ---------------- Live Vmedulife Engine (from 3SAOISTSLg) ---------------- */
let cachedFacultyAuth = null;
async function refreshFacultyAuth() {
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

      cachedFacultyAuth = {
        cookie,
        userToken,
        syncToken,
        deviceId,
        userId: 13178,
        userEmail: 'shipraguptaj@oriental.ac.in',
        inputUserRole: 'instructor',
        tokenInputParameter: tokenData
      };
      return cachedFacultyAuth;
    }
  } catch (err) {}
  return null;
}

function getFacultyAuth() {
  if (cachedFacultyAuth) return cachedFacultyAuth;
  const cookie = (sessionConfig && sessionConfig.cookie) || '';
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

    cachedFacultyAuth = {
      cookie,
      userToken: decodeURIComponent(m_ut[1]),
      syncToken: decodeURIComponent(m_st[1]),
      deviceId,
      userId,
      userEmail,
      inputUserRole: role,
      tokenInputParameter: { source: 'web', uid: userId, email: userEmail, role }
    };
    return cachedFacultyAuth;
  } catch (err) {
    return null;
  }
}

async function fetchGroupTimetable(sid, groupId, acayr, startDate, endDate) {
  let fa = getFacultyAuth();
  if (!fa) fa = await refreshFacultyAuth();
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

    try {
      const json = await res.json();
      return json && json.data ? json.data : null;
    } catch {
      return null;
    }
  };

  let data = await doFetch(fa);
  if (!data) {
    const refreshed = await refreshFacultyAuth();
    if (refreshed) data = await doFetch(refreshed);
  }
  return data;
}

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

    let applies = false;
    if (Array.isArray(s.sessionWiseStudentList) && s.sessionWiseStudentList.length > 0) {
      applies = s.sessionWiseStudentList.some(item => String(item) === sidStr);
    } else {
      const sBatch = Number(s.batchId) || 0;
      if (sBatch === 0) applies = true;
      else if (batchSet.size > 0) applies = batchSet.has(sBatch);
    }

    if (!applies) continue;

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

async function updateLiveAttendance(studentId, sessionId, newStatus, date, sid, groupId, acayr) {
  let fa = getFacultyAuth();
  if (!fa) fa = await refreshFacultyAuth();
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

/* ---------------- Live Online Exam Engine (ported from Test.har) ---------------- */
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
  const tokenParam = Buffer.from(JSON.stringify({ source: 'web', uid: Number(user.stuid), role: 'learner' })).toString('base64');

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
    if (token) json = await sendReq(token);
  }
  return json;
}

function mapPortalExam(e) {
  const isComp = String(e.completionStatus) === '1';
  const marksAllowed = e.viewStudentMarksAllowed || 'off';
  const rawScore = Number(e.obtainedScore);
  const hasVisibleScore = isComp && (marksAllowed === 'on' || rawScore > 0);
  const subTime = e.studentExamSubmissionTime && e.studentExamSubmissionTime !== '0000-00-00 00:00:00'
    ? e.studentExamSubmissionTime
    : undefined;

  return {
    examId: String(e.examId),
    examName: e.examName || 'Examination',
    examSyllabus: e.examSyllabus || 'General',
    completionStatus: isComp ? '1' : '0',
    subjectId: String(e.subjectId || ''),
    subjectName: e.subjectName || 'Subject',
    subjectType: e.subjectType || 'Theory',
    subjectChoice: e.subjectChoice || 'regular',
    subjectFaculties: Array.isArray(e.subjectFaculties) ? e.subjectFaculties : [],
    hasQuestions: true,
    durationMinutes: Number(e.duration) || 30,
    totalQuestions: Number(e.displayQuestionNumber) || 10,
    totalMarks: Number(e.examMarks) || 10,
    startDate: e.examStartDate || '',
    endDate: e.examEndDate || '',
    startTime: e.startTime || '',
    endTime: e.endTime || '',
    viewStudentMarksAllowed: marksAllowed,
    viewStudentPerformanceAllowed: e.viewStudentPerformanceAllowed || 'off',
    allowStartExam: Boolean(e.allowStartExam),
    startExamLink: e.startExamLink || '',
    studentExamStartTime: e.studentExamStartTime || '',
    submittedAtFormatted: e.studentExamSubmissionTimeFormatted || '',
    ...(hasVisibleScore ? { studentScore: rawScore } : {}),
    ...(subTime ? { submittedAt: subTime } : {}),
    source: 'live'
  };
}

async function getLiveStudentExams(user) {
  if (!user || !user.stuid || !user.sid || !user.groupid || user.username === 'DEMO123') return null;
  try {
    const batchIds = Array.isArray(user.batchIds) && user.batchIds.length
      ? user.batchIds.map(String)
      : [String(user.buid || '70134')];

    const allExamsMap = new Map();
    const pendingSet = new Set();
    const completedSet = new Set();
    const limit = 50;

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

    if (Array.isArray(user.electiveGroupIds) && user.electiveGroupIds.length) {
      const elJson = await postOnlineExamApi(user, 'getStudentElectiveSubjectOnlineExams', {
        groupIdArray: user.electiveGroupIds.map(String),
        studentId: Number(user.stuid),
        acayr: Number(user.acayr || 12),
        offset: 0,
        limit: 100,
        examId: 0,
        assignedBatchIds: batchIds
      });
      if (elJson && elJson.success === 'true' && elJson.data && typeof elJson.data === 'object') {
        Object.values(elJson.data).forEach(e => {
          if (!allExamsMap.has(String(e.examId))) {
            allExamsMap.set(String(e.examId), mapPortalExam(e));
          }
        });
        (elJson.pendingExamIds || []).forEach(id => pendingSet.add(String(id)));
        (elJson.completedExamIds || []).forEach(id => completedSet.add(String(id)));
      }
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
    const isAutoSaved = json.isAutoSaved === 'true';
    const autoSavedAnswers = isAutoSaved ? parseAutoSavedSelection(json.userSelection) : {};
    return {
      questions: order.map(qid => {
        const q = json.data[qid];
        let answers = (q.answers || []).map(a => ({ id: String(a.aUID), text: a.aText || '', image: a.aImage || '' }));
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
      }),
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

/* ---------------- Live Coursework Assignment Engine (portal.vmedulife.com) ---------------- */
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

function mapPortalAssignment(item) {
  const perf = item.performanceData;
  const hasPerf = Boolean(perf && perf !== '' && (!(Array.isArray(perf)) || perf.length > 0));
  const needsChange = item.evaluation === 'requestChange';
  const isCompleted = hasPerf && !needsChange;
  const subFile = item.learner_attachment_path
    ? String(item.learner_attachment_path).split('/').pop()
    : (typeof perf === 'string' && perf.includes('.') ? perf.split('/').pop() : null);
  const instFile = item.subAssignmentAttachmentName ||
    (item.instructor_attachment_path ? String(item.instructor_attachment_path).split('/').pop() : null);

  return {
    id: Number(item.parentAssignmentId || item.id || item.subAssignmentId || 0),
    subId: String(item.subAssignmentId || ''),
    title: item.parentAssignmentName || item.subAssignmentTitle || 'Coursework Assignment',
    subAssignmentTitle: item.subAssignmentTitle || item.parentAssignmentName || '',
    subject_id: Number(item.subjectid || 0),
    subject_name: item.subjectName || 'Subject',
    subject_type: item.subjectType || 'Theory',
    due_date: item.endDate || '',
    startDate: item.startDate || '',
    displayStartDate: item.displayStartDate || item.startDate || '',
    displayEndDate: item.displayEndDate || item.endDate || '',
    displayDateMsg: item.displayDateMsg || '',
    toDisplayAssignment: item.toDisplayAssignment !== undefined ? Boolean(item.toDisplayAssignment) : true,
    pattern: item.subAssignmentPattern || 'upload',
    status: isCompleted ? 'Completed' : 'Pending',
    marks: Number(item.marks) || 10,
    obtainedMarks: item.obtainedMarks !== undefined && item.obtainedMarks !== '' && item.obtainedMarks !== null
      ? Number(item.obtainedMarks)
      : null,
    evaluation: item.evaluation || '',
    instructor_review: item.instructor_review || '',
    submitted_on: isCompleted ? (item.submissionDate || item.endDate || '') : null,
    submitted_file: isCompleted ? (subFile || 'Submitted_Assignment.pdf') : null,
    learner_attachment_path: item.learner_attachment_path || '',
    instructorAttachment: instFile || '',
    instructor_attachment_path: item.instructor_attachment_path || '',
    facultyName: item.facultyName || '',
    batchName: item.batchName || '',
    instruction: item.subAssignmentInstruction || '',
    source: 'live'
  };
}

async function getLiveStudentAssignments(user) {
  if (!user || !user.stuid || !user.sid || !user.groupid || user.username === 'DEMO123') return null;
  try {
    const batchStr = Array.isArray(user.batchIds) && user.batchIds.length
      ? user.batchIds.map(String).join(',')
      : String(user.buid || '70134');

    const [facRes, examRes] = await Promise.all([
      postAssignmentsApi(user, 'getAssignmentAssignedToStudentForWeb', {
        sidString: String(user.sid),
        acayr: String(user.acayr || '12'),
        gidString: String(user.groupid),
        stuId: Number(user.stuid),
        batchIdStr: batchStr
      }).catch(() => null),
      postAssignmentsApi(user, 'getAssignmentsBasedOnExam', {
        sidString: String(user.sid),
        acayr: String(user.acayr || '12'),
        gidString: String(user.groupid),
        stuId: Number(user.stuid)
      }).catch(() => null)
    ]);

    const rawItems = [];
    if (facRes && (facRes.success === true || facRes.success === 'true') && facRes.data) {
      const arr = Array.isArray(facRes.data) ? facRes.data : Object.values(facRes.data);
      rawItems.push(...arr);
    }
    if (examRes && (examRes.success === true || examRes.success === 'true') && examRes.data) {
      const arr = Array.isArray(examRes.data) ? examRes.data : Object.values(examRes.data);
      rawItems.push(...arr);
    }
    if (!rawItems.length && !(facRes && (facRes.success === true || facRes.success === 'true'))) {
      return null;
    }
    return { assignments: rawItems.map(mapPortalAssignment) };
  } catch {
    return null;
  }
}

async function submitLiveAssignment(user, assignment, fileName, fileData, remarks = '') {
  if (!user || !user.stuid || user.username === 'DEMO123') return { ok: false, upstream_status: 'simulated' };
  try {
    const token = await getLearnerAuthToken(user);
    if (!token) return { ok: false, upstream_status: 'simulated', error: 'No learner auth token' };

    const mimeMatch = String(fileData || '').match(/^data:([^;]+);base64,/i);
    const fileMime = (mimeMatch && mimeMatch[1]) || inferMimeType(fileName);
    const base64Data = fileData && String(fileData).includes('base64,')
      ? String(fileData).split('base64,')[1]
      : String(fileData || '');
    const fileBuf = base64Data ? Buffer.from(base64Data, 'base64') : Buffer.from(remarks || 'Assignment submission');

    const acayr = String(user.acayr || '12');
    const subjectId = String(assignment.subject_id || '');
    const assignmentId = String(assignment.id || '');
    const examId = String(assignment.subId || assignment.id || '0');
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

    const tokenParam = Buffer.from(JSON.stringify({
      source: 'web',
      uid: Number(user.stuid),
      role: 'learner'
    })).toString('base64');

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
        'Authorization': 'Basic ' + token,
        'Origin': 'https://portal.vmedulife.com',
        'Referer': 'https://portal.vmedulife.com/student/Assignments/AssignmentList.php',
        'User-Agent': 'Mozilla/5.0'
      },
      body: form
    });
    const text = await res.text();
    const json = safeJsonParse(text) || {};
    const ok = Boolean(json && (json.success === true || json.success === 'true' || json.status === 'success'));
    return { ok, upstream_status: ok ? 'success' : 'failed', data: json, error: json.message };
  } catch (err) {
    return { ok: false, upstream_status: 'failed', error: err.message };
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Api-Key',
          'Access-Control-Allow-Methods': 'GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS',
        }
      });
    }

    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/student/')) {
      let body = {};
      const contentType = request.headers.get('content-type') || '';
      try {
        if (contentType.includes('application/json')) {
          body = await request.json();
        } else if (contentType.includes('form') || contentType.includes('multipart')) {
          const formData = await request.formData();
          for (const [k, v] of formData.entries()) {
            body[k] = v;
          }
        }
      } catch (err) {}

      const route = url.pathname;

      // 1. Initialize
      if (route === '/api/initialize' && request.method === 'POST') {
        const { username, password } = body;
        if (!username || !password) {
          return jsonResponse({ detail: 'Username and password required' }, 400);
        }

        let user = null;
        let isAuthenticated = false;

        // 1. Try Live Authentication against portal.vmedulife.com first for fresh live records
        const live = await liveAuthenticate(username, password);
        if (live.ok && live.data) {
          isAuthenticated = true;
          const s = live.data.studentData;
          const td = live.data.tokenDetails || {};
          const group = (s.groupDetailsArray && s.groupDetailsArray[0]) || {};
          const streamName = group.streamname || 'B. Tech';
          const sid = Number(group.streamid) || 1084;
          const groupid = Number(group.gid) || 101182;
          const groupName = group.grpname || '';
          const semMatch = groupName.match(/-(I{1,3}V?|VI{0,3}|[1-8])(?:-|$)/i);
          const semester = semMatch ? `Semester ${semMatch[1].toUpperCase()}` : 'Semester III';
          const yearList = Array.isArray(live.data.AcademicYearList) ? live.data.AcademicYearList : [];
          const acaYearObj = yearList.find(y => String(y.YearId) === String(s.Acayear));
          const admYearObj = yearList.find(y => String(y.YearId) === String(s.admissionYear));
          const batchIds = (s.studentAssignedBatches && Array.isArray(s.studentAssignedBatches.ubid_array) && s.studentAssignedBatches.ubid_array.length)
            ? s.studentAssignedBatches.ubid_array.map(String)
            : (group.buid ? [String(group.buid)] : ['70134']);
          const batchObj = s.studentAssignedBatches && s.studentAssignedBatches.data && s.studentAssignedBatches.data[batchIds[0]];
          const batchName = (batchObj && batchObj.batchname) || group.batch || 'Batch 1';
          const electiveGroupIds = (s.electiveBatches && s.electiveBatches.data && typeof s.electiveBatches.data === 'object')
            ? [...new Set(Object.values(s.electiveBatches.data).map(b => b.groupid).filter(Boolean).map(String))]
            : [];
          const templateUser = USERS[username] || (sid === 1075 ? USERS['STOIST251161'] : USERS['STOIST25963']);
          const matchingSubjects = templateUser ? templateUser.subjects : USERS['STOIST25963'].subjects;

          user = {
            username: username,
            password: password,
            name: `${s.FirstName} ${s.LastName}`.trim(),
            mobile: s.MobileNumber || '',
            email: s.EmailId || '',
            dp_url: s.UserDp || (templateUser && templateUser.dp_url) || '',
            stuid: String(s.stuid || ''),
            prn: s.PRNno || '',
            dob: s.DOB || '',
            streamName: streamName,
            groupName: groupName,
            semester: semester,
            batchName: batchName,
            academicYear: (acaYearObj && acaYearObj.YearText) || '2026-27',
            admissionYear: (admYearObj && admYearObj.YearText) || '',
            points: Number(s.Points) || 0,
            sid: sid,
            groupid: groupid,
            buid: Number(batchIds[0]) || 70134,
            batchIds: batchIds,
            electiveGroupIds: electiveGroupIds,
            acayr: Number(s.Acayear) || 12,
            learnerToken: (td.data && td.data.user_token) || '',
            syncToken: (td.data && td.data.sync_token) || '',
            deviceId: td.deviceId || s.deviceId || '',
            mentor: templateUser ? templateUser.mentor : USERS['STOIST25963'].mentor,
            fees: { totalAmount: 63500, paid: 63500, balance: 0, percentage: 100, status: "Fully Paid" },
            streams: [{ sid, groupid: null, name: streamName }, { sid, groupid, name: null }],
            subjects: matchingSubjects,
            capturedSessions: templateUser ? templateUser.capturedSessions : [],
            targetMetrics: templateUser ? templateUser.targetMetrics : { present_count: 38, absent_count: 30, total_sessions: 68, present_pct: 55.88, absent_pct: 44.12, average_pct: 58.99 }
          };

          DB.users[username] = user;
          if (!DB.sessionsByUser[username]) {
            DB.sessionsByUser[username] = seedSessionsForUser(user);
          }
        } else if (DB.users[username] && DB.users[username].password === password) {
          // 2. Fallback to cached/pre-seeded account
          isAuthenticated = true;
          user = DB.users[username];
        }

        if (isAuthenticated) {
          const ttl = 24 * 3600;
          return jsonResponse({
            dex_token: signJwt(username, ttl),
            expires_at: new Date(Date.now() + ttl * 1000).toISOString(),
            user: username
          });
        }
        return jsonResponse({ detail: 'Portal authentication failed' }, 401);
      }

      // 2. Admin Login
      if (route === '/api/admin/login' && request.method === 'POST') {
        const { username, password } = body;
        if (username === 'admin' && password === 'admin123') {
          return jsonResponse({ admin_token: signJwt('admin', 86400), expires_at: new Date(Date.now() + 86400000).toISOString(), user: 'admin' });
        }
        return jsonResponse({ detail: 'Invalid admin credentials' }, 401);
      }

      // 3. Logout
      if (route === '/api/logout' && request.method === 'POST') {
        const token = (body && body.dex_token) || url.searchParams.get('dex_token');
        if (token) DB.revokedTokens.add(token);
        return jsonResponse({ ok: true, message: 'Session revoked and portal tokens removed' });
      }

      const username = authUser(body, url, request);
      if (!username) {
        if (
          !route.startsWith('/api/get') &&
          !route.startsWith('/api/present') &&
          !route.startsWith('/api/absent') &&
          !route.startsWith('/api/exam/') &&
          !route.startsWith('/api/assignment/') &&
          !route.startsWith('/api/student/')
        ) {
          // direct vmedulife routes
          if (route === '/api/generic_api.php') {
            return jsonResponse({ data: { InstituteId: INSTITUTE.id, InstituteName: INSTITUTE.name, InstituteShortName: INSTITUTE.shortName, Location: INSTITUTE.location, InstituteURL: INSTITUTE.url, InstituteLogo: INSTITUTE.logo }, success: true });
          }
          if (route === '/student/learnerModuleNavigation.json') {
            return jsonResponse(NAVIGATION_MODULES);
          }
        }
        return jsonResponse({ detail: 'Unauthorized' }, 401);
      }

      const user = DB.users[username] || DB.users['DEMO123'];
      const userSessions = DB.sessionsByUser[username] || DB.sessionsByUser['DEMO123'];

      async function ensureLiveSessions(force = false) {
        if (user.username === 'DEMO123') return;
        const stale = !user._liveLoaded || (Date.now() - (user._liveLoadedAt || 0) > 60000);
        if (user.stuid && user.sid && user.groupid && (force || stale)) {
          try {
            const batchInput = (Array.isArray(user.batchIds) && user.batchIds.length)
              ? user.batchIds
              : (user.buid || 70134);
            const liveRes = await getLiveStudentSessions(
              user.stuid,
              user.sid,
              user.groupid,
              batchInput,
              user.acayr || 12,
              '2026-06-01',
              '2026-12-31'
            );
            if (liveRes && liveRes.items && liveRes.items.length) {
              DB.sessionsByUser[username] = liveRes.items;
              user._liveLoaded = true;
              user._liveLoadedAt = Date.now();
              user._liveMetrics = liveRes.metrics;

              const liveSubjs = {};
              liveRes.items.forEach(s => {
                if (!liveSubjs[s.subject_id]) {
                  const disp = s.subject_display_name || s.subject_name;
                  const codeMatch = disp.match(/\(([^)]+)\)\s*\([^)]*\)\s*$/);
                  liveSubjs[s.subject_id] = {
                    subject_id: s.subject_id,
                    subject_name: s.subject_name.replace(/\s*\(\s*(Theory|Practical)\s*\|\s*(Regular|Elective)\s*\)/i, '').trim(),
                    display_name: disp,
                    course_code: codeMatch ? codeMatch[1].trim() : '',
                    subject_type: s.subject_name.includes('Practical') ? 'Practical' : 'Theory',
                    subject_choice: s.subject_name.includes('Elective') ? 'elective' : 'regular'
                  };
                }
              });
              user.subjects = Object.values(liveSubjs);
            }
          } catch (err) {
            // fallback gracefully
          }
        }
      }

      if (route === '/api/getID' && request.method === 'GET') {
        await ensureLiveSessions();
        const currentSessions = DB.sessionsByUser[username] || userSessions;
        const metrics = user._liveMetrics || computeMetrics(currentSessions);
        return jsonResponse({
          name: user.name,
          user: user.username,
          mobile: user.mobile,
          email: user.email,
          dp_url: user.dp_url,
          stuid: user.stuid,
          prn: user.prn || '',
          dob: user.dob || '',
          stream: user.streamName,
          groupName: user.groupName || '',
          semester: user.semester || 'Semester III',
          batchName: user.batchName || '',
          academicYear: user.academicYear || '2026-27',
          admissionYear: user.admissionYear || '',
          points: user.points || 0,
          institute: INSTITUTE,
          mentor: user.mentor,
          fees: user.fees,
          attendance_metrics: metrics
        });
      }

      if (route === '/api/getSession/options' && request.method === 'GET') {
        await ensureLiveSessions();
        return jsonResponse({ streams: user.streams, subjects: user.subjects, acayr: user.acayr });
      }

      if (route === '/api/getSession' && request.method === 'POST') {
        await ensureLiveSessions();
        const currentSessions = DB.sessionsByUser[username] || userSessions;
        const mode = body.mode || 'date';
        let items = currentSessions.slice();
        let subject_id = null;
        let date_from = body.date_from || body.date || '2026-06-01';
        let date_to = body.date_to || body.date || '2026-12-31';

        if (mode === 'subject') {
          subject_id = Number(body.subject_id);
          items = items.filter(x => x.subject_id === subject_id);
          items.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
          if (items.length) { date_from = items[items.length - 1].date; date_to = items[0].date; }
        } else {
          if (!date_from.startsWith('2000')) {
            items = items.filter(x => x.date >= date_from && x.date <= date_to);
          }
          items.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
        }
        return jsonResponse({ count: items.length, mode, subject_id, items: items.map((x, i) => ({ ...x, session_index: i })), date_from, date_to });
      }

      if ((route === '/api/present' || route === '/api/absent') && request.method === 'POST') {
        await ensureLiveSessions();
        const currentSessions = DB.sessionsByUser[username] || userSessions;
        const sid = Number(body.session_id);
        const sess = currentSessions.find(x => x.session_id === sid);
        if (!sess) return jsonResponse({ ok: false, detail: 'Session not found' }, 404);

        const previous = sess.attendance_status;
        const next = route === '/api/present' ? 'Present' : 'Absent';

        let upstreamStatus = 'simulated';
        if (user.username !== 'DEMO123' && user.stuid && user.sid && user.groupid) {
          let up = null;
          try {
            up = await updateLiveAttendance(
              user.stuid,
              sid,
              next,
              sess.date,
              user.sid,
              user.groupid,
              user.acayr || 12
            );
          } catch (err) {
            up = { ok: false, error: err.message };
          }
          if (up && up.ok) {
            upstreamStatus = 'success';
          } else {
            return jsonResponse({
              ok: false,
              detail: (up && up.error) || 'Failed to update attendance on main portal',
              upstream_status: 'failed'
            }, 400);
          }
        }

        sess.attendance_status = next;
        sess.simulated_status = user.username === 'DEMO123' && next !== sess.source_status ? next : null;
        sess.updated_at = new Date().toISOString();

        const metrics = computeMetrics(currentSessions);
        user._liveMetrics = metrics;

        return jsonResponse({
          ok: true, session_index: body.session_index || 0, session_id: sid, subject_name: sess.subject_name, previous_status: previous, new_status: next, upstream_status: upstreamStatus, attendance_metrics: metrics
        });
      }

      if (route === '/api/getAssignments' && request.method === 'POST') {
        let source = 'har';
        if (user.username !== 'DEMO123') {
          try {
            const liveAss = await getLiveStudentAssignments(user);
            if (liveAss && Array.isArray(liveAss.assignments)) {
              DB.assignmentsByUser[username] = liveAss.assignments;
              source = 'live';
            }
          } catch {}
        }

        const items = getUserAssignments(username);
        return jsonResponse({
          count: items.length,
          pending_count: items.filter(a => a.status === 'Pending').length,
          completed_count: items.filter(a => a.status === 'Completed').length,
          source,
          assignments: items
        });
      }

      if ((route === '/api/assignment/submit' || route === '/api/student/assignments/submit') && request.method === 'POST') {
        const aid = Number(body.assignment_id || body.assignmentId);
        const subId = body.sub_id || body.subAssignmentId ? String(body.sub_id || body.subAssignmentId) : '';
        const fileName = body.file_name || body.fileName || 'assignment_submission.pdf';
        const fileData = body.file_data || body.fileData || '';
        const remarks = body.remarks || 'Submitted via portal';

        const userAssignments = getUserAssignments(username);
        const a = (subId && userAssignments.find(x => String(x.id) === String(aid) && String(x.subId || '') === subId))
          || userAssignments.find(x => x.id === aid || String(x.id) === String(body.assignment_id || body.assignmentId));
        if (!a) {
          return jsonResponse({ ok: false, detail: 'Assignment not found' }, 404);
        }

        let upstream_status = 'simulated';
        if (user.username !== 'DEMO123') {
          const up = await submitLiveAssignment(user, a, fileName, fileData, remarks);
          if (up && up.ok) {
            upstream_status = 'success';
            try {
              const liveAss = await getLiveStudentAssignments(user);
              if (liveAss && Array.isArray(liveAss.assignments)) {
                DB.assignmentsByUser[username] = liveAss.assignments;
              }
            } catch {}
          } else {
            const errMsg = (up && up.data && up.data.message) || (up && up.error) || 'Failed to submit assignment on main portal.';
            return jsonResponse({
              ok: false,
              success: false,
              status: 'fail',
              detail: errMsg,
              message: errMsg,
              upstream_status: 'failed'
            }, 400);
          }
        }

        const todayIst = istDateStr();
        const updatedList = getUserAssignments(username);
        const refreshedItem = (subId && updatedList.find(x => String(x.id) === String(aid) && String(x.subId || '') === subId))
          || updatedList.find(x => x.id === aid || String(x.id) === String(aid))
          || a;
        if (user.username === 'DEMO123' || refreshedItem.status !== 'Completed') {
          refreshedItem.status = 'Completed';
          refreshedItem.submitted_on = refreshedItem.submitted_on || todayIst;
          refreshedItem.submitted_file = fileName;
          refreshedItem.remarks = remarks;
        }

        const pending = updatedList.filter(x => x.status === 'Pending').length;
        return jsonResponse({
          ok: true,
          success: true,
          status: 'success',
          upstream_status,
          message: 'Assignment submitted and verified successfully.',
          assignment: refreshedItem,
          assignments: updatedList,
          pending_count: pending,
          completed_count: updatedList.length - pending
        });
      }

      if ((route === '/api/student/assignments') && (request.method === 'GET' || request.method === 'POST')) {
        let source = 'har';
        if (user.username !== 'DEMO123') {
          try {
            const liveAss = await getLiveStudentAssignments(user);
            if (liveAss && Array.isArray(liveAss.assignments)) {
              DB.assignmentsByUser[username] = liveAss.assignments;
              source = 'live';
            }
          } catch {}
        }
        const items = getUserAssignments(username);
        const pending = items.filter(x => x.status === 'Pending').length;
        return jsonResponse({
          success: true,
          source,
          data: items,
          assignments: items,
          pendingCount: pending
        });
      }

      if (route === '/api/getExams' && request.method === 'POST') {
        let source = 'har';
        if (user.username !== 'DEMO123') {
          try {
            const liveEx = await getLiveStudentExams(user);
            if (liveEx && Array.isArray(liveEx.exams) && liveEx.exams.length) {
              const savedAnsMap = DB.liveSubmittedAnswersByUser[username] || {};
              DB.examsByUser[username] = liveEx.exams.map(e => {
                const subAns = savedAnsMap[String(e.examId)];
                return e.completionStatus === '1' && subAns ? { ...e, submittedAnswers: subAns } : e;
              });
              source = 'live';
            }
          } catch {}
        }

        const items = getUserExams(username);
        return jsonResponse({
          count: items.length,
          pending_count: items.filter(e => e.completionStatus === '0').length,
          completed_count: items.filter(e => e.completionStatus === '1').length,
          source,
          exams: items
        });
      }

      if (route === '/api/exam/questions') {
        const examId = String(body.exam_id || body.examId || url.searchParams.get('exam_id') || '125821');
        const mode = String(body.mode || url.searchParams.get('mode') || 'take');
        const userExams = getUserExams(username);
        const exam = userExams.find(e => String(e.examId) === examId);
        const fallbackQuestions = (typeof getExamQuestions === 'function')
          ? getExamQuestions(examId, exam?.subjectName)
          : DB.examQuestions;

        let questions = user.username === 'DEMO123' ? fallbackQuestions : [];
        let source = user.username === 'DEMO123' ? 'har' : 'unavailable';
        let liveMessage = '';
        let remainingTime = (exam && exam.durationMinutes ? exam.durationMinutes : 30) * 60;
        let isAutoSaved = false;
        let autoSavedAnswers = {};

        if (user.username !== 'DEMO123') {
          const liveCached = DB.liveQuestionsByUser[username] && DB.liveQuestionsByUser[username][examId];
          if (mode === 'review' && exam?.completionStatus === '1' && Array.isArray(liveCached) && liveCached.length) {
            questions = liveCached;
            source = 'live-cache';
          } else {
            try {
              const liveQ = await getLiveExamQuestions(user, examId);
              if (liveQ && Array.isArray(liveQ.questions) && liveQ.questions.length) {
                const keyMap = new Map(fallbackQuestions.map(fq => [String(fq.qid), fq.correctAnswerId]));
                questions = liveQ.questions.map(q => ({
                  ...q,
                  correctAnswerId: keyMap.get(String(q.qid)) || q.correctAnswerId || null
                }));
                DB.liveQuestionsByUser[username] = DB.liveQuestionsByUser[username] || {};
                DB.liveQuestionsByUser[username][examId] = questions;
                if (liveQ.remainingTime !== null && liveQ.remainingTime !== undefined) {
                  remainingTime = liveQ.remainingTime;
                }
                isAutoSaved = Boolean(liveQ.isAutoSaved);
                autoSavedAnswers = liveQ.autoSavedAnswers || {};
                source = 'live';
              } else {
                liveMessage = (liveQ && liveQ.message) || (mode === 'review' && exam?.completionStatus === '1'
                  ? 'Submitted on live portal. Question solutions are only available if attempted in this session or allowed by portal.'
                  : 'Unable to fetch live examination questions from portal.');
                source = mode === 'review' && exam?.completionStatus === '1' ? 'completed' : 'unavailable';
              }
            } catch {
              liveMessage = 'Failed to reach portal.vmedulife.com for exam questions.';
              source = mode === 'review' && exam?.completionStatus === '1' ? 'completed' : 'unavailable';
            }
          }
        }

        return jsonResponse({
          examId,
          examName: exam ? exam.examName : 'Unit Examination',
          examSyllabus: exam ? exam.examSyllabus : 'Course Syllabus',
          subjectName: exam ? exam.subjectName : 'DATA STRUCTURE',
          durationMinutes: exam && exam.durationMinutes ? exam.durationMinutes : 30,
          remainingTime,
          isAutoSaved,
          autoSavedAnswers,
          allowStartExam: Boolean(exam && exam.allowStartExam),
          studentExamStartTime: exam ? exam.studentExamStartTime || '' : '',
          totalQuestions: questions.length,
          source,
          liveMessage,
          questions: questions.map(q => ({
            qid: q.qid,
            marks: q.marks,
            type: q.type,
            text: q.text,
            image: q.image || '',
            answers: q.answers,
            correctAnswerId: q.correctAnswerId
          }))
        });
      }

      if (route === '/api/exam/start' && request.method === 'POST') {
        const examId = String(body.exam_id || body.examId || '');
        let upstream_status = 'simulated';
        if (user.username !== 'DEMO123') {
          const up = await startLiveExam(user, examId);
          if (up && up.ok) {
            upstream_status = 'success';
            const userExams = getUserExams(username);
            const exam = userExams.find(e => String(e.examId) === examId);
            if (exam && (!exam.studentExamStartTime || exam.studentExamStartTime === '0000-00-00 00:00:00')) {
              exam.studentExamStartTime = up.startTime || formatIstDateTime();
            }
          } else {
            const errMsg = (up && up.data && up.data.message) || (up && up.error) || 'Main portal refused to start exam.';
            return jsonResponse({
              ok: false,
              success: 'false',
              status: 'fail',
              detail: errMsg,
              message: errMsg,
              upstream_status: 'failed'
            }, 400);
          }
        }
        return jsonResponse({
          ok: true,
          data: [],
          success: 'true',
          status: 'success',
          upstream_status,
          message: 'Start time updated successfully.'
        });
      }

      if (route === '/api/exam/submit' && request.method === 'POST') {
        const examId = String(body.exam_id || body.examId || '125821');
        const submissionType = body.submission_type || 'submit';
        const parsedRem = parseRemainingSeconds(body.remainingTime);
        const remainingTime = parsedRem !== null ? parsedRem : 0;

        const answers = parseExamAnswersInput(body);
        const userExams = getUserExams(username);
        const exam = userExams.find(e => String(e.examId) === examId);
        const liveCached = DB.liveQuestionsByUser[username] && DB.liveQuestionsByUser[username][examId];
        const questions = liveCached || (user.username === 'DEMO123'
          ? (typeof getExamQuestions === 'function' ? getExamQuestions(examId, exam?.subjectName) : DB.examQuestions)
          : []);

        const clientQids = Array.isArray(body.question_ids) ? body.question_ids.map(String) : [];
        const allQuestionIds = questions.length ? questions.map(q => String(q.qid)) : clientQids;
        const questionTypesByQid = Object.assign({}, body.question_types || {});
        questions.forEach(q => { questionTypesByQid[String(q.qid)] = q.type; });

        const hasMatchingQids = Object.keys(answers).length === 0 || questions.some(q => Object.prototype.hasOwnProperty.call(answers, q.qid));
        const hasAnswerKey = hasMatchingQids && questions.length > 0 && questions.every(q => Boolean(q.correctAnswerId));
        let score = 0;
        let totalMarks = 0;
        const questionResults = [];
        const normAns = (val) => String(val ?? '').split(',').map(s => s.trim()).filter(Boolean).sort().join(',');
        questions.forEach((q, idx) => {
          const qMarks = Number(q.marks) || 1;
          totalMarks += qMarks;
          const selected = answers[q.qid];
          const isCorrect = Boolean(q.correctAnswerId) && selected !== undefined && selected !== null && (
            String(q.correctAnswerId).includes(',')
              ? normAns(selected) === normAns(q.correctAnswerId)
              : String(selected).trim() === String(q.correctAnswerId).trim()
          );
          if (isCorrect) score += qMarks;
          questionResults.push({
            qIndex: idx + 1,
            qid: q.qid,
            qText: q.text,
            marks: qMarks,
            selectedAnswerId: selected || null,
            correctAnswerId: q.correctAnswerId || null,
            isCorrect: q.correctAnswerId ? isCorrect : null,
            marksAwarded: isCorrect ? qMarks : 0
          });
        });

        let upstream_status = 'simulated';
        if (user.username !== 'DEMO123') {
          const up = await submitLiveExam(user, examId, answers, remainingTime, submissionType, allQuestionIds, questionTypesByQid);
          if (up && up.ok) {
            upstream_status = 'success';
            if (submissionType !== 'auto-save') {
              DB.liveSubmittedAnswersByUser[username] = DB.liveSubmittedAnswersByUser[username] || {};
              DB.liveSubmittedAnswersByUser[username][examId] = answers;
              try {
                const refreshed = await getLiveStudentExams(user);
                if (refreshed && Array.isArray(refreshed.exams) && refreshed.exams.length) {
                  const savedAnsMap = DB.liveSubmittedAnswersByUser[username] || {};
                  DB.examsByUser[username] = refreshed.exams.map(e => {
                    const subAns = savedAnsMap[String(e.examId)];
                    return e.completionStatus === '1' && subAns ? { ...e, submittedAnswers: subAns } : e;
                  });
                }
              } catch {}
            }
          } else {
            const isAutoSave = submissionType === 'auto-save' || submissionType === 'Auto-save';
            const errMsg = (up && up.data && up.data.message) || (up && up.error) || (isAutoSave
              ? 'Main portal rejected auto-save checkpoint.'
              : 'Exam submission rejected by main portal (validity expired or blocked by faculty).');
            return jsonResponse({
              ok: false,
              success: false,
              status: 'fail',
              submissionType,
              detail: errMsg,
              message: errMsg,
              upstream_status: 'failed'
            }, 400);
          }
        }

        if (submissionType === 'submit' && exam) {
          exam.completionStatus = '1';
          exam._localSubmitted = true;
          if (hasAnswerKey) {
            exam.studentScore = score;
            exam.submittedTotalMarks = totalMarks;
          }
          exam.submittedAnswers = answers;
          exam.submittedAt = new Date().toISOString();
        }

        return jsonResponse({
          ok: true,
          success: true,
          status: 'success',
          message: submissionType === 'submit' ? 'Exam submitted successfully.' : 'Exam progress saved.',
          submissionType,
          upstream_status,
          hasAnswerKey,
          score: hasAnswerKey ? score : null,
          totalMarks,
          percentage: hasAnswerKey && totalMarks > 0 ? Math.round((score / totalMarks) * 100) : null,
          questionResults
        });
      }

      if (route === '/api/getNotifications') {
        return jsonResponse({ totalCount: DB.notifications.length, unReadMessageCount: DB.notifications.filter(n => !n.isRead).length, notifications: DB.notifications });
      }

      // Online Exam API contract from Test.har (scoped to authenticated user)
      if (route === '/api/instructor/onlineExam.php') {
        const isGetList = body.getStudentGroupAndBatchwiseOnlineExams || body.getGroupwiseStudentAssignedOnlineExams;
        const isQuestions = body.getStudentAssignedOnlineExamQuestionList;
        const isStart = body.updateStudentOnlineExamStartTime;
        const isSubmit = body.submitOnlineExam;
        const userExams = getUserExams(username);

        if (isQuestions || (body.examId && !isStart && !isSubmit && !isGetList)) {
          const examId = String(body.examId || (body.data && body.data.examId) || '125821');
          const exam = userExams.find(e => String(e.examId) === examId);
          const questions = (DB.liveQuestionsByUser[username] && DB.liveQuestionsByUser[username][examId])
            || (user.username === 'DEMO123' && typeof getExamQuestions === 'function' ? getExamQuestions(examId, exam?.subjectName) : []);

          const dataObj = {};
          questions.forEach(q => {
            dataObj[q.qid] = {
              marks: String(q.marks),
              shuffle_answers: '0',
              question: {
                qType: q.type,
                qText: q.text,
                qImage: q.image || '',
                questionCustomType: '',
                qImageHeight: '',
                qImageWidth: ''
              },
              answers: (q.answers || []).map(a => ({
                aUID: a.id,
                aText: a.text,
                aImage: a.image || '',
                answerImageHeight: '',
                answerImageWidth: ''
              }))
            };
          });
          return jsonResponse({
            data: dataObj,
            isAutoSaved: 'false',
            shuffleQid: '0',
            currentServerDatetime: new Date().toISOString(),
            success: questions.length ? 'true' : 'false',
            configurationFlag: '1',
            configuration: { duration: exam?.durationMinutes || 30, negative_marks: 0 },
            status: questions.length ? 'success' : 'fail',
            remainingTime: (exam?.durationMinutes || 30) * 60
          });
        }

        if (isStart) {
          return jsonResponse({ data: [], success: 'true', status: 'success', message: 'Start time updated successfully.' });
        }

        if (isSubmit) {
          const examId = String(body.examId || (body.data && body.data.examId) || '125821');
          const exam = userExams.find(e => String(e.examId) === examId);
          if (exam) exam.completionStatus = '1';
          return jsonResponse({ success: 'true', status: 'success', message: 'Exam submitted successfully.' });
        }

        const examsObj = {};
        userExams.forEach(e => { examsObj[e.examId] = e; });
        return jsonResponse({ data: examsObj, success: 'true', totalCount: userExams.length });
      }

      if (route === '/api/webNotification/webNotification.php') {
        return jsonResponse({ status: 'success', unReadMessageCount: 0, data: DB.notifications });
      }

      if (route === '/api/studentSummary/studentSummary.php') {
        return jsonResponse({ success: 'true', data: [] });
      }

      if (route === '/api/mentoring/mentoring.php') {
        return jsonResponse({ success: 'true', data: { mentorName: 'Prof. Shikha Shrivastava' } });
      }

      if (route === '/api/lms/lms.php') {
        return jsonResponse({ success: 'true', data: [] });
      }

      if (route === '/api/notice/notice.php') {
        return jsonResponse({ success: 'true', notices: [] });
      }

      if (route === '/api/event/postEvent.php') {
        return jsonResponse({ success: 'true', events: [] });
      }

      return jsonResponse({ detail: 'Not found' }, 404);
    }

    // Static Assets via Cloudflare Workers Assets
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Pilla Worker is running.', { status: 200 });
  }
};
