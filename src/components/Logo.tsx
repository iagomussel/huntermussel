import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "h-8 w-8" }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      
      {/* Outer Circle */}
      <circle cx="50" cy="50" r="45" stroke="url(#gradient)" strokeWidth="2" />
      
      {/* Book Pages */}
      <path
        d="M30 35C30 33.8954 30.8954 33 32 33H68C69.1046 33 70 33.8954 70 35V65C70 66.1046 69.1046 67 68 67H32C30.8954 67 30 66.1046 30 65V35Z"
        fill="url(#gradient)"
        opacity="0.1"
      />
      
      {/* Code Brackets */}
      <path
        d="M40 40L35 50L40 60"
        stroke="url(#gradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M60 40L65 50L60 60"
        stroke="url(#gradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Slash */}
      <path
        d="M55 35L45 65"
        stroke="url(#gradient)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Logo;
