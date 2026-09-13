/**
 * Single source of truth for identity and contact details.
 *
 * Three earlier sources disagreed on these values; the set below is the
 * agreed one. Do not reintroduce `sandhoshsivan007@gmail.com`, the
 * `600+ endpoints` figure, or `2,000+ users` — those came from older drafts.
 * (`2,000` was the client's employee headcount, not concurrent users.)
 */

export const PROFILE = {
  name: "Sandhoshsivan M",
  initials: "SM",
  title: "Full Stack Software Engineer",
  tagline: "build · develop · deploy · improve",
  subtitle: "scalable solutions | clean code | real impact",
  location: "Abu Dhabi, UAE → Bangalore · Chennai · Remote",
  availability: "Available immediately",
  summary:
    "Full stack engineer with 3+ years architecting and shipping large-scale enterprise ERP systems. .NET 9 across the back end, React and TypeScript at the edge, SQL Server underneath — event-driven architecture, hybrid caching, and on-prem AI search in production for 500+ concurrent users.",
  bio: [
    "I build the whole path — from the SQL query plan to the button someone clicks. For the last three years that has meant a production .NET 9 ERP platform for a UAE conglomerate: 28+ projects, 975+ REST API controllers, and 1,170+ domain entities spanning HRMS, Finance, Procurement, CAFM, HSE, and Inventory.",
    "The work I care about is the unglamorous kind that shows up in a latency graph. A hybrid L1/L2 cache that cut API response times by 30%. An on-premises semantic search engine running ONNX locally because sending data to a hosted embedding API was not an option. A double-entry general ledger that passed audit on the first pass.",
    "I am now returning to India, bringing international enterprise exposure and real ERP domain depth to high-impact full stack roles.",
  ],
} as const;

export const CONTACT = {
  email: "sandhoshsivan00@gmail.com",
  phone: "+91 86208 28200",
  github: "https://github.com/sandhoshsivan",
  githubLabel: "github.com/sandhoshsivan",
  linkedin: "https://linkedin.com/in/sandhoshsivan-m",
  linkedinLabel: "linkedin.com/in/sandhoshsivan-m",
  resume: "/resume.pdf",
} as const;

export interface Metric {
  value: string;
  label: string;
}

/** Headline numbers. These are also stamped onto the architecture nodes. */
export const METRICS: Metric[] = [
  { value: "975+", label: "REST API controllers" },
  { value: "1,170+", label: "Domain entities" },
  { value: "500+", label: "Concurrent users" },
  { value: "30%", label: "Faster API response" },
  { value: "50%", label: "Manual entry eliminated" },
  { value: "28+", label: "Projects in the platform" },
];

/** The stack badges from the banner, in the order shown there. */
export const STACK = [
  "C#",
  ".NET 9",
  "React",
  "TypeScript",
  "SQL Server",
  "Azure",
  "RabbitMQ",
  "Redis",
] as const;
