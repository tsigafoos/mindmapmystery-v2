import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Hint {
  id: number;
  text: string;
  icon: string;
}

interface HintsBarProps {
  usedHintIds: number[];
  onHintPress: (hintId: number) => void;
}

const HINTS: Hint[] = [
  { id: 1, text: 'First letter', icon: 'A' },
  { id: 2, text: 'Random word', icon: '?' },
  { id: 3, text: 'Word length', icon: '#' },
];

export function HintsBar({ usedHintIds, onHintPress }: HintsBarProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Hints:</Text>
      <View style={styles.chips}>
        {HINTS.map(hint => {
          const used = usedHintIds.includes(hint.id);
          return (
            <TouchableOpacity
              key={hint.id}
              style={[styles.chip, used && styles.chipUsed]}
              onPress={() => !used && onHintPress(hint.id)}
              disabled={used}
            >
              <Text style={styles.chipIcon}>{hint.icon}</Text>
              <Text style={[styles.chipText, used && styles.chipTextUsed]}>{hint.text}</Text>
              {used && <Text style={styles.check}>✓</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(10, 10, 31, 0.8)',
  },
  label: {
    color: '#64f4f4',
    fontSize: 14,
    marginRight: 12,
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(100, 244, 244, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(100, 244, 244, 0.4)',
  },
  chipUsed: {
    backgroundColor: 'rgba(100, 100, 100, 0.3)',
    borderColor: 'rgba(100, 100, 100, 0.5)',
  },
  chipIcon: {
    color: '#64f4f4',
    fontSize: 14,
    marginRight: 4,
    fontWeight: '700',
  },
  chipText: {
    color: '#fff',
    fontSize: 12,
  },
  chipTextUsed: {
    color: '#888',
  },
  check: {
    color: '#64f4c8',
    marginLeft: 4,
  },
});
