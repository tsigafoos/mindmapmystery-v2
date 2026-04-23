import React, { useRef, useMemo } from 'react';
import { Mesh, Vector3 } from 'three';
import { Sphere } from '@react-three/drei';
import type { SimulationNode } from './ForceGraphSystem';
import { getNodeColor, rgbToHex } from '../../utils/thematicColors';

interface NodeMeshProps {
  node: SimulationNode;
  isRevealed: boolean;
  onPress: () => void;
  isCenter: boolean;
}

export function NodeMesh({ node, isRevealed, onPress, isCenter }: NodeMeshProps) {
  const meshRef = useRef<Mesh>(null);

  const color = useMemo(() => {
    const rgb = getNodeColor(node.category, node.relationshipStrength, isRevealed, isCenter, node.id.charCodeAt(0));
    return rgbToHex(rgb);
  }, [node.category, node.relationshipStrength, isRevealed, isCenter, node.id]);

  const size = useMemo(() => {
    if (isCenter) return 12;
    if (node.relationshipStrength >= 0.7) return 6;
    if (node.relationshipStrength >= 0.4) return 4;
    return 2.5;
  }, [isCenter, node.relationshipStrength]);

  const position = useMemo(() => {
    return new Vector3(node.x || 0, node.y || 0, node.z || 0);
  }, [node.x, node.y, node.z]);

  return (
    <Sphere
      ref={meshRef}
      position={position}
      args={[size, 32, 32]}
      onClick={onPress}
    >
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={isRevealed && !isCenter ? 0.1 : isCenter ? 0.5 : 0.3}
        metalness={0.8}
        roughness={0.2}
      />
    </Sphere>
  );
}
