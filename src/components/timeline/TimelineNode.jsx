import React from 'react';
import { motion } from 'framer-motion';
import { useStoryStore } from '../../store/useStoryStore';
import { Calendar, Layers } from 'lucide-react';

export const TimelineNode = ({ event, onEventClick }) => {
  const { setSelectedDate } = useStoryStore();

  const handleClick = () => {
    if (onEventClick) {
      onEventClick();
      return;
    }

    setSelectedDate(event.timestamp);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }} 
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onClick={handleClick}
      className="relative pl-12 group cursor-pointer"
    >
      {/* Minimalist Pink Timeline Dot - matches the screenshot */}
      <div className="absolute left-[13px] top-6 w-3 h-3 rounded-full z-20 transition-all duration-300 bg-white border-[3px] border-neutral-300 group-hover:border-[#ea4c89] group-hover:bg-[#ea4c89] shadow-sm" />

      {/* Clean White Dribbble-Style Card */}
      <div className="relative p-6 rounded-2xl transition-all duration-300 bg-white border border-neutral-200 group-hover:border-[#ea4c89]/40 group-hover:shadow-[0_8px_30px_rgba(234,76,137,0.08)]">
        
        {/* Date Header - Made pink by default to match screenshot */}
        <div className="flex items-center gap-2 mb-3 text-[#ea4c89]">
          <Calendar size={14} />
          <time className="text-xs font-bold tracking-widest uppercase">
            {event.timestamp}
          </time>
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-bold text-neutral-900 mb-2 leading-tight">
          {event.title}
        </h3>
        
        {/* Summary */}
        <p className="text-sm text-neutral-500 leading-relaxed line-clamp-2">
          {event.summary}
        </p>

        {/* Action Hint */}
        <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-4">
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#ea4c89] uppercase tracking-widest">
            <Layers size={12} />
            View Source Articles
          </span>
          <span className="text-[#ea4c89] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity">
            Expand <span className="text-lg leading-none">→</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default TimelineNode;