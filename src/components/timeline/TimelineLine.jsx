import React from 'react';
import { motion } from 'framer-motion';

// Using a standard function export fixes the "before initialization" crash!
export function TimelineLine() {
  return (
    <motion.div 
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "100%", opacity: 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      // This creates the continuous line behind the pink dots
      className="absolute left-[18px] top-8 bottom-0 w-[2px] bg-gradient-to-b from-[#ea4c89] via-[#ea4c89]/40 to-transparent z-10"
    />
  );
}

// Ensure it can also be imported as default if needed elsewhere
export default TimelineLine;