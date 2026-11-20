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
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw Object.assign(new Error(data.detail || 'Request failed'), { status: res.status, data });
  }
  return data;
}

async function apiGet(path) {
  const url = `${path}${path.includes('?') ? '&' : '?'}dex_token=${encodeURIComponent(state.token || '')}`;
  const res = await fetch(url);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw Object.assign(new Error(data.detail || 'Request failed'), { status: res.status, data });
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

  // Default date range: September 2026 HAR dates
  $('#dateFrom').value = '2026-09-01';
  $('#dateTo').value = '2026-09-15';

  renderDashboard();
  switchView('dashboard');
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
    state.assignments = d.assignments || [];
    const pending = state.assignments.filter(a => a.status === 'Pending').length;
    $('#sideAssBadge').textContent = pending || '';
  } catch {}
}

async function loadExams() {
  try {
    const d = await apiPost('/api/getExams');
    state.exams = d.exams || [];
    const pending = state.exams.filter(e => e.completionStatus === '0').length;
    $('#sideExamBadge').textContent = pending || '';
    $('#examPendingCount').textContent = pending;
    $('#examCompletedCount').textContent = state.exams.length - pending;
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
    return `
      <div class="card ass-card">
        <div>
          <div class="ass-top">
            <span class="code" style="font-size:.78rem;font-weight:700;color:var(--accent);background:var(--accent-soft);padding:3px 9px;border-radius:7px;">${esc(a.subject_name)}</span>
            <span class="ass-status ${isComp ? 'completed' : 'pending'}">${esc(a.status)}</span>
          </div>
          <h3 class="ass-title">${esc(a.title)}</h3>
          <div class="ass-meta">
            <span>📅 Due Date: <b>${esc(a.due_date)}</b></span>
            <span>🎯 Max Marks: <b>${esc(a.marks)}</b></span>
            ${a.submitted_on ? `<span>✅ Submitted On: ${esc(a.submitted_on)}</span>` : ''}
          </div>
        </div>
        <div class="ass-foot">
          <span class="muted" style="font-size:.82rem;">${esc(a.subject_type)} Coursework</span>
          <span style="font-weight:600;font-size:.86rem;color:${isComp ? 'var(--green)' : 'var(--amber)'}">
            ${isComp ? 'Verified' : 'Action Required'}
          </span>
        </div>
      </div>
    `;
  }).join('');
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
  let list = state.exams;
  if (filter !== 'all') {
    list = list.filter(e => e.completionStatus === filter);
  }

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
    const hasQuiz = e.hasQuestions || e.examId === '125821';
    const faculties = (e.subjectFaculties || []).map(f => f.FacultyName).join(', ');

    return `
      <div class="card exam-card">
        <div>
          <div class="exam-top">
            <span class="code" style="font-size:.78rem;font-weight:700;color:var(--accent);background:var(--accent-soft);padding:3px 9px;border-radius:7px;">
              ${esc(e.subjectName)} (${esc(e.subjectType)})
            </span>
            <span class="exam-status ${isComp ? 'completed' : 'pending'}">
              ${isComp ? 'Completed' : 'Pending'}
            </span>
          </div>
          <h3 class="exam-title">${esc(e.examName)}</h3>
          <div class="exam-meta">
            <span>📖 Syllabus: <b>${esc(e.examSyllabus || 'Full Syllabus')}</b></span>
            <span>👤 Faculty: <b>${esc(faculties || 'Department Faculty')}</b></span>
            <span>⏱️ Duration: <b>30 Mins</b> · 10 Questions</span>
          </div>
        </div>
        <div class="exam-foot">
          <span class="muted" style="font-size:.82rem;">Exam ID: #${esc(e.examId)}</span>
          ${hasQuiz ? `
            <button class="quiz-btn" data-exam-id="${esc(e.examId)}" data-exam-title="${esc(e.examName)}" data-exam-subj="${esc(e.subjectName)}">
              ${isComp ? 'Review Answers ↗' : 'Take Quiz ⏱️'}
            </button>
          ` : `
            <span style="font-size:.82rem;font-weight:600;color:${isComp ? 'var(--green)' : 'var(--muted)'}">
              ${isComp ? 'Record Saved' : 'Class Scheduled'}
            </span>
          `}
        </div>
      </div>
    `;
  }).join('');

  $$('.quiz-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      openQuizModal(btn.dataset.examId, btn.dataset.examTitle, btn.dataset.examSubj);
    });
  });
}

/* ---------------- Interactive Quiz Modal ---------------- */
async function openQuizModal(examId, title, subj) {
  state.currentExamId = examId;
  $('#quizTitle').textContent = `${title} — Examination`;
  $('#quizSub').textContent = `${subj} · Interactive Assessment`;

  $('#quizResultsContainer').classList.add('hidden');
  $('#quizQuestionsContainer').classList.remove('hidden');
  $('#quizFoot').classList.remove('hidden');
  $('#submitQuizBtn').disabled = false;

  $('#quizModal').classList.remove('hidden');
  $('#scrim').classList.remove('hidden');

  // Load questions
  const qData = await apiPost('/api/exam/questions', { exam_id: examId });
  renderQuizQuestions(qData.questions || []);

  // Timer
  startQuizTimer();
}

function renderQuizQuestions(questions) {
  state.quizAnswers = {};
  $('#quizQuestionsList').innerHTML = questions.map((q, idx) => `
    <div class="q-item" data-qid="${esc(q.qid)}">
      <div class="q-title">
        <span class="q-num">Q${idx + 1}.</span>
        <span>${esc(q.text)}</span>
      </div>
      <div class="q-options">
        ${q.answers.map(a => `
          <label class="q-opt" data-qid="${esc(q.qid)}" data-aid="${esc(a.id)}">
            <input type="radio" name="q_${esc(q.qid)}" value="${esc(a.id)}" />
            <span>${esc(a.text)}</span>
          </label>
        `).join('')}
      </div>
    </div>
  `).join('');

  $$('.q-opt input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const qid = radio.closest('.q-opt').dataset.qid;
      const aid = radio.value;
      state.quizAnswers[qid] = aid;

      // Visual update
      const parent = radio.closest('.q-options');
      parent.querySelectorAll('.q-opt').forEach(el => el.classList.remove('selected'));
      radio.closest('.q-opt').classList.add('selected');

      $('#autoSaveStatus').textContent = '● Progress saved';
    });
  });
}

function startQuizTimer() {
  clearInterval(state.quizTimer);
  state.quizSecondsLeft = 1800; // 30 minutes
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

function updateTimerDisplay() {
  const m = Math.floor(state.quizSecondsLeft / 60);
  const s = state.quizSecondsLeft % 60;
  $('#quizTimer').textContent = `⏱️ ${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

$('#submitQuizBtn').addEventListener('click', submitQuiz);

async function submitQuiz() {
  clearInterval(state.quizTimer);
  $('#submitQuizBtn').disabled = true;
  $('#autoSaveStatus').textContent = 'Submitting...';

  try {
    const res = await apiPost('/api/exam/submit', {
      exam_id: state.currentExamId,
      answers: state.quizAnswers,
      submission_type: 'submit'
    });

    $('#quizQuestionsContainer').classList.add('hidden');
    $('#quizFoot').classList.add('hidden');
    $('#quizResultsContainer').classList.remove('hidden');

    $('#qrScore').textContent = `${res.score} / ${res.totalMarks}`;
    $('#qrHeading').textContent = res.percentage >= 75 ? '🌟 Outstanding Performance!' : res.percentage >= 40 ? '✅ Examination Passed' : '⚠️ Keep Practicing';
    $('#qrFeedback').textContent = `You scored ${res.percentage}% (${res.score} out of ${res.totalMarks} questions correct).`;

    // Render answer review
    $('#qrReview').innerHTML = (res.questionResults || []).map((qr, i) => `
      <div class="qr-item ${qr.isCorrect ? 'correct' : 'incorrect'}">
        <strong>Question ${i + 1}: ${qr.isCorrect ? '✓ Correct (+1 Mark)' : '✕ Incorrect (0 Marks)'}</strong>
      </div>
    `).join('');

    // Mark as completed in state and refresh
    const ex = state.exams.find(e => e.examId === state.currentExamId);
    if (ex) ex.completionStatus = '1';
    await loadExams();
    toast(`Exam submitted successfully! Score: ${res.score}/${res.totalMarks}`);
  } catch (err) {
    toast(err.message || 'Submission failed', true);
    $('#submitQuizBtn').disabled = false;
  }
}

function closeQuizModal() {
  clearInterval(state.quizTimer);
  $('#quizModal').classList.add('hidden');
  $('#scrim').classList.add('hidden');
  renderExams($('#examSeg .seg-btn.active').dataset.filter);
}

$('#closeQuizBtn').addEventListener('click', closeQuizModal);

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
