import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

type GameMode = 'solo' | 'friend' | 'daily';

interface ModeSelectionScreenProps {
  onSelectMode: (mode: GameMode) => void;
}

const MODES = [
  {
    id: 'solo' as GameMode,
    title: 'Solo Play',
    description: 'Challenge yourself with random puzzles at your own pace',
    icon: '🎯',
    color: '#64f4f4',
  },
  {
    id: 'friend' as GameMode,
    title: 'Play with a Friend',
    description: 'Compete head-to-head in real-time multiplayer',
    icon: '👥',
    color: '#f464f4',
  },
  {
    id: 'daily' as GameMode,
    title: 'Daily Puzzle',
    description: 'One new puzzle every day. Same puzzle for everyone!',
    icon: '📅',
    color: '#a464f4',
  },
];

export function ModeSelectionScreen({ onSelectMode }: ModeSelectionScreenProps) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.icon}>🧠</Text>
        <Text style={styles.title}>Choose Game Mode</Text>
        <Text style={styles.subtitle}>How would you like to play?</Text>
      </View>

      {/* Mode Cards */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.cardsContainer}
        showsVerticalScrollIndicator={false}
      >
        {MODES.map((mode) => (
          <TouchableOpacity
            key={mode.id}
            style={[styles.card, { borderColor: mode.color }]}
            onPress={() => onSelectMode(mode.id)}
            activeOpacity={0.8}
          >
            {/* Card Glow Effect */}
            <View style={[styles.glow, { backgroundColor: mode.color }]} />
            
            {/* Card Content */}
            <View style={styles.cardContent}>
              <Text style={styles.cardIcon}>{mode.icon}</Text>
              <Text style={styles.cardTitle}>{mode.title}</Text>
              <Text style={styles.cardDescription}>{mode.description}</Text>
            </View>

            {/* Arrow indicator */}
            <View style={[styles.arrow, { backgroundColor: mode.color }]}>
              <Text style={styles.arrowText}>→</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity>
          <Text style={styles.settingsLink}>⚙️ Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.logoutLink}>Log out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1f',
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
  },
  scrollView: {
    flex: 1,
  },
  cardsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    borderWidth: 2,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    opacity: 0.15,
  },
  cardContent: {
    flex: 1,
  },
  cardIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
  },
  arrow: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    color: '#0a0a1f',
    fontSize: 20,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(100, 244, 244, 0.1)',
  },
  settingsLink: {
    color: '#888',
    fontSize: 14,
  },
  logoutLink: {
    color: '#f464f4',
    fontSize: 14,
  },
});
