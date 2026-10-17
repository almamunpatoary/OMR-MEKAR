import React from 'react';

interface BoardEmblemProps {
  className?: string;
  type?: 'madrasah' | 'general' | 'school';
  color?: string;
}

export const BoardEmblem: React.FC<BoardEmblemProps> = ({
  className = 'w-12 h-12',
  type = 'madrasah',
  color = '#881337',
}) => {
  if (type === 'madrasah') {
    return (
      <svg
        viewBox="0 0 100 100"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer circular borders */}
        <circle cx="50" cy="50" r="47" stroke={color} strokeWidth="2.5" />
        <circle cx="50" cy="50" r="43" stroke={color} strokeWidth="1" strokeDasharray="2 2" />
        <circle cx="50" cy="50" r="39" stroke={color} strokeWidth="1.5" />

        {/* Central emblem: Open Quran / Book on Rehal */}
        <path
          d="M 32 62 Q 50 67 50 56 Q 50 67 68 62 L 67 43 Q 50 48 50 38 Q 50 48 33 43 Z"
          fill={color}
          opacity="0.9"
        />
        {/* Book pages detail */}
        <path d="M 36 46 Q 50 50 50 41" stroke="#ffffff" strokeWidth="1.2" fill="none" />
        <path d="M 64 46 Q 50 50 50 41" stroke="#ffffff" strokeWidth="1.2" fill="none" />

        {/* Rehal stand */}
        <path d="M 40 64 L 60 76 M 60 64 L 40 76" stroke={color} strokeWidth="2" strokeLinecap="round" />

        {/* Rising sun / light rays at top */}
        <circle cx="50" cy="31" r="5" fill={color} />
        <line x1="50" y1="21" x2="50" y2="24" stroke={color} strokeWidth="1.5" />
        <line x1="42" y1="23" x2="44" y2="26" stroke={color} strokeWidth="1.5" />
        <line x1="58" y1="23" x2="56" y2="26" stroke={color} strokeWidth="1.5" />
        <line x1="36" y1="29" x2="39" y2="30" stroke={color} strokeWidth="1.5" />
        <line x1="64" y1="29" x2="61" y2="30" stroke={color} strokeWidth="1.5" />

        {/* Circular text representation */}
        <path
          id="textPath"
          d="M 17,50 A 33,33 0 1,1 83,50"
          fill="none"
        />
        <text fontSize="7" fill={color} fontWeight="bold" textAnchor="middle">
          <textPath href="#textPath" startOffset="50%">
            ইকরা বিসমি রাব্বিকা
          </textPath>
        </text>

        {/* Stars */}
        <circle cx="20" cy="50" r="1.5" fill={color} />
        <circle cx="80" cy="50" r="1.5" fill={color} />
      </svg>
    );
  }

  // General Board Emblem (Government Water Lily / Education Motif)
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="47" stroke={color} strokeWidth="2.5" />
      <circle cx="50" cy="50" r="42" stroke={color} strokeWidth="1" strokeDasharray="3 2" />
      <circle cx="50" cy="50" r="37" stroke={color} strokeWidth="1.5" />

      {/* Water lily shapla */}
      <path
        d="M 50 28 C 47 40 43 46 32 54 C 42 53 47 57 50 66 C 53 57 58 53 68 54 C 57 46 53 40 50 28 Z"
        fill={color}
      />
      {/* Waves at bottom */}
      <path
        d="M 28 70 Q 38 66 50 70 Q 62 74 72 70"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M 32 75 Q 41 72 50 75 Q 59 78 68 75"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
      {/* 4 stars representing education values */}
      <polygon points="50,15 52,19 56,19 53,22 54,26 50,23 46,26 47,22 44,19 48,19" fill={color} />
      <circle cx="22" cy="50" r="1.8" fill={color} />
      <circle cx="78" cy="50" r="1.8" fill={color} />
    </svg>
  );
};
