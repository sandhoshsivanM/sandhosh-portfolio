/**
 * Skills grouped by architectural layer rather than by an invented
 * proficiency percentage. The previous version rendered 75–95% bars that
 * corresponded to nothing measurable — do not bring those back.
 */

export interface SkillLayer {
  id: string;
  /** Layer name, as it would appear in a clean-architecture diagram. */
  title: string;
  blurb: string;
  groups: {
    name: string;
    items: string[];
  }[];
}

export const SKILL_LAYERS: SkillLayer[] = [
  {
    id: "presentation",
    title: "Presentation",
    blurb: "What the user actually touches.",
    groups: [
      { name: "Frontend", items: ["React", "Angular", "TypeScript", "JavaScript (ES6+)", "HTML5", "CSS3"] },
      { name: "Real-time", items: ["SignalR", "WebSockets"] },
    ],
  },
  {
    id: "application",
    title: "Application",
    blurb: "Request handling, orchestration, and the rules in between.",
    groups: [
      {
        name: "Backend frameworks",
        items: [".NET 9", ".NET Framework", "ASP.NET Core", "ASP.NET MVC", "MediatR", "GraphQL"],
      },
      {
        name: "Architecture",
        items: ["Clean Architecture", "CQRS", "DDD", "Event-Driven", "Modular Monolith", "SOLID"],
      },
    ],
  },
  {
    id: "domain",
    title: "Domain",
    blurb: "The part that encodes how the business actually works.",
    groups: [
      {
        name: "Modelling",
        items: ["1,170+ domain entities", "Double-entry accounting", "Approval workflow graphs", "State machines"],
      },
      { name: "Languages", items: ["C#", "T-SQL"] },
    ],
  },
  {
    id: "infrastructure",
    title: "Infrastructure",
    blurb: "Storage, messaging, delivery, and the things that page you at 3am.",
    groups: [
      { name: "Data", items: ["SQL Server", "Entity Framework Core", "Dapper", "Stored procedures", "Query optimisation"] },
      { name: "Caching", items: ["Redis", "FusionCache", "L1/L2 hybrid", "Circuit breakers (Polly)"] },
      { name: "Messaging", items: ["RabbitMQ", "MQTT", "Quartz.NET (25+ jobs)", "DLQ · idempotency · auto-recovery"] },
      { name: "Cloud & DevOps", items: ["Azure", "Docker", "Envoy API Gateway", "Bitbucket CI/CD", "IIS"] },
      { name: "AI & search", items: ["ONNX Runtime", "Azure AI Document Intelligence", "Semantic search", "SIMD cosine similarity"] },
      { name: "Security", items: ["JWT", "MFA / TOTP", "OAuth 2.0", "Ory Kratos", "RBAC (fail-closed)", "Data masking"] },
      { name: "Observability & testing", items: ["OpenTelemetry", "Serilog", "Swagger / OpenAPI", "xUnit", "Testcontainers"] },
    ],
  },
];
