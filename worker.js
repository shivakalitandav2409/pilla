/*
 * Cloudflare Worker entry point for Pilla Portal
 * Compatible with Cloudflare Workers (nodejs_compat) + Workers Assets
 */

import crypto from 'node:crypto';
import data from './data.js';

const {
  INSTITUTE,
  USERS,
  EXAMS,
  EXAM_QUESTIONS_125821,
  NOTIFICATIONS,
  ASSIGNMENTS,
  NAVIGATION_MODULES
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
    const json = JSON.parse(text.trim());

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
  exams: JSON.parse(JSON.stringify(EXAMS)),
  examQuestions: JSON.parse(JSON.stringify(EXAM_QUESTIONS_125821)),
  notifications: JSON.parse(JSON.stringify(NOTIFICATIONS)),
  assignments: JSON.parse(JSON.stringify(ASSIGNMENTS)),
  revokedTokens: new Set()
};

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
        if (!route.startsWith('/api/get') && !route.startsWith('/api/present') && !route.startsWith('/api/absent')) {
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

      if (route === '/api/getID' && request.method === 'GET') {
        return jsonResponse({
          name: user.name, user: user.username, mobile: user.mobile, email: user.email, dp_url: user.dp_url, stuid: user.stuid, stream: user.streamName, institute: INSTITUTE, mentor: user.mentor, fees: user.fees, attendance_metrics: computeMetrics(userSessions)
        });
      }

      if (route === '/api/getSession/options' && request.method === 'GET') {
        return jsonResponse({ streams: user.streams, subjects: user.subjects, acayr: user.acayr });
      }

      if (route === '/api/getSession' && request.method === 'POST') {
        const mode = body.mode || 'date';
        let items = userSessions.slice();
        let subject_id = null;
        let date_from = body.date_from || body.date || '2026-09-12';
        let date_to = body.date_to || body.date || '2026-09-12';

        if (mode === 'subject') {
          subject_id = Number(body.subject_id);
          items = items.filter(x => x.subject_id === subject_id);
          if (items.length) { date_from = items[items.length - 1].date; date_to = items[0].date; }
        } else {
          items = items.filter(x => x.date >= date_from && x.date <= date_to);
        }
        items.sort((a, b) => (a.date < b.date ? 1 : -1));
        return jsonResponse({ count: items.length, mode, subject_id, items: items.map((x, i) => ({ ...x, session_index: i })), date_from, date_to });
      }

      if ((route === '/api/present' || route === '/api/absent') && request.method === 'POST') {
        const sid = Number(body.session_id);
        const sess = userSessions.find(x => x.session_id === sid);
        if (!sess) return jsonResponse({ ok: false, detail: 'Session not found' }, 404);

        const previous = sess.attendance_status;
        const next = route === '/api/present' ? 'Present' : 'Absent';
        sess.attendance_status = next;
        sess.simulated_status = next === sess.source_status ? null : next;
        sess.updated_at = new Date().toISOString();

        return jsonResponse({
          ok: true, session_index: body.session_index || 0, session_id: sid, subject_name: sess.subject_name, previous_status: previous, new_status: next, upstream_status: 'success', attendance_metrics: computeMetrics(userSessions)
        });
      }

      if (route === '/api/getAssignments' && request.method === 'POST') {
        const items = DB.assignments;
        return jsonResponse({ count: items.length, pending_count: items.filter(a => a.status === 'Pending').length, completed_count: items.filter(a => a.status === 'Completed').length, assignments: items });
      }

      if (route === '/api/getExams' && request.method === 'POST') {
        const items = DB.exams;
        return jsonResponse({ count: items.length, pending_count: items.filter(e => e.completionStatus === '0').length, completed_count: items.filter(e => e.completionStatus === '1').length, exams: items });
      }

      if (route === '/api/exam/questions') {
        return jsonResponse({ examId: '125821', examName: 'unit 2', examSyllabus: 'stack And Queue', subjectName: 'DATA STRUCTURE', durationMinutes: 30, totalQuestions: DB.examQuestions.length, questions: DB.examQuestions });
      }

      if (route === '/api/exam/submit' && request.method === 'POST') {
        const answers = body.answers || {};
        let score = 0;
        const questionResults = [];
        DB.examQuestions.forEach(q => {
          const selected = answers[q.qid];
          const isCorrect = selected === q.correctAnswerId;
          if (isCorrect) score += q.marks;
          questionResults.push({ qid: q.qid, selectedAnswerId: selected, correctAnswerId: q.correctAnswerId, isCorrect });
        });
        const exam = DB.exams.find(e => e.examId === (body.exam_id || '125821'));
        if (exam) exam.completionStatus = '1';

        return jsonResponse({ success: true, status: 'success', message: 'Exam submitted successfully.', score, totalMarks: DB.examQuestions.length, percentage: Math.round((score / DB.examQuestions.length) * 100), questionResults });
      }

      if (route === '/api/getNotifications') {
        return jsonResponse({ totalCount: DB.notifications.length, unReadMessageCount: DB.notifications.filter(n => !n.isRead).length, notifications: DB.notifications });
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
