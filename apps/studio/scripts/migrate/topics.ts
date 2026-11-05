/**
 * The 14 topics, and which old categories/tags fold into each. Approved with
 * James on 2026-11-04. Old names are matched case-insensitively, trimmed.
 */
export type TopicDef = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  categories: string[];
  /** Keyword hints for tags (regex, case-insensitive). */
  tagHints: RegExp;
};

export const TOPICS: TopicDef[] = [
  {
    slug: "health-wellness",
    title: "Health & Wellness",
    description:
      "Staying healthy: doctors, clinics, exercise, medical equipment and health tips.",
    icon: "heart-pulse",
    categories: [
      "Health and Wellness",
      "Health Insights from the Mayo Clinic",
      "Diabetes",
      "Addictions/Dependencies",
      "Organ Donations",
      "Medical Providers",
      "Healthcare Service",
      "Medical Equipment, Loan Closets and Donations",
      "Arizona Department of Health Services (ADHS) - Seniors",
    ],
    tagHints:
      /health|mayo|exercise|heart|diabet|dental|vision|hearing|medical|doctor|flu|vaccin|stroke|cancer/i,
  },
  {
    slug: "dementia-memory",
    title: "Dementia & Memory",
    description:
      "Alzheimer's and dementia: support, memory cafés and caring for a loved one.",
    icon: "brain",
    categories: ["Dementia", "Dementia Friendly Maricopa"],
    tagHints: /alzheimer|dementia|memory/i,
  },
  {
    slug: "caregiving",
    title: "Caregiving",
    description: "Help for caregivers and help at home.",
    icon: "hand-heart",
    categories: [
      "Caregivers",
      "Home Care Services",
      "Placement Services for Seniors",
    ],
    tagHints: /caregiv|home care|respite/i,
  },
  {
    slug: "housing-living",
    title: "Housing & Living Options",
    description:
      "Staying in your home, independent and assisted living, and nursing homes.",
    icon: "house",
    categories: [
      "Senior Living Options",
      "Independent Living",
      "Aging in Place",
    ],
    tagHints:
      /housing|assisted living|nursing home|aging in place|home safety|home checklist|retirement communit/i,
  },
  {
    slug: "money-benefits",
    title: "Money & Benefits",
    description:
      "Medicare, Medicaid, Social Security, taxes, utilities and financial help.",
    icon: "piggy-bank",
    categories: [
      "Finances, financial services and planning",
      "Medicare",
      "Medicaid",
      "Social Security",
      "Long-Term Care Insurance",
      "Internal Revenue Service",
      "Utilities",
      "Assistance for Economically Disadvantaged, Elderly and/or Homebound",
    ],
    tagHints:
      /medicare|medicaid|social security|financ|tax|irs|insurance|utilit|ahcccs|altcs|benefit/i,
  },
  {
    slug: "legal-planning",
    title: "Legal & Planning",
    description: "Wills, advance directives, legal help and planning ahead.",
    icon: "scale",
    categories: [
      "Planning",
      "Advanced Care Planning",
      "Estate Planning",
      "Healthcare Planning",
      "Legal Services",
      "Notary",
    ],
    tagHints:
      /legal|estate|will|advance|directive|power of attorney|notary|planning/i,
  },
  {
    slug: "end-of-life-grief",
    title: "End of Life & Grief",
    description: "Hospice and palliative care, funerals, grief and loss.",
    icon: "flower",
    categories: [
      "End of Life",
      "Hospice / Palliative Care",
      "Grief/Loss",
      "Suicide",
    ],
    tagHints:
      /hospice|palliative|grief|loss|funeral|end-of-life|end of life|death|suicide/i,
  },
  {
    slug: "safety-scams",
    title: "Safety & Scams",
    description:
      "Avoiding scams and fraud, fall prevention and personal safety.",
    icon: "shield-check",
    categories: [
      "Frauds and Scams",
      "Abuse/Personal Safety",
      "Safety",
      "Fall Prevention",
      "Yellow Dot Program",
      "Victims",
      "Women's Centers",
    ],
    tagHints:
      /scam|fraud|fall|abuse|safety|yellow dot|identity theft|elder abuse/i,
  },
  {
    slug: "weather-emergencies",
    title: "Weather & Emergencies",
    description:
      "Extreme heat, monsoons, cooling centers and emergency preparedness.",
    icon: "sun",
    categories: ["Extreme Weather", "Weather", "Emergency Preparedness"],
    tagHints: /heat|weather|monsoon|emergenc|cooling|hydrat|power outage/i,
  },
  {
    slug: "food-basic-needs",
    title: "Food & Basic Needs",
    description:
      "Food banks, meals, nutrition and help with clothing and housing.",
    icon: "utensils",
    categories: [
      "The Basics (Nutrition, Clothing and Housing)",
      "Food",
      "Nutrition Assistance",
      "Meal Programs",
    ],
    tagHints: /food|meal|nutrition|pantry|snap|grocer/i,
  },
  {
    slug: "getting-around",
    title: "Getting Around",
    description: "Rides, public transit, driving and transportation help.",
    icon: "bus",
    categories: ["Transportation"],
    tagHints: /transport|transit|ride|bus|lyft|uber|driv|traffic|sr347/i,
  },
  {
    slug: "community-activities",
    title: "Community & Activities",
    description:
      "The Senior Center, library, clubs, volunteering, arts, learning and trips.",
    icon: "users",
    categories: [
      "City of Maricopa Community / Senior Center",
      "Social, Service and Volunteer Organizations",
      "Arts and Culture in Maricopa",
      "Lifelong Learning",
      "Library",
      "Senior Field Trips",
      "Entertainment",
      "Isolation/Loneliness",
      "Technology",
      "Topics of Local Interest",
      "Maricopa History",
      "Arizona Travel",
      "Ageism",
      "City of Maricopa",
      "Agencies or Resource Offices",
      "InMaricopa Seniors",
      "Pinal-Gila Council for Senior Citizens",
      "Older Americans",
      "Websites",
      "Product & Service Reviews",
    ],
    tagHints:
      /volunteer|librar|art|culture|club|travel|trip|museum|class|learn|technolog|computer|lonel|isolat|social|communit/i,
  },
  {
    slug: "veterans",
    title: "Veterans",
    description:
      "Benefits, health care and groups for veterans and their families.",
    icon: "medal",
    categories: ["Veterans"],
    tagHints: /veteran|\bva\b|vfw|american legion|military/i,
  },
  {
    slug: "pets",
    title: "Pets",
    description: "Pet care, vets, adoption and help keeping pets.",
    icon: "paw-print",
    categories: ["Pets", "Dogs", "Veterinarian"],
    tagHints: /\bpets?\b|dog|cat|veterinar|animal/i,
  },
];

/** Old categories that become something other than a topic. */
export const NON_TOPIC_CATEGORIES = new Set(
  [
    "Joan's Corner",
    "What's New!",
    "Keeping you Informed . . . still newsletter",
    "Pinal County Network Newsletter",
    "Guides",
    "Ron's Ramblings",
    "Maricopa Senior Living a 501 (c)(3) Arizona Nonprofit",
  ].map((name) => name.trim().toLowerCase()),
);

const byCategory = new Map<string, string>();
for (const topic of TOPICS) {
  for (const category of topic.categories) {
    byCategory.set(category.trim().toLowerCase(), topic.slug);
  }
}

export function topicForCategory(name: string | undefined) {
  return name ? byCategory.get(name.trim().toLowerCase()) : undefined;
}

export function topicsForTag(name: string | undefined) {
  if (!name) return [];
  const direct = topicForCategory(name);
  if (direct) return [direct];
  return TOPICS.filter((topic) => topic.tagHints.test(name)).map((t) => t.slug);
}
