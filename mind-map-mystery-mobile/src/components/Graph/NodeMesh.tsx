import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import type { SimulationNode } from './ForceGraphSystem';
import { getNodeColor, rgbToHex } from '../../utils/thematicColors';

interface NodeMeshProps {
  node: SimulationNode;
  isRevealed: boolean;
  onPress: () => void;
  isCenter: boolean;
}

export function NodeMesh({ node, isRevealed, onPress, isCenter }: NodeMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const baseColor = useMemo(() => {
    const rgb = getNodeColor(node.category, node.relationshipStrength, false, isCenter, node.id.charCodeAt(0));
    return rgbToHex(rgb);
  }, [node.category, node.relationshipStrength, isCenter, node.id]);

  // Revealed nodes: gray with 50% opacity
  const displayColor = isRevealed && !isCenter ? '#707070' : baseColor;

  const size = useMemo(() => {
    if (isCenter) return 15;
    if (node.relationshipStrength >= 0.7) return 7;
    if (node.relationshipStrength >= 0.4) return 5;
    return 3.5;
  }, [isCenter, node.relationshipStrength]);

  const position: [number, number, number] = useMemo(() => {
    return [
      Number.isFinite(node.x) ? node.x : 0,
      Number.isFinite(node.y) ? node.y : 0,
      Number.isFinite(node.z) ? node.z : 0
    ];
  }, [node.x, node.y, node.z]);

  return (
    <group position={position}>
      {/* Main sphere */}
      <mesh ref={meshRef} onClick={onPress}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={displayColor}
          emissive={displayColor}
          emissiveIntensity={isRevealed && !isCenter ? 0.02 : isCenter ? 0.8 : 0.5}
          metalness={0.9}
          roughness={0.1}
          transparent={isRevealed && !isCenter}
          opacity={isRevealed && !isCenter ? 0.5 : 1.0}
        />
      </mesh>
      
      {/* Inner core for revealed nodes - adds solidity */}
      {isRevealed && !isCenter && (
        <mesh>
          <sphereGeometry args={[size * 0.6, 32, 32]} />
          <meshStandardMaterial
            color="#505050"
            emissive="#404040"
            emissiveIntensity={0.05}
            metalness={0.5}
            roughness={0.3}
            transparent
            opacity={0.6}
          />
        </mesh>
      )}
      
      {/* Glow halo - only for unrevealed nodes */}
      {!isRevealed && !isCenter && (
        <>
          <mesh>
            <sphereGeometry args={[size * 1.4, 32, 32]} />
            <meshBasicMaterial
              color={baseColor}
              transparent
              opacity={0.2}
              side={THREE.BackSide}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[size * 2.0, 32, 32]} />
            <meshBasicMaterial
              color={baseColor}
              transparent
              opacity={0.08}
              side={THREE.BackSide}
            />
          </mesh>
        </>
      )}
    </group>
  );
}
