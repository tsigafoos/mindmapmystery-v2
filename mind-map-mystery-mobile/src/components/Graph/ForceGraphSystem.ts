import { useRef, useEffect, useCallback } from 'react';
import { forceSimulation, forceManyBody, forceLink, forceCenter } from 'd3-force';
import type { GraphData, WordNode } from '../../types/game';

interface SimulationNode extends WordNode {
  x: number;
  y: number;
  z: number;
  vx?: number;
  vy?: number;
  vz?: number;
  fx?: number | null;
  fy?: number | null;
  fz?: number | null;
}

interface SimulationLink {
  source: string | SimulationNode;
  target: string | SimulationNode;
  strength: number;
  distance: number;
}

interface UseForceGraphOptions {
  graphData: GraphData;
  onPositionsUpdate: (nodes: SimulationNode[]) => void;
  isActive: boolean;
}

export function useForceGraph(options: UseForceGraphOptions) {
  const { graphData, onPositionsUpdate, isActive } = options;
  const simulationRef = useRef<any>(null);
  const nodesRef = useRef<SimulationNode[]>([]);

  useEffect(() => {
    if (!isActive) return;

    const nodes: SimulationNode[] = graphData.nodes.map(n => ({
      ...n,
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 200,
      z: (Math.random() - 0.5) * 100,
    }));

    const links: SimulationLink[] = graphData.links.map(l => ({
      source: l.source,
      target: l.target,
      strength: l.strength,
      distance: 50 + (1 - l.strength) * 100,
    }));

    // Fix center node at origin
    const centerNode = nodes.find(n => n.id === 'center');
    if (centerNode) {
      centerNode.fx = 0;
      centerNode.fy = 0;
      centerNode.fz = 0;
    }

    nodesRef.current = nodes;

    const simulation = forceSimulation(nodes)
      .force('charge', forceManyBody().strength(-300))
      .force('link', forceLink(links).id((d: any) => d.id).strength(1))
      .force('center', forceCenter(0, 0))
      .alphaDecay(0.02)
      .velocityDecay(0.3);

    simulation.on('tick', () => {
      onPositionsUpdate([...nodes]);
    });

    simulationRef.current = simulation;

    // Warm up simulation
    simulation.tick(30);

    return () => {
      simulation.stop();
    };
  }, [graphData, isActive, onPositionsUpdate]);

  const restart = useCallback(() => {
    simulationRef.current?.alpha(1).restart();
  }, []);

  return { restart };
}

export type { SimulationNode, SimulationLink };
