"use client";

import { useState } from "react";
import Script from "next/script";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          body: formData.get("message"),
          turnstileToken: (window as any).turnstileToken || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to send");
      setStatus("success");
      setMessage("Thanks! Your message has been sent.");
      form.reset();
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Something went wrong.");
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      {siteKey ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          async
          defer
          onLoad={() => {
            const w = window as any;
            if (w?.turnstile && siteKey) {
              try {
                w.turnstile.render("#turnstile-container", {
                  sitekey: siteKey,
                  callback: (token: string) => {
                    (window as any).turnstileToken = token;
                  },
                });
              } catch {}
            }
          }}
        />
      ) : null}
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">Contact</h1>
      <p className="mb-8 text-zinc-600 dark:text-zinc-400">Send me a note and I’ll get back to you.</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input name="name" required className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-500 dark:border-zinc-700 dark:bg-black" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input type="email" name="email" required className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-500 dark:border-zinc-700 dark:bg-black" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Message</label>
          <textarea name="message" required rows={5} className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-500 dark:border-zinc-700 dark:bg-black" />
        </div>
        <div>
          <div id="turnstile-container" className="h-12 w-full rounded-md border border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-xs text-zinc-500"></div>
        </div>
        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Sending…" : "Send"}
        </button>
        {message && (
          <p className={`text-sm ${status === "error" ? "text-red-500" : "text-green-600"}`}>{message}</p>
        )}
      </form>
    </div>
  );
}

