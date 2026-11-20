# Pilla — Attendance & Student Portal (Full HAR Integration)

A comprehensive, self-contained student attendance, examination, and coursework management portal reconstructed from two complete HAR captures:
1. **`vm.zvx.workers.dev.har`**: Cloudflare Worker API proxy & authentication wrapper.
2. **`Test.har`**: `portal.vmedulife.com` complete session capture for Oriental Institute of Science & Technology (OIST Bhopal).

Zero external dependencies, no build step. Runs out-of-the-box with native Node.js standard libraries.

---

## Quick Start

```bash
node server.js
```

Then visit:
- **Modern UI**: [http://localhost:3000](http://localhost:3000)
- **Classic UI**: [http://localhost:3000/classic/](http://localhost:3000/classic/)

### Integrated Accounts (From HAR Captures)

| Account | Username | Password | Role / Stream | Real Metrics |
|---|---|---|---|---|
| **Shivang Saxena** | `STOIST25963` | `Shiv10` | B.Tech CSE (AIML), 15 Subjects | 38 Present / 30 Absent (55.88%) |
| **Ayush Katare** | `STOIST251161` | `Cwbqs$09` | B.Tech CSE, 11 Subjects | 37 Present / 31 Absent (54.41%) |
| **Demo Student** | `DEMO123` | `demo` | B.Tech CSE Demo Account | 37 Present / 31 Absent (54.41%) |

*(Note: Invalid passwords like `shiv10` return status `401 {"detail":"Portal authentication failed"}` exactly matching HAR entry #26.)*

---

## What's Included

### 1. Attendance & Timetable Management
- Deterministic seeding of 68 sessions per student matching exact metrics from HAR captures.
- Real timetable sessions for September 2026 with exact faculty names, time slots, and subject details.
- Toggle between **Present** and **Absent** with live recalculation of KPIs, gauge progress, and subject averages.
- Filter by date range (with quick presets for HAR captured dates) or filter by enrolled subject.

### 2. Interactive Examination & Quiz System (`Test.har`)
- All **25 real examinations** from `portal.vmedulife.com` (Pending & Completed status).
- Interactive examination module for **Exam 125821 ("unit 2 — stack And Queue" / DATA STRUCTURE)**:
  - 10 multiple-choice questions with marks and answer choices.
  - Interactive timer countdown (30 mins).
  - Progress auto-saving.
  - Automated grading upon submission, detailed score review, and real-time status update.

### 3. Coursework & Assignments
- Structured lab experiments and theory assignments with deadlines and completion statuses.
- Filterable by All, Pending, and Completed.

### 4. Live Scheduling Notifications (`Test.har`)
- 10 real lecture and lab session notifications from Oriental Institute of Science & Technology.
- Notification bell in header with unread badge counter and slide-out modal.

### 5. Institutional & Academic Profile (`Test.har`)
- Institute: **Oriental Institute of Science & Technology, Bhopal** (OIST-Bhopal).
- Mentor: **Sapna Raikwar** (Assistant Professor).
- Fees Status: **₹63,500 Paid** (100% Cleared · Zero Balance).
- LMS Course: **Analysis of Raw Data** (ZWZLG5WN).

---

## API Reference

### Primary Worker API (`vm.zvx.workers.dev`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/initialize` | Authenticates student credentials, generates JWT `dex_token`. |
| `GET` | `/api/getID` | Returns student profile, institutional metadata, and dynamic attendance metrics. |
| `GET` | `/api/getSession/options` | Returns active stream, semester, and enrolled subject list. |
| `POST` | `/api/getSession` | Lists class sessions filtered by date range (`date_from`/`date_to`) or `subject_id`. |
| `POST` | `/api/present` | Toggles session to Present and recalculates metrics. |
| `POST` | `/api/absent` | Toggles session to Absent and recalculates metrics. |
| `POST` | `/api/getExams` | Returns list of 25 quizzes/exams with pending and completed counts. |
| `POST` | `/api/exam/questions` | Returns full question list for an exam (e.g. Exam 125821). |
| `POST` | `/api/exam/submit` | Evaluates answers, records score, and marks exam completed. |
| `POST` | `/api/getAssignments` | Returns coursework assignments list. |
| `GET` | `/api/getNotifications` | Returns 10 session scheduling alerts and notices. |
| `POST` | `/api/logout` | Revokes the current `dex_token`. |
| `POST` | `/api/admin/login` | Administrative login endpoint. |

### Upstream Portal Compatibility Endpoints (`portal.vmedulife.com`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/generic_api.php` | Returns institute data (`getInstituteDataByURL`). |
| `POST` | `/api/instructor/onlineExam.php` | Native exam queries and question list handlers. |
| `POST` | `/api/webNotification/webNotification.php` | Native web notifications endpoint. |
| `POST` | `/api/studentSummary/studentSummary.php` | Summary, vision, and mission data. |
| `POST` | `/api/mentoring/mentoring.php` | Mentor details. |
| `POST` | `/api/fees/...` | Fee installment and balance queries. |
| `POST` | `/api/lms/lms.php` | LMS course details. |
| `GET` | `/student/learnerModuleNavigation.json` | 24-module learner navigation JSON. |

---

## Project Structure

```
├── server.js            # Standalone Node.js HTTP server (APIs + JWT + Router)
├── data.js              # Complete integrated dataset from both HAR files
├── public/              # Modern UI
│   ├── index.html       # Single-page interface with exam modal & notifications
│   ├── app.js           # Interactive client logic
│   └── styles.css       # Responsive theme styling
├── public-classic/      # Classic fallback UI
│   ├── index.html       # Minimal classic view
│   ├── app.js           # Classic client logic
│   └── styles.css       # Classic styling
└── package.json
```
