import React from 'react';
import { motion } from 'framer-motion';
import { useStoryStore } from '../../store/useStoryStore';
import { Calendar, Layers } from 'lucide-react';

export const TimelineNode = ({ event }) => {
  const { setSelectedDate } = useStoryStore();

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }} 
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onClick={() => setSelectedDate(event.timestamp)}
      className="relative pl-10 group cursor-pointer"
    >
      {/* Timeline Dot */}
      <div className="absolute left-[15px] top-5 w-3 h-3 rounded-full z-20 transition-all duration-300 bg-blue-500 ring-4 ring-slate-50 group-hover:scale-125 group-hover:ring-blue-100" />

      {/* Date & Summary Card */}
      <div className="relative p-5 rounded-2xl transition-all duration-300 bg-white border border-slate-200 group-hover:border-blue-400 group-hover:shadow-[0_4px_20px_-4px_rgba(59,130,246,0.15)]">
        
        {/* Date Header */}
        <div className="flex items-center gap-2 mb-2">
          <Calendar size={14} className="text-blue-500" />
          <time className="text-xs font-bold tracking-widest text-blue-600 uppercase">
            {event.timestamp}
          </time>
        </div>
        
        <h3 className="text-base font-bold text-slate-900 mb-2 leading-tight">
          {event.title}
        </h3>
        
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
          {event.summary}
        </p>

        {/* Action Hint */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Layers size={12} />
            View Source Articles
          </span>
          <span className="text-blue-600 text-[11px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
            Expand <span className="text-lg leading-none">→</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default TimelineNode;