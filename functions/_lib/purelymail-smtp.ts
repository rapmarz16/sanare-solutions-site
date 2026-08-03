/// <reference types="@cloudflare/workers-types" />

interface PurelymailMessage {
  username: string;
  password: string;
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  html: string;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const timeoutMs = 15_000;

function safeMailbox(value: string) {
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value) || /[\r\n]/.test(value)) {
    throw new Error("Invalid email address.");
  }
  return value;
}

function base64(value: string) {
  const bytes = encoder.encode(value);
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 16_384) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 16_384));
  }
  return btoa(binary);
}

function foldedBase64(value: string) {
  return base64(value).match(/.{1,76}/g)?.join("\r\n") ?? "";
}

function createMessage(message: PurelymailMessage) {
  const from = safeMailbox(message.from);
  const to = safeMailbox(message.to);
  const replyTo = safeMailbox(message.replyTo);
  const subject = message.subject.replace(/[\r\n]+/g, " ").trim();
  const boundary = `sanare_${crypto.randomUUID().replace(/-/g, "")}`;
  return [
    "MIME-Version: 1.0",
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@sanaresolutions.ca>`,
    `From: Sanare Solutions Website <${from}>`,
    `To: ${to}`,
    `Reply-To: ${replyTo}`,
    `Subject: =?UTF-8?B?${base64(subject)}?=`,
    "Auto-Submitted: auto-generated",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    foldedBase64(message.text),
    `--${boundary}`,
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    foldedBase64(message.html),
    `--${boundary}--`,
    "",
  ].join("\r\n").replace(/\r\n\./g, "\r\n..");
}

async function withTimeout<T>(promise: Promise<T>, message: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error(message)), timeoutMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function readResponse(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  state: { buffer: string },
) {
  while (true) {
    const finalLine = state.buffer.match(/(?:^|\r?\n)(\d{3}) ([^\r\n]*)\r?\n/);
    if (finalLine?.index !== undefined) {
      const end = finalLine.index + finalLine[0].length;
      const response = state.buffer.slice(0, end);
      state.buffer = state.buffer.slice(end);
      return response;
    }
    const result = await withTimeout(reader.read(), "Purelymail did not respond in time.");
    if (result.done) throw new Error("Purelymail closed the connection unexpectedly.");
    state.buffer += decoder.decode(result.value, { stream: true });
    if (state.buffer.length > 65_536) throw new Error("Purelymail returned an oversized response.");
  }
}

function expectCode(response: string, expected: number | number[]) {
  const accepted = Array.isArray(expected) ? expected : [expected];
  const code = Number(response.slice(0, 3));
  if (!accepted.includes(code)) throw new Error(`Purelymail rejected an SMTP command (${code || "unknown"}).`);
}

export async function sendPurelymailEmail(message: PurelymailMessage) {
  const username = safeMailbox(message.username);
  const from = safeMailbox(message.from);
  const to = safeMailbox(message.to);
  const source = createMessage(message);
  const { connect } = await import("cloudflare:sockets");
  const socket = connect(
    { hostname: "smtp.purelymail.com", port: 465 },
    { secureTransport: "on", allowHalfOpen: false },
  );
  const reader = socket.readable.getReader();
  const writer = socket.writable.getWriter();
  const state = { buffer: "" };
  const writeLine = (value: string) => withTimeout(writer.write(encoder.encode(`${value}\r\n`)), "Purelymail could not receive the request.");

  try {
    await withTimeout(socket.opened, "Could not connect to Purelymail.");
    expectCode(await readResponse(reader, state), 220);

    await writeLine("EHLO sanaresolutions.ca");
    expectCode(await readResponse(reader, state), 250);

    await writeLine(`AUTH PLAIN ${base64(`\0${username}\0${message.password}`)}`);
    expectCode(await readResponse(reader, state), 235);

    await writeLine(`MAIL FROM:<${from}>`);
    expectCode(await readResponse(reader, state), 250);

    await writeLine(`RCPT TO:<${to}>`);
    expectCode(await readResponse(reader, state), [250, 251]);

    await writeLine("DATA");
    expectCode(await readResponse(reader, state), 354);

    await withTimeout(writer.write(encoder.encode(`${source}\r\n.\r\n`)), "Purelymail could not receive the message.");
    expectCode(await readResponse(reader, state), 250);

    await writeLine("QUIT");
    expectCode(await readResponse(reader, state), 221);
  } finally {
    reader.releaseLock();
    writer.releaseLock();
    await socket.close().catch(() => undefined);
  }
}
