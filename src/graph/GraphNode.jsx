import React from 'react';
import { Handle, Position } from 'reactflow';
import { useStoryStore } from '../store/useStoryStore';
import { Layers, Zap, ShieldCheck } from 'lucide-react';

export const GraphNode = ({ data, id }) => {
  const { expandNode, openLeafTimeline, expandedNodes, activeLeafId } = useStoryStore();
  
  const isCategory = data.level === 0;
  const isLeaf = data.isLeaf;
  const isExpanded = expandedNodes.includes(id);
  const isActiveLeaf = activeLeafId === id;

  const handleClick = (e) => {
    e.stopPropagation();
    if (isLeaf) {
      openLeafTimeline(id); // Opens the timeline in the same flow
    } else {
      expandNode(id); // Sprouts the child nodes radially
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`group relative flex flex-col items-center transition-all duration-500 cursor-pointer
        ${isActiveLeaf ? 'scale-110' : 'hover:scale-105'}
      `}
    >
      {/* Invisible target handle for incoming lines */}
      <Handle type="target" position={Position.Top} className="opacity-0" />
      
      {/* 1. THE NODE BUBBLE */}
      <div 
        className={`flex items-center justify-center rounded-full shadow-lg transition-all duration-300 border-2
          ${isCategory 
            ? 'w-24 h-24 bg-white border-blue-500 text-3xl z-20 shadow-blue-500/20' 
            : isLeaf 
              ? 'w-16 h-16 bg-slate-50 border-emerald-500 z-10 hover:bg-emerald-50' 
              : 'w-20 h-20 bg-white border-slate-300 z-10 hover:border-blue-400'}
          ${isActiveLeaf ? 'ring-4 ring-emerald-500/30' : ''}
        `}
      >
        {isCategory && '🏢'}
        {!isCategory && !isLeaf && <Layers size={24} className="text-slate-400 group-hover:text-blue-500 transition-colors" />}
        {isLeaf && <Zap size={20} className="text-emerald-500" />}
      </div>
      
      {/* 2. THE LABEL PANEL */}
      <div className={`mt-3 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm text-center min-w-[120px] transition-all duration-300 group-hover:shadow-md
        ${isActiveLeaf ? 'border-emerald-500 bg-emerald-50' : ''}
      `}>
        <p className="text-xs font-bold text-slate-800 uppercase tracking-wider leading-tight">
          {data.label}
        </p>
        
        {/* Source Verification Badge for Leaf Nodes */}
        {isLeaf && (
          <div className="mt-1.5 flex items-center justify-center gap-1 text-[9px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full">
            <ShieldCheck size={10} /> 
            {data.sourceCount || 12} Sources
          </div>
        )}

        {/* Expand prompt for branches */}
        {!isLeaf && !isExpanded && (
          <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 group-hover:text-blue-500">
            Click to Expand
          </p>
        )}
      </div>

      {/* Invisible source handle for outgoing lines */}
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
};

export default GraphNode;