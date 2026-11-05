"use client";

import { useEffect, useState } from "react";

import { CONSULTATION_BOOKING_URL } from "@/lib/site";

const links = [
  ["Services", "#services"],
  ["Industries", "#industries"],
  ["AI Assessment", "#assessment"],
  ["How It Works", "#process"],
  ["FAQ", "#faq"],
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="container nav-shell">
        <a className="brand" href="#main-content" aria-label="Sanare Solutions home">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span>Sanare <em>Solutions</em></span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {links.map(([label, href]) => <a href={href} key={href}>{label}</a>)}
        </nav>
        <a
          className="button nav-cta"
          href={CONSULTATION_BOOKING_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="Book a consultation through Google Calendar (opens in a new tab)"
        >
          Let’s talk <span aria-hidden="true">↗</span>
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setOpen((current) => !current)}
        >
          <span /><span /><span />
        </button>
      </div>
      <div className={`mobile-menu${open ? " is-open" : ""}`} id="mobile-menu" inert={!open}>
        <nav aria-label="Mobile navigation">
          {links.map(([label, href]) => (
            <a href={href} key={href} onClick={() => setOpen(false)}>{label}</a>
          ))}
          <a
            className="button button-primary"
            href={CONSULTATION_BOOKING_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Book a consultation through Google Calendar (opens in a new tab)"
            onClick={() => setOpen(false)}
          >
            Book a consultation
          </a>
        </nav>
      </div>
    </header>
  );
}
