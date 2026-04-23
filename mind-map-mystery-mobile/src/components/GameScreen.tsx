import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useGameState } from '../hooks/useGameState';
import type { GameConfig } from '../types/game';
import { Graph3D } from './Graph/Graph3D';
import { GameHeader } from './UI/GameHeader';
import { HintsBar } from './UI/HintsBar';
import { HintCardsSidebar } from './UI/HintCardsSidebar';
import { GuessInput } from './UI/GuessInput';
import { GameOverModal } from './UI/GameOverModal';
import { ColorKeyModal } from './UI/ColorKeyModal';

const DEFAULT_CONFIG: GameConfig = {
  totalTime: 300,
  maxGuesses: 10,
  centerWord: 'photosynthesis',
  relatedWords: [
    { word: 'chlorophyll', strength: 0.95, category: 'biology' },
    { word: 'sunlight', strength: 0.9, category: 'science' },
    { word: 'carbon', strength: 0.85, category: 'science' },
    { word: 'oxygen', strength: 0.8, category: 'science' },
    { word: 'glucose', strength: 0.75, category: 'science' },
    { word: 'plant', strength: 0.7, category: 'biology' },
    { word: 'leaf', strength: 0.65, category: 'biology' },
    { word: 'green', strength: 0.6, category: 'biology' },
    { word: 'stomata', strength: 0.5, category: 'biology' },
    { word: 'energy', strength: 0.45, category: 'science' },
    { word: 'CO2', strength: 0.4, category: 'science' },
    { word: 'water', strength: 0.35, category: 'science' },
    { word: 'mitochondria', strength: 0.3, category: 'biology' },
    { word: 'ATP', strength: 0.25, category: 'science' },
    { word: 'cell', strength: 0.2, category: 'biology' },
  ],
};

interface UsedHint {
  id: number;
  text: string;
  result: string;
}

export function GameScreen() {
  const [config] = useState(DEFAULT_CONFIG);
  const [guess, setGuess] = useState('');
  const [usedHints, setUsedHints] = useState<UsedHint[]>([]);
  const [showColorKey, setShowColorKey] = useState(false);

  const {
    state,
    graphData,
    revealNode,
    makeGuess,
    resetGame,
    revealedCount,
    totalNodes,
  } = useGameState({
    config,
    onGameOver: () => {},
    onWin: () => {},
  });

  const revealedNodeIds = state.nodes.filter(n => n.isRevealed).map(n => n.id);

  const handleNodePress = useCallback((node: any) => {
    if (!node.isRevealed && node.id !== 'center') {
      revealNode(node.id);
    }
  }, [revealNode]);

  const handleHintPress = useCallback((hintId: number) => {
    const hints = [
      { id: 1, text: 'First Letter', getValue: () => `"${state.centerWord.charAt(0).toUpperCase()}"` },
      { id: 2, text: 'Random Word', getValue: () => {
        const unrevealed = state.nodes.filter(n => !n.isRevealed && n.id !== 'center');
        if (unrevealed.length > 0) {
          return unrevealed[Math.floor(Math.random() * unrevealed.length)].word;
        }
        return state.nodes.find(n => n.id !== 'center')?.word || '?';
      }},
      { id: 3, text: 'Word Length', getValue: () => `${state.centerWord.length} letters` },
    ];

    const hint = hints.find(h => h.id === hintId);
    if (!hint || usedHints.some(uh => uh.id === hintId)) return;

    setUsedHints(prev => [...prev, { id: hint.id, text: hint.text, result: hint.getValue() }]);
  }, [state.centerWord, state.nodes, usedHints]);

  const handleGuessSubmit = useCallback(() => {
    if (!guess.trim() || state.isGameOver) return;
    makeGuess(guess.trim());
    setGuess('');
  }, [guess, makeGuess, state.isGameOver]);

  const handlePlayAgain = useCallback(() => {
    setUsedHints([]);
    setGuess('');
    resetGame();
  }, [resetGame]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <GameHeader onColorKeyPress={() => setShowColorKey(true)} />

      {/* Hints Bar */}
      <HintsBar
        usedHintIds={usedHints.map(h => h.id)}
        onHintPress={handleHintPress}
      />

      {/* Main Content Area */}
      <View style={styles.content}>
        {/* Sidebar with revealed clues */}
        <HintCardsSidebar
          usedHints={usedHints}
          revealedClues={state.revealedClues}
        />

        {/* 3D Graph */}
        <View style={styles.graphContainer}>
          <Graph3D
            graphData={graphData}
            revealedNodeIds={revealedNodeIds}
            onNodePress={handleNodePress}
          />
        </View>
      </View>

      {/* Bottom Input */}
      <GuessInput
        value={guess}
        onChangeText={setGuess}
        onSubmit={handleGuessSubmit}
        disabled={state.isGameOver}
        timeRemaining={state.timeRemaining}
        guessCount={state.guessCount}
        revealedCount={revealedCount}
        totalNodes={totalNodes}
      />

      {/* Modals */}
      <ColorKeyModal visible={showColorKey} onClose={() => setShowColorKey(false)} />
      <GameOverModal
        visible={state.isGameOver}
        isWinner={state.isWinner}
        centerWord={state.centerWord}
        guessCount={state.guessCount}
        revealedCount={revealedCount}
        totalNodes={totalNodes}
        onPlayAgain={handlePlayAgain}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1f',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
  },
  graphContainer: {
    flex: 1,
    position: 'relative',
    minHeight: 300,
    minWidth: 300,
  },
});
