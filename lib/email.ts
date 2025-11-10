import { Resend } from "resend";

const TO_ADDRESS = "dustin@litorja.com";

export async function sendContactEmail(input: { name: string; email: string; body: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || "Dustin Litorja <dustin@litorja.com>";
  if (!apiKey) return { ok: false as const, error: "Missing RESEND_API_KEY" };

  try {
    const resend = new Resend(apiKey);
    const subject = `New portfolio message from ${input.name}`;
    const text = `From: ${input.name} <${input.email}>

${input.body}`;

    const { error } = await resend.emails.send({
      from,
      to: [TO_ADDRESS],
      replyTo: input.email,
      subject,
      text,
    });

    if (error) {
      const errMsg = typeof error === "string" ? error : (error as any)?.message || JSON.stringify(error);
      return { ok: false as const, error: errMsg };
    }
    return { ok: true as const };
  } catch (err: any) {
    const errMsg = typeof err === "string" ? err : err?.message || JSON.stringify(err) || "Failed to send";
    return { ok: false as const, error: errMsg };
  }
}
