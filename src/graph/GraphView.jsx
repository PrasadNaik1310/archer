import React, { useEffect, useMemo, useState } from 'react';
import ReactFlow, { Background, useReactFlow, ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';

import { GraphNode } from './GraphNode';
import { useStoryStore } from '../store/useStoryStore';

const nodeTypes = { custom: GraphNode };

const generateRadialPositions = (parentNode, childrenNodes, radius) => {
  const angleStep = (2 * Math.PI) / childrenNodes.length;
  return childrenNodes.map((child, index) => {
    const angle = index * angleStep - Math.PI / 2;
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
  
  // NEW: Track which node is currently being hovered
  const [hoveredNodeId, setHoveredNodeId] = useState(null);

  const { nodes, edges } = useMemo(() => {
    if (!activeCategoryId) return { nodes: [], edges: [] };

    let visibleNodes = [];
    const visibleEdges = [];
    const processedParents = new Set(); // Prevent duplicates

    const rootNode = rawNodes.find(n => n.id === activeCategoryId);
    if (!rootNode) return { nodes: [], edges: [] };
    
    visibleNodes.push({ ...rootNode, position: { x: 0, y: 0 } });

    // Helper function to process children dynamically
    const processNodeChildren = (parentId, isGhost) => {
      if (processedParents.has(parentId)) return;
      
      const parentNode = visibleNodes.find(n => n.id === parentId);
      if (!parentNode) return;

      const childEdges = rawEdges.filter(e => e.source === parentId);
      const childNodeIds = childEdges.map(e => e.target);
      const childrenNodes = rawNodes.filter(n => childNodeIds.includes(n.id));

      if (childrenNodes.length > 0) {
        const dynamicRadius = Math.max(120, 350 - (parentNode.data.level * 100));
        const positionedChildren = generateRadialPositions(parentNode, childrenNodes, dynamicRadius);
        
        positionedChildren.forEach(child => {
          visibleNodes.push({ ...child, data: { ...child.data, isGhost } });
        });

        childEdges.forEach(edge => {
          visibleEdges.push({ ...edge, data: { ...edge.data, isGhost } });
        });
      }
      processedParents.add(parentId);
    };

    // 1. Process all permanently clicked/expanded nodes
    expandedNodes.forEach(id => processNodeChildren(id, false));

    // 2. NEW: Process the hovered node to generate ghost previews
    if (hoveredNodeId && !expandedNodes.includes(hoveredNodeId)) {
      processNodeChildren(hoveredNodeId, true);
    }

    // Inject dynamic leaf detection
    const finalNodes = visibleNodes.map(node => ({
      ...node,
      data: { 
        ...node.data, 
        hasChildren: rawEdges.some(e => e.source === node.id) 
      }
    }));

    return { nodes: finalNodes, edges: visibleEdges };
  }, [activeCategoryId, expandedNodes, rawNodes, rawEdges, hoveredNodeId]);

  useEffect(() => {
    if (activeLeafId) {
      const leafNode = nodes.find(n => n.id === activeLeafId);
      if (leafNode) {
        setCenter(leafNode.position.x, leafNode.position.y, { zoom: 1.2, duration: 800 });
      }
    } else if (nodes.length > 0) {
      const timer = setTimeout(() => {
        fitView({ padding: 0.4, duration: 800 });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [nodes.length, activeLeafId, fitView, setCenter]);

  return (
    <ReactFlow 
      nodes={nodes} 
      edges={edges.map(e => ({ 
        ...e, 
        animated: true, 
        style: { 
          stroke: '#737373', 
          strokeWidth: 2,
          // Fade out the connecting lines for ghost nodes
          opacity: e.data?.isGhost ? 0.2 : 1,
          transition: 'opacity 0.3s ease'
        } 
      }))} 
      nodeTypes={nodeTypes} 
      proOptions={{ hideAttribution: true }}
      minZoom={0.1}
      maxZoom={2}
      // NEW: Mouse events to trigger the blur effect
      onNodeMouseEnter={(_, node) => setHoveredNodeId(node.id)}
      onNodeMouseLeave={() => setHoveredNodeId(null)}
    >
      <Background color="#d4d4d4" variant="dots" gap={40} size={2} className="opacity-60" />
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