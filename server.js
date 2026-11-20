/*
 * Pilla — Attendance Portal (Full HAR & Live Portal Integration)
 * -------------------------------------------------------------
 * Reconstructed from:
 * 1. vm.zvx.workers.dev.har (Main Worker API proxy & session router)
 * 2. Test.har (portal.vmedulife.com complete session capture)
 *
 * Supports:
 * - Pre-seeded offline HAR accounts (Shivang Saxena, Ayush Katare, Demo Student)
 * - LIVE Portal Authentication: If any other student credentials are provided,
 *   it dynamically verifies them with portal.vmedulife.com, extracts their real
 *   profile (Name, DP, ID, Email, Mobile, Stream, Batches) and provisions their portal.
 *
 * Zero external dependencies. Uses Node.js standard libraries only.
 */

'use strict';

const http = require('http');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const vmeduLive = require('./vmedu_live.js');
const {
  INSTITUTE,
  USERS,
  EXAMS,
  EXAM_QUESTIONS_125821,
  NOTIFICATIONS,
  ASSIGNMENTS,
  NAVIGATION_MODULES
} = require('./data.js');

const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'local-demo-secret-not-for-production-pilla';
const PUBLIC_DIR = path.join(__dirname, 'public');
const PUBLIC_CLASSIC_DIR = path.join(__dirname, 'public-classic');

/* ------------------------------------------------------------------ */
/* Minimal HS256 JWT (dependency-free)                                 */
/* ------------------------------------------------------------------ */
const b64url = (buf) =>
  Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const b64urlJson = (obj) => b64url(JSON.stringify(obj));

function signJwt(sub, ttlSeconds = 86400) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = { sub, exp };
  const data = `${b64urlJson(header)}.${b64urlJson(payload)}`;
  const sig = b64url(crypto.createHmac('sha256', JWT_SECRET).update(data).digest());
  return `${data}.${sig}`;
}

function verifyJwt(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const data = `${parts[0]}.${parts[1]}`;
    const expected = b64url(crypto.createHmac('sha256', JWT_SECRET).update(data).digest());
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

/* ------------------------------------------------------------------ */
/* Live Portal Authentication (portal.vmedulife.com)                  */
/* ------------------------------------------------------------------ */
async function liveAuthenticate(username, password) {
  try {
    const payload = {
      username: username,
      password: password,
      institute_id: 987 // Oriental Institute of Science & Technology, Bhopal
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
    const json = JSON.parse(text.trim());

    if (json.success === 'true' && json.studentData) {
      return { ok: true, data: json };
    }
    return { ok: false, detail: json.message || 'Portal authentication failed' };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

/* ------------------------------------------------------------------ */
/* In-Memory State & Session Seeding                                  */
/* ------------------------------------------------------------------ */
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

  // 1. Add all captured sessions from HAR
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
    if (d.getDay() === 0) continue; // Skip Sunday

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

// In-Memory Database State
const DB = {
  users: JSON.parse(JSON.stringify(USERS)),
  sessionsByUser: {},
  exams: JSON.parse(JSON.stringify(EXAMS)),
  examQuestions: JSON.parse(JSON.stringify(EXAM_QUESTIONS_125821)),
  notifications: JSON.parse(JSON.stringify(NOTIFICATIONS)),
  assignments: JSON.parse(JSON.stringify(ASSIGNMENTS)),
  revokedTokens: new Set()
};

// Seed sessions for pre-configured users
for (const [username, user] of Object.entries(DB.users)) {
  DB.sessionsByUser[username] = seedSessionsForUser(user);
}

function computeMetrics(sessions) {
  const total = sessions.length;
  const present = sessions.filter(s => s.attendance_status === 'Present').length;
  const absent = total - present;

  const bySub = {};
  for (const x of sessions) {
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

/* ------------------------------------------------------------------ */
/* Body and Request Parsing                                           */
/* ------------------------------------------------------------------ */
function readBody(req) {
  return new Promise(resolve => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', () => resolve(Buffer.alloc(0)));
  });
}

function parseBody(buf, contentType = '') {
  const text = buf.toString('utf8');
  if (!text) return {};
  if (contentType.includes('application/json')) {
    try { return JSON.parse(text); } catch { return {}; }
  }
  if (contentType.includes('multipart/form-data')) {
    const out = {};
    const m = contentType.match(/boundary=(.+)$/);
    if (m) {
      const boundary = m[1].trim();
      const parts = text.split('--' + boundary);
      for (const p of parts) {
        const nm = p.match(/name="([^"]+)"\r?\n\r?\n([\s\S]*?)\r?\n?$/);
        if (nm) {
          out[nm[1]] = nm[2].replace(/\r?\n--$/, '').trim();
        }
      }
    }
    return out;
  }
  try { return JSON.parse(text); } catch { /* fall through */ }
  const out = {};
  for (const pair of text.split('&')) {
    const [k, v = ''] = pair.split('=');
    if (k) out[decodeURIComponent(k)] = decodeURIComponent(v.replace(/\+/g, ' '));
  }
  return out;
}

function send(res, status, obj, headers = {}) {
  const body = typeof obj === 'string' ? obj : JSON.stringify(obj);
  res.writeHead(status, Object.assign({
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Api-Key',
    'Access-Control-Allow-Methods': 'GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS',
  }, headers));
  res.end(body);
}

function authUser(body, url, req) {
  let token = (body && body.dex_token) || url.searchParams.get('dex_token');
  if (!token && req.headers['authorization']) {
    const m = req.headers['authorization'].match(/^Bearer\s+(.+)$/i);
    if (m) token = m[1];
  }
  if (!token || DB.revokedTokens.has(token)) return null;
  const payload = verifyJwt(token);
  if (!payload || !payload.sub) return null;
  return payload.sub;
}

/* ------------------------------------------------------------------ */
/* API Handler                                                        */
/* ------------------------------------------------------------------ */
async function handleApi(req, res, url) {
  const buf = await readBody(req);
  const body = parseBody(buf, req.headers['content-type'] || '');
  const route = url.pathname;

  /* ================================================================ */
  /* Main Worker APIs (vm.zvx.workers.dev)                             */
  /* ================================================================ */

  // 1. Initialize / Login (Pre-seeded + Live Portal Lookup)
  if (route === '/api/initialize' && req.method === 'POST') {
    const { username, password } = body;
    if (!username || !password) {
      return send(res, 400, { detail: 'Username and password required' });
    }

    let user = null;
    let isAuthenticated = false;

    // A. Live verification with portal.vmedulife.com first for fresh records
    const live = await liveAuthenticate(username, password);
    if (live.ok && live.data) {
      isAuthenticated = true;
      const s = live.data.studentData;
      const group = (s.groupDetailsArray && s.groupDetailsArray[0]) || {};
      const streamName = group.streamname || 'B. Tech';
      const sid = Number(group.streamid) || 1084;
      const groupid = Number(group.gid) || 101182;
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
        streamName: streamName,
        sid: sid,
        groupid: groupid,
        acayr: Number(s.Acayear) || 12,
        mentor: templateUser ? templateUser.mentor : USERS['STOIST25963'].mentor,
        fees: {
          totalAmount: 63500,
          paid: 63500,
          balance: 0,
          percentage: 100,
          status: "Fully Paid"
        },
        streams: [
          { sid: sid, groupid: null, name: streamName },
          { sid: sid, groupid: groupid, name: null }
        ],
        subjects: matchingSubjects,
        capturedSessions: templateUser ? templateUser.capturedSessions : [],
        targetMetrics: templateUser ? templateUser.targetMetrics : {
          present_count: 38,
          absent_count: 30,
          total_sessions: 68,
          present_pct: 55.88,
          absent_pct: 44.12,
          average_pct: 58.99
        }
      };

      DB.users[username] = user;
      if (!DB.sessionsByUser[username]) {
        DB.sessionsByUser[username] = seedSessionsForUser(user);
      }
    } else if (DB.users[username] && DB.users[username].password === password) {
      // B. Fallback to cached/pre-seeded user if offline
      isAuthenticated = true;
      user = DB.users[username];
    }

    if (isAuthenticated) {
      const ttl = 24 * 3600;
      const token = signJwt(username, ttl);
      return send(res, 200, {
        dex_token: token,
        expires_at: new Date(Date.now() + ttl * 1000).toISOString(),
        user: username
      });
    }

    // Return exact status code & error message from HAR
    return send(res, 401, { detail: 'Portal authentication failed' });
  }

  // 2. Admin Login
  if (route === '/api/admin/login' && req.method === 'POST') {
    const { username, password } = body;
    if (username === 'admin' && password === 'admin123') {
      const ttl = 24 * 3600;
      return send(res, 200, {
        admin_token: signJwt('admin', ttl),
        expires_at: new Date(Date.now() + ttl * 1000).toISOString(),
        user: 'admin'
      });
    }
    return send(res, 401, { detail: 'Invalid admin credentials' });
  }

  // 3. Logout
  if (route === '/api/logout' && req.method === 'POST') {
    const token = (body && body.dex_token) || url.searchParams.get('dex_token');
    if (token) DB.revokedTokens.add(token);
    return send(res, 200, { ok: true, message: 'Session revoked and portal tokens removed' });
  }

  // Protected endpoints check
  const username = authUser(body, url, req);
  if (!username) {
    if (!route.startsWith('/api/get') && !route.startsWith('/api/present') && !route.startsWith('/api/absent')) {
      return handleVmedulifeApi(req, res, url, body);
    }
    return send(res, 401, { detail: 'Unauthorized' });
  }

  const user = DB.users[username] || DB.users['DEMO123'];
  const userSessions = DB.sessionsByUser[username] || DB.sessionsByUser['DEMO123'];

  // Helper: ensure live student sessions are loaded
  async function ensureLiveSessions() {
    if (vmeduLive && user.stuid && user.sid && user.groupid && !user._liveLoaded) {
      try {
        const liveRes = await vmeduLive.getLiveStudentSessions(
          user.stuid,
          user.sid,
          user.groupid,
          user.buid || 70134,
          user.acayr || 12,
          '2026-06-01',
          '2026-12-31'
        );
        if (liveRes && liveRes.items && liveRes.items.length) {
          DB.sessionsByUser[username] = liveRes.items;
          user._liveLoaded = true;
          user._liveMetrics = liveRes.metrics;

          // dynamically populate subjects from real class sessions
          const liveSubjs = {};
          liveRes.items.forEach(s => {
            if (!liveSubjs[s.subject_id]) {
              liveSubjs[s.subject_id] = {
                subject_id: s.subject_id,
                subject_name: s.subject_name.replace(/\s*\(\s*(Theory|Practical)\s*\|\s*Regular\s*\)/i, '').trim(),
                course_code: '',
                subject_type: s.subject_name.includes('Practical') ? 'Practical' : 'Theory',
                subject_choice: 'regular'
              };
            }
          });
          user.subjects = Object.values(liveSubjs);
        }
      } catch (err) {
        console.warn('[Live Sync] Failed to fetch live sessions:', err.message);
      }
    }
  }

  // 4. Get ID & Profile
  if (route === '/api/getID' && req.method === 'GET') {
    await ensureLiveSessions();
    const currentSessions = DB.sessionsByUser[username] || userSessions;
    const metrics = user._liveMetrics || computeMetrics(currentSessions);
    return send(res, 200, {
      name: user.name,
      user: user.username,
      mobile: user.mobile,
      email: user.email,
      dp_url: user.dp_url,
      stuid: user.stuid,
      stream: user.streamName,
      institute: INSTITUTE,
      mentor: user.mentor,
      fees: user.fees,
      attendance_metrics: metrics
    });
  }

  // 5. Get Session Options (streams + subjects)
  if (route === '/api/getSession/options' && req.method === 'GET') {
    await ensureLiveSessions();
    return send(res, 200, {
      streams: user.streams,
      subjects: user.subjects,
      acayr: user.acayr
    });
  }

  // 6. Get Sessions (by date range or subject)
  if (route === '/api/getSession' && req.method === 'POST') {
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
      if (items.length) {
        date_from = items[items.length - 1].date;
        date_to = items[0].date;
      }
    } else {
      if (!date_from.startsWith('2000')) {
        items = items.filter(x => x.date >= date_from && x.date <= date_to);
      }
    }

    items.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
    items = items.map((x, i) => ({ ...x, session_index: i }));
    return send(res, 200, {
      count: items.length,
      mode,
      subject_id,
      items,
      date_from,
      date_to
    });
  }

  // 7. Mark Present / Absent (Real College Upstream Modification)
  if ((route === '/api/present' || route === '/api/absent') && req.method === 'POST') {
    const currentSessions = DB.sessionsByUser[username] || userSessions;
    const sid = Number(body.session_id);
    const sess = currentSessions.find(x => x.session_id === sid);
    if (!sess) return send(res, 404, { ok: false, detail: 'Session not found' });

    const previous = sess.attendance_status;
    const next = route === '/api/present' ? 'Present' : 'Absent';

    // Live Upstream Call to portal.vmedulife.com
    let upstreamStatus = 'simulated';
    if (vmeduLive && user.stuid && user.sid && user.groupid) {
      try {
        const up = await vmeduLive.updateLiveAttendance(
          user.stuid,
          sid,
          next,
          sess.date,
          user.sid,
          user.groupid,
          user.acayr || 12
        );
        if (up && up.ok) {
          upstreamStatus = 'success';
        }
      } catch (err) {
        console.warn('[Live Upstream] Attendance update error:', err.message);
      }
    }

    sess.attendance_status = next;
    sess.simulated_status = next === sess.source_status ? null : next;
    sess.updated_at = new Date().toISOString();

    const metrics = computeMetrics(currentSessions);
    user._liveMetrics = metrics;

    return send(res, 200, {
      ok: true,
      session_index: body.session_index || 0,
      session_id: sid,
      subject_name: sess.subject_name,
      previous_status: previous,
      new_status: next,
      upstream_status: upstreamStatus,
      attendance_metrics: metrics
    });
  }

  // 8. Get Assignments (from Coursework capture)
  if (route === '/api/getAssignments' && req.method === 'POST') {
    const items = DB.assignments;
    const completed = items.filter(a => a.status === 'Completed').length;
    const pending = items.length - completed;
    return send(res, 200, {
      count: items.length,
      pending_count: pending,
      completed_count: completed,
      assignments: items
    });
  }

  // 9. Get Exams (from Test.har capture)
  if (route === '/api/getExams' && req.method === 'POST') {
    const items = DB.exams;
    const completed = items.filter(e => e.completionStatus === '1').length;
    const pending = items.length - completed;
    return send(res, 200, {
      count: items.length,
      pending_count: pending,
      completed_count: completed,
      exams: items
    });
  }

  // 10. Get Exam Questions
  if (route === '/api/exam/questions' && (req.method === 'POST' || req.method === 'GET')) {
    const examId = body.exam_id || url.searchParams.get('exam_id') || '125821';
    return send(res, 200, {
      examId,
      examName: 'unit 2',
      examSyllabus: 'stack And Queue',
      subjectName: 'DATA STRUCTURE',
      durationMinutes: 30,
      totalQuestions: DB.examQuestions.length,
      questions: DB.examQuestions.map(q => ({
        qid: q.qid,
        marks: q.marks,
        type: q.type,
        text: q.text,
        answers: q.answers
      }))
    });
  }

  // 11. Submit / Auto-save Exam
  if (route === '/api/exam/submit' && req.method === 'POST') {
    const examId = body.exam_id || '125821';
    const submissionType = body.submission_type || 'submit';
    const answers = body.answers || {};

    let score = 0;
    const questionResults = [];
    DB.examQuestions.forEach(q => {
      const selected = answers[q.qid];
      const isCorrect = selected === q.correctAnswerId;
      if (isCorrect) score += q.marks;
      questionResults.push({
        qid: q.qid,
        selectedAnswerId: selected,
        correctAnswerId: q.correctAnswerId,
        isCorrect
      });
    });

    if (submissionType === 'submit') {
      const exam = DB.exams.find(e => e.examId === examId);
      if (exam) exam.completionStatus = '1';
    }

    return send(res, 200, {
      success: true,
      status: 'success',
      message: submissionType === 'submit' ? 'Exam submitted successfully.' : 'Exam progress saved.',
      submissionType,
      score,
      totalMarks: DB.examQuestions.length,
      percentage: Math.round((score / DB.examQuestions.length) * 100),
      questionResults
    });
  }

  // 12. Get Notifications
  if (route === '/api/getNotifications' && (req.method === 'GET' || req.method === 'POST')) {
    const items = DB.notifications;
    const unread = items.filter(n => !n.isRead).length;
    return send(res, 200, {
      totalCount: items.length,
      unReadMessageCount: unread,
      notifications: items
    });
  }

  // Fallback to direct vmedulife endpoints if applicable
  return handleVmedulifeApi(req, res, url, body);
}

/* ------------------------------------------------------------------ */
/* Direct vmedulife Portal Compatibility Handlers                     */
/* ------------------------------------------------------------------ */
function handleVmedulifeApi(req, res, url, body) {
  const route = url.pathname;

  // Institute Data
  if (route === '/api/generic_api.php') {
    return send(res, 200, {
      data: {
        InstituteId: INSTITUTE.id,
        InstituteName: INSTITUTE.name,
        InstituteShortName: INSTITUTE.shortName,
        Location: INSTITUTE.location,
        InstituteURL: INSTITUTE.url,
        InstituteLogo: INSTITUTE.logo,
        InstituteSecondaryLogo: INSTITUTE.secondaryLogo,
        InstituteBannerImage: INSTITUTE.bannerImage
      },
      success: true
    });
  }

  // Online Exams (vmedulife format)
  if (route === '/api/instructor/onlineExam.php') {
    if (body.getStudentAssignedOnlineExamQuestionList || body.examId === '125821') {
      const dataObj = {};
      DB.examQuestions.forEach(q => {
        dataObj[q.qid] = {
          marks: String(q.marks),
          shuffle_answers: '0',
          question: {
            qType: q.type,
            qText: q.text,
            qImage: '',
            questionCustomType: '',
            qImageHeight: '',
            qImageWidth: ''
          },
          answers: q.answers.map(a => ({
            aUID: a.id,
            aText: a.text,
            aImage: '',
            answerImageHeight: '',
            answerImageWidth: ''
          }))
        };
      });
      return send(res, 200, {
        data: dataObj,
        isAutoSaved: 'false',
        shuffleQid: '0',
        currentServerDatetime: new Date().toISOString(),
        success: 'true',
        configurationFlag: '1',
        configuration: { duration: 30, negative_marks: 0 },
        status: 'success',
        remainingTime: 1800
      });
    }

    if (body.updateStudentOnlineExamStartTime) {
      return send(res, 200, { data: [], success: 'true', status: 'success', message: 'Start time updated successfully.' });
    }

    if (body.submitOnlineExam) {
      return send(res, 200, { success: 'true', status: 'success', message: 'Exam submitted successfully.' });
    }

    const examsObj = {};
    DB.exams.forEach(e => { examsObj[e.examId] = e; });
    const pendingIds = DB.exams.filter(e => e.completionStatus === '0').map(e => e.examId);
    const completedIds = DB.exams.filter(e => e.completionStatus === '1').map(e => e.examId);
    return send(res, 200, {
      data: examsObj,
      pendingExamIds: pendingIds,
      completedExamIds: completedIds,
      totalRecords: DB.exams.length,
      success: 'true'
    });
  }

  // Web Notifications
  if (route === '/api/webNotification/webNotification.php') {
    const dataObj = {};
    DB.notifications.forEach(n => {
      dataObj[n.id] = {
        uniqueId: n.id,
        iid: INSTITUTE.id,
        userId: 580789,
        userRole: 'learner',
        notificationText: n.text,
        moduleId: n.moduleId,
        isRead: n.isRead ? 'true' : 'false',
        readOn: n.readOn,
        addedOn: n.addedOn
      };
    });
    return send(res, 200, {
      data: dataObj,
      sortedIdArray: DB.notifications.map(n => n.id),
      success: 'true',
      totalCount: DB.notifications.length,
      unReadMessageCount: DB.notifications.filter(n => !n.isRead).length
    });
  }

  // Student Summary & Vision/Mission
  if (route === '/api/studentSummary/studentSummary.php') {
    return send(res, 200, {
      data: {
        instituteName: INSTITUTE.name,
        vision: INSTITUTE.vision,
        mission: INSTITUTE.mission,
        total: 0
      },
      success: 'true'
    });
  }

  // Mentoring
  if (route === '/api/mentoring/mentoring.php') {
    return send(res, 200, {
      data: {
        mentorName: 'Sapna Raikwar',
        mentorId: 13245,
        displayPic: '',
        assignedStreams: ['B. Tech (CSE AIML)'],
        startDate: '2026-07-01',
        endDate: '2027-06-30',
        instituteName: INSTITUTE.name,
        institute_short_name: INSTITUTE.shortName,
        designation: 'Assistant Professor'
      },
      success: 'true',
      mentor_data: []
    });
  }

  // Fees
  if (route.startsWith('/api/fees/')) {
    return send(res, 200, {
      data: {
        AssignedFees: { totalAmount: 63500, paid: 63500, balance: 0, percentage: 100 },
        installment: [],
        yearWiseFees: [{ year: '2026-2027', amount: 63500, paid: 63500 }]
      },
      sortedIdArray: [],
      success: 'true'
    });
  }

  // LMS Courses
  if (route === '/api/lms/lms.php') {
    return send(res, 200, {
      data: {
        '25233': {
          name: 'Analysis of Raw Data',
          description: 'Techniques for data processing, statistical validation and analysis.',
          courseTextId: 'ZWZLG5WN',
          status: 'Approved',
          level: 'local'
        }
      },
      trendingTags: ['Data Analysis', 'Python', 'Machine Learning'],
      success: 'true',
      totalCount: 1
    });
  }

  // Notices
  if (route === '/api/notice/notice.php') {
    return send(res, 200, { data: [], sequenceIdArray: [], success: 'true', totalCount: 0, totalUnreadCount: 0 });
  }

  // Events
  if (route === '/api/event/postEvent.php') {
    return send(res, 200, {
      data: {
        '22855': {
          parent: 0,
          uniqueId: 22855,
          facultyName: 'Neha Tiwari',
          eventName: 'Technical Seminar on Artificial Intelligence Trends',
          startDateReadable: '14th Oct, 2026',
          StartTimeReadable: '12:00 AM'
        }
      },
      sortedIdArray: ['22855'],
      success: 'true',
      totalCount: 1
    });
  }

  // Learner Navigation JSON
  if (route === '/student/learnerModuleNavigation.json') {
    return send(res, 200, NAVIGATION_MODULES);
  }

  return send(res, 404, { detail: 'Not found' });
}

/* ------------------------------------------------------------------ */
/* Static File Serving (Modern & Classic)                             */
/* ------------------------------------------------------------------ */
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.json': 'application/json; charset=utf-8'
};

function serveStatic(req, res, url) {
  let isClassic = url.pathname.startsWith('/classic');
  let baseDir = isClassic ? PUBLIC_CLASSIC_DIR : PUBLIC_DIR;
  let p = isClassic ? url.pathname.replace(/^\/classic\/?/, '') : url.pathname;
  if (!p || p === '/') p = 'index.html';

  const filePath = path.join(baseDir, path.normalize(p).replace(/^(\.\.[/\\])+/, ''));
  if (!filePath.startsWith(baseDir)) return send(res, 403, { detail: 'Forbidden' });

  fs.readFile(filePath, (err, data) => {
    if (err) {
      fs.readFile(path.join(baseDir, 'index.html'), (e2, html) => {
        if (e2) return send(res, 404, { detail: 'Not found' });
        res.writeHead(200, { 'Content-Type': MIME['.html'] });
        res.end(html);
      });
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
    res.end(data);
  });
}

/* ------------------------------------------------------------------ */
/* Server Initialization                                              */
/* ------------------------------------------------------------------ */
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Api-Key',
      'Access-Control-Allow-Methods': 'GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS',
    });
    return res.end();
  }
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/student/')) {
    handleApi(req, res, url).catch(err => {
      console.error(err);
      send(res, 500, { detail: 'Server error' });
    });
    return;
  }
  serveStatic(req, res, url);
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  Pilla — Attendance & Student Portal running at:`);
  console.log(`    Modern UI:   http://localhost:${PORT}`);
  console.log(`    Classic UI:  http://localhost:${PORT}/classic/`);
  console.log(`======================================================`);
  console.log(`  Features:`);
  console.log(`    • Offline Seeded Accounts: STOIST25963, STOIST251161, DEMO123`);
  console.log(`    • LIVE Portal Verification: Any student credentials from OIST`);
  console.log(`      are automatically validated against portal.vmedulife.com!`);
  console.log(`======================================================\n`);
});
