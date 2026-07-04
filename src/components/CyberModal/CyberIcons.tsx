import React from "react";

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const IconUser: React.FC = () => (
  <svg {...iconProps}>
    <rect x="3" y="4" width="18" height="14" rx="2" />
    <circle cx="9" cy="10" r="2" />
    <path d="M6 17c0-2 1.5-3 3-3h0c1.5 0 3 1 3 3" />
    <line x1="14" y1="9" x2="18" y2="9" />
    <line x1="14" y1="12" x2="17" y2="12" />
  </svg>
);

export const IconAI: React.FC = () => (
  <svg {...iconProps}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <circle cx="9" cy="10" r="2" />
    <path d="M7 15c0-1.5 1-2.5 2-2.5s2 1 2 2.5" />
    <path d="M14 8h3M14 11h2M14 14h3" />
    <circle cx="17" cy="8" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

export const IconPhone: React.FC = () => (
  <svg {...iconProps}>
    <rect x="7" y="2" width="10" height="20" rx="2" />
    <line x1="10" y1="5" x2="14" y2="5" />
    <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const IconLock: React.FC = () => (
  <svg {...iconProps}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    <circle cx="12" cy="16" r="1" fill="currentColor" stroke="none" />
    <line x1="10" y1="19" x2="14" y2="19" />
  </svg>
);
