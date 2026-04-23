/**
 * Graph Layout Configuration
 * Force-directed graph settings for 3d-force-graph
 */

import type { ForceGraph3DInstance } from '3d-force-graph';
import type { GraphData, GraphNodeObject } from '../types/game';

/**
 * Default force graph configuration
 */
export const DEFAULT_GRAPH_CONFIG = {
  // Link distance based on relationship strength
  // Stronger relationships = shorter links
  linkDistance: (link: { strength?: number }) => {
    const strength = link.strength || 0.5;
    // Invert: stronger (1.0) = shorter distance, weaker (0.0) = longer
    return 100 + (1 - strength) * 200;
  },

  // Link stiffness
  linkStiffness: 0.1,

  // Charge force (repulsion between nodes)
  // Negative = repulsion, more negative = stronger repulsion
  nodeCharge: -200,

  // Center gravity (pull toward center)
  centerForce: 0.05,

  // Velocity decay (damping)
  velocityDecay: 0.3,

  // Warmup ticks before rendering
  warmupTicks: 100,

  // Cooldown ticks after interaction
  cooldownTicks: 50,

  // Cooldown time in ms
  cooldownTime: 15000,
};

/**
 * Apply configuration to a force graph instance
 */
export function configureForceGraph(
  graph: ForceGraph3DInstance,
  config: Partial<typeof DEFAULT_GRAPH_CONFIG> = {}
): ForceGraph3DInstance {
  const finalConfig = { ...DEFAULT_GRAPH_CONFIG, ...config };

  return graph
    .d3Force('charge', null) // Remove default charge
    .d3Force('charge', (window as any).d3?.forceManyBody?.().strength(finalConfig.nodeCharge))
    .d3Force('center', null) // Remove default center
    .d3Force('center', (window as any).d3?.forceCenter?.(0, 0, 0).strength(finalConfig.centerForce))
    .d3VelocityDecay(finalConfig.velocityDecay)
    .warmupTicks(finalConfig.warmupTicks)
    .cooldownTicks(finalConfig.cooldownTicks)
    .cooldownTime(finalConfig.cooldownTime);
}

/**
 * Create graph data from game configuration
 */
export function createGraphData(
  centerWord: string,
  relatedWords: Array<{ word: string; strength: number; category: string }>
): GraphData {
  // Create center node (invisible, just for force layout)
  // We'll render the center orb separately for visual effect
  const nodes: GraphNodeObject[] = [
    {
      id: 'center',
      word: centerWord,
      relationshipStrength: 1,
      isRevealed: false,
      category: 'uncategorized',
      color: 'cyan', // Default, will be overridden by visual
      x: 0,
      y: 0,
      z: 0,
      fx: 0, // Fixed position
      fy: 0,
      fz: 0,
    },
  ];

  // Create clue nodes
  relatedWords.forEach((related, index) => {
    nodes.push({
      id: `node-${index}`,
      word: related.word,
      relationshipStrength: related.strength,
      isRevealed: false,
      category: related.category as any,
      color: 'cyan',
    });
  });

  // Create links from center to each node
  const links = relatedWords.map((related, index) => ({
    source: 'center',
    target: `node-${index}`,
    strength: related.strength,
  }));

  return { nodes, links };
}

/**
 * Get node size based on relationship strength
 */
export function getNodeSize(strength: number, isRevealed: boolean): number {
  if (isRevealed) {
    return 3; // Smaller when revealed
  }
  // Stronger relationships = slightly larger nodes
  return 4 + strength * 2;
}

/**
 * Get link opacity based on strength
 */
export function getLinkOpacity(strength: number): number {
  // Stronger links are more visible
  return 0.3 + strength * 0.4;
}

/**
 * Get link width based on strength
 */
export function getLinkWidth(strength: number): number {
  return 0.5 + strength * 1.5;
}

/**
 * Calculate camera initial position
 * Positioned to see the whole graph nicely
 */
export function getInitialCameraPosition(): { x: number; y: number; z: number } {
  return {
    x: 150,
    y: 100,
    z: 250,
  };
}

/**
 * Camera control settings
 */
export const CAMERA_SETTINGS = {
  // Enable orbit controls
  enableOrbit: true,

  // Orbit speed
  orbitSpeed: 1,

  // Minimum distance (zoom in limit)
  minDistance: 50,

  // Maximum distance (zoom out limit)
  maxDistance: 500,

  // Auto-rotate when idle (optional, disabled for gameplay)
  autoRotate: false,
  autoRotateSpeed: 0.5,
};

/**
 * Particle/Glow effect configuration
 */
export const GLOW_CONFIG = {
  // Bloom strength
  bloomStrength: 1.5,

  // Bloom radius
  bloomRadius: 0.4,

  // Bloom threshold
  bloomThreshold: 0.1,

  // Glow sprite size multiplier
  spriteSizeMultiplier: 2.5,

  // Pulse speed (in seconds)
  pulseSpeed: 3,

  // Color intensities
  colorIntensity: {
    cyan: 1.2,
    magenta: 1.2,
    violet: 1.1,
    teal: 1.2,
  },
};

/**
 * Physics simulation steps
 * Higher = more stable but slower initial layout
 */
export const PHYSICS_STEPS = {
  initial: 300, // Steps during warmup
  interaction: 50, // Steps after user interaction
  settle: 10, // Steps when nearly settled
};
