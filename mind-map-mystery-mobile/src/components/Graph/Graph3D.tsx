import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { GraphData, WordNode } from '../../types/game';
import { useForceGraph, SimulationNode } from './ForceGraphSystem';
import { NodeMesh } from './NodeMesh';
import { LinkLine } from './LinkLine';

// Static star field - no rotation
function StarField() {
  const [positions, colors] = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 1000;
      positions[i3 + 1] = (Math.random() - 0.5) * 1000;
      positions[i3 + 2] = (Math.random() - 0.5) * 1000;
      
      const isCyan = Math.random() > 0.5;
      colors[i3] = isCyan ? 0.4 : 0.6;
      colors[i3 + 1] = isCyan ? 0.95 : 0.4;
      colors[i3 + 2] = 1;
    }
    
    return [positions, colors];
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={2} vertexColors transparent opacity={0.8} />
    </points>
  );
}

interface Graph3DProps {
  graphData: GraphData;
  revealedNodeIds: string[];
  onNodePress: (node: WordNode) => void;
}

export function Graph3D({ graphData, revealedNodeIds, onNodePress }: Graph3DProps) {
  const [simulationNodes, setSimulationNodes] = useState<SimulationNode[]>([]);
  const [isReady, setIsReady] = useState(false);

  const handlePositionsUpdate = useCallback((nodes: SimulationNode[]) => {
    setSimulationNodes(nodes);
    if (nodes.length > 0 && !isReady) {
      setIsReady(true);
    }
  }, [isReady]);

  useForceGraph({
    graphData,
    onPositionsUpdate: handlePositionsUpdate,
    isActive: true,
  });

  const handleNodePress = useCallback((node: SimulationNode) => {
    if (node.id !== 'center') {
      onNodePress(node as WordNode);
    }
  }, [onNodePress]);

  return (
    <View style={styles.container}>
      {!isReady && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#64f4f4" />
          <Text style={styles.loadingText}>Loading 3D Graph...</Text>
        </View>
      )}
      <Canvas
        camera={{ position: [80, 60, 250], fov: 55, near: 1, far: 2000 }}
        style={styles.canvas}
        gl={{ alpha: false, antialias: true }}
        onCreated={(state) => {
          state.gl.setClearColor('#0a0a1f');
        }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[100, 100, 100]} intensity={1.0} color="#64f4f4" />
        <pointLight position={[-100, -100, 50]} intensity={0.6} color="#a464f4" />
        <pointLight position={[0, 0, 100]} intensity={0.5} color="#ffffff" />

        <StarField />

        {graphData.links.map((link, index) => (
          <LinkLine key={`link-${index}`} link={link} nodes={simulationNodes} />
        ))}

        {simulationNodes.map((node) => (
          <NodeMesh
            key={node.id}
            node={node}
            isRevealed={revealedNodeIds.includes(node.id)}
            isCenter={node.id === 'center'}
            onPress={() => handleNodePress(node)}
          />
        ))}

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          autoRotate={false}
          minDistance={120}
          maxDistance={500}
        />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#0a0a1f',
  },
  canvas: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a1f',
    zIndex: 10,
  },
  loadingText: {
    color: '#64f4f4',
    marginTop: 16,
    fontSize: 16,
  },
});
