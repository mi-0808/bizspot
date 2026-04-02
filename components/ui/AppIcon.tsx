"use client";

interface Props {
  name:
    | "wifi"
    | "power"
    | "yen"
    | "focus"
    | "crowd"
    | "route"
    | "bookmark"
    | "go"
    | "spark"
    | "clock"
    | "pin";
  className?: string;
}

export function AppIcon({ name, className = "h-4 w-4" }: Props) {
  const common = {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    className,
  };

  switch (name) {
    case "wifi":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25A16.9 16.9 0 0 1 12 5.25c3.46 0 6.68 1.03 9.75 3" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 11.25A11.91 11.91 0 0 1 12 9.75c2.4 0 4.63.7 6.75 1.92" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 14.25A6.93 6.93 0 0 1 12 13.5c1.36 0 2.64.39 3.75 1.05" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75h.008v.008H12z" />
        </svg>
      );
    case "power":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25v8.25" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.72 4.93a8.25 8.25 0 1 0 8.56 0" />
        </svg>
      );
    case "yen":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75 12 10.5l4.5-6.75" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 11.25h7.5M8.25 14.25h7.5M12 10.5v9.75" />
        </svg>
      );
    case "focus":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="7.5" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "crowd":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 18.75a3.75 3.75 0 0 0-7.5 0" />
          <circle cx="11.25" cy="8.25" r="2.25" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 18.75a3.75 3.75 0 0 0-3-3.675" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.43a2.25 2.25 0 1 1 0 3.64" />
        </svg>
      );
    case "route":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 18.75a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5ZM18.75 9.75a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 16.5h4.125a3.375 3.375 0 0 0 3.375-3.375v-.75A3.375 3.375 0 0 1 18.375 9H16.5" />
        </svg>
      );
    case "bookmark":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 4.5h10.5a.75.75 0 0 1 .75.75v14.654a.345.345 0 0 1-.566.265L12 15.75l-5.434 4.169A.345.345 0 0 1 6 19.654V5.25a.75.75 0 0 1 .75-.75Z" />
        </svg>
      );
    case "go":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m13.5 4.5 6 7.5-6 7.5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h14.25" />
        </svg>
      );
    case "spark":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m12 3 1.8 4.95L18.75 9.75l-4.95 1.8L12 16.5l-1.8-4.95-4.95-1.8 4.95-1.8L12 3Z" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.25" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5v5.25l3 1.5" />
        </svg>
      );
    case "pin":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
      );
    default:
      return null;
  }
}
