import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useGameState } from '../hooks/useGameState';
import type { GameConfig, GameTemplate, GameMode } from '../types/game';
import { Graph3D } from './Graph/Graph3D';
import { GameHeader } from './UI/GameHeader';
import { HintsBar } from './UI/HintsBar';
import { RevealedWordsBar } from './UI/RevealedWordsBar';
import { GuessButtonBar } from './UI/GuessButtonBar';
import { GuessModal } from './UI/GuessModal';
import { GameOverModal } from './UI/GameOverModal';
import { ColorKeyModal } from './UI/ColorKeyModal';
import { RiddleStartScreen } from './UI/RiddleStartScreen';

// Default template if none provided
const DEFAULT_TEMPLATE: GameTemplate = {
  centerWord: 'photosynthesis',
  startingHint: 'I convert sunlight into sweet energy, creating the air you breathe. What am I?',
  renderTheme: 'phong',
  nodes: [
    { word: 'chlorophyll', strength: 0.95, category: 'biology', tier: 1 },
    { word: 'sunlight', strength: 0.9, category: 'science', tier: 1 },
    { word: 'carbon', strength: 0.85, category: 'science', tier: 1 },
    { word: 'oxygen', strength: 0.8, category: 'science', tier: 1 },
    { word: 'glucose', strength: 0.75, category: 'science', tier: 2 },
    { word: 'plant', strength: 0.7, category: 'biology', tier: 2 },
    { word: 'leaf', strength: 0.65, category: 'biology', tier: 2 },
    { word: 'green', strength: 0.6, category: 'biology', tier: 2 },
    { word: 'stomata', strength: 0.5, category: 'biology', tier: 3 },
    { word: 'energy', strength: 0.45, category: 'science', tier: 3 },
    { word: 'CO2', strength: 0.4, category: 'science', tier: 3 },
    { word: 'water', strength: 0.35, category: 'science', tier: 3 },
    { word: 'mitochondria', strength: 0.3, category: 'biology', tier: 3 },
    { word: 'ATP', strength: 0.25, category: 'science', tier: 3 },
    { word: 'cell', strength: 0.2, category: 'biology', tier: 3 },
  ],
  totalTime: 300,
  maxGuesses: 10,
};

// Convert GameTemplate to GameConfig
function templateToConfig(template: GameTemplate): GameConfig {
  return {
    centerWord: template.centerWord,
    startingHint: template.startingHint,
    renderTheme: template.renderTheme,
    relatedWords: template.nodes.map(n => ({
      word: n.word,
      strength: n.strength,
      category: n.category,
      tier: n.tier,
    })),
    totalTime: template.totalTime ?? 300,
    maxGuesses: template.maxGuesses ?? 10,
  };
}

interface UsedHint {
  id: number;
  text: string;
  result: string;
}

interface GameScreenProps {
  mode?: GameMode;
  onBack?: () => void;
  gameTemplate?: GameTemplate; // New: pass in game as JSON
}

export function GameScreen({ mode = 'solo', onBack, gameTemplate }: GameScreenProps) {
  // Use provided template or default
  const template = gameTemplate ?? DEFAULT_TEMPLATE;
  const config = useMemo(() => templateToConfig(template), [template]);

  const [hasStarted, setHasStarted] = useState(false);
  const [guess, setGuess] = useState('');
  const [usedHints, setUsedHints] = useState<UsedHint[]>([]);
  const [showColorKey, setShowColorKey] = useState(false);
  const [showGuessModal, setShowGuessModal] = useState(false);

  const [lastGuessCorrect, setLastGuessCorrect] = useState<boolean | null>(null);

  const {
    state,
    graphData,
    revealNode,
    makeGuess,
    resetGame,
    startGame,
    useHint,
    pauseGame,
    resumeGame,
    revealedCount,
    totalNodes,
  } = useGameState({
    config,
    onGameOver: () => {},
    onWin: () => {},
  });

  const revealedNodeIds = state.nodes.filter(n => n.isRevealed).map(n => n.id);

  // Calculate solve time for display
  const solveTimeSeconds = useMemo(() => {
    if (!state.startTime || !state.endTime) return null;
    return Math.floor((state.endTime - state.startTime) / 1000);
  }, [state.startTime, state.endTime]);

  const handleStartGame = useCallback(() => {
    setHasStarted(true);
    startGame();
  }, [startGame]);

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

    // Apply hint penalty to score
    useHint();

    setUsedHints(prev => [...prev, { id: hint.id, text: hint.text, result: hint.getValue() }]);
  }, [state.centerWord, state.nodes, usedHints, useHint]);

  const handleGuessSubmit = useCallback(() => {
    if (!guess.trim() || state.isGameOver) return;
    const isCorrect = makeGuess(guess.trim());
    setLastGuessCorrect(isCorrect);

    if (isCorrect) {
      // Correct guess - show celebration in modal, don't close yet
      // Game is already won, modal will show celebration state
    } else {
      // Wrong guess - show penalty flash, then close after delay
      setTimeout(() => {
        setShowGuessModal(false);
        setGuess('');
        setLastGuessCorrect(null);
        resumeGame(); // Resume timer after penalty shown
      }, 1500);
    }
  }, [guess, makeGuess, state.isGameOver, resumeGame]);

  const handlePlayAgain = useCallback(() => {
    setUsedHints([]);
    setGuess('');
    setHasStarted(false);
    setShowGuessModal(false);
    resetGame();
  }, [resetGame]);

  // Show riddle start screen if game hasn't started
  if (!hasStarted) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <RiddleStartScreen
          riddle={config.startingHint}
          graphData={graphData}
          onStart={handleStartGame}
          renderTheme={config.renderTheme}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      {/* Header with Back Button */}
      <View style={styles.headerRow}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        )}
        <View style={styles.modeBadge}>
          <Text style={styles.modeText}>{mode.toUpperCase()}</Text>
        </View>
        <TouchableOpacity onPress={() => setShowColorKey(true)}>
          <Text style={styles.colorKeyBtn}>🎨</Text>
        </TouchableOpacity>
      </View>

      {/* Score Display */}
      <View style={styles.scoreBar}>
        <Text style={styles.scoreText}>Score: {state.score.toLocaleString()}</Text>
      </View>

      {/* Hints Bar */}
      <HintsBar
        usedHintIds={usedHints.map(h => h.id)}
        onHintPress={handleHintPress}
      />

      {/* Revealed Words & Hints at Top */}
      <RevealedWordsBar revealedClues={state.revealedClues} usedHints={usedHints} />

      {/* 3D Graph - Flex to fill space */}
      <View style={styles.graphContainer}>
        <Graph3D
          graphData={graphData}
          revealedNodeIds={revealedNodeIds}
          onNodePress={handleNodePress}
          renderTheme={config.renderTheme}
          isInteractive={true}
        />
      </View>

      {/* Bottom Button Bar */}
      <GuessButtonBar
        onPress={() => {
          pauseGame(); // Pause timer when modal opens
          setShowGuessModal(true);
          setLastGuessCorrect(null); // Reset guess state
        }}
        disabled={state.isGameOver}
        timeRemaining={state.timeRemaining}
        guessCount={state.guessCount}
        revealedCount={revealedCount}
        totalNodes={totalNodes}
        isPaused={state.isPaused}
      />

      {/* Modals */}
      <GuessModal
        visible={showGuessModal}
        value={guess}
        onChangeText={setGuess}
        onSubmit={handleGuessSubmit}
        onClose={() => {
          setShowGuessModal(false);
          setGuess('');
          setLastGuessCorrect(null);
          if (!state.isGameOver && !state.isWinner) {
            resumeGame(); // Resume timer if game still active
          }
        }}
        disabled={state.isGameOver}
        isCorrect={lastGuessCorrect}
        centerWord={state.centerWord}
      />
      <ColorKeyModal visible={showColorKey} onClose={() => setShowColorKey(false)} />
      <GameOverModal
        visible={state.isGameOver}
        isWinner={state.isWinner}
        centerWord={state.centerWord}
        guessCount={state.guessCount}
        revealedCount={revealedCount}
        totalNodes={totalNodes}
        score={state.score}
        solveTimeSeconds={solveTimeSeconds}
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0a0a1f',
  },
  backButton: {
    padding: 8,
  },
  backText: {
    color: '#64f4f4',
    fontSize: 16,
    fontWeight: '600',
  },
  modeBadge: {
    backgroundColor: 'rgba(100, 244, 244, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  modeText: {
    color: '#64f4f4',
    fontSize: 12,
    fontWeight: '600',
  },
  colorKeyBtn: {
    fontSize: 24,
    padding: 8,
  },
  scoreBar: {
    backgroundColor: 'rgba(100, 244, 244, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(100, 244, 244, 0.2)',
  },
  scoreText: {
    color: '#64f4f4',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  graphContainer: {
    flex: 1,
    position: 'relative',
    minHeight: 150,
  },
});

