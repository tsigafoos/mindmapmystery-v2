import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import type { RevealedClue } from '../../types/game';
import { categorizeWord, getCategoryLabel, rgbToString, getNodeColor } from '../../utils/thematicColors';

interface HintCardsSidebarProps {
  usedHints: { id: number; text: string; result: string }[];
  revealedClues: RevealedClue[];
}

export function HintCardsSidebar({ usedHints, revealedClues }: HintCardsSidebarProps) {
  const hasContent = usedHints.length > 0 || revealedClues.length > 0;
  if (!hasContent) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Hints</Text>
        <Text style={styles.count}>{usedHints.length + revealedClues.length}</Text>
      </View>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {usedHints.map((hint) => (
          <View key={`hint-${hint.id}`} style={[styles.hintCard, styles.hintCardFlipped]}>
            <Text style={styles.hintLabel}>{hint.text}</Text>
            <Text style={styles.hintValue}>{hint.result}</Text>
          </View>
        ))}
        {revealedClues
          .sort((a, b) => b.relationshipStrength - a.relationshipStrength)
          .map((clue, index) => {
            const category = categorizeWord(clue.word);
            const color = rgbToString(getNodeColor(category, clue.relationshipStrength, false, false));
            return (
              <View key={`clue-${index}`} style={styles.clueCard}>
                <Text style={styles.clueWord}>{clue.word}</Text>
                <Text style={[styles.clueCategory, { color }]}>{getCategoryLabel(category)}</Text>
                <Text style={styles.clueStrength}>{Math.round(clue.relationshipStrength * 100)}%</Text>
              </View>
            );
          })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 104,
    bottom: 100,
    width: 140,
    backgroundColor: 'rgba(10, 10, 31, 0.9)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(100, 244, 244, 0.2)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(100, 244, 244, 0.2)',
  },
  headerText: {
    color: '#fff',
    fontWeight: '600',
  },
  count: {
    color: '#64f4f4',
    backgroundColor: 'rgba(100, 244, 244, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 6,
    fontSize: 12,
  },
  scroll: {
    padding: 8,
  },
  hintCard: {
    backgroundColor: 'rgba(164, 100, 244, 0.3)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  hintCardFlipped: {
    backgroundColor: 'rgba(100, 244, 196, 0.2)',
  },
  hintLabel: {
    color: '#888',
    fontSize: 10,
    marginBottom: 4,
  },
  hintValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  clueCard: {
    backgroundColor: 'rgba(100, 244, 244, 0.15)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#64f4f4',
  },
  clueWord: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  clueCategory: {
    fontSize: 10,
    marginTop: 2,
  },
  clueStrength: {
    color: '#888',
    fontSize: 10,
    marginTop: 2,
  },
});
