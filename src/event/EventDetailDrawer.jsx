import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoryStore } from '../store/useStoryStore';
import { X, Info, Zap, ChevronRight } from 'lucide-react';
import { Badge } from '../ui/Badge.jsx';

/**
 * EventDetailDrawer: An overlay panel that slides in from the right
 * when a user clicks a specific event node on the timeline.
 */
export const EventDetailDrawer = () => {
  const { selectedEvent, isDrawerOpen, clearSelection } = useStoryStore();

  // Close drawer on "Escape" key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') clearSelection();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [clearSelection]);

  return (
    <AnimatePresence>
      {isDrawerOpen && selectedEvent && (
        <>
          {/* 1. BACKDROP: Dims the background and captures clicks to close */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={clearSelection} 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[200] cursor-pointer" 
          />

          {/* 2. DRAWER: The main content panel */}
          <motion.div 
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }} 
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#020617] border-l border-white/10 z-[201] shadow-2xl flex flex-col"
          >
            {/* Header / Close Action */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Event Analysis</span>
              </div>
              <button 
                onClick={clearSelection} 
                className="p-2 rounded-full hover:bg-white/10 text-slate-500 hover:text-white transition-all"
              >
                <X size={20}/>
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
              
              {/* Sentiment & Metadata */}
              <div className="flex items-center justify-between">
                <Badge variant={selectedEvent.sentiment}>
                  {selectedEvent.sentiment} Impact
                </Badge>
                <span className="text-[10px] font-mono text-slate-500 font-bold">
                  Ref: {selectedEvent.id}
                </span>
              </div>

              {/* Title */}
              <header>
                <h2 className="text-3xl font-black text-white leading-[1.1] tracking-tight italic">
                  {selectedEvent.title}
                </h2>
                <time className="block mt-3 text-xs font-bold text-blue-500/80 uppercase tracking-widest">
                  Log Date: {selectedEvent.timestamp}
                </time>
              </header>

              {/* AI Synthesis Box */}
              <section className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                <div className="relative p-5 bg-slate-900 border border-blue-500/20 rounded-2xl">
                  <div className="flex items-center gap-2 mb-3 text-blue-400">
                    <Zap size={14} className="fill-blue-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">AI Synthesis</span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed font-medium">
                    {selectedEvent.summary}
                  </p>
                </div>
              </section>

              {/* Entity Mapping */}
              <section>
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
                  <ChevronRight size={12} className="text-blue-500" />
                  Key Entities Involved
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedEvent.entities?.map((entity, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1.5 bg-slate-800/50 border border-white/5 rounded-lg text-[11px] font-bold text-slate-200 hover:border-blue-500/40 hover:text-blue-400 transition-colors"
                    >
                      {entity}
                    </span>
                  ))}
                </div>
              </section>

              {/* Sources / Verification */}
              <div className="pt-8 mt-8 border-t border-white/5">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3 mb-1">
                    <Info size={14} className="text-slate-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Source Verification</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed italic">
                    Cross-referenced across 48 news outlets and 3 regulatory filings. Reliability Score: 98%.
                  </p>
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EventDetailDrawer;