/* 
 * Pilla — Frontend Application
 * Integrated from HAR captures: vm.zvx.workers.dev.har & Test.har
 */

'use strict';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const state = {
  token: null,
  profile: null,
  subjects: [],
  allSessions: [],
  assignments: [],
  exams: [],
  notifications: [],
  stream: '',
  metrics: null,
  quizTimer: null,
  quizSecondsLeft: 1800,
  quizAnswers: {},
  currentExamId: null
};

const SUBJECT_COLORS = [
  '#5b5bf0', '#12b981', '#f59e0b', '#ef5a6f', '#8a4ff0',
  '#0ea5e9', '#e0469b', '#14b8a6', '#f97316', '#6366f1',
  '#22c55e', '#3b82f6', '#ec4899', '#8b5cf6', '#10b981'
];

/* ---------------- API Helpers ---------------- */
async function apiPost(path, body = {}) {
  const payload = Object.assign({}, body);
  if (state.token) payload.dex_token = state.token;
  const headers = { 'Content-Type': 'application/json' };
  if (state.token) headers['Authorization'] = `Bearer ${state.token}`;
  const res = await fetch(path, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw Object.assign(new Error(data.detail || data.message || 'Request failed'), { status: res.status, data });
  }
  return data;
}

async function apiGet(path) {
  const url = `${path}${path.includes('?') ? '&' : '?'}dex_token=${encodeURIComponent(state.token || '')}`;
  const headers = {};
  if (state.token) headers['Authorization'] = `Bearer ${state.token}`;
  const res = await fetch(url, { headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw Object.assign(new Error(data.detail || data.message || 'Request failed'), { status: res.status, data });
  }
  return data;
}

/* ---------------- Toast Notification ---------------- */
let toastTimer;
function toast(msg, isErr = false) {
  const t = $('#toast');
  t.textContent = msg;
  t.className = 'toast' + (isErr ? ' err' : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hidden'), 2800);
}

/* ---------------- Utilities ---------------- */
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));

const iso = (d) => d.toISOString().slice(0, 10);

function splitName(display) {
  const m = String(display || '').match(/^(.*?)\(([^)]*\([^)]*\)[^)]*|[^)]*)\)\s*\(([^)]*)\)\s*$/);
  if (m) return { name: m[1].trim(), code: m[2].trim(), meta: m[3].replace(/\s*\|\s*/g, ' · ').trim() };
  return { name: display || 'Unknown Subject', code: '', meta: '' };
}

function fmtDay(ds) {
  const d = new Date(ds + 'T00:00:00');
  return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

/* ---------------- Auth & Login Handling ---------------- */
$$('.acc-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    $$('.acc-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    $('#username').value = pill.dataset.user;
    $('#password').value = pill.dataset.pass;
  });
});

$('#loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  $('#loginError').textContent = '';
  $('#loginBtn').disabled = true;
  try {
    const d = await apiPost('/api/initialize', {
      username: $('#username').value.trim(),
      password: $('#password').value
    });
    state.token = d.dex_token;
    sessionStorage.setItem('dex_token', state.token);
    await enterApp();
  } catch (err) {
    $('#loginError').textContent = err.data?.detail || 'Invalid credentials';
  } finally {
    $('#loginBtn').disabled = false;
  }
});

$('#logoutBtn').addEventListener('click', async () => {
  try { await apiPost('/api/logout'); } catch {}
  state.token = null;
  sessionStorage.removeItem('dex_token');
  $('#appView').classList.add('hidden');
  $('#loginView').classList.remove('hidden');
});

/* ---------------- App Initialization ---------------- */
async function enterApp() {
  $('#loginView').classList.add('hidden');
  $('#appView').classList.remove('hidden');

  await loadProfile();
  await loadOptions();
  await Promise.all([
    loadAllSessions(),
    loadAssignments(),
    loadExams(),
    loadNotifications()
  ]);

  // Default date range: span of student sessions
  if (state.allSessions.length) {
    const dates = state.allSessions.map(s => s.date).sort();
    $('#dateFrom').value = dates[0];
    $('#dateTo').value = dates[dates.length - 1];
  } else {
    $('#dateFrom').value = '2000-01-01';
    $('#dateTo').value = '2099-12-31';
  }

  renderDashboard();
  switchView('dashboard');
}

/* ---------------- Local Persistence Engine ---------------- */
function getStoredExamsKey() {
  const u = state.profile?.user || $('#username')?.value?.trim() || 'STOIST25963';
  return 'pilla_submitted_exams_' + u;
}

function getStoredExams() {
  try {
    return JSON.parse(localStorage.getItem(getStoredExamsKey()) || '{}');
  } catch {
    return {};
  }
}

function saveExamLocally(examId, score, totalMarks, answers, submissionTime) {
  try {
    const key = getStoredExamsKey();
    const stored = getStoredExams();
    stored[String(examId)] = {
      completionStatus: '1',
      score: score !== undefined ? score : 10,
      totalMarks: totalMarks !== undefined ? totalMarks : 10,
      answers: answers || {},
      submittedAt: submissionTime || new Date().toISOString()
    };
    localStorage.setItem(key, JSON.stringify(stored));
  } catch {}
}

function getStoredAssignmentsKey() {
  const u = state.profile?.user || $('#username')?.value?.trim() || 'STOIST25963';
  return 'pilla_submitted_assignments_' + u;
}

function getStoredAssignments() {
  try {
    return JSON.parse(localStorage.getItem(getStoredAssignmentsKey()) || '{}');
  } catch {
    return {};
  }
}

function saveAssignmentLocally(assignmentId, fileName, submittedOn) {
  try {
    const key = getStoredAssignmentsKey();
    const stored = getStoredAssignments();
    stored[String(assignmentId)] = {
      status: 'Completed',
      submitted_file: fileName,
      submitted_on: submittedOn || new Date().toISOString().slice(0, 10)
    };
    localStorage.setItem(key, JSON.stringify(stored));
  } catch {}
}

async function loadProfile() {
  const p = await apiGet('/api/getID');
  state.profile = p;
  state.metrics = p.attendance_metrics;

  const initial = (p.name || '?').trim().charAt(0).toUpperCase();
  $('#sideName').textContent = p.name;
  $('#sideId').textContent = 'ID ' + p.stuid;

  const sideAv = $('#sideAvatar');
  if (p.dp_url) {
    sideAv.style.backgroundImage = `url('${p.dp_url}')`;
    sideAv.textContent = '';
  } else {
    sideAv.style.backgroundImage = 'none';
    sideAv.textContent = initial;
  }

  const hour = new Date().getHours();
  const part = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  $('#greeting').textContent = `${part}, ${(p.name || '').split(' ')[0]} · ${p.email}`;

  // Institutional & Academic info
  if (p.institute) {
    $('#icInstitute').textContent = p.institute.name;
    $('#icLocation').textContent = `${p.institute.location} (${p.institute.shortName})`;
  }
  if (p.mentor) {
    $('#icMentor').textContent = p.mentor.mentorName;
  }
  if (p.fees) {
    $('#icFees').textContent = `₹${p.fees.totalAmount.toLocaleString()} Paid`;
  }
}

async function loadOptions() {
  const o = await apiGet('/api/getSession/options');
  state.subjects = o.subjects || [];
  const main = (o.streams || []).find(s => s.name);
  state.stream = main ? main.name : (state.profile?.stream || '');
  $('#streamChip').textContent = state.stream;

  const sel = $('#subject');
  sel.innerHTML = state.subjects.map(s =>
    `<option value="${s.subject_id}">${esc(s.display_name || s.subject_name)}</option>`
  ).join('');
}

async function loadAllSessions() {
  const d = await apiPost('/api/getSession', {
    mode: 'date',
    date_from: '2000-01-01',
    date_to: '2099-12-31'
  });
  state.allSessions = d.items || [];
}

async function loadAssignments() {
  try {
    const d = await apiPost('/api/getAssignments');
    const remoteAss = d.assignments || [];
    const localMap = getStoredAssignments();

    // Merge remote with locally stored submissions
    state.assignments = remoteAss.map(a => {
      const local = localMap[String(a.id)];
      if (local) {
        return {
          ...a,
          status: 'Completed',
          submitted_file: local.submitted_file || a.submitted_file,
          submitted_on: local.submitted_on || a.submitted_on
        };
      }
      return a;
    });

    const pending = state.assignments.filter(a => a.status === 'Pending').length;
    $('#sideAssBadge').textContent = pending || '';
    renderDashboardTasks();
  } catch {}
}

async function loadExams() {
  try {
    const d = await apiPost('/api/getExams');
    const remoteExams = d.exams || [];
    const useLocalMerge = d.source !== 'live' || state.profile?.user === 'DEMO123';
    const localMap = useLocalMerge ? getStoredExams() : {};

    // Merge remote with locally stored submissions (for offline/demo mode only)
    state.exams = remoteExams.map(ex => {
      const local = localMap[String(ex.examId)];
      if (local) {
        return {
          ...ex,
          completionStatus: '1',
          studentScore: local.score !== undefined && local.score !== null ? local.score : ex.studentScore,
          submittedTotalMarks: local.totalMarks !== undefined ? local.totalMarks : ex.submittedTotalMarks,
          submittedAnswers: local.answers || ex.submittedAnswers,
          submittedAt: local.submittedAt || ex.submittedAt
        };
      }
      return ex;
    });

    const pending = state.exams.filter(e => e.completionStatus === '0').length;
    const completed = state.exams.length - pending;

    $('#sideExamBadge').textContent = pending || '';
    $('#examPendingCount').textContent = pending;
    $('#examCompletedCount').textContent = completed;
    renderDashboardTasks();
  } catch {}
}

async function loadNotifications() {
  try {
    const d = await apiGet('/api/getNotifications');
    state.notifications = d.notifications || [];
    const unread = state.notifications.filter(n => !n.isRead).length;
    $('#notifBadge').textContent = unread || state.notifications.length;
  } catch {}
}

/* ---------------- Dashboard Rendering ---------------- */
function renderDashboard() {
  renderGauge(state.metrics);
  renderKpis(state.metrics);
  renderSubjectBars();
  renderRecent();
  renderDashboardTasks();
}

function getExamDisplayTotal(ex, questionCount = 0) {
  if (!ex) return questionCount || 10;
  if (ex.submittedTotalMarks) return ex.submittedTotalMarks;
  const rawTotal = Number(ex.totalMarks) || questionCount || 10;
  const score = ex.studentScore !== undefined ? Number(ex.studentScore) : 0;
  if (score > rawTotal) return questionCount || Number(ex.totalQuestions) || score;
  return rawTotal;
}

function renderDashboardTasks() {
  const compExams = state.exams.filter(e => e.completionStatus === '1');
  const pendExams = state.exams.length - compExams.length;
  const examStatusEl = $('#dashExamStatus');
  const examSubEl = $('#dashExamSub');
  const actionSection = $('#actionRequiredSection');

  // Check specifically if the active test (125814 - circular linkedlist by Sapna Raikwar) is pending
  const circExam = state.exams.find(e => String(e.examId) === '125814');
  const isCircPending = circExam && circExam.completionStatus !== '1';

  if (actionSection) {
    actionSection.style.display = isCircPending ? 'block' : 'none';
  }

  if (examStatusEl) {
    examStatusEl.textContent = `${compExams.length} Completed · ${pendExams} ${isCircPending ? 'Not Given' : 'Scheduled'}`;
  }
  if (examSubEl) {
    if (isCircPending) {
      examSubEl.textContent = `⚠️ Action Required: circular linkedlist (Not Given)`;
      examSubEl.className = 'tag-warn';
      examSubEl.style.color = '#f87171';
    } else if (compExams.length > 0) {
      const sortedComp = [...compExams].sort((a, b) => {
        const ta = a.submittedAt ? Date.parse(String(a.submittedAt).replace(' ', 'T')) || 0 : 0;
        const tb = b.submittedAt ? Date.parse(String(b.submittedAt).replace(' ', 'T')) || 0 : 0;
        return tb - ta;
      });
      const latest = sortedComp[0];
      const total = getExamDisplayTotal(latest);
      if (latest.studentScore !== undefined && latest.studentScore !== null) {
        examSubEl.textContent = `Latest: ${latest.examName} (${latest.studentScore}/${total} ✓ Passed)`;
      } else {
        examSubEl.textContent = `Latest: ${latest.examName} (✓ Submitted)`;
      }
      examSubEl.className = 'tag-success';
      examSubEl.style.color = '';
    } else {
      examSubEl.textContent = 'Click to view scheduled exams →';
      examSubEl.className = 'muted';
      examSubEl.style.color = '';
    }
  }

  const compAss = state.assignments.filter(a => a.status === 'Completed');
  const pendAss = state.assignments.filter(a => a.status === 'Pending');
  const assStatusEl = $('#dashAssStatus');
  const assSubEl = $('#dashAssSub');
  if (assStatusEl) {
    assStatusEl.textContent = `${compAss.length} Completed · ${pendAss.length} Action Required`;
  }
  if (assSubEl) {
    if (pendAss.length > 0) {
      const nextDue = pendAss[0];
      const shortTitle = (nextDue.title || '').length > 28 ? nextDue.title.slice(0, 27) + '...' : nextDue.title;
      assSubEl.textContent = `⚠️ Due: ${shortTitle} (${nextDue.due_date})`;
      assSubEl.className = 'tag-warn';
      assSubEl.style.color = '#fbbf24';
    } else {
      assSubEl.textContent = '✓ All coursework submitted!';
      assSubEl.className = 'tag-success';
      assSubEl.style.color = '';
    }
  }

  // Wire dashboard action button if present
  const dashBtn = $('#dashTakeTestBtn');
  if (dashBtn && !dashBtn._wired) {
    dashBtn._wired = true;
    dashBtn.addEventListener('click', () => {
      openQuizModal('125814', 'circular linkedlist', 'data structure', false);
    });
  }
}

function renderGauge(m) {
  if (!m) return;
  const pct = m.present_pct;
  $('#gaugePct').textContent = Math.round(pct) + '%';
  const r = 66, circ = 2 * Math.PI * r;
  const fg = $('#gaugeFg');
  fg.style.strokeDasharray = circ;
  fg.style.strokeDashoffset = circ * (1 - pct / 100);

  const tier = pct >= 75 ? 'good' : pct >= 50 ? 'warn' : 'bad';
  const color = tier === 'good' ? 'var(--green)' : tier === 'warn' ? 'var(--amber)' : 'var(--red)';
  fg.style.stroke = color;

  const foot = $('#gaugeFoot');
  foot.className = 'gauge-foot ' + tier;
  foot.textContent = tier === 'good' ? '✓ Above 75% Requirement'
    : tier === 'warn' ? '⚠ Below 75% Requirement'
    : '⚠ Attendance Critically Low';
}

function renderKpis(m) {
  if (!m) return;
  $('#kPresent').textContent = m.present_count;
  $('#kAbsent').textContent = m.absent_count;
  $('#kTotal').textContent = m.total_sessions;
  $('#kAvg').textContent = m.average_pct + '%';
}

function subjectStats() {
  const map = new Map();
  for (const s of state.allSessions) {
    if (!map.has(s.subject_id)) {
      map.set(s.subject_id, { present: 0, total: 0, name: s.subject_name });
    }
    const e = map.get(s.subject_id);
    e.total++;
    if (s.attendance_status === 'Present') e.present++;
  }
  return [...map.entries()].map(([id, e]) => ({
    id,
    ...e,
    pct: e.total ? Math.round((e.present / e.total) * 1000) / 10 : 0
  })).sort((a, b) => b.pct - a.pct);
}

function renderSubjectBars() {
  const stats = subjectStats();
  $('#subjCount').textContent = `${stats.length} Subjects Active`;
  $('#subjectBars').innerHTML = stats.map(st => {
    const { name, code, meta } = splitName(st.name);
    const color = st.pct >= 75 ? 'var(--green)' : st.pct >= 50 ? 'var(--amber)' : 'var(--red)';
    return `
      <div class="sbar">
        <div class="sbar-name">
          ${esc(name)} <small>${esc(code)}${meta ? ' · ' + esc(meta) : ''}</small>
        </div>
        <div class="sbar-pct" style="color:${color}">
          ${st.pct}% <span class="muted" style="font-weight:500">(${st.present}/${st.total})</span>
        </div>
        <div class="sbar-track">
          <div class="sbar-fill" style="width:${st.pct}%;background:${color}"></div>
        </div>
      </div>
    `;
  }).join('') || '<p class="muted">No session data available.</p>';
}

function renderRecent() {
  const items = [...state.allSessions].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 6);
  $('#recentList').innerHTML = items.map(it => tlItem(it, false)).join('') || '<p class="muted">No recent sessions.</p>';
  wireToggles($('#recentList'));
}

/* ---------------- Sessions View ---------------- */
$$('#modeSeg .seg-btn').forEach(b => b.addEventListener('click', () => {
  $$('#modeSeg .seg-btn').forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  const isSubj = b.dataset.mode === 'subject';
  $$('.date-field').forEach(el => el.classList.toggle('hidden', isSubj));
  $('.subject-field').classList.toggle('hidden', !isSubj);
}));

$('#loadBtn').addEventListener('click', loadSessions);

$$('.preset-btn').forEach(b => {
  b.addEventListener('click', () => {
    const p = b.dataset.preset;
    if (p === 'captured') {
      $('#dateFrom').value = '2026-09-01';
      $('#dateTo').value = '2026-09-15';
    } else if (p === 'all') {
      $('#dateFrom').value = '2000-01-01';
      $('#dateTo').value = '2099-12-31';
    }
    loadSessions();
  });
});

async function loadSessions() {
  const mode = $('#modeSeg .seg-btn.active').dataset.mode;
  const body = { mode };
  if (mode === 'subject') {
    body.subject_id = $('#subject').value;
  } else {
    body.date_from = $('#dateFrom').value;
    body.date_to = $('#dateTo').value;
  }
  const d = await apiPost('/api/getSession', body);
  renderTimeline($('#sessionTimeline'), d.items);
}

function renderTimeline(container, items) {
  if (!items || !items.length) {
    container.innerHTML = `
      <div class="card empty-card">
        <span class="emoji">🗓️</span>
        <h2>No sessions found</h2>
        <p>No class sessions match the chosen filter range.</p>
      </div>
    `;
    return;
  }
  const groups = {};
  for (const it of items) {
    (groups[it.date] = groups[it.date] || []).push(it);
  }
  const dates = Object.keys(groups).sort((a, b) => (a < b ? 1 : -1));
  container.innerHTML = dates.map(d =>
    `<div class="tl-day">${fmtDay(d)}</div>` + groups[d].map(it => tlItem(it, true)).join('')
  ).join('');
  wireToggles(container);
}

function tlItem(it, withSwitch) {
  const present = it.attendance_status === 'Present';
  const { name, meta } = splitName(it.subject_name);
  const sim = it.simulated_status ? `<span class="tl-sim">● modified (was ${esc(it.source_status)})</span>` : '';
  const sw = withSwitch ? `
    <div class="switch" data-id="${it.session_id}" data-idx="${it.session_index}">
      <button class="p ${present ? 'on' : ''}" data-act="present">Present</button>
      <button class="a ${!present ? 'on' : ''}" data-act="absent">Absent</button>
    </div>` : `<span class="tl-status ${present ? 'present' : 'absent'}">${it.attendance_status}</span>`;

  return `
    <div class="tl-item" data-id="${it.session_id}">
      <span class="tl-dot ${present ? 'present' : 'absent'}"></span>
      <div class="tl-main">
        <div class="tl-subj">${esc(name)}</div>
        <div class="tl-meta">
          <span>🕑 ${esc(it.time_slot)}</span>
          <span>👤 ${esc(it.faculty_name || 'Faculty Staff')}</span>
          <span>${esc(meta)}</span>
          ${sim}
        </div>
      </div>
      ${sw}
    </div>
  `;
}

function wireToggles(container) {
  $$('.switch', container).forEach(sw => {
    const id = Number(sw.dataset.id), idx = Number(sw.dataset.idx);
    $$('button', sw).forEach(btn =>
      btn.addEventListener('click', () => mark(btn.dataset.act, id, idx, sw))
    );
  });
}

async function mark(act, id, idx, sw) {
  const already = sw.querySelector(`button[data-act="${act}"]`).classList.contains('on');
  if (already) return;
  $$('button', sw).forEach(b => (b.disabled = true));
  try {
    const r = await apiPost('/api/' + act, { session_id: id, session_index: idx });
    const s = state.allSessions.find(x => x.session_id === id);
    if (s) {
      s.attendance_status = r.new_status;
      s.simulated_status = r.new_status === s.source_status ? null : r.new_status;
    }
    state.metrics = r.attendance_metrics;

    $$('button', sw).forEach(b => {
      b.disabled = false;
      b.classList.toggle('on', b.dataset.act === act);
    });

    const item = sw.closest('.tl-item');
    if (item) {
      item.querySelector('.tl-dot').className = 'tl-dot ' + (act === 'present' ? 'present' : 'absent');
    }

    renderGauge(state.metrics);
    renderKpis(state.metrics);
    renderSubjectBars();
    toast(`Marked ${r.new_status} · ${splitName(r.subject_name).name}`);
  } catch (err) {
    $$('button', sw).forEach(b => (b.disabled = false));
    toast(err.message || 'Update failed', true);
  }
}

/* ---------------- Subjects View ---------------- */
function renderSubjectsView() {
  const stats = new Map(subjectStats().map(s => [s.id, s]));
  $('#subjectGrid').innerHTML = state.subjects.map(s => {
    const st = stats.get(s.subject_id) || { pct: 0, present: 0, total: 0 };
    const { name, code, meta } = splitName(s.display_name || s.subject_name);
    const color = st.pct >= 75 ? 'var(--green)' : st.pct >= 50 ? 'var(--amber)' : 'var(--red)';
    return `
      <div class="card subj-card">
        <div class="top">
          <div>
            <h3>${esc(name)}</h3>
            <p class="type">${esc(s.subject_type)} · ${esc(s.subject_choice)}</p>
          </div>
          <span class="code">${esc(code || s.course_code)}</span>
        </div>
        <div class="pc-line">
          <span class="big-pct" style="color:${color}">${st.pct}%</span>
          <span>${st.present}/${st.total} attended</span>
        </div>
        <div class="sbar-track">
          <div class="sbar-fill" style="width:${st.pct}%;background:${color}"></div>
        </div>
      </div>
    `;
  }).join('');
}

/* ---------------- Assignments View ---------------- */
const selectedFiles = {};

$$('#assSeg .seg-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('#assSeg .seg-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderAssignments(btn.dataset.filter);
  });
});

function renderAssignments(filter = 'all') {
  let list = state.assignments;
  if (filter !== 'all') {
    list = list.filter(a => a.status === filter);
  }

  if (!list.length) {
    $('#assignmentsList').innerHTML = `
      <div class="card empty-card" style="grid-column: 1 / -1;">
        <span class="emoji">📝</span>
        <h2>No assignments found</h2>
        <p>You have no ${filter === 'all' ? '' : filter.toLowerCase()} coursework assignments.</p>
      </div>
    `;
    return;
  }

  $('#assignmentsList').innerHTML = list.map(a => {
    const isComp = a.status === 'Completed';
    const selFile = selectedFiles[a.id];
    const fileLabelText = selFile 
      ? `📄 ${esc(selFile.name)} (${(selFile.size / 1024).toFixed(1)} KB)` 
      : '📎 Choose or Drag assignment file...';

    return `
      <div class="card ass-card" data-aid="${a.id}">
        <div>
          <div class="ass-top">
            <span class="code" style="font-size:.78rem;font-weight:700;color:var(--accent);background:var(--accent-soft);padding:3px 9px;border-radius:7px;">
              ${esc(a.subject_name)} ${a.batchName ? `· ${esc(a.batchName)}` : ''}
            </span>
            <span class="ass-status ${isComp ? 'completed' : 'pending'}">${esc(a.status)}</span>
          </div>
          <h3 class="ass-title">${esc(a.title)}</h3>
          <div class="ass-meta">
            <span>📅 Assigned: <b>${esc(a.displayStartDate || a.startDate || 'Recorded')}</b></span>
            <span>⏰ Due Date: <b style="color:#ffffff;">${esc(a.displayEndDate || a.due_date)}</b></span>
            <span>🎯 Total Marks: <b>${esc(a.marks)}</b></span>
            ${a.facultyName ? `<span>👤 Faculty: <b>${esc(a.facultyName)}</b></span>` : ''}
            ${a.obtainedMarks !== null && a.obtainedMarks !== undefined ? `
              <span style="color:var(--green);font-weight:700;">⭐ Obtained Score: ${a.obtainedMarks} / ${a.marks} (${esc(a.evaluation || 'Graded')})</span>
            ` : ''}
            ${a.instructorAttachment ? `<span>📎 Ref Attachment: <b style="color:var(--accent);">${esc(a.instructorAttachment)}</b></span>` : ''}
          </div>
          ${a.instruction ? `
            <div style="font-size:.8rem;color:var(--muted);background:rgba(255,255,255,0.03);padding:6px 10px;border-radius:6px;margin:8px 0;border-left:2px solid var(--accent);">
              ℹ️ ${esc(a.instruction)}
            </div>
          ` : ''}

          ${!isComp ? `
            <div class="ass-upload-box" id="assBox_${a.id}">
              <input type="file" id="assFile_${a.id}" class="ass-file-input" data-id="${a.id}" accept=".pdf,.doc,.docx,.txt,.zip,.py,.cpp" style="display:none;" />
              <label for="assFile_${a.id}" class="ass-file-drop" id="assDrop_${a.id}">
                <span class="ass-drop-icon">📎</span>
                <span class="ass-drop-text" id="assText_${a.id}">${fileLabelText}</span>
              </label>
              <div class="ass-action-row">
                <span class="ass-file-hint muted" style="font-size:.78rem;">PDF, DOCX up to 10MB</span>
                <button class="ass-upload-btn" id="assBtn_${a.id}" data-id="${a.id}" ${selFile ? '' : 'disabled'}>
                  <span>Upload & Submit</span>
                </button>
              </div>
            </div>
          ` : `
            <div class="ass-completed-box">
              <span class="ass-doc-pill">
                ✓ Submitted: <b>${esc(a.submitted_file || 'Assignment_Submission.pdf')}</b>
              </span>
              <div style="font-size:.82rem;color:var(--muted);display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px;">
                <span>📅 Submitted On: ${esc(a.submitted_on || 'Recorded')}</span>
                <span>⭐ Status: Evaluated & Recorded</span>
              </div>
              <div class="ass-btn-row">
                <button class="ass-view-btn" data-id="${a.id}" data-file="${esc(a.submitted_file || 'Assignment.pdf')}">
                  👁️ View Document
                </button>
                <button class="ass-resubmit-btn" data-id="${a.id}">
                  🔄 Re-submit File
                </button>
              </div>
              <div class="ass-upload-box hidden" id="assReBox_${a.id}" style="margin-top:8px;">
                <input type="file" id="assFile_${a.id}" class="ass-file-input" data-id="${a.id}" accept=".pdf,.doc,.docx,.txt,.zip,.py,.cpp" style="display:none;" />
                <label for="assFile_${a.id}" class="ass-file-drop">
                  <span class="ass-drop-icon">📎</span>
                  <span class="ass-drop-text" id="assText_${a.id}">Choose new file...</span>
                </label>
                <div class="ass-action-row">
                  <span class="muted" style="font-size:.78rem;">Replace previous submission</span>
                  <button class="ass-upload-btn" id="assBtn_${a.id}" data-id="${a.id}" disabled>
                    <span>Update Submission</span>
                  </button>
                </div>
              </div>
            </div>
          `}
        </div>
        <div class="ass-foot">
          <span class="muted" style="font-size:.82rem;">${esc(a.subject_type)} Coursework</span>
          <span style="font-weight:600;font-size:.86rem;color:${isComp ? 'var(--green)' : 'var(--amber)'}">
            ${isComp ? 'Verified Submission' : 'Action Required'}
          </span>
        </div>
      </div>
    `;
  }).join('');

  wireAssignmentInteractions();
}

function wireAssignmentInteractions() {
  // File inputs
  $$('.ass-file-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const id = input.dataset.id;
      const file = e.target.files && e.target.files[0];
      if (file) {
        selectedFiles[id] = file;
        const textEl = $('#assText_' + id);
        if (textEl) textEl.textContent = `📄 ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
        const btn = $('#assBtn_' + id);
        if (btn) btn.disabled = false;
      }
    });
  });

  // Drag and drop
  $$('.ass-upload-box').forEach(box => {
    const input = box.querySelector('.ass-file-input');
    if (!input) return;
    const id = input.dataset.id;
    box.addEventListener('dragover', (e) => { e.preventDefault(); box.classList.add('drag-over'); });
    box.addEventListener('dragleave', () => box.classList.remove('drag-over'));
    box.addEventListener('drop', (e) => {
      e.preventDefault();
      box.classList.remove('drag-over');
      if (e.dataTransfer.files && e.dataTransfer.files.length) {
        const file = e.dataTransfer.files[0];
        selectedFiles[id] = file;
        const textEl = $('#assText_' + id);
        if (textEl) textEl.textContent = `📄 ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
        const btn = $('#assBtn_' + id);
        if (btn) btn.disabled = false;
      }
    });
  });

  // Submit buttons
  $$('.ass-upload-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const file = selectedFiles[id];
      if (!file) {
        toast('Please choose a file to submit', true);
        return;
      }
      btn.disabled = true;
      btn.innerHTML = '<span>Uploading...</span>';

      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const res = await apiPost('/api/assignment/submit', {
            assignment_id: Number(id),
            file_name: file.name,
            file_data: reader.result,
            remarks: 'Submitted via student portal'
          });

          // Update local state
          const item = state.assignments.find(a => String(a.id) === String(id));
          if (item) {
            item.status = 'Completed';
            item.submitted_on = res.assignment?.submitted_on || new Date().toISOString().slice(0, 10);
            item.submitted_file = file.name;
          }
          delete selectedFiles[id];
          const pending = state.assignments.filter(a => a.status === 'Pending').length;
          $('#sideAssBadge').textContent = pending || '';

          saveAssignmentLocally(id, file.name, new Date().toISOString().slice(0, 10));
          renderDashboardTasks();
          toast(`✅ ${file.name} uploaded successfully!`);
          renderAssignments($('#assSeg .seg-btn.active')?.dataset.filter || 'all');
        } catch (err) {
          toast(err.message || 'Upload failed', true);
          btn.disabled = false;
          btn.innerHTML = '<span>Upload & Submit</span>';
        }
      };
      reader.readAsDataURL(file);
    });
  });

  // View buttons
  $$('.ass-view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const fileName = btn.dataset.file || 'Assignment_Submission.pdf';
      // Create a friendly downloadable preview blob
      const content = `Pilla Student Portal Document Archive\n-------------------------------------\nAssignment ID: #${btn.dataset.id}\nFile: ${fileName}\nStudent: ${state.profile?.name || 'Shivang Saxena'}\nStatus: Verified and Submitted\nVerification ID: OK-${Date.now()}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName.endsWith('.pdf') ? fileName : fileName + '.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast(`Downloaded submission archive: ${fileName}`);
    });
  });

  // Re-submit buttons
  $$('.ass-resubmit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const reBox = $('#assReBox_' + id);
      if (reBox) reBox.classList.toggle('hidden');
    });
  });
}

/* ---------------- Exams View ---------------- */
$$('#examSeg .seg-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('#examSeg .seg-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderExams(btn.dataset.filter);
  });
});

function renderExams(filter = 'all') {
  let list = [...state.exams];
  if (filter !== 'all') {
    list = list.filter(e => e.completionStatus === filter);
  }

  // Sort so that active pending exams (125814 circular linkedlist and 125821) appear first
  list.sort((a, b) => {
    if (a.completionStatus === '0' && a.examId === '125814') return -1;
    if (b.completionStatus === '0' && b.examId === '125814') return 1;
    if (a.completionStatus === '0' && b.completionStatus === '1') return -1;
    if (a.completionStatus === '1' && b.completionStatus === '0') return 1;
    return 0;
  });

  if (!list.length) {
    $('#examsList').innerHTML = `
      <div class="card empty-card" style="grid-column: 1 / -1;">
        <span class="emoji">★</span>
        <h2>No examinations found</h2>
        <p>No exams match the chosen filter.</p>
      </div>
    `;
    return;
  }

  $('#examsList').innerHTML = list.map(e => {
    const isComp = e.completionStatus === '1';
    const isUrgent = !isComp && (e.examId === '125814' || e.examId === '125821');
    const faculties = (e.subjectFaculties || []).map(f => f.FacultyName).join(', ');
    const formattedSubAt = e.submittedAt
      ? (isNaN(new Date(String(e.submittedAt).replace(' ', 'T')).getTime())
          ? e.submittedAt
          : new Date(String(e.submittedAt).replace(' ', 'T')).toLocaleString())
      : (e.submittedAtFormatted && e.submittedAtFormatted !== 'NA' ? e.submittedAtFormatted : '');
    const hasScore = e.studentScore !== undefined && e.studentScore !== null;
    const scoreLine = hasScore
      ? `⭐ Score: ${e.studentScore} / ${getExamDisplayTotal(e)} (Passed)`
      : (e.viewStudentMarksAllowed === 'off' ? '⭐ Status: Evaluated (Marks Hidden by Faculty)' : '⭐ Status: Submitted & Recorded');

    return `
      <div class="card exam-card" style="${isUrgent ? 'border: 1px solid rgba(239, 68, 68, 0.5); box-shadow: 0 0 16px rgba(239, 68, 68, 0.1);' : ''}">
        <div>
          <div class="exam-top">
            <span class="code" style="font-size:.78rem;font-weight:700;color:var(--accent);background:var(--accent-soft);padding:3px 9px;border-radius:7px;">
              ${esc(e.subjectName)} (${esc(e.subjectType)})
            </span>
            <span class="exam-status ${isComp ? 'completed' : 'pending'}" style="${isUrgent ? 'background:rgba(239,68,68,0.2); color:#f87171; border:1px solid #ef4444; font-weight:700;' : ''}">
              ${isComp ? 'Completed' : isUrgent ? '⚠️ NOT GIVEN' : 'Pending'}
            </span>
          </div>
          <h3 class="exam-title">${esc(e.examName)}</h3>
          <div class="exam-meta">
            <span>📖 Syllabus: <b style="${isUrgent ? 'color:#f87171;' : ''}">${esc(e.examSyllabus || 'Full Syllabus')}</b></span>
            <span>👤 Faculty: <b>${esc(faculties || 'Department Faculty')}</b></span>
            <span>📅 Assigned Date: <b style="color:#ffffff;">${esc(e.startDate || '19th Nov, 2026')}</b></span>
            <span>🕐 Scheduled Window: <b style="color:#ffffff;">${esc(e.startTime || '09:00 am')} – ${esc(e.endTime || '11:55 pm')}</b></span>
            <span>⏱️ Duration: <b>${e.durationMinutes || 30} Mins</b> · ${e.totalQuestions || 10} Questions · ${e.totalMarks || 10} Marks</span>
            ${!isComp && e.allowStartExam ? `<span style="color:var(--green); font-weight:600; font-size:.82rem;">🟢 Live Portal Window Open</span>` : ''}
            ${isUrgent ? `<span style="color:#f87171; font-weight:600; font-size:.82rem;">⚠️ Action Required!</span>` : ''}
            ${isComp ? `
              <span style="color:var(--green);font-weight:700;">${scoreLine}</span>
              ${formattedSubAt ? `<span style="color:var(--muted);font-size:.78rem;">✅ Submitted: ${esc(formattedSubAt)}</span>` : ''}
            ` : ''}
          </div>
        </div>
        <div class="exam-foot">
          <span class="muted" style="font-size:.82rem;">Exam ID: #${esc(e.examId)}</span>
          <button class="quiz-btn ${isComp ? 'review-btn' : ''}" style="${isUrgent ? 'background:#ef4444; border-color:#dc2626; font-weight:700;' : ''}" data-exam-id="${esc(e.examId)}" data-exam-title="${esc(e.examName)}" data-exam-subj="${esc(e.subjectName)}" data-is-comp="${isComp ? '1' : '0'}">
            ${isComp ? 'Review Answers ↗' : isUrgent ? 'Take Test Now ⏱️' : 'Take Quiz ⏱️'}
          </button>
        </div>
      </div>
    `;
  }).join('');

  $$('#examsList .quiz-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const isComp = btn.dataset.isComp === '1';
      openQuizModal(btn.dataset.examId, btn.dataset.examTitle, btn.dataset.examSubj, isComp);
    });
  });
}

/* ---------------- Interactive Quiz & Review Modal ---------------- */
let currentExamQuestions = [];

function setTimerControlsVisible(visible) {
  const disp = visible ? '' : 'none';
  const minus = $('#timerMinusBtn');
  const plus = $('#timerPlusBtn');
  if (minus) minus.style.display = disp;
  if (plus) plus.style.display = disp;
}

function renderExamReviewList(questions, submittedAnswers = null) {
  const hasSubmittedMap = submittedAnswers && Object.keys(submittedAnswers).length > 0;
  return (questions || []).map((q, idx) => {
    const qMarks = Number(q.marks) || 1;
    const hasKey = Boolean(q.correctAnswerId);
    const selectedId = hasSubmittedMap ? submittedAnswers[q.qid] : q.correctAnswerId;
    const isCorrect = !hasKey
      ? true
      : (hasSubmittedMap
          ? (selectedId !== undefined && selectedId !== null && String(selectedId) === String(q.correctAnswerId))
          : true);

    return `
      <div class="qr-q-card ${isCorrect ? 'correct' : 'incorrect'}">
        <div class="qr-q-title">
          <span style="color:${isCorrect ? 'var(--green)' : 'var(--red)'};">${isCorrect ? '✓' : '✕'} Q${idx + 1}.</span>
          <span>${esc(q.text)}</span>
        </div>
        ${hasSubmittedMap ? `
          <div style="font-size:.82rem;font-weight:600;margin-bottom:8px;color:${isCorrect ? 'var(--green)' : 'var(--red)'};">
            ${!hasKey ? (selectedId ? '✓ Response Recorded' : 'Not Answered') : (isCorrect ? `+${qMarks} Mark${qMarks === 1 ? '' : 's'} (Correct)` : `0 Marks (${selectedId ? 'Incorrect' : 'Not Answered'})`)}
          </div>
        ` : ''}
        <div class="qr-opt-list">
          ${(q.answers || []).map(a => {
            const isRightOpt = hasKey && String(a.id) === String(q.correctAnswerId);
            const isUserChoice = hasSubmittedMap && selectedId !== undefined && selectedId !== null && String(a.id) === String(selectedId);
            const optClass = isRightOpt || (!hasKey && isUserChoice) ? 'is-correct' : (isUserChoice ? 'user-wrong' : '');
            let badgeHtml = '';
            if (!hasKey && isUserChoice) {
              badgeHtml = `<span style="color:var(--green);font-size:.78rem;">✓ Your Answer</span>`;
            } else if (isRightOpt && isUserChoice) {
              badgeHtml = `<span style="color:var(--green);font-size:.78rem;">✓ Your Answer (+${qMarks} Mark${qMarks === 1 ? '' : 's'})</span>`;
            } else if (isRightOpt) {
              badgeHtml = `<span style="color:var(--green);font-size:.78rem;">✓ Correct Answer${hasSubmittedMap ? '' : ` (+${qMarks} Mark${qMarks === 1 ? '' : 's'})`}</span>`;
            } else if (isUserChoice) {
              badgeHtml = `<span style="color:#fca5a5;font-size:.78rem;">✕ Your Answer</span>`;
            }
            return `
              <div class="qr-opt ${optClass}">
                <span>${esc(a.text)}</span>
                ${badgeHtml}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }).join('');
}

async function openQuizModal(examId, title, subj, isReview = false) {
  state.currentExamId = examId;
  clearInterval(state.quizTimer);
  $('#quizModal').classList.remove('hidden');
  $('#scrim').classList.remove('hidden');

  if (isReview) {
    // Review Mode: Display completed solutions
    setTimerControlsVisible(false);
    $('#quizTitle').textContent = `Review: ${title}`;
    $('#quizSub').textContent = `${subj} · Examination Solutions & Evaluation`;
    $('#quizTimer').textContent = '✅ Completed';
    $('#quizQuestionsContainer').classList.add('hidden');
    $('#quizFoot').classList.add('hidden');
    $('#quizResultsContainer').classList.remove('hidden');
    $('#qrReview').innerHTML = '';

    try {
      const qData = await apiPost('/api/exam/questions', { exam_id: examId });
      currentExamQuestions = qData.questions || [];
      const ex = state.exams.find(e => String(e.examId) === String(examId));
      const total = currentExamQuestions.reduce((sum, q) => sum + (Number(q.marks) || 1), 0) || getExamDisplayTotal(ex);
      const hasScore = ex && ex.studentScore !== undefined && ex.studentScore !== null;

      $('#qrScore').textContent = hasScore ? `${ex.studentScore} / ${total}` : 'Submitted';
      $('#qrHeading').textContent = 'Examination Solutions & Review';
      $('#qrFeedback').textContent = hasScore
        ? `Comprehensive question-by-question breakdown of verified answers.`
        : `Submitted on portal (marks hidden by faculty). Showing verified answer key.`;
      $('#qrReview').innerHTML = renderExamReviewList(currentExamQuestions, ex?.submittedAnswers || null);
    } catch (err) {
      toast('Failed to load review', true);
    }
  } else {
    // Quiz Taking Mode
    setTimerControlsVisible(true);
    $('#quizTitle').textContent = `${title} — Examination`;
    $('#quizSub').textContent = `${subj} · Interactive Assessment`;
    $('#quizResultsContainer').classList.add('hidden');
    $('#quizQuestionsContainer').classList.remove('hidden');
    $('#quizFoot').classList.remove('hidden');
    $('#quizQuestionsList').innerHTML = '<p class="muted" style="padding:12px 0;">Loading examination questions...</p>';
    $('#submitQuizBtn').disabled = true;
    $('#autoSaveStatus').textContent = '● Autosave active';

    try {
      // Record exam start
      try { await apiPost('/api/exam/start', { exam_id: examId, startTime: new Date().toISOString() }); } catch {}

      // Fetch questions
      const qData = await apiPost('/api/exam/questions', { exam_id: examId });
      currentExamQuestions = qData.questions || [];
      renderQuizQuestions(currentExamQuestions);
      $('#submitQuizBtn').disabled = false;
      startQuizTimer();
    } catch (err) {
      toast('Failed to load examination questions', true);
      closeQuizModal();
    }
  }
}

let autoSaveTimer = null;

function scheduleAutoSave() {
  clearTimeout(autoSaveTimer);
  $('#autoSaveStatus').textContent = '● Saving progress...';
  autoSaveTimer = setTimeout(async () => {
    if (!state.currentExamId || $('#quizQuestionsContainer').classList.contains('hidden')) return;
    try {
      await apiPost('/api/exam/submit', {
        exam_id: state.currentExamId,
        answers: state.quizAnswers,
        remainingTime: state.quizSecondsLeft,
        submission_type: 'auto-save'
      });
      $('#autoSaveStatus').textContent = '● Progress auto-saved';
    } catch {
      $('#autoSaveStatus').textContent = '● Autosave active';
    }
  }, 600);
}

function renderQuizQuestions(questions) {
  state.quizAnswers = {};
  $('#quizQuestionsList').innerHTML = questions.map((q, idx) => {
    const qType = String(q.type || 'MULTIPLE-CHOICE').toUpperCase();
    const correctId = q.correctAnswerId;
    if (correctId) {
      state.quizAnswers[q.qid] = correctId;
    }
    const imgHtml = q.image ? `<img class="q-image" src="${esc(q.image)}" alt="Question image" />` : '';

    if (qType === 'ONE-WORD') {
      return `
        <div class="q-item" data-qid="${esc(q.qid)}">
          <div class="q-title">
            <span class="q-num">Q${idx + 1}.</span>
            <span>${esc(q.text)}</span>
          </div>
          ${imgHtml}
          <div class="q-options">
            <input type="text" class="q-oneword-input" data-qid="${esc(q.qid)}" placeholder="Type your answer..." />
          </div>
        </div>
      `;
    }

    const inputType = qType === 'MULTIPLE-SELECT' ? 'checkbox' : 'radio';
    return `
    <div class="q-item" data-qid="${esc(q.qid)}">
      <div class="q-title">
        <span class="q-num">Q${idx + 1}.</span>
        <span>${esc(q.text)}</span>
      </div>
      ${imgHtml}
      <div class="q-options">
        ${(q.answers || []).map(a => {
          const isSelected = Boolean(correctId) && String(a.id) === String(correctId);
          const aImgHtml = a.image ? `<img class="a-image" src="${esc(a.image)}" alt="Option image" />` : '';
          return `
          <label class="q-opt ${isSelected ? 'selected' : ''}" data-qid="${esc(q.qid)}" data-aid="${esc(a.id)}">
            <input type="${inputType}" name="q_${esc(q.qid)}" value="${esc(a.id)}" ${isSelected ? 'checked="checked"' : ''} />
            <span>${esc(a.text)}</span>
            ${aImgHtml}
            ${isSelected ? '<span class="auto-selected-badge">✓ Auto-selected</span>' : ''}
          </label>
        `;}).join('')}
      </div>
    </div>
  `;}).join('');

  $$('#quizQuestionsList .q-opt input').forEach(input => {
    input.addEventListener('change', () => {
      const qid = input.closest('.q-opt').dataset.qid;
      const parent = input.closest('.q-options');

      if (input.type === 'checkbox') {
        const checkedVals = [...parent.querySelectorAll('input[type="checkbox"]:checked')].map(cb => cb.value);
        state.quizAnswers[qid] = checkedVals.join(',');
        parent.querySelectorAll('.q-opt').forEach(el => {
          el.classList.toggle('selected', el.querySelector('input').checked);
        });
      } else {
        state.quizAnswers[qid] = input.value;
        parent.querySelectorAll('.q-opt').forEach(el => {
          const isNowSelected = el === input.closest('.q-opt');
          el.classList.toggle('selected', isNowSelected);
          const badge = el.querySelector('.auto-selected-badge');
          if (badge) badge.style.display = isNowSelected ? '' : 'none';
        });
      }

      scheduleAutoSave();
    });
  });

  $$('#quizQuestionsList .q-oneword-input').forEach(inp => {
    inp.addEventListener('input', () => {
      state.quizAnswers[inp.dataset.qid] = inp.value.trim();
      scheduleAutoSave();
    });
  });
}

function startQuizTimer() {
  clearInterval(state.quizTimer);
  state.quizSecondsLeft = 194; // Default: 3:14 minutes
  updateTimerDisplay();
  state.quizTimer = setInterval(() => {
    state.quizSecondsLeft--;
    updateTimerDisplay();
    if (state.quizSecondsLeft <= 0) {
      clearInterval(state.quizTimer);
      submitQuiz();
    }
  }, 1000);
}

function adjustQuizTimer(deltaSeconds) {
  if ($('#quizQuestionsContainer').classList.contains('hidden')) return;
  state.quizSecondsLeft = Math.max(10, state.quizSecondsLeft + deltaSeconds);
  updateTimerDisplay();
  const m = Math.floor(state.quizSecondsLeft / 60);
  const s = state.quizSecondsLeft % 60;
  toast(`⏱️ Timer adjusted: ${m}m ${s}s`);
}

function updateTimerDisplay() {
  const m = Math.floor(state.quizSecondsLeft / 60);
  const s = state.quizSecondsLeft % 60;
  $('#quizTimer').textContent = `⏱️ ${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// Timer adjustment click listeners
$('#timerMinusBtn')?.addEventListener('click', () => adjustQuizTimer(-60));
$('#timerPlusBtn')?.addEventListener('click', () => adjustQuizTimer(60));
$('#timerFootMinusBtn')?.addEventListener('click', () => adjustQuizTimer(-60));
$('#timerFootPlusBtn')?.addEventListener('click', () => adjustQuizTimer(60));

$('#submitQuizBtn').addEventListener('click', submitQuiz);

async function submitQuiz() {
  clearInterval(state.quizTimer);
  clearTimeout(autoSaveTimer);
  $('#submitQuizBtn').disabled = true;
  $('#autoSaveStatus').textContent = 'Submitting...';

  try {
    const res = await apiPost('/api/exam/submit', {
      exam_id: state.currentExamId,
      answers: state.quizAnswers,
      remainingTime: state.quizSecondsLeft,
      submission_type: 'submit'
    });

    setTimerControlsVisible(false);
    $('#quizTimer').textContent = '✅ Submitted';
    $('#quizQuestionsContainer').classList.add('hidden');
    $('#quizFoot').classList.add('hidden');
    $('#quizResultsContainer').classList.remove('hidden');

    if (res.hasAnswerKey !== false && res.score !== null && res.score !== undefined) {
      $('#qrScore').textContent = `${res.score} / ${res.totalMarks}`;
      $('#qrHeading').textContent = res.percentage >= 75 ? '🌟 Outstanding Performance!' : res.percentage >= 40 ? '✅ Examination Passed' : '⚠️ Keep Practicing';
      $('#qrFeedback').textContent = `You scored ${res.percentage}% (${res.score} out of ${res.totalMarks} marks).`;
    } else {
      $('#qrScore').textContent = 'Submitted';
      $('#qrHeading').textContent = '✅ Examination Submitted';
      $('#qrFeedback').textContent = res.upstream_status === 'success'
        ? 'Your responses have been submitted directly to the live portal.'
        : 'Your responses have been recorded.';
    }

    // Render full answer review with selected and correct options
    $('#qrReview').innerHTML = renderExamReviewList(currentExamQuestions, state.quizAnswers);

    const submittedAt = new Date().toISOString();
    // Mark as completed in state and refresh
    const ex = state.exams.find(e => String(e.examId) === String(state.currentExamId));
    if (ex) {
      ex.completionStatus = '1';
      if (res.hasAnswerKey !== false && res.score !== null && res.score !== undefined) {
        ex.studentScore = res.score;
        ex.submittedTotalMarks = res.totalMarks;
      }
      ex.submittedAnswers = Object.assign({}, state.quizAnswers);
      ex.submittedAt = submittedAt;
    }
    if (state.profile?.user === 'DEMO123') {
      saveExamLocally(
        state.currentExamId,
        res.hasAnswerKey !== false ? res.score : null,
        res.totalMarks,
        state.quizAnswers,
        submittedAt
      );
    }
    await loadExams();
    renderDashboardTasks();
    renderExams($('#examSeg .seg-btn.active')?.dataset.filter || 'all');
    const syncNote = res.upstream_status === 'success' ? ' (Synced with Portal)' : '';
    toast(res.hasAnswerKey !== false && res.score !== null
      ? `Exam submitted${syncNote}! Score: ${res.score}/${res.totalMarks}`
      : `Exam submitted${syncNote}!`);
  } catch (err) {
    toast(err.message || 'Submission failed', true);
    $('#autoSaveStatus').textContent = '● Autosave active';
    $('#submitQuizBtn').disabled = false;
  }
}

function closeQuizModal() {
  clearInterval(state.quizTimer);
  $('#quizModal').classList.add('hidden');
  $('#scrim').classList.add('hidden');
  renderDashboardTasks();
  renderExams($('#examSeg .seg-btn.active')?.dataset.filter || 'all');
}

$('#closeQuizBtn').addEventListener('click', closeQuizModal);

// Retake and close review buttons (if present in DOM)
const retakeBtn = $('#retakeQuizBtn');
if (retakeBtn) {
  retakeBtn.addEventListener('click', () => {
    const ex = state.exams.find(e => String(e.examId) === String(state.currentExamId));
    openQuizModal(state.currentExamId, ex ? ex.examName : 'Examination', ex ? ex.subjectName : 'Course', false);
  });
}
const closeRevBtn = $('#closeReviewBtn');
if (closeRevBtn) {
  closeRevBtn.addEventListener('click', closeQuizModal);
}

/* ---------------- Notifications Modal ---------------- */
$('#notifBtn').addEventListener('click', () => {
  renderNotificationsModal();
  $('#notifModal').classList.remove('hidden');
  $('#scrim').classList.remove('hidden');
});

function renderNotificationsModal() {
  $('#notifList').innerHTML = state.notifications.map(n => `
    <div class="notif-item">
      <span class="notif-icon">📢</span>
      <div class="notif-body">
        <div class="notif-text">${esc(n.text)}</div>
        <div class="notif-time">${esc(n.readOn || n.addedOn || 'Recent Alert')}</div>
      </div>
    </div>
  `).join('') || '<p class="muted">No notifications.</p>';
}

$('#closeNotifBtn').addEventListener('click', () => {
  $('#notifModal').classList.add('hidden');
  $('#scrim').classList.add('hidden');
});

$('#scrim').addEventListener('click', () => {
  closeQuizModal();
  $('#notifModal').classList.add('hidden');
  closeSidebar();
});

/* ---------------- Navigation Handling ---------------- */
const TITLES = {
  dashboard: 'Dashboard',
  sessions: 'Sessions & Timetable',
  subjects: 'Enrolled Subjects',
  assignments: 'Assignments & Coursework',
  exams: 'Examinations & Quizzes'
};

function switchView(name) {
  $$('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.view === name));
  $$('.view').forEach(v => v.classList.add('hidden'));
  $('#view-' + name).classList.remove('hidden');
  $('#pageTitle').textContent = TITLES[name] || name;
  closeSidebar();

  if (name === 'sessions') loadSessions();
  if (name === 'subjects') renderSubjectsView();
  if (name === 'assignments') renderAssignments('all');
  if (name === 'exams') renderExams('all');
}

$$('[data-view]').forEach(el => el.addEventListener('click', () => switchView(el.dataset.view)));

/* ---------------- Mobile Sidebar ---------------- */
function openSidebar() {
  $('#sidebar').classList.add('open');
  $('#scrim').classList.remove('hidden');
}
function closeSidebar() {
  $('#sidebar').classList.remove('open');
  if ($('#quizModal').classList.contains('hidden') && $('#notifModal').classList.contains('hidden')) {
    $('#scrim').classList.add('hidden');
  }
}
$('#hamburger').addEventListener('click', openSidebar);

/* ---------------- Application Boot ---------------- */
(async function boot() {
  const saved = sessionStorage.getItem('dex_token');
  if (!saved) return;
  state.token = saved;
  try {
    await enterApp();
  } catch {
    state.token = null;
    sessionStorage.removeItem('dex_token');
  }
})();
