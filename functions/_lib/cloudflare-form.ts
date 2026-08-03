export interface FormEnv {
  CF_ACCOUNT_ID?: string;
  CF_EMAIL_API_TOKEN?: string;
  TURNSTILE_SECRET_KEY?: string;
  FORM_FROM_EMAIL?: string;
  ASSESSMENT_TO_EMAIL?: string;
  CONTACT_TO_EMAIL?: string;
}

type JsonRecord = Record<string, unknown>;

const jsonHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

function response(status: number, message: string) {
  return new Response(JSON.stringify({ ok: status >= 200 && status < 300, message }), {
    status,
    headers: jsonHeaders,
  });
}

function clean(value: unknown, maximum: number) {
  return String(value ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maximum);
}

function cleanList(value: unknown, maximumItems = 12, maximumLength = 160) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, maximumItems).map((item) => clean(item, maximumLength)).filter(Boolean);
}

function cleanObject(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const output: Record<string, string> = {};
  for (const [key, item] of Object.entries(value as Record<string, unknown>).slice(0, 20)) {
    output[clean(key, 80)] = clean(item, 200);
  }
  return output;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[character] ?? character));
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

async function readPayload(request: Request): Promise<JsonRecord | null> {
  if (request.method !== "POST") return null;
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) return null;
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 100_000) return null;
  try {
    const body = await request.json();
    return body && typeof body === "object" && !Array.isArray(body) ? body as JsonRecord : null;
  } catch {
    return null;
  }
}

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

async function verifyTurnstile(request: Request, payload: JsonRecord, env: FormEnv) {
  if (!env.TURNSTILE_SECRET_KEY) return { ok: false, configuration: true };
  const token = clean(payload.turnstileToken, 2048);
  if (!token) return { ok: false, configuration: false };
  const form = new FormData();
  form.set("secret", env.TURNSTILE_SECRET_KEY);
  form.set("response", token);
  const remoteIp = request.headers.get("CF-Connecting-IP");
  if (remoteIp) form.set("remoteip", remoteIp);
  try {
    const verification = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
    });
    const result = await verification.json() as { success?: boolean };
    return { ok: Boolean(verification.ok && result.success), configuration: false };
  } catch {
    return { ok: false, configuration: false };
  }
}

async function sendEmail(
  env: FormEnv,
  to: string,
  subject: string,
  text: string,
  html: string,
) {
  if (!env.CF_ACCOUNT_ID || !env.CF_EMAIL_API_TOKEN) return { ok: false, configuration: true };
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(env.CF_ACCOUNT_ID)}/email/sending/send`;
  try {
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.CF_EMAIL_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to,
        from: env.FORM_FROM_EMAIL || "forms@sanaresolutions.ca",
        subject,
        text,
        html,
      }),
    });
    return { ok: result.ok, configuration: false };
  } catch {
    return { ok: false, configuration: false };
  }
}

function textLine(label: string, value: string | string[]) {
  return `${label}: ${Array.isArray(value) ? value.join(", ") || "None selected" : value || "Not provided"}`;
}

function htmlLine(label: string, value: string | string[]) {
  const rendered = Array.isArray(value) ? value.join(", ") || "None selected" : value || "Not provided";
  return `<tr><th style="text-align:left;vertical-align:top;padding:8px 12px 8px 0;color:#456158">${escapeHtml(label)}</th><td style="padding:8px 0">${escapeHtml(rendered).replace(/\n/g, "<br>")}</td></tr>`;
}

function recommendationFor(painPoints: string[], platforms: string[], readiness: string, constraints: string[]) {
  const scores = new Map<string, number>();
  const add = (category: string, score: number) => scores.set(category, (scores.get(category) ?? 0) + score);
  if (painPoints.includes("Email sorting and response")) add("Email automation", 5);
  if (painPoints.includes("Repetitive data entry") || painPoints.includes("Approvals and follow-up")) add("Workflow automation", 4);
  if (painPoints.includes("Document creation or processing")) add("Workflow automation", 3);
  if (painPoints.includes("Reporting and summaries")) add("Workflow automation + AI summarization", 4);
  if (painPoints.includes("Finding internal information")) add("Knowledge assistant + consulting", 4);
  if (painPoints.includes("Training and AI adoption")) add("AI training and enablement", 5);
  if (painPoints.includes("Unsure / need help identifying opportunities")) add("AI consulting and roadmap", 5);
  if (platforms.includes("Microsoft 365") || platforms.includes("Both")) add("Microsoft 365 automation", 3);
  if (platforms.includes("Google Workspace") || platforms.includes("Both")) add("Google Workspace automation", 3);
  if (readiness === "Exploring possibilities") add("AI consulting and roadmap", 3);
  if (constraints.includes("Training is a major priority")) add("AI training and enablement", 4);
  if (scores.size === 0) add("AI consulting and roadmap", 1);
  return [...scores.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([category]) => category);
}

export async function handleAssessment(request: Request, env: FormEnv) {
  if (request.method !== "POST") return response(405, "Method not allowed.");
  if (!sameOrigin(request)) return response(403, "This request could not be verified.");
  const payload = await readPayload(request);
  if (!payload) return response(400, "The assessment could not be read. Please review it and try again.");
  if (clean(payload.website, 200)) return response(200, "Thank you. Your assessment has been received.");

  const fullName = clean(payload.fullName, 120);
  const workEmail = clean(payload.workEmail, 254);
  const companyName = clean(payload.companyName, 160);
  const industry = clean(payload.industry, 120);
  const organizationSize = clean(payload.organizationSize, 80);
  const platforms = cleanList(payload.platforms);
  const painPoints = cleanList(payload.painPoints);
  const outcomes = cleanList(payload.outcomes);
  const readiness = clean(payload.readiness, 160);
  const consent = payload.consent === true;
  if (!fullName || !isEmail(workEmail) || !companyName || !industry || !organizationSize || !platforms.length || !painPoints.length || !outcomes.length || !readiness || !consent) {
    return response(400, "Please complete every required field and confirm consent.");
  }

  const turnstile = await verifyTurnstile(request, payload, env);
  if (!turnstile.ok) {
    return response(turnstile.configuration ? 503 : 400, turnstile.configuration
      ? "Secure form delivery is still being configured. Please use the email fallback below."
      : "The security check was not completed. Please try again.");
  }

  const otherIndustry = clean(payload.otherIndustry, 120);
  const systemNames = clean(payload.systemNames, 300);
  const constraints = cleanList(payload.constraints);
  const processDescription = clean(payload.processDescription, 1500);
  const jobTitle = clean(payload.jobTitle, 120);
  const phone = clean(payload.phone, 40);
  const contactMethod = clean(payload.contactMethod, 40);
  const consultationTiming = clean(payload.consultationTiming, 120);
  const sourceUrl = clean(payload.sourceUrl, 1000);
  const utm = cleanObject(payload.utm);
  const categories = recommendationFor(painPoints, platforms, readiness, constraints);
  const timestamp = new Date().toISOString();

  const lines = [
    "New AI Opportunity Finder assessment",
    "",
    textLine("Submitted", timestamp),
    textLine("Name", fullName),
    textLine("Work email", workEmail),
    textLine("Company", companyName),
    textLine("Job title", jobTitle),
    textLine("Phone", phone),
    textLine("Preferred contact", contactMethod),
    textLine("Consultation timing", consultationTiming),
    "",
    textLine("Industry", otherIndustry ? `${industry} — ${otherIndustry}` : industry),
    textLine("Organization size", organizationSize),
    textLine("Platforms", platforms),
    textLine("System names", systemNames),
    textLine("Pain points", painPoints),
    textLine("Desired outcomes", outcomes),
    textLine("Readiness", readiness),
    textLine("Constraints", constraints),
    textLine("Process description", processDescription),
    textLine("Recommended categories", categories),
    "",
    textLine("Source", sourceUrl),
    textLine("UTM", JSON.stringify(utm)),
    textLine("Consent timestamp", clean(payload.consentTimestamp, 80) || timestamp),
  ];
  const rows = [
    htmlLine("Submitted", timestamp), htmlLine("Name", fullName), htmlLine("Work email", workEmail),
    htmlLine("Company", companyName), htmlLine("Job title", jobTitle), htmlLine("Phone", phone),
    htmlLine("Preferred contact", contactMethod), htmlLine("Consultation timing", consultationTiming),
    htmlLine("Industry", otherIndustry ? `${industry} — ${otherIndustry}` : industry),
    htmlLine("Organization size", organizationSize), htmlLine("Platforms", platforms), htmlLine("System names", systemNames),
    htmlLine("Pain points", painPoints), htmlLine("Desired outcomes", outcomes), htmlLine("Readiness", readiness),
    htmlLine("Constraints", constraints), htmlLine("Process description", processDescription),
    htmlLine("Recommended categories", categories), htmlLine("Source", sourceUrl), htmlLine("UTM", JSON.stringify(utm)),
  ].join("");
  const html = `<div style="font-family:Arial,sans-serif;color:#17211e;max-width:760px"><h1 style="color:#0b211b">New AI Opportunity Finder assessment</h1><table style="border-collapse:collapse;width:100%">${rows}</table><p style="font-size:12px;color:#65716c">Consent recorded ${escapeHtml(clean(payload.consentTimestamp, 80) || timestamp)}.</p></div>`;
  const sent = await sendEmail(env, env.ASSESSMENT_TO_EMAIL || "intake@sanaresolutions.ca", `AI Opportunity Finder — ${companyName}`, lines.join("\n"), html);
  if (!sent.ok) return response(sent.configuration ? 503 : 502, sent.configuration
    ? "Email delivery is still being configured. Please use the email fallback below."
    : "The assessment could not be delivered. Please use the email fallback below.");
  return response(200, "Your assessment has been sent.");
}

export async function handleContact(request: Request, env: FormEnv) {
  if (request.method !== "POST") return response(405, "Method not allowed.");
  if (!sameOrigin(request)) return response(403, "This request could not be verified.");
  const payload = await readPayload(request);
  if (!payload) return response(400, "The message could not be read. Please review it and try again.");
  if (clean(payload.website, 200)) return response(200, "Thank you. Your message has been received.");

  const name = clean(payload.name, 120);
  const email = clean(payload.email, 254);
  const company = clean(payload.company, 160);
  const message = clean(payload.message, 3000);
  const consent = payload.consent === true;
  if (!name || !isEmail(email) || !message || !consent) return response(400, "Please complete every required field and confirm consent.");

  const turnstile = await verifyTurnstile(request, payload, env);
  if (!turnstile.ok) {
    return response(turnstile.configuration ? 503 : 400, turnstile.configuration
      ? "Secure form delivery is still being configured. Please use the email fallback below."
      : "The security check was not completed. Please try again.");
  }

  const timestamp = new Date().toISOString();
  const sourceUrl = clean(payload.sourceUrl, 1000);
  const utm = cleanObject(payload.utm);
  const text = [
    "New general website inquiry", "", textLine("Submitted", timestamp), textLine("Name", name),
    textLine("Work email", email), textLine("Company", company), "", textLine("Message", message), "",
    textLine("Source", sourceUrl), textLine("UTM", JSON.stringify(utm)), textLine("Consent", "Confirmed"),
  ].join("\n");
  const rows = [htmlLine("Submitted", timestamp), htmlLine("Name", name), htmlLine("Work email", email), htmlLine("Company", company), htmlLine("Message", message), htmlLine("Source", sourceUrl), htmlLine("UTM", JSON.stringify(utm))].join("");
  const html = `<div style="font-family:Arial,sans-serif;color:#17211e;max-width:760px"><h1 style="color:#0b211b">New general website inquiry</h1><table style="border-collapse:collapse;width:100%">${rows}</table><p style="font-size:12px;color:#65716c">Consent confirmed at ${escapeHtml(timestamp)}.</p></div>`;
  const sent = await sendEmail(env, env.CONTACT_TO_EMAIL || "questions@sanaresolutions.ca", `Website inquiry — ${company || name}`, text, html);
  if (!sent.ok) return response(sent.configuration ? 503 : 502, sent.configuration
    ? "Email delivery is still being configured. Please use the email fallback below."
    : "The message could not be delivered. Please use the email fallback below.");
  return response(200, "Your message has been sent.");
}
