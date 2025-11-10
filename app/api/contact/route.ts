import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyTurnstile } from "@/lib/turnstile";
import { sendContactEmail } from "@/lib/email";

const ContactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(200),
  body: z.string().min(1).max(5000),
  turnstileToken: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = ContactSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const ip = req.headers.get("x-forwarded-for") ?? undefined;
    const ok = await verifyTurnstile(parsed.data.turnstileToken, ip);
    if (!ok) {
      return NextResponse.json({ error: "CAPTCHA verification failed" }, { status: 400 });
    }

    const result = await sendContactEmail({
      name: parsed.data.name,
      email: parsed.data.email,
      body: parsed.data.body,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error ?? "Failed to send" }, { status: 502 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
