/**
 * Graph Data Hook
 * Manages 3D force graph data and transformations
 */

import { useState, useCallback, useMemo } from 'react';
import type { GraphData, WordNode, GraphLink, GraphNodeObject } from '../types/game';

interface UseGraphDataOptions {
  initialData: GraphData;
}

interface UseGraphDataReturn {
  data: GraphData;
  revealedNodes: WordNode[];
  unrevealedNodes: WordNode[];
  revealNode: (nodeId: string) => void;
  updateNodePosition: (nodeId: string, x: number, y: number, z: number) => void;
  getNodeById: (nodeId: string) => WordNode | undefined;
  isNodeRevealed: (nodeId: string) => boolean;
}

export function useGraphData(options: UseGraphDataOptions): UseGraphDataReturn {
  const { initialData } = options;

  const [data, setData] = useState<GraphData>(initialData);

  // Reveal a node
  const revealNode = useCallback((nodeId: string) => {
    setData((prev) => {
      const nodeIndex = prev.nodes.findIndex((n) => n.id === nodeId);
      if (nodeIndex === -1) return prev;

      const updatedNodes = [...prev.nodes];
      updatedNodes[nodeIndex] = {
        ...updatedNodes[nodeIndex],
        isRevealed: true,
      };

      return {
        ...prev,
        nodes: updatedNodes,
      };
    });
  }, []);

  // Update node position (called by force graph simulation)
  const updateNodePosition = useCallback((nodeId: string, x: number, y: number, z: number) => {
    setData((prev) => {
      const nodeIndex = prev.nodes.findIndex((n) => n.id === nodeId);
      if (nodeIndex === -1) return prev;

      const updatedNodes = [...prev.nodes];
      updatedNodes[nodeIndex] = {
        ...updatedNodes[nodeIndex],
        x,
        y,
        z,
      } as GraphNodeObject;

      return {
        ...prev,
        nodes: updatedNodes,
      };
    });
  }, []);

  // Get node by ID
  const getNodeById = useCallback((nodeId: string) => {
    return data.nodes.find((n) => n.id === nodeId);
  }, [data.nodes]);

  // Check if node is revealed
  const isNodeRevealed = useCallback((nodeId: string) => {
    const node = getNodeById(nodeId);
    return node?.isRevealed ?? false;
  }, [getNodeById]);

  // Computed lists
  const revealedNodes = useMemo(() => {
    return data.nodes.filter((n) => n.isRevealed && n.id !== 'center');
  }, [data.nodes]);

  const unrevealedNodes = useMemo(() => {
    return data.nodes.filter((n) => !n.isRevealed && n.id !== 'center');
  }, [data.nodes]);

  return {
    data,
    revealedNodes,
    unrevealedNodes,
    revealNode,
    updateNodePosition,
    getNodeById,
    isNodeRevealed,
  };
}

/**
 * Transform game nodes to 3D force graph format
 */
export function transformToGraphData(
  nodes: WordNode[],
  centerWord: string
): GraphData {
  // Add center node at origin
  const graphNodes: GraphNodeObject[] = [
    {
      id: 'center',
      word: centerWord,
      relationshipStrength: 1,
      isRevealed: false,
      color: 'cyan',
      fx: 0,
      fy: 0,
      fz: 0,
    },
  ];

  // Add clue nodes
  nodes.forEach((node) => {
    graphNodes.push({
      ...node,
      x: undefined,
      y: undefined,
      z: undefined,
    });
  });

  // Create links from center to each node
  const links: GraphLink[] = nodes.map((node) => ({
    source: 'center',
    target: node.id,
    strength: node.relationshipStrength,
  }));

  return { nodes: graphNodes, links };
}

/**
 * Calculate visual properties for a node
 */
export function getNodeVisualProps(
  node: WordNode,
  isHovered: boolean = false
): {
  size: number;
  opacity: number;
  glowIntensity: number;
  color: string;
} {
  const baseSize = 4 + node.relationshipStrength * 2;
  const size = isHovered ? baseSize * 1.3 : baseSize;

  if (node.isRevealed) {
    return {
      size: baseSize * 0.8,
      opacity: 0.5,
      glowIntensity: 0.1,
      color: '#606060',
    };
  }

  return {
    size,
    opacity: isHovered ? 1 : 0.9,
    glowIntensity: isHovered ? 1 : 0.7,
    color: getNodeColorHex(node.color),
  };
}

/**
 * Get hex color for node type
 */
function getNodeColorHex(color: WordNode['color']): string {
  const colors: Record<string, string> = {
    cyan: '#64f4f4',
    magenta: '#f464f4',
    violet: '#a464f4',
    teal: '#64f4c8',
  };
  return colors[color] || colors.cyan;
}

/**
 * Get center orb visual properties
 */
export function getCenterOrbProps(time: number): {
  coreColor: string;
  auraColor1: string;
  auraColor2: string;
  pulsePhase: number;
} {
  // Create shifting aura effect based on time
  const pulsePhase = (time % 4000) / 4000; // 4 second cycle

  return {
    coreColor: '#ffffff',
    auraColor1: '#64f4f4', // cyan
    auraColor2: '#a464f4', // violet
    pulsePhase,
  };
}
