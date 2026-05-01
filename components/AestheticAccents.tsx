import React from 'react';

export const AestheticAccents = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Background Architectural Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full border-l border-mist opacity-40"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/4 border-t border-mist opacity-30"></div>
      <div className="absolute top-[15%] right-[10%] w-48 h-64 border border-mist rotate-2 opacity-20"></div>

      {/* Decorative Floral Line Art (Bottom Left) */}
      <svg className="absolute bottom-10 left-10 w-40 h-40 text-dust-gray opacity-10" viewBox="0 0 100 100">
        <path 
          d="M50 100 C 50 70, 70 50, 90 40 M50 100 C 50 70, 30 50, 10 40 M50 100 C 60 40, 50 20, 50 0" 
          stroke="currentColor" 
          strokeWidth="0.5" 
          fill="none" 
        />
      </svg>
      
      {/* Accent dots */}
      <div className="absolute top-1/4 left-[15%] w-1.5 h-1.5 rounded-full bg-tea/40"></div>
      <div className="absolute middle-1/2 right-[20%] w-1 h-1 rounded-full bg-warm-gray/30"></div>
    </div>
  );
};
