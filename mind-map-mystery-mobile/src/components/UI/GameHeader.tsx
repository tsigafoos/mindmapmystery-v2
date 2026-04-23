import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface GameHeaderProps {
  onColorKeyPress: () => void;
}

export function GameHeader({ onColorKeyPress }: GameHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.icon}>🧠</Text>
        <Text style={styles.title}>Mind Map Mystery</Text>
      </View>
      <TouchableOpacity onPress={onColorKeyPress} style={styles.button}>
        <Text style={styles.buttonText}>🎨</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(10, 10, 31, 0.9)',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  button: {
    padding: 8,
  },
  buttonText: {
    fontSize: 20,
  },
});
