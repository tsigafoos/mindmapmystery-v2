import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface GuessInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  timeRemaining: number;
  guessCount: number;
  revealedCount: number;
  totalNodes: number;
}

export function GuessInput({
  value,
  onChangeText,
  onSubmit,
  disabled,
  timeRemaining,
  guessCount,
  revealedCount,
  totalNodes,
}: GuessInputProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.statsRow}>
        <Text style={styles.timer}>{formatTime(timeRemaining)}</Text>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Guesses</Text>
          <Text style={styles.statValue}>{guessCount}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Clues</Text>
          <Text style={styles.statValue}>{revealedCount}/{totalNodes}</Text>
        </View>
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder="What's the mystery word?"
          placeholderTextColor="#666"
          editable={!disabled}
          maxLength={20}
          onSubmitEditing={onSubmit}
          returnKeyType="go"
        />
        <TouchableOpacity
          style={[styles.button, (!value.trim() || disabled) && styles.buttonDisabled]}
          onPress={onSubmit}
          disabled={!value.trim() || disabled}
        >
          <Text style={styles.buttonText}>Guess</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(10, 10, 31, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(100, 244, 244, 0.2)',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timer: {
    color: '#64f4f4',
    fontSize: 18,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#888',
    fontSize: 10,
  },
  statValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(100, 244, 244, 0.3)',
  },
  button: {
    backgroundColor: '#64f4f4',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#444',
  },
  buttonText: {
    color: '#0a0a1f',
    fontWeight: '700',
    fontSize: 16,
  },
});
