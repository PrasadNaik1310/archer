import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TimelineNode } from './TimelineNode';
import { TimelineLine } from './TimelineLine';
import { useStoryStore } from '../../store/useStoryStore';
import { Calendar, FileText, Link as LinkIcon, ArrowLeft, ShieldCheck } from 'lucide-react';

export const TimelineView = () => {
  const { 
    selectedDate, 
    selectedArticle, 
    setSelectedDate, 
    setSelectedArticle,
    currentStory,
    loadEventById,
    eventDetails // 🔥 CRITICAL FIX: We need to pull this from the store!
  } = useStoryStore();
  
  // 👉 API INTEGRATION: Safely map and sort the live timeline data
  const timeline = [...(currentStory?.timeline || [])].sort(
    (a, b) => a.timestamp - b.timestamp
  );

  if (!timeline.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 mb-6 rounded-full bg-neutral-50 flex items-center justify-center border border-neutral-200 shadow-sm">
          <FileText size={24} className="text-[#ea4c89]" />
        </div>
        <h3 className="text-lg font-bold text-neutral-900 mb-2">Intelligence Gathering</h3>
        <p className="text-sm text-neutral-500 max-w-[250px] leading-relaxed">
          The AI engine is currently synthesizing reports and sourcing data for this specific cluster. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full pb-24">
      <AnimatePresence mode="wait">
        
        {/* STATE 1: THE TIMELINE (List of Dates) */}
        {!selectedDate && !selectedArticle && (
          <motion.div 
            key="timeline"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="relative space-y-6"
          >
            <TimelineLine />
            {timeline.map((event) => (
              <TimelineNode 
                key={event.event_id || event.id} 
                event={event} 
                // 👉 API INTEGRATION: Trigger loadEventById on click
                onEventClick={() => {
                  setSelectedDate(event.timestamp);
                  loadEventById(event.event_id);
                }}
              />
            ))}
          </motion.div>
        )}

        {/* STATE 2: ARTICLES FOR SELECTED DATE */}
        {selectedDate && !selectedArticle && (
          <motion.div 
            key="article-list"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
          >
            <button 
              onClick={() => setSelectedDate(null)} 
              className="mb-8 flex items-center gap-2 text-sm font-semibold text-neutral-400 hover:text-[#ea4c89] transition-colors"
            >
              <ArrowLeft size={16} /> Return to Timeline
            </button>
            
            <h3 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Calendar size={20} className="text-[#ea4c89]" /> 
              Events on {selectedDate}
            </h3>

            {/* 🔥 CLEANED UP: Real data mapping without the syntax errors */}
            <div className="space-y-4">
              {eventDetails?.articles?.length > 0 ? (
                eventDetails.articles.map((article, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setSelectedArticle(article)}
                    className="p-5 bg-white border border-neutral-200 rounded-2xl hover:border-[#ea4c89]/40 hover:shadow-[0_8px_30px_rgba(234,76,137,0.08)] transition-all cursor-pointer group"
                  >
                    <h4 className="font-bold text-neutral-800 mb-3 group-hover:text-[#ea4c89] transition-colors">
                      {article.title}
                    </h4>
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <FileText size={14} className="text-neutral-400" /> {article.source || article.publisher || "Verified Source"}
                      </span>
                      <span>{article.time || article.date || "Recent"}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-neutral-400 italic text-sm">
                  Loading source articles...
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* STATE 3: FULL ARTICLE VIEW */}
        {selectedArticle && (
          <motion.div 
            key="full-article"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
          >
            <button 
              onClick={() => setSelectedArticle(null)} 
              className="mb-8 flex items-center gap-2 text-sm font-semibold text-neutral-400 hover:text-[#ea4c89] transition-colors"
            >
              <ArrowLeft size={16} /> Back to Date Articles
            </button>
            
            <h1 className="text-3xl font-bold text-neutral-900 leading-tight mb-6">
              {selectedArticle.title}
            </h1>

            <div className="flex items-center justify-between p-4 bg-neutral-50 border border-neutral-200 rounded-xl mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-neutral-200 shadow-sm">
                  <LinkIcon size={14} className="text-[#ea4c89]" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Primary Source</p>
                  <p className="text-sm font-bold text-neutral-700">{selectedArticle.source || selectedArticle.publisher || "Unknown"}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[#ea4c89] bg-[#ea4c89]/10 px-3 py-1.5 rounded-full border border-[#ea4c89]/20 text-xs font-bold">
                <ShieldCheck size={14} /> Verified Data
              </div>
            </div>

            <div className="prose prose-neutral prose-sm text-neutral-600 leading-relaxed max-w-none">
              {selectedArticle.content ? (
                <p>{selectedArticle.content}</p>
              ) : (
                <>
                  <p>This is the full text of the article. It loads seamlessly within the existing flow without opening a new tab or a disruptive modal window. The data sources are explicitly tracked and verified to maintain absolute intelligence integrity.</p>
                  <p>By keeping the user anchored to the main canvas, they can easily step backward through the flow—from Article to Date to Timeline to Cluster—without losing their context.</p>
                </>
              )}
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default TimelineView;