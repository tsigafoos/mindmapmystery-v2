import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

interface GuessButtonBarProps {
  onPress: () => void;
  disabled: boolean;
  timeRemaining: number;
  guessCount: number;
  revealedCount: number;
  totalNodes: number;
  isPaused?: boolean;
}

export function GuessButtonBar({
  onPress,
  disabled,
  timeRemaining,
  guessCount,
  revealedCount,
  totalNodes,
  isPaused = false,
}: GuessButtonBarProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.statsRow}>
        <View style={styles.timerContainer}>
          <Text style={[styles.timer, isPaused && styles.timerPaused]}>
            {formatTime(timeRemaining)}
          </Text>
          {isPaused && <Text style={styles.pausedLabel}>PAUSED</Text>}
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Guesses</Text>
          <Text style={styles.statValue}>{guessCount}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Clues</Text>
          <Text style={styles.statValue}>{revealedCount}/{totalNodes}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.guessButton, disabled && styles.guessButtonDisabled]}
        onPress={onPress}
        disabled={disabled}
      >
        <Text style={styles.guessButtonText}>Make Guess</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0a0a1f',
    borderTopWidth: 1,
    borderTopColor: 'rgba(100, 244, 244, 0.3)',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'android' ? 24 : 16,
    minHeight: 100,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timer: {
    color: '#64f4f4',
    fontSize: 20,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  timerPaused: {
    color: '#f4c864',
  },
  pausedLabel: {
    color: '#f4c864',
    fontSize: 10,
    fontWeight: '700',
    backgroundColor: 'rgba(244, 200, 100, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#888',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  guessButton: {
    backgroundColor: '#64f4f4',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  guessButtonDisabled: {
    backgroundColor: '#444',
  },
  guessButtonText: {
    color: '#0a0a1f',
    fontSize: 18,
    fontWeight: '700',
  },
});
