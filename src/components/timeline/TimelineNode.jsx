import { motion } from 'framer-motion';
import { useStoryStore } from '../../store/useStoryStore';

export const TimelineNode = ({ event }) => {
  const { setSelectedEvent, setDrawerOpen, selectedEvent } = useStoryStore();
  const isActive = selectedEvent?.id === event.id;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }} 
      whileInView={{ opacity: 1, x: 0 }}
      onClick={() => { setSelectedEvent(event); setDrawerOpen(true); }}
      className="relative pl-10 group cursor-pointer"
    >
      <div className={`absolute left-[11px] top-1.5 w-2.5 h-2.5 rounded-full z-10 transition-all duration-300 ${
        event.sentiment === 'negative' ? 'bg-red-500' : 'bg-emerald-500'
      } ${isActive ? 'scale-150 ring-4 ring-[#020617]' : 'ring-2 ring-[#020617]'}`} />
      
      <div className={`p-4 rounded-xl transition-all duration-300 ${
        isActive ? 'bg-slate-800/80 border-blue-500 shadow-lg' : 'bg-slate-900/50 border-slate-800 hover:border-slate-600'
      } border`}>
        <time className="text-[10px] font-mono text-slate-500">{event.timestamp}</time>
        <h3 className={`text-sm font-bold mt-1 ${isActive ? 'text-blue-400' : 'text-white'}`}>{event.title}</h3>
        <p className="text-xs text-slate-400 mt-2 line-clamp-2">{event.summary}</p>
      </div>
    </motion.div>
  );
};