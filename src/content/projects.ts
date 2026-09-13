export interface Project {
  id: string;
  title: string;
  kicker: string;
  year: string;
  description: string;
  highlights: string[];
  tags: string[];
  link?: { label: string; url: string };
}

export const PROJECTS: Project[] = [
  {
    id: "erp-platform",
    title: "Enterprise ERP Platform",
    kicker: "Production · UAE conglomerate",
    year: "2023 – Present",
    description:
      "A 28-module .NET 9 ERP running end to end across React/Angular front ends and SQL Server. 975+ REST controllers, 1,170+ domain entities, event-driven architecture, on-prem AI semantic search, and a double-entry General Ledger audited in production.",
    highlights: [
      "500+ concurrent users across HRMS, Finance, Procurement, CAFM, HSE, and Inventory",
      "30% faster API responses after introducing hybrid L1/L2 caching",
      "50% of manual data entry eliminated via Azure AI Document Intelligence",
    ],
    tags: [".NET 9", "ASP.NET Core", "SQL Server", "React", "Angular", "RabbitMQ", "SignalR", "ONNX", "Docker"],
  },
  {
    id: "invoice-pdf-api",
    title: "Invoice PDF Generator API",
    kicker: "Paid .NET template · Gumroad",
    year: "2024",
    description:
      "A commercial ASP.NET Core API template covering multi-currency formatting, GST tax lines, configurable branding, tiered API-key authentication, and Razorpay payment scaffolding.",
    highlights: [
      "Scoped, built, documented, and monetised solo",
      "Tiered API-key auth with per-plan rate limits",
    ],
    tags: [".NET 9", "PDF", "Razorpay", "JWT", "Gumroad"],
    link: { label: "github.com/sandhoshsivan", url: "https://github.com/sandhoshsivan" },
  },
  {
    id: "sun-of-elegance",
    title: "Sun of Elegance",
    kicker: "2D MonoGame platformer · MIT · 3-OS CI",
    year: "2026 · v4.0",
    description:
      "A dual-hero 2D platformer in C# / .NET 9 with MonoGame — shipped from empty solution to v4.0. Physics, audio, level data, and every visual are hand-authored in code; zero external art or audio assets.",
    highlights: [
      "Swept-AABB tile collision written from scratch — axis-separated resolution, integer stepping, one-way platforms",
      "Coyote time, jump buffering, variable-height jump, air dash with i-frames, hit-pause, screen shake",
      "42 xUnit + FluentAssertions tests, zero windows opened in CI, green on Ubuntu / Windows / macOS",
      "Procedural everything — custom 3×5 bitmap font, sprites from primitives, synthesised SFX and ambient music",
    ],
    tags: ["MonoGame 3.8.4", "C# / .NET 9", "Swept AABB", "State machine", "xUnit", "3-OS CI"],
    link: {
      label: "github.com/Sandhoshsivan/sun-of-elegance",
      url: "https://github.com/Sandhoshsivan/sun-of-elegance",
    },
  },
];
