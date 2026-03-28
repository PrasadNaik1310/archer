import React from 'react';

export const TimelineLine = () => (
  <div className="absolute left-0 top-0 bottom-0 w-px ml-4 pointer-events-none z-0 overflow-hidden">
    {/* Base track: Crisp, professional light gray */}
    <div className="w-full h-full bg-slate-200" />
    
    {/* Pulse overlay: Soft blue gradient to indicate active flow */}
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-500 via-blue-400/20 to-transparent animate-pulse opacity-40" />
  </div>
);

export default TimelineLine;