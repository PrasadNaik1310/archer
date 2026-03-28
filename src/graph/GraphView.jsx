import React, { useEffect, useMemo } from 'react';
import ReactFlow, { Background, useReactFlow, ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';

import { GraphNode } from './GraphNode';
import { useStoryStore } from '../store/useStoryStore';

const nodeTypes = { custom: GraphNode };

// Math helper to generate coordinates in a circle around a parent
const generateRadialPositions = (parentNode, childrenNodes, radius = 250) => {
  const angleStep = (2 * Math.PI) / childrenNodes.length;
  
  return childrenNodes.map((child, index) => {
    const angle = index * angleStep - Math.PI / 2; // Start at the top (-90 deg)
    return {
      ...child,
      position: {
        x: parentNode.position.x + radius * Math.cos(angle),
        y: parentNode.position.y + radius * Math.sin(angle),
      }
    };
  });
};

const AnimatedRadialFlow = ({ rawNodes, rawEdges }) => {
  const { fitView, setCenter } = useReactFlow();
  const { activeCategoryId, expandedNodes, activeLeafId } = useStoryStore();

  // 1. DYNAMIC RADIAL LAYOUT CALCULATION
  const { nodes, edges } = useMemo(() => {
    if (!activeCategoryId) return { nodes: [], edges: [] };

    let visibleNodes = [];
    const visibleEdges = [];

    // Find the root category node and anchor it at the center
    const rootNode = rawNodes.find(n => n.id === activeCategoryId);
    if (!rootNode) return { nodes: [], edges: [] };
    
    rootNode.position = { x: 0, y: 0 };
    visibleNodes.push(rootNode);

    // Iteratively place children of expanded nodes
    expandedNodes.forEach(expandedId => {
      const parentNode = visibleNodes.find(n => n.id === expandedId);
      if (!parentNode) return;

      // Find all children for this expanded parent
      const childEdges = rawEdges.filter(e => e.source === expandedId);
      const childNodeIds = childEdges.map(e => e.target);
      const childrenNodes = rawNodes.filter(n => childNodeIds.includes(n.id));

      // Calculate radial positions for these children
      const positionedChildren = generateRadialPositions(
        parentNode, 
        childrenNodes, 
        parentNode.data.level === 0 ? 350 : 200 // Larger radius for main categories
      );

      visibleNodes = [...visibleNodes, ...positionedChildren];
      visibleEdges.push(...childEdges);
    });

    return { nodes: visibleNodes, edges: visibleEdges };
  }, [activeCategoryId, expandedNodes, rawNodes, rawEdges]);

  // 2. CAMERA MOVEMENT LOGIC
  useEffect(() => {
    if (activeLeafId) {
      // If a leaf is clicked, zoom into it. (The wrapper in StoryPage shifts the canvas left)
      const leafNode = nodes.find(n => n.id === activeLeafId);
      if (leafNode) {
        setCenter(leafNode.position.x, leafNode.position.y, { zoom: 1.2, duration: 800 });
      }
    } else if (nodes.length > 0) {
      // Otherwise, keep the whole expanding cluster neatly in view
      fitView({ padding: 0.3, duration: 800 });
    }
  }, [nodes, activeLeafId, fitView, setCenter]);

  return (
    <ReactFlow 
      nodes={nodes} 
      edges={edges.map(e => ({ 
        ...e, 
        animated: true, 
        style: { stroke: '#94a3b8', strokeWidth: 2 } // Light theme edge styling
      }))} 
      nodeTypes={nodeTypes} 
      proOptions={{ hideAttribution: true }}
      minZoom={0.2}
      maxZoom={2}
    >
      {/* Light, professional background grid */}
      <Background color="#cbd5e1" variant="dots" gap={30} size={2} />
    </ReactFlow>
  );
};

export const GraphView = ({ nodes, edges }) => (
  <div className="h-full w-full">
    <ReactFlowProvider>
      <AnimatedRadialFlow rawNodes={nodes} rawEdges={edges} />
    </ReactFlowProvider>
  </div>
);

export default GraphView;