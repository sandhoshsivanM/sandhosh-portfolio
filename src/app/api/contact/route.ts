import nodemailer from "nodemailer";
import { profile } from "@/content/profile";

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }
  // honeypot: bots fill the hidden field
  if (clean(body.company, 200)) return Response.json({ ok: true });

  const name = clean(body.name, 200);
  const email = clean(body.email, 200);
  const message = clean(body.message, 4000);
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  const { EMAIL_USER, EMAIL_PASS } = process.env;
  if (!EMAIL_USER || !EMAIL_PASS) {
    return Response.json({ error: "Mail is not configured" }, { status: 503 });
  }

  try {
    const transport = nodemailer.createTransport({ service: "gmail", auth: { user: EMAIL_USER, pass: EMAIL_PASS } });
    await transport.sendMail({
      from: `Portfolio <${EMAIL_USER}>`,
      to: profile.email,
      replyTo: `${name} <${email}>`,
      subject: `Portfolio note from ${name}`,
      text: `${message}\n\n— ${name} <${email}>`,
    });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Send failed" }, { status: 502 });
  }
}
