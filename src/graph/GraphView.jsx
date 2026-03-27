import React, { useEffect, useMemo } from 'react';
import ReactFlow, { Background, Controls, ReactFlowProvider, useReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';
import { GraphNode } from './GraphNode';
import { GraphEdge } from './GraphEdge';
import { useStoryStore } from '../store/useStoryStore';

// DEFINED OUTSIDE COMPONENT TO FIX REACT FLOW WARNING
const nodeTypes = { entity: GraphNode, category: GraphNode, topic: GraphNode, story: GraphNode };
const edgeTypes = { default: GraphEdge };

// Inner component that handles the camera
const AnimatedFlow = ({ nodes, edges }) => {
  const { fitView, setCenter } = useReactFlow();
  const { openStory, activeStoryId } = useStoryStore();

  // Animate the camera whenever the nodes change (e.g., from Category Map to Entity Map)
  useEffect(() => {
    setTimeout(() => {
      // If a story is open, we pad the view so it fits nicely on the right side of the screen
      const padding = activeStoryId ? 0.3 : 0.5;
      fitView({ duration: 1200, padding, maxZoom: 1.2 });
    }, 50);
  }, [nodes, activeStoryId, fitView]);

  const handleNodeClick = (event, node) => {
    // If they click a leaf node (Story), open it!
    if (node.data?.isStory && node.data?.storyId) {
      openStory(node.data.storyId);
    } else {
      // Otherwise, just gently zoom to the category/topic they clicked
      setCenter(node.position.x, node.position.y, { duration: 800, zoom: 1.2 });
    }
  };

  return (
    <ReactFlow 
      nodes={nodes} 
      edges={edges} 
      nodeTypes={nodeTypes} 
      edgeTypes={edgeTypes} 
      onNodeClick={handleNodeClick}
      proOptions={{ hideAttribution: true }}
    >
      <Background color="#cbd5e1" gap={20} size={1} />
      <Controls className="bg-white border-slate-200 shadow-sm" showInteractive={false} />
    </ReactFlow>
  );
};

// Wrapper required by React Flow for the camera hooks
export const GraphView = (props) => (
  <div className="h-full w-full bg-slate-50">
    <ReactFlowProvider>
      <AnimatedFlow {...props} />
    </ReactFlowProvider>
  </div>
);