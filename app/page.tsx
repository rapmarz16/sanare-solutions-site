import { ContactForm } from "@/components/ContactForm";
import { CurrentYear } from "@/components/CurrentYear";
import { IndustryTabs } from "@/components/IndustryTabs";
import { OpportunityFinder } from "@/components/OpportunityFinder";
import { SiteHeader } from "@/components/SiteHeader";
import { CONSULTATION_BOOKING_URL } from "@/lib/site";

const services = [
  {
    number: "01",
    title: "Workflow Automation",
    description:
      "Connect repeated steps, approvals, notifications, documents, and data movement into reliable workflows.",
    outcomes: ["Fewer manual handoffs", "Reliable follow-up", "Consistent records"],
  },
  {
    number: "02",
    title: "Microsoft 365 Automation",
    description:
      "Improve work across Power Automate, SharePoint, Teams, Outlook, Forms, Excel, and Copilot.",
    outcomes: ["Connected approvals", "Structured intake", "Faster collaboration"],
  },
  {
    number: "03",
    title: "Google Workspace Automation",
    description:
      "Automate processes involving Gmail, Drive, Docs, Sheets, Forms, Calendar, Apps Script, and approved AI tools.",
    outcomes: ["Less re-entry", "Reusable documents", "Timely alerts"],
  },
  {
    number: "04",
    title: "AI Consulting & Roadmapping",
    description:
      "Identify valuable use cases, assess feasibility and risk, and define an implementation path your team can support.",
    outcomes: ["Prioritized roadmap", "Clear business case", "Responsible scope"],
  },
  {
    number: "05",
    title: "Email Automation",
    description:
      "Classify requests, extract information, draft responses, route messages, and trigger downstream work.",
    outcomes: ["Faster response", "Cleaner triage", "Fewer missed requests"],
  },
  {
    number: "06",
    title: "AI Training & Enablement",
    description:
      "Give teams practical skills, role-specific guidance, and the confidence to use AI responsibly.",
    outcomes: ["Useful workshops", "Safer adoption", "Better quality control"],
  },
];

const friction = [
  ["01", "Copying information", "Email, spreadsheets, and business systems all hold part of the story."],
  ["02", "Drafting and sorting", "Capable people spend hours summarizing, classifying, and rewriting."],
  ["03", "Chasing approvals", "Follow-ups depend on memory instead of a visible, reliable process."],
  ["04", "Finding knowledge", "Answers are scattered across documents, inboxes, and individual experience."],
  ["05", "Building reports", "Recurring updates are assembled manually from inconsistent sources."],
  ["06", "Using AI without guardrails", "Teams are experimenting before governance and training catch up."],
];

const process = [
  ["Discover", "Understand goals, pain points, systems, constraints, and the people involved."],
  ["Prioritize", "Rank opportunities by value, feasibility, risk, and adoption effort."],
  ["Build & validate", "Implement a focused solution, test it with users, and document the workflow."],
  ["Enable & improve", "Train the team, measure what changes, and expand only where justified."],
];

const faqs = [
  [
    "What types of businesses do you work with?",
    "Sanare Solutions is designed for small and mid-sized organizations, particularly teams in construction, distribution, IT, and education. The best fit is a business with repeatable operational work and a desire to improve it practically.",
  ],
  [
    "Do we need to replace our current software?",
    "Usually not. The first step is understanding what already works and where better connections, automation, or AI assistance could remove friction.",
  ],
  [
    "Can you work with Google Workspace and Microsoft 365?",
    "Yes. Solutions can be designed around Google Workspace, Microsoft 365, or a mixed environment, along with approved line-of-business systems.",
  ],
  [
    "What is a good first AI project?",
    "A strong first project is narrow, measurable, low enough in risk to test safely, and painful enough that staff will value the improvement. Email triage, document processing, recurring reporting, and internal knowledge retrieval are common candidates.",
  ],
  [
    "How do you handle privacy and security?",
    "Privacy, data handling, access, human review, and technology constraints are considered during discovery and design. Final controls depend on your systems, obligations, and risk profile.",
  ],
  [
    "Do you provide training after implementation?",
    "Yes. Training, documentation, responsible-use guidance, and practical adoption support can be part of the engagement so the workflow is understood and used well.",
  ],
  [
    "Can we begin with a small pilot?",
    "Yes. A focused pilot is often the most useful way to validate value, usability, and risk before expanding the solution.",
  ],
  [
    "How long does an engagement take?",
    "Focused automations can often be scoped and delivered incrementally. Timing depends on integrations, approvals, data readiness, security requirements, and the number of people involved.",
  ],
];

export default function Home() {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Sanare Solutions",
    url: "https://sanaresolutions.ca",
    email: "questions@sanaresolutions.ca",
    description:
      "Tailored AI consulting, business workflow automation, and team enablement for growing organizations.",
  };

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main-content">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-glow" aria-hidden="true" />
          <div className="container hero-grid">
            <div className="hero-copy reveal">
              <p className="eyebrow">Practical AI automation for growing businesses</p>
              <h1 id="hero-title">Automate repetitive work. Keep the tools your team knows.</h1>
              <p className="hero-lede">
                Sanare Solutions designs tailored AI and workflow automations for Microsoft 365, Google Workspace, email, documents and everyday business operations—helping teams reduce manual steps, respond faster and work more consistently.
              </p>
              <div className="button-row">
                <a
                  className="button button-primary"
                  href={CONSULTATION_BOOKING_URL}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Book a 30-minute workflow review through Google Calendar (opens in a new tab)"
                  data-event="hero_primary_cta_click"
                >
                  Book a 30-minute workflow review
                </a>
                <a className="button button-secondary" href="#assessment" data-event="hero_secondary_cta_click">
                  Take the 3-minute AI assessment <span aria-hidden="true">→</span>
                </a>
              </div>
              <p className="trust-line">
                <span>Toronto-based</span><i aria-hidden="true" />
                <span>Designed around your existing tools</span><i aria-hidden="true" />
                <span>Security and human review from day one</span>
              </p>
            </div>

            <div className="workflow-panel reveal" aria-label="Business inputs flow through tailored automation into practical outcomes">
              <div className="panel-kicker">Workflow intelligence</div>
              <div className="workflow-stage">
                <div className="workflow-column inputs">
                  <span>Email</span>
                  <span>Forms</span>
                  <span>Documents</span>
                  <span>Data</span>
                </div>
                <div className="flow-lines" aria-hidden="true">
                  <i /><i /><i /><i />
                </div>
                <div className="automation-core">
                  <span className="core-orbit" aria-hidden="true" />
                  <small>Sanare</small>
                  <strong>AI + Automation</strong>
                  <em>Tailored layer</em>
                </div>
                <div className="flow-lines outbound" aria-hidden="true">
                  <i /><i /><i />
                </div>
                <div className="workflow-column outcomes">
                  <span>Faster response</span>
                  <span>Fewer manual steps</span>
                  <span>Better visibility</span>
                </div>
              </div>
              <div className="panel-status"><span /> Designed around the tools your team already uses</div>
            </div>
          </div>
        </section>

        <section className="outcome-strip" aria-label="Business outcomes">
          <div className="container outcome-grid">
            {[
              "Reduce repetitive administrative work",
              "Connect processes across your existing tools",
              "Improve consistency and response times",
              "Equip teams to use AI responsibly",
            ].map((outcome, index) => (
              <div className="outcome-item" key={outcome}>
                <span>0{index + 1}</span>
                <p>{outcome}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section section-ivory" id="problems" aria-labelledby="problems-title">
          <div className="container">
            <div className="section-heading split-heading">
              <div>
                <p className="eyebrow dark">Operational friction</p>
                <h2 id="problems-title">Where is work slowing your business down?</h2>
              </div>
              <p>Small inefficiencies compound. The right starting point is usually a familiar workflow where time, clarity, or consistency keeps slipping away.</p>
            </div>
            <div className="friction-grid">
              {friction.map(([number, title, description]) => (
                <article className="friction-card" key={number}>
                  <span>{number}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
            <p className="bridge-statement">These are often ideal starting points for a focused AI or automation project.</p>
          </div>
        </section>

        <section className="section section-white" id="services" aria-labelledby="services-title">
          <div className="container">
            <div className="section-heading split-heading">
              <div>
                <p className="eyebrow dark">What we build</p>
                <h2 id="services-title">Practical capability, shaped to fit.</h2>
              </div>
              <p>Every engagement starts with the work—not a prepackaged chatbot. Solutions are selected and designed around your systems, risk, and people.</p>
            </div>
            <div className="services-grid">
              {services.map((service) => (
                <article className="service-card" key={service.number}>
                  <span className="service-number">{service.number}</span>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <ul>
                    {service.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}
                  </ul>
                </article>
              ))}
            </div>
            <div className="section-action">
              <a className="text-link" href="#assessment">Explore your best starting point <span aria-hidden="true">→</span></a>
            </div>
          </div>
        </section>

        <section className="section section-dark" id="industries" aria-labelledby="industries-title">
          <div className="container">
            <div className="section-heading split-heading light">
              <div>
                <p className="eyebrow">Industry context matters</p>
                <h2 id="industries-title">Recognizable workflows. Relevant possibilities.</h2>
              </div>
              <p>The technology may be shared, but the operating context is not. Explore examples tailored to four priority industries.</p>
            </div>
            <IndustryTabs />
          </div>
        </section>

        <OpportunityFinder />

        <section className="section section-ivory" id="process" aria-labelledby="process-title">
          <div className="container">
            <div className="section-heading centered-heading">
              <p className="eyebrow dark">How it works</p>
              <h2 id="process-title">Start focused. Build confidence. Expand with evidence.</h2>
              <p>An engagement can begin with one well-chosen pilot—not a broad transformation program.</p>
            </div>
            <ol className="process-grid">
              {process.map(([title, description], index) => (
                <li className="process-step" key={title}>
                  <span>0{index + 1}</span>
                  <div className="process-line" aria-hidden="true" />
                  <h3>{title}</h3>
                  <p>{description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section section-white" id="why" aria-labelledby="why-title">
          <div className="container why-grid">
            <div className="why-intro">
              <p className="eyebrow dark">Why Sanare Solutions</p>
              <h2 id="why-title">Enterprise discipline. Personal attention.</h2>
              <p>Bring capable, hands-on delivery to an important operational problem—without the layers and distance of a large consulting engagement.</p>
              <a className="text-link" href="mailto:intake@sanaresolutions.ca?subject=Consultation%20request">
                Start a conversation <span aria-hidden="true">→</span>
              </a>
            </div>
            <div className="differentiator-list">
              {[
                ["Business-first problem solving", "Begin with the operational result and the people doing the work."],
                ["Designed around existing tools", "Improve what you have before recommending disruptive change."],
                ["Security considered from the start", "Build privacy, governance, and human review into the design conversation."],
                ["Direct, responsive partnership", "Work closely with a consultant who understands the context and stays engaged."],
              ].map(([title, body], index) => (
                <article key={title}>
                  <span>0{index + 1}</span>
                  <div><h3>{title}</h3><p>{body}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section adoption-section" aria-labelledby="adoption-title">
          <div className="container adoption-grid">
            <div>
              <p className="eyebrow dark">Responsible adoption</p>
              <h2 id="adoption-title">Technology only creates value when people trust and use it.</h2>
              <p>Implementation is paired with the guidance people need to apply AI confidently, verify quality, and protect sensitive information.</p>
            </div>
            <ul className="adoption-list">
              {[
                "Role-specific staff workshops",
                "Practical acceptable-use guidance",
                "Data-handling and privacy awareness",
                "Prompting and quality verification",
                "Documentation and change support",
                "Human review for consequential outputs",
              ].map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}
            </ul>
          </div>
        </section>

        <section className="section section-ivory" id="faq" aria-labelledby="faq-title">
          <div className="container faq-grid">
            <div className="faq-intro">
              <p className="eyebrow dark">Questions, answered plainly</p>
              <h2 id="faq-title">What to know before you begin.</h2>
              <p>AI projects do not need to start with a leap. A clear, responsible first step is enough.</p>
            </div>
            <div className="faq-list">
              {faqs.map(([question, answer], index) => (
                <details key={question} open={index === 0}>
                  <summary>{question}<span aria-hidden="true">+</span></summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <div className="container contact-grid">
            <div className="contact-copy">
              <p className="eyebrow">Ready when you are</p>
              <h2 id="contact-title">Let&apos;s find the work your team should not have to do manually.</h2>
              <p>Start with the guided assessment for a practical preliminary recommendation, or send a general question.</p>
              <div className="contact-actions">
                <a className="button button-primary" href="#assessment">Start the AI Opportunity Finder</a>
                <a className="email-link" href="mailto:questions@sanaresolutions.ca" data-event="email_link_click">
                  questions@sanaresolutions.ca <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <a className="brand footer-brand" href="#main-content" aria-label="Sanare Solutions home">
              <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
              <span>Sanare <em>Solutions</em></span>
            </a>
            <p>Practical AI and automation, tailored to the way your business works.</p>
          </div>
          <nav aria-label="Footer navigation">
            <a href="#services">Services</a>
            <a href="#industries">Industries</a>
            <a href="#assessment">AI Assessment</a>
            <a href="#process">How It Works</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="footer-contact">
            <span>Have a question?</span>
            <a href="mailto:questions@sanaresolutions.ca">questions@sanaresolutions.ca</a>
          </div>
        </div>
        <div className="container footer-bottom">
          <p>© <CurrentYear /> Sanare Solutions. All rights reserved.</p>
          <a href="/privacy">Privacy</a>
        </div>
      </footer>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
    </>
  );
}
