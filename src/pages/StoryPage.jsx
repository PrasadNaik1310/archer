import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoryStore } from '../store/useStoryStore';
import { GraphView } from '../graph/GraphView';
import { TimelineView } from '../components/timeline/TimelineView';
import { ArrowLeft, Sparkles, Search, Command, X } from 'lucide-react';

import { canvasNodes, canvasEdges } from '../data/mockStory';

// ==========================================
// 1. CATEGORY SELECTOR (Clean Light Theme)
// ==========================================
const CategorySelector = () => {
  const { setCategory } = useStoryStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  const allCategories = [
    { id: 'cat-corporate', label: 'Corporate Governance', icon: '🏢', desc: 'Board conflicts, ESG, fraud' },
    { id: 'cat-markets', label: 'Markets & Finance', icon: '📈', desc: 'Macro, crypto, IPOs' },
    { id: 'cat-tech', label: 'Tech & AI', icon: '🚀', desc: 'GenAI, chips, cyber' },
    { id: 'cat-geopolitics', label: 'Global Geopolitics', icon: '🌍', desc: 'Elections, trade wars, treaties' },
    { id: 'cat-climate', label: 'Climate & Energy', icon: '🌱', desc: 'Renewables, EV transition' },
    { id: 'cat-health', label: 'Biotech & Health', icon: '🧬', desc: 'Pharma, digital health, FDA' },
    { id: 'cat-consumer', label: 'Consumer Trends', icon: '🛍️', desc: 'Retail, e-commerce, shifting habits' },
    { id: 'cat-media', label: 'Media & Entertainment', icon: '🎬', desc: 'Streaming wars, social media' },
  ];

  const filteredCategories = allCategories.filter(cat => 
    cat.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
    cat.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#f3f3f1]"
    >
      <div className="w-full max-w-5xl px-6 relative z-10 flex flex-col items-center pt-10">
        
        {/* Highlighted Heading */}
        <h1 className="text-4xl md:text-5xl font-medium text-neutral-900 tracking-tight text-center mb-10 leading-tight">
          What are we <span className="relative inline-block">
            <span className="relative z-10 font-bold">investigating</span>
            {/* The marker-like highlight behind the text */}
            <span className="absolute bottom-2 left-0 w-full h-4 bg-[#dbff00]/60 -z-10 rounded-sm" />
          </span> today?
        </h1>
        
        {/* Crisp White Search Bar */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
          className="relative w-full max-w-2xl mb-12 group"
        >
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search className="w-6 h-6 text-neutral-400 group-focus-within:text-neutral-900 transition-colors" />
          </div>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search to find a cluster..."
            className="w-full py-5 pl-16 pr-16 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] text-lg text-neutral-900 font-medium focus:outline-none focus:ring-4 focus:ring-[#dbff00]/40 transition-all placeholder:text-neutral-400 placeholder:font-normal"
          />
          <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
            <div className="flex items-center gap-1 text-neutral-500 bg-neutral-100 px-3 py-1.5 rounded-lg text-xs font-bold">
              <Command size={14} /> K
            </div>
          </div>
        </motion.div>

        {/* Thick, rounded White Category Cards */}
        <div className="w-full max-w-4xl max-h-[45vh] overflow-y-auto custom-scrollbar px-2 pb-8">
          {filteredCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence>
                {filteredCategories.map((cat, idx) => (
                  <motion.button 
                    layout
                    key={cat.id}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1, transition: { delay: idx * 0.05 } }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={() => setCategory(cat.id)}
                    className="flex flex-col items-start p-6 rounded-[2rem] transition-all duration-300 text-left group bg-white text-neutral-900 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1"
                  >
                    <div className="text-4xl w-14 h-14 flex items-center justify-center rounded-2xl mb-4 group-hover:scale-110 transition-transform bg-[#f3f3f1]">
                      {cat.icon}
                    </div>
                    <div className="font-bold text-lg leading-tight mb-1">{cat.label}</div>
                    <div className="text-xs font-medium text-neutral-500">
                      {cat.desc}
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <Sparkles className="w-10 h-10 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500 font-medium text-lg">No clusters found for "{searchQuery}"</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ==========================================
// 2. MAIN STORY PAGE ORCHESTRATOR
// ==========================================
export const StoryPage = () => {
  const { activeCategoryId, activeLeafId, resetAll } = useStoryStore();

  const handleCloseModal = () => {
    useStoryStore.setState({ activeLeafId: null, selectedDate: null, selectedArticle: null });
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#f3f3f1] font-sans text-neutral-900">
      
      {/* Return Navigation */}
      <AnimatePresence>
        {activeCategoryId && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute top-6 left-6 z-40"
          >
            <button 
              onClick={resetAll}
              className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-full shadow-sm hover:shadow-md hover:bg-[#dbff00] transition-colors duration-300 text-sm font-bold text-neutral-900 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
              Categories
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!activeCategoryId && <CategorySelector />}
      </AnimatePresence>

      {/* BACKGROUND GRAPH LAYER */}
      <motion.div 
        animate={{ 
          scale: activeLeafId ? 0.95 : 1, 
          filter: activeLeafId ? 'blur(8px)' : 'blur(0px)',
          opacity: activeLeafId ? 0.5 : 1
        }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }} 
        className="absolute inset-0 z-0"
      >
        {activeCategoryId && <GraphView nodes={canvasNodes} edges={canvasEdges} />}
      </motion.div>

      {/* CENTERED MODAL OVERLAY */}
      <AnimatePresence>
        {activeLeafId && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 sm:p-8 pointer-events-none">
            
            {/* Soft Gray/Transparent Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-neutral-900/10 backdrop-blur-sm pointer-events-auto"
            />

            {/* The Floating White Window */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 28, stiffness: 250 }}
              className="relative w-full max-w-4xl h-[85vh] bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col pointer-events-auto overflow-hidden ring-1 ring-black/5"
            >
              
              <button 
                onClick={handleCloseModal}
                className="absolute top-6 right-6 p-3 bg-[#f3f3f1] hover:bg-[#dbff00] rounded-full text-neutral-600 hover:text-neutral-900 transition-colors z-20"
              >
                <X size={20} strokeWidth={3} />
              </button>

              <header className="px-12 pt-12 pb-6 border-b border-neutral-100 bg-white/90 backdrop-blur-md sticky top-0 z-10">
                <div className="pr-12">
                  <h2 className="text-3xl font-bold tracking-tight text-neutral-900">Intelligence Report</h2>
                  <p className="text-sm text-neutral-500 mt-1 font-medium">Synthesized chronological events</p>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto custom-scrollbar px-12 py-8">
                <div className="max-w-2xl mx-auto">
                  <TimelineView />
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default StoryPage;