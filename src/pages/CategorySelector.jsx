import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoryStore } from '../store/useStoryStore';
import { Sparkles, Search, Command } from 'lucide-react';

export const CategorySelector = () => {
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
        
        <h1 className="text-4xl md:text-5xl font-medium text-neutral-900 tracking-tight text-center mb-10 leading-tight">
          What are we <span className="relative inline-block">
            <span className="relative z-10 font-bold">investigating</span>
            <span className="absolute bottom-2 left-0 w-full h-4 bg-[#dbff00]/60 -z-10 rounded-sm" />
          </span> today?
        </h1>
        
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

export default CategorySelector;