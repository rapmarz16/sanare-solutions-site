"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Turnstile } from "./Turnstile";

type Answers = {
  industry: string;
  otherIndustry: string;
  organizationSize: string;
  platforms: string[];
  systemNames: string;
  painPoints: string[];
  outcomes: string[];
  readiness: string;
  constraints: string[];
  processDescription: string;
  fullName: string;
  workEmail: string;
  companyName: string;
  jobTitle: string;
  phone: string;
  contactMethod: string;
  consultationTiming: string;
  consent: boolean;
  website: string;
};

type Recommendation = {
  primary: string;
  secondary: string[];
  summary: string;
  startingPoints: string[];
};

const STORAGE_KEY = "sanare-opportunity-finder";

const initialAnswers: Answers = {
  industry: "",
  otherIndustry: "",
  organizationSize: "",
  platforms: [],
  systemNames: "",
  painPoints: [],
  outcomes: [],
  readiness: "",
  constraints: [],
  processDescription: "",
  fullName: "",
  workEmail: "",
  companyName: "",
  jobTitle: "",
  phone: "",
  contactMethod: "Email",
  consultationTiming: "",
  consent: false,
  website: "",
};

const industryOptions = ["Construction", "Distribution / wholesale", "IT / technology", "Education", "Professional services", "Other"];
const sizeOptions = ["1–9 employees", "10–49", "50–249", "250–999", "1,000+"];
const platformOptions = ["Microsoft 365", "Google Workspace", "Both", "Industry-specific business systems", "CRM / ERP", "Service desk / ticketing", "Other"];
const painOptions = [
  "Repetitive data entry",
  "Email sorting and response",
  "Document creation or processing",
  "Reporting and summaries",
  "Approvals and follow-up",
  "Finding internal information",
  "Customer or employee inquiries",
  "Training and AI adoption",
  "Unsure / need help identifying opportunities",
];
const outcomeOptions = [
  "Save staff time",
  "Respond faster",
  "Reduce errors or inconsistency",
  "Improve visibility and reporting",
  "Scale without immediately adding headcount",
  "Improve customer or employee experience",
  "Establish responsible AI practices",
];
const readinessOptions = [
  "Exploring possibilities",
  "Already using public AI tools informally",
  "Have a specific workflow to automate",
  "Have attempted a solution but need help",
  "Ready to plan a pilot",
];
const constraintOptions = [
  "Sensitive or regulated information is involved",
  "Formal IT/security approval is required",
  "Training is a major priority",
];

function rankRecommendations(answers: Answers): Recommendation {
  const scores = new Map<string, number>();
  const add = (name: string, score: number) => scores.set(name, (scores.get(name) ?? 0) + score);
  const has = (value: string) => answers.painPoints.includes(value);

  if (has("Email sorting and response")) add("Email automation", 5);
  if (has("Repetitive data entry") || has("Approvals and follow-up")) add("Workflow automation", 4);
  if (has("Document creation or processing")) add("Workflow automation", 3);
  if (has("Reporting and summaries")) add("Workflow automation + AI summarization", 4);
  if (has("Finding internal information")) add("Knowledge assistant + consulting", 4);
  if (has("Training and AI adoption")) add("AI training and enablement", 5);
  if (has("Unsure / need help identifying opportunities")) add("AI consulting and roadmap", 5);
  if (answers.platforms.includes("Microsoft 365") || answers.platforms.includes("Both")) add("Microsoft 365 automation", 3);
  if (answers.platforms.includes("Google Workspace") || answers.platforms.includes("Both")) add("Google Workspace automation", 3);
  if (answers.readiness === "Exploring possibilities") add("AI consulting and roadmap", 3);
  if (answers.readiness === "Ready to plan a pilot") add("Workflow automation", 2);
  if (answers.constraints.includes("Training is a major priority")) add("AI training and enablement", 4);
  if (answers.outcomes.includes("Establish responsible AI practices")) add("AI training and enablement", 2);
  if (scores.size === 0) add("AI consulting and roadmap", 1);

  const ranked = [...scores.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name);
  const primary = ranked[0];
  const platform = answers.platforms.includes("Both")
    ? "your Microsoft 365 and Google Workspace environment"
    : answers.platforms[0]
      ? `your ${answers.platforms[0]} environment`
      : "your current systems";

  const summaries: Record<string, string> = {
    "Email automation": `Based on your focus on email handling and ${platform}, a practical first pilot may classify incoming requests, extract key details, route each item, and prepare a structured response or follow-up record.`,
    "Workflow automation": `Your answers point to repeated handoffs and manual steps. A practical first pilot may connect intake, approvals, notifications, and record updates inside ${platform}.`,
    "Workflow automation + AI summarization": `A focused pilot could gather recurring information, summarize it with human review, and produce a consistent operational update using ${platform}.`,
    "Knowledge assistant + consulting": "A practical starting point may be organizing approved internal knowledge and testing a controlled assistant that helps staff find answers with clear source context.",
    "AI training and enablement": "Your organization may benefit first from role-specific workshops, responsible-use guidance, and a small governed workflow that turns learning into practical adoption.",
    "AI consulting and roadmap": "A short discovery and prioritization engagement can identify high-value opportunities, assess feasibility and risk, and define a focused pilot before you commit to a larger build.",
    "Microsoft 365 automation": "A practical first pilot may connect Outlook, Forms, Teams, SharePoint, Excel, or Power Automate around one repeated operational workflow.",
    "Google Workspace automation": "A practical first pilot may connect Gmail, Forms, Drive, Docs, Sheets, Calendar, or Apps Script around one repeated operational workflow.",
  };

  const startingPoints = answers.painPoints.slice(0, 3).map((pain) => {
    const map: Record<string, string> = {
      "Repetitive data entry": "Capture information once and move it reliably between approved systems.",
      "Email sorting and response": "Classify, prioritize, and route incoming messages with drafted next steps.",
      "Document creation or processing": "Extract key fields and generate consistent documents from structured inputs.",
      "Reporting and summaries": "Assemble recurring updates and summaries from defined sources.",
      "Approvals and follow-up": "Create visible approval paths with reminders and escalation rules.",
      "Finding internal information": "Test a controlled knowledge assistant over approved content.",
      "Customer or employee inquiries": "Structure intake and accelerate consistent, reviewed responses.",
      "Training and AI adoption": "Build role-specific skills and responsible-use practices.",
      "Unsure / need help identifying opportunities": "Map operational friction and rank opportunities by value, feasibility, and risk.",
    };
    return map[pain] ?? pain;
  });

  return {
    primary,
    secondary: ranked.slice(1, 3),
    summary: summaries[primary] ?? summaries["AI consulting and roadmap"],
    startingPoints: startingPoints.length ? startingPoints : ["Map the workflow, people, systems, and constraints before selecting a pilot."],
  };
}

function RadioChoices({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="choice-grid" role="radiogroup">
      {options.map((option) => (
        <label className={`choice-card${value === option ? " is-selected" : ""}`} key={option}>
          <input type="radio" name={name} value={option} checked={value === option} onChange={() => onChange(option)} />
          <span className="choice-indicator" aria-hidden="true" />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
}

function CheckboxChoices({
  name,
  options,
  values,
  onChange,
  maximum,
}: {
  name: string;
  options: string[];
  values: string[];
  onChange: (values: string[]) => void;
  maximum?: number;
}) {
  const toggle = (option: string) => {
    if (values.includes(option)) onChange(values.filter((value) => value !== option));
    else if (!maximum || values.length < maximum) onChange([...values, option]);
  };
  return (
    <div className="choice-grid checkbox-grid">
      {options.map((option) => {
        const checked = values.includes(option);
        const disabled = !checked && Boolean(maximum && values.length >= maximum);
        return (
          <label className={`choice-card${checked ? " is-selected" : ""}${disabled ? " is-disabled" : ""}`} key={option}>
            <input type="checkbox" name={name} value={option} checked={checked} disabled={disabled} onChange={() => toggle(option)} />
            <span className="choice-indicator" aria-hidden="true" />
            <span>{option}</span>
          </label>
        );
      })}
    </div>
  );
}

function getUtm() {
  const output: Record<string, string> = {};
  new URLSearchParams(window.location.search).forEach((value, key) => {
    if (key.toLowerCase().startsWith("utm_")) output[key] = value.slice(0, 200);
  });
  return output;
}

export function OpportunityFinder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileVersion, setTurnstileVersion] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const previousStepRef = useRef(step);
  const handleToken = useCallback((token: string) => setTurnstileToken(token), []);
  const recommendation = useMemo(() => rankRecommendations(answers), [answers]);

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      try {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (!saved) return;
        const parsed = JSON.parse(saved) as { step?: number; answers?: Partial<Answers> };
        if (parsed.answers) setAnswers({ ...initialAnswers, ...parsed.answers });
        if (typeof parsed.step === "number") setStep(Math.max(0, Math.min(8, parsed.step)));
      } catch {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }, 0);
    return () => window.clearTimeout(restoreTimer);
  }, []);

  useEffect(() => {
    if (status !== "success") sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ step, answers }));
  }, [answers, status, step]);

  useEffect(() => {
    if (previousStepRef.current === step) return;
    previousStepRef.current = step;
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const update = <K extends keyof Answers>(key: K, value: Answers[K]) => {
    setAnswers((current) => ({ ...current, [key]: value }));
    setError("");
  };

  const validate = () => {
    if (step === 0 && !answers.industry) return "Choose the industry that best describes your organization.";
    if (step === 1 && !answers.organizationSize) return "Choose an organization size.";
    if (step === 2 && answers.platforms.length === 0) return "Choose at least one platform.";
    if (step === 3 && answers.painPoints.length === 0) return "Choose at least one area of operational friction.";
    if (step === 4 && answers.outcomes.length === 0) return "Choose at least one desired outcome.";
    if (step === 5 && !answers.readiness) return "Choose the stage that best describes your organization.";
    if (step === 7) {
      if (!answers.fullName.trim() || !answers.workEmail.trim() || !answers.companyName.trim()) return "Complete your name, work email, and company name.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers.workEmail)) return "Enter a valid work email address.";
      if (!answers.consent) return "Consent is required so Sanare Solutions can respond to your request.";
    }
    return "";
  };

  const next = () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    if (step === 0) window.dispatchEvent(new CustomEvent("sanare:analytics", { detail: { event: "assessment_started" } }));
    window.dispatchEvent(new CustomEvent("sanare:analytics", { detail: { event: "assessment_step_completed", step: step + 1 } }));
    if (step === 7) window.dispatchEvent(new CustomEvent("sanare:analytics", { detail: { event: "assessment_completed" } }));
    setStep((current) => Math.min(8, current + 1));
  };

  const back = () => {
    setError("");
    setStep((current) => Math.max(0, current - 1));
  };

  const summaryText = useMemo(() => [
    `Sanare Solutions AI Opportunity Finder`,
    `Likely starting point: ${recommendation.primary}`,
    `Industry: ${answers.industry}${answers.otherIndustry ? ` — ${answers.otherIndustry}` : ""}`,
    `Organization size: ${answers.organizationSize}`,
    `Platforms: ${answers.platforms.join(", ")}`,
    `Pain points: ${answers.painPoints.join(", ")}`,
    `Desired outcomes: ${answers.outcomes.join(", ")}`,
    `Readiness: ${answers.readiness}`,
    `Constraints: ${answers.constraints.join(", ") || "None selected"}`,
    `Process context: ${answers.processDescription || "Not provided"}`,
    `Recommendation: ${recommendation.summary}`,
  ].join("\n"), [answers, recommendation]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setStatusMessage("Sending your assessment…");
    try {
      const response = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...answers,
          recommendation,
          turnstileToken,
          sourceUrl: window.location.href,
          utm: getUtm(),
          consentTimestamp: new Date().toISOString(),
        }),
      });
      const result = await response.json().catch(() => ({})) as { message?: string };
      if (!response.ok) throw new Error(result.message || "Your assessment could not be sent.");
      sessionStorage.removeItem(STORAGE_KEY);
      setStatus("success");
      setStatusMessage("Your assessment has been sent. Sanare Solutions will review your context and follow up by email.");
      window.dispatchEvent(new CustomEvent("sanare:analytics", { detail: { event: "assessment_submission_success" } }));
    } catch (submissionError) {
      setTurnstileToken("");
      setTurnstileVersion((value) => value + 1);
      setStatus("error");
      setStatusMessage(submissionError instanceof Error ? submissionError.message : "Your assessment could not be sent.");
      window.dispatchEvent(new CustomEvent("sanare:analytics", { detail: { event: "assessment_submission_error" } }));
    }
  };

  const restart = () => {
    setAnswers(initialAnswers);
    setStep(0);
    setStatus("idle");
    setStatusMessage("");
    setTurnstileToken("");
    setTurnstileVersion((value) => value + 1);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const copySummary = async () => {
    await navigator.clipboard.writeText(summaryText);
    setStatusMessage("The assessment summary has been copied. Email it to intake@sanaresolutions.ca.");
  };

  const progress = step === 8 ? 100 : ((step + 1) / 8) * 100;
  const titles = [
    "Which industry best describes your organization?",
    "About how large is your organization?",
    "Which platforms are central to your work?",
    "Where is your team losing the most time?",
    "What would make an AI initiative valuable to you?",
    "What best describes your current stage?",
    "Describe one process you wish worked better.",
    "Where should we send your starting-point summary?",
    "Your preliminary opportunity summary",
  ];

  return (
    <section className="assessment-section" id="assessment" aria-labelledby="assessment-section-title">
      <div className="container assessment-layout">
        <div className="assessment-intro">
          <p className="eyebrow">AI Opportunity Finder</p>
          <h2 id="assessment-section-title">Find where AI can create value in your business.</h2>
          <p>Answer a few focused questions and receive a practical starting-point summary. Your answers also help make the first consultation more useful.</p>
          <ul>
            <li><span>01</span> Takes approximately 2–4 minutes</li>
            <li><span>02</span> Transparent, rule-based recommendation</li>
            <li><span>03</span> No confidential information required</li>
          </ul>
        </div>
        <div className="assessment-card">
          <div className="assessment-progress" aria-label={`Assessment progress: ${Math.round(progress)}%`}>
            <div><span>{step === 8 ? "Summary" : `Question ${step + 1} of 8`}</span><em>{Math.round(progress)}%</em></div>
            <div className="progress-track"><i style={{ width: `${progress}%` }} /></div>
          </div>

          {status === "success" ? (
            <div className="assessment-success" role="status">
              <span className="success-mark" aria-hidden="true">✓</span>
              <p className="eyebrow dark">Assessment sent</p>
              <h3>Thank you, {answers.fullName.split(" ")[0]}.</h3>
              <p>{statusMessage}</p>
              <button className="button button-dark" type="button" onClick={restart}>Start another assessment</button>
            </div>
          ) : (
            <form className="assessment-form" onSubmit={submit}>
              <div className="step-heading">
                <p>{step === 8 ? "A practical first step" : "Tell us about your organization"}</p>
                <h3 ref={headingRef} tabIndex={-1}>{titles[step]}</h3>
                {step === 3 && <small>Choose up to three.</small>}
                {step === 6 && <small>Keep it high-level. Do not include confidential, personal, or regulated information.</small>}
              </div>

              {step === 0 && (
                <>
                  <RadioChoices name="industry" options={industryOptions} value={answers.industry} onChange={(value) => update("industry", value)} />
                  {answers.industry === "Other" && (
                    <label className="inline-field"><span>Industry (optional)</span><input value={answers.otherIndustry} onChange={(event) => update("otherIndustry", event.target.value)} maxLength={120} /></label>
                  )}
                </>
              )}
              {step === 1 && <RadioChoices name="size" options={sizeOptions} value={answers.organizationSize} onChange={(value) => update("organizationSize", value)} />}
              {step === 2 && (
                <>
                  <CheckboxChoices name="platforms" options={platformOptions} values={answers.platforms} onChange={(values) => update("platforms", values)} />
                  <label className="inline-field"><span>System names (optional)</span><input value={answers.systemNames} onChange={(event) => update("systemNames", event.target.value)} maxLength={300} placeholder="For example: Procore, Salesforce, PowerSchool" /></label>
                </>
              )}
              {step === 3 && <CheckboxChoices name="painPoints" options={painOptions} values={answers.painPoints} onChange={(values) => update("painPoints", values)} maximum={3} />}
              {step === 4 && <CheckboxChoices name="outcomes" options={outcomeOptions} values={answers.outcomes} onChange={(values) => update("outcomes", values)} />}
              {step === 5 && (
                <>
                  <RadioChoices name="readiness" options={readinessOptions} value={answers.readiness} onChange={(value) => update("readiness", value)} />
                  <fieldset className="constraint-fieldset">
                    <legend>Anything important to plan around? <span>(optional)</span></legend>
                    <CheckboxChoices name="constraints" options={constraintOptions} values={answers.constraints} onChange={(values) => update("constraints", values)} />
                  </fieldset>
                </>
              )}
              {step === 6 && (
                <label className="process-field">
                  <span className="sr-only">Process description</span>
                  <textarea
                    value={answers.processDescription}
                    onChange={(event) => update("processDescription", event.target.value)}
                    maxLength={1500}
                    rows={8}
                    placeholder="For example: Customer order emails are manually reviewed and copied into a spreadsheet before someone creates the order."
                  />
                  <em>{answers.processDescription.length} / 1,500</em>
                </label>
              )}
              {step === 7 && (
                <div className="assessment-contact-fields">
                  <div className="field-grid two-columns">
                    <label><span>Full name *</span><input value={answers.fullName} onChange={(event) => update("fullName", event.target.value)} autoComplete="name" maxLength={120} required /></label>
                    <label><span>Work email *</span><input type="email" value={answers.workEmail} onChange={(event) => update("workEmail", event.target.value)} autoComplete="email" maxLength={254} required /></label>
                  </div>
                  <div className="field-grid two-columns">
                    <label><span>Company name *</span><input value={answers.companyName} onChange={(event) => update("companyName", event.target.value)} autoComplete="organization" maxLength={160} required /></label>
                    <label><span>Job title</span><input value={answers.jobTitle} onChange={(event) => update("jobTitle", event.target.value)} autoComplete="organization-title" maxLength={120} /></label>
                  </div>
                  <div className="field-grid two-columns">
                    <label><span>Phone</span><input type="tel" value={answers.phone} onChange={(event) => update("phone", event.target.value)} autoComplete="tel" maxLength={40} /></label>
                    <label><span>Preferred contact method</span><select value={answers.contactMethod} onChange={(event) => update("contactMethod", event.target.value)}><option>Email</option><option>Phone</option></select></label>
                  </div>
                  <label><span>Preferred consultation timing</span><input value={answers.consultationTiming} onChange={(event) => update("consultationTiming", event.target.value)} maxLength={120} placeholder="For example: Next week, mornings preferred" /></label>
                  <label className="honeypot" aria-hidden="true">Website<input value={answers.website} onChange={(event) => update("website", event.target.value)} tabIndex={-1} autoComplete="off" /></label>
                  <label className="consent-field dark-consent">
                    <input type="checkbox" checked={answers.consent} onChange={(event) => update("consent", event.target.checked)} required />
                    <span>I agree that Sanare Solutions may use this information to respond to my request. I have not included confidential, personal, or regulated information.</span>
                  </label>
                </div>
              )}
              {step === 8 && (
                <div className="recommendation-card">
                  <p className="result-label">Likely starting point</p>
                  <h4>{recommendation.primary}</h4>
                  <p>{recommendation.summary}</p>
                  <div className="result-context">
                    <span>{answers.industry}</span><i />
                    <span>{answers.organizationSize}</span><i />
                    <span>{answers.platforms.join(" + ")}</span>
                  </div>
                  <h5>Potential first moves</h5>
                  <ul>{recommendation.startingPoints.map((item) => <li key={item}><span aria-hidden="true">→</span>{item}</li>)}</ul>
                  {recommendation.secondary.length > 0 && <p className="related-services"><strong>Related services:</strong> {recommendation.secondary.join(" · ")}</p>}
                  <p className="preliminary-note">This recommendation is preliminary and requires discovery to confirm value, feasibility, privacy, and fit.</p>
                  <Turnstile key={turnstileVersion} onToken={handleToken} />
                </div>
              )}

              {error && <p className="step-error" role="alert">{error}</p>}
              {statusMessage && status !== "idle" && (
                <div className={`form-status ${status}`} role="status" aria-live="polite">
                  {statusMessage}
                  {status === "error" && (
                    <div className="fallback-actions">
                      <button type="button" className="text-button" onClick={copySummary}>Copy summary</button>
                      <a href={`mailto:intake@sanaresolutions.ca?subject=${encodeURIComponent("AI Opportunity Finder assessment")}&body=${encodeURIComponent(summaryText)}`}>Open in email app</a>
                    </div>
                  )}
                </div>
              )}
              <div className="assessment-controls">
                {step > 0 && <button className="back-button" type="button" onClick={back}>← Back</button>}
                <span />
                {step < 8 ? (
                  <button className="button button-dark" type="button" onClick={next}>{step === 7 ? "See my recommendation" : "Continue"} <span aria-hidden="true">→</span></button>
                ) : (
                  <button className="button button-dark" type="submit" disabled={status === "loading"}>{status === "loading" ? "Sending…" : "Send assessment"} <span aria-hidden="true">→</span></button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
