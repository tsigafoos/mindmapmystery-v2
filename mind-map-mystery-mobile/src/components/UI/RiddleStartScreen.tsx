import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { GraphData, RenderTheme } from '../../types/game';
import { Graph3D } from '../Graph/Graph3D';

interface RiddleStartScreenProps {
  riddle: string;
  graphData: GraphData;
  onStart: () => void;
  renderTheme?: RenderTheme;
}

export function RiddleStartScreen({ riddle, graphData, onStart, renderTheme = 'standard' }: RiddleStartScreenProps) {
  // Show all nodes as unrevealed for the frozen preview
  const allUnrevealed: string[] = [];

  return (
    <View style={styles.container}>
      {/* Frozen 3D Graph in background */}
      <View style={styles.graphContainer}>
        <Graph3D
          graphData={graphData}
          revealedNodeIds={allUnrevealed}
          onNodePress={() => {}} // No-op, graph is frozen
          renderTheme={renderTheme}
          isInteractive={false} // Frozen - no interaction
        />
      </View>

      {/* Riddle overlay */}
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.icon}>🧩</Text>
          <Text style={styles.riddleLabel}>Starting Hint</Text>
          <Text style={styles.riddleText}>{riddle}</Text>

          <TouchableOpacity style={styles.startButton} onPress={onStart}>
            <Text style={styles.startButtonText}>Ready to Start?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1f',
  },
  graphContainer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.4, // Dimmed background graph
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 10, 31, 0.7)', // Semi-transparent overlay
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  icon: {
    fontSize: 56,
    marginBottom: 16,
  },
  riddleLabel: {
    fontSize: 14,
    color: '#64f4f4',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 12,
  },
  riddleText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 40,
    fontStyle: 'italic',
  },
  startButton: {
    backgroundColor: '#64f4f4',
    borderRadius: 16,
    paddingHorizontal: 40,
    paddingVertical: 18,
    shadowColor: '#64f4f4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  startButtonText: {
    color: '#0a0a1f',
    fontSize: 20,
    fontWeight: '700',
  },
});
