import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  variant?: 'default' | 'compact';
}

export default function Logo({ className = '', size = 40, variant = 'default' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F5E6A3" />
          <stop offset="35%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#A68A2E" />
        </linearGradient>
        <linearGradient id="logoBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="100%" stopColor="#0A1628" />
        </linearGradient>
        <filter id="logoGlow">
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#D4AF37" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Shield outline */}
      <path
        d="M20 2L5 10v9c0 8.5 6.5 16.5 15 19 8.5-2.5 15-10.5 15-19v-9L20 2z"
        fill="url(#logoBg)"
        stroke="url(#logoGold)"
        strokeWidth="1.5"
        filter="url(#logoGlow)"
      />

      {/* Inner shield accent */}
      <path
        d="M20 5.5L8 12v7.5c0 7 5.5 13.8 12 16 6.5-2.2 12-9 12-16V12L20 5.5z"
        fill="none"
        stroke="url(#logoGold)"
        strokeWidth="0.5"
        opacity="0.4"
      />

      {/* W letterform */}
      <text
        x="20"
        y="27"
        textAnchor="middle"
        fill="url(#logoGold)"
        fontFamily="'Georgia', 'Playfair Display', serif"
        fontSize="18"
        fontWeight="bold"
        letterSpacing="0.5"
        dominantBaseline="middle"
      >
        W
      </text>

      {/* Horizontal accent bar */}
      <line
        x1="11"
        y1="30.5"
        x2="29"
        y2="30.5"
        stroke="url(#logoGold)"
        strokeWidth="0.5"
        opacity="0.5"
      />

      {/* Small diamonds on bar ends */}
      <polygon points="11,30.5 11.8,29 12.6,30.5 11.8,32" fill="url(#logoGold)" opacity="0.6" />
      <polygon points="27.4,30.5 28.2,29 29,30.5 28.2,32" fill="url(#logoGold)" opacity="0.6" />

      {/* Two small stars flanking the shield top */}
      <circle cx="13" cy="8" r="0.8" fill="#F5E6A3" opacity="0.7" />
      <circle cx="27" cy="8" r="0.8" fill="#F5E6A3" opacity="0.7" />
    </svg>
  );
}
