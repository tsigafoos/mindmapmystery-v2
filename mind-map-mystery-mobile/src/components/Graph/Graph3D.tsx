import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions, Text, ActivityIndicator } from 'react-native';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import type { GraphData, WordNode } from '../../types/game';
import { useForceGraph, SimulationNode } from './ForceGraphSystem';
import { NodeMesh } from './NodeMesh';
import { LinkLine } from './LinkLine';

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
        camera={{ position: [0, 0, 300], fov: 60 }}
        style={styles.canvas}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[100, 100, 100]} intensity={0.8} color="#64f4f4" />
        <pointLight position={[-100, -100, 100]} intensity={0.5} color="#a464f4" />

        <Stars
          radius={500}
          depth={50}
          count={1000}
          factor={4}
          saturation={0.8}
          fade
          speed={0.5}
        />

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
          autoRotate
          autoRotateSpeed={0.5}
          minDistance={150}
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
