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
    "totalQuestions": 10,
    "totalMarks": 10,
    "startDate": "10th Sep, 2026",
    "startTime": "01:00 pm",
    "endTime": "01:20 pm"
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
    "totalQuestions": 10,
    "totalMarks": 10,
    "startDate": "18th Sep, 2026",
    "startTime": "02:00 pm",
    "endTime": "02:50 pm"
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
    "totalQuestions": 10,
    "totalMarks": 10,
    "startDate": "3rd Oct, 2026",
    "startTime": "11:00 am",
    "endTime": "11:40 am"
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
    "startTime": "03:40 pm",
    "endTime": "04:30 pm"
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
    "startTime": "03:30 pm",
    "endTime": "05:00 pm"
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
    "startTime": "09:00 am",
    "endTime": "11:50 pm"
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
    "totalQuestions": 10,
    "totalMarks": 10,
    "startDate": "24th Sep, 2026",
    "startTime": "12:50 pm",
    "endTime": "01:30 pm"
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
    "totalQuestions": 10,
    "totalMarks": 5,
    "startDate": "29th Sep, 2026",
    "startTime": "09:00 am",
    "endTime": "11:55 pm"
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
    "totalQuestions": 10,
    "totalMarks": 5,
    "startDate": "29th Sep, 2026",
    "startTime": "03:30 pm",
    "endTime": "04:00 pm"
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
    "totalQuestions": 10,
    "totalMarks": 10,
    "startDate": "1st Oct, 2026",
    "startTime": "12:30 pm",
    "endTime": "01:30 pm"
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
    "totalQuestions": 10,
    "totalMarks": 10,
    "startDate": "3rd Oct, 2026",
    "startTime": "11:20 am",
    "endTime": "12:00 pm"
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
    "totalQuestions": 10,
    "totalMarks": 10,
    "startDate": "3rd Oct, 2026",
    "startTime": "03:30 pm",
    "endTime": "05:30 pm"
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
    "totalQuestions": 10,
    "totalMarks": 5,
    "startDate": "7th Oct, 2026",
    "startTime": "09:00 am",
    "endTime": "11:55 pm"
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
    "totalQuestions": 10,
    "totalMarks": 20,
    "startDate": "8th Oct, 2026",
    "startTime": "12:40 pm",
    "endTime": "01:20 pm"
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
    "totalQuestions": 10,
    "totalMarks": 10,
    "startDate": "9th Oct, 2026",
    "startTime": "07:00 pm",
    "endTime": "08:00 pm"
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
    "totalQuestions": 10,
    "totalMarks": 5,
    "startDate": "10th Oct, 2026",
    "startTime": "11:00 am",
    "endTime": "11:20 am"
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
    "startTime": "03:30 pm",
    "endTime": "05:00 pm"
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
    "totalQuestions": 10,
    "totalMarks": 10,
    "startDate": "15th Oct, 2026",
    "startTime": "12:40 pm",
    "endTime": "01:20 pm"
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
    "totalQuestions": 10,
    "totalMarks": 10,
    "startDate": "21st Oct, 2026",
    "startTime": "03:00 pm",
    "endTime": "05:00 pm"
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
    "totalQuestions": 10,
    "totalMarks": 10,
    "startDate": "21st Oct, 2026",
    "startTime": "03:00 pm",
    "endTime": "05:00 pm"
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
    "totalQuestions": 10,
    "totalMarks": 10,
    "startDate": "21st Oct, 2026",
    "startTime": "03:00 pm",
    "endTime": "05:00 pm"
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
    "startTime": "12:00 pm",
    "endTime": "12:30 pm"
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
    "startTime": "11:20 am",
    "endTime": "11:45 am"
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
    "totalQuestions": 10,
    "totalMarks": 5,
    "startDate": "19th Nov, 2026",
    "startTime": "09:00 am",
    "endTime": "11:55 pm"
  },
  {
    "examId": "125821",
    "examName": "unit 2",
    "examSyllabus": "stack And Queue",
    "completionStatus": "0",
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
    "startTime": "09:00 am",
    "endTime": "11:55 pm"
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

function getExamQuestions(examId, subjectName = '') {
  const sName = String(subjectName || '').toUpperCase();
  if (examId === '125821' || sName.includes('DATA STRUCTURE')) {
    return EXAM_QUESTIONS_125821;
  }
  if (sName.includes('AI') || sName.includes('ARTIFICIAL') || sName.includes('MACHINE')) {
    return EXAM_QUESTIONS_AI;
  }
  if (sName.includes('OOPM') || sName.includes('OBJECT') || sName.includes('C++') || sName.includes('JAVA')) {
    return EXAM_QUESTIONS_OOPM;
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
    "id": 101,
    "title": "Experiment 1: Array Implementation & Traversal in C++",
    "subject_id": 240847,
    "subject_name": "DATA STRUCTURE",
    "subject_type": "Practical",
    "due_date": "2026-09-20",
    "status": "Completed",
    "marks": 10,
    "submitted_on": "2026-09-18"
  },
  {
    "id": 102,
    "title": "Experiment 2: 2D Array Matrix Operations & Row-Major Order",
    "subject_id": 240847,
    "subject_name": "DATA STRUCTURE",
    "subject_type": "Practical",
    "due_date": "2026-09-28",
    "status": "Completed",
    "marks": 10,
    "submitted_on": "2026-09-26"
  },
  {
    "id": 103,
    "title": "Experiment 3: Singly Linked List Node Operations",
    "subject_id": 240847,
    "subject_name": "DATA STRUCTURE",
    "subject_type": "Practical",
    "due_date": "2026-10-15",
    "status": "Completed",
    "marks": 10,
    "submitted_on": "2026-10-12"
  },
  {
    "id": 104,
    "title": "Experiment 4: Circular Linked List Implementation",
    "subject_id": 240847,
    "subject_name": "DATA STRUCTURE",
    "subject_type": "Practical",
    "due_date": "2026-11-25",
    "status": "Pending",
    "marks": 10,
    "submitted_on": null
  },
  {
    "id": 105,
    "title": "Assignment 1: Uninformed & Informed Search Algorithms (BFS & DFS)",
    "subject_id": 240848,
    "subject_name": "AI",
    "subject_type": "Theory",
    "due_date": "2026-10-10",
    "status": "Completed",
    "marks": 15,
    "submitted_on": "2026-10-08"
  },
  {
    "id": 106,
    "title": "Assignment 2: Heuristic Functions and A* Search Algorithm",
    "subject_id": 240848,
    "subject_name": "AI",
    "subject_type": "Theory",
    "due_date": "2026-11-22",
    "status": "Pending",
    "marks": 15,
    "submitted_on": null
  },
  {
    "id": 107,
    "title": "Assignment 1: Class Hierarchies, Encapsulation & Inheritance in C++",
    "subject_id": 240849,
    "subject_name": "OOPM",
    "subject_type": "Theory",
    "due_date": "2026-10-05",
    "status": "Completed",
    "marks": 10,
    "submitted_on": "2026-10-03"
  },
  {
    "id": 108,
    "title": "Assignment 2: Virtual Functions and Runtime Polymorphism",
    "subject_id": 240849,
    "subject_name": "OOPM",
    "subject_type": "Theory",
    "due_date": "2026-11-26",
    "status": "Pending",
    "marks": 10,
    "submitted_on": null
  },
  {
    "id": 109,
    "title": "Lab Practical: Python NumPy & Pandas Data Manipulation",
    "subject_id": 246500,
    "subject_name": "computer workshop",
    "subject_type": "Practical",
    "due_date": "2026-11-24",
    "status": "Pending",
    "marks": 10,
    "submitted_on": null
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

module.exports = {
  EXAM_QUESTIONS_AI,
  EXAM_QUESTIONS_OOPM,
  getExamQuestions,
  INSTITUTE,
  USERS,
  EXAMS,
  EXAM_QUESTIONS_125821,
  NOTIFICATIONS,
  ASSIGNMENTS,
  NAVIGATION_MODULES
};
