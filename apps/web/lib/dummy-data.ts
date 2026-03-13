// ─── Types ────────────────────────────────────────────────────────────────────

export type Article = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  date: string;
  readTime: number;
  featured: boolean;
  image?: string;
};

export type Blog = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  authorRole: string;
  date: string;
  readTime: number;
  featured: boolean;
  image?: string;
};

export type Resource = {
  id: string;
  name: string;
  description: string;
  categoryGroupId: string;
  category: string;
  tags: string[];
  phone?: string;
  website?: string;
  address?: string;
  hours?: string;
  notes?: string | { label: string; url?: string }[];
  eligibility?: string;
  free: boolean;
};

export type ResourceCategoryGroup = {
  id: string;
  label: string;
  description: string;
  icon: string;
  colorClass: string;
  badgeClass: string;
  categories: string[];
  resourceCount: number;
};

export type Newsletter = {
  id: string;
  title: string;
  season: string;
  year: number;
  pdfUrl: string;
  coverImage?: string;
  description: string;
};

export type ExternalLink = {
  label: string;
  url: string;
  description?: string;
};

export type ExternalLinkGroup = {
  id: string;
  title: string;
  description: string;
  icon: string;
  colorClass: string;
  badge?: string;
  links: ExternalLink[];
};

// ─── Article Categories & Tags ────────────────────────────────────────────────

export const ARTICLE_CATEGORIES = [
  "Health & Wellness",
  "Financial Planning",
  "Legal & Estate",
  "Housing & Living",
  "Caregiving",
  "Technology",
  "Nutrition & Diet",
  "Mental Health",
  "Exercise & Fitness",
  "Medication Management",
];

export const ARTICLE_TAGS = [
  "Medicare",
  "Medicaid",
  "Social Security",
  "Veterans Benefits",
  "Dementia",
  "Alzheimer's",
  "Arthritis",
  "Diabetes",
  "Heart Health",
  "Fall Prevention",
  "Home Safety",
  "Assisted Living",
  "Memory Care",
  "Estate Planning",
  "Wills & Trusts",
  "Power of Attorney",
  "Advance Directive",
  "Retirement Income",
  "Reverse Mortgage",
  "Long-Term Care Insurance",
  "Caregiver Burnout",
  "Respite Care",
  "Hospice",
  "Palliative Care",
  "Hearing Loss",
  "Vision Care",
  "Dental Health",
  "Bone Health",
  "Sleep",
  "Hydration",
  "Balance & Mobility",
  "Cognitive Health",
];

// ─── Blog Categories & Tags ───────────────────────────────────────────────────

export const BLOG_CATEGORIES = [
  "Organization Updates",
  "Volunteer Spotlights",
  "Board News",
  "Event Recaps",
  "Community Partnerships",
  "Fundraising",
  "Staff Introductions",
  "Program Announcements",
];

export const BLOG_TAGS = [
  "501(c)(3)",
  "Non-Profit",
  "Volunteer",
  "Fundraiser",
  "Annual Report",
  "Board of Directors",
  "Grant Award",
  "Community Event",
  "Partnership",
  "New Program",
  "Staff Highlight",
  "Milestone",
  "Donation Drive",
  "Health Fair",
  "Holiday Event",
  "Town Hall",
];

// ─── Resource Category Groups — two-level hierarchy ──────────────────────────
// Represents 80 categories grouped under 10 umbrella sections

export const RESOURCE_CATEGORY_GROUPS: ResourceCategoryGroup[] = [
  {
    id: "health-medical",
    label: "Health & Medical",
    description:
      "Doctors, clinics, hospitals, specialists, mental health, dental, vision, and pharmacy resources.",
    icon: "Heart",
    colorClass: "text-rose-700 bg-rose-50 border-rose-200",
    badgeClass: "bg-rose-100 text-rose-800",
    categories: [
      "Primary Care",
      "Specialists",
      "Mental Health",
      "Dental & Vision",
      "Pharmacy",
      "Home Health",
      "Physical Therapy",
      "Hearing Care",
      "Hospice & Palliative",
      "Telehealth",
    ],
    resourceCount: 142,
  },
  {
    id: "financial-benefits",
    label: "Financial & Benefits",
    description:
      "Medicare, Medicaid, Social Security, veterans benefits, assistance programs, and financial counseling.",
    icon: "DollarSign",
    colorClass: "text-emerald-700 bg-emerald-50 border-emerald-200",
    badgeClass: "bg-emerald-100 text-emerald-800",
    categories: [
      "Medicare & Medicaid",
      "Social Security",
      "Veterans Benefits",
      "Financial Assistance",
      "Food Assistance",
      "Utility Assistance",
      "Tax Help",
      "Benefits Enrollment",
      "Housing Assistance",
      "Prescription Help",
    ],
    resourceCount: 98,
  },
  {
    id: "transportation-mobility",
    label: "Transportation & Mobility",
    description:
      "Medical transport, ride programs, bus routes, accessible transit, and mobility equipment.",
    icon: "Car",
    colorClass: "text-blue-700 bg-blue-50 border-blue-200",
    badgeClass: "bg-blue-100 text-blue-800",
    categories: [
      "Medical Transport",
      "Senior Ride Programs",
      "Public Transit",
      "Accessible Vehicles",
      "Mobility Equipment",
      "Driver Safety",
      "Volunteer Driver Programs",
    ],
    resourceCount: 54,
  },
  {
    id: "legal-advocacy",
    label: "Legal & Advocacy",
    description:
      "Estate planning, elder law attorneys, advance directives, guardianship, and elder abuse prevention.",
    icon: "Scale",
    colorClass: "text-indigo-700 bg-indigo-50 border-indigo-200",
    badgeClass: "bg-indigo-100 text-indigo-800",
    categories: [
      "Elder Law",
      "Estate Planning",
      "Advance Directives",
      "Guardianship",
      "Elder Abuse Prevention",
      "Legal Aid",
      "Ombudsman Services",
      "Consumer Protection",
    ],
    resourceCount: 61,
  },
  {
    id: "social-recreation",
    label: "Social & Recreation",
    description:
      "Senior centers, activity groups, classes, clubs, arts, and community events in Maricopa.",
    icon: "Users",
    colorClass: "text-orange-700 bg-orange-50 border-orange-200",
    badgeClass: "bg-orange-100 text-orange-800",
    categories: [
      "Senior Centers",
      "Activity Groups",
      "Arts & Crafts",
      "Fitness Classes",
      "Learning Opportunities",
      "Volunteer Opportunities",
      "Faith Communities",
      "Social Clubs",
      "Day Trips & Travel",
    ],
    resourceCount: 87,
  },
  {
    id: "home-daily-living",
    label: "Home & Daily Living",
    description:
      "Home modification, housekeeping, meal delivery, personal care, and aging-in-place support.",
    icon: "Home",
    colorClass: "text-amber-700 bg-amber-50 border-amber-200",
    badgeClass: "bg-amber-100 text-amber-800",
    categories: [
      "Home Modification",
      "Meal Delivery",
      "Housekeeping",
      "Personal Care",
      "Adult Day Services",
      "Aging in Place",
      "Smart Home Technology",
      "Lawn & Maintenance",
      "In-Home Care Agencies",
    ],
    resourceCount: 112,
  },
  {
    id: "caregiving-family",
    label: "Caregiving & Family",
    description:
      "Caregiver support, respite care, family counseling, memory care resources, and hospice guidance.",
    icon: "HandHeart",
    colorClass: "text-pink-700 bg-pink-50 border-pink-200",
    badgeClass: "bg-pink-100 text-pink-800",
    categories: [
      "Caregiver Support Groups",
      "Respite Care",
      "Memory Care",
      "Family Counseling",
      "Grief Support",
      "Hospice Navigation",
      "Long-Distance Caregiving",
      "Dementia Resources",
    ],
    resourceCount: 73,
  },
  {
    id: "housing-options",
    label: "Housing & Living Options",
    description:
      "Independent living, assisted living, skilled nursing, continuing care, and housing assistance.",
    icon: "Building",
    colorClass: "text-teal-700 bg-teal-50 border-teal-200",
    badgeClass: "bg-teal-100 text-teal-800",
    categories: [
      "Independent Living",
      "Assisted Living",
      "Memory Care Facilities",
      "Skilled Nursing",
      "Continuing Care Communities",
      "Low-Income Housing",
      "Home Sharing Programs",
      "Relocation Services",
    ],
    resourceCount: 68,
  },
  {
    id: "emergency-safety",
    label: "Emergency & Safety",
    description:
      "Emergency alert systems, disaster preparedness, personal safety, and crisis intervention.",
    icon: "ShieldCheck",
    colorClass: "text-red-700 bg-red-50 border-red-200",
    badgeClass: "bg-red-100 text-red-800",
    categories: [
      "Medical Alert Systems",
      "Emergency Preparedness",
      "Crisis Lines",
      "Fall Detection Technology",
      "Home Security",
      "Scam Prevention",
      "Emergency Contacts Registry",
    ],
    resourceCount: 45,
  },
  {
    id: "veterans-services",
    label: "Veterans Services",
    description:
      "VA benefits, veteran-specific healthcare, service organizations, and benefits counseling.",
    icon: "Medal",
    colorClass: "text-slate-700 bg-slate-50 border-slate-200",
    badgeClass: "bg-slate-100 text-slate-800",
    categories: [
      "VA Healthcare",
      "Veterans Benefits Counseling",
      "Service Organizations",
      "Veterans Housing",
      "Caregiver Support for Veterans",
      "Mental Health for Veterans",
      "Aid & Attendance",
    ],
    resourceCount: 83,
  },
];

// ─── Resource Tags — representative of 302 total ──────────────────────────────

export const ALL_RESOURCE_TAGS = [
  "Free Service",
  "Sliding Scale Fee",
  "Medicare Accepted",
  "Medicaid Accepted",
  "Veterans Only",
  "Income-Based",
  "Spanish Speaking",
  "Wheelchair Accessible",
  "Home Visits",
  "Telehealth Available",
  "Evening Hours",
  "Weekend Hours",
  "24/7 Available",
  "Maricopa City",
  "Pinal County",
  "Phoenix Metro",
  "New — Accepting Patients",
  "No Referral Needed",
  "Appointment Required",
  "Walk-In Welcome",
  "Bilingual Staff",
  "Transportation Assistance",
  "Alzheimer's Friendly",
  "Memory Care Certified",
  "Low Vision Friendly",
  "Hearing Loop Available",
  "Pet Friendly",
  "Faith-Based",
  "Non-Profit",
  "State Licensed",
  "Medicare Certified",
  "Accredited",
];

// ─── Articles ─────────────────────────────────────────────────────────────────

export const ARTICLES: Article[] = [
  {
    id: "1",
    title: "Understanding Your Medicare Coverage Options in Arizona",
    excerpt:
      "A comprehensive guide to navigating Medicare Parts A, B, C, and D, with specific information for Arizona residents and Maricopa County enrollees.",
    content:
      "Medicare can be complex, but understanding your options is critical...",
    category: "Health & Wellness",
    tags: ["Medicare", "Heart Health", "Hydration"],
    author: "Dr. Susan Hartley",
    date: "2025-12-10",
    readTime: 8,
    featured: true,
    image: "/images/wellness.jpg",
  },
  {
    id: "2",
    title: "Fall Prevention at Home: A Room-by-Room Safety Guide",
    excerpt:
      "Practical modifications and habits to reduce fall risk in your home, covering the bathroom, kitchen, bedroom, and outdoor areas.",
    content: "Falls are the leading cause of injury among seniors...",
    category: "Health & Wellness",
    tags: ["Fall Prevention", "Home Safety", "Balance & Mobility"],
    author: "Maria Gonzalez, PT",
    date: "2025-11-22",
    readTime: 6,
    featured: true,
    image: "/images/hero-maricopa.jpg",
  },
  {
    id: "3",
    title: "Estate Planning Essentials: What Every Senior Should Have in Place",
    excerpt:
      "From wills and trusts to powers of attorney and advance directives — the five documents every person over 65 should have prepared.",
    content:
      "Estate planning is one of the most important steps you can take...",
    category: "Legal & Estate",
    tags: ["Estate Planning", "Wills & Trusts", "Power of Attorney"],
    author: "James Whitfield, Esq.",
    date: "2025-11-05",
    readTime: 10,
    featured: false,
    image: "/images/seniors-community.jpg",
  },
  {
    id: "4",
    title: "Managing Type 2 Diabetes After 65: Diet, Exercise, and Medication",
    excerpt:
      "Expert guidance on keeping blood sugar under control in later life, including what changes with age and how Arizona's climate affects management.",
    content: "Diabetes management evolves significantly as we age...",
    category: "Nutrition & Diet",
    tags: ["Diabetes", "Hydration", "Balance & Mobility"],
    author: "Dr. Rachel Kim",
    date: "2025-10-18",
    readTime: 9,
    featured: false,
  },
  {
    id: "5",
    title: "Protecting Yourself from Senior Scams in the Digital Age",
    excerpt:
      "How to identify and avoid the most common scams targeting seniors, including phone fraud, Medicare scams, and online phishing.",
    content: "Seniors lose billions of dollars annually to fraud...",
    category: "Technology",
    tags: ["Medicare", "Advance Directive"],
    author: "Tom Patterson",
    date: "2025-10-02",
    readTime: 7,
    featured: false,
  },
  {
    id: "6",
    title: "Social Security Benefits: Timing Your Claim for Maximum Income",
    excerpt:
      "When to claim Social Security makes a significant difference in lifetime income. This guide helps you calculate the optimal age to start benefits.",
    content:
      "The decision of when to claim Social Security is one of the most consequential...",
    category: "Financial Planning",
    tags: ["Social Security", "Retirement Income"],
    author: "Linda Torres, CFP",
    date: "2025-09-15",
    readTime: 11,
    featured: false,
  },
  {
    id: "7",
    title: "Navigating Grief: Resources and Coping Strategies for Seniors",
    excerpt:
      "Losing a partner, sibling, or close friend is a profound experience. This guide covers healthy grief practices and local Maricopa support resources.",
    content: "Grief is a natural response to loss...",
    category: "Mental Health",
    tags: ["Caregiver Burnout", "Respite Care"],
    author: "Dr. Patricia Moore",
    date: "2025-09-01",
    readTime: 8,
    featured: false,
  },
  {
    id: "8",
    title:
      "The Benefits of Walking for Seniors: Arizona Trails and Indoor Options",
    excerpt:
      "Walking remains one of the best exercises for older adults. Discover Maricopa-area trails, indoor walking programs, and how to start safely.",
    content:
      "Walking is accessible, low-impact, and extraordinarily effective...",
    category: "Exercise & Fitness",
    tags: ["Balance & Mobility", "Bone Health"],
    author: "Coach David Ellis",
    date: "2025-08-20",
    readTime: 6,
    featured: false,
  },
];

// ─── Blog Posts ───────────────────────────────────────────────────────────────

export const BLOGS: Blog[] = [
  {
    id: "1",
    title: "Maricopa Senior Living Awarded $45,000 Community Foundation Grant",
    excerpt:
      "We are thrilled to announce a significant grant award from the Arizona Community Foundation that will expand our Resources Directory and fund our 2026 programs.",
    content:
      "The Maricopa Senior Living Board of Directors is proud to announce...",
    category: "Organization Updates",
    tags: ["Grant Award", "Non-Profit", "Milestone", "501(c)(3)"],
    author: "Carol Simmons",
    authorRole: "Executive Director",
    date: "2026-01-15",
    readTime: 3,
    featured: true,
    image: "/images/about-team.jpg",
  },
  {
    id: "2",
    title: "Volunteer Spotlight: Meet Barbara Nguyen, Our Resource Navigator",
    excerpt:
      "Barbara has spent the past two years helping Maricopa seniors connect with the right services. We sat down with her to learn what drives her passion for this work.",
    content:
      "Every week, Barbara Nguyen arrives at the Maricopa Community Center...",
    category: "Volunteer Spotlights",
    tags: ["Volunteer", "Staff Highlight", "Community Event"],
    author: "Mike Hanson",
    authorRole: "Volunteer Coordinator",
    date: "2025-12-28",
    readTime: 4,
    featured: true,
    image: "/images/seniors-community.jpg",
  },
  {
    id: "3",
    title: "Recap: 2025 Annual Health & Wellness Fair Draws Record Attendance",
    excerpt:
      "Over 400 Maricopa residents attended our fifth annual Health & Wellness Fair. Here's a look at the highlights and what's planned for 2026.",
    content:
      "On November 14th, the Maricopa Recreation Center was filled with...",
    category: "Event Recaps",
    tags: ["Health Fair", "Community Event", "Annual Report"],
    author: "Tanya Reeves",
    authorRole: "Events Manager",
    date: "2025-11-20",
    readTime: 5,
    featured: false,
    image: "/images/newsletter.jpg",
  },
  {
    id: "4",
    title:
      "New Partnership with Maricopa Unified Transportation Launches February 2026",
    excerpt:
      "Starting February 2026, eligible seniors can access free rides to medical appointments through our new transportation partnership.",
    content:
      "Transportation is consistently identified as one of the top barriers...",
    category: "Community Partnerships",
    tags: ["Partnership", "New Program"],
    author: "Carol Simmons",
    authorRole: "Executive Director",
    date: "2025-11-08",
    readTime: 3,
    featured: false,
  },
  {
    id: "5",
    title: "Board of Directors Welcomes Three New Members for 2026",
    excerpt:
      "At our October board meeting, we welcomed Dr. Henry Park, Rosa Delgado, and Frank Okafor to the Maricopa Senior Living Board of Directors.",
    content:
      "Maricopa Senior Living is pleased to announce the addition of three new board members...",
    category: "Board News",
    tags: ["Board of Directors", "Milestone"],
    author: "Patricia Liu",
    authorRole: "Board Chair",
    date: "2025-10-25",
    readTime: 3,
    featured: false,
  },
  {
    id: "6",
    title: "Holiday Giving Program Serves 87 Senior Households This December",
    excerpt:
      "Thanks to overwhelming community generosity, our holiday program had its strongest year yet. Read about the impact and how you can help in 2026.",
    content: "When we launched our Holiday Giving Program in 2021...",
    category: "Fundraising",
    tags: ["Holiday Event", "Donation Drive", "Community Event", "Fundraiser"],
    author: "Mike Hanson",
    authorRole: "Volunteer Coordinator",
    date: "2025-12-22",
    readTime: 4,
    featured: false,
    image: "/images/wellness.jpg",
  },
];

// ─── Resources ────────────────────────────────────────────────────────────────

export const RESOURCES: Resource[] = [
  {
    id: "1",
    name: "Maricopa Community Health Center",
    description:
      "Full-service primary care clinic serving adults 60+ with sliding scale fees and Medicare/Medicaid acceptance.",
    categoryGroupId: "health-medical",
    category: "Primary Care",
    tags: [
      "Medicare Accepted",
      "Medicaid Accepted",
      "Sliding Scale Fee",
      "Maricopa City",
    ],
    phone: "(520) 555-0182",
    website: "https://example.com",
    address: "1205 N. Smith-Enke Rd, Maricopa, AZ 85139",
    hours: "Mon–Fri 8am–5pm",
    free: false,
  },
  {
    id: "2",
    name: "Arizona Area Agency on Aging (5AAA)",
    description:
      "Statewide agency connecting seniors to home and community-based services including meals, transportation, and caregiver support.",
    categoryGroupId: "home-daily-living",
    category: "Aging in Place",
    tags: ["Free Service", "Medicare Accepted", "Pinal County", "Home Visits"],
    phone: "(602) 264-2255",
    website: "https://example.com",
    address: "Serves all of Arizona",
    hours: "Mon–Fri 8am–5pm",
    free: true,
  },
  {
    id: "3",
    name: "Pinal County Veterans Services",
    description:
      "Free benefits counseling and claims assistance for veterans residing in Pinal County, including the Maricopa area.",
    categoryGroupId: "veterans-services",
    category: "Veterans Benefits Counseling",
    tags: [
      "Free Service",
      "Veterans Only",
      "Pinal County",
      "No Referral Needed",
    ],
    phone: "(520) 866-6375",
    website: "https://example.com",
    address: "820 E. Cottonwood Ln, Casa Grande, AZ 85122",
    hours: "Mon–Thu 8am–4pm",
    free: true,
  },
  {
    id: "4",
    name: "Community Legal Services — Seniors Program",
    description:
      "Free civil legal assistance for low-income seniors 60+ in Arizona, including estate planning, benefits, and housing matters.",
    categoryGroupId: "legal-advocacy",
    category: "Legal Aid",
    tags: ["Free Service", "Income-Based", "Appointment Required"],
    phone: "(602) 258-3434",
    website: "https://example.com",
    address: "Phoenix Metro (serves Maricopa)",
    hours: "Mon–Fri 9am–4pm",
    free: true,
  },
  {
    id: "5",
    name: "Valley Metro Dial-a-Ride",
    description:
      "Curb-to-curb transportation for seniors and people with disabilities throughout the Phoenix Metro area.",
    categoryGroupId: "transportation-mobility",
    category: "Senior Ride Programs",
    tags: [
      "Wheelchair Accessible",
      "Medicare Accepted",
      "Appointment Required",
    ],
    phone: "(602) 253-5000",
    website: "https://example.com",
    address: "Phoenix Metro region",
    hours: "6am–10pm daily",
    free: false,
  },
  {
    id: "6",
    name: "Maricopa Senior Activity Center",
    description:
      "Activities, fitness classes, social events, hot meals, and community programs for adults 55+ in Maricopa.",
    categoryGroupId: "social-recreation",
    category: "Senior Centers",
    tags: [
      "Free Service",
      "Maricopa City",
      "Wheelchair Accessible",
      "Spanish Speaking",
    ],
    phone: "(520) 316-6920",
    website: "https://example.com",
    address: "45145 W. Garvey Ave, Maricopa, AZ 85139",
    hours: "Mon–Fri 8am–4pm",
    free: true,
  },
  {
    id: "7",
    name: "Silver & Fit — YMCA Maricopa",
    description:
      "Medicare-funded fitness program offering gym access, group classes, and wellness coaching for seniors.",
    categoryGroupId: "social-recreation",
    category: "Fitness Classes",
    tags: ["Medicare Accepted", "Maricopa City"],
    phone: "(520) 555-0293",
    website: "https://example.com",
    address: "21300 N. John Wayne Pkwy, Maricopa, AZ 85139",
    hours: "Mon–Sat 5:30am–9pm",
    free: false,
  },
  {
    id: "8",
    name: "Meals on Wheels — Maricopa",
    description:
      "Home-delivered nutritious meals for homebound seniors and those unable to prepare their own food.",
    categoryGroupId: "home-daily-living",
    category: "Meal Delivery",
    tags: ["Free Service", "Home Visits", "Maricopa City", "Income-Based"],
    phone: "(520) 555-0147",
    website: "https://example.com",
    address: "Home delivery throughout Maricopa",
    hours: "Mon–Fri delivery",
    free: true,
  },
  {
    id: "9",
    name: "Alzheimer's Association — Desert Southwest Chapter",
    description:
      "Support groups, education programs, care consultations, and a 24/7 helpline for people living with dementia and their caregivers.",
    categoryGroupId: "caregiving-family",
    category: "Dementia Resources",
    tags: [
      "Alzheimer's Friendly",
      "Memory Care Certified",
      "24/7 Available",
      "Free Service",
    ],
    phone: "(800) 272-3900",
    website: "https://example.com",
    address: "Serves Arizona statewide",
    hours: "24/7 Helpline",
    free: true,
  },
  {
    id: "10",
    name: "Arizona HICAP — Medicare Counseling",
    description:
      "Free, unbiased Medicare counseling from trained volunteer counselors to help you compare plans and file appeals.",
    categoryGroupId: "financial-benefits",
    category: "Medicare & Medicaid",
    tags: [
      "Free Service",
      "No Referral Needed",
      "Appointment Required",
      "Bilingual Staff",
    ],
    phone: "(602) 542-6595",
    website: "https://example.com",
    address: "Statewide Arizona",
    hours: "Mon–Fri 8am–5pm",
    free: true,
  },
  {
    id: "11",
    name: "Life Alert — Arizona",
    description:
      "Personal emergency response systems for seniors living alone, with GPS tracking and fall detection technology.",
    categoryGroupId: "emergency-safety",
    category: "Medical Alert Systems",
    tags: ["24/7 Available", "Telehealth Available"],
    phone: "(800) 360-0329",
    website: "https://example.com",
    address: "Serves all of Arizona",
    hours: "24/7",
    free: false,
  },
  {
    id: "12",
    name: "Dignity Health — Chandler Regional Medical Center",
    description:
      "Full-service hospital with dedicated geriatric unit, senior-certified staff, and comprehensive outpatient services.",
    categoryGroupId: "health-medical",
    category: "Specialists",
    tags: [
      "Medicare Accepted",
      "Medicaid Accepted",
      "Wheelchair Accessible",
      "Weekend Hours",
    ],
    phone: "(480) 728-3000",
    website: "https://example.com",
    address: "1955 W. Frye Rd, Chandler, AZ 85224",
    hours: "24/7 Emergency",
    free: false,
  },
  {
    id: "13",
    name: "ALTCS — Arizona Long Term Care System",
    description:
      "State-funded long-term care services for qualified individuals who need nursing home level care in the community.",
    categoryGroupId: "housing-options",
    category: "Assisted Living",
    tags: ["Medicaid Accepted", "Income-Based", "State Licensed"],
    phone: "(602) 417-4000",
    website: "https://example.com",
    address: "Statewide Arizona",
    hours: "Mon–Fri 8am–5pm",
    free: false,
  },
  {
    id: "14",
    name: "Pinal County Area Agency on Aging",
    description:
      "Comprehensive county services including caregiver support, senior nutrition, transportation, and case management.",
    categoryGroupId: "home-daily-living",
    category: "In-Home Care Agencies",
    tags: ["Free Service", "Pinal County", "Income-Based", "Spanish Speaking"],
    phone: "(520) 836-2758",
    website: "https://example.com",
    address: "31 N. Pinal St, Florence, AZ 85132",
    hours: "Mon–Fri 8am–5pm",
    free: true,
  },
  {
    id: "15",
    name: "Arizona Legal Center — Senior Legal Hotline",
    description:
      "Free telephone legal advice for Arizonans 60+ on housing, benefits, estate matters, and consumer issues.",
    categoryGroupId: "legal-advocacy",
    category: "Elder Law",
    tags: ["Free Service", "No Referral Needed", "Walk-In Welcome"],
    phone: "1-800-231-5441",
    website: "https://example.com",
    address: "Telephone — Statewide Arizona",
    hours: "Mon–Fri 9am–4pm",
    free: true,
  },
  {
    id: "16",
    name: "Banner Health — Geriatrics Clinic",
    description:
      "Comprehensive geriatric assessments, medication reviews, fall prevention programs, and care coordination for adults 65+.",
    categoryGroupId: "health-medical",
    category: "Specialists",
    tags: [
      "Medicare Accepted",
      "Medicaid Accepted",
      "Appointment Required",
      "Wheelchair Accessible",
    ],
    phone: "(480) 412-5000",
    website: "https://example.com",
    address: "1441 N. 12th St, Phoenix, AZ 85006",
    hours: "Mon–Fri 7am–6pm",
    free: false,
  },
  {
    id: "17",
    name: "Arizona Department of Economic Security — Benefits",
    description:
      "Access to SNAP (food stamps), utility assistance, Medicaid enrollment, and other state benefit programs for low-income seniors.",
    categoryGroupId: "financial-benefits",
    category: "Benefits Enrollment",
    tags: [
      "Free Service",
      "Income-Based",
      "Spanish Speaking",
      "Walk-In Welcome",
    ],
    phone: "(602) 542-9935",
    website: "https://example.com",
    address: "Multiple Maricopa County locations",
    hours: "Mon–Fri 7am–5pm",
    free: true,
  },
  {
    id: "18",
    name: "SilverSneakers — Arizona Fitness Network",
    description:
      "Free gym memberships and fitness classes for Medicare Advantage members at hundreds of locations across Arizona.",
    categoryGroupId: "social-recreation",
    category: "Fitness Classes",
    tags: ["Free Service", "Medicare Accepted", "Weekend Hours"],
    phone: "1-888-423-4632",
    website: "https://example.com",
    address: "Multiple Arizona locations",
    hours: "Varies by location",
    free: true,
    notes:
      "Eligibility depends on your Medicare Advantage plan. Call your plan or visit the website to confirm your benefit.",
  },
  {
    id: "19",
    name: "Hospice of the Valley — Maricopa",
    description:
      "Compassionate end-of-life care including pain management, emotional support, and family counseling for patients and families.",
    categoryGroupId: "caregiving-family",
    category: "Hospice Navigation",
    tags: [
      "Free Service",
      "Medicare Accepted",
      "Medicaid Accepted",
      "Home Visits",
      "24/7 Available",
    ],
    phone: "(602) 530-6900",
    website: "https://example.com",
    address: "Serves Maricopa County",
    hours: "24/7 nurse on call",
    free: true,
  },
  {
    id: "20",
    name: "Tempe St. Luke's Hospital — Senior ER",
    description:
      "Dedicated senior emergency room designed for older adults with geriatric-trained staff and reduced sensory stimulation.",
    categoryGroupId: "health-medical",
    category: "Specialists",
    tags: [
      "Medicare Accepted",
      "Medicaid Accepted",
      "Wheelchair Accessible",
      "24/7 Available",
    ],
    phone: "(480) 784-5500",
    website: "https://example.com",
    address: "1500 S. Mill Ave, Tempe, AZ 85281",
    hours: "24/7 Emergency",
    free: false,
  },
  {
    id: "21",
    name: "Pinal County SNAP Outreach",
    description:
      "Help applying for the Supplemental Nutrition Assistance Program (food stamps) for low-income individuals and seniors in Pinal County.",
    categoryGroupId: "financial-benefits",
    category: "Food Assistance",
    tags: [
      "Free Service",
      "Income-Based",
      "Pinal County",
      "No Referral Needed",
    ],
    phone: "(520) 866-7450",
    website: "https://example.com",
    address: "Casa Grande and surrounding areas",
    hours: "Mon–Thu 8am–4pm",
    free: true,
  },
  {
    id: "22",
    name: "Arizona Assisted Living Locator",
    description:
      "Free referral service helping seniors and families find licensed assisted living, memory care, and group homes throughout Arizona.",
    categoryGroupId: "housing-options",
    category: "Assisted Living",
    tags: ["Free Service", "No Referral Needed", "Bilingual Staff"],
    phone: "(480) 999-1234",
    website: "https://example.com",
    address: "Telephone service — statewide",
    hours: "Mon–Sat 8am–7pm",
    free: true,
  },
  {
    id: "23",
    name: "Maricopa County Adult Protective Services",
    description:
      "Investigates reports of abuse, neglect, and exploitation of vulnerable adults and connects victims with support services.",
    categoryGroupId: "legal-advocacy",
    category: "Elder Abuse Prevention",
    tags: [
      "Free Service",
      "No Referral Needed",
      "24/7 Available",
      "State Licensed",
    ],
    phone: "(602) 506-4357",
    website: "https://example.com",
    address: "Maricopa County — field-based",
    hours: "24/7 hotline",
    free: true,
  },
  {
    id: "24",
    name: "Arizona Relay Service (ARS)",
    description:
      "Telephone relay services for individuals who are deaf, hard of hearing, or speech-impaired, including TTY and captioned telephone.",
    categoryGroupId: "emergency-safety",
    category: "Emergency Contacts Registry",
    tags: [
      "Free Service",
      "No Referral Needed",
      "24/7 Available",
      "Low Vision Friendly",
    ],
    phone: "711",
    website: "https://example.com",
    address: "Statewide service",
    hours: "24/7",
    free: true,
  },
  {
    id: "25",
    name: "VA Southern Arizona Healthcare System",
    description:
      "Full-service VA medical center offering primary care, mental health, specialty services, and long-term care for eligible veterans.",
    categoryGroupId: "veterans-services",
    category: "VA Healthcare",
    tags: [
      "Veterans Only",
      "Medicare Accepted",
      "Wheelchair Accessible",
      "Mental Health Support",
    ],
    phone: "(520) 792-1450",
    website: "https://example.com",
    address: "3601 S. 6th Ave, Tucson, AZ 85723",
    hours: "Mon–Fri 7am–5pm; Emergency 24/7",
    free: false,
  },
  {
    id: "26",
    name: "Maricopa Community Rides",
    description:
      "Volunteer-driver transportation program providing free rides to medical appointments, grocery stores, and community centers for seniors 60+.",
    categoryGroupId: "transportation-mobility",
    category: "Volunteer Driver Programs",
    tags: [
      "Free Service",
      "Maricopa City",
      "Appointment Required",
      "No Referral Needed",
    ],
    phone: "(520) 555-0312",
    website: "https://example.com",
    address: "Maricopa, AZ — pickup at home",
    hours: "Mon–Fri 8am–4pm",
    free: true,
  },
  {
    id: "27",
    name: "APS Utility Assistance for Seniors",
    description:
      "Arizona Public Service offers bill discount programs and extended payment plans for income-qualified seniors and those on fixed incomes.",
    categoryGroupId: "financial-benefits",
    category: "Utility Assistance",
    tags: ["Income-Based", "No Referral Needed", "Online Available"],
    phone: "(602) 371-7171",
    website: "https://example.com",
    address: "Statewide — apply by phone or online",
    hours: "Mon–Fri 7am–7pm",
    free: false,
  },
  {
    id: "28",
    name: "Caregiver Action Network — Arizona Support Line",
    description:
      "Peer support, education resources, and connection to local caregiver support groups for family caregivers of all ages and conditions.",
    categoryGroupId: "caregiving-family",
    category: "Caregiver Support Groups",
    tags: ["Free Service", "No Referral Needed", "Telehealth Available"],
    phone: "1-855-227-3640",
    website: "https://example.com",
    address: "Telephone — nationwide with local referrals",
    hours: "Mon–Fri 9am–7pm ET",
    free: true,
  },
  {
    id: "29",
    name: "Pinal County Housing Authority — Senior Units",
    description:
      "Subsidized housing units reserved for low-income seniors 62+ in Pinal County with priority placement for disabled applicants.",
    categoryGroupId: "housing-options",
    category: "Low-Income Housing",
    tags: [
      "Income-Based",
      "Pinal County",
      "State Licensed",
      "Wheelchair Accessible",
    ],
    phone: "(520) 836-0203",
    website: "https://example.com",
    address: "820 N. Pinal St, Florence, AZ 85132",
    hours: "Mon–Fri 8am–5pm",
    free: false,
  },
  {
    id: "30",
    name: "National Alliance on Mental Illness — Arizona (NAMI)",
    description:
      "Free education, support groups, and advocacy for adults experiencing mental health challenges, including depression and anxiety in older adults.",
    categoryGroupId: "health-medical",
    category: "Mental Health",
    tags: [
      "Free Service",
      "No Referral Needed",
      "Telehealth Available",
      "Non-Profit",
    ],
    phone: "(602) 244-8166",
    website: "https://example.com",
    address: "Statewide — multiple chapters",
    hours: "Mon–Fri 9am–5pm",
    free: true,
    notes: "NAMI Helpline: 1-800-950-NAMI (6264)",
  },
];

// ─── Newsletters ──────────────────────────────────────────────────────────────

export const NEWSLETTERS: Newsletter[] = [
  {
    id: "1",
    title: "Spring 2026 Community Newsletter",
    season: "Spring",
    year: 2026,
    pdfUrl: "#",
    description:
      "Board updates, new resource listings, volunteer stories, and the complete 2026 spring program calendar.",
    coverImage: "/images/newsletter.jpg",
  },
  {
    id: "2",
    title: "Winter 2025 Community Newsletter",
    season: "Winter",
    year: 2025,
    pdfUrl: "#",
    description:
      "Holiday recap, grant announcement, transportation partnership news, and end-of-year financial report.",
    coverImage: "/images/newsletter.jpg",
  },
  {
    id: "3",
    title: "Fall 2025 Community Newsletter",
    season: "Fall",
    year: 2025,
    pdfUrl: "#",
    description:
      "Health fair recap, Medicare open enrollment guide, fall prevention tips, and caregiver support group expansion.",
  },
  {
    id: "4",
    title: "Summer 2025 Community Newsletter",
    season: "Summer",
    year: 2025,
    pdfUrl: "#",
    description:
      "Summer heat safety, cool-off locations, hydration guides, new resource additions, and volunteer spotlight.",
  },
  {
    id: "5",
    title: "Spring 2025 Community Newsletter",
    season: "Spring",
    year: 2025,
    pdfUrl: "#",
    description:
      "Annual report summary, spring events calendar, new community partnerships, and member stories.",
  },
  {
    id: "6",
    title: "Winter 2024 Community Newsletter",
    season: "Winter",
    year: 2024,
    pdfUrl: "#",
    description:
      "Year in review, financial summary, board changes for 2025, and tribute to our outstanding volunteers.",
  },
  {
    id: "7",
    title: "Fall 2024 Community Newsletter",
    season: "Fall",
    year: 2024,
    pdfUrl: "#",
    description:
      "Fourth annual health fair highlights, Veterans Day event recap, and directory additions.",
  },
  {
    id: "8",
    title: "Summer 2024 Community Newsletter",
    season: "Summer",
    year: 2024,
    pdfUrl: "#",
    description:
      "Extreme heat preparedness, pool programs, senior center summer schedule, and resource updates.",
  },
];

// ─── External Link Groups — replaces 6 header dropdowns ──────────────────────

export const EXTERNAL_LINK_GROUPS: ExternalLinkGroup[] = [
  {
    id: "city-maricopa",
    title: "City of Maricopa",
    description:
      "Official city government services, permits, utilities, and senior programs.",
    icon: "Building2",
    colorClass: "text-blue-700 bg-blue-50 border-blue-200",
    links: [
      {
        label: "City of Maricopa Official Website",
        url: "https://www.maricopa-az.gov",
        description: "Official city government portal",
      },
      {
        label: "City Council & Meetings",
        url: "https://www.maricopa-az.gov/government/city-council",
        description: "Council members, agendas, and schedules",
      },
      {
        label: "Parks & Recreation",
        url: "https://www.maricopa-az.gov/residents/parks",
        description: "Parks, trails, and recreation programs",
      },
      {
        label: "City Utilities",
        url: "https://www.maricopa-az.gov/residents/utilities",
        description: "Water, sewer, and trash services",
      },
      {
        label: "Senior Programs",
        url: "https://www.maricopa-az.gov/residents/seniors",
        description: "City-sponsored programs for adults 55+",
      },
      {
        label: "Emergency Management",
        url: "https://www.maricopa-az.gov/government/emergency-management",
        description: "Emergency preparedness and alerts",
      },
      {
        label: "Public Safety — Police & Fire",
        url: "https://www.maricopa-az.gov/departments/police",
        description: "Maricopa Police Department and Fire District",
      },
    ],
  },
  {
    id: "inmaricopa",
    title: "InMaricopa — Local News",
    description:
      "Community news, local events, business directory, and neighborhood happenings.",
    icon: "Newspaper",
    colorClass: "text-orange-700 bg-orange-50 border-orange-200",
    links: [
      {
        label: "InMaricopa.com — Home",
        url: "https://www.inmaricopa.com",
        description: "Maricopa's local news source",
      },
      {
        label: "Local News Headlines",
        url: "https://www.inmaricopa.com/news",
        description: "Latest news from Maricopa",
      },
      {
        label: "Community Events Calendar",
        url: "https://www.inmaricopa.com/events",
        description: "Upcoming events in Maricopa",
      },
      {
        label: "Business Directory",
        url: "https://www.inmaricopa.com/directory",
        description: "Local businesses serving the community",
      },
      {
        label: "Letters & Opinion",
        url: "https://www.inmaricopa.com/opinion",
        description: "Community voices and letters to the editor",
      },
    ],
  },
  {
    id: "weather",
    title: "Weather Resources",
    description:
      "Current conditions, forecasts, and extreme heat alerts for Maricopa and surrounding desert regions.",
    icon: "CloudSun",
    colorClass: "text-yellow-700 bg-yellow-50 border-yellow-200",
    badge: "Check Daily in Summer",
    links: [
      {
        label: "National Weather Service — Phoenix",
        url: "https://www.weather.gov/psr",
        description: "Official NWS forecasts for the Maricopa region",
      },
      {
        label: "Maricopa 7-Day Forecast",
        url: "https://forecast.weather.gov/MapClick.php?CityName=Maricopa&state=AZ",
        description: "Local 7-day forecast from weather.gov",
      },
      {
        label: "Weather.com — Maricopa, AZ",
        url: "https://weather.com/weather/today/l/Maricopa+AZ",
        description: "Hourly and 10-day forecasts",
      },
      {
        label: "Maricopa County Extreme Heat Alerts",
        url: "https://www.maricopa.gov/5059/Extreme-Heat",
        description: "Official extreme heat safety alerts",
      },
      {
        label: "AZ Monsoon Season Guide",
        url: "https://www.weather.gov/psr/Monsoon",
        description: "Monsoon safety and preparedness",
      },
    ],
  },
  {
    id: "local-links",
    title: "Local Links",
    description:
      "Essential local resources for Pinal County and the greater Maricopa area.",
    icon: "MapPin",
    colorClass: "text-emerald-700 bg-emerald-50 border-emerald-200",
    links: [
      {
        label: "Pinal County Government",
        url: "https://www.pinalcountyaz.gov",
        description: "Pinal County official services and departments",
      },
      {
        label: "Maricopa Public Library",
        url: "https://mcldaz.org",
        description: "Library services and digital resources",
      },
      {
        label: "Banner Casa Grande Medical Center",
        url: "https://www.bannerhealth.com/locations/casa-grande",
        description: "Nearest full-service hospital to Maricopa",
      },
      {
        label: "AZ Department of Economic Security",
        url: "https://des.az.gov",
        description: "Benefits, food assistance, and aging services",
      },
      {
        label: "AZ AHCCCS — Arizona Medicaid",
        url: "https://www.healthearizonaplus.gov",
        description: "Arizona Medicaid information and enrollment",
      },
      {
        label: "Pinal County Senior Services",
        url: "https://www.pinalcountyaz.gov/seniors",
        description: "County-sponsored senior programs",
      },
      {
        label: "Maricopa Unified School District",
        url: "https://www.maricopausd.org",
        description: "MUSD schools and community education",
      },
    ],
  },
  {
    id: "national-links",
    title: "National Resources",
    description:
      "Trusted national government agencies and organizations serving seniors across America.",
    icon: "Globe",
    colorClass: "text-indigo-700 bg-indigo-50 border-indigo-200",
    links: [
      {
        label: "Medicare.gov",
        url: "https://www.medicare.gov",
        description: "Official Medicare information and plan comparison",
      },
      {
        label: "Social Security Administration",
        url: "https://www.ssa.gov",
        description: "Benefits, estimates, and online services",
      },
      {
        label: "USA.gov — Benefits for Seniors",
        url: "https://www.usa.gov/senior-citizens",
        description: "Federal benefits and resources",
      },
      {
        label: "AARP",
        url: "https://www.aarp.org",
        description: "Advocacy and resources for adults 50+",
      },
      {
        label: "Eldercare Locator",
        url: "https://eldercare.acl.gov",
        description: "Find local aging services anywhere in the U.S.",
      },
      {
        label: "BenefitsCheckUp — NCOA",
        url: "https://www.benefitscheckup.org",
        description: "Discover benefits programs you may qualify for",
      },
      {
        label: "National Institute on Aging",
        url: "https://www.nia.nih.gov",
        description: "Science-based health information for seniors",
      },
    ],
  },
  {
    id: "sr347-traffic",
    title: "SR 347 Traffic Status",
    description:
      "Real-time conditions, construction updates, and commute info for State Route 347 — the main corridor connecting Maricopa to Phoenix.",
    icon: "Construction",
    colorClass: "text-red-700 bg-red-50 border-red-200",
    badge: "Live Traffic",
    links: [
      {
        label: "AZ 511 — SR 347 Traffic Map",
        url: "https://az511.gov",
        description: "Real-time conditions on SR 347 and all AZ highways",
      },
      {
        label: "ADOT — SR 347 Project Info",
        url: "https://azdot.gov/sr347",
        description: "Arizona DOT project updates for SR 347",
      },
      {
        label: "Google Maps — SR 347",
        url: "https://maps.google.com/?q=SR+347+Maricopa+AZ",
        description: "Live traffic on Google Maps for SR 347",
      },
      {
        label: "Waze — Maricopa Commute",
        url: "https://www.waze.com",
        description: "Community-based real-time traffic and navigation",
      },
      {
        label: "InMaricopa — Road Closures",
        url: "https://www.inmaricopa.com/category/roads",
        description: "Local coverage of road closures and SR 347 updates",
      },
    ],
  },
];

// Backward-compatible aliases — resolves any stale compiled references
export const articles = ARTICLES;
export const blogs = BLOGS;
export const resources = RESOURCES;
export const newsletters = NEWSLETTERS;
export const ALL_TAGS = ARTICLE_TAGS;
export const RESOURCE_CATEGORIES = RESOURCE_CATEGORY_GROUPS.map((g) => g.label);
