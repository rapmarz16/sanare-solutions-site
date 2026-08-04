import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { registerHooks } from "node:module";
import test from "node:test";

const socketModuleUrl = `data:text/javascript,${encodeURIComponent("export const connect = (...args) => globalThis.__sanareSmtpConnect(...args);")}`;
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "cloudflare:sockets") return { url: socketModuleUrl, shortCircuit: true };
    return nextResolve(specifier, context);
  },
});

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

function createSmtpSocket(transcript) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let controller;
  const respond = (message) => controller.enqueue(encoder.encode(message));
  const readable = new ReadableStream({
    start(streamController) {
      controller = streamController;
      queueMicrotask(() => respond("220 smtp.purelymail.com ESMTP ready\r\n"));
    },
  });
  const writable = new WritableStream({
    write(chunk) {
      const command = decoder.decode(chunk);
      transcript.push(command);
      if (command.startsWith("EHLO")) respond("250-smtp.purelymail.com\r\n250-AUTH PLAIN LOGIN\r\n250 SIZE 52428800\r\n");
      else if (command.startsWith("AUTH ")) respond("235 2.7.0 Authentication successful\r\n");
      else if (command.startsWith("MAIL FROM:")) respond("250 2.1.0 Sender accepted\r\n");
      else if (command.startsWith("RCPT TO:")) respond("250 2.1.5 Recipient accepted\r\n");
      else if (command.startsWith("DATA")) respond("354 End data with <CR><LF>.<CR><LF>\r\n");
      else if (command.startsWith("QUIT")) respond("221 2.0.0 Closing connection\r\n");
      else if (command.startsWith("RSET")) respond("250 2.0.0 Reset\r\n");
      else if (command.endsWith("\r\n.\r\n")) respond("250 2.0.0 Message accepted\r\n");
    },
  });
  return {
    readable,
    writable,
    opened: Promise.resolve({ remoteAddress: "127.0.0.1", localAddress: null }),
    closed: Promise.resolve(),
    close: async () => {},
  };
}

test("server-renders the complete Sanare Solutions page", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(new Request("https://sanaresolutions.ca/", {
    headers: { accept: "text/html" },
  }), baseEnv, context);

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>Sanare Solutions \| Practical AI and Business Automation<\/title>/i);
  assert.match(html, /Automate repetitive work\. Keep the tools your team knows/i);
  assert.match(html, /Book a 30-minute workflow review/i);
  assert.match(html, /Take the 3-minute AI assessment/i);
  assert.match(html, /Toronto-based/i);
  assert.match(html, /id="services"/i);
  assert.match(html, /id="industries"/i);
  assert.match(html, /id="assessment"/i);
  assert.match(html, /AI Opportunity Finder/i);
  assert.match(html, /href="\/privacy"/i);
  const bookingLinks = html.match(/href="https:\/\/calendar\.app\.google\/d57sRSm27Q3RN9XeA"/g) ?? [];
  assert.equal(bookingLinks.length, 3);
  assert.match(html, /Book a consultation through Google Calendar \(opens in a new tab\)/i);
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
  assert.match(html, /Google Calendar appointment page/i);
  assert.match(html, /questions@sanaresolutions\.ca/i);
});

test("validates and routes contact submissions without exposing secrets", async () => {
  const worker = await loadWorker();
  const originalFetch = globalThis.fetch;
  const outbound = [];
  const smtpTranscript = [];
  globalThis.__sanareSmtpConnect = () => createSmtpSocket(smtpTranscript);
  globalThis.fetch = async (input, init = {}) => {
    const url = String(input);
    outbound.push({ url, init });
    if (url.includes("turnstile")) return Response.json({ success: true });
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
      PURELYMAIL_SMTP_USERNAME: "forms@sanaresolutions.ca",
      PURELYMAIL_SMTP_PASSWORD: "smtp-secret",
      TURNSTILE_SECRET_KEY: "turnstile-secret",
    }, context);

    assert.equal(response.status, 200);
    assert.equal(outbound.length, 1);
    const emailPayload = smtpTranscript.join("");
    assert.match(emailPayload, /To: intake@sanaresolutions\.ca/i);
    assert.match(emailPayload, /Reply-To: person@example\.com/i);
    const encodedSubject = emailPayload.match(/Subject: =\?UTF-8\?B\?([^?]+)\?=/i)?.[1] ?? "";
    assert.match(Buffer.from(encodedSubject, "base64").toString("utf8"), /Website inquiry/i);
    const encodedText = emailPayload.match(/Content-Type: text\/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n([\s\S]*?)\r\n--sanare_/i)?.[1] ?? "";
    assert.match(Buffer.from(encodedText.replace(/\s/g, ""), "base64").toString("utf8"), /Test Person/);
    assert.doesNotMatch(emailPayload, /smtp-secret|turnstile-secret/);
  } finally {
    globalThis.fetch = originalFetch;
    delete globalThis.__sanareSmtpConnect;
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
