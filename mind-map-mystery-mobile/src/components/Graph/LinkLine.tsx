import React, { useMemo } from 'react';
import { Vector3, CatmullRomCurve3 } from 'three';
import { Line } from '@react-three/drei';
import type { SimulationNode } from './ForceGraphSystem';
import type { GraphLink } from '../../types/game';

interface LinkLineProps {
  link: GraphLink;
  nodes: SimulationNode[];
}

export function LinkLine({ link, nodes }: LinkLineProps) {
  const points = useMemo(() => {
    const sourceNode = nodes.find(n => n.id === link.source);
    const targetNode = nodes.find(n => n.id === link.target);

    if (!sourceNode || !targetNode) return [];

    const start = new Vector3(sourceNode.x || 0, sourceNode.y || 0, sourceNode.z || 0);
    const end = new Vector3(targetNode.x || 0, targetNode.y || 0, targetNode.z || 0);

    // Create slight curve
    const mid = start.clone().add(end).multiplyScalar(0.5);
    mid.y += 10; // Add slight arc

    const curve = new CatmullRomCurve3([start, mid, end]);
    return curve.getPoints(20);
  }, [link, nodes]);

  if (points.length === 0) return null;

  return (
    <Line
      points={points}
      color="rgba(100, 244, 244, 0.4)"
      lineWidth={1}
      transparent
      opacity={0.4}
    />
  );
}
