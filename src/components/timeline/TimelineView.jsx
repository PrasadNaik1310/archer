import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TimelineNode } from './TimelineNode';
import { TimelineLine } from './TimelineLine';
import { useStoryStore } from '../../store/useStoryStore';
import { storyDatabase } from '../../data/mockStory';
import { Calendar, FileText, Link as LinkIcon, ArrowLeft, ShieldCheck } from 'lucide-react';

export const TimelineView = () => {
  const { activeLeafId, selectedDate, selectedArticle, setSelectedDate, setSelectedArticle } = useStoryStore();
  
  // Fetch timeline data from mock database
  const storyData = activeLeafId ? storyDatabase[activeLeafId] : null;
  const events = storyData?.timeline || [];

  // Mock articles for when a date is clicked (In production, filter by selectedDate)
  const mockArticles = [
    { id: 1, title: "Initial Market Reaction to Regulatory Shifts", source: "Financial Times", time: "09:30 AM" },
    { id: 2, title: "Board Members Issue Joint Statement", source: "Bloomberg", time: "14:15 PM" },
    { id: 3, title: "Analysis: Long-term impact on shareholder value", source: "Reuters", time: "18:45 PM" }
  ];

  if (!events.length) return null;

  return (
    <div className="relative w-full pb-24">
      <AnimatePresence mode="wait">
        
        {/* STATE 1: THE TIMELINE (List of Dates) */}
        {!selectedDate && !selectedArticle && (
          <motion.div 
            key="timeline"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="relative space-y-8"
          >
            <TimelineLine />
            {events.map((event) => (
              <TimelineNode key={event.id} event={event} />
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
              className="mb-8 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft size={16} /> Return to Timeline
            </button>
            
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Calendar size={20} className="text-blue-500" /> 
              Articles published on {selectedDate}
            </h3>

            <div className="space-y-4">
              {mockArticles.map((article) => (
                <div 
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="p-5 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
                >
                  <h4 className="font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h4>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <FileText size={14} className="text-slate-400" /> {article.source}
                    </span>
                    <span>{article.time}</span>
                  </div>
                </div>
              ))}
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
              className="mb-8 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft size={16} /> Back to Date Articles
            </button>
            
            <h1 className="text-3xl font-bold text-slate-900 leading-tight mb-6">
              {selectedArticle.title}
            </h1>

            {/* SOURCE ATTRIBUTION BAR (Required for professional transparency) */}
            <div className="flex items-center justify-between p-4 bg-slate-100 border border-slate-200 rounded-xl mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <LinkIcon size={14} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Source</p>
                  <p className="text-sm font-bold text-slate-800">{selectedArticle.source}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 text-xs font-bold">
                <ShieldCheck size={14} /> Verified
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-6">
              <p>This is the synthesized intelligence report corresponding to the selected timeline event. The text loads inline, maintaining the continuous flow of the application without relying on external tabs or intrusive modal overlays.</p>
              <p>By keeping the user anchored to the main canvas, they can easily step backward through the flow—from Article to Date to Timeline to Cluster—without losing their context.</p>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default TimelineView;