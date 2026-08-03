import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Notice | Sanare Solutions",
  description: "How Sanare Solutions collects, uses, protects, and retains website inquiry information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="privacy-page">
      <header className="privacy-header">
        <div className="container">
          <Link className="brand" href="/" aria-label="Sanare Solutions home">
            <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
            <span>Sanare <em>Solutions</em></span>
          </Link>
          <Link href="/">← Back to website</Link>
        </div>
      </header>
      <main className="container privacy-content">
        <p className="eyebrow dark">Privacy notice</p>
        <h1>Clear information about the information you share.</h1>
        <p className="updated">Effective August 3, 2026</p>

        <p className="notice-callout">
          Please do not submit confidential, health, student, financial, personal, or other regulated information through the public website forms.
        </p>

        <h2>Who is responsible for this website?</h2>
        <p>
          Sanare Solutions operates sanaresolutions.ca. Questions about this notice or requests concerning your information can be sent to <a href="mailto:questions@sanaresolutions.ca">questions@sanaresolutions.ca</a>.
        </p>

        <h2>What information is collected?</h2>
        <p>When you use the AI Opportunity Finder or general inquiry form, Sanare Solutions may collect:</p>
        <ul>
          <li>Your name, work email, company, and any optional contact details you provide.</li>
          <li>Your answers about your organization, technology, operational challenges, goals, readiness, and constraints.</li>
          <li>The message or high-level process description you submit.</li>
          <li>Consent time, page address, campaign parameters, and limited technical information used for security and delivery.</li>
        </ul>

        <h2>Why is the information used?</h2>
        <p>
          Information is used to respond to your request, prepare for a consultation, provide a preliminary opportunity summary, protect the forms from abuse, and understand which website content is useful. It is not used for unrelated advertising, and Sanare Solutions does not sell personal information.
        </p>

        <h2>How are submissions delivered?</h2>
        <p>
          Website submissions are processed by Cloudflare Pages and Cloudflare security services, then delivered by email to Sanare Solutions. The website does not intentionally maintain a separate database of form submissions in version one. Cloudflare may process limited technical data according to its own service terms and privacy commitments.
        </p>

        <h2>Analytics</h2>
        <p>
          Cloudflare Web Analytics may be used to understand aggregate website traffic and performance. Names, email addresses, free-text form responses, and assessment answers are not intentionally sent to analytics. Advertising trackers are not enabled by default.
        </p>

        <h2>How long is information kept?</h2>
        <p>
          Information from prospective inquiries is retained for up to 12 months after the most recent interaction, then deleted or anonymized unless a longer period is reasonably required for an active client relationship, a requested service, dispute resolution, security, or a legal obligation.
        </p>

        <h2>How is information protected?</h2>
        <p>
          Sanare Solutions uses server-side validation, restricted form delivery, Cloudflare security controls, and access-limited business systems. No internet transmission or storage method can be guaranteed to be completely secure, so public forms should be used only for non-sensitive business context.
        </p>

        <h2>Your choices and requests</h2>
        <p>
          You may ask to access, correct, or delete information submitted through the website, subject to applicable legal and operational requirements. Send requests to <a href="mailto:questions@sanaresolutions.ca?subject=Privacy%20request">questions@sanaresolutions.ca</a>. You may also contact Sanare Solutions directly instead of using a website form.
        </p>

        <h2>Changes to this notice</h2>
        <p>
          This notice may be updated when website features, service providers, or information practices change. The effective date above identifies the current version.
        </p>
      </main>
    </div>
  );
}
