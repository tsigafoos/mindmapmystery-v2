import { useEffect } from 'react';
import type { GraphData, WordNode } from '../../types/game';

interface SimulationNode extends WordNode {
  x: number;
  y: number;
  z: number;
}

interface UseForceGraphOptions {
  graphData: GraphData;
  onPositionsUpdate: (nodes: SimulationNode[]) => void;
  isActive: boolean;
}

// Create a proper 3D spherical distribution with depth
function calculate3DPositions(nodes: WordNode[]): SimulationNode[] {
  const centerNode = nodes.find(n => n.id === 'center');
  const otherNodes = nodes.filter(n => n.id !== 'center');
  
  // Sort by strength - strongest closest to center
  const sortedNodes = [...otherNodes].sort((a, b) => b.relationshipStrength - a.relationshipStrength);
  
  return nodes.map((node) => {
    if (node.id === 'center') {
      return { ...node, x: 0, y: 0, z: 0 };
    }
    
    const idx = sortedNodes.findIndex(n => n.id === node.id);
    const total = sortedNodes.length;
    
    // Fibonacci sphere for even distribution
    const phi = Math.acos(1 - 2 * (idx + 0.5) / total);
    const theta = Math.PI * (1 + Math.sqrt(5)) * (idx + 0.5);
    
    // Distance based on strength - 25 to 70 range
    const distance = 25 + (1 - node.relationshipStrength) * 45;
    
    const x = distance * Math.sin(phi) * Math.cos(theta);
    const y = distance * Math.sin(phi) * Math.sin(theta);
    const z = distance * Math.cos(phi);
    
    return {
      ...node,
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
      z: Math.round(z * 10) / 10,
    };
  });
}

export function useForceGraph(options: UseForceGraphOptions) {
  const { graphData, onPositionsUpdate, isActive } = options;

  useEffect(() => {
    if (!isActive) return;

    const nodesWithPositions = calculate3DPositions(graphData.nodes);
    onPositionsUpdate(nodesWithPositions);
    
  }, [graphData.nodes.length, isActive]);
}

export type { SimulationNode };
