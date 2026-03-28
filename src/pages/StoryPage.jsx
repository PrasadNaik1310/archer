import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoryStore } from '../store/useStoryStore';
import { GraphView } from '../graph/GraphView';
import { ArrowLeft, Calendar, FileText, Link as LinkIcon, ShieldCheck } from 'lucide-react';

// IMPORTING THE DATA ENGINE
import { canvasNodes, canvasEdges } from '../data/mockStory';

// ==========================================
// 1. INITIAL CATEGORY SELECTOR (The Starting Point)
// ==========================================
const CategorySelector = () => {
  const { setCategory } = useStoryStore();
  
  const categories = [
    { id: 'cat-corporate', label: 'Corporate Governance', icon: '🏢' },
    { id: 'cat-markets', label: 'Markets & Finance', icon: '📈' },
    { id: 'cat-tech', label: 'Tech & AI', icon: '🚀' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-50"
    >
      <div className="w-full max-w-4xl px-6">
        <h1 className="text-4xl font-light text-slate-800 tracking-tight text-center mb-12">
          Select an Intelligence Cluster
        </h1>
        <div className="grid grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <motion.button 
              key={cat.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { delay: idx * 0.1 } }}
              onClick={() => setCategory(cat.id)}
              className="p-8 bg-white border border-slate-200 rounded-[24px] hover:border-blue-400 hover:shadow-xl transition-all text-left group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">{cat.icon}</div>
              <div className="font-semibold text-slate-800 text-lg leading-tight">{cat.label}</div>
              <div className="text-[10px] text-slate-400 uppercase mt-2 font-bold tracking-widest transition-colors group-hover:text-blue-600">
                Initialize View
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ==========================================
// 2. MAIN STORY PAGE ORCHESTRATOR (THE BRAIN)
// ==========================================
export const StoryPage = () => {
  const { 
    activeCategoryId, 
    activeLeafId, 
    selectedDate, 
    selectedArticle,
    resetAll,
    setSelectedDate,
    setSelectedArticle
  } = useStoryStore();

  return (
    <div className="relative h-screen w-full overflow-hidden bg-slate-50 font-sans text-slate-800">
      
      {/* GLOBAL NAVIGATION (Only visible when a category is active) */}
      <AnimatePresence>
        {activeCategoryId && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute top-6 left-6 z-40"
          >
            <button 
              onClick={resetAll}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md hover:border-slate-300 transition-all text-sm font-medium text-slate-600"
            >
              <ArrowLeft size={16} /> Return to Categories
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CATEGORY SELECTOR LAYER */}
      <AnimatePresence>
        {!activeCategoryId && <CategorySelector />}
      </AnimatePresence>

      {/* BACKGROUND GRAPH LAYER 
        Wired up to the massive mock data. The dynamic radial 
        engine will handle the positioning based on expanded state.
      */}
      <div className={`absolute inset-0 z-0 transition-transform duration-700 ease-in-out ${activeLeafId ? '-translate-x-[20%]' : 'translate-x-0'}`}>
        {activeCategoryId && <GraphView nodes={canvasNodes} edges={canvasEdges} />}
      </div>

      {/* THE INLINE TIMELINE & ARTICLE PANEL 
        Sliding in seamlessly from the right side. No modals!
      */}
      <AnimatePresence>
        {activeLeafId && (
          <motion.div 
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="absolute right-0 top-0 w-1/3 min-w-[450px] h-full bg-white border-l border-slate-200 shadow-2xl z-30 flex flex-col"
          >
            
            {/* PANEL HEADER */}
            <header className="p-8 border-b border-slate-100 bg-slate-50/50">
               <div className="flex justify-between items-start">
                 <div>
                   <h2 className="text-2xl font-bold tracking-tight text-slate-900">Story Timeline</h2>
                   <p className="text-sm text-slate-500 mt-1">Chronological event synthesis</p>
                 </div>
                 {/* Close button strictly returns to the cluster view */}
                 <button 
                   onClick={() => useStoryStore.setState({ activeLeafId: null, selectedDate: null, selectedArticle: null })}
                   className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors text-slate-400 hover:text-slate-600"
                 >
                   <ArrowLeft size={16} className="rotate-180" />
                 </button>
               </div>
            </header>

            {/* PANEL CONTENT (Scrollable) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
              
              {/* STATE A: Show Timeline (Dates) */}
              {!selectedDate && !selectedArticle && (
                <div className="space-y-6">
                   <div className="p-4 border border-slate-200 rounded-xl hover:border-blue-400 cursor-pointer transition-colors group" onClick={() => setSelectedDate("2024-01-24")}>
                      <div className="flex items-center gap-2 text-blue-600 font-bold text-sm mb-2">
                        <Calendar size={14} className="group-hover:scale-110 transition-transform" /> Jan 24, 2024
                      </div>
                      <p className="text-sm text-slate-600">3 articles synthesized regarding initial market movements.</p>
                   </div>
                   <div className="p-4 border border-slate-200 rounded-xl hover:border-blue-400 cursor-pointer transition-colors group" onClick={() => setSelectedDate("2024-02-15")}>
                      <div className="flex items-center gap-2 text-blue-600 font-bold text-sm mb-2">
                        <Calendar size={14} className="group-hover:scale-110 transition-transform" /> Feb 15, 2024
                      </div>
                      <p className="text-sm text-slate-600">5 articles synthesized on regulatory responses.</p>
                   </div>
                </div>
              )}

              {/* STATE B: Show Articles for a Specific Date */}
              {selectedDate && !selectedArticle && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <button onClick={() => setSelectedDate(null)} className="text-sm text-slate-500 hover:text-blue-600 mb-6 flex items-center gap-1 font-medium">
                    ← Back to Timeline
                  </button>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Calendar size={18} className="text-blue-500" /> Events on {selectedDate}
                  </h3>
                  
                  {/* Article List */}
                  <div className="space-y-4">
                    <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white hover:border-slate-300 transition-all cursor-pointer group" onClick={() => setSelectedArticle({ title: "Market Opens Lower", source: "Financial Times" })}>
                      <h4 className="font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">Market Opens Lower Amid Uncertainty</h4>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider flex items-center gap-1">
                        <FileText size={12} /> Financial Times
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* STATE C: Full Article View (Deepest Drill-Down) */}
              {selectedArticle && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <button onClick={() => setSelectedArticle(null)} className="text-sm text-slate-500 hover:text-blue-600 mb-6 flex items-center gap-1 font-medium">
                    ← Back to Articles
                  </button>
                  <h1 className="text-2xl font-bold text-slate-900 leading-tight mb-4">
                    {selectedArticle.title}
                  </h1>
                  
                  {/* HIGH-VISIBILITY SOURCE ATTRIBUTION */}
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
                    <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 text-xs font-bold shadow-sm">
                      <ShieldCheck size={14} /> Verified Data
                    </div>
                  </div>

                  <div className="prose prose-slate prose-sm text-slate-700 leading-relaxed">
                    <p>This is the full text of the article. It loads seamlessly within the existing flow without opening a new tab or a disruptive modal window. The data sources are explicitly tracked and verified to maintain absolute intelligence integrity.</p>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default StoryPage;