"use client";

import { useRef, useState } from "react";

const industries = [
  {
    id: "construction",
    name: "Construction",
    number: "01",
    intro: "Keep project information moving between the field, office, trades, and clients with less re-entry and fewer missed handoffs.",
    examples: [
      "Convert site reports and emails into structured project updates",
      "Route RFIs, change requests, safety documentation, and approvals",
      "Summarize project correspondence and meeting notes",
      "Generate standardized documents from project data",
      "Improve field-to-office information flow",
    ],
  },
  {
    id: "distribution",
    name: "Distribution",
    number: "02",
    intro: "Turn high-volume orders, exceptions, documents, and follow-ups into a more visible and consistent operating flow.",
    examples: [
      "Process order and exception emails",
      "Extract data from PDFs and customer documents",
      "Create alerts for inventory, delivery, or account issues",
      "Automate internal routing and follow-up",
      "Produce operational summaries and recurring reports",
    ],
  },
  {
    id: "it",
    name: "IT",
    number: "03",
    intro: "Give technical teams cleaner intake, faster context, and better knowledge reuse while preserving appropriate control.",
    examples: [
      "Convert chat or email requests into structured tickets",
      "Summarize incidents and technical threads",
      "Draft knowledge-base content",
      "Automate onboarding, offboarding, and access workflows",
      "Build internal assistants over approved knowledge sources",
    ],
  },
  {
    id: "education",
    name: "Education",
    number: "04",
    intro: "Reduce administrative workload while keeping privacy, responsible use, and staff confidence at the centre of the solution.",
    examples: [
      "Automate forms, approvals, notices, and administrative communication",
      "Summarize policies and internal knowledge",
      "Prepare recurring reports",
      "Support staff training and responsible AI adoption",
      "Reduce manual work around scheduling, documentation, and inquiries",
    ],
  },
];

export function IndustryTabs() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const industry = industries[active];

  const select = (index: number) => {
    setActive(index);
    window.dispatchEvent(new CustomEvent("sanare:analytics", {
      detail: { event: "industry_tab_selected", industry: industries[index].id },
    }));
  };

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % industries.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + industries.length) % industries.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = industries.length - 1;
    else return;
    event.preventDefault();
    select(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="industry-explorer">
      <div className="industry-tabs" role="tablist" aria-label="Priority industries">
        {industries.map((item, index) => (
          <button
            type="button"
            role="tab"
            id={`tab-${item.id}`}
            aria-controls={`panel-${item.id}`}
            aria-selected={active === index}
            tabIndex={active === index ? 0 : -1}
            ref={(element) => { tabRefs.current[index] = element; }}
            onClick={() => select(index)}
            onKeyDown={(event) => onKeyDown(event, index)}
            key={item.id}
          >
            <span>{item.number}</span>{item.name}
          </button>
        ))}
      </div>
      <div
        className="industry-panel"
        role="tabpanel"
        id={`panel-${industry.id}`}
        aria-labelledby={`tab-${industry.id}`}
        tabIndex={0}
      >
        <div className="industry-intro">
          <span className="industry-number">{industry.number}</span>
          <h3>{industry.name}</h3>
          <p>{industry.intro}</p>
        </div>
        <ul>
          {industry.examples.map((example) => <li key={example}><span aria-hidden="true">→</span>{example}</li>)}
        </ul>
        <p className="industry-note">
          Examples are illustrative. Final solutions depend on your systems, privacy obligations, and workflow.
        </p>
      </div>
    </div>
  );
}
