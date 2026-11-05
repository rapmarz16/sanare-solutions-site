import { ContactForm } from "@/components/ContactForm";
import { CurrentYear } from "@/components/CurrentYear";
import { IndustryTabs } from "@/components/IndustryTabs";
import { OpportunityFinder } from "@/components/OpportunityFinder";
import { SiteHeader } from "@/components/SiteHeader";
import { CONSULTATION_BOOKING_URL } from "@/lib/site";
import { Icon } from "@/components/Icon";

const services = [
  {
    icon: "workflow",
    title: "Workflow automation",
    description:
      "Turn repetitive tasks, approvals, and handoffs into a connected workflow that keeps moving.",
    tags: ["Approvals", "Data entry", "Reporting"],
  },
  {
    icon: "microsoft",
    title: "Microsoft 365 automation",
    description:
      "Get more from Outlook, Teams, SharePoint, Power Automate, and the tools you already use.",
    tags: ["Power Automate", "Copilot", "SharePoint"],
  },
  {
    icon: "google",
    title: "Google Workspace automation",
    description:
      "Connect Gmail, Drive, Sheets, and Apps Script to make everyday work a little more effortless.",
    tags: ["Apps Script", "Google Sheets", "Gmail"],
  },
  {
    icon: "spark",
    title: "AI consulting & roadmapping",
    description:
      "Find the opportunities worth pursuing, understand the risks, and build a practical plan to get there.",
    tags: ["Discovery", "Strategy", "Pilot planning"],
  },
  {
    icon: "mail",
    title: "Email automation",
    description:
      "Sort incoming requests, extract the details, draft responses, and put the next step in motion.",
    tags: ["Email triage", "Smart routing", "Follow-ups"],
  },
  {
    icon: "people",
    title: "AI training & enablement",
    description:
      "Help your team use AI with confidence through hands-on workshops and responsible-use guidance.",
    tags: ["Workshops", "Governance", "Adoption"],
  },
];
const process = [
  [
    "Understand the work",
    "We learn how your team works, where time goes, and what a better day would look like.",
  ],
  [
    "Find the right starting point",
    "Together, we choose a focused opportunity with clear value and manageable risk.",
  ],
  [
    "Build, test, and refine",
    "We connect your tools, validate with real users, and keep people in control.",
  ],
  [
    "Set your team up to succeed",
    "You get practical training, documentation, and a clear path for what comes next.",
  ],
];
const faqs = [
  [
    "Is my business a good fit?",
    "We work with small and mid-sized organizations, with a particular focus on construction, distribution, IT, and education. If your team spends time on repeatable operational work, there is likely a useful conversation to have.",
  ],
  [
    "Do we need to replace our current software?",
    "Usually not. We start with what already works, then look for better connections and focused automation across Microsoft 365, Google Workspace, and approved business systems.",
  ],
  [
    "Can we start with a small project?",
    "Yes. A focused pilot is often the best first step. Email triage, document processing, recurring reporting, and internal knowledge retrieval can be useful starting points. Scope and timing depend on your systems and requirements.",
  ],
  [
    "How do you approach privacy and security?",
    "Data handling, access, governance, and human review are part of discovery and design. Controls are chosen around your systems, obligations, and risk profile, with human review for consequential outputs.",
  ],
  [
    "Will you help our team learn to use it?",
    "Yes. Training, documentation, and responsible-use guidance can be included so your team understands the workflow and feels confident using it.",
  ],
];
function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main-content">
        <section className="hero" aria-labelledby="hero-title">
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">
                <span className="status-dot" /> PRACTICAL AI. REAL BUSINESS
                VALUE.
              </p>
              <h1 id="hero-title">
                Less busywork.
                <br />
                More{" "}
                <span className="possibility">
                  possibility
                  <svg
                    viewBox="0 0 430 18"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path d="M3 12Q190 -2 426 9M38 16Q230 6 390 14" />
                  </svg>
                </span>
                .
              </h1>
              <p className="hero-lede">
                Your people have better things to do. We build practical AI and
                automations that take repetitive work off their plate—using the
                tools they already know.
              </p>
              <div className="hero-actions">
                <a
                  className="button button-primary"
                  href={CONSULTATION_BOOKING_URL}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Book a 30-minute workflow review through Google Calendar (opens in a new tab)"
                  data-event="hero_primary_cta_click"
                >
                  Let’s talk about your workflow <Arrow />
                </a>
                <a
                  className="hero-assessment-link"
                  href="#assessment"
                  data-event="hero_secondary_cta_click"
                >
                  Take the 3-minute AI assessment{" "}
                  <span aria-hidden="true">→</span>
                </a>
              </div>
              <div className="hero-footnote">
                <span className="location-mark">
                  <Icon name="location" />
                </span>
                <span>Toronto-based. Built around your business.</span>
              </div>
            </div>
            <div
              className="workflow-art"
              role="img"
              aria-label="Illustrative workflow: email, documents, and data connect to Sanare automation, with human review before a completed handoff."
            >
              <div className="art-header">
                <span>
                  <i /> A BETTER WAY TO WORK
                </span>
                <span className="art-dots">•••</span>
              </div>
              <div className="art-canvas">
                <div className="art-orbit orbit-one" />
                <div className="art-orbit orbit-two" />
                <svg
                  className="art-connectors"
                  viewBox="0 0 500 400"
                  aria-hidden="true"
                >
                  <path d="M100 95H175Q196 95 196 120V180H250M97 205H250M100 315H175Q196 315 196 290V230H250M290 205H369V310H411" />
                  <circle r="4">
                    <animateMotion
                      dur="5s"
                      repeatCount="indefinite"
                      path="M100 95H175Q196 95 196 120V180H250"
                    />
                  </circle>
                  <circle r="4">
                    <animateMotion
                      dur="4s"
                      repeatCount="indefinite"
                      path="M100 315H175Q196 315 196 290V230H250"
                    />
                  </circle>
                </svg>
                <div className="tool-node email-node">
                  <span className="tool-symbol">
                    <Icon name="mail" />
                  </span>
                  <span>Email</span>
                  <i />
                </div>
                <div className="tool-node document-node">
                  <span className="tool-symbol">
                    <Icon name="document" />
                  </span>
                  <span>Documents</span>
                  <i />
                </div>
                <div className="tool-node data-node">
                  <span className="tool-symbol">
                    <Icon name="data" />
                  </span>
                  <span>Your data</span>
                  <i />
                </div>
                <div className="sanare-node">
                  <Icon name="spark" />
                  <span>
                    sanare<span className="node-plus">+</span>
                  </span>
                  <small>AI & AUTOMATION</small>
                </div>
                <div className="review-badge">
                  <span>✓</span> Human review built in
                </div>
                <div className="done-node">
                  <span className="done-check">✓</span>
                  <div>
                    <strong>Next step? Handled.</strong>
                    <span>Less friction. More flow.</span>
                  </div>
                  <span className="done-arrow">↗</span>
                </div>
              </div>
              <div className="art-footer">
                <span className="status-dot" />
                <span>Your tools. Working better together.</span>
                <span>↗</span>
              </div>
              <span className="illustration-note">ILLUSTRATIVE WORKFLOW</span>
            </div>
          </div>
          <div className="container integration-strip">
            <p>
              Better together.
              <br />
              <strong>Built for the tools you use.</strong>
            </p>
            <div className="integration-logo">
              <Icon name="microsoft" />
              Microsoft 365
            </div>
            <div className="integration-logo">
              <Icon name="google" />
              Google Workspace
            </div>
            <div className="integration-logo">
              <Icon name="workflow" />
              Power Automate
            </div>
            <div className="integration-logo">
              <Icon name="data" />
              <span>Your business systems</span>
            </div>
          </div>
        </section>

        <section
          className="section section-white"
          id="services"
          aria-labelledby="services-title"
        >
          <div className="container">
            <div className="section-heading split-heading">
              <div>
                <p className="eyebrow dark">01 / WHAT WE DO</p>
                <h2 id="services-title">
                  Good technology.
                  <br />
                  Even better <em>when it fits.</em>
                </h2>
              </div>
              <p>
                From one time-consuming task to a connected way of working, we
                design solutions around your people, your processes, and your
                existing tools.
              </p>
            </div>
            <div className="services-grid">
              {services.map((service, index) => (
                <a
                  className="service-card"
                  href="#assessment"
                  key={service.title}
                >
                  <div className="service-top">
                    <span className={`service-icon icon-${index}`}>
                      <Icon name={service.icon} />
                    </span>
                    <span className="service-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <ul>
                    {service.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </a>
              ))}
            </div>
            <div className="services-bottom">
              <p>Not sure where to start? That’s what we’re here for.</p>
              <a className="text-link" href="#assessment">
                Find your best starting point <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>

        <section
          className="section section-dark"
          id="industries"
          aria-labelledby="industries-title"
        >
          <div className="container">
            <div className="section-heading split-heading light">
              <div>
                <p className="eyebrow">02 / BUILT FOR YOUR WORLD</p>
                <h2 id="industries-title">
                  Different industries.
                  <br />
                  <em>Familiar challenges.</em>
                </h2>
              </div>
              <p>
                We look beyond the technology to understand the work. Explore
                what practical automation could look like in your industry.
              </p>
            </div>
            <IndustryTabs />
          </div>
        </section>

        <section
          className="section section-ivory"
          id="process"
          aria-labelledby="process-title"
        >
          <div className="container">
            <div className="section-heading split-heading">
              <div>
                <p className="eyebrow dark">03 / HOW WE WORK</p>
                <h2 id="process-title">
                  Small steps.
                  <br />
                  <em>Meaningful progress.</em>
                </h2>
              </div>
              <p>
                You don’t need a transformation program to get started. One
                well-chosen workflow can make a real difference.
              </p>
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

        <section
          className="partnership-section"
          aria-labelledby="partnership-title"
        >
          <div className="container partnership-grid">
            <div className="partnership-mark" aria-hidden="true">
              <Icon name="spark" />
              <span>TECHNOLOGY + PEOPLE</span>
            </div>
            <div>
              <p className="eyebrow dark">THE SANARE APPROACH</p>
              <h2 id="partnership-title">
                Thoughtful by design.
                <br />
                <em>Human at heart.</em>
              </h2>
              <p>
                Work directly with a hands-on partner who takes the time to
                understand your business. We pair practical delivery with the
                training and guidance your people need to make it work.
              </p>
              <ul className="partnership-values">
                <li>✓ Your existing tools, connected</li>
                <li>✓ Privacy considered from day one</li>
                <li>✓ Human review where it matters</li>
                <li>✓ Training that builds confidence</li>
              </ul>
            </div>
          </div>
        </section>

        <OpportunityFinder />

        <section
          className="section section-white"
          id="faq"
          aria-labelledby="faq-title"
        >
          <div className="container faq-grid">
            <div className="faq-intro">
              <p className="eyebrow dark">A LITTLE MORE CLARITY</p>
              <h2 id="faq-title">
                Good questions.
                <br />
                <em>Straight answers.</em>
              </h2>
              <p>Taking the first step should feel simple.</p>
              <a
                className="text-link"
                href="mailto:questions@sanaresolutions.ca"
              >
                Ask us something else <Arrow />
              </a>
            </div>
            <div className="faq-list">
              {faqs.map(([question, answer], index) => (
                <details key={question} open={index === 0}>
                  <summary>
                    {question}
                    <span aria-hidden="true">+</span>
                  </summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section
          className="contact-section"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className="container contact-grid">
            <div className="contact-copy">
              <p className="eyebrow">LET’S MAKE WORK FLOW</p>
              <h2 id="contact-title">
                More time for
                <br />
                what <em>comes next.</em>
              </h2>
              <p>
                Tell us what’s slowing your team down. We’ll help you find a
                practical way forward.
              </p>
              <a
                className="button button-primary"
                href={CONSULTATION_BOOKING_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="Book a consultation through Google Calendar (opens in a new tab)"
              >
                Book a 30-minute workflow review <Arrow />
              </a>
              <a
                className="email-link"
                href="mailto:questions@sanaresolutions.ca"
              >
                questions@sanaresolutions.ca <Arrow />
              </a>
              <span className="contact-location">
                TORONTO, ONTARIO · WORKING WITH GROWING BUSINESSES
              </span>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <a
              className="brand footer-brand"
              href="#main-content"
              aria-label="Sanare Solutions home"
            >
              <span className="brand-mark" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span>
                Sanare <em>Solutions</em>
              </span>
            </a>
            <p>
              Practical AI. Less busywork.
              <br />
              More room for what matters.
            </p>
          </div>
          <nav aria-label="Footer navigation">
            <a href="#services">Services</a>
            <a href="#industries">Industries</a>
            <a href="#assessment">AI Assessment</a>
            <a href="#process">How It Works</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="footer-contact">
            <span>LET’S CONNECT</span>
            <a href="mailto:questions@sanaresolutions.ca">
              questions@sanaresolutions.ca <Arrow />
            </a>
            <span>Based in Toronto, Canada</span>
          </div>
        </div>
        <div className="container footer-bottom">
          <p>
            © <CurrentYear /> Sanare Solutions. All rights reserved.
          </p>
          <span>Thoughtful technology. Practical possibilities.</span>
          <a href="/privacy">Privacy notice ↗</a>
        </div>
      </footer>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Sanare Solutions",
            url: "https://sanaresolutions.ca",
            email: "questions@sanaresolutions.ca",
            description:
              "Tailored AI consulting, business workflow automation, and team enablement for growing organizations.",
          }),
        }}
      />
    </>
  );
}
