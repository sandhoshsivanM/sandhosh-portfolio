export const projects = [
  {
    name: "Khazana",
    pitch: "A money app that keeps your data yours.",
    why: "Built because personal finance is my hobby, and I wanted a tool I could trust.",
    points: ["Works fully offline; nothing leaves your device", "Bank-grade encryption, unlocks in 49 ms", "Shows your real investment returns", "1,504 automated tests before every release"],
    hood: ["TypeScript", "AES-256", "PBKDF2 600k", "SQLite FTS5", "FIFO lots", "XIRR"],
    links: [
      { label: "Open the app", href: "https://khazana-app.netlify.app" },
      { label: "Code", href: "https://github.com/sandhoshsivanM/FinTech" },
    ],
    file: "khazana.app",
  },
  {
    name: "HireFlow Pro",
    pitch: "Know your resume score before you apply.",
    why: "",
    points: ["AI scores your resume against a job, 0–100", "Shows the keywords you're missing", "Tracks every application on one board", "Built to keep AI costs low"],
    hood: [".NET 10", "PostgreSQL", "Claude + Gemini", "Stripe", "Docker", "React 19"],
    links: [{ label: "Code", href: "https://github.com/sandhoshsivanM/hireflow-pro-v2" }],
    file: "hireflow.api",
  },
];
