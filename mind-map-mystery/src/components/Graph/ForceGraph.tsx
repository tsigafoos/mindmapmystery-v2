/**
 * Force Graph Component
 * Main 3D visualization using 3d-force-graph
 */

import React, { useRef, useEffect, useState } from 'react';
import ForceGraph3D from '3d-force-graph';
import * as THREE from 'three';
import type { GraphData, WordNode, GraphNodeObject } from '../../types/game';
import {
  getInitialCameraPosition,
  getNodeSize,
  getLinkOpacity,
} from '../../utils/graphLayout';
import '../../styles/theme.css';

interface ForceGraphProps {
  data: GraphData;
  onNodeClick: (node: WordNode) => void;
  revealedNodeIds: Set<string>;
  isGameOver: boolean;
}

// Color mapping
const NODE_COLORS: Record<string, string> = {
  cyan: '#64f4f4',
  magenta: '#f464f4',
  violet: '#a464f4',
  teal: '#64f4c8',
};

const REVEALED_COLOR = '#404040';

export const ForceGraph: React.FC<ForceGraphProps> = ({
  data,
  onNodeClick,
  revealedNodeIds,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Create and configure the graph
  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize ForceGraph3D
    const GraphClass = ForceGraph3D as unknown as new () => any;
    const graph = new GraphClass();
    graph(containerRef.current);

    graphRef.current = graph;

    // Configure graph settings
    const cameraPos = getInitialCameraPosition();
    graph
      .width(window.innerWidth)
      .height(window.innerHeight)
      .backgroundColor('rgba(0,0,0,0)') // Transparent, let CSS background show
      .showNavInfo(false)
      .cameraPosition(cameraPos)

      // Node styling
      .nodeAutoColorBy('color')
      .nodeOpacity(1)
      .nodeResolution(32)

      // Link styling
      .linkOpacity(0.3)
      .linkWidth(0.5)
      .linkDirectionalArrowLength(0) // No arrows
      .linkDirectionalArrowRelPos(0)

      // Labels
      .nodeLabel('word')
      .nodeRelSize(6)

      // Enable node click
      .onNodeClick((node: any) => {
        if (node.id === 'center' || revealedNodeIds.has(node.id)) return;
        onNodeClick(node);
      })

      // Hover effects
      .onNodeHover((node: any) => {
        setHoveredNode(node ? node.id : null);
        containerRef.current!.style.cursor = node ? 'pointer' : 'default';
      });

    // Custom node rendering
    graph.nodeThreeObject((node: GraphNodeObject) => {
      const isRevealed = node.isRevealed || revealedNodeIds.has(node.id);
      const isHovered = hoveredNode === node.id;
      const isCenter = node.id === 'center';

      if (isCenter) {
        // Render center orb with aura effect
        return createCenterOrb();
      }

      // Regular node
      return createNodeMesh(node, isRevealed, isHovered);
    });

    // Custom link rendering
    graph.linkThreeObject((link: any) => {
      const strength = link.strength || 0.5;
      const material = new THREE.LineBasicMaterial({
        color: 0x64f4f4,
        transparent: true,
        opacity: getLinkOpacity(strength) * 0.5,
      });

      const geometry = new THREE.BufferGeometry();
      return new THREE.Line(geometry, material);
    });

    // Set data
    graph.graphData(data);

    // Configure physics
    configurePhysics(graph);

    // Handle window resize
    const handleResize = () => {
      graph.width(window.innerWidth).height(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      // Cleanup
      if (graphRef.current) {
        graphRef.current._destructor();
      }
    };
  }, []);

  // Update when data changes
  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.graphData(data);
    }
  }, [data]);

  // Update node appearances when revealed nodes change
  useEffect(() => {
    if (graphRef.current) {
      // Trigger refresh of node objects
      graphRef.current.nodeThreeObject((node: GraphNodeObject) => {
        const isRevealed = node.isRevealed || revealedNodeIds.has(node.id);
        const isHovered = hoveredNode === node.id;
        const isCenter = node.id === 'center';

        if (isCenter) {
          return createCenterOrb();
        }

        return createNodeMesh(node, isRevealed, isHovered);
      });
      graphRef.current.refresh();
    }
  }, [revealedNodeIds, hoveredNode]);

  // Configure physics simulation
  const configurePhysics = (graph: any) => {
    // Link distance based on strength
    graph.d3Force('link')?.distance((link: any) => {
      const strength = link.strength || 0.5;
      return 50 + (1 - strength) * 150;
    });

    // Charge force (repulsion)
    graph.d3Force('charge')?.strength(-200);

    // Center force
    graph.d3Force('center', null); // Remove default center

    // Warmup
    graph.warmupTicks(100);
    graph.cooldownTicks(50);
    graph.cooldownTime(15000);
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
      }}
    />
  );
};

/**
 * Create a node mesh (sphere with glow)
 */
function createNodeMesh(
  node: GraphNodeObject,
  isRevealed: boolean,
  isHovered: boolean
): THREE.Object3D {
  const group = new THREE.Group();

  const nodeColor = (node as any).color || 'cyan';
  const color = isRevealed
    ? new THREE.Color(REVEALED_COLOR)
    : new THREE.Color(NODE_COLORS[nodeColor] || NODE_COLORS.cyan);

  const baseSize = getNodeSize(node.relationshipStrength, isRevealed);
  const size = isHovered ? baseSize * 1.2 : baseSize;

  // Main sphere
  const geometry = new THREE.SphereGeometry(size, 32, 32);
  const material = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: isRevealed ? 0.5 : 0.9,
  });
  const sphere = new THREE.Mesh(geometry, material);
  group.add(sphere);

  // Glow effect for unrevealed nodes
  if (!isRevealed) {
    const glowGeometry = new THREE.SphereGeometry(size * 1.5, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: isHovered ? 0.4 : 0.25,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    group.add(glow);

    // Outer aura
    const auraGeometry = new THREE.SphereGeometry(size * 2.5, 32, 32);
    const auraMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: isHovered ? 0.15 : 0.08,
    });
    const aura = new THREE.Mesh(auraGeometry, auraMaterial);
    group.add(aura);
  }

  // Label sprite
  const label = createLabelSprite(node.word, isRevealed);
  label.position.y = size + 8;
  group.add(label);

  return group;
}

/**
 * Create the center orb with shifting aura
 */
function createCenterOrb(): THREE.Object3D {
  const group = new THREE.Group();

  // Core white sphere
  const coreGeometry = new THREE.SphereGeometry(6, 32, 32);
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.95,
  });
  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  group.add(core);

  // Inner glow (cyan)
  const innerGlowGeometry = new THREE.SphereGeometry(12, 32, 32);
  const innerGlowMaterial = new THREE.MeshBasicMaterial({
    color: 0x64f4f4,
    transparent: true,
    opacity: 0.4,
  });
  const innerGlow = new THREE.Mesh(innerGlowGeometry, innerGlowMaterial);
  group.add(innerGlow);

  // Outer glow (purple)
  const outerGlowGeometry = new THREE.SphereGeometry(20, 32, 32);
  const outerGlowMaterial = new THREE.MeshBasicMaterial({
    color: 0xa464f4,
    transparent: true,
    opacity: 0.25,
  });
  const outerGlow = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
  group.add(outerGlow);

  // Question mark label
  const label = createLabelSprite('?', false, true);
  label.position.y = 25;
  group.add(label);

  return group;
}

/**
 * Create a text label sprite
 */
function createLabelSprite(
  text: string,
  isRevealed: boolean,
  isCenter: boolean = false
): THREE.Sprite {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const fontSize = isCenter ? 48 : 32;
  ctx.font = `bold ${fontSize}px Inter, sans-serif`;

  const textMetrics = ctx.measureText(text);
  const padding = 20;
  canvas.width = textMetrics.width + padding * 2;
  canvas.height = fontSize + padding;

  // Redraw with correct canvas size
  ctx.font = `bold ${fontSize}px Inter, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Glow effect
  ctx.shadowColor = isRevealed
    ? 'rgba(64, 64, 64, 0.5)'
    : 'rgba(100, 244, 244, 0.8)';
  ctx.shadowBlur = 15;

  // Text color
  ctx.fillStyle = isRevealed
    ? '#808080'
    : isCenter
    ? '#ffffff'
    : '#e0e0e0';

  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
  });

  const sprite = new THREE.Sprite(spriteMaterial);
  const scale = isCenter ? 0.5 : 0.25;
  sprite.scale.set(canvas.width * scale, canvas.height * scale, 1);

  return sprite;
}

export default ForceGraph;
