import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

interface GameOverModalProps {
  visible: boolean;
  isWinner: boolean;
  centerWord: string;
  guessCount: number;
  revealedCount: number;
  totalNodes: number;
  score?: number;
  solveTimeSeconds?: number | null;
  onPlayAgain: () => void;
}

export function GameOverModal({
  visible,
  isWinner,
  centerWord,
  guessCount,
  revealedCount,
  totalNodes,
  score = 0,
  solveTimeSeconds,
  onPlayAgain,
}: GameOverModalProps) {
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.emoji}>{isWinner ? '🎉' : '⏰'}</Text>
          <Text style={styles.title}>{isWinner ? 'You Won!' : "Time's Up!"}</Text>
          
          {isWinner && (
            <>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreLabel}>Final Score</Text>
                <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>
              </View>
              
              {solveTimeSeconds !== null && solveTimeSeconds !== undefined && (
                <View style={styles.timeContainer}>
                  <Text style={styles.timeLabel}>Solve Time</Text>
                  <Text style={styles.timeValue}>{formatTime(solveTimeSeconds)}</Text>
                </View>
              )}
            </>
          )}
          
          <Text style={styles.message}>
            {isWinner
              ? `You guessed "${centerWord}" in ${guessCount} tries!`
              : `The word was "${centerWord}"`}
          </Text>
          
          <Text style={styles.stats}>Revealed {revealedCount} of {totalNodes} clues</Text>
          
          <TouchableOpacity style={styles.button} onPress={onPlayAgain}>
            <Text style={styles.buttonText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    minWidth: 300,
    borderWidth: 1,
    borderColor: 'rgba(100, 244, 244, 0.3)',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(100, 244, 244, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(100, 244, 244, 0.3)',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#64f4f4',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#64f4f4',
  },
  timeContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  timeLabel: {
    fontSize: 12,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  timeValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ccc',
  },
  message: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 8,
  },
  stats: {
    fontSize: 14,
    color: '#888',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#64f4f4',
    borderRadius: 8,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  buttonText: {
    color: '#0a0a1f',
    fontWeight: '700',
    fontSize: 16,
  },
});
