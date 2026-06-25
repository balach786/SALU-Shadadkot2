/**
 * ============================================================
 *  SMART ADMISSION SYSTEM – CLIENT CONFIG
 * ============================================================
 *
 *  Paste your deployed Google Apps Script Web App URL below.
 *  It must end with `/exec`.
 *
 *  How to obtain it:
 *  1. Open Google Apps Script (script.google.com)
 *  2. Create a new project and paste the contents of
 *     `docs/apps-script.gs` from this repo.
 *  3. Set the SHEET_ID and DRIVE_FOLDER_ID constants at the top
 *     of that file (see `docs/SETUP.md`).
 *  4. Deploy → New deployment → Type: Web app
 *     - Execute as: Me
 *     - Who has access: Anyone
 *  5. Copy the generated /exec URL and paste it below.
 *
 *  Until this URL is set, form submission and CNIC search will
 *  show a clear "Backend not configured" message.
 * ============================================================
 */
export const APPS_SCRIPT_URL: string = "https://script.google.com/macros/s/AKfycbxvZ4IG0dK7hDgvkooECp9eAdNaRonnNoSEDgqeSDMXsTY42tVyZC-QMqIAR_9FzyUE/exec";

/** Brand metadata used across the site. */
export const SITE = {
  name: "Shah Abdul Latif University",
  shortName: "SALU",
  campus: "Shadadkot Campus",
  tagline: "Empowering Futures Through Excellence in Education",
  address: "Shah Abdul Latif University Shadadkot Campus, Shadadkot, Sindh, Pakistan",
  phone: "+92 074 4011234",
  email: "info@salu-shadadkot.edu.pk",
  admissionsEmail: "admissions@salu-shadadkot.edu.pk",
  facebook: "https://facebook.com",
  twitter: "https://twitter.com",
  instagram: "https://instagram.com",
  youtube: "https://youtube.com",
  mapEmbed:
    "https://www.google.com/maps?q=Shadadkot,Sindh,Pakistan&output=embed",
} as const;

export const PROGRAMS = [
  {
    slug: "bs-computer-science",
    title: "BS Computer Science",
    short: "Software, AI, data and modern computing fundamentals.",
    duration: "4 Years (8 Semesters)",
    credits: "133 Credit Hours",
    seats: 60,
    fee: "Rs. 45,000 / semester",
    eligibility: "F.Sc. Pre-Engineering / ICS with minimum 50% marks.",
    careers: [
      "Software Engineer",
      "Data Scientist",
      "AI/ML Engineer",
      "Cybersecurity Analyst",
      "Full-stack Developer",
    ],
    curriculum: [
      { sem: "Semester 1", courses: ["Programming Fundamentals", "Calculus I", "English I", "Islamic Studies", "Intro to Computing"] },
      { sem: "Semester 2", courses: ["Object Oriented Programming", "Discrete Maths", "English II", "Pakistan Studies", "Digital Logic"] },
      { sem: "Semester 3", courses: ["Data Structures", "Linear Algebra", "Database Systems", "Computer Organization"] },
      { sem: "Semester 4", courses: ["Algorithms", "Operating Systems", "Web Engineering", "Probability & Statistics"] },
      { sem: "Semester 5–8", courses: ["AI", "Networks", "Software Engineering", "Cybersecurity", "Final Year Project"] },
    ],
  },
  {
    slug: "bs-english",
    title: "BS English",
    short: "Literature, linguistics and modern critical theory.",
    duration: "4 Years (8 Semesters)",
    credits: "130 Credit Hours",
    seats: 50,
    fee: "Rs. 32,000 / semester",
    eligibility: "F.A. / F.Sc. with English and minimum 45% marks.",
    careers: [
      "Lecturer / Educator",
      "Content Writer",
      "Editor & Publisher",
      "Translator",
      "Public Relations Officer",
    ],
    curriculum: [
      { sem: "Semester 1", courses: ["Intro to Literature", "English Grammar", "Islamic Studies", "Functional English"] },
      { sem: "Semester 2", courses: ["Classical Poetry", "Phonetics", "Pakistan Studies", "Composition"] },
      { sem: "Semester 3", courses: ["Drama", "Linguistics I", "Short Stories", "Research Methods"] },
      { sem: "Semester 4", courses: ["Novel", "Linguistics II", "American Literature"] },
      { sem: "Semester 5–8", courses: ["Postcolonial Studies", "Critical Theory", "Modern Poetry", "Dissertation"] },
    ],
  },
  {
    slug: "bs-bba",
    title: "BS BBA",
    short: "Modern business administration with leadership focus.",
    duration: "4 Years (8 Semesters)",
    credits: "135 Credit Hours",
    seats: 60,
    fee: "Rs. 40,000 / semester",
    eligibility: "F.A. / F.Sc. / I.Com with minimum 50% marks.",
    careers: [
      "Business Analyst",
      "Marketing Manager",
      "HR Specialist",
      "Entrepreneur",
      "Financial Analyst",
    ],
    curriculum: [
      { sem: "Semester 1", courses: ["Principles of Management", "Financial Accounting", "Business Maths", "English I"] },
      { sem: "Semester 2", courses: ["Microeconomics", "Marketing", "Statistics", "English II"] },
      { sem: "Semester 3", courses: ["Macroeconomics", "Cost Accounting", "Organizational Behaviour"] },
      { sem: "Semester 4", courses: ["Finance", "HR Management", "Business Communication"] },
      { sem: "Semester 5–8", courses: ["Strategic Management", "Entrepreneurship", "International Business", "Internship & Project"] },
    ],
  },
] as const;

export type ProgramSlug = typeof PROGRAMS[number]["slug"];
