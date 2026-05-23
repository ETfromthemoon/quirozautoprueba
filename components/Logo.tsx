type LogoProps = {
  variant?: "full" | "mark" | "horizontal";
  className?: string;
};

export default function Logo({ variant = "full", className = "" }: LogoProps) {
  if (variant === "mark") {
    return (
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Quiroz Redcar"
      >
        <defs>
          <linearGradient id="silver-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f9fafb" />
            <stop offset="50%" stopColor="#d1d5db" />
            <stop offset="100%" stopColor="#9ca3af" />
          </linearGradient>
        </defs>
        {/* Q letter — circle + tail */}
        <circle
          cx="50"
          cy="48"
          r="34"
          fill="none"
          stroke="url(#silver-grad)"
          strokeWidth="8"
        />
        <line
          x1="62"
          y1="62"
          x2="78"
          y2="86"
          stroke="url(#silver-grad)"
          strokeWidth="8"
          strokeLinecap="square"
        />
      </svg>
    );
  }

  if (variant === "horizontal") {
    return (
      <svg
        viewBox="0 0 280 60"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Quiroz Redcar"
      >
        <defs>
          <linearGradient id="silver-grad-h" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f9fafb" />
            <stop offset="50%" stopColor="#d1d5db" />
            <stop offset="100%" stopColor="#9ca3af" />
          </linearGradient>
        </defs>
        {/* Q mark */}
        <g transform="translate(2, 2)">
          <circle
            cx="28"
            cy="26"
            r="22"
            fill="none"
            stroke="url(#silver-grad-h)"
            strokeWidth="5"
          />
          <line
            x1="36"
            y1="38"
            x2="46"
            y2="54"
            stroke="url(#silver-grad-h)"
            strokeWidth="5"
            strokeLinecap="square"
          />
        </g>
        {/* QUIROZ wordmark */}
        <text
          x="70"
          y="28"
          fontFamily="var(--font-syne), system-ui, sans-serif"
          fontSize="22"
          fontWeight="700"
          letterSpacing="0.05em"
          fill="white"
        >
          QUIROZ
        </text>
        {/* REDCAR tagline */}
        <text
          x="70"
          y="48"
          fontFamily="var(--font-syne), system-ui, sans-serif"
          fontSize="14"
          fontWeight="600"
          letterSpacing="0.08em"
        >
          <tspan fill="#dc2626">RED</tspan>
          <tspan fill="white">CAR</tspan>
        </text>
      </svg>
    );
  }

  // Full logo (vertical)
  return (
    <svg
      viewBox="0 0 200 240"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Quiroz Redcar"
    >
      <defs>
        <linearGradient id="silver-grad-f" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f9fafb" />
          <stop offset="50%" stopColor="#d1d5db" />
          <stop offset="100%" stopColor="#9ca3af" />
        </linearGradient>
      </defs>
      {/* Q mark */}
      <g transform="translate(60, 10)">
        <circle
          cx="40"
          cy="40"
          r="34"
          fill="none"
          stroke="url(#silver-grad-f)"
          strokeWidth="7"
        />
        <line
          x1="52"
          y1="56"
          x2="68"
          y2="80"
          stroke="url(#silver-grad-f)"
          strokeWidth="7"
          strokeLinecap="square"
        />
      </g>
      {/* QUIROZ */}
      <text
        x="100"
        y="150"
        textAnchor="middle"
        fontFamily="var(--font-syne), system-ui, sans-serif"
        fontSize="34"
        fontWeight="700"
        letterSpacing="0.05em"
        fill="white"
      >
        QUIROZ
      </text>
      {/* REDCAR */}
      <text
        x="100"
        y="200"
        textAnchor="middle"
        fontFamily="var(--font-syne), system-ui, sans-serif"
        fontSize="32"
        fontWeight="600"
        letterSpacing="0.05em"
      >
        <tspan fill="#dc2626">RED</tspan>
        <tspan fill="white">CAR</tspan>
      </text>
    </svg>
  );
}
