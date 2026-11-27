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
  NAVIGATION_MODULES,
  getExamQuestions,
  parseRemainingSeconds,
  formatIstDateTime,
  parseExamAnswersInput
} = require('./data.js');

const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'local-demo-secret-not-for-production-pilla';
const PUBLIC_DIR = path.join(__dirname, 'public');

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

function istDateStr(ms = Date.now()) {
  return new Date(ms + 19800000).toISOString().slice(0, 10);
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
    const json = safeJsonParse(text) || {};

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

// Seed sessions for pre-configured users
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
    const m = contentType.match(/boundary=([^;\s]+)/i);
    if (m) {
      const boundary = m[1].trim().replace(/^"|"$/g, '');
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
    if (k) {
      try {
        out[decodeURIComponent(k)] = decodeURIComponent(v.replace(/\+/g, ' '));
      } catch {
        out[k] = v;
      }
    }
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
    if (
      !route.startsWith('/api/get') &&
      !route.startsWith('/api/present') &&
      !route.startsWith('/api/absent') &&
      !route.startsWith('/api/exam/') &&
      !route.startsWith('/api/assignment/') &&
      !route.startsWith('/api/student/') &&
      route !== '/api/instructor/onlineExam.php'
    ) {
      return handleVmedulifeApi(req, res, url, body);
    }
    return send(res, 401, { detail: 'Unauthorized' });
  }

  const user = DB.users[username] || DB.users['DEMO123'];
  const userSessions = DB.sessionsByUser[username] || DB.sessionsByUser['DEMO123'];

  // Helper: ensure live student sessions are loaded (skip DEMO123; refresh on 60s TTL)
  async function ensureLiveSessions(force = false) {
    if (user.username === 'DEMO123') return;
    const stale = !user._liveLoaded || (Date.now() - (user._liveLoadedAt || 0) > 60000);
    if (vmeduLive && user.stuid && user.sid && user.groupid && (force || stale)) {
      try {
        const batchInput = (Array.isArray(user.batchIds) && user.batchIds.length)
          ? user.batchIds
          : (user.buid || 70134);
        const liveRes = await vmeduLive.getLiveStudentSessions(
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

          // dynamically populate subjects from real class sessions
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
      items.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
      if (items.length) {
        date_from = items[items.length - 1].date;
        date_to = items[0].date;
      }
    } else {
      if (!date_from.startsWith('2000')) {
        items = items.filter(x => x.date >= date_from && x.date <= date_to);
      }
      items.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
    }

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
    await ensureLiveSessions();
    const currentSessions = DB.sessionsByUser[username] || userSessions;
    const sid = Number(body.session_id);
    const sess = currentSessions.find(x => x.session_id === sid);
    if (!sess) return send(res, 404, { ok: false, detail: 'Session not found' });

    const previous = sess.attendance_status;
    const next = route === '/api/present' ? 'Present' : 'Absent';

    // Live Upstream Call to portal.vmedulife.com (never for DEMO123)
    let upstreamStatus = 'simulated';
    if (user.username !== 'DEMO123' && vmeduLive && user.stuid && user.sid && user.groupid) {
      let up = null;
      try {
        up = await vmeduLive.updateLiveAttendance(
          user.stuid,
          sid,
          next,
          sess.date,
          user.sid,
          user.groupid,
          user.acayr || 12
        );
      } catch (err) {
        console.warn('[Live Upstream] Attendance update error:', err.message);
        up = { ok: false, error: err.message };
      }
      if (up && up.ok) {
        upstreamStatus = 'success';
      } else {
        return send(res, 400, {
          ok: false,
          detail: (up && up.error) || 'Failed to update attendance on main portal',
          upstream_status: 'failed'
        });
      }
    }

    sess.attendance_status = next;
    sess.simulated_status = user.username === 'DEMO123' && next !== sess.source_status ? next : null;
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

  // 8. Get Assignments (Live Portal DB with HAR fallback)
  if (route === '/api/getAssignments' && req.method === 'POST') {
    let source = 'har';
    if (vmeduLive && typeof vmeduLive.getLiveStudentAssignments === 'function' && user.username !== 'DEMO123') {
      try {
        const liveAss = await vmeduLive.getLiveStudentAssignments(user);
        if (liveAss && Array.isArray(liveAss.assignments)) {
          DB.assignmentsByUser[username] = liveAss.assignments;
          source = 'live';
        }
      } catch {}
    }

    const items = getUserAssignments(username);
    const completed = items.filter(a => a.status === 'Completed').length;
    const pending = items.length - completed;
    return send(res, 200, {
      count: items.length,
      pending_count: pending,
      completed_count: completed,
      source,
      assignments: items
    });
  }

  // 8.1 Submit Assignment (Upload & Submit — direct live sync)
  if ((route === '/api/assignment/submit' || route === '/api/student/assignments/submit') && req.method === 'POST') {
    const aid = Number(body.assignment_id || body.assignmentId);
    const subId = body.sub_id || body.subAssignmentId ? String(body.sub_id || body.subAssignmentId) : '';
    const fileName = body.file_name || body.fileName || 'assignment_submission.pdf';
    const fileData = body.file_data || body.fileData || '';
    const remarks = body.remarks || 'Submitted via portal';

    const userAssignments = getUserAssignments(username);
    const a = (subId && userAssignments.find(x => String(x.id) === String(aid) && String(x.subId || '') === subId))
      || userAssignments.find(x => x.id === aid || String(x.id) === String(body.assignment_id || body.assignmentId));
    if (!a) {
      return send(res, 404, { ok: false, detail: 'Assignment not found' });
    }

    let upstream_status = 'simulated';
    if (vmeduLive && typeof vmeduLive.submitLiveAssignment === 'function' && user.username !== 'DEMO123') {
      const up = await vmeduLive.submitLiveAssignment(user, a, fileName, fileData, remarks);
      if (up && up.ok) {
        upstream_status = 'success';
        try {
          const liveAss = await vmeduLive.getLiveStudentAssignments(user);
          if (liveAss && Array.isArray(liveAss.assignments)) {
            DB.assignmentsByUser[username] = liveAss.assignments;
          }
        } catch {}
      } else {
        const errMsg = (up && up.data && up.data.message) || (up && up.error) || 'Failed to submit assignment on main portal.';
        return send(res, 400, {
          ok: false,
          success: false,
          status: 'fail',
          detail: errMsg,
          message: errMsg,
          upstream_status: 'failed'
        });
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

    // Optional safe local disk backup
    if (fileData) {
      try {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        const safeName = `${aid}_${Date.now()}_${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const base64Data = fileData.includes('base64,') ? fileData.split('base64,')[1] : fileData;
        fs.writeFileSync(path.join(uploadDir, safeName), Buffer.from(base64Data, 'base64'));
      } catch (err) {}
    }

    const pending = updatedList.filter(x => x.status === 'Pending').length;
    return send(res, 200, {
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

  // 8.2 Student Assignments (GET / POST compatibility)
  if ((route === '/api/student/assignments') && (req.method === 'GET' || req.method === 'POST')) {
    let source = 'har';
    if (vmeduLive && typeof vmeduLive.getLiveStudentAssignments === 'function' && user.username !== 'DEMO123') {
      try {
        const liveAss = await vmeduLive.getLiveStudentAssignments(user);
        if (liveAss && Array.isArray(liveAss.assignments)) {
          DB.assignmentsByUser[username] = liveAss.assignments;
          source = 'live';
        }
      } catch {}
    }
    const items = getUserAssignments(username);
    const pending = items.filter(x => x.status === 'Pending').length;
    return send(res, 200, {
      success: true,
      source,
      data: items,
      assignments: items,
      pendingCount: pending
    });
  }

  // 9. Get Exams (Live Portal DB with HAR fallback)
  if (route === '/api/getExams' && req.method === 'POST') {
    let source = 'har';
    if (vmeduLive && typeof vmeduLive.getLiveStudentExams === 'function' && user.username !== 'DEMO123') {
      try {
        const liveEx = await vmeduLive.getLiveStudentExams(user);
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
    const completed = items.filter(e => e.completionStatus === '1').length;
    const pending = items.length - completed;
    return send(res, 200, {
      count: items.length,
      pending_count: pending,
      completed_count: completed,
      source,
      exams: items
    });
  }

  // 10. Get Exam Questions (Live Portal DB; strict live gating for non-DEMO accounts)
  if (route === '/api/exam/questions' && (req.method === 'POST' || req.method === 'GET')) {
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

    if (vmeduLive && typeof vmeduLive.getLiveExamQuestions === 'function' && user.username !== 'DEMO123') {
      const liveCached = DB.liveQuestionsByUser[username] && DB.liveQuestionsByUser[username][examId];
      if (mode === 'review' && exam?.completionStatus === '1' && Array.isArray(liveCached) && liveCached.length) {
        questions = liveCached;
        source = 'live-cache';
      } else {
        try {
          const liveQ = await vmeduLive.getLiveExamQuestions(user, examId);
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

    return send(res, 200, {
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

  // 10.1 Update Student Online Exam Start Time (always forward to live backend)
  if (route === '/api/exam/start' && req.method === 'POST') {
    const examId = String(body.exam_id || body.examId || '');
    let upstream_status = 'simulated';
    if (vmeduLive && typeof vmeduLive.startLiveExam === 'function' && user.username !== 'DEMO123') {
      const up = await vmeduLive.startLiveExam(user, examId);
      if (up && up.ok) {
        upstream_status = 'success';
        const userExams = getUserExams(username);
        const exam = userExams.find(e => String(e.examId) === examId);
        if (exam && (!exam.studentExamStartTime || exam.studentExamStartTime === '0000-00-00 00:00:00')) {
          exam.studentExamStartTime = up.startTime || formatIstDateTime();
        }
      } else {
        const errMsg = (up && up.data && up.data.message) || (up && up.error) || 'Main portal refused to start exam.';
        return send(res, 400, {
          ok: false,
          success: 'false',
          status: 'fail',
          detail: errMsg,
          message: errMsg,
          upstream_status: 'failed'
        });
      }
    }
    return send(res, 200, {
      ok: true,
      data: [],
      success: 'true',
      status: 'success',
      upstream_status,
      message: 'Start time updated successfully.'
    });
  }

  // 11. Submit / Auto-save Exam
  if (route === '/api/exam/submit' && req.method === 'POST') {
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
    if (vmeduLive && typeof vmeduLive.submitLiveExam === 'function' && user.username !== 'DEMO123') {
      const up = await vmeduLive.submitLiveExam(user, examId, answers, remainingTime, submissionType, allQuestionIds, questionTypesByQid);
      if (up && up.ok) {
        upstream_status = 'success';
        if (submissionType !== 'auto-save' && typeof vmeduLive.getLiveStudentExams === 'function') {
          DB.liveSubmittedAnswersByUser[username] = DB.liveSubmittedAnswersByUser[username] || {};
          DB.liveSubmittedAnswersByUser[username][examId] = answers;
          try {
            const refreshed = await vmeduLive.getLiveStudentExams(user);
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
        return send(res, 400, {
          ok: false,
          success: false,
          status: 'fail',
          submissionType,
          detail: errMsg,
          message: errMsg,
          upstream_status: 'failed'
        });
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

    return send(res, 200, {
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

  // 11.1 User-scoped Online Exam API compatibility route
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
      return send(res, 200, {
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
      return send(res, 200, { data: [], success: 'true', status: 'success', message: 'Start time updated successfully.' });
    }

    if (isSubmit) {
      const examId = String(body.examId || (body.data && body.data.examId) || '125821');
      const exam = userExams.find(e => String(e.examId) === examId);
      if (exam) exam.completionStatus = '1';
      return send(res, 200, { success: 'true', status: 'success', message: 'Exam submitted successfully.' });
    }

    const examsObj = {};
    userExams.forEach(e => { examsObj[e.examId] = e; });
    const pendingIds = userExams.filter(e => e.completionStatus === '0').map(e => e.examId);
    const completedIds = userExams.filter(e => e.completionStatus === '1').map(e => e.examId);
    return send(res, 200, {
      data: examsObj,
      pendingExamIds: pendingIds,
      completedExamIds: completedIds,
      totalRecords: userExams.length,
      success: 'true'
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
/* Static File Serving                                                */
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
  let p = url.pathname;
  if (!p || p === '/') p = 'index.html';

  const filePath = path.join(PUBLIC_DIR, path.normalize(p).replace(/^(\.\.[/\\])+/, ''));
  if (!filePath.startsWith(PUBLIC_DIR)) return send(res, 403, { detail: 'Forbidden' });

  fs.readFile(filePath, (err, data) => {
    if (err) {
      fs.readFile(path.join(PUBLIC_DIR, 'index.html'), (e2, html) => {
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
  console.log(`    Portal URL:  http://localhost:${PORT}`);
  console.log(`======================================================`);
  console.log(`  Features:`);
  console.log(`    • Offline Seeded Accounts: STOIST25963, STOIST251161, DEMO123`);
  console.log(`    • LIVE Portal Verification: Any student credentials from OIST`);
  console.log(`      are automatically validated against portal.vmedulife.com!`);
  console.log(`======================================================\n`);
});
