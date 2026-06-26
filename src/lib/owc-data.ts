/* =========================================================================
   Office of Workers Compensation (OWC) — PNG
   Shared content & mock data for the mobile app.
   Swap the exported async helpers in lib/api.ts for the live OWC backend.
   ========================================================================= */

export const ORG = {
  name: "Office of Workers Compensation",
  shortName: "OWC",
  ministry: "Ministry of Labour & Employment",
  country: "Independent State of Papua New Guinea",
  act: "Workers Compensation Act 1978",
  phone: "+675 321 1200",
  emergency: "+675 321 1299",
  email: "info@owc.gov.pg",
  claimsEmail: "claims@owc.gov.pg",
  fraudEmail: "integrity@owc.gov.pg",
  address: "OWC Haus, Level 3, Melanesian Way, Waigani",
  city: "National Capital District, Port Moresby",
  postal: "P.O. Box 5100, Boroko, NCD 111",
  hours: "Monday – Friday · 8:00 AM – 4:06 PM",
};

export const PROVINCES = [
  "National Capital District",
  "Central",
  "Morobe",
  "Eastern Highlands",
  "Western Highlands",
  "Madang",
  "East New Britain",
  "West New Britain",
  "East Sepik",
  "Enga",
  "Southern Highlands",
  "Milne Bay",
  "Other",
];

/* ---- Home quick actions ------------------------------------------------ */
export type QuickAction = {
  key: string;
  title: string;
  desc: string;
  icon: string;
  screen: string;
  tone?: "navy" | "gold" | "plain";
};

export const QUICK_ACTIONS: QuickAction[] = [
  { key: "lodge", title: "Lodge Claim", desc: "Start a compensation claim", icon: "FilePlus2", screen: "lodge", tone: "navy" },
  { key: "track", title: "Track Claim", desc: "Check claim status", icon: "Radar", screen: "track", tone: "gold" },
  { key: "employer", title: "Employer Services", desc: "Register & report injuries", icon: "Building2", screen: "employer" },
  { key: "forms", title: "Forms", desc: "Download official forms", icon: "FileDown", screen: "forms" },
  { key: "news", title: "News & Notices", desc: "Official announcements", icon: "Newspaper", screen: "news" },
  { key: "contact", title: "Contact OWC", desc: "Enquiries & offices", icon: "Headset", screen: "contact" },
  { key: "fraud", title: "Report Fraud", desc: "Confidential reporting", icon: "ShieldAlert", screen: "fraud" },
  { key: "account", title: "My Account", desc: "Profile & history", icon: "UserRound", screen: "account" },
];

/* ---- Headline stats ---------------------------------------------------- */
export const STAT_HIGHLIGHTS = [
  { label: "Claims lodged (2025)", value: "12,480", trend: "+6.2%" },
  { label: "Claims determined", value: "11,037", trend: "+8.1%" },
  { label: "Registered employers", value: "8,640", trend: "+4.0%" },
  { label: "Avg. determination", value: "34 days", trend: "−11 days" },
];

export const TICKER = [
  "Employer policy renewal period now open — renew before 31 July 2026.",
  "New online claims portal reduces determination times across all provinces.",
  "National OHS Awareness Week 2026 — free employer briefings nationwide.",
  "Beware of third parties requesting payment to process claims — lodging is free.",
];

/* ---- Claim tracking ---------------------------------------------------- */
export type ClaimStatusStep = { label: string; done: boolean; date?: string; note?: string };

export type ClaimRecord = {
  reference: string;
  worker: string;
  employer: string;
  injuryDate: string;
  lodged: string;
  type: string;
  status: "Received" | "Under Assessment" | "Awaiting Documents" | "Approved" | "Paid" | "Declined";
  steps: ClaimStatusStep[];
  pending?: string[];
  updates?: { date: string; text: string }[];
};

export const SAMPLE_CLAIMS: ClaimRecord[] = [
  {
    reference: "OWC-2026-004821",
    worker: "J. Kaupa",
    employer: "Highlands Construction Ltd",
    injuryDate: "12 Apr 2026",
    lodged: "18 Apr 2026",
    type: "Lower-back injury (manual handling)",
    status: "Under Assessment",
    steps: [
      { label: "Claim received", done: true, date: "18 Apr 2026" },
      { label: "Documents verified", done: true, date: "22 Apr 2026" },
      { label: "Medical assessment", done: true, date: "02 May 2026" },
      { label: "Determination", done: false },
      { label: "Compensation payment", done: false },
    ],
    pending: ["Medical Progress Report (MED-2)"],
    updates: [
      { date: "02 May 2026", text: "Independent medical assessment completed. Awaiting final report." },
      { date: "22 Apr 2026", text: "Employer wage records verified." },
    ],
  },
  {
    reference: "OWC-2026-003190",
    worker: "M. Wari",
    employer: "Pacific Logistics PNG",
    injuryDate: "02 Mar 2026",
    lodged: "06 Mar 2026",
    type: "Hand laceration",
    status: "Awaiting Documents",
    steps: [
      { label: "Claim received", done: true, date: "06 Mar 2026" },
      { label: "Documents verified", done: false },
      { label: "Medical assessment", done: false },
      { label: "Determination", done: false },
      { label: "Compensation payment", done: false },
    ],
    pending: ["Medical Practitioner's First Report (MED-1)", "Copy of national ID"],
    updates: [{ date: "08 Mar 2026", text: "Outstanding documents requested from claimant." }],
  },
];

export const CLAIM_TYPES = [
  "Fracture / broken bone",
  "Cut or laceration",
  "Burn",
  "Manual handling / back injury",
  "Crush injury",
  "Occupational illness",
  "Hearing loss",
  "Other",
];

export const REQUIRED_DOCS = [
  { code: "WC-1", label: "Worker's Application for Compensation" },
  { code: "MED-1", label: "Medical Practitioner's First Report" },
  { code: "ID", label: "Proof of identity (national ID / passport)" },
  { code: "WAGE", label: "Evidence of employment & wages (payslip)" },
  { code: "EVID", label: "Supporting evidence (photos, witness statements)" },
];

/* ---- News -------------------------------------------------------------- */
const IMG = {
  harbour: "https://upload.wikimedia.org/wikipedia/commons/3/38/Bus_station_near_Walter_Bay%2C_from_hills_%28cropped%29.jpg",
  heroWorker:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Coast_Guard_conducts_port_visit_in_Port_Moresby%2C_Papua_New_Guinea_%2852306468429%29.jpg/1280px-Coast_Guard_conducts_port_visit_in_Port_Moresby%2C_Papua_New_Guinea_%2852306468429%29.jpg",
  community:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Gerehu_Markets_Port_Moresby%2C_Papua_New_Guinea_%2810697727534%29.jpg/1280px-Gerehu_Markets_Port_Moresby%2C_Papua_New_Guinea_%2810697727534%29.jpg",
  child:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Gerehu_Markets_Port_Moresby%2C_Papua_New_Guinea_%2810697595053%29.jpg/1280px-Gerehu_Markets_Port_Moresby%2C_Papua_New_Guinea_%2810697595053%29.jpg",
  medical: "/png-medical.jpg",
};

export type NewsItem = {
  slug: string;
  category: "Announcement" | "Awareness" | "Public Notice" | "Consultation" | "Labour Update";
  date: string;
  title: string;
  excerpt: string;
  body: string;
  image: string;
  featured?: boolean;
};

export const NEWS: NewsItem[] = [
  {
    slug: "owc-digital-claims-launch",
    category: "Announcement",
    date: "2026-06-18",
    title: "OWC launches new mobile claims service for faster determinations",
    excerpt:
      "Injured workers and employers can now lodge and track workers compensation claims from their phones, reducing processing times across all provinces.",
    body: "The Office of Workers Compensation has launched a new mobile service enabling injured workers, dependants and employers to lodge and track claims securely from any smartphone. The service forms part of the Office's commitment to fair, timely and transparent administration of workers compensation under the Workers Compensation Act 1978. Claimants receive a reference number immediately and can follow each step of their claim — from receipt and document verification through to medical assessment, determination and payment.",
    image: IMG.harbour,
    featured: true,
  },
  {
    slug: "ohs-awareness-week-2026",
    category: "Awareness",
    date: "2026-06-04",
    title: "National Occupational Health & Safety Awareness Week 2026",
    excerpt:
      "OWC partners with industry to promote safer workplaces, with free employer briefings held in Port Moresby, Lae and Mt Hagen.",
    body: "OWC is partnering with industry bodies to deliver free occupational health and safety briefings for employers during National OHS Awareness Week. Sessions will be held in Port Moresby, Lae and Mt Hagen, covering hazard identification, injury prevention and employer reporting obligations.",
    image: IMG.heroWorker,
  },
  {
    slug: "employer-levy-2026-notice",
    category: "Public Notice",
    date: "2026-05-21",
    title: "Public Notice: Employer policy renewal period now open",
    excerpt:
      "All registered employers are reminded to renew their workers compensation insurance policies before 31 July 2026 to remain compliant.",
    body: "All registered employers are reminded that the annual policy renewal period is now open. Employers must renew their workers compensation insurance policies and lodge their Annual Wages Declaration (EMP-3) before 31 July 2026 to remain compliant with the Workers Compensation Act 1978.",
    image: IMG.community,
  },
  {
    slug: "consultation-act-review",
    category: "Consultation",
    date: "2026-05-09",
    title: "Public consultation: Review of the Workers Compensation Act",
    excerpt:
      "OWC invites submissions from workers, employers and the public on proposed amendments to modernise the compensation framework.",
    body: "OWC invites written submissions from workers, employers and members of the public on proposed amendments to modernise the workers compensation framework. Submissions can be lodged through the Contact & Enquiry service before the closing date.",
    image: IMG.medical,
  },
  {
    slug: "regional-office-kokopo",
    category: "Labour Update",
    date: "2026-04-27",
    title: "New OWC regional service desk opens in Kokopo",
    excerpt:
      "Workers and employers in the New Guinea Islands region can now access in-person claims support at the new Kokopo service desk.",
    body: "Workers and employers in the New Guinea Islands region can now access in-person claims support at the new OWC service desk in Kokopo, East New Britain. The desk provides assistance with lodgement, tracking and employer registration.",
    image: IMG.child,
  },
];

/* ---- Forms ------------------------------------------------------------- */
export type FormDoc = {
  code: string;
  title: string;
  category: "Claims" | "Employer" | "Medical" | "Guidelines";
  format: "PDF" | "DOCX";
  size: string;
  updated: string;
};

export const FORMS: FormDoc[] = [
  { code: "WC-1", title: "Worker's Application for Compensation", category: "Claims", format: "PDF", size: "248 KB", updated: "2026-03-01" },
  { code: "WC-2", title: "Notice of Workplace Accident / Injury", category: "Claims", format: "PDF", size: "190 KB", updated: "2026-03-01" },
  { code: "WC-3", title: "Claim for Dependants (Fatal Injury)", category: "Claims", format: "PDF", size: "204 KB", updated: "2026-02-12" },
  { code: "EMP-1", title: "Employer Registration Application", category: "Employer", format: "PDF", size: "176 KB", updated: "2026-01-20" },
  { code: "EMP-2", title: "Employer's Report of Injury", category: "Employer", format: "DOCX", size: "92 KB", updated: "2026-01-20" },
  { code: "EMP-3", title: "Annual Wages Declaration", category: "Employer", format: "PDF", size: "150 KB", updated: "2026-02-28" },
  { code: "MED-1", title: "Medical Practitioner's First Report", category: "Medical", format: "PDF", size: "210 KB", updated: "2026-03-15" },
  { code: "MED-2", title: "Medical Progress / Final Report", category: "Medical", format: "PDF", size: "198 KB", updated: "2026-03-15" },
  { code: "MED-3", title: "Permanent Incapacity Assessment", category: "Medical", format: "PDF", size: "232 KB", updated: "2026-02-02" },
  { code: "GUI-1", title: "Guide for Injured Workers", category: "Guidelines", format: "PDF", size: "1.2 MB", updated: "2026-04-10" },
  { code: "GUI-2", title: "Employer Compliance Handbook", category: "Guidelines", format: "PDF", size: "1.8 MB", updated: "2026-04-10" },
  { code: "GUI-3", title: "Schedule of Compensation Rates 2026", category: "Guidelines", format: "PDF", size: "640 KB", updated: "2026-01-05" },
];

export const FORM_CATEGORIES = ["All", "Claims", "Employer", "Medical", "Guidelines"] as const;

/* ---- Employer services ------------------------------------------------- */
export const EMPLOYER_STEPS = [
  { title: "Register your business", desc: "Lodge an Employer Registration Application (EMP-1) and take out a workers compensation insurance policy.", icon: "ClipboardList" },
  { title: "Meet your obligations", desc: "Maintain a safe workplace, keep wage records and renew your policy each year.", icon: "ShieldCheck" },
  { title: "Report injuries within 7 days", desc: "Notify OWC within 7 days of becoming aware of a workplace injury or illness.", icon: "Siren" },
  { title: "Support the claim", desc: "Provide wage details and an Employer's Report of Injury (EMP-2) to assist determination.", icon: "Handshake" },
];

export const EMPLOYER_OBLIGATIONS = [
  "Hold a current workers compensation insurance policy for all workers.",
  "Notify OWC of any workplace injury or illness within 7 days.",
  "Keep accurate records of wages and hours for all employees.",
  "Lodge an Annual Wages Declaration (EMP-3) each year.",
  "Cooperate with OWC assessments and provide requested information.",
  "Not dismiss or disadvantage a worker for lodging a legitimate claim.",
];

/* ---- Contact / enquiry ------------------------------------------------- */
export const ENQUIRY_CATEGORIES = [
  "General Enquiry",
  "New Claim Assistance",
  "Existing Claim / Status",
  "Employer Registration",
  "Workplace Injury Report",
  "Medical / Assessment",
  "Forms & Documents",
  "Complaint or Feedback",
  "Media & Communications",
];

/* ---- Fraud reporting --------------------------------------------------- */
export const FRAUD_CATEGORIES = [
  "False or exaggerated claim",
  "Employer not insured / unregistered",
  "Under-declared wages",
  "Identity or document fraud",
  "Bribery or staff misconduct",
  "Third party charging fees for claims",
  "Other suspected misconduct",
];

/* ---- FAQs -------------------------------------------------------------- */
export const CLAIM_FAQS = [
  {
    q: "Who can lodge a workers compensation claim?",
    a: "Any worker employed under a contract of service in PNG who suffers a personal injury by accident arising out of, or in the course of, their employment may lodge a claim under the Workers Compensation Act 1978. Dependants may also claim in the event of a work-related death.",
  },
  {
    q: "How soon must I report a workplace injury?",
    a: "Notice should be given to your employer as soon as practicable. Employers must notify OWC within 7 days of becoming aware of a workplace injury or illness.",
  },
  {
    q: "What documents do I need to submit?",
    a: "You will generally need a completed Worker's Application for Compensation (WC-1), a Medical Practitioner's First Report (MED-1), evidence of employment and wages, and any supporting documents such as witness statements or photographs.",
  },
  {
    q: "Is there a cost to lodge a claim?",
    a: "No. Lodging a claim with OWC is free of charge. Be cautious of any third party requesting payment to process your claim.",
  },
  {
    q: "How long does a determination take?",
    a: "Straightforward claims are typically determined within 30–45 days of receiving all required documents. Complex claims may take longer.",
  },
];

/* ---- Notifications ----------------------------------------------------- */
export type Notification = {
  id: string;
  type: "claim" | "document" | "appointment" | "notice" | "system";
  title: string;
  body: string;
  time: string;
  unread: boolean;
};

export const NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "document", title: "Document required", body: "Claim OWC-2026-004821 needs a Medical Progress Report (MED-2).", time: "2h ago", unread: true },
  { id: "n2", type: "claim", title: "Claim status updated", body: "Your claim has moved to ‘Under Assessment’.", time: "1d ago", unread: true },
  { id: "n3", type: "appointment", title: "Medical assessment booked", body: "Assessment confirmed for 02 May 2026, 10:00 AM, POM General Hospital.", time: "3d ago", unread: false },
  { id: "n4", type: "notice", title: "Public notice", body: "Employer policy renewal period is now open until 31 July 2026.", time: "5d ago", unread: false },
  { id: "n5", type: "system", title: "Welcome to OWC PNG", body: "Your account is verified. You can now lodge and track claims securely.", time: "1w ago", unread: false },
];

/* ---- Account ----------------------------------------------------------- */
export const PROFILE = {
  name: "John Kaupa",
  phone: "+675 7012 3456",
  email: "john.kaupa@example.com",
  province: "National Capital District",
  memberSince: "Apr 2026",
  verified: true,
};

/* ---- Staff (admin lite) ------------------------------------------------ */
export type StaffItem = {
  id: string;
  kind: "Enquiry" | "Claim" | "Fraud" | "Message";
  ref: string;
  subject: string;
  from: string;
  priority: "Low" | "Normal" | "High" | "Urgent";
  time: string;
  status: "New" | "In Review" | "Actioned";
};

export const STAFF_QUEUE: StaffItem[] = [
  { id: "s1", kind: "Claim", ref: "OWC-2026-004940", subject: "New claim — fracture (mining)", from: "P. Namaliu", priority: "High", time: "12m ago", status: "New" },
  { id: "s2", kind: "Fraud", ref: "FR-2026-0218", subject: "Suspected under-declared wages", from: "Anonymous", priority: "Urgent", time: "40m ago", status: "New" },
  { id: "s3", kind: "Enquiry", ref: "ENQ-2026-1183", subject: "Existing claim / status update", from: "M. Wari", priority: "Normal", time: "1h ago", status: "In Review" },
  { id: "s4", kind: "Message", ref: "MSG-2026-0771", subject: "Employer registration help", from: "Pacific Logistics PNG", priority: "Low", time: "3h ago", status: "New" },
  { id: "s5", kind: "Claim", ref: "OWC-2026-004902", subject: "Dependant claim (fatal)", from: "R. Soso", priority: "High", time: "5h ago", status: "In Review" },
  { id: "s6", kind: "Enquiry", ref: "ENQ-2026-1179", subject: "Forms — schedule of rates", from: "T. Aila", priority: "Low", time: "yesterday", status: "Actioned" },
];

export const STAFF_STATS = [
  { label: "New today", value: "18" },
  { label: "In review", value: "7" },
  { label: "Urgent", value: "2" },
  { label: "Actioned", value: "41" },
];
