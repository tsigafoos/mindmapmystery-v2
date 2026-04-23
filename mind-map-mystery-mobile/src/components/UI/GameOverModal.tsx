import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

interface GameOverModalProps {
  visible: boolean;
  isWinner: boolean;
  centerWord: string;
  guessCount: number;
  revealedCount: number;
  totalNodes: number;
  onPlayAgain: () => void;
}

export function GameOverModal({
  visible,
  isWinner,
  centerWord,
  guessCount,
  revealedCount,
  totalNodes,
  onPlayAgain,
}: GameOverModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.emoji}>{isWinner ? '🎉' : '⏰'}</Text>
          <Text style={styles.title}>{isWinner ? 'You Won!' : "Time's Up!"}</Text>
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
    padding: 24,
    alignItems: 'center',
    minWidth: 280,
    borderWidth: 1,
    borderColor: 'rgba(100, 244, 244, 0.3)',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
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
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#64f4f4',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  buttonText: {
    color: '#0a0a1f',
    fontWeight: '700',
    fontSize: 16,
  },
});
