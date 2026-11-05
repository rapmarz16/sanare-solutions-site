import type { CSSProperties, ReactNode } from "react";

export function Icon({ name, style }: { name: string; style?: CSSProperties }) {
  const paths: Record<string, ReactNode> = {
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
    document: (
      <>
        <path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8Z" />
        <path d="M14 3v6h5M9 13h6M9 17h6" />
      </>
    ),
    data: (
      <>
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0" />
      </>
    ),
    workflow: (
      <>
        <rect x="3" y="3" width="6" height="6" rx="1.5" />
        <rect x="15" y="15" width="6" height="6" rx="1.5" />
        <rect x="3" y="15" width="6" height="6" rx="1.5" />
        <path d="M6 9v6M9 6h9v9M9 18h6" />
      </>
    ),
    microsoft: (
      <path
        d="M3 3h7v7H3ZM14 3h7v7h-7ZM3 14h7v7H3ZM14 14h7v7h-7Z"
        fill="currentColor"
        stroke="none"
      />
    ),
    google: (
      <path
        d="M20.5 7a10 10 0 1 0 1 9V11H12v4h5a5.5 5.5 0 1 1-1-8"
        strokeWidth="3"
      />
    ),
    spark: <path d="M12 2v20M2 12h20M5 5l14 14M19 5 5 19" strokeWidth="3.2" />,
    people: (
      <>
        <circle cx="9" cy="7" r="3" />
        <path d="M3 21v-3a6 6 0 0 1 12 0v3M17 4a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 5v2" />
      </>
    ),
    location: (
      <>
        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),
  };
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      aria-hidden="true"
    >
      {paths[name] ?? paths.workflow}
    </svg>
  );
}
