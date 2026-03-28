import React from 'react';
import { BaseEdge, getBezierPath } from 'reactflow';

/**
 * GraphEdge: Custom edge component for the network.
 * Features:
 * - Organic Bezier curves.
 * - Integration with the 'animate-flow-line' CSS animation.
 * - Subtle styling to keep the focus on nodes.
 */
export const GraphEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  animated, // React Flow prop for animation
}) => {
  // 1. Generate the organic Bezier path
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        className={`${animated ? 'animate-flow-line' : ''} transition-all duration-500`}
        style={{
          ...style,
          strokeWidth: 1.5,
          // Using a subtle slate color to match the intelligence theme
          stroke: style.stroke || '#334155', 
          opacity: animated ? 0.8 : 0.3,
          // Ensuring the animation looks like a "data flow"
          strokeDasharray: animated ? '10, 5' : 'none',
        }}
      />
      
      {/* 
          Optional: Secondary glow effect for animated edges 
          This adds a faint "aura" to edges connecting to stories.
      */}
      {animated && (
        <path
          d={edgePath}
          fill="none"
          stroke={style.stroke || '#3b82f6'}
          strokeWidth={4}
          className="opacity-10 blur-sm"
        />
      )}
    </>
  );
};

export default GraphEdge;