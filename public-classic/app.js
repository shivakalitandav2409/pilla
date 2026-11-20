/* Attendance Portal — frontend (Classic UI) */
'use strict';

const $ = (s) => document.querySelector(s);
const state = { token: null, subjects: [] };

/* ---------------- API helper ---------------- */
async function api(path, { method = 'POST', body, auth = true } = {}) {
  const opts = { method, headers: {} };
  if (body || auth) {
    const payload = Object.assign({}, body);
    if (auth && state.token) payload.dex_token = state.token;
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(payload);
  }
  const res = await fetch(path, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.detail || 'Request failed'), { status: res.status, data });
  return data;
}

async function apiGet(path) {
  const url = `${path}${path.includes('?') ? '&' : '?'}dex_token=${encodeURIComponent(state.token)}`;
  const res = await fetch(url);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.detail || 'Request failed'), { status: res.status });
  return data;
}

/* ---------------- Toast ---------------- */
let toastTimer;
function toast(msg, isErr = false) {
  const t = $('#toast');
  t.textContent = msg;
  t.className = 'toast' + (isErr ? ' err' : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hidden'), 2600);
}

/* ---------------- Account Buttons ---------------- */
document.querySelectorAll('.classic-acc-btn').forEach(b => {
  b.addEventListener('click', () => {
    $('#username').value = b.dataset.user;
    $('#password').value = b.dataset.pass;
  });
});

/* ---------------- Auth ---------------- */
$('#loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  $('#loginError').textContent = '';
  $('#loginBtn').disabled = true;
  try {
    const data = await api('/api/initialize', {
      auth: false,
      body: { username: $('#username').value.trim(), password: $('#password').value },
    });
    state.token = data.dex_token;
    sessionStorage.setItem('dex_token', state.token);
    await enterApp();
  } catch (err) {
    $('#loginError').textContent = err.data?.detail || 'Invalid credentials';
  } finally {
    $('#loginBtn').disabled = false;
  }
});

$('#logoutBtn').addEventListener('click', async () => {
  try { await api('/api/logout'); } catch {}
  state.token = null;
  sessionStorage.removeItem('dex_token');
  $('#appView').classList.add('hidden');
  $('#loginView').classList.remove('hidden');
});

/* ---------------- Enter app ---------------- */
async function enterApp() {
  $('#loginView').classList.add('hidden');
  $('#appView').classList.remove('hidden');
  await Promise.all([loadProfile(), loadOptions()]);
  // default date range
  $('#dateFrom').value = '2026-09-01';
  $('#dateTo').value = '2026-09-15';
  await loadSessions();
}

/* ---------------- Profile + metrics ---------------- */
async function loadProfile() {
  const p = await apiGet('/api/getID');
  $('#whoami').textContent = p.name ? `${p.name} (${p.user})` : p.user;
  $('#pName').textContent = p.name;
  $('#avatar').textContent = (p.name || '?').trim().charAt(0).toUpperCase();
  $('#pUser').textContent = p.user;
  $('#pStuid').textContent = 'ID ' + p.stuid;
  $('#pEmail').textContent = p.email;
  renderMetrics(p.attendance_metrics);
}

function renderMetrics(m) {
  $('#sPresent').textContent = m.present_count;
  $('#sAbsent').textContent = m.absent_count;
  $('#sTotal').textContent = m.total_sessions;
  $('#sAvg').textContent = m.average_pct + '%';
  const pct = m.present_pct;
  $('#ringPct').textContent = Math.round(pct) + '%';
  const r = 52, circ = 2 * Math.PI * r;
  const fg = $('#ringFg');
  fg.style.strokeDasharray = circ;
  fg.style.strokeDashoffset = circ * (1 - pct / 100);
  fg.style.stroke = pct >= 75 ? 'var(--green)' : pct >= 50 ? '#f0b429' : 'var(--red)';
}

/* ---------------- Options (subjects) ---------------- */
async function loadOptions() {
  const o = await apiGet('/api/getSession/options');
  state.subjects = o.subjects || [];
  const sel = $('#subject');
  sel.innerHTML = '';
  for (const s of state.subjects) {
    const opt = document.createElement('option');
    opt.value = s.subject_id;
    opt.textContent = s.display_name || s.subject_name;
    sel.appendChild(opt);
  }
}

/* ---------------- Sessions ---------------- */
$('#mode').addEventListener('change', () => {
  const subj = $('#mode').value === 'subject';
  document.querySelectorAll('.date-field').forEach((el) => el.classList.toggle('hidden', subj));
  $('.subject-field').classList.toggle('hidden', !subj);
});
$('#loadBtn').addEventListener('click', loadSessions);

async function loadSessions() {
  const mode = $('#mode').value;
  const body = { mode };
  if (mode === 'subject') body.subject_id = $('#subject').value;
  else { body.date_from = $('#dateFrom').value; body.date_to = $('#dateTo').value; }
  const data = await api('/api/getSession', { body });
  renderSessions(data.items);
}

function renderSessions(items) {
  const list = $('#sessionList');
  list.innerHTML = '';
  if (!items || !items.length) {
    list.innerHTML = '<div class="empty">No sessions found for this selection.</div>';
    return;
  }
  for (const it of items) list.appendChild(sessionCard(it));
}

function sessionCard(it) {
  const present = it.attendance_status === 'Present';
  const el = document.createElement('div');
  el.className = 'session ' + (present ? 'present' : 'absent');
  const simNote = it.simulated_status ? `<span class="sim">● modified (was ${it.source_status})</span>` : '';
  el.innerHTML = `
    <div class="meta">
      <div class="subj">${esc(it.subject_name)}</div>
      <div class="sub">
        <span>📅 ${it.date}</span>
        <span>🕑 ${esc(it.time_slot)}</span>
        <span>👤 ${esc(it.faculty_name || 'Faculty Staff')}</span>
      </div>
    </div>
    <span class="badge ${present ? 'present' : 'absent'}">${it.attendance_status}</span>
    ${simNote}
    <div class="toggle">
      <button data-act="present" class="${present ? 'on-present' : ''}">Present</button>
      <button data-act="absent" class="${!present ? 'on-absent' : ''}">Absent</button>
    </div>`;
  el.querySelector('[data-act="present"]').onclick = () => mark('present', it, el);
  el.querySelector('[data-act="absent"]').onclick = () => mark('absent', it, el);
  return el;
}

async function mark(act, it, el) {
  if (it.attendance_status.toLowerCase() === act) return;
  el.querySelectorAll('button').forEach((b) => (b.disabled = true));
  try {
    const r = await api('/api/' + act, { body: { session_id: it.session_id, session_index: it.session_index } });
    it.attendance_status = r.new_status;
    it.simulated_status = r.new_status === it.source_status ? null : r.new_status;
    renderMetrics(r.attendance_metrics);
    const fresh = sessionCard(it);
    el.replaceWith(fresh);
    toast(`Marked ${r.new_status} · ${shortSubj(r.subject_name)}`);
  } catch (err) {
    el.querySelectorAll('button').forEach((b) => (b.disabled = false));
    toast(err.message || 'Failed to update', true);
  }
}

/* ---------------- Assignments / Exams ---------------- */
async function loadAssignments() {
  const d = await api('/api/getAssignments');
  const el = $('#assignmentList');
  if (!d.assignments || !d.assignments.length) {
    el.innerHTML = '<div class="empty">No assignments found.</div>';
    return;
  }
  el.innerHTML = d.assignments.map(a => `
    <div class="session ${a.status === 'Completed' ? 'present' : 'absent'}">
      <div class="meta">
        <div class="subj">${esc(a.title)}</div>
        <div class="sub">
          <span>📚 ${esc(a.subject_name)}</span>
          <span>📅 Due: ${esc(a.due_date)}</span>
          <span>🎯 Marks: ${esc(a.marks)}</span>
        </div>
      </div>
      <span class="badge ${a.status === 'Completed' ? 'present' : 'absent'}">${esc(a.status)}</span>
    </div>
  `).join('');
}

async function loadExams() {
  const d = await api('/api/getExams');
  const el = $('#examList');
  if (!d.exams || !d.exams.length) {
    el.innerHTML = '<div class="empty">No exams scheduled.</div>';
    return;
  }
  el.innerHTML = d.exams.map(e => `
    <div class="session ${e.completionStatus === '1' ? 'present' : 'absent'}">
      <div class="meta">
        <div class="subj">${esc(e.examName)} (${esc(e.subjectName)})</div>
        <div class="sub">
          <span>📖 Syllabus: ${esc(e.examSyllabus || 'General')}</span>
          <span>⏱️ Duration: 30 Mins</span>
        </div>
      </div>
      <span class="badge ${e.completionStatus === '1' ? 'present' : 'absent'}">
        ${e.completionStatus === '1' ? 'Completed' : 'Pending'}
      </span>
    </div>
  `).join('');
}

/* ---------------- Tabs ---------------- */
document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    const name = tab.dataset.tab;
    document.querySelectorAll('.tabpane').forEach((p) => p.classList.add('hidden'));
    $('#tab-' + name).classList.remove('hidden');
    if (name === 'assignments') loadAssignments();
    if (name === 'exams') loadExams();
  });
});

/* ---------------- Utils ---------------- */
function esc(s) { return String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function shortSubj(s) { return String(s).split('(')[0].trim(); }

/* ---------------- Boot ---------------- */
(async function boot() {
  const saved = sessionStorage.getItem('dex_token');
  if (!saved) return;
  state.token = saved;
  try { await enterApp(); }
  catch { state.token = null; sessionStorage.removeItem('dex_token'); }
})();
