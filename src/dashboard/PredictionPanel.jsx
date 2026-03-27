import { Sparkles } from 'lucide-react';

export const PredictionPanel = ({ predictions }) => (
  <div className="space-y-3 mt-4">
    {predictions.map((p, i) => (
      <div key={i} className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg group hover:border-blue-500/30 transition-all">
        <div className="flex items-center gap-2 text-blue-400 mb-1">
          <Sparkles size={12} />
          <span className="text-[10px] font-bold uppercase tracking-wider">{p.title}</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
      </div>
    ))}
  </div>
);

export default PredictionPanel;