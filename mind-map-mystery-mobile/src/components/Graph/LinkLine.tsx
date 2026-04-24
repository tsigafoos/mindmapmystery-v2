import React, { useMemo } from 'react';
import * as THREE from 'three';
import type { SimulationNode } from './ForceGraphSystem';
import type { GraphLink, RenderTheme } from '../../types/game';

interface LinkLineProps {
  link: GraphLink;
  nodes: SimulationNode[];
  renderTheme?: RenderTheme;
}

export function LinkLine({ link, nodes, renderTheme = 'standard' }: LinkLineProps) {
  const points = useMemo(() => {
    const sourceNode = nodes.find(n => n.id === link.source);
    const targetNode = nodes.find(n => n.id === link.target);

    if (!sourceNode || !targetNode) return [];

    const start = new THREE.Vector3(
      Number.isFinite(sourceNode.x) ? sourceNode.x : 0,
      Number.isFinite(sourceNode.y) ? sourceNode.y : 0,
      Number.isFinite(sourceNode.z) ? sourceNode.z : 0
    );
    const end = new THREE.Vector3(
      Number.isFinite(targetNode.x) ? targetNode.x : 0,
      Number.isFinite(targetNode.y) ? targetNode.y : 0,
      Number.isFinite(targetNode.z) ? targetNode.z : 0
    );

    // Create a curve that bows outward from center
    const mid = start.clone().add(end).multiplyScalar(0.5);
    const toCenter = mid.clone().normalize();
    const curveAmount = 8 + (1 - link.strength) * 12;
    mid.add(toCenter.multiplyScalar(curveAmount));

    const curve = new THREE.CatmullRomCurve3([start, mid, end]);
    return curve.getPoints(30);
  }, [link, nodes]);

  const geometry = useMemo(() => {
    if (points.length === 0) return null;
    
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(points.length * 3);
    points.forEach((point, i) => {
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y;
      positions[i * 3 + 2] = point.z;
    });
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [points]);

  if (!geometry) return null;

  // Link color and opacity based on render theme
  const linkColor = renderTheme === 'basic' ? '#44cccc' : '#64f4f4';
  const linkOpacity = renderTheme === 'basic' ? 0.8 : 0.5;
  const lineWidth = 2;

  return (
    <line geometry={geometry}>
      <lineBasicMaterial 
        color={linkColor}
        transparent 
        opacity={linkOpacity}
        linewidth={lineWidth}
      />
    </line>
  );
}
