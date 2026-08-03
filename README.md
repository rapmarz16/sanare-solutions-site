# Sanare Solutions Website

Production website for [sanaresolutions.ca](https://sanaresolutions.ca), built from the Sanare Solutions Website Design & Functional Specification.

## What is included

- Responsive one-page marketing site plus a privacy notice
- Six service areas and four accessible industry panels
- Eight-step AI Opportunity Finder with session persistence, transparent recommendation rules, review, validation, and email fallback
- General inquiry form with explicit consent
- Cloudflare Pages Functions with server-side validation, Turnstile verification, honeypot protection, and Cloudflare Email Service delivery
- SEO metadata, Organization structured data, sitemap, robots rules, branded favicon, and social-sharing card
- Security headers, reduced-motion support, keyboard interaction, visible focus, and narrow-screen layouts down to 320 px

## Technology

- Vinext / React with static prerendering
- Modern CSS without an animation or component library
- Cloudflare Pages Functions
- Cloudflare Turnstile
- Cloudflare Email Service / Email Routing
- Cloudflare Web Analytics, enabled in the Pages dashboard

## Local development

Requirements: Node.js 22.13 or later and pnpm.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

The website UI works locally without secrets. Form delivery returns a clear configuration message and offers an email fallback until the Cloudflare variables below are configured.

## Validate a production build

```bash
pnpm build
pnpm test
pnpm lint
```

The Pages build output is `dist/client`. The server-rendered worker output used by the automated tests is `dist/server/index.js`.

## Cloudflare Pages deployment

Create a Cloudflare Pages project connected to `rapmarz16/sanare-solutions-site` with:

- Production branch: `main`
- Build command: `pnpm run build:pages`
- Build output directory: `dist/client`
- Root directory: `/`
- Node version: 22 or later

The repository’s `wrangler.jsonc` is the Pages configuration source of truth. The `functions/` folder supplies `/api/assessment` and `/api/contact`.

### 1. Configure Email Service and routing

1. In Cloudflare, onboard `sanaresolutions.ca` to Email Service and enable Email Routing.
2. Create and verify the destination mailbox that should receive routed messages.
3. Create active routing rules for `intake@sanaresolutions.ca` and `questions@sanaresolutions.ca`.
4. Onboard the sending domain/address required for `forms@sanaresolutions.ca`.
5. Create a scoped Cloudflare API token that can send email for this account.

Cloudflare permits free sending to verified destination addresses when Email Routing is configured. If the two `@sanaresolutions.ca` aliases are not accepted as outbound destinations on the account plan, set `ASSESSMENT_TO_EMAIL` and `CONTACT_TO_EMAIL` to the verified forwarding mailbox instead; the public site addresses remain unchanged.

Official references:

- [Email Routing addresses and rules](https://developers.cloudflare.com/email-service/configuration/email-routing-addresses/)
- [Cloudflare Email Service](https://developers.cloudflare.com/email-service/)
- [Email send bindings and restrictions](https://developers.cloudflare.com/email-service/configuration/send-bindings/)

### 2. Configure Turnstile

Create a managed Turnstile widget for these hostnames:

- `sanaresolutions.ca`
- `www.sanaresolutions.ca`, if used
- the generated `*.pages.dev` hostname for deployment testing

Add these Cloudflare Pages variables:

| Variable | Scope | Purpose |
|---|---|---|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Build environment | Public browser widget key |
| `TURNSTILE_SECRET_KEY` | Encrypted secret | Server-side verification |
| `CF_ACCOUNT_ID` | Encrypted secret | Cloudflare Email Service account |
| `CF_EMAIL_API_TOKEN` | Encrypted secret | Scoped email-sending credential |
| `FORM_FROM_EMAIL` | Plain variable | Defaults to `forms@sanaresolutions.ca` |
| `ASSESSMENT_TO_EMAIL` | Plain variable | Defaults to `intake@sanaresolutions.ca` |
| `CONTACT_TO_EMAIL` | Plain variable | Defaults to `questions@sanaresolutions.ca` |

Never commit real token or secret values. After setting a build variable, trigger a new deployment so the public Turnstile key is compiled into the site.

### 3. Add the custom domain

In the Pages project, open **Custom domains**, add `sanaresolutions.ca`, and follow the DNS prompts. Add `www.sanaresolutions.ca` only if it will be used, then redirect one hostname to the canonical apex domain.

### 4. Enable Web Analytics

In the Pages project, open **Metrics** and enable Web Analytics. Cloudflare adds the analytics snippet on the next deployment. The website does not send names, email addresses, assessment answers, or free-text form content to analytics.

Official reference: [Enable Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/get-started/).

### 5. Test production forms

Submit one general inquiry and one assessment using non-sensitive test data. Confirm that:

- Turnstile completes successfully.
- Each message reaches the intended mailbox.
- The assessment message contains the structured answers and recommendation categories.
- A failed request preserves answers and shows the copyable/email fallback.

## Privacy choices

- Explicit consent is required only to respond to the request; there is no bundled marketing consent.
- The website does not intentionally store submissions in a database.
- Prospective inquiry email records are retained for up to 12 months after the most recent interaction unless a longer period is required for an active relationship or legal/security reason.
- The privacy notice must be updated if storage, CRM, marketing, or analytics practices change.

## Content governance

Version one intentionally omits unverified biographies, phone numbers, locations, testimonials, client logos, certifications, partner claims, case studies, and numerical ROI claims. Add those only after owner approval.
