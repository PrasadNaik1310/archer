import React from 'react';
import { Handle, Position } from 'reactflow';
import { useStoryStore } from '../store/useStoryStore';
import { Layers, Zap, ShieldCheck } from 'lucide-react';

export const GraphNode = ({ data, id }) => {
  // NEW: Pull toggleNode instead of expandNode
  const { toggleNode, openLeafTimeline, expandedNodes, activeLeafId } = useStoryStore();
  
  const isCategory = data.level === 0;
  const isLeaf = !data.hasChildren; 
  const isExpanded = expandedNodes.includes(id);
  const isActiveLeaf = activeLeafId === id;

  const handleClick = (e) => {
    e.stopPropagation();
    if (isLeaf) {
      openLeafTimeline(id);
    } else {
      // NEW: Use toggleNode to open/close
      toggleNode(id);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`group relative flex flex-col items-center transition-all duration-500 cursor-pointer
        ${isActiveLeaf ? 'scale-110' : 'hover:-translate-y-1'}
        /* NEW: Ghost Blur Effect */
        ${data.isGhost ? 'opacity-50 blur-[3px] scale-95 pointer-events-none' : 'opacity-100'}
      `}
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />

      {/* 1. THE MAIN ICON SHAPE */}
      <div 
        className={`relative flex items-center justify-center transition-all duration-300 z-20
          ${isCategory 
            ? 'w-20 h-20 rounded-[1.5rem] bg-[#111827] text-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] text-4xl' 
            : 'w-16 h-16 rounded-full bg-white border border-neutral-200 shadow-sm group-hover:border-neutral-300 group-hover:shadow-md'}
          ${isActiveLeaf ? 'ring-4 ring-[#ccff00]/40 border-neutral-900' : ''}
        `}
      >
        {isCategory && '🏢'}
        {!isCategory && !isLeaf && <Layers size={22} className="text-neutral-400 group-hover:text-neutral-600 transition-colors" />}
        {isLeaf && <Zap size={20} className="text-neutral-400 group-hover:text-neutral-600 transition-colors" />}
      </div>
      
      {/* 2. THE LABEL PANEL */}
      <div className={`mt-3 px-4 py-3 rounded-[1rem] bg-white border transition-all duration-300 flex flex-col items-center justify-center min-w-[160px] max-w-[200px]
        ${isActiveLeaf ? 'border-neutral-900 shadow-md' : 'border-neutral-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] group-hover:border-neutral-200 group-hover:shadow-md'}
      `}>
        <p className="text-[10px] font-extrabold text-neutral-800 uppercase tracking-widest leading-tight text-center">
          {data.label}
        </p>
        
        {isLeaf && (
          <div className={`mt-2.5 flex items-center justify-center gap-1.5 text-[9px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full transition-colors w-full
            ${isActiveLeaf ? 'bg-neutral-900 text-[#ccff00]' : 'bg-[#ccff00] text-neutral-900'}
          `}>
            <ShieldCheck size={10} strokeWidth={3} /> 
            {data.sourceCount || 'N/A'} Sources
          </div>
        )}

        {!isLeaf && !isExpanded && !isCategory && (
          <p className="text-[8px] font-bold text-neutral-300 uppercase tracking-widest mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            Click to Expand
          </p>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
};

export default GraphNode;
