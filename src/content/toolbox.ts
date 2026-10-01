export const toolbox = [
  { title: "Building APIs", tools: ["C#", ".NET 9/10", "ASP.NET Core", "EF Core", "Dapper", "SignalR"], stickers: ["csharp", "dotnet"] },
  { title: "Storing and moving data", tools: ["SQL Server", "PostgreSQL", "Redis", "RabbitMQ"], stickers: ["sql", "redis", "rabbitmq"] },
  { title: "Shipping it", tools: ["Azure", "Docker", "CI/CD", "OpenTelemetry"], stickers: ["azure", "docker"] },
  { title: "Making games", tools: ["MonoGame", "C#", "next: a 3D engine"], stickers: [] as string[], game: true },
];

// Client-side work is integration only, so it sits last and small.
export const integration = { title: "Working with front ends", tools: ["TypeScript", "React", "Angular"] };

export const aiTools = [
  { name: "Claude", src: "/assets/icons/ai-claude.webp" },
  { name: "Cursor", src: "/assets/icons/ai-cursor.webp" },
  { name: "Copilot", src: "/assets/icons/ai-copilot.webp" },
];

export const certificates = ["Azure Fundamentals AZ-900 · 2023", "Claude Code in Action · 2026", "Redis University · 2026"];
