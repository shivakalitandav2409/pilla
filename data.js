/* 
 * Pilla Data Layer
 * Reconstructed from:
 * 1. vm.zvx.workers.dev.har (API proxy & live wrapper)
 * 2. Test.har (portal.vmedulife.com capture)
 */
'use strict';

const INSTITUTE = {
  id: 987,
  name: "Oriental Institute of Science & Technology, Bhopal",
  shortName: "OIST-Bhopal",
  location: "Bhopal",
  url: "oist-bhopal",
  logo: "https://s3.ap-south-1.amazonaws.com/vmedulife-s3/logo/03-01-2023-LOGO-987-1672707662.png",
  secondaryLogo: "https://s3.ap-south-1.amazonaws.com/vmedulife-s3/logo/03-01-2023-LOGO-987-1672707662.png",
  bannerImage: "",
  vision: "To produce competent engineers and leaders capable of meeting the challenges of engineering and technological world.",
  mission: "To impart quality technical education and instill professional ethics, critical thinking and entrepreneurial spirit among students."
};

const USERS = {
  "STOIST25963": {
    username: "STOIST25963",
    password: "Shiv10",
    name: "SHIVANG SAXENA",
    mobile: "6265740933",
    email: "shivangsaxena1011@gmail.com",
    dp_url: "https://s3.ap-south-1.amazonaws.com/vmedulife-s3/dp/SHIVANG-SAXENA-696dd1ad8f79c.jpeg",
    stuid: "580789",
    streamName: "B. Tech (CSE Artificial Intelligence and Machine Learning)",
    sid: 1084,
    groupid: 101182,
    acayr: 12,
    mentor: {
      mentorName: "Sapna Raikwar",
      mentorId: 13245,
      designation: "Assistant Professor",
      instituteName: "Oriental Institute of Science & Technology, Bhopal",
      instituteShortName: "OIST-Bhopal"
    },
    fees: {
      totalAmount: 63500,
      paid: 63500,
      balance: 0,
      percentage: 100,
      status: "Fully Paid"
    },
    streams: [
  {
    "sid": 1084,
    "groupid": null,
    "name": "B. Tech (CSE Artificial Intelligence and Machine Learning)"
  },
  {
    "sid": 1084,
    "groupid": 101182,
    "name": null
  }
],
    subjects: [
  {
    "subject_id": 240848,
    "subject_name": "AI",
    "course_code": "AL 304",
    "subject_type": "Theory",
    "subject_choice": "regular",
    "groupid": 101182,
    "sid": 1084,
    "batchid": 0,
    "display_name": "AI(AL 304) ( Theory | Regular )"
  },
  {
    "subject_id": 246499,
    "subject_name": "AI",
    "course_code": "al304",
    "subject_type": "Practical",
    "subject_choice": "regular",
    "groupid": 101182,
    "sid": 1084,
    "batchid": 70134,
    "display_name": "AI(al304) ( Practical | Regular )"
  },
  {
    "subject_id": 241777,
    "subject_name": "AI",
    "course_code": "AL 304",
    "subject_type": "Practical",
    "subject_choice": "elective",
    "groupid": 101182,
    "sid": 1084,
    "batchid": 25820,
    "display_name": "AI(AL 304) ( Practical | Elective )"
  },
  {
    "subject_id": 246500,
    "subject_name": "computer workshop",
    "course_code": "al--306",
    "subject_type": "Practical",
    "subject_choice": "regular",
    "groupid": 101182,
    "sid": 1084,
    "batchid": 70134,
    "display_name": "computer workshop(al--306) ( Practical | Regular )"
  },
  {
    "subject_id": 241779,
    "subject_name": "COMPUTER WORKSHOP- ITP",
    "course_code": "AL-306",
    "subject_type": "Practical",
    "subject_choice": "elective",
    "groupid": 101182,
    "sid": 1084,
    "batchid": 25816,
    "display_name": "COMPUTER WORKSHOP- ITP(AL-306) ( Practical | Elective )"
  },
  {
    "subject_id": 246498,
    "subject_name": "data structure",
    "course_code": "al--303",
    "subject_type": "Practical",
    "subject_choice": "regular",
    "groupid": 101182,
    "sid": 1084,
    "batchid": 70134,
    "display_name": "data structure(al--303) ( Practical | Regular )"
  },
  {
    "subject_id": 240847,
    "subject_name": "DATA STRUCTURE",
    "course_code": "AL-303",
    "subject_type": "Theory",
    "subject_choice": "regular",
    "groupid": 101182,
    "sid": 1084,
    "batchid": 0,
    "display_name": "DATA STRUCTURE(AL-303) ( Theory | Regular )"
  },
  {
    "subject_id": 241776,
    "subject_name": "DATA STRUCTURE",
    "course_code": "AL-303",
    "subject_type": "Practical",
    "subject_choice": "elective",
    "groupid": 101182,
    "sid": 1084,
    "batchid": 25823,
    "display_name": "DATA STRUCTURE(AL-303) ( Practical | Elective )"
  },
  {
    "subject_id": 240846,
    "subject_name": "IPS",
    "course_code": "AL-302",
    "subject_type": "Theory",
    "subject_choice": "regular",
    "groupid": 101182,
    "sid": 1084,
    "batchid": 0,
    "display_name": "IPS(AL-302) ( Theory | Regular )"
  },
  {
    "subject_id": 246497,
    "subject_name": "oopm",
    "course_code": "al305",
    "subject_type": "Practical",
    "subject_choice": "regular",
    "groupid": 101182,
    "sid": 1084,
    "batchid": 70134,
    "display_name": "oopm(al305) ( Practical | Regular )"
  },
  {
    "subject_id": 240849,
    "subject_name": "OOPM",
    "course_code": "AL 305",
    "subject_type": "Theory",
    "subject_choice": "regular",
    "groupid": 101182,
    "sid": 1084,
    "batchid": 0,
    "display_name": "OOPM(AL 305) ( Theory | Regular )"
  },
  {
    "subject_id": 241778,
    "subject_name": "OOPM",
    "course_code": "AL 305",
    "subject_type": "Practical",
    "subject_choice": "elective",
    "groupid": 101182,
    "sid": 1084,
    "batchid": 25818,
    "display_name": "OOPM(AL 305) ( Practical | Elective )"
  },
  {
    "subject_id": 240845,
    "subject_name": "TECHNICAL COMMUNICATION",
    "course_code": "AL-301",
    "subject_type": "Theory",
    "subject_choice": "regular",
    "groupid": 101182,
    "sid": 1084,
    "batchid": 0,
    "display_name": "TECHNICAL COMMUNICATION(AL-301) ( Theory | Regular )"
  },
  {
    "subject_id": 243885,
    "subject_name": "TG",
    "course_code": "AL-309",
    "subject_type": "Theory",
    "subject_choice": "regular",
    "groupid": 101182,
    "sid": 1084,
    "batchid": 0,
    "display_name": "TG(AL-309) ( Theory | Regular )"
  },
  {
    "subject_id": 243697,
    "subject_name": "Training(29)",
    "course_code": "T-29",
    "subject_type": "Theory",
    "subject_choice": "regular",
    "groupid": 101182,
    "sid": 1084,
    "batchid": 0,
    "display_name": "Training(29)(T-29) ( Theory | Regular )"
  }
],
    capturedSessions: [
  {
    "session_index": 0,
    "session_id": 13732050,
    "subject_id": 246500,
    "date": "2026-09-12",
    "subject_name": "computer workshop ( Practical | Regular ) ( BATCH 2 )",
    "subject_display_name": "computer workshop(al--306) ( Practical | Regular )",
    "faculty_name": "Akansha Shrivastava",
    "attendance_status": "Present",
    "source_status": "Present",
    "simulated_status": null,
    "time_slot": "10:00 AM - 11:40 AM",
    "updated_at": "2026-09-13T11:21:08.327Z"
  },
  {
    "session_index": 1,
    "session_id": 13729758,
    "subject_id": 240848,
    "date": "2026-09-12",
    "subject_name": "AI ( Theory | Regular )",
    "subject_display_name": "AI(AL 304) ( Theory | Regular )",
    "faculty_name": "Ritu Bhadauria",
    "attendance_status": "Present",
    "source_status": "Present",
    "simulated_status": null,
    "time_slot": "03:40 PM - 04:30 PM",
    "updated_at": "2026-09-13T11:21:08.327Z"
  },
  {
    "session_index": 2,
    "session_id": 13726789,
    "subject_id": 240847,
    "date": "2026-09-12",
    "subject_name": "DATA STRUCTURE ( Theory | Regular )",
    "subject_display_name": "DATA STRUCTURE(AL-303) ( Theory | Regular )",
    "faculty_name": "Sapna Raikwar",
    "attendance_status": "Present",
    "source_status": "Present",
    "simulated_status": null,
    "time_slot": "12:30 PM - 01:20 PM",
    "updated_at": "2026-09-13T11:21:08.327Z"
  },
  {
    "session_index": 3,
    "session_id": 13723882,
    "subject_id": 240846,
    "date": "2026-09-12",
    "subject_name": "IPS ( Theory | Regular )",
    "subject_display_name": "IPS(AL-302) ( Theory | Regular )",
    "faculty_name": "Rahul Gupta",
    "attendance_status": "Present",
    "source_status": "Present",
    "simulated_status": null,
    "time_slot": "11:40 AM - 12:30 PM",
    "updated_at": "2026-09-13T11:21:08.327Z"
  },
  {
    "session_index": 4,
    "session_id": 13719690,
    "subject_id": 240849,
    "date": "2026-09-12",
    "subject_name": "OOPM ( Theory | Regular )",
    "subject_display_name": "OOPM(AL 305) ( Theory | Regular )",
    "faculty_name": "Sarvagya Jain",
    "attendance_status": "Present",
    "source_status": "Present",
    "simulated_status": null,
    "time_slot": "02:50 PM - 03:40 PM",
    "updated_at": "2026-09-13T11:21:08.327Z"
  }
],
    targetMetrics: {
      present_count: 38,
      absent_count: 30,
      total_sessions: 68,
      present_pct: 55.88,
      absent_pct: 44.12,
      average_pct: 58.99
    }
  },
  "STOIST251161": {
    username: "STOIST251161",
    password: "Cwbqs$09",
    name: "AYUSH KATARE",
    mobile: "7905383173",
    email: "katareaayush@gmail.com",
    dp_url: "https://s3.ap-south-1.amazonaws.com/vmedulife-s3/dp/AYUSH-KATARE-6966344d20144.jpeg",
    stuid: "581069",
    streamName: "B. Tech (Computer Science and Engineering)",
    sid: 1075,
    groupid: 100754,
    acayr: 12,
    mentor: {
      mentorName: "Renuka Kartikar",
      mentorId: 12984,
      designation: "Assistant Professor",
      instituteName: "Oriental Institute of Science & Technology, Bhopal",
      instituteShortName: "OIST-Bhopal"
    },
    fees: {
      totalAmount: 63500,
      paid: 63500,
      balance: 0,
      percentage: 100,
      status: "Fully Paid"
    },
    streams: [
  {
    "sid": 1075,
    "groupid": null,
    "name": "B. Tech (Computer Science and Engineering)"
  },
  {
    "sid": 1075,
    "groupid": 100754,
    "name": null
  }
],
    subjects: [
  {
    "subject_id": 242649,
    "subject_name": "COMPUTER WORKSHOP",
    "course_code": "CS-306 (P)",
    "subject_type": "Practical",
    "subject_choice": "regular",
    "groupid": 100754,
    "sid": 1075,
    "batchid": 71241,
    "display_name": "COMPUTER WORKSHOP(CS-306 (P)) ( Practical | Regular )"
  },
  {
    "subject_id": 123406,
    "subject_name": "Data Structure",
    "course_code": "CS-303 (T)",
    "subject_type": "Theory",
    "subject_choice": "regular",
    "groupid": 100754,
    "sid": 1075,
    "batchid": 0,
    "display_name": "Data Structure(CS-303 (T)) ( Theory | Regular )"
  },
  {
    "subject_id": 123453,
    "subject_name": "Data Structure",
    "course_code": "CS-303 (P)",
    "subject_type": "Practical",
    "subject_choice": "regular",
    "groupid": 100754,
    "sid": 1075,
    "batchid": 71241,
    "display_name": "Data Structure(CS-303 (P)) ( Practical | Regular )"
  },
  {
    "subject_id": 123407,
    "subject_name": "Digital Systems",
    "course_code": "CS-304 (T)",
    "subject_type": "Theory",
    "subject_choice": "regular",
    "groupid": 100754,
    "sid": 1075,
    "batchid": 0,
    "display_name": "Digital Systems(CS-304 (T)) ( Theory | Regular )"
  },
  {
    "subject_id": 123454,
    "subject_name": "Digital Systems ",
    "course_code": "CS-304 (P)",
    "subject_type": "Practical",
    "subject_choice": "regular",
    "groupid": 100754,
    "sid": 1075,
    "batchid": 71241,
    "display_name": "Digital Systems(CS-304 (P)) ( Practical | Regular )"
  },
  {
    "subject_id": 123405,
    "subject_name": "Discrete Structure",
    "course_code": "CS-302 (T)",
    "subject_type": "Theory",
    "subject_choice": "regular",
    "groupid": 100754,
    "sid": 1075,
    "batchid": 0,
    "display_name": "Discrete Structure(CS-302 (T)) ( Theory | Regular )"
  },
  {
    "subject_id": 123419,
    "subject_name": "Energy & Environment Engineering",
    "course_code": "ES-301 (T)",
    "subject_type": "Theory",
    "subject_choice": "regular",
    "groupid": 100754,
    "sid": 1075,
    "batchid": 0,
    "display_name": "Energy & Environment Engineering(ES-301 (T)) ( Theory | Regular )"
  },
  {
    "subject_id": 123408,
    "subject_name": "Object Oriented Programming & Methodology",
    "course_code": "CS-305 (T)",
    "subject_type": "Theory",
    "subject_choice": "regular",
    "groupid": 100754,
    "sid": 1075,
    "batchid": 0,
    "display_name": "Object Oriented Programming & Methodology(CS-305 (T)) ( Theory | Regular )"
  },
  {
    "subject_id": 241085,
    "subject_name": "Object Oriented Programming & Methodology",
    "course_code": "CS-305 (P)",
    "subject_type": "Practical",
    "subject_choice": "regular",
    "groupid": 100754,
    "sid": 1075,
    "batchid": 71241,
    "display_name": "Object Oriented Programming & Methodology(CS-305 (P)) ( Practical | Regular )"
  },
  {
    "subject_id": 243656,
    "subject_name": "TG Lecture",
    "course_code": "CS307 (TG)",
    "subject_type": "Theory",
    "subject_choice": "regular",
    "groupid": 100754,
    "sid": 1075,
    "batchid": 0,
    "display_name": "TG Lecture(CS307 (TG)) ( Theory | Regular )"
  },
  {
    "subject_id": 243697,
    "subject_name": "Training(29)",
    "course_code": "T-29",
    "subject_type": "Theory",
    "subject_choice": "regular",
    "groupid": 100754,
    "sid": 1075,
    "batchid": 0,
    "display_name": "Training(29)(T-29) ( Theory | Regular )"
  }
],
    capturedSessions: [
  {
    "session_index": 0,
    "session_id": 13731752,
    "subject_id": 123419,
    "date": "2026-09-12",
    "subject_name": "Energy & Environment Engineering ( Theory | Regular )",
    "subject_display_name": "Energy & Environment Engineering(ES-301 (T)) ( Theory | Regular )",
    "faculty_name": "Anjali Parihar",
    "attendance_status": "Present",
    "source_status": "Present",
    "simulated_status": null,
    "time_slot": "11:40 AM - 12:30 PM",
    "updated_at": "2026-09-13T11:16:41.009Z"
  },
  {
    "session_index": 1,
    "session_id": 13731698,
    "subject_id": 123405,
    "date": "2026-09-12",
    "subject_name": "Discrete Structure ( Theory | Regular )",
    "subject_display_name": "Discrete Structure(CS-302 (T)) ( Theory | Regular )",
    "faculty_name": "Uma Vishwakarma-BS",
    "attendance_status": "Present",
    "source_status": "Present",
    "simulated_status": null,
    "time_slot": "02:50 PM - 03:40 PM",
    "updated_at": "2026-09-13T11:16:41.009Z"
  },
  {
    "session_index": 2,
    "session_id": 13727162,
    "subject_id": 123406,
    "date": "2026-09-12",
    "subject_name": "Data Structure ( Theory | Regular )",
    "subject_display_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "faculty_name": "Renuka Kartikar",
    "attendance_status": "Present",
    "source_status": "Present",
    "simulated_status": null,
    "time_slot": "12:30 PM - 01:20 PM",
    "updated_at": "2026-09-13T11:16:41.009Z"
  },
  {
    "session_index": 3,
    "session_id": 13726911,
    "subject_id": 123408,
    "date": "2026-09-12",
    "subject_name": "Object Oriented Programming & Methodology ( Theory | Regular )",
    "subject_display_name": "Object Oriented Programming & Methodology(CS-305 (T)) ( Theory | Regular )",
    "faculty_name": "Sushil Kumar",
    "attendance_status": "Present",
    "source_status": "Present",
    "simulated_status": null,
    "time_slot": "03:40 PM - 04:40 PM",
    "updated_at": "2026-09-13T11:16:41.009Z"
  },
  {
    "session_index": 0,
    "session_id": 13693803,
    "subject_id": 243697,
    "date": "2026-09-10",
    "subject_name": "Training(29) ( Theory | Regular )",
    "subject_display_name": "Training(29)(T-29) ( Theory | Regular )",
    "faculty_name": "Akhilesh Sharma",
    "attendance_status": "Present",
    "source_status": "Present",
    "simulated_status": null,
    "time_slot": "02:50 PM - 04:30 PM",
    "updated_at": "2026-09-13T11:17:14.685Z"
  },
  {
    "session_index": 1,
    "session_id": 13686535,
    "subject_id": 123406,
    "date": "2026-09-10",
    "subject_name": "Data Structure ( Theory | Regular )",
    "subject_display_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "faculty_name": "Renuka Kartikar",
    "attendance_status": "Present",
    "source_status": "Present",
    "simulated_status": null,
    "time_slot": "02:00 PM - 02:50 PM",
    "updated_at": "2026-09-13T11:17:14.685Z"
  },
  {
    "session_index": 2,
    "session_id": 13685639,
    "subject_id": 123405,
    "date": "2026-09-10",
    "subject_name": "Discrete Structure ( Theory | Regular )",
    "subject_display_name": "Discrete Structure(CS-302 (T)) ( Theory | Regular )",
    "faculty_name": "Uma Vishwakarma-BS",
    "attendance_status": "Present",
    "source_status": "Present",
    "simulated_status": null,
    "time_slot": "11:40 AM - 12:30 PM",
    "updated_at": "2026-09-13T11:17:14.685Z"
  },
  {
    "session_index": 3,
    "session_id": 13683255,
    "subject_id": 123408,
    "date": "2026-09-10",
    "subject_name": "Object Oriented Programming & Methodology ( Theory | Regular )",
    "subject_display_name": "Object Oriented Programming & Methodology(CS-305 (T)) ( Theory | Regular )",
    "faculty_name": "Sushil Kumar",
    "attendance_status": "Present",
    "source_status": "Present",
    "simulated_status": null,
    "time_slot": "10:00 AM - 10:50 AM",
    "updated_at": "2026-09-13T11:17:14.685Z"
  },
  {
    "session_index": 4,
    "session_id": 13681170,
    "subject_id": 123419,
    "date": "2026-09-10",
    "subject_name": "Energy & Environment Engineering ( Theory | Regular )",
    "subject_display_name": "Energy & Environment Engineering(ES-301 (T)) ( Theory | Regular )",
    "faculty_name": "Anjali Parihar",
    "attendance_status": "Present",
    "source_status": "Present",
    "simulated_status": null,
    "time_slot": "12:30 PM - 01:20 PM",
    "updated_at": "2026-09-13T11:17:14.685Z"
  },
  {
    "session_index": 5,
    "session_id": 13677596,
    "subject_id": 123407,
    "date": "2026-09-10",
    "subject_name": "Digital Systems ( Theory | Regular )",
    "subject_display_name": "Digital Systems(CS-304 (T)) ( Theory | Regular )",
    "faculty_name": "Palak Mishra",
    "attendance_status": "Present",
    "source_status": "Present",
    "simulated_status": null,
    "time_slot": "10:50 AM - 11:40 AM",
    "updated_at": "2026-09-13T11:17:14.685Z"
  },
  {
    "session_index": 1,
    "session_id": 13702171,
    "subject_id": 123406,
    "date": "2026-09-11",
    "subject_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "subject_display_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "faculty_name": "Renuka Kartikar",
    "attendance_status": "Present",
    "source_status": "Present",
    "simulated_status": null,
    "time_slot": "11:40 AM - 01:20 PM",
    "updated_at": "2026-09-13T11:18:31.834Z"
  },
  {
    "session_index": 2,
    "session_id": 13699186,
    "subject_id": 123406,
    "date": "2026-09-11",
    "subject_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "subject_display_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "faculty_name": "Renuka Kartikar",
    "attendance_status": "Present",
    "source_status": "Present",
    "simulated_status": null,
    "time_slot": "10:50 AM - 11:40 AM",
    "updated_at": "2026-09-13T11:18:31.834Z"
  },
  {
    "session_index": 4,
    "session_id": 13670868,
    "subject_id": 123406,
    "date": "2026-09-09",
    "subject_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "subject_display_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "faculty_name": "Deepshikha Sharma",
    "attendance_status": "Present",
    "source_status": "Present",
    "simulated_status": null,
    "time_slot": "03:40 PM - 04:40 PM",
    "updated_at": "2026-09-13T11:18:31.834Z"
  },
  {
    "session_index": 5,
    "session_id": 13661277,
    "subject_id": 123406,
    "date": "2026-09-09",
    "subject_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "subject_display_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "faculty_name": "Renuka Kartikar",
    "attendance_status": "Present",
    "source_status": "Present",
    "simulated_status": null,
    "time_slot": "10:50 AM - 11:40 AM",
    "updated_at": "2026-09-13T11:18:31.834Z"
  },
  {
    "session_index": 6,
    "session_id": 13665542,
    "subject_id": 123406,
    "date": "2026-09-07",
    "subject_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "subject_display_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "faculty_name": "Renuka Kartikar",
    "attendance_status": "Absent",
    "source_status": "Absent",
    "simulated_status": null,
    "time_slot": "11:40 AM - 12:30 PM",
    "updated_at": "2026-09-13T11:18:31.834Z"
  },
  {
    "session_index": 7,
    "session_id": 13576633,
    "subject_id": 123406,
    "date": "2026-09-05",
    "subject_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "subject_display_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "faculty_name": "Deepshikha Sharma",
    "attendance_status": "Present",
    "source_status": "Present",
    "simulated_status": null,
    "time_slot": "11:40 AM - 12:30 PM",
    "updated_at": "2026-09-13T11:18:31.834Z"
  },
  {
    "session_index": 8,
    "session_id": 13547226,
    "subject_id": 123406,
    "date": "2026-09-03",
    "subject_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "subject_display_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "faculty_name": "Deepshikha Sharma",
    "attendance_status": "Absent",
    "source_status": "Absent",
    "simulated_status": null,
    "time_slot": "12:30 PM - 01:20 PM",
    "updated_at": "2026-09-13T11:18:31.834Z"
  },
  {
    "session_index": 9,
    "session_id": 13524916,
    "subject_id": 123406,
    "date": "2026-09-02",
    "subject_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "subject_display_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "faculty_name": "Deepshikha Sharma",
    "attendance_status": "Absent",
    "source_status": "Absent",
    "simulated_status": null,
    "time_slot": "11:40 AM - 12:30 PM",
    "updated_at": "2026-09-13T11:18:31.834Z"
  },
  {
    "session_index": 10,
    "session_id": 13508479,
    "subject_id": 123406,
    "date": "2026-09-01",
    "subject_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "subject_display_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "faculty_name": "Deepshikha Sharma",
    "attendance_status": "Absent",
    "source_status": "Absent",
    "simulated_status": null,
    "time_slot": "10:50 AM - 11:40 AM",
    "updated_at": "2026-09-13T11:18:31.834Z"
  },
  {
    "session_index": 11,
    "session_id": 13481817,
    "subject_id": 123406,
    "date": "2026-08-31",
    "subject_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "subject_display_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "faculty_name": "Deepshikha Sharma",
    "attendance_status": "Absent",
    "source_status": "Absent",
    "simulated_status": null,
    "time_slot": "12:30 PM - 01:20 PM",
    "updated_at": "2026-09-13T11:18:31.834Z"
  }
],
    targetMetrics: {
      present_count: 37,
      absent_count: 31,
      total_sessions: 68,
      present_pct: 54.41,
      absent_pct: 45.59,
      average_pct: 70.94
    }
  },
  "DEMO123": {
    username: "DEMO123",
    password: "demo",
    name: "Demo Student",
    mobile: "9000000000",
    email: "demo.student@example.com",
    dp_url: "",
    stuid: "581069",
    streamName: "B. Tech (Computer Science and Engineering)",
    sid: 1075,
    groupid: 100754,
    acayr: 12,
    mentor: {
      mentorName: "A. P. Sharma",
      mentorId: 10101,
      designation: "Professor",
      instituteName: "Oriental Institute of Science & Technology, Bhopal",
      instituteShortName: "OIST-Bhopal"
    },
    fees: {
      totalAmount: 63500,
      paid: 63500,
      balance: 0,
      percentage: 100,
      status: "Fully Paid"
    },
    streams: [
  {
    "sid": 1075,
    "groupid": null,
    "name": "B. Tech (Computer Science and Engineering)"
  },
  {
    "sid": 1075,
    "groupid": 100754,
    "name": null
  }
],
    subjects: [
  {
    "subject_id": 242649,
    "subject_name": "COMPUTER WORKSHOP",
    "course_code": "CS-306 (P)",
    "subject_type": "Practical",
    "subject_choice": "regular",
    "groupid": 100754,
    "sid": 1075,
    "batchid": 71241,
    "display_name": "COMPUTER WORKSHOP(CS-306 (P)) ( Practical | Regular )"
  },
  {
    "subject_id": 123406,
    "subject_name": "Data Structure",
    "course_code": "CS-303 (T)",
    "subject_type": "Theory",
    "subject_choice": "regular",
    "groupid": 100754,
    "sid": 1075,
    "batchid": 0,
    "display_name": "Data Structure(CS-303 (T)) ( Theory | Regular )"
  },
  {
    "subject_id": 123453,
    "subject_name": "Data Structure",
    "course_code": "CS-303 (P)",
    "subject_type": "Practical",
    "subject_choice": "regular",
    "groupid": 100754,
    "sid": 1075,
    "batchid": 71241,
    "display_name": "Data Structure(CS-303 (P)) ( Practical | Regular )"
  },
  {
    "subject_id": 123407,
    "subject_name": "Digital Systems",
    "course_code": "CS-304 (T)",
    "subject_type": "Theory",
    "subject_choice": "regular",
    "groupid": 100754,
    "sid": 1075,
    "batchid": 0,
    "display_name": "Digital Systems(CS-304 (T)) ( Theory | Regular )"
  },
  {
    "subject_id": 123454,
    "subject_name": "Digital Systems ",
    "course_code": "CS-304 (P)",
    "subject_type": "Practical",
    "subject_choice": "regular",
    "groupid": 100754,
    "sid": 1075,
    "batchid": 71241,
    "display_name": "Digital Systems(CS-304 (P)) ( Practical | Regular )"
  },
  {
    "subject_id": 123405,
    "subject_name": "Discrete Structure",
    "course_code": "CS-302 (T)",
    "subject_type": "Theory",
    "subject_choice": "regular",
    "groupid": 100754,
    "sid": 1075,
    "batchid": 0,
    "display_name": "Discrete Structure(CS-302 (T)) ( Theory | Regular )"
  },
  {
    "subject_id": 123419,
    "subject_name": "Energy & Environment Engineering",
    "course_code": "ES-301 (T)",
    "subject_type": "Theory",
    "subject_choice": "regular",
    "groupid": 100754,
    "sid": 1075,
    "batchid": 0,
    "display_name": "Energy & Environment Engineering(ES-301 (T)) ( Theory | Regular )"
  },
  {
    "subject_id": 123408,
    "subject_name": "Object Oriented Programming & Methodology",
    "course_code": "CS-305 (T)",
    "subject_type": "Theory",
    "subject_choice": "regular",
    "groupid": 100754,
    "sid": 1075,
    "batchid": 0,
    "display_name": "Object Oriented Programming & Methodology(CS-305 (T)) ( Theory | Regular )"
  },
  {
    "subject_id": 241085,
    "subject_name": "Object Oriented Programming & Methodology",
    "course_code": "CS-305 (P)",
    "subject_type": "Practical",
    "subject_choice": "regular",
    "groupid": 100754,
    "sid": 1075,
    "batchid": 71241,
    "display_name": "Object Oriented Programming & Methodology(CS-305 (P)) ( Practical | Regular )"
  },
  {
    "subject_id": 243656,
    "subject_name": "TG Lecture",
    "course_code": "CS307 (TG)",
    "subject_type": "Theory",
    "subject_choice": "regular",
    "groupid": 100754,
    "sid": 1075,
    "batchid": 0,
    "display_name": "TG Lecture(CS307 (TG)) ( Theory | Regular )"
  },
  {
    "subject_id": 243697,
    "subject_name": "Training(29)",
    "course_code": "T-29",
    "subject_type": "Theory",
    "subject_choice": "regular",
    "groupid": 100754,
    "sid": 1075,
    "batchid": 0,
    "display_name": "Training(29)(T-29) ( Theory | Regular )"
  }
],
    capturedSessions: [
  {
    "session_index": 0,
    "session_id": 13731752,
    "subject_id": 123419,
    "date": "2026-09-12",
    "subject_name": "Energy & Environment Engineering ( Theory | Regular )",
    "subject_display_name": "Energy & Environment Engineering(ES-301 (T)) ( Theory | Regular )",
    "faculty_name": "Anjali Parihar",
    "attendance_status": "Present",
    "source_status": "Present",
    "simulated_status": null,
    "time_slot": "11:40 AM - 12:30 PM",
    "updated_at": "2026-09-13T11:16:41.009Z"
  },
  {
    "session_index": 1,
    "session_id": 13731698,
    "subject_id": 123405,
    "date": "2026-09-12",
    "subject_name": "Discrete Structure ( Theory | Regular )",
    "subject_display_name": "Discrete Structure(CS-302 (T)) ( Theory | Regular )",
    "faculty_name": "Uma Vishwakarma-BS",
    "attendance_status": "Present",
    "source_status": "Present",
    "simulated_status": null,
    "time_slot": "02:50 PM - 03:40 PM",
    "updated_at": "2026-09-13T11:16:41.009Z"
  },
  {
    "session_index": 2,
    "session_id": 13727162,
    "subject_id": 123406,
    "date": "2026-09-12",
    "subject_name": "Data Structure ( Theory | Regular )",
    "subject_display_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "faculty_name": "Renuka Kartikar",
    "attendance_status": "Present",
    "source_status": "Present",
    "simulated_status": null,
    "time_slot": "12:30 PM - 01:20 PM",
    "updated_at": "2026-09-13T11:16:41.009Z"
  },
  {
    "session_index": 3,
    "session_id": 13726911,
    "subject_id": 123408,
    "date": "2026-09-12",
    "subject_name": "Object Oriented Programming & Methodology ( Theory | Regular )",
    "subject_display_name": "Object Oriented Programming & Methodology(CS-305 (T)) ( Theory | Regular )",
    "faculty_name": "Sushil Kumar",
    "attendance_status": "Present",
    "source_status": "Present",
    "simulated_status": null,
    "time_slot": "03:40 PM - 04:40 PM",
    "updated_at": "2026-09-13T11:16:41.009Z"
  },
  {
    "session_index": 0,
    "session_id": 13693803,
    "subject_id": 243697,
    "date": "2026-09-10",
    "subject_name": "Training(29) ( Theory | Regular )",
    "subject_display_name": "Training(29)(T-29) ( Theory | Regular )",
    "faculty_name": "Akhilesh Sharma",
    "attendance_status": "Present",
    "source_status": "Present",
    "simulated_status": null,
    "time_slot": "02:50 PM - 04:30 PM",
    "updated_at": "2026-09-13T11:17:14.685Z"
  },
  {
    "session_index": 1,
    "session_id": 13686535,
    "subject_id": 123406,
    "date": "2026-09-10",
    "subject_name": "Data Structure ( Theory | Regular )",
    "subject_display_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "faculty_name": "Renuka Kartikar",
    "attendance_status": "Present",
    "source_status": "Present",
    "simulated_status": null,
    "time_slot": "02:00 PM - 02:50 PM",
    "updated_at": "2026-09-13T11:17:14.685Z"
  },
  {
    "session_index": 2,
    "session_id": 13685639,
    "subject_id": 123405,
    "date": "2026-09-10",
    "subject_name": "Discrete Structure ( Theory | Regular )",
    "subject_display_name": "Discrete Structure(CS-302 (T)) ( Theory | Regular )",
    "faculty_name": "Uma Vishwakarma-BS",
    "attendance_status": "Present",
    "source_status": "Present",
    "simulated_status": null,
    "time_slot": "11:40 AM - 12:30 PM",
    "updated_at": "2026-09-13T11:17:14.685Z"
  },
  {
    "session_index": 3,
    "session_id": 13683255,
    "subject_id": 123408,
    "date": "2026-09-10",
    "subject_name": "Object Oriented Programming & Methodology ( Theory | Regular )",
    "subject_display_name": "Object Oriented Programming & Methodology(CS-305 (T)) ( Theory | Regular )",
    "faculty_name": "Sushil Kumar",
    "attendance_status": "Present",
    "source_status": "Present",
    "simulated_status": null,
    "time_slot": "10:00 AM - 10:50 AM",
    "updated_at": "2026-09-13T11:17:14.685Z"
  },
  {
    "session_index": 4,
    "session_id": 13681170,
    "subject_id": 123419,
    "date": "2026-09-10",
    "subject_name": "Energy & Environment Engineering ( Theory | Regular )",
    "subject_display_name": "Energy & Environment Engineering(ES-301 (T)) ( Theory | Regular )",
    "faculty_name": "Anjali Parihar",
    "attendance_status": "Present",
    "source_status": "Present",
    "simulated_status": null,
    "time_slot": "12:30 PM - 01:20 PM",
    "updated_at": "2026-09-13T11:17:14.685Z"
  },
  {
    "session_index": 5,
    "session_id": 13677596,
    "subject_id": 123407,
    "date": "2026-09-10",
    "subject_name": "Digital Systems ( Theory | Regular )",
    "subject_display_name": "Digital Systems(CS-304 (T)) ( Theory | Regular )",
    "faculty_name": "Palak Mishra",
    "attendance_status": "Present",
    "source_status": "Present",
    "simulated_status": null,
    "time_slot": "10:50 AM - 11:40 AM",
    "updated_at": "2026-09-13T11:17:14.685Z"
  },
  {
    "session_index": 1,
    "session_id": 13702171,
    "subject_id": 123406,
    "date": "2026-09-11",
    "subject_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "subject_display_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "faculty_name": "Renuka Kartikar",
    "attendance_status": "Present",
    "source_status": "Present",
    "simulated_status": null,
    "time_slot": "11:40 AM - 01:20 PM",
    "updated_at": "2026-09-13T11:18:31.834Z"
  },
  {
    "session_index": 2,
    "session_id": 13699186,
    "subject_id": 123406,
    "date": "2026-09-11",
    "subject_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "subject_display_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "faculty_name": "Renuka Kartikar",
    "attendance_status": "Present",
    "source_status": "Present",
    "simulated_status": null,
    "time_slot": "10:50 AM - 11:40 AM",
    "updated_at": "2026-09-13T11:18:31.834Z"
  },
  {
    "session_index": 4,
    "session_id": 13670868,
    "subject_id": 123406,
    "date": "2026-09-09",
    "subject_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "subject_display_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "faculty_name": "Deepshikha Sharma",
    "attendance_status": "Present",
    "source_status": "Present",
    "simulated_status": null,
    "time_slot": "03:40 PM - 04:40 PM",
    "updated_at": "2026-09-13T11:18:31.834Z"
  },
  {
    "session_index": 5,
    "session_id": 13661277,
    "subject_id": 123406,
    "date": "2026-09-09",
    "subject_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "subject_display_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "faculty_name": "Renuka Kartikar",
    "attendance_status": "Present",
    "source_status": "Present",
    "simulated_status": null,
    "time_slot": "10:50 AM - 11:40 AM",
    "updated_at": "2026-09-13T11:18:31.834Z"
  },
  {
    "session_index": 6,
    "session_id": 13665542,
    "subject_id": 123406,
    "date": "2026-09-07",
    "subject_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "subject_display_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "faculty_name": "Renuka Kartikar",
    "attendance_status": "Absent",
    "source_status": "Absent",
    "simulated_status": null,
    "time_slot": "11:40 AM - 12:30 PM",
    "updated_at": "2026-09-13T11:18:31.834Z"
  },
  {
    "session_index": 7,
    "session_id": 13576633,
    "subject_id": 123406,
    "date": "2026-09-05",
    "subject_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "subject_display_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "faculty_name": "Deepshikha Sharma",
    "attendance_status": "Present",
    "source_status": "Present",
    "simulated_status": null,
    "time_slot": "11:40 AM - 12:30 PM",
    "updated_at": "2026-09-13T11:18:31.834Z"
  },
  {
    "session_index": 8,
    "session_id": 13547226,
    "subject_id": 123406,
    "date": "2026-09-03",
    "subject_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "subject_display_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "faculty_name": "Deepshikha Sharma",
    "attendance_status": "Absent",
    "source_status": "Absent",
    "simulated_status": null,
    "time_slot": "12:30 PM - 01:20 PM",
    "updated_at": "2026-09-13T11:18:31.834Z"
  },
  {
    "session_index": 9,
    "session_id": 13524916,
    "subject_id": 123406,
    "date": "2026-09-02",
    "subject_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "subject_display_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "faculty_name": "Deepshikha Sharma",
    "attendance_status": "Absent",
    "source_status": "Absent",
    "simulated_status": null,
    "time_slot": "11:40 AM - 12:30 PM",
    "updated_at": "2026-09-13T11:18:31.834Z"
  },
  {
    "session_index": 10,
    "session_id": 13508479,
    "subject_id": 123406,
    "date": "2026-09-01",
    "subject_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "subject_display_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "faculty_name": "Deepshikha Sharma",
    "attendance_status": "Absent",
    "source_status": "Absent",
    "simulated_status": null,
    "time_slot": "10:50 AM - 11:40 AM",
    "updated_at": "2026-09-13T11:18:31.834Z"
  },
  {
    "session_index": 11,
    "session_id": 13481817,
    "subject_id": 123406,
    "date": "2026-08-31",
    "subject_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "subject_display_name": "Data Structure(CS-303 (T)) ( Theory | Regular )",
    "faculty_name": "Deepshikha Sharma",
    "attendance_status": "Absent",
    "source_status": "Absent",
    "simulated_status": null,
    "time_slot": "12:30 PM - 01:20 PM",
    "updated_at": "2026-09-13T11:18:31.834Z"
  }
],
    targetMetrics: {
      present_count: 37,
      absent_count: 31,
      total_sessions: 68,
      present_pct: 54.41,
      absent_pct: 45.59,
      average_pct: 70.94
    }
  }
};

const EXAMS = [
  {
    "examId": "120204",
    "examName": "LAB QUIZ 1",
    "examSyllabus": "BASIC OF AI",
    "completionStatus": "0",
    "subjectId": "241777",
    "subjectName": "AI",
    "subjectType": "Practical",
    "subjectChoice": "elective",
    "subjectFaculties": [
      {
        "FacultyName": "Ritu Bhadauria",
        "facultyuid": "13146"
      }
    ],
    "hasQuestions": true,
    "durationMinutes": 20,
    "totalQuestions": 2,
    "totalMarks": 10,
    "startDate": "10th Sep, 2026",
    "endDate": "10th Sep,2026",
    "startTime": "01:00 pm",
    "endTime": "01:20 pm",
    "viewStudentMarksAllowed": "off",
    "viewStudentPerformanceAllowed": "off"
  },
  {
    "examId": "120621",
    "examName": "Lab Quiz -1",
    "examSyllabus": "loop",
    "completionStatus": "0",
    "subjectId": "246497",
    "subjectName": "oopm",
    "subjectType": "Practical",
    "subjectChoice": "regular",
    "subjectFaculties": [
      {
        "FacultyName": "Sarvagya Jain",
        "facultyuid": "13152"
      }
    ],
    "hasQuestions": true,
    "durationMinutes": 50,
    "totalQuestions": 5,
    "totalMarks": 10,
    "startDate": "18th Sep, 2026",
    "endDate": "18th Sep,2026",
    "startTime": "02:00 pm",
    "endTime": "02:50 pm",
    "viewStudentMarksAllowed": "on",
    "viewStudentPerformanceAllowed": "on"
  },
  {
    "examId": "120675",
    "examName": "LAB QUIZ 1",
    "examSyllabus": "basic",
    "completionStatus": "0",
    "subjectId": "246499",
    "subjectName": "AI",
    "subjectType": "Practical",
    "subjectChoice": "regular",
    "subjectFaculties": [
      {
        "FacultyName": "Ritu Bhadauria",
        "facultyuid": "13146"
      }
    ],
    "hasQuestions": true,
    "durationMinutes": 27,
    "totalQuestions": 2,
    "totalMarks": 10,
    "startDate": "3rd Oct, 2026",
    "endDate": "3rd Oct,2026",
    "startTime": "11:00 am",
    "endTime": "11:40 am",
    "viewStudentMarksAllowed": "on",
    "viewStudentPerformanceAllowed": "on"
  },
  {
    "examId": "120866",
    "examName": "THEORY QUIZ 1",
    "examSyllabus": "UNIT 1",
    "completionStatus": "1",
    "subjectId": "240848",
    "subjectName": "AI",
    "subjectType": "Theory",
    "subjectChoice": "regular",
    "subjectFaculties": [
      {
        "FacultyName": "Ritu Bhadauria",
        "facultyuid": "13146"
      }
    ],
    "hasQuestions": true,
    "durationMinutes": 30,
    "totalQuestions": 10,
    "totalMarks": 10,
    "startDate": "23rd Sep, 2026",
    "endDate": "23rd Sep,2026",
    "startTime": "03:40 pm",
    "endTime": "04:30 pm",
    "viewStudentMarksAllowed": "off",
    "viewStudentPerformanceAllowed": "on",
    "submittedAt": "2026-09-23 15:47:27"
  },
  {
    "examId": "120867",
    "examName": "Theory Quiz-1",
    "examSyllabus": "Unit -01",
    "completionStatus": "0",
    "subjectId": "240849",
    "subjectName": "OOPM",
    "subjectType": "Theory",
    "subjectChoice": "regular",
    "subjectFaculties": [
      {
        "FacultyName": "Sarvagya Jain",
        "facultyuid": "13152"
      }
    ],
    "hasQuestions": true,
    "durationMinutes": 90,
    "totalQuestions": 10,
    "totalMarks": 10,
    "startDate": "22nd Sep, 2026",
    "endDate": "29th Sep,2026",
    "startTime": "03:30 pm",
    "endTime": "05:00 pm",
    "viewStudentMarksAllowed": "on",
    "viewStudentPerformanceAllowed": "on"
  },
  {
    "examId": "120985",
    "examName": "unit 1",
    "examSyllabus": "unit 1",
    "completionStatus": "1",
    "subjectId": "240847",
    "subjectName": "DATA STRUCTURE",
    "subjectType": "Theory",
    "subjectChoice": "regular",
    "subjectFaculties": [
      {
        "FacultyName": "Sapna Raikwar",
        "facultyuid": "51953"
      }
    ],
    "hasQuestions": true,
    "durationMinutes": 30,
    "totalQuestions": 10,
    "totalMarks": 10,
    "startDate": "24th Sep, 2026",
    "endDate": "25th Sep,2026",
    "startTime": "09:00 am",
    "endTime": "11:50 pm",
    "viewStudentMarksAllowed": "off",
    "viewStudentPerformanceAllowed": "on",
    "submittedAt": "2026-09-25 11:27:40"
  },
  {
    "examId": "121018",
    "examName": "LAB QUIZ 2",
    "examSyllabus": "NUMPY LIB",
    "completionStatus": "0",
    "subjectId": "246499",
    "subjectName": "AI",
    "subjectType": "Practical",
    "subjectChoice": "regular",
    "subjectFaculties": [
      {
        "FacultyName": "Ritu Bhadauria",
        "facultyuid": "13146"
      }
    ],
    "hasQuestions": true,
    "durationMinutes": 40,
    "totalQuestions": 5,
    "totalMarks": 10,
    "startDate": "24th Sep, 2026",
    "endDate": "24th Sep,2026",
    "startTime": "12:50 pm",
    "endTime": "01:30 pm",
    "viewStudentMarksAllowed": "on",
    "viewStudentPerformanceAllowed": "on"
  },
  {
    "examId": "121475",
    "examName": "Experiment 1",
    "examSyllabus": "Array",
    "completionStatus": "1",
    "subjectId": "246498",
    "subjectName": "data structure",
    "subjectType": "Practical",
    "subjectChoice": "regular",
    "subjectFaculties": [
      {
        "FacultyName": "Sapna Raikwar",
        "facultyuid": "51953"
      }
    ],
    "hasQuestions": true,
    "durationMinutes": 30,
    "totalQuestions": 5,
    "totalMarks": 5,
    "startDate": "29th Sep, 2026",
    "endDate": "30th Sep,2026",
    "startTime": "09:00 am",
    "endTime": "11:55 pm",
    "viewStudentMarksAllowed": "off",
    "viewStudentPerformanceAllowed": "on",
    "submittedAt": "2026-09-29 15:09:43"
  },
  {
    "examId": "121496",
    "examName": "LAB QUIZ 1",
    "examSyllabus": "INTRODUCTION OF PYTHON",
    "completionStatus": "1",
    "subjectId": "246500",
    "subjectName": "computer workshop",
    "subjectType": "Practical",
    "subjectChoice": "regular",
    "subjectFaculties": [
      {
        "FacultyName": "Akansha Shrivastava",
        "facultyuid": "41017"
      }
    ],
    "hasQuestions": true,
    "durationMinutes": 10,
    "totalQuestions": 5,
    "totalMarks": 5,
    "startDate": "29th Sep, 2026",
    "endDate": "29th Sep,2026",
    "startTime": "03:30 pm",
    "endTime": "04:00 pm",
    "viewStudentMarksAllowed": "on",
    "viewStudentPerformanceAllowed": "on",
    "studentScore": 5,
    "submittedAt": "2026-09-29 15:44:18"
  },
  {
    "examId": "121713",
    "examName": "LAB QUIZ 3",
    "examSyllabus": "PANDAS LIB",
    "completionStatus": "1",
    "subjectId": "246499",
    "subjectName": "AI",
    "subjectType": "Practical",
    "subjectChoice": "regular",
    "subjectFaculties": [
      {
        "FacultyName": "Ritu Bhadauria",
        "facultyuid": "13146"
      }
    ],
    "hasQuestions": true,
    "durationMinutes": 60,
    "totalQuestions": 5,
    "totalMarks": 10,
    "startDate": "1st Oct, 2026",
    "endDate": "1st Oct,2026",
    "startTime": "12:30 pm",
    "endTime": "01:30 pm",
    "viewStudentMarksAllowed": "off",
    "viewStudentPerformanceAllowed": "off",
    "submittedAt": "2026-10-01 12:39:00"
  },
  {
    "examId": "121835",
    "examName": "LAB QUIZ 4",
    "examSyllabus": "SCIPY",
    "completionStatus": "0",
    "subjectId": "246499",
    "subjectName": "AI",
    "subjectType": "Practical",
    "subjectChoice": "regular",
    "subjectFaculties": [
      {
        "FacultyName": "Ritu Bhadauria",
        "facultyuid": "13146"
      }
    ],
    "hasQuestions": true,
    "durationMinutes": 40,
    "totalQuestions": 5,
    "totalMarks": 10,
    "startDate": "3rd Oct, 2026",
    "endDate": "3rd Oct,2026",
    "startTime": "11:20 am",
    "endTime": "12:00 pm",
    "viewStudentMarksAllowed": "on",
    "viewStudentPerformanceAllowed": "on"
  },
  {
    "examId": "121851",
    "examName": "Lab Quiz 2",
    "examSyllabus": "Practical-2",
    "completionStatus": "0",
    "subjectId": "246497",
    "subjectName": "oopm",
    "subjectType": "Practical",
    "subjectChoice": "regular",
    "subjectFaculties": [
      {
        "FacultyName": "Sarvagya Jain",
        "facultyuid": "13152"
      }
    ],
    "hasQuestions": true,
    "durationMinutes": 120,
    "totalQuestions": 5,
    "totalMarks": 10,
    "startDate": "3rd Oct, 2026",
    "endDate": "4th Oct,2026",
    "startTime": "03:30 pm",
    "endTime": "05:30 pm",
    "viewStudentMarksAllowed": "on",
    "viewStudentPerformanceAllowed": "on"
  },
  {
    "examId": "122149",
    "examName": "2D Array",
    "examSyllabus": "Experiment 2",
    "completionStatus": "1",
    "subjectId": "246498",
    "subjectName": "data structure",
    "subjectType": "Practical",
    "subjectChoice": "regular",
    "subjectFaculties": [
      {
        "FacultyName": "Sapna Raikwar",
        "facultyuid": "51953"
      }
    ],
    "hasQuestions": true,
    "durationMinutes": 30,
    "totalQuestions": 5,
    "totalMarks": 5,
    "startDate": "7th Oct, 2026",
    "endDate": "8th Oct,2026",
    "startTime": "09:00 am",
    "endTime": "11:55 pm",
    "viewStudentMarksAllowed": "off",
    "viewStudentPerformanceAllowed": "on",
    "submittedAt": "2026-10-08 13:02:25"
  },
  {
    "examId": "122253",
    "examName": "LAB QUIZ 5",
    "examSyllabus": "BFS",
    "completionStatus": "1",
    "subjectId": "246499",
    "subjectName": "AI",
    "subjectType": "Practical",
    "subjectChoice": "regular",
    "subjectFaculties": [
      {
        "FacultyName": "Ritu Bhadauria",
        "facultyuid": "13146"
      }
    ],
    "hasQuestions": true,
    "durationMinutes": 40,
    "totalQuestions": 7,
    "totalMarks": 20,
    "startDate": "8th Oct, 2026",
    "endDate": "8th Oct,2026",
    "startTime": "12:40 pm",
    "endTime": "01:20 pm",
    "viewStudentMarksAllowed": "on",
    "viewStudentPerformanceAllowed": "off",
    "studentScore": 0,
    "submittedAt": "2026-10-08 12:50:17"
  },
  {
    "examId": "122389",
    "examName": "quize",
    "examSyllabus": "probability",
    "completionStatus": "0",
    "subjectId": "240846",
    "subjectName": "IPS",
    "subjectType": "Theory",
    "subjectChoice": "regular",
    "subjectFaculties": [
      {
        "FacultyName": "Rahul Gupta",
        "facultyuid": "67780"
      }
    ],
    "hasQuestions": true,
    "durationMinutes": 30,
    "totalQuestions": 5,
    "totalMarks": 10,
    "startDate": "9th Oct, 2026",
    "endDate": "12th Oct,2026",
    "startTime": "07:00 pm",
    "endTime": "08:00 pm",
    "viewStudentMarksAllowed": "off",
    "viewStudentPerformanceAllowed": "off"
  },
  {
    "examId": "122447",
    "examName": "LAB QUIZ 2",
    "examSyllabus": "conditional statement",
    "completionStatus": "0",
    "subjectId": "246500",
    "subjectName": "computer workshop",
    "subjectType": "Practical",
    "subjectChoice": "regular",
    "subjectFaculties": [
      {
        "FacultyName": "Akansha Shrivastava",
        "facultyuid": "41017"
      }
    ],
    "hasQuestions": true,
    "durationMinutes": 8,
    "totalQuestions": 5,
    "totalMarks": 5,
    "startDate": "10th Oct, 2026",
    "endDate": "10th Oct,2026",
    "startTime": "11:00 am",
    "endTime": "11:20 am",
    "viewStudentMarksAllowed": "on",
    "viewStudentPerformanceAllowed": "on"
  },
  {
    "examId": "122720",
    "examName": "Theory Quiz -2",
    "examSyllabus": "Unit-2",
    "completionStatus": "0",
    "subjectId": "240849",
    "subjectName": "OOPM",
    "subjectType": "Theory",
    "subjectChoice": "regular",
    "subjectFaculties": [
      {
        "FacultyName": "Sarvagya Jain",
        "facultyuid": "13152"
      }
    ],
    "hasQuestions": true,
    "durationMinutes": 90,
    "totalQuestions": 10,
    "totalMarks": 10,
    "startDate": "13th Oct, 2026",
    "endDate": "14th Oct,2026",
    "startTime": "03:30 pm",
    "endTime": "05:00 pm",
    "viewStudentMarksAllowed": "on",
    "viewStudentPerformanceAllowed": "on"
  },
  {
    "examId": "122915",
    "examName": "LAB QUIZ 6",
    "examSyllabus": "DFS",
    "completionStatus": "0",
    "subjectId": "246499",
    "subjectName": "AI",
    "subjectType": "Practical",
    "subjectChoice": "regular",
    "subjectFaculties": [
      {
        "FacultyName": "Ritu Bhadauria",
        "facultyuid": "13146"
      }
    ],
    "hasQuestions": true,
    "durationMinutes": 40,
    "totalQuestions": 7,
    "totalMarks": 10,
    "startDate": "15th Oct, 2026",
    "endDate": "15th Oct,2026",
    "startTime": "12:40 pm",
    "endTime": "01:20 pm",
    "viewStudentMarksAllowed": "off",
    "viewStudentPerformanceAllowed": "off"
  },
  {
    "examId": "123282",
    "examName": "Lab Quiz -3",
    "examSyllabus": "Class & Object",
    "completionStatus": "0",
    "subjectId": "246497",
    "subjectName": "oopm",
    "subjectType": "Practical",
    "subjectChoice": "regular",
    "subjectFaculties": [
      {
        "FacultyName": "Sarvagya Jain",
        "facultyuid": "13152"
      }
    ],
    "hasQuestions": true,
    "durationMinutes": 120,
    "totalQuestions": 5,
    "totalMarks": 10,
    "startDate": "21st Oct, 2026",
    "endDate": "23rd Oct,2026",
    "startTime": "03:00 pm",
    "endTime": "05:00 pm",
    "viewStudentMarksAllowed": "on",
    "viewStudentPerformanceAllowed": "on"
  },
  {
    "examId": "123285",
    "examName": "Lab Quiz -4",
    "examSyllabus": "Static Member",
    "completionStatus": "0",
    "subjectId": "246497",
    "subjectName": "oopm",
    "subjectType": "Practical",
    "subjectChoice": "regular",
    "subjectFaculties": [
      {
        "FacultyName": "Sarvagya Jain",
        "facultyuid": "13152"
      }
    ],
    "hasQuestions": true,
    "durationMinutes": 119,
    "totalQuestions": 5,
    "totalMarks": 10,
    "startDate": "21st Oct, 2026",
    "endDate": "23rd Oct,2026",
    "startTime": "03:00 pm",
    "endTime": "05:00 pm",
    "viewStudentMarksAllowed": "on",
    "viewStudentPerformanceAllowed": "on"
  },
  {
    "examId": "123287",
    "examName": "Lab Quiz 5",
    "examSyllabus": "Constructor",
    "completionStatus": "0",
    "subjectId": "246497",
    "subjectName": "oopm",
    "subjectType": "Practical",
    "subjectChoice": "regular",
    "subjectFaculties": [
      {
        "FacultyName": "Sarvagya Jain",
        "facultyuid": "13152"
      }
    ],
    "hasQuestions": true,
    "durationMinutes": 120,
    "totalQuestions": 5,
    "totalMarks": 10,
    "startDate": "21st Oct, 2026",
    "endDate": "23rd Oct,2026",
    "startTime": "03:00 pm",
    "endTime": "05:00 pm",
    "viewStudentMarksAllowed": "on",
    "viewStudentPerformanceAllowed": "off"
  },
  {
    "examId": "123412",
    "examName": "THEORY QUIZ 2",
    "examSyllabus": "UNIT 2",
    "completionStatus": "1",
    "subjectId": "240848",
    "subjectName": "AI",
    "subjectType": "Theory",
    "subjectChoice": "regular",
    "subjectFaculties": [
      {
        "FacultyName": "Ritu Bhadauria",
        "facultyuid": "13146"
      }
    ],
    "hasQuestions": true,
    "durationMinutes": 30,
    "totalQuestions": 10,
    "totalMarks": 10,
    "startDate": "22nd Oct, 2026",
    "endDate": "22nd Oct,2026",
    "startTime": "12:00 pm",
    "endTime": "12:30 pm",
    "viewStudentMarksAllowed": "on",
    "viewStudentPerformanceAllowed": "on",
    "studentScore": 8,
    "submittedAt": "2026-10-22 12:13:48"
  },
  {
    "examId": "123768",
    "examName": "LAB QUIZ 3",
    "examSyllabus": "LIST,TUPLE",
    "completionStatus": "0",
    "subjectId": "246500",
    "subjectName": "computer workshop",
    "subjectType": "Practical",
    "subjectChoice": "regular",
    "subjectFaculties": [
      {
        "FacultyName": "Akansha Shrivastava",
        "facultyuid": "41017"
      }
    ],
    "hasQuestions": true,
    "durationMinutes": 7,
    "totalQuestions": 10,
    "totalMarks": 10,
    "startDate": "24th Oct, 2026",
    "endDate": "24th Oct,2026",
    "startTime": "11:20 am",
    "endTime": "11:45 am",
    "viewStudentMarksAllowed": "on",
    "viewStudentPerformanceAllowed": "on"
  },
  {
    "examId": "125814",
    "examName": "circular linkedlist",
    "examSyllabus": "experiment 4",
    "completionStatus": "0",
    "subjectId": "246498",
    "subjectName": "data structure",
    "subjectType": "Practical",
    "subjectChoice": "regular",
    "subjectFaculties": [
      {
        "FacultyName": "Sapna Raikwar",
        "facultyuid": "51953"
      }
    ],
    "hasQuestions": true,
    "durationMinutes": 30,
    "totalQuestions": 5,
    "totalMarks": 5,
    "startDate": "19th Nov, 2026",
    "endDate": "20th Nov,2026",
    "startTime": "09:00 am",
    "endTime": "11:55 pm",
    "viewStudentMarksAllowed": "on",
    "viewStudentPerformanceAllowed": "on"
  },
  {
    "examId": "125821",
    "examName": "unit 2",
    "examSyllabus": "stack And Queue",
    "completionStatus": "1",
    "subjectId": "240847",
    "subjectName": "DATA STRUCTURE",
    "subjectType": "Theory",
    "subjectChoice": "regular",
    "subjectFaculties": [
      {
        "FacultyName": "Sapna Raikwar",
        "facultyuid": "51953"
      }
    ],
    "hasQuestions": true,
    "durationMinutes": 30,
    "totalQuestions": 10,
    "totalMarks": 10,
    "startDate": "19th Nov, 2026",
    "endDate": "21st Nov,2026",
    "startTime": "09:00 am",
    "endTime": "11:55 pm",
    "viewStudentMarksAllowed": "on",
    "viewStudentPerformanceAllowed": "on",
    "studentScore": 9,
    "submittedAt": "2026-11-19 13:23:57"
  }
];

const EXAM_QUESTIONS_125821 = [
  {
    "qid": "4013500",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "Which principle does a Stack follow?",
    "answers": [
      {
        "id": "4944384",
        "text": "FIFO"
      },
      {
        "id": "4944385",
        "text": "LIFO"
      },
      {
        "id": "4944386",
        "text": "FILO only"
      },
      {
        "id": "4944387",
        "text": "Random order"
      }
    ],
    "correctAnswerId": "4944385"
  },
  {
    "qid": "4013505",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "Which operation is used to insert an element into a Stack?",
    "answers": [
      {
        "id": "4944388",
        "text": "Pop"
      },
      {
        "id": "4944389",
        "text": "Delete"
      },
      {
        "id": "4944390",
        "text": "Push"
      },
      {
        "id": "4944391",
        "text": "Enqueue"
      }
    ],
    "correctAnswerId": "4944390"
  },
  {
    "qid": "4013509",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": " Which operation removes an element from a Stack?",
    "answers": [
      {
        "id": "4944392",
        "text": "Push"
      },
      {
        "id": "4944393",
        "text": "Pop"
      },
      {
        "id": "4944394",
        "text": "Insert"
      },
      {
        "id": "4944395",
        "text": "Enqueue"
      }
    ],
    "correctAnswerId": "4944393"
  },
  {
    "qid": "4013516",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": " Which pointer indicates the top element of a Stack?",
    "answers": [
      {
        "id": "4944396",
        "text": "Front"
      },
      {
        "id": "4944397",
        "text": "Rear"
      },
      {
        "id": "4944398",
        "text": "Top"
      },
      {
        "id": "4944399",
        "text": "Head"
      }
    ],
    "correctAnswerId": "4944398"
  },
  {
    "qid": "4013520",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "What happens when we try to pop an element from an empty Stack?",
    "answers": [
      {
        "id": "4944400",
        "text": "Overflow"
      },
      {
        "id": "4944401",
        "text": "Underflow"
      },
      {
        "id": "4944402",
        "text": "Insertion"
      },
      {
        "id": "4944403",
        "text": "Traversal"
      }
    ],
    "correctAnswerId": "4944401"
  },
  {
    "qid": "4013729",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": " Which principle does a Queue follow?",
    "answers": [
      {
        "id": "4944404",
        "text": "LIFO"
      },
      {
        "id": "4944405",
        "text": "FIFO"
      },
      {
        "id": "4944406",
        "text": "FILO"
      },
      {
        "id": "4944407",
        "text": "Random order"
      }
    ],
    "correctAnswerId": "4944405"
  },
  {
    "qid": "4013735",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": " Which operation is used to insert an element into a Queue?",
    "answers": [
      {
        "id": "4944412",
        "text": "Pop"
      },
      {
        "id": "4944413",
        "text": "Dequeue"
      },
      {
        "id": "4944414",
        "text": "Push"
      },
      {
        "id": "4944415",
        "text": "Enqueue"
      }
    ],
    "correctAnswerId": "4944415"
  },
  {
    "qid": "4013738",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "From which end is an element removed in a normal Queue?",
    "answers": [
      {
        "id": "4944416",
        "text": "Rear"
      },
      {
        "id": "4944417",
        "text": "Front"
      },
      {
        "id": "4944418",
        "text": "Middle"
      },
      {
        "id": "4944419",
        "text": "Top"
      }
    ],
    "correctAnswerId": "4944417"
  },
  {
    "qid": "4013743",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "Which data structure is used in function calls and recursion?",
    "answers": [
      {
        "id": "4944420",
        "text": "Queue"
      },
      {
        "id": "4944421",
        "text": "Stack"
      },
      {
        "id": "4944422",
        "text": "Array only"
      },
      {
        "id": "4944423",
        "text": "Tree only"
      }
    ],
    "correctAnswerId": "4944421"
  },
  {
    "qid": "4013751",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "Consider the following Queue operations:\r\nEnqueue(10)\r\nEnqueue(20)\r\nEnqueue(30)\r\nDequeue()\r\nWhich element is removed?",
    "answers": [
      {
        "id": "4944424",
        "text": "10"
      },
      {
        "id": "4944425",
        "text": "20"
      },
      {
        "id": "4944426",
        "text": "30"
      },
      {
        "id": "4944427",
        "text": "None"
      }
    ],
    "correctAnswerId": "4944424"
  }
];

const EXAM_QUESTIONS_AI = [
  {
    "qid": "5010001",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "What is the primary objective of a Heuristic Function in A* Search?",
    "answers": [
      { "id": "6010001", "text": "To guarantee exploring all nodes in FIFO order" },
      { "id": "6010002", "text": "To estimate the cheapest path cost from current state to the goal" },
      { "id": "6010003", "text": "To randomize the order of branch expansion" },
      { "id": "6010004", "text": "To count the depth of the search tree" }
    ],
    "correctAnswerId": "6010002"
  },
  {
    "qid": "5010002",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "Which condition makes a heuristic admissible in A* search?",
    "answers": [
      { "id": "6010005", "text": "It always overestimates the actual distance to the goal" },
      { "id": "6010006", "text": "It never overestimates the true cost to reach the goal" },
      { "id": "6010007", "text": "It must equal exactly the step cost of the initial node" },
      { "id": "6010008", "text": "It must be zero for all intermediate nodes" }
    ],
    "correctAnswerId": "6010006"
  },
  {
    "qid": "5010003",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "What type of agent acts based solely on the current percept, ignoring history?",
    "answers": [
      { "id": "6010009", "text": "Model-based Reflex Agent" },
      { "id": "6010010", "text": "Simple Reflex Agent" },
      { "id": "6010011", "text": "Goal-based Agent" },
      { "id": "6010012", "text": "Learning Agent" }
    ],
    "correctAnswerId": "6010010"
  },
  {
    "qid": "5010004",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "In game playing (Adversarial Search), what is Alpha-Beta Pruning used for?",
    "answers": [
      { "id": "6010013", "text": "To decrease the branching factor without altering the minimax value" },
      { "id": "6010014", "text": "To replace heuristic evaluation with random moves" },
      { "id": "6010015", "text": "To convert 2-player games into 1-player puzzles" },
      { "id": "6010016", "text": "To prevent infinite loops in graphs" }
    ],
    "correctAnswerId": "6010013"
  },
  {
    "qid": "5010005",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "Which algorithm is guaranteed to find the optimal path in a weighted graph?",
    "answers": [
      { "id": "6010017", "text": "Depth-First Search (DFS)" },
      { "id": "6010018", "text": "Uniform-Cost Search (Dijkstra's variant)" },
      { "id": "6010019", "text": "Greedy Best-First Search" },
      { "id": "6010020", "text": "Bidirectional DFS" }
    ],
    "correctAnswerId": "6010018"
  },
  {
    "qid": "5010006",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "What is the primary role of an Activation Function in Neural Networks?",
    "answers": [
      { "id": "6010021", "text": "To normalize the input database schema" },
      { "id": "6010022", "text": "To introduce non-linearity so the network can learn complex patterns" },
      { "id": "6010023", "text": "To speed up matrix multiplication in CPU cache" },
      { "id": "6010024", "text": "To eliminate the need for training epochs" }
    ],
    "correctAnswerId": "6010022"
  },
  {
    "qid": "5010007",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "In supervised machine learning, what does Overfitting signify?",
    "answers": [
      { "id": "6010025", "text": "Model performs equally well on train and test data" },
      { "id": "6010026", "text": "High accuracy on training set but poor generalization to unseen data" },
      { "id": "6010027", "text": "Low accuracy on both training and test data" },
      { "id": "6010028", "text": "Model converges too slowly during gradient descent" }
    ],
    "correctAnswerId": "6010026"
  },
  {
    "qid": "5010008",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "Which algorithm is an unsupervised clustering algorithm?",
    "answers": [
      { "id": "6010029", "text": "K-Means Clustering" },
      { "id": "6010030", "text": "Linear Regression" },
      { "id": "6010031", "text": "Decision Tree Classifier" },
      { "id": "6010032", "text": "Support Vector Machine (SVM)" }
    ],
    "correctAnswerId": "6010029"
  },
  {
    "qid": "5010009",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "What does the Turing Test evaluate?",
    "answers": [
      { "id": "6010033", "text": "Computational complexity of NP-complete problems" },
      { "id": "6010034", "text": "A machine's ability to exhibit indistinguishable human intelligence" },
      { "id": "6010035", "text": "Floating point operations per second of a GPU" },
      { "id": "6010036", "text": "Network latency in distributed clusters" }
    ],
    "correctAnswerId": "6010034"
  },
  {
    "qid": "5010010",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "Which problem representation models a problem as Variables, Domains, and Constraints?",
    "answers": [
      { "id": "6010037", "text": "Constraint Satisfaction Problem (CSP)" },
      { "id": "6010038", "text": "Markov Decision Process (MDP)" },
      { "id": "6010039", "text": "Hidden Markov Model (HMM)" },
      { "id": "6010040", "text": "Recurrent Belief Network" }
    ],
    "correctAnswerId": "6010037"
  }
];

const EXAM_QUESTIONS_OOPM = [
  {
    "qid": "5020001",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "Which OOP principle focuses on bundling data and methods into a single unit?",
    "answers": [
      { "id": "6020001", "text": "Polymorphism" },
      { "id": "6020002", "text": "Encapsulation" },
      { "id": "6020003", "text": "Inheritance" },
      { "id": "6020004", "text": "Abstraction" }
    ],
    "correctAnswerId": "6020002"
  },
  {
    "qid": "5020002",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "What is the purpose of declaring a destructor as virtual in a base class?",
    "answers": [
      { "id": "6020005", "text": "To prevent derived classes from having destructors" },
      { "id": "6020006", "text": "To ensure proper cleanup of derived objects when deleted via base pointer" },
      { "id": "6020007", "text": "To speed up memory allocation in heap" },
      { "id": "6020008", "text": "To allow constructors to be called automatically" }
    ],
    "correctAnswerId": "6020006"
  },
  {
    "qid": "5020003",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "Which constructor is invoked when an object is initialized with another existing object?",
    "answers": [
      { "id": "6020009", "text": "Default Constructor" },
      { "id": "6020010", "text": "Parameterized Constructor" },
      { "id": "6020011", "text": "Copy Constructor" },
      { "id": "6020012", "text": "Move Destructor" }
    ],
    "correctAnswerId": "6020011"
  },
  {
    "qid": "5020004",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "In C++, what mechanism enables runtime (dynamic) polymorphism?",
    "answers": [
      { "id": "6020013", "text": "Function Overloading" },
      { "id": "6020014", "text": "Operator Overloading" },
      { "id": "6020015", "text": "Virtual Functions and V-Table" },
      { "id": "6020016", "text": "Templates and Macros" }
    ],
    "correctAnswerId": "6020015"
  },
  {
    "qid": "5020005",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "What problem arises in multiple inheritance when two classes inherit from the same base?",
    "answers": [
      { "id": "6020017", "text": "Segmentation Fault" },
      { "id": "6020018", "text": "The Diamond Problem (Ambiguity)" },
      { "id": "6020019", "text": "Deadlock Problem" },
      { "id": "6020020", "text": "Starvation Error" }
    ],
    "correctAnswerId": "6020018"
  },
  {
    "qid": "5020006",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "How is the Diamond Problem resolved in C++?",
    "answers": [
      { "id": "6020021", "text": "Using virtual inheritance (virtual base class)" },
      { "id": "6020022", "text": "By making all variables static" },
      { "id": "6020023", "text": "By using private access specifier" },
      { "id": "6020024", "text": "By disabling polymorphism" }
    ],
    "correctAnswerId": "6020021"
  },
  {
    "qid": "5020007",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "Which access specifier allows derived classes access while hiding from outside?",
    "answers": [
      { "id": "6020025", "text": "public" },
      { "id": "6020026", "text": "private" },
      { "id": "6020027", "text": "protected" },
      { "id": "6020028", "text": "internal" }
    ],
    "correctAnswerId": "6020027"
  },
  {
    "qid": "5020008",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "What defines an Abstract Class in C++?",
    "answers": [
      { "id": "6020029", "text": "A class with no member variables" },
      { "id": "6020030", "text": "A class containing at least one pure virtual function (= 0)" },
      { "id": "6020031", "text": "A class that cannot be inherited" },
      { "id": "6020032", "text": "A class with only static methods" }
    ],
    "correctAnswerId": "6020030"
  },
  {
    "qid": "5020009",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "Can a friend function access private members of a class in C++?",
    "answers": [
      { "id": "6020033", "text": "Yes, friend functions have access to all private and protected members" },
      { "id": "6020034", "text": "No, friend functions only see public members" },
      { "id": "6020035", "text": "Only if declared static" },
      { "id": "6020036", "text": "Only in derived classes" }
    ],
    "correctAnswerId": "6020033"
  },
  {
    "qid": "5020010",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "Which keyword prevents a class from being inherited in modern C++?",
    "answers": [
      { "id": "6020037", "text": "const" },
      { "id": "6020038", "text": "final" },
      { "id": "6020039", "text": "sealed" },
      { "id": "6020040", "text": "override" }
    ],
    "correctAnswerId": "6020038"
  }
];

const EXAM_QUESTIONS_125814 = [
  {
    "qid": "4014001",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "In a singly circular linked list, what does the next pointer of the last node point to?",
    "answers": [
      { "id": "4945001", "text": "NULL" },
      { "id": "4945002", "text": "The first (head) node" },
      { "id": "4945003", "text": "The previous node" },
      { "id": "4945004", "text": "Itself only when there are multiple nodes" }
    ],
    "correctAnswerId": "4945002"
  },
  {
    "qid": "4014002",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "What condition checks if a circular linked list has only a single node (pointed to by head)?",
    "answers": [
      { "id": "4945005", "text": "head.next == NULL" },
      { "id": "4945006", "text": "head.next == head" },
      { "id": "4945007", "text": "head == NULL" },
      { "id": "4945008", "text": "head.prev == NULL" }
    ],
    "correctAnswerId": "4945006"
  },
  {
    "qid": "4014003",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "What is the time complexity of inserting a node at the end of a circular linked list if only the head pointer is maintained?",
    "answers": [
      { "id": "4945009", "text": "O(1)" },
      { "id": "4945010", "text": "O(log n)" },
      { "id": "4945011", "text": "O(n)" },
      { "id": "4945012", "text": "O(n^2)" }
    ],
    "correctAnswerId": "4945011"
  },
  {
    "qid": "4014004",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "Which pointer gives O(1) insertion at both the beginning and end of a singly circular linked list?",
    "answers": [
      { "id": "4945013", "text": "Maintaining only the head pointer" },
      { "id": "4945014", "text": "Maintaining the tail (last) pointer" },
      { "id": "4945015", "text": "Maintaining a middle pointer" },
      { "id": "4945016", "text": "None, O(1) insertion is impossible" }
    ],
    "correctAnswerId": "4945014"
  },
  {
    "qid": "4014005",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "Which real-world application commonly uses a circular linked list?",
    "answers": [
      { "id": "4945017", "text": "Undo/Redo stack in a text editor" },
      { "id": "4945018", "text": "Round-robin CPU process scheduling" },
      { "id": "4945019", "text": "Binary search on sorted arrays" },
      { "id": "4945020", "text": "Depth-First Search recursion stack" }
    ],
    "correctAnswerId": "4945018"
  }
];

const EXAM_QUESTIONS_COMMUNICATION = [
  {
    "qid": "4015001",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "What is the primary objective of technical communication?",
    "answers": [
      { "id": "4946001", "text": "To entertain the audience" },
      { "id": "4946002", "text": "To convey specific technical information clearly and accurately" },
      { "id": "4946003", "text": "To use complex vocabulary and jargon" },
      { "id": "4946004", "text": "To write lengthy essays" }
    ],
    "correctAnswerId": "4946002"
  },
  {
    "qid": "4015002",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "In the 7 Cs of effective communication, which 'C' emphasizes delivering the message in the fewest words without sacrificing clarity?",
    "answers": [
      { "id": "4946005", "text": "Courtesy" },
      { "id": "4946006", "text": "Conciseness" },
      { "id": "4946007", "text": "Concreteness" },
      { "id": "4946008", "text": "Completeness" }
    ],
    "correctAnswerId": "4946006"
  },
  {
    "qid": "4015003",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "Which type of listening involves analyzing, evaluating, and judging the content of a message?",
    "answers": [
      { "id": "4946009", "text": "Passive listening" },
      { "id": "4946010", "text": "Appreciative listening" },
      { "id": "4946011", "text": "Critical / Evaluative listening" },
      { "id": "4946012", "text": "Discriminative listening" }
    ],
    "correctAnswerId": "4946011"
  },
  {
    "qid": "4015004",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "Which barrier to communication occurs due to emotional bias, anxiety, or distrust between speaker and listener?",
    "answers": [
      { "id": "4946013", "text": "Physical barrier" },
      { "id": "4946014", "text": "Psychological barrier" },
      { "id": "4946015", "text": "Mechanical barrier" },
      { "id": "4946016", "text": "Linguistic barrier" }
    ],
    "correctAnswerId": "4946014"
  },
  {
    "qid": "4015005",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "In a formal technical report or research paper, what is the role of an Abstract?",
    "answers": [
      { "id": "4946017", "text": "To list personal biographies of the authors" },
      { "id": "4946018", "text": "To provide a concise summary of the entire document including objectives, methods, and key findings" },
      { "id": "4946019", "text": "To list the table of contents" },
      { "id": "4946020", "text": "To explain acknowledgements and financial sponsors" }
    ],
    "correctAnswerId": "4946018"
  }
];

const EXAM_QUESTIONS_WORKSHOP = [
  {
    "qid": "4016001",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "Which command in Linux is used to display the current working directory path?",
    "answers": [
      { "id": "4947001", "text": "dir" },
      { "id": "4947002", "text": "pwd" },
      { "id": "4947003", "text": "cd" },
      { "id": "4947004", "text": "path" }
    ],
    "correctAnswerId": "4947002"
  },
  {
    "qid": "4016002",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "What is the function of the 'chmod' command in Unix/Linux?",
    "answers": [
      { "id": "4947005", "text": "Change file modification date" },
      { "id": "4947006", "text": "Change file access permissions" },
      { "id": "4947007", "text": "Change memory allocation" },
      { "id": "4947008", "text": "Change model of system" }
    ],
    "correctAnswerId": "4947006"
  },
  {
    "qid": "4016003",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "Which IP address represents the standard IPv4 loopback (localhost) address?",
    "answers": [
      { "id": "4947009", "text": "192.168.1.1" },
      { "id": "4947010", "text": "10.0.0.1" },
      { "id": "4947011", "text": "127.0.0.1" },
      { "id": "4947012", "text": "255.255.255.0" }
    ],
    "correctAnswerId": "4947011"
  },
  {
    "qid": "4016004",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "Which protocol provides secure encrypted terminal access and file transfer over an insecure network?",
    "answers": [
      { "id": "4947013", "text": "Telnet" },
      { "id": "4947014", "text": "HTTP" },
      { "id": "4947015", "text": "SSH (Secure Shell)" },
      { "id": "4947016", "text": "FTP" }
    ],
    "correctAnswerId": "4947015"
  },
  {
    "qid": "4016005",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "What is the primary role of BIOS / UEFI firmware in personal computers?",
    "answers": [
      { "id": "4947017", "text": "Compile C++ programs into machine code" },
      { "id": "4947018", "text": "Perform POST (Power-On Self Test) and initialize hardware to boot the operating system" },
      { "id": "4947019", "text": "Manage database indexing" },
      { "id": "4947020", "text": "Provide antivirus network filtering" }
    ],
    "correctAnswerId": "4947018"
  }
];

const EXAM_QUESTIONS_IPS = [
  {
    "qid": "4017001",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "What is a finite, unambiguous, step-by-step sequence of instructions designed to solve a problem called?",
    "answers": [
      { "id": "4948001", "text": "Pseudocode" },
      { "id": "4948002", "text": "Algorithm" },
      { "id": "4948003", "text": "Flowchart" },
      { "id": "4948004", "text": "Compiler" }
    ],
    "correctAnswerId": "4948002"
  },
  {
    "qid": "4017002",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "In a standard program flowchart, which geometric symbol represents a decision or conditional branch?",
    "answers": [
      { "id": "4948005", "text": "Rectangle" },
      { "id": "4948006", "text": "Diamond" },
      { "id": "4948007", "text": "Oval" },
      { "id": "4948008", "text": "Parallelogram" }
    ],
    "correctAnswerId": "4948006"
  },
  {
    "qid": "4017003",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "What is the worst-case time complexity of Binary Search on a sorted array of n elements?",
    "answers": [
      { "id": "4948009", "text": "O(n)" },
      { "id": "4948010", "text": "O(n^2)" },
      { "id": "4948011", "text": "O(log n)" },
      { "id": "4948012", "text": "O(1)" }
    ],
    "correctAnswerId": "4948011"
  },
  {
    "qid": "4017004",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "Which programming technique involves a function calling itself directly or indirectly to solve smaller instances of a problem?",
    "answers": [
      { "id": "4948013", "text": "Iteration" },
      { "id": "4948014", "text": "Recursion" },
      { "id": "4948015", "text": "Paging" },
      { "id": "4948016", "text": "Polymorphism" }
    ],
    "correctAnswerId": "4948014"
  },
  {
    "qid": "4017005",
    "marks": 1,
    "type": "MULTIPLE-CHOICE",
    "text": "Which algorithmic paradigm breaks a complex problem into overlapping subproblems, solves each once, and memoizes the result?",
    "answers": [
      { "id": "4948017", "text": "Greedy approach" },
      { "id": "4948018", "text": "Dynamic Programming" },
      { "id": "4948019", "text": "Backtracking" },
      { "id": "4948020", "text": "Brute Force" }
    ],
    "correctAnswerId": "4948018"
  }
];

function getMasterAnswerKey(qid, text = '', answers = []) {
  const qStr = String(qid || '');
  const allSets = [
    EXAM_QUESTIONS_125821,
    EXAM_QUESTIONS_125814,
    EXAM_QUESTIONS_AI,
    EXAM_QUESTIONS_OOPM,
    EXAM_QUESTIONS_COMMUNICATION,
    EXAM_QUESTIONS_WORKSHOP,
    EXAM_QUESTIONS_IPS
  ];

  // 1. Direct QID lookup
  for (const set of allSets) {
    const found = set.find(q => String(q.qid) === qStr);
    if (found && found.correctAnswerId) {
      if (!answers || !answers.length || answers.some(a => String(a.id) === String(found.correctAnswerId))) {
        return String(found.correctAnswerId);
      }
    }
  }

  // 2. Normalized Text lookup
  const clean = (s) => String(s || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const targetClean = clean(text);
  if (targetClean) {
    for (const set of allSets) {
      const found = set.find(q => clean(q.text) === targetClean);
      if (found) {
        const correctOpt = found.answers.find(a => String(a.id) === String(found.correctAnswerId));
        if (correctOpt && Array.isArray(answers) && answers.length) {
          const optClean = clean(correctOpt.text);
          const matchInLive = answers.find(a => clean(a.text) === optClean);
          if (matchInLive) return String(matchInLive.id);
        }
        if (found.correctAnswerId) return String(found.correctAnswerId);
      }
    }
  }

  return null;
}

function getExamQuestions(examId, subjectName = '') {
  const id = String(examId || '');
  const sName = String(subjectName || '').toUpperCase();
  if (id === '125814') {
    return EXAM_QUESTIONS_125814;
  }
  if (id === '125821' || sName.includes('DATA STRUCTURE')) {
    return EXAM_QUESTIONS_125821;
  }
  if (sName.includes('AI') || sName.includes('ARTIFICIAL') || sName.includes('MACHINE')) {
    return EXAM_QUESTIONS_AI;
  }
  if (sName.includes('OOPM') || sName.includes('OBJECT') || sName.includes('C++') || sName.includes('JAVA')) {
    return EXAM_QUESTIONS_OOPM;
  }
  if (sName.includes('COMMUNICATION') || sName.includes('ENGLISH') || sName.includes('AL-301')) {
    return EXAM_QUESTIONS_COMMUNICATION;
  }
  if (sName.includes('WORKSHOP') || sName.includes('COMPUTER WORKSHOP')) {
    return EXAM_QUESTIONS_WORKSHOP;
  }
  if (sName.includes('IPS') || sName.includes('PROBLEM') || sName.includes('AL-302')) {
    return EXAM_QUESTIONS_IPS;
  }
  return EXAM_QUESTIONS_125821;
}

const NOTIFICATIONS = [
  {
    "id": 283146469,
    "text": "A new session has been scheduled for AI (Theory) | session on 18th Nov 2026 from 10:50 AM to 11:40 AM",
    "readOn": "2026-11-18 10:52:50",
    "addedOn": "2026-11-18 10:52:50",
    "isRead": false,
    "moduleId": 15
  },
  {
    "id": 283147046,
    "text": "A new session has been scheduled for AI (Theory) | session on 18th Nov 2026 from 03:20 PM to 04:00 PM",
    "readOn": "2026-11-18 10:53:15",
    "addedOn": "2026-11-18 10:53:15",
    "isRead": false,
    "moduleId": 15
  },
  {
    "id": 283174004,
    "text": "A new session has been scheduled for OOPM (Theory) | session on 18th Nov 2026 from 04:00 PM to 04:40 PM",
    "readOn": "2026-11-18 11:10:10",
    "addedOn": "2026-11-18 11:10:10",
    "isRead": false,
    "moduleId": 15
  },
  {
    "id": 283337463,
    "text": "A new session has been scheduled for DATA STRUCTURE (Theory) | session on 19th Nov 2026 from 11:40 AM to 12:30 PM",
    "readOn": "2026-11-19 04:48:56",
    "addedOn": "2026-11-19 04:48:56",
    "isRead": false,
    "moduleId": 15
  },
  {
    "id": 283338361,
    "text": "A new session has been scheduled for DATA STRUCTURE (Theory) | session on 19th Nov 2026 from 02:00 PM to 02:40 PM",
    "readOn": "2026-11-19 04:49:28",
    "addedOn": "2026-11-19 04:49:28",
    "isRead": false,
    "moduleId": 15
  },
  {
    "id": 283339927,
    "text": "A new session has been scheduled for TG (Theory) | session on 19th Nov 2026 from 03:20 PM to 04:00 PM",
    "readOn": "2026-11-19 04:50:27",
    "addedOn": "2026-11-19 04:50:27",
    "isRead": false,
    "moduleId": 15
  },
  {
    "id": 283365524,
    "text": "The data structure \"circular linkedlist\" has been assigned to you.",
    "readOn": "2026-11-19 05:03:28",
    "addedOn": "2026-11-19 05:03:28",
    "isRead": false,
    "moduleId": 17
  },
  {
    "id": 283367055,
    "text": "A new session has been scheduled for AI (Practical) | session on 19th Nov 2026 from 10:00 AM to 11:40 AM",
    "readOn": "2026-11-19 05:04:11",
    "addedOn": "2026-11-19 05:04:11",
    "isRead": false,
    "moduleId": 15
  },
  {
    "id": 283470161,
    "text": "The DATA STRUCTURE \"unit 2\" has been assigned to you.",
    "readOn": "2026-11-19 05:55:57",
    "addedOn": "2026-11-19 05:55:57",
    "isRead": false,
    "moduleId": 17
  },
  {
    "id": 283677352,
    "text": "A new session has been scheduled for TECHNICAL COMMUNICATION (Theory) | session on 19th Nov 2026 from 12:30 PM to 01:20 PM",
    "readOn": "2026-11-19 07:45:23",
    "addedOn": "2026-11-19 07:45:23",
    "isRead": false,
    "moduleId": 15
  }
];
const ASSIGNMENTS = [
  {
    "id": 204150,
    "subId": "216599",
    "title": "Experiment 4: Circular Linked List",
    "subAssignmentTitle": "circular linkedlist",
    "subject_id": 246498,
    "subject_name": "data structure",
    "subject_type": "Practical",
    "due_date": "2026-11-25",
    "startDate": "2026-11-19",
    "displayStartDate": "19th Nov, 2026",
    "displayEndDate": "25th Nov, 2026",
    "status": "Pending",
    "marks": 10,
    "obtainedMarks": null,
    "evaluation": "",
    "submitted_on": null,
    "submitted_file": null,
    "instructorAttachment": "exp4-circular-linked-list.pdf",
    "facultyName": "Sapna Raikwar",
    "batchName": "BATCH 2",
    "instruction": "Implement circular linked list operations (insert, delete, display). Get verified by faculty before ERP submission."
  },
  {
    "id": 202928,
    "subId": "215238",
    "title": "Lab Assignment-5",
    "subAssignmentTitle": "Lab-5",
    "subject_id": 246497,
    "subject_name": "oopm",
    "subject_type": "Practical",
    "due_date": "2026-10-28",
    "startDate": "2026-10-21",
    "displayStartDate": "21st Oct,2026",
    "displayEndDate": "28th Oct,2026",
    "status": "Completed",
    "marks": 2,
    "obtainedMarks": null,
    "evaluation": "",
    "submitted_on": "2026-10-28",
    "submitted_file": "6ada4622689f4.pdf",
    "instructorAttachment": "l-5-ec3127074b31.jpg",
    "facultyName": "Sarvagya Jain",
    "batchName": "BATCH 2",
    "instruction": ""
  },
  {
    "id": 202923,
    "subId": "215235",
    "title": "Lab Assignment-4",
    "subAssignmentTitle": "Lab-4",
    "subject_id": 246497,
    "subject_name": "oopm",
    "subject_type": "Practical",
    "due_date": "2026-10-28",
    "startDate": "2026-10-21",
    "displayStartDate": "21st Oct,2026",
    "displayEndDate": "28th Oct,2026",
    "status": "Completed",
    "marks": 2,
    "obtainedMarks": null,
    "evaluation": "",
    "submitted_on": "2026-10-28",
    "submitted_file": "6ada4611179da.pdf",
    "instructorAttachment": "l-4-bed1d3512da8.jpg",
    "facultyName": "Sarvagya Jain",
    "batchName": "BATCH 2",
    "instruction": ""
  },
  {
    "id": 202919,
    "subId": "215231",
    "title": "Lab Assignment-3",
    "subAssignmentTitle": "Lab-3",
    "subject_id": 246497,
    "subject_name": "oopm",
    "subject_type": "Practical",
    "due_date": "2026-10-28",
    "startDate": "2026-10-21",
    "displayStartDate": "21st Oct,2026",
    "displayEndDate": "28th Oct,2026",
    "status": "Completed",
    "marks": 2,
    "obtainedMarks": null,
    "evaluation": "",
    "submitted_on": "2026-10-28",
    "submitted_file": "6ada460481d01.pdf",
    "instructorAttachment": "l-3-c2b834c9435f.jpg",
    "facultyName": "Sarvagya Jain",
    "batchName": "BATCH 2",
    "instruction": ""
  },
  {
    "id": 202915,
    "subId": "215228",
    "title": "Lab Assignment-2",
    "subAssignmentTitle": "Lab-2",
    "subject_id": 246497,
    "subject_name": "oopm",
    "subject_type": "Practical",
    "due_date": "2026-10-28",
    "startDate": "2026-10-21",
    "displayStartDate": "21st Oct,2026",
    "displayEndDate": "28th Oct,2026",
    "status": "Completed",
    "marks": 2,
    "obtainedMarks": null,
    "evaluation": "",
    "submitted_on": "2026-10-28",
    "submitted_file": "6ada45f4ec0dd.pdf",
    "instructorAttachment": "l-2-d4bfd2ed7c3e.jpg",
    "facultyName": "Sarvagya Jain",
    "batchName": "BATCH 2",
    "instruction": ""
  },
  {
    "id": 202912,
    "subId": "215225",
    "title": "Lab Assignment-1 ",
    "subAssignmentTitle": "Lab-1",
    "subject_id": 246497,
    "subject_name": "oopm",
    "subject_type": "Practical",
    "due_date": "2026-10-28",
    "startDate": "2026-10-21",
    "displayStartDate": "21st Oct,2026",
    "displayEndDate": "28th Oct,2026",
    "status": "Completed",
    "marks": 2,
    "obtainedMarks": null,
    "evaluation": "",
    "submitted_on": "2026-10-28",
    "submitted_file": "6ada45e02c097.pdf",
    "instructorAttachment": "l-1-0b7bd0d73857.jpg",
    "facultyName": "Sarvagya Jain",
    "batchName": "BATCH 2",
    "instruction": ""
  },
  {
    "id": 190473,
    "subId": "202221",
    "title": "ASSIGNMENT 2",
    "subAssignmentTitle": "ASSIGNMENT 2",
    "subject_id": 240848,
    "subject_name": "AI",
    "subject_type": "Theory",
    "due_date": "2026-10-31",
    "startDate": "2026-10-15",
    "displayStartDate": "15th Oct,2026",
    "displayEndDate": "31st Oct,2026",
    "status": "Completed",
    "marks": 10,
    "obtainedMarks": null,
    "evaluation": "",
    "submitted_on": "2026-10-31",
    "submitted_file": "6ada4689df461.pdf",
    "instructorAttachment": "assignment-55517-50958-6500390555b48.pdf",
    "facultyName": "Ritu Bhadauria,Rajeev Raghuwanshi",
    "batchName": "",
    "instruction": "DO NOT COPY,SUBMIT HARD COPY "
  },
  {
    "id": 201002,
    "subId": "213089",
    "title": "Assignment-2",
    "subAssignmentTitle": "Assignment-2",
    "subject_id": 240849,
    "subject_name": "OOPM",
    "subject_type": "Theory",
    "due_date": "2026-10-23",
    "startDate": "2026-10-13",
    "displayStartDate": "13th Oct,2026",
    "displayEndDate": "23rd Oct,2026",
    "status": "Completed",
    "marks": 10,
    "obtainedMarks": null,
    "evaluation": "",
    "submitted_on": "2026-10-23",
    "submitted_file": "6ada469793356.pdf",
    "instructorAttachment": "Assignment-2-55127cfb6c9a.pdf",
    "facultyName": "Sarvagya Jain",
    "batchName": "",
    "instruction": ""
  },
  {
    "id": 196701,
    "subId": "208506",
    "title": "EXPERIMENT 1",
    "subAssignmentTitle": "EXPERIMENT 1",
    "subject_id": 246500,
    "subject_name": "computer workshop",
    "subject_type": "Practical",
    "due_date": "2026-10-03",
    "startDate": "2026-09-29",
    "displayStartDate": "29th Sep,2026",
    "displayEndDate": "03rd Oct,2026",
    "status": "Completed",
    "marks": 10,
    "obtainedMarks": null,
    "evaluation": "",
    "submitted_on": "2026-10-03",
    "submitted_file": "6ac112119acbe.pdf",
    "instructorAttachment": "EXPERIMENT 1 PYTHON-3c021e44e6d2.docx",
    "facultyName": "Akansha Shrivastava",
    "batchName": "BATCH 2",
    "instruction": "UPLOAD EXPERIMENT 1"
  },
  {
    "id": 196507,
    "subId": "208311",
    "title": "assignment 1",
    "subAssignmentTitle": "assignment 1",
    "subject_id": 240846,
    "subject_name": "IPS",
    "subject_type": "Theory",
    "due_date": "2026-10-07",
    "startDate": "2026-09-29",
    "displayStartDate": "29th Sep,2026",
    "displayEndDate": "07th Oct,2026",
    "status": "Completed",
    "marks": 10,
    "obtainedMarks": null,
    "evaluation": "",
    "submitted_on": "2026-10-07",
    "submitted_file": "6ac514bbf17db.pdf",
    "instructorAttachment": "Assignment 1 IPS OIST (1)-1b89e999b301.pdf",
    "facultyName": "Sreeja Nair,Rahul Gupta",
    "batchName": "",
    "instruction": "please submit with in deadline"
  },
  {
    "id": 195165,
    "subId": "206875",
    "title": "Unit 1",
    "subAssignmentTitle": "Unit 1",
    "subject_id": 240847,
    "subject_name": "DATA STRUCTURE",
    "subject_type": "Theory",
    "due_date": "2026-10-04",
    "startDate": "2026-09-24",
    "displayStartDate": "24th Sep,2026",
    "displayEndDate": "04th Oct,2026",
    "status": "Completed",
    "marks": 10,
    "obtainedMarks": null,
    "evaluation": "",
    "submitted_on": "2026-10-04",
    "submitted_file": "6abe9d2f53567.pdf",
    "instructorAttachment": "DSA 1-5f4ab4dee01d.docx",
    "facultyName": "Sreeja Nair,Sapna Raikwar",
    "batchName": "",
    "instruction": "First, you must complete your assignment and get it checked by me. Only after the assignment has been checked and approved by me will you be allowed to upload it to the ERP system."
  },
  {
    "id": 194457,
    "subId": "206133",
    "title": "Assignment-1 ",
    "subAssignmentTitle": "Assignment-1",
    "subject_id": 240849,
    "subject_name": "OOPM",
    "subject_type": "Theory",
    "due_date": "2026-09-29",
    "startDate": "2026-09-22",
    "displayStartDate": "22nd Sep,2026",
    "displayEndDate": "29th Sep,2026",
    "status": "Completed",
    "marks": 10,
    "obtainedMarks": 9,
    "evaluation": "graded",
    "submitted_on": "2026-09-29",
    "submitted_file": "6abaafdf568a8.pdf",
    "instructorAttachment": "Assignment-1-e2775e734dc0.pdf",
    "facultyName": "Sarvagya Jain",
    "batchName": "",
    "instruction": ""
  },
  {
    "id": 190472,
    "subId": "202219",
    "title": "ASSIGNMENT 1",
    "subAssignmentTitle": "ASSIGNMENT 1",
    "subject_id": 240848,
    "subject_name": "AI",
    "subject_type": "Theory",
    "due_date": "2026-10-10",
    "startDate": "2026-09-07",
    "displayStartDate": "07th Sep,2026",
    "displayEndDate": "10th Oct,2026",
    "status": "Completed",
    "marks": 10,
    "obtainedMarks": null,
    "evaluation": "",
    "submitted_on": "2026-10-10",
    "submitted_file": "6abd44c125dab.png",
    "instructorAttachment": "assignment-54352-49855-64df249bca9ac.pdf",
    "facultyName": "Ritu Bhadauria,Rajeev Raghuwanshi",
    "batchName": "",
    "instruction": "SUBMIT HARD COPY BY RESPECTIVE FACULTY ,DO NOT COPY"
  }
];
const NAVIGATION_MODULES = [
  {
    "id": "1",
    "title": "Home",
    "iconName": "align-left",
    "iconType": "fas",
    "url": "/modules/studentsummary/#/",
    "jsIconName": "fas fa-align-left",
    "description": "Personalized dashboard for quick access to updates, notifications, schedules, and academic tools."
  },
  {
    "id": "2",
    "title": "Leaderboard",
    "iconName": "trophy",
    "iconType": "fas",
    "url": "/modules/leaderboard/#/",
    "jsIconName": "fas fa-trophy",
    "description": "Promotes competition, encourages engagement, and showcases achievements among all participants effectively."
  },
  {
    "id": "3",
    "title": "Online Courses",
    "iconName": "book",
    "iconType": "fas",
    "url": "/modules/lms/#/",
    "jsIconName": "fa fa-desktop",
    "description": "Access flexible online courses with secure, scalable learning and assessment features."
  },
  {
    "id": "4",
    "title": "Value Added Courses",
    "iconName": "book",
    "iconType": "fas",
    "url": "/student/ValuePlus.php",
    "jsIconName": "fas fa-book",
    "description": "Enhances employability through certifications, skill-building programs, and value-added learning modules."
  },
  {
    "id": "5",
    "title": "Modules / Online Exam",
    "iconName": "folder-open",
    "iconType": "fas",
    "url": "/student/AssignedModules.php",
    "jsIconName": "fas fa-folder-open",
    "description": "Secure, flexible platform for conducting online assessments and accessing assigned academic modules."
  },
  {
    "id": "6",
    "title": "Academic Planning",
    "iconName": "calendar-alt",
    "iconType": "fas",
    "url": "/moduleversions/academicplanning/V1/#/",
    "jsIconName": "fas fa-calendar-alt",
    "description": "Streamlines course planning to ensure optimized schedules and effective resource allocation."
  },
  {
    "id": "7",
    "title": "Profile",
    "iconName": "user",
    "iconType": "fas",
    "url": "/modules/profiles/#/",
    "jsIconName": "fas fa-user",
    "description": "Manage and update user profiles to maintain transparency and enhance academic communication."
  },
  {
    "id": "17",
    "title": "Inventory",
    "iconName": "archive",
    "iconType": "fas",
    "url": "/modules/inventory/#/",
    "jsIconName": "fa fa-archive",
    "moduleType": [
      "ERP (Enterprise Resource Planning)"
    ],
    "description": "Tracks inventory efficiently, reducing waste and improving procurement and storage operations."
  },
  {
    "id": "19",
    "title": "Applications",
    "iconName": "file-alt",
    "iconType": "fas",
    "url": "/modules/applications/#/",
    "jsIconName": "fas fa-file-alt",
    "description": "Submit academic, administrative, and leave applications with real-time tracking and approval workflows."
  },
  {
    "id": "9",
    "title": "Fees",
    "iconName": "rupee-sign",
    "iconType": "fas",
    "url": "/moduleversions/fees/V1/#/",
    "jsIconName": "fas fa-rupee-sign",
    "description": "Simplifies fee payment, tracking, and receipt generation for students and administration alike."
  },
  {
    "id": "10",
    "title": "e-Grievance",
    "iconName": "child",
    "iconType": "fas",
    "url": "/modules/grievance/#/",
    "jsIconName": "fas fa-child",
    "description": "Digitally manage student grievances with transparency, documentation, and resolution tracking."
  },
  {
    "id": "10",
    "title": "Training and Placement",
    "iconName": "user-tie",
    "iconType": "fas",
    "url": "/modules/tnp/#/",
    "jsIconName": "fas fa-user",
    "description": "Tracks placement opportunities, enhances employability, and supports student career readiness effectively."
  },
  {
    "id": "11",
    "title": "Notice Board",
    "iconName": "bullhorn",
    "iconType": "fas",
    "url": "/modules/noticeboard/#/",
    "jsIconName": "fas fa-bullhorn",
    "description": "Delivers real-time updates and announcements to students through a centralized system."
  },
  {
    "id": "12",
    "title": "Assignment (Internal Test)",
    "iconName": "tasks",
    "iconType": "fas",
    "url": "/student/Assignments/AssignmentList.php",
    "jsIconName": "fas fa-tasks",
    "description": "Facilitates digital assignment creation, submission, evaluation, and feedback in one place."
  },
  {
    "id": "13",
    "title": "Institute Feedback",
    "iconName": "comment",
    "iconType": "fas",
    "url": "/student/FeedbackSystem.php",
    "jsIconName": "fas fa-comment",
    "description": "Collects structured feedback to improve institutional processes and stakeholder satisfaction."
  },
  {
    "id": "14",
    "title": "Result Analysis",
    "iconName": "chart-area",
    "iconType": "fas",
    "url": "/modules/resultanalysis/#/",
    "jsIconName": "fas fa-chart-area",
    "description": "Instantly view exam results, marksheets, and performance analytics in a secure format."
  },
  {
    "id": "15",
    "title": "Certificate Request",
    "iconName": "certificate",
    "iconType": "fas",
    "url": "/modules/certificate/#/",
    "jsIconName": "fas fa-certificate",
    "description": "Request and track academic or administrative certificates with real-time digital updates."
  },
  {
    "id": "16",
    "title": "Personalise",
    "iconName": "cog",
    "iconType": "fas",
    "url": "/modules/personalise/#/",
    "jsIconName": "fas fa-cog",
    "description": "Update personal information and preferences securely through a customizable user interface."
  },
  {
    "id": "17",
    "title": "Library (ILMS)",
    "iconName": "book",
    "iconType": "fas",
    "url": "/modules/library/#/",
    "jsIconName": "fa fa-book",
    "description": "Search, borrow, and return books efficiently with smart library management tools."
  },
  {
    "id": "18",
    "title": "Mentoring",
    "iconName": "chalkboard-teacher",
    "iconType": "fas",
    "url": "/modules/mentoring/#/",
    "jsIconName": "fas fa-user",
    "description": "Enhances student success through mentorship, guidance tracking, and collaborative support tools."
  },
  {
    "id": "19",
    "title": "Hostel",
    "iconName": "building",
    "iconType": "fas",
    "url": "/modules/hostel/#/",
    "jsIconName": "fas fa-building",
    "description": "Manage room allotments, fees, complaints, and student hostel life with transparency."
  },
  {
    "id": "21",
    "title": "Transport",
    "iconName": "bus",
    "iconType": "fas",
    "url": "/modules/transport/#/",
    "jsIconName": "fas fa-bus",
    "moduleType": [
      "ERP (Enterprise Resource Planning)"
    ],
    "description": "Plan and track student transport routes, timing, and safety efficiently."
  },
  {
    "id": "22",
    "title": "Assessment",
    "iconName": "folder-open",
    "iconType": "fas",
    "url": "/modules/examForms/#/",
    "jsIconName": "fas fa-folder-open",
    "moduleType": [
      "ERP (Enterprise Resource Planning)"
    ],
    "description": "Submit exam forms digitally with prefilled data, status tracking, and secure verification."
  },
  {
    "id": "23",
    "title": "Events",
    "iconName": "folder-open",
    "iconType": "fas",
    "url": "/modules/event/#/events",
    "jsIconName": "fas fa-folder-open",
    "moduleType": [
      "ERP (Enterprise Resource Planning)"
    ],
    "description": "Plan and manage campus events with attendance, certificates, and communication tools."
  }
];

function parseRemainingSeconds(val) {
  if (val === '' || val === null || val === undefined) return null;
  const num = Number(val);
  return Number.isFinite(num) && num >= 0 ? Math.floor(num) : null;
}

function formatIstDateTime(ms = Date.now()) {
  const d = new Date(ms + 19800000);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
}

function parseAutoSavedSelection(rawSelection) {
  const map = {};
  if (!rawSelection) return map;
  let list = rawSelection;
  if (typeof list === 'string') {
    try { list = JSON.parse(list); } catch { return map; }
  }
  if (!Array.isArray(list)) return map;
  list.forEach(item => {
    if (!item || item.q === undefined || item.q === null) return;
    const qid = String(item.q);
    const rawA = item.a;
    if (Array.isArray(rawA)) {
      const clean = rawA.map(v => String(v ?? '')).filter(Boolean);
      if (clean.length) map[qid] = clean.join(',');
    } else if (rawA !== undefined && rawA !== null && String(rawA) !== '') {
      map[qid] = String(rawA);
    }
  });
  return map;
}

function buildExamPerformanceArray(answers, allQuestionIds = [], questionTypesByQid = {}) {
  const ansMap = answers || {};
  const orderedIds = [];
  const seen = new Set();
  (allQuestionIds || []).forEach(qid => {
    const k = String(qid);
    if (!seen.has(k)) { seen.add(k); orderedIds.push(k); }
  });
  Object.keys(ansMap).forEach(qid => {
    const k = String(qid);
    if (!seen.has(k)) { seen.add(k); orderedIds.push(k); }
  });
  return orderedIds.map(qid => {
    const raw = ansMap[qid];
    const qType = String(questionTypesByQid[qid] || '').toUpperCase();
    let aArr;
    if (Array.isArray(raw)) {
      aArr = raw.map(v => String(v ?? '')).filter(Boolean);
    } else if (qType === 'ONE-WORD' || qType === 'DESCRIPTIVE') {
      const val = String(raw ?? '').trim();
      aArr = val ? [val] : [''];
    } else {
      aArr = String(raw ?? '').split(',').map(s => s.trim()).filter(Boolean);
    }
    return { q: qid, a: aArr.length ? aArr : [''] };
  });
}

function parseExamAnswersInput(body) {
  const answers = Object.assign({}, (body && body.answers) || {});
  const perfRaw = body && body.performance;
  let perf = perfRaw;
  if (typeof perf === 'string') {
    try { perf = JSON.parse(perf); } catch { perf = null; }
  }
  if (Array.isArray(perf)) {
    perf.forEach(item => {
      if (item && item.q && Array.isArray(item.a)) {
        const clean = item.a.map(v => String(v ?? '')).filter(Boolean);
        if (clean.length) answers[item.q] = clean.join(',');
      }
    });
  }
  return answers;
}

function buildLiveUserRecord(username, password, liveData, templateUser, fallbackUser) {
  const s = (liveData && liveData.studentData) || {};
  const td = (liveData && liveData.tokenDetails) || {};
  const group = (s.groupDetailsArray && s.groupDetailsArray[0]) || {};
  const streamName = group.streamname || 'B. Tech';
  const sid = Number(group.streamid) || 1084;
  const groupid = Number(group.gid) || 101182;
  const groupName = group.grpname || '';
  const semMatch = groupName.match(/-(I{1,3}V?|VI{0,3}|[1-8])(?:-|$)/i);
  const semester = semMatch ? `Semester ${semMatch[1].toUpperCase()}` : 'Semester III';
  const yearList = Array.isArray(liveData.AcademicYearList) ? liveData.AcademicYearList : [];
  const acaYearObj = yearList.find(y => String(y.YearId) === String(s.Acayear));
  const admYearObj = yearList.find(y => String(y.YearId) === String(s.admissionYear));

  const regBatches = (s.studentAssignedBatches && Array.isArray(s.studentAssignedBatches.ubid_array))
    ? s.studentAssignedBatches.ubid_array.map(String)
    : (group.buid ? [String(group.buid)] : []);
  const elBatches = (s.electiveBatches && Array.isArray(s.electiveBatches.ubid_array))
    ? s.electiveBatches.ubid_array.map(String)
    : [];
  const batchIds = [...new Set([...regBatches, ...elBatches])];
  if (!batchIds.length) batchIds.push('70134');

  const batchObj = s.studentAssignedBatches && s.studentAssignedBatches.data && s.studentAssignedBatches.data[batchIds[0]];
  const batchName = (batchObj && batchObj.batchname) || group.batch || 'Batch 1';
  const elGroupList = (s.electiveBatches && s.electiveBatches.data && typeof s.electiveBatches.data === 'object')
    ? Object.values(s.electiveBatches.data).map(b => b && b.groupid).filter(Boolean).map(String)
    : [];
  const electiveGroupIds = [...new Set([String(groupid), ...elGroupList])];

  const tpl = templateUser || fallbackUser || USERS['STOIST25963'] || {};
  return {
    username,
    password,
    account: liveData.account || 'student',
    loginUser: liveData.user || username,
    name: `${s.FirstName || ''} ${s.LastName || ''}`.trim() || username,
    mobile: s.MobileNumber || '',
    email: s.EmailId || '',
    dp_url: s.UserDp || tpl.dp_url || '',
    stuid: String(s.stuid || ''),
    prn: s.PRNno || '',
    dob: s.DOB || '',
    streamName,
    groupName,
    semester,
    batchName,
    academicYear: (acaYearObj && acaYearObj.YearText) || '2026-27',
    admissionYear: (admYearObj && admYearObj.YearText) || '',
    points: Number(s.Points) || 0,
    sid,
    groupid,
    buid: Number(batchIds[0]) || 70134,
    batchIds,
    electiveGroupIds,
    acayr: Number(s.Acayear) || 12,
    learnerToken: (td.data && td.data.user_token) || '',
    syncToken: (td.data && td.data.sync_token) || '',
    deviceId: td.deviceId || s.deviceId || '',
    academicYearList: yearList,
    groupDetailsArray: Array.isArray(s.groupDetailsArray) ? s.groupDetailsArray : [],
    studentAssignedBatches: s.studentAssignedBatches || { data: {}, ubid_array: batchIds },
    electiveBatches: s.electiveBatches || { data: [], ubid_array: [] },
    rawStudentData: s,
    mentor: tpl.mentor || {},
    fees: { totalAmount: 63500, paid: 63500, balance: 0, percentage: 100, status: 'Fully Paid' },
    streams: [{ sid, groupid: null, name: streamName }, { sid, groupid, name: null }],
    subjects: tpl.subjects || [],
    capturedSessions: tpl.capturedSessions || [],
    targetMetrics: tpl.targetMetrics || {
      present_count: 38, absent_count: 30, total_sessions: 68, present_pct: 55.88, absent_pct: 44.12, average_pct: 58.99
    }
  };
}

function buildPortalCookieHeader(user, authToken) {
  const b64 = (s) => Buffer.from(String(s), 'utf8').toString('base64');
  const db64 = (s) => b64(b64(s));
  const raw = (user && user.rawStudentData) || {};
  const userDetailsObj = {
    data: {
      account: user.account || 'student',
      user_id: user.loginUser || raw.user_id || user.username || raw.PRNno || user.stuid,
      Acayear: String(user.acayr || raw.Acayear || '12'),
      admissionYear: raw.admissionYear !== undefined ? raw.admissionYear : '',
      DOB: user.dob || raw.DOB || '',
      EmailId: user.email || raw.EmailId || '',
      FirstName: raw.FirstName || (user.name || '').split(' ')[0] || '',
      InstitudeId: raw.InstitudeId || INSTITUTE.id,
      InstituteLogo: raw.InstituteLogo || INSTITUTE.logo,
      InstituteName: raw.InstituteName || INSTITUTE.name,
      InstituteShortName: raw.InstituteShortName || INSTITUTE.shortName,
      InstituteUrl: raw.InstituteUrl || INSTITUTE.url,
      LastName: raw.LastName || (user.name || '').split(' ').slice(1).join(' ') || '',
      MobileNumber: user.mobile || raw.MobileNumber || '',
      PRNno: user.prn || raw.PRNno || '',
      PlStream: raw.PlStream || '',
      Points: user.points !== undefined ? user.points : (raw.Points || 0),
      UserDp: user.dp_url || raw.UserDp || '',
      stuid: Number(user.stuid) || raw.stuid || 0,
      DeviceId: user.deviceId || raw.deviceId || ''
    },
    role: 'learner',
    success: 'true'
  };
  const encodedUserDetails = db64(JSON.stringify(userDetailsObj));
  const encodedAcyearList = db64(JSON.stringify(user.academicYearList || []));
  const encodedGroupDetails = b64(JSON.stringify(
    Array.isArray(user.groupDetailsArray) && user.groupDetailsArray.length
      ? user.groupDetailsArray
      : [{
          streamid: String(user.sid || ''),
          gid: String(user.groupid || ''),
          grpname: user.groupName || '',
          default_group: 'default',
          buid: String(user.buid || ''),
          batch: user.batchName || '',
          streamname: user.streamName || ''
        }]
  ));
  const encodedAssignedBatches = b64(JSON.stringify(user.studentAssignedBatches || {
    data: {},
    ubid_array: (user.batchIds || []).map(String)
  }));
  const elData = (user.electiveBatches && user.electiveBatches.data) ? user.electiveBatches.data : [];
  const encodedElectiveBatches = b64(JSON.stringify(elData));
  const tok = authToken || user.learnerToken || '';
  const syncTok = user.syncToken || '';

  return [
    `acyear=${encodedAcyearList}`,
    `learner_studentAssignedBatches=${encodedAssignedBatches}`,
    `learner_groupDetailsArray=${encodedGroupDetails}`,
    `learner_studentAssignedElectiveBatches=${encodedElectiveBatches}`,
    `user_token=${tok}`,
    `sync_token=${syncTok}`,
    `user_details=${encodedUserDetails}`,
    `user_token_wc=${tok}`,
    `sync_token_wc=${syncTok}`,
    `user_details_wc=${encodedUserDetails}`
  ].join('; ');
}

function mapPortalExam(e) {
  const isComp = String(e.completionStatus) === '1';
  const marksAllowed = e.viewStudentMarksAllowed || 'off';
  const perfAllowed = e.viewStudentPerformanceAllowed || 'off';
  const rawScore = Number(e.obtainedScore);
  const hasVisibleScore = isComp && Number.isFinite(rawScore) && (marksAllowed === 'on' || perfAllowed === 'on' || rawScore > 0);
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
    viewStudentPerformanceAllowed: perfAllowed,
    allowStartExam: Boolean(e.allowStartExam),
    strictMode: e.strictMode || 'off',
    examAccessStatus: e.examAccessStatus || '',
    startExamLink: e.startExamLink || '',
    studentExamStartTime: e.studentExamStartTime || '',
    submittedAtFormatted: e.studentExamSubmissionTimeFormatted || '',
    ...(hasVisibleScore ? { studentScore: rawScore } : {}),
    ...(subTime ? { submittedAt: subTime } : {}),
    source: 'live'
  };
}

function mapPortalAssignment(item, assignmentType = null) {
  const isExamBased = assignmentType === 'exam' || (item.uniqueid !== undefined && item.parentAssignmentId === undefined);
  if (isExamBased) {
    const isComp = item.examAssignmentStatus === 'uploaded';
    const subFile = item.filePath ? String(item.filePath).split('/').pop() : null;
    return {
      id: Number(item.uniqueid || item.id || 0),
      uniqueid: String(item.uniqueid || item.id || ''),
      examId: String(item.examId || '0'),
      subId: String(item.examId || '0'),
      assignmentType: 'exam',
      sid: String(item.sid || ''),
      title: item.title || item.examName || 'Exam Assignment',
      subAssignmentTitle: item.examName || item.title || '',
      subject_id: Number(item.subjectId || item.subjectid || 0),
      subject_name: item.subjectName || 'Subject',
      subject_type: item.subjectType || 'Theory',
      due_date: item.submissionDate || '',
      startDate: '',
      displayStartDate: 'Exam Coursework',
      displayEndDate: item.submissionDate || '',
      displayDateMsg: '',
      toDisplayAssignment: true,
      pattern: 'exam-api-upload',
      status: isComp ? 'Completed' : 'Pending',
      marks: 10,
      obtainedMarks: null,
      evaluation: '',
      instructor_review: '',
      submitted_on: isComp ? (item.submissionDate || '') : null,
      submitted_file: isComp ? (subFile || 'Submitted_Assignment.pdf') : null,
      learner_attachment_path: item.filePath || '',
      subAssignmentAttachmentName: '',
      instructorAttachment: '',
      instructor_attachment_path: '',
      facultyName: item.facultyName || '',
      batchName: '',
      instruction: item.instruction || '',
      source: 'live'
    };
  }

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
    assignmentType: 'web',
    sid: String(item.sid || ''),
    title: item.parentAssignmentName || item.subAssignmentTitle || 'Coursework Assignment',
    subAssignmentTitle: item.subAssignmentTitle || item.parentAssignmentName || '',
    subject_id: Number(item.subjectid || item.subjectId || 0),
    subject_name: item.subjectName || 'Subject',
    subject_type: item.subjectType || 'Theory',
    due_date: item.endDate || '',
    startDate: item.startDate || '',
    displayStartDate: item.displayStartDate || item.startDate || '',
    displayEndDate: item.displayEndDate || item.endDate || '',
    displayStartTime: item.displayStartTime || '',
    displayEndTime: item.displayEndTime || '',
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
    subAssignmentAttachmentName: item.subAssignmentAttachmentName || '',
    instructorAttachment: instFile || '',
    instructor_attachment_path: item.instructor_attachment_path || '',
    facultyName: item.facultyName || '',
    batchName: item.batchName || '',
    instruction: item.subAssignmentInstruction || '',
    source: 'live'
  };
}

function parsePortalUploadHtml(htmlText = '') {
  const text = String(htmlText || '');
  const lower = text.toLowerCase();
  if (lower.includes('authentication failed') || lower.includes('vmlogout.php') || lower.includes('unauthorized request')) {
    return { ok: false, authFailed: true, error: 'Portal session authentication failed.' };
  }
  const ok = lower.includes('file uploaded successfully')
    || lower.includes('uploaded successfully')
    || /UserWarningAlert\s*\(\s*["']Success!["']\s*,[^;]*["']success["']\s*\)/i.test(text);
  if (ok) return { ok: true, message: 'File uploaded successfully.' };

  const warnMatch = text.match(/UserWarningAlert\s*\(\s*["']([^"']*)["']\s*,\s*["']([^"']*)["']\s*,\s*["']([^"']*)["']/i);
  if (warnMatch && warnMatch[2] && !warnMatch[2].includes("response['message']")) {
    return { ok: false, error: `${warnMatch[1]}: ${warnMatch[2]}`.trim() };
  }
  const alertMatch = text.match(/alert\s*\(\s*["']([^"']+)["']\s*\)/i);
  if (alertMatch && alertMatch[1]) {
    return { ok: false, error: alertMatch[1] };
  }
  return { ok: false, error: 'Portal did not confirm file upload.' };
}

module.exports = {
  EXAM_QUESTIONS_125814,
  EXAM_QUESTIONS_AI,
  EXAM_QUESTIONS_OOPM,
  EXAM_QUESTIONS_COMMUNICATION,
  EXAM_QUESTIONS_WORKSHOP,
  EXAM_QUESTIONS_IPS,
  getMasterAnswerKey,
  getExamQuestions,
  parseRemainingSeconds,
  formatIstDateTime,
  parseAutoSavedSelection,
  buildExamPerformanceArray,
  parseExamAnswersInput,
  buildLiveUserRecord,
  buildPortalCookieHeader,
  mapPortalExam,
  mapPortalAssignment,
  parsePortalUploadHtml,
  INSTITUTE,
  USERS,
  EXAMS,
  EXAM_QUESTIONS_125821,
  NOTIFICATIONS,
  ASSIGNMENTS,
  NAVIGATION_MODULES
};
