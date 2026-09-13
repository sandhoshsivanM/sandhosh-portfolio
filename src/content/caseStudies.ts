export interface CaseStudy {
  id: string;
  title: string;
  kicker: string;
  metric: string;
  problem: string;
  approach: string[];
  outcome: string;
  stack: string[];
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "ai-semantic-search",
    title: "On-Prem AI Semantic Search",
    kicker: "ONNX Runtime · SIMD · all-MiniLM-L6-v2",
    metric: "5–50 ms across 20,000+ records",
    problem:
      "The ERP needed fuzzy, meaning-aware search across vendors, assets, documents, and tickets — but sending customer data to an external embedding API was a non-starter for compliance.",
    approach: [
      "Ran all-MiniLM-L6-v2 locally via ONNX Runtime, generating embeddings inside the .NET process.",
      "Implemented cosine similarity with SIMD intrinsics (System.Numerics.Vector) for the tight inner loops.",
      "Cached embedding vectors in Redis L2 behind a FusionCache L1 memory layer.",
      "Indexed on write through a background queue so the hot path pays no embedding cost.",
    ],
    outcome:
      "Sub-50 ms p95 query latency over 20,000+ records with zero external API dependency — compliance-friendly, cost-free, and faster than the hosted alternatives we benchmarked.",
    stack: ["ONNX Runtime", "C# SIMD", "Redis", "FusionCache"],
  },
  {
    id: "approval-workflow",
    title: "Configurable Approval Workflow Engine",
    kicker: "JSON node graphs · SLA escalation · audit trail",
    metric: "days → same-day approvals",
    problem:
      "Approval flows varied by department, amount, and entity — hard-coding every variant was unmaintainable, and Finance needed audit-grade traceability.",
    approach: [
      "Modelled workflows as JSON-configurable node graphs, with nodes for approvers, conditions, forks, and SLA timers.",
      "Built an event-driven state machine on MediatR with idempotent transitions.",
      "Wired SLA escalation via Quartz.NET with role-based notification fan-out.",
      "Logged every transition to an append-only audit store for compliance review.",
    ],
    outcome:
      "A single engine replaced six hard-coded flows. Cycles collapsed from multi-day to same-day, and it passed internal audit review on the first pass.",
    stack: [".NET 9", "MediatR", "Quartz.NET", "SQL Server"],
  },
  {
    id: "hybrid-caching",
    title: "Hybrid L1/L2 Caching with Circuit Breakers",
    kicker: "FusionCache · Redis · proactive refresh",
    metric: "~30% P95 latency reduction",
    problem:
      "Hot read paths hammered SQL Server under peak load, and naive Redis caching created a thundering-herd risk on key expiration.",
    approach: [
      "FusionCache as an L1 in-process tier with typed serializers.",
      "Redis as a shared L2 across instances, with stale-while-revalidate semantics.",
      "Proactive background refresh just before TTL expiry to avoid cold reads.",
      "A Polly circuit breaker on the Redis path so cache outages degrade rather than fail.",
    ],
    outcome:
      "API P95 latency dropped ~30% under peak load and SQL Server load fell visibly in live dashboards. Zero user-visible incidents during two Redis restarts.",
    stack: ["FusionCache", "Redis", "Polly"],
  },
  {
    id: "realtime-notifications",
    title: "Real-Time Multi-Channel Notifications",
    kicker: "SignalR · RabbitMQ · Email · SMS · WhatsApp · Teams",
    metric: "5 channels, sub-second fanout",
    problem:
      "Operations needed live updates across Email, SMS, WhatsApp, Firebase Push, and MS Teams with subscription routing, delivery analytics, and no double-sends.",
    approach: [
      "Published a single domain event; downstream projectors decided which channels to hit.",
      "RabbitMQ with per-channel queues, idempotency tokens, dead-letter handling, and auto-recovery.",
      "A SignalR hub for the live dashboard slice — no polling.",
      "A delivery analytics stream feeding the ops BI view.",
    ],
    outcome:
      "Sub-second fanout across five channels with zero duplicate deliveries observed in production. Ops gained a live view of what was sent, to whom, and whether it landed.",
    stack: ["SignalR", "RabbitMQ", "Firebase", "MS Graph"],
  },
];
