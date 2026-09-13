export interface Role {
  title: string;
  company: string;
  client: string;
  location: string;
  start: string;
  end: string;
  stack: string[];
  /** Grouped into pipeline stages so the Experience panel can render gates. */
  stages: {
    name: string;
    bullets: string[];
  }[];
}

export const EXPERIENCE: Role[] = [
  {
    title: "Full Stack / .NET Developer",
    company: "Technoduces (Product Studio)",
    client: "Adeeb Group · FM Basepack ERP Platform",
    location: "Abu Dhabi, UAE · On-site",
    start: "Mar 2023",
    end: "Present",
    stack: [
      ".NET 9",
      "ASP.NET Core",
      "C#",
      "SQL Server",
      "React",
      "Angular",
      "TypeScript",
      "Azure",
      "RabbitMQ",
      "Redis",
      "Docker",
      "SignalR",
      "ONNX",
      "Quartz.NET",
    ],
    stages: [
      {
        name: "Architect",
        bullets: [
          "Architected a .NET 9 ERP platform across 28+ projects with 975+ REST API controllers and 1,170+ domain entities, covering HRMS, Procurement, Finance, CAFM, Admin, and HSE for 500+ concurrent users.",
          "Designed an enterprise approval workflow engine with JSON-configurable node graphs, multi-level approvals, SLA escalation timers, and a complete immutable audit trail — collapsing approval cycles from days to same-day.",
          "Implemented a double-entry General Ledger with 16 transaction handlers covering journals, GRN accounting, asset depreciation, and bank reconciliation — passed internal audit review on the first pass.",
        ],
      },
      {
        name: "Build",
        bullets: [
          "Developed and consumed REST and SOAP Web APIs in ASP.NET Core, integrated end-to-end with React and Angular front ends and third-party services.",
          "Designed and optimised complex SQL Server queries, stored procedures, views, and schemas supporting high-volume transactional workloads.",
          "Engineered on-premises AI semantic search using ONNX Runtime (all-MiniLM-L6-v2) with SIMD cosine similarity — 5–50 ms latency across 20,000+ records with zero external API dependency.",
          "Integrated Azure AI Document Intelligence across 9+ document types, eliminating 50% of manual data entry through automated field extraction.",
          "Built a notification engine spanning Email, SMS, WhatsApp, Firebase Push, and MS Teams with subscription-based routing and delivery analytics.",
        ],
      },
      {
        name: "Scale",
        bullets: [
          "Implemented L1/L2 hybrid caching with FusionCache + Redis, circuit breakers, and proactive background refresh — reducing API response times by 30% under peak load.",
          "Built a RabbitMQ event bus with idempotency tracking, dead letter queues, and auto-recovery; integrated MQTT for ZKTeco IoT biometric devices.",
          "Developed 25+ Quartz.NET scheduled jobs for payroll processing, leave accrual, document expiry alerts, and PPM escalations — saving 20+ hours per month of manual operations.",
          "Engineered real-time dashboards over SignalR WebSockets, removing polling entirely.",
        ],
      },
      {
        name: "Ship",
        bullets: [
          "Implemented JWT authentication, MFA/TOTP, Ory Kratos identity, fail-closed RBAC (Module:Action), data masking, and comprehensive audit logging across all modules.",
          "Configured Envoy API Gateway, Docker multi-stage builds, and Bitbucket CI/CD pipelines with zero-downtime IIS deployments.",
          "Wrote integration and unit tests with xUnit and Testcontainers across payroll, GL, and workflow modules.",
          "Worked Agile/Scrum — sprint planning, standups, retrospectives — coordinating with frontend, QA, and DevOps across full module lifecycles.",
        ],
      },
    ],
  },
];

export interface Credential {
  title: string;
  org: string;
  detail: string;
}

export const EDUCATION: Credential[] = [
  {
    title: "B.E. Computer Science & Engineering",
    org: "Rathinam Technical Campus · Anna University",
    detail: "2019 – 2023 · 84.6% aggregate",
  },
  {
    title: "Microsoft Azure Fundamentals (AZ-900)",
    org: "Microsoft Certified",
    detail: "Directly applicable to the Azure integrations running in production.",
  },
  {
    title: "Salesforce Platform Developer I",
    org: "In progress",
    detail: "Expected Q3 2026.",
  },
];

/** Modules owned end-to-end within the ERP platform. */
export const ERP_MODULES = [
  { title: "HRMS & Attendance", detail: "Biometric integration (ZKTeco/MQTT), leave, payroll, KPI tracking." },
  { title: "Finance & GL", detail: "Double-entry GL, P&L, trial balance, 16 transaction handlers." },
  { title: "Procurement", detail: "End-to-end RFQ → PO → GRN → Invoice with vendor portal." },
  { title: "CAFM / Assets", detail: "PPM scheduling, QR asset tracking, depreciation, IoT sensors." },
  { title: "Helpdesk", detail: "SLA escalation engine, real-time SignalR ticketing, priority routing." },
  { title: "HSE & Compliance", detail: "Incident reporting, permit-to-work, safety induction tracking." },
] as const;
