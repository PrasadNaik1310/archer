import { motion, AnimatePresence } from 'framer-motion';
import { useStoryStore } from '../store/useStoryStore';
import { X, Info } from 'lucide-react';
import Badge from '../ui/Badge.jsx';

export const EventDetailDrawer = () => {
  const { selectedEvent, isDrawerOpen, clearSelection } = useStoryStore();

  return (
    <AnimatePresence>
      {isDrawerOpen && selectedEvent && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={clearSelection} 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 cursor-pointer" 
          />
          <motion.div 
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }} 
            className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-950 border-l border-slate-800 z-50 p-8 shadow-2xl overflow-y-auto"
          >
            <button onClick={clearSelection} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
              <X size={20}/>
            </button>
            <div className="mt-8 space-y-6">
              <Badge variant={selectedEvent.sentiment}>{selectedEvent.sentiment} impact</Badge>
              <h2 className="text-2xl font-bold text-white leading-tight">{selectedEvent.title}</h2>
              <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                <div className="flex items-center gap-2 mb-2 text-blue-400">
                  <Info size={14}/>
                  <span className="text-xs font-bold uppercase tracking-wider">AI Synthesis</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{selectedEvent.summary}</p>
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Key Entities Involved</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedEvent.entities.map(e => <Badge key={e}>{e}</Badge>)}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};