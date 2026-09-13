import { NextResponse, type NextRequest } from "next/server";
import nodemailer from "nodemailer";
import { CONTACT } from "@/content/profile";

const LIMITS = { name: 100, email: 200, subject: 150, message: 5000 } as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Escape before interpolating into the HTML body — never trust form input. */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Best-effort throttle. Per-instance only — fine for a portfolio, but it will
// not hold across serverless instances. Swap for Upstash/KV if abuse appears.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 3;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many messages. Try again shortly." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const fields = {
    name: typeof body.name === "string" ? body.name.trim() : "",
    email: typeof body.email === "string" ? body.email.trim() : "",
    subject: typeof body.subject === "string" ? body.subject.trim() : "",
    message: typeof body.message === "string" ? body.message.trim() : "",
  };

  for (const [key, value] of Object.entries(fields)) {
    if (!value) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    if (value.length > LIMITS[key as keyof typeof LIMITS]) {
      return NextResponse.json({ error: `${key} is too long` }, { status: 400 });
    }
  }

  if (!EMAIL_RE.test(fields.email)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) {
    console.error("Contact form: EMAIL_USER / EMAIL_PASS are not configured");
    return NextResponse.json({ error: "Mail is not configured" }, { status: 500 });
  }

  try {
    const transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });

    await transporter.sendMail({
      // `from` must be an address the account owns — Gmail rewrites or rejects
      // anything else. The sender goes in replyTo.
      from: `"Portfolio contact" <${user}>`,
      replyTo: `"${fields.name.replace(/"/g, "")}" <${fields.email}>`,
      to: CONTACT.email,
      subject: `Portfolio: ${fields.subject}`,
      text: `From: ${fields.name} <${fields.email}>\nSubject: ${fields.subject}\n\n${fields.message}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:600px;padding:20px">
          <h2 style="color:#0b0f14">New portfolio message</h2>
          <p><strong>Name:</strong> ${esc(fields.name)}</p>
          <p><strong>Email:</strong> ${esc(fields.email)}</p>
          <p><strong>Subject:</strong> ${esc(fields.subject)}</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0" />
          <p style="white-space:pre-wrap;line-height:1.6">${esc(fields.message)}</p>
        </div>
      `,
    });

    return NextResponse.json({ message: "Sent" }, { status: 200 });
  } catch (error) {
    console.error("Contact form: send failed", error);
    return NextResponse.json({ error: "Failed to send. Try email directly." }, { status: 500 });
  }
}
