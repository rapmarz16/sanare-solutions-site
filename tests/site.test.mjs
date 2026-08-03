import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);

async function loadWorker() {
  const url = new URL(workerUrl);
  url.searchParams.set("test", `${process.pid}-${Date.now()}-${Math.random()}`);
  const { default: worker } = await import(url.href);
  return worker;
}

const context = {
  waitUntil() {},
  passThroughOnException() {},
};

const baseEnv = {
  ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
};

test("server-renders the complete Sanare Solutions page", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(new Request("https://sanaresolutions.ca/", {
    headers: { accept: "text/html" },
  }), baseEnv, context);

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>Sanare Solutions \| Practical AI and Business Automation<\/title>/i);
  assert.match(html, /Transform the way your business works with AI built around you/i);
  assert.match(html, /id="services"/i);
  assert.match(html, /id="industries"/i);
  assert.match(html, /id="assessment"/i);
  assert.match(html, /AI Opportunity Finder/i);
  assert.match(html, /href="\/privacy"/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("renders the privacy notice", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(new Request("https://sanaresolutions.ca/privacy", {
    headers: { accept: "text/html" },
  }), baseEnv, context);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /retained for up to 12 months/i);
  assert.match(html, /Cloudflare Web Analytics/i);
  assert.match(html, /questions@sanaresolutions\.ca/i);
});

test("validates and routes contact submissions without exposing secrets", async () => {
  const worker = await loadWorker();
  const originalFetch = globalThis.fetch;
  const outbound = [];
  globalThis.fetch = async (input, init = {}) => {
    const url = String(input);
    outbound.push({ url, init });
    if (url.includes("turnstile")) return Response.json({ success: true });
    if (url.includes("email/sending/send")) return Response.json({ success: true });
    return new Response("Unexpected request", { status: 500 });
  };

  try {
    const response = await worker.fetch(new Request("https://sanaresolutions.ca/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "https://sanaresolutions.ca" },
      body: JSON.stringify({
        name: "Test Person",
        email: "person@example.com",
        company: "Example Co",
        message: "We want to improve a recurring workflow.",
        consent: true,
        website: "",
        turnstileToken: "test-token",
        sourceUrl: "https://sanaresolutions.ca/",
        utm: { utm_source: "test" },
      }),
    }), {
      ...baseEnv,
      CF_ACCOUNT_ID: "account-id",
      CF_EMAIL_API_TOKEN: "secret-token",
      TURNSTILE_SECRET_KEY: "turnstile-secret",
      CONTACT_TO_EMAIL: "questions@sanaresolutions.ca",
    }, context);

    assert.equal(response.status, 200);
    assert.equal(outbound.length, 2);
    const emailPayload = JSON.parse(String(outbound[1].init.body));
    assert.equal(emailPayload.to, "questions@sanaresolutions.ca");
    assert.match(emailPayload.subject, /Website inquiry/i);
    assert.match(emailPayload.text, /Test Person/);
    assert.doesNotMatch(JSON.stringify(emailPayload), /secret-token|turnstile-secret/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("ships Cloudflare Pages and accessibility support files", async () => {
  await Promise.all([
    access(new URL("../public/_headers", import.meta.url)),
    access(new URL("../public/_redirects", import.meta.url)),
    access(new URL("../public/favicon.svg", import.meta.url)),
    access(new URL("../public/og.png", import.meta.url)),
    access(new URL("../functions/api/assessment.ts", import.meta.url)),
    access(new URL("../functions/api/contact.ts", import.meta.url)),
  ]);
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  const headers = await readFile(new URL("../public/_headers", import.meta.url), "utf8");
  assert.match(css, /prefers-reduced-motion:\s*reduce/i);
  assert.match(css, /max-width:\s*360px/i);
  assert.match(css, /:focus-visible/i);
  assert.match(headers, /Content-Security-Policy/i);
  assert.match(headers, /Strict-Transport-Security/i);
});
