import { useEffect, useRef, useCallback, useState } from 'react';
import type { GraphData, WordNode, GraphLink } from '../../types/game';
import { getNodeColor, rgbToHex, categorizeWord } from '../../utils/thematicColors';

const loadForceGraph = async () => {
  const module = await import('3d-force-graph');
  return module.default;
};

const loadThree = async () => {
  const module = await import('three');
  return module;
};

// Detect mobile
const isMobile = () => window.innerWidth < 768;

// Game visual settings - physics enabled with tiered layout
const GAME_SETTINGS = {
  material: {
    type: 'standard' as const,
    metalness: 1,
    roughness: 0,
    emissiveIntensity: 0.3,
  },
  geometry: {
    resolution: 10,
  },
  sizes: {
    center: 30,
    firstRing: 15,
    secondRing: 10,
    thirdPlusRing: 5,
  },
  links: {
    opacity: 0.4,
    width: 1,
    firstRingDistance: 60,
    secondRingDistance: 30,
    thirdPlusRingDistance: 15,
    curvature: 0.2,
    particles: 4,
  },
  physics: {
    charge: -300,
    warmupTicks: 30,
    cooldownTicks: 50,
  },
  background: '#0a0a1f',
};

interface GameGraphProps {
  graphData: GraphData;
  onNodeClick?: (node: WordNode) => void;
  revealedNodes: string[];
}

export default function GameGraph({ graphData, onNodeClick, revealedNodes }: GameGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);
  const threeRef = useRef<any>(null);
  const revealedNodesRef = useRef<Set<string>>(new Set());
  const cleanupRef = useRef<(() => void) | null>(null);

  // Keep ref in sync with prop
  useEffect(() => {
    revealedNodesRef.current = new Set(revealedNodes);
  }, [revealedNodes]);

  // Determine node ring level based on relationship strength
  const getNodeRingLevel = useCallback((strength: number): number => {
    if (strength >= 0.7) return 1;
    if (strength >= 0.4) return 2;
    return 3;
  }, []);

  // Get node size based on ring level
  const getNodeSize = useCallback((node: WordNode & { id: string }): number => {
    if (node.id === 'center') return GAME_SETTINGS.sizes.center;
    const ringLevel = getNodeRingLevel(node.relationshipStrength);
    switch (ringLevel) {
      case 1: return GAME_SETTINGS.sizes.firstRing;
      case 2: return GAME_SETTINGS.sizes.secondRing;
      default: return GAME_SETTINGS.sizes.thirdPlusRing;
    }
  }, [getNodeRingLevel]);

  // Create Three.js node object
  const createNodeObject = useCallback((node: any) => {
    if (!threeRef.current) return null;
    const THREE = threeRef.current;

    const isCenter = node.id === 'center';
    const isRevealed = revealedNodesRef.current.has(node.id) || node.isRevealed;

    const word = node.word || node.label || '';
    const category = node.category || categorizeWord(word);

    const colorRgb = getNodeColor(
      category,
      node.relationshipStrength || 0.5,
      isRevealed,
      isCenter,
      node.id.charCodeAt(0)
    );

    const colorHex = rgbToHex(colorRgb);
    const size = getNodeSize(node) * 0.5;

    const geometry = new THREE.SphereGeometry(
      size,
      GAME_SETTINGS.geometry.resolution,
      GAME_SETTINGS.geometry.resolution
    );

    const emissiveIntensity = isRevealed && !isCenter
      ? 0.05
      : isCenter
        ? 0.5
        : GAME_SETTINGS.material.emissiveIntensity;

    const material = new THREE.MeshStandardMaterial({
      color: colorHex,
      metalness: GAME_SETTINGS.material.metalness,
      roughness: GAME_SETTINGS.material.roughness,
      emissive: colorHex,
      emissiveIntensity: emissiveIntensity,
    });

    return new THREE.Mesh(geometry, material);
  }, [getNodeSize]);

  // Initialize graph with physics enabled
  useEffect(() => {
    const initGraph = async () => {
      if (!containerRef.current || graphRef.current) return;

      try {
        const [ForceGraph3D, THREE] = await Promise.all([loadForceGraph(), loadThree()]);
        threeRef.current = THREE;

        const graph = (ForceGraph3D as any)()(containerRef.current)
          .width(containerRef.current.clientWidth)
          .height(containerRef.current.clientHeight)
          .backgroundColor(GAME_SETTINGS.background)
          .showNavInfo(false)
          .linkOpacity(GAME_SETTINGS.links.opacity)
          .linkWidth(GAME_SETTINGS.links.width)
          .linkColor(() => 'rgba(100, 244, 244, 0.4)')
          .linkCurvature(GAME_SETTINGS.links.curvature)
          .linkDirectionalParticles(GAME_SETTINGS.links.particles)
          .linkDirectionalParticleSpeed(0.01)
          .nodeLabel('word')
          .nodeThreeObject(createNodeObject)
          .warmupTicks(GAME_SETTINGS.physics.warmupTicks)
          .cooldownTicks(GAME_SETTINGS.physics.cooldownTicks)
          .d3AlphaDecay(0.02)
          .d3VelocityDecay(0.3)
          .onNodeClick((node: any) => {
            if (onNodeClick && node.id !== 'center') {
              onNodeClick(node as WordNode);
            }
          });

        graphRef.current = graph;

        // Initial data
        const nodes = graphData.nodes.map(n => ({
          ...n,
          id: n.id,
          word: n.word || (n as any).label,
          category: n.category || categorizeWord(n.word || ''),
        }));

        const links = graphData.links.map(l => ({
          source: l.source,
          target: l.target,
          strength: l.strength,
        }));

        graph.graphData({ nodes, links });

        // Configure forces with tiered distances
        graph.d3Force('charge').strength(GAME_SETTINGS.physics.charge);
        graph.d3Force('link')
          .distance((link: any) => {
            const targetNode = nodes.find((n: any) => n.id === link.target);
            if (!targetNode || targetNode.id === 'center') return GAME_SETTINGS.links.firstRingDistance;
            const ringLevel = getNodeRingLevel(targetNode.relationshipStrength);
            switch (ringLevel) {
              case 1: return GAME_SETTINGS.links.firstRingDistance;
              case 2: return GAME_SETTINGS.links.secondRingDistance;
              default: return GAME_SETTINGS.links.thirdPlusRingDistance;
            }
          })
          .strength(1);

        // Center node fixed at origin
        const centerNode = nodes.find((n: any) => n.id === 'center');
        if (centerNode) {
          centerNode.fx = 0;
          centerNode.fy = 0;
          centerNode.fz = 0;
        }

        // Center camera - closer on mobile for better view
        setTimeout(() => {
          const cameraZ = isMobile() ? 250 : 400; // Closer on mobile
          graph.cameraPosition(
            { x: 0, y: 0, z: cameraZ },
            { x: 0, y: 0, z: 0 },   // Look at center
            1000                     // Transition duration ms
          );
        }, 600);

        // Handle resize
        const handleResize = () => {
          if (containerRef.current && graph) {
            graph.width(containerRef.current.clientWidth);
            graph.height(containerRef.current.clientHeight);
          }
        };

        window.addEventListener('resize', handleResize);

        cleanupRef.current = () => {
          window.removeEventListener('resize', handleResize);
        };
      } catch (err) {
        console.error('Game graph init error:', err);
      }
    };

    initGraph();

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      graphRef.current = null;
    };
  }, []); // Empty deps - only run once

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  );
}
