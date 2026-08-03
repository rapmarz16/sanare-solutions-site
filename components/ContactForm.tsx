"use client";

import { FormEvent, useCallback, useMemo, useState } from "react";
import { Turnstile } from "./Turnstile";

type FormStatus = { type: "idle" | "loading" | "success" | "error"; message: string };

function utmParameters() {
  if (typeof window === "undefined") return {};
  const output: Record<string, string> = {};
  new URLSearchParams(window.location.search).forEach((value, key) => {
    if (key.toLowerCase().startsWith("utm_")) output[key] = value.slice(0, 200);
  });
  return output;
}

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>({ type: "idle", message: "" });
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileVersion, setTurnstileVersion] = useState(0);
  const [fallbackBody, setFallbackBody] = useState("");
  const handleToken = useCallback((token: string) => setTurnstileToken(token), []);

  const fallbackHref = useMemo(
    () => `mailto:questions@sanaresolutions.ca?subject=${encodeURIComponent("General inquiry")}&body=${encodeURIComponent(fallbackBody)}`,
    [fallbackBody],
  );

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status.type === "loading") return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      company: String(data.get("company") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
      consent: data.get("consent") === "on",
      website: String(data.get("website") ?? ""),
      turnstileToken,
      sourceUrl: window.location.href,
      utm: utmParameters(),
    };
    setFallbackBody(`Name: ${payload.name}\nWork email: ${payload.email}\nCompany: ${payload.company || "Not provided"}\n\nMessage:\n${payload.message}`);
    setStatus({ type: "loading", message: "Sending your message…" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({})) as { message?: string };
      if (!response.ok) throw new Error(result.message || "Your message could not be sent.");
      form.reset();
      setTurnstileToken("");
      setTurnstileVersion((value) => value + 1);
      setStatus({ type: "success", message: "Thank you. Your message has been sent, and Sanare Solutions will follow up by email." });
      window.dispatchEvent(new CustomEvent("sanare:analytics", { detail: { event: "contact_submission_success" } }));
    } catch (error) {
      setTurnstileToken("");
      setTurnstileVersion((value) => value + 1);
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Your message could not be sent.",
      });
      window.dispatchEvent(new CustomEvent("sanare:analytics", { detail: { event: "contact_submission_error" } }));
    }
  };

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate={false}>
      <div className="form-heading">
        <span>General inquiry</span>
        <h3>Send a message</h3>
      </div>
      <div className="field-grid two-columns">
        <label>
          <span>Name <b aria-hidden="true">*</b></span>
          <input name="name" type="text" autoComplete="name" maxLength={120} required />
        </label>
        <label>
          <span>Work email <b aria-hidden="true">*</b></span>
          <input name="email" type="email" autoComplete="email" maxLength={254} required />
        </label>
      </div>
      <label>
        <span>Company</span>
        <input name="company" type="text" autoComplete="organization" maxLength={160} />
      </label>
      <label>
        <span>Message <b aria-hidden="true">*</b></span>
        <textarea name="message" rows={5} maxLength={3000} required />
      </label>
      <label className="honeypot" aria-hidden="true">
        Website
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="consent-field">
        <input name="consent" type="checkbox" required />
        <span>I agree that Sanare Solutions may use this information to respond to my request. I have not included confidential, personal, or regulated information.</span>
      </label>
      <Turnstile key={turnstileVersion} onToken={handleToken} />
      <button className="button button-primary submit-button" type="submit" disabled={status.type === "loading"}>
        {status.type === "loading" ? "Sending…" : "Send inquiry"}
      </button>
      <div className={`form-status ${status.type}`} role="status" aria-live="polite">
        {status.message}
        {status.type === "error" && (
          <> <a href={fallbackHref}>Open this message in your email app</a>.</>
        )}
      </div>
      <p className="privacy-note">Protected by Cloudflare. See the <a href="/privacy">privacy notice</a>.</p>
    </form>
  );
}
