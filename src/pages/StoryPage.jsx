import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoryStore } from '../store/useStoryStore';
import { StoryDashboard } from '../dashboard/StoryDashboard';
import { TimelineView } from '../components/timeline/TimelineView';
import { GraphView } from '../graph/GraphView';
import { EventDetailDrawer } from '../event/EventDetailDrawer';
import { canvasNodes, canvasEdges, storyDatabase } from '../data/mockStory';

const StoryPage = () => {
  // Pulling state from the 'Brain' (Zustand Store)
  const { activeStoryId, closeStory } = useStoryStore();
  
  // Logic: Which data are we currently looking at?
  const currentStoryData = activeStoryId ? storyDatabase[activeStoryId] : null;
  
  // Spatial Logic: If a story is open, morph the background into that story's Entity Map.
  // Otherwise, stay on the high-level Category/Cluster galaxy.
  const displayNodes = currentStoryData ? currentStoryData.nodes : canvasNodes;
  const displayEdges = currentStoryData ? currentStoryData.edges : canvasEdges;

  // Ensure we start with a clean, zoomed-out view on initial load
  useEffect(() => {
    closeStory();
  }, [closeStory]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-slate-50 font-sans">
      
      {/* LAYER 1: The Infinite Canvas (Always Background) */}
      <div className="absolute inset-0 z-0">
        <GraphView nodes={displayNodes} edges={displayEdges} />
      </div>

      {/* LAYER 2: Professional Story Overlays (Visible only when activeStoryId exists) */}
      <AnimatePresence>
        {activeStoryId && currentStoryData && (
          <div className="absolute inset-0 z-10 flex pointer-events-none">
            
            {/* Left Column: Intelligence Dashboard */}
            <motion.aside 
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="w-[360px] h-full border-r border-slate-200 bg-white/90 backdrop-blur-md flex flex-col pointer-events-auto shadow-2xl"
            >
              {/* Professional Zoom-Out Navigation */}
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <button 
                  onClick={closeStory} 
                  className="w-full py-2.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/50 transition-all uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm"
                >
                  ← Return to Global Map
                </button>
              </div>

              <div className="flex-1 overflow-hidden">
                <StoryDashboard data={currentStoryData} />
              </div>
            </motion.aside>
            
            {/* Middle Column: Chronological Timeline */}
            <motion.main 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 150, delay: 0.1 }}
              className="w-[500px] h-full overflow-y-auto px-10 py-12 custom-scrollbar border-r border-slate-200 bg-white/60 backdrop-blur-sm pointer-events-auto shadow-sm"
            >
              <div className="max-w-md mx-auto">
                <header className="mb-12">
                   <span className="text-[10px] font-mono text-blue-600 uppercase tracking-[0.4em] font-black">
                     Intelligence Stream
                   </span>
                   <h1 className="text-3xl font-black text-slate-900 mt-3 tracking-tight">
                     Timeline
                   </h1>
                </header>
                <TimelineView events={currentStoryData.timeline} />
              </div>
            </motion.main>

            {/* Note: The Right side is left empty so the Entity Graph (Background) remains visible */}
          </div>
        )}
      </AnimatePresence>

      {/* LAYER 3: The Event Synthesis Drawer (Always Topmost) */}
      <div className="z-50 pointer-events-auto">
        <EventDetailDrawer />
      </div>
      
    </div>
  );
};

export default StoryPage;