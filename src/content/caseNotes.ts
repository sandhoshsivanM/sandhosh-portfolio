// `wide`: the doodle is about twice as wide as tall, so the heading leaves it more room.
export const caseNotes: { result: string; story: string; hood: string; tint: string; doodle: string; wide?: boolean }[] = [
  { result: "Zero double-counted money", story: "When modules talk, a retry could book the same payment twice. I made every message safe to repeat, and the ledger passed internal audit.", hood: "RabbitMQ, idempotent consumers, dead-letter queues", tint: "var(--color-note-yellow)", doodle: "/assets/stickers/rabbitmq.webp" },
  { result: "104 GB → under 100 ms", story: "The server kept choking. I traced it to a giant log table no one had indexed, fixed it, and the spikes stopped.", hood: "SQL Server execution plans, targeted indexes", tint: "var(--color-note-peach)", doodle: "/assets/doodles/database.webp" },
  { result: "Every screen ~30% faster", story: "The same data was fetched again and again. Now the system remembers it, for all 500+ users.", hood: "FusionCache (memory) + Redis, P95 latency", tint: "var(--color-note-mint)", doodle: "/assets/stickers/redis.webp" },
  { result: "Nobody retypes paper", story: "Staff copied scanned documents by hand. Now the system reads them.", hood: "Azure Document Intelligence OCR", tint: "var(--color-note-sky)", doodle: "/assets/doodles/api-server.webp", wide: true },
];
