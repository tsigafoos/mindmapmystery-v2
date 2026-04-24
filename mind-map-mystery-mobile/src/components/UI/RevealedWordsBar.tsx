import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { RevealedClue } from '../../types/game';
import { categorizeWord, getNodeColor, rgbToHex } from '../../utils/thematicColors';

interface RevealedWordsBarProps {
  revealedClues: RevealedClue[];
  usedHints?: { id: number; text: string; result: string }[];
}

export function RevealedWordsBar({ revealedClues, usedHints = [] }: RevealedWordsBarProps) {
  const hasContent = revealedClues.length > 0 || usedHints.length > 0;
  if (!hasContent) return null;

  return (
    <View style={styles.container}>
      <View style={styles.chipsWrapper}>
        {/* Used Hints */}
        {usedHints.map((hint, index) => (
          <View key={`hint-${hint.id}`} style={[styles.chip, styles.hintChip]}>
            <Text style={styles.hintLabel}>{hint.text}</Text>
            <Text style={styles.hintValue}>{hint.result}</Text>
          </View>
        ))}

        {/* Revealed Words */}
        {revealedClues
          .sort((a, b) => b.relationshipStrength - a.relationshipStrength)
          .map((clue, index) => {
            const category = categorizeWord(clue.word);
            const color = rgbToHex(getNodeColor(category, clue.relationshipStrength, false, false));
            return (
              <View key={`clue-${index}`} style={[styles.chip, styles.wordChip, { borderLeftColor: color }]}>
                <Text style={styles.wordText}>{clue.word}</Text>
                <Text style={[styles.strengthText, { color }]}>
                  {Math.round(clue.relationshipStrength * 100)}%
                </Text>
              </View>
            );
          })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(10, 10, 31, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(100, 244, 244, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  chipsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  hintChip: {
    backgroundColor: 'rgba(164, 100, 244, 0.25)',
    borderLeftWidth: 3,
    borderLeftColor: '#a464f4',
  },
  hintLabel: {
    color: '#c8a4f4',
    fontSize: 11,
    fontWeight: '500',
  },
  hintValue: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  wordChip: {
    backgroundColor: 'rgba(100, 244, 244, 0.15)',
    borderLeftWidth: 3,
  },
  wordText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  strengthText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
