import { BaseEdge, getSmoothStepPath } from 'reactflow';

export const GraphEdge = ({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd, label }) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      {label && (
        <foreignObject width={80} height={20} x={labelX - 40} y={labelY - 10} className="overflow-visible pointer-events-none">
          <div className="bg-white border border-slate-200 text-[8px] text-slate-500 px-1 py-0.5 rounded text-center uppercase font-bold shadow-sm">
            {label}
          </div>
        </foreignObject>
      )}
    </>
  );
};