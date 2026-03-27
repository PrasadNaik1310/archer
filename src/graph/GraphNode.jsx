import { Handle, Position } from 'reactflow';
import { useStoryStore } from '../store/useStoryStore';

export const GraphNode = ({ data }) => {
  const { activeEntities } = useStoryStore();
  
  // 1. Is this a node inside the inner Entity Map? (Companies, People, etc.)
  const isEntityMap = ['company', 'person', 'org', 'regulator'].includes(data.type);
  
  // Highlight logic for the Entity Map
  const isHighlighting = activeEntities.length > 0;
  const isTarget = activeEntities.includes(data.label);
  const opacityClass = (isEntityMap && isHighlighting && !isTarget) ? 'opacity-30 grayscale' : 'opacity-100';
  const glowClass = (isEntityMap && isTarget) ? 'ring-2 ring-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)] scale-105' : '';

  // 2. Dynamic Styles based on what kind of bubble this is
  let nodeStyle = "";
  if (data.type === 'category') {
    // Massive, clean hub nodes
    nodeStyle = "px-8 py-4 bg-white border-2 border-slate-200 rounded-full shadow-sm";
  } else if (data.type === 'topic') {
    // Subtopic pills
    nodeStyle = "px-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm";
  } else if (data.isStory) {
    // The clickable leaf nodes (Stories) - Given a blue tint to show interactivity
    nodeStyle = "px-6 py-4 bg-blue-50 border-2 border-blue-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group";
  } else {
    // Default Entity Cards (The relationship map)
    nodeStyle = "px-4 py-3 bg-white border border-slate-200 rounded-lg shadow-sm";
  }

  return (
    <div className={`transition-all duration-500 text-center ${nodeStyle} ${opacityClass} ${glowClass}`}>
      {/* Invisible Handles so the lines can connect */}
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-none" />
      
      {/* Small label for entities only (e.g., 'COMPANY' or 'PERSON') */}
      {isEntityMap && (
        <p className="text-[8px] uppercase text-slate-400 font-bold tracking-widest">{data.type}</p>
      )}
      
      {/* Main Title */}
      <p className={`font-bold mt-1 ${data.type === 'category' ? 'text-lg text-slate-800' : data.isStory ? 'text-blue-800' : 'text-sm text-slate-700'}`}>
        {data.label}
      </p>

      {/* Call to action text that appears when hovering over a Story Node */}
      {data.isStory && (
        <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          Explore Story →
        </p>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-none" />
    </div>
  );
};