import React from 'react';

export const TimelineLine = () => (
  <div className="absolute left-0 top-0 bottom-0 w-px ml-4 pointer-events-none z-0 overflow-hidden">
    {/* Base track: Clean, light minimalist gray */}
    <div className="w-full h-full bg-neutral-200" />
    
    {/* Pulse overlay: Signature Dribbble pink gradient */}
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#ea4c89] via-[#ea4c89]/20 to-transparent animate-pulse opacity-30" />
  </div>
);

export default TimelineLine;