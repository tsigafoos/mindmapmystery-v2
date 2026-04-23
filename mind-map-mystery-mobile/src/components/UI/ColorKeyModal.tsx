import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import { CATEGORY_BASE_COLORS, getCategoryLabel, rgbToString } from '../../utils/thematicColors';
import type { WordCategory } from '../../types/game';

const CATEGORIES: { key: WordCategory; label: string }[] = [
  { key: 'biology', label: 'Biology / Nature' },
  { key: 'technology', label: 'Technology' },
  { key: 'sports', label: 'Sports / Movement' },
  { key: 'food', label: 'Food / Cooking' },
  { key: 'arts', label: 'Arts / Culture' },
  { key: 'business', label: 'Business / Strategy' },
  { key: 'science', label: 'Science / Physics' },
  { key: 'abstract', label: 'Abstract / Emotions' },
  { key: 'uncategorized', label: 'General' },
];

interface ColorKeyModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ColorKeyModal({ visible, onClose }: ColorKeyModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
        <View style={styles.modal} onStartShouldSetResponder={() => true}>
          <Text style={styles.title}>Thematic Colors</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {CATEGORIES.map(({ key, label }) => {
              const color = rgbToString(CATEGORY_BASE_COLORS[key]);
              return (
                <View key={key} style={styles.row}>
                  <View style={[styles.dot, { backgroundColor: color }]} />
                  <Text style={styles.label}>{label}</Text>
                </View>
              );
            })}
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    minWidth: 280,
    maxHeight: '70%',
    borderWidth: 1,
    borderColor: 'rgba(100, 244, 244, 0.3)',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  label: {
    color: '#ccc',
    fontSize: 14,
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: 'rgba(100, 244, 244, 0.2)',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  closeText: {
    color: '#64f4f4',
    fontWeight: '600',
  },
});
