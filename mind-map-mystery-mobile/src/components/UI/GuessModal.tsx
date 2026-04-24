import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface GuessModalProps {
  visible: boolean;
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  disabled: boolean;
  isCorrect?: boolean | null; // null = not guessed yet, true = correct, false = wrong
  centerWord?: string;
}

export function GuessModal({
  visible,
  value,
  onChangeText,
  onSubmit,
  onClose,
  disabled,
  isCorrect = null,
  centerWord = '',
}: GuessModalProps) {
  const [showPenalty, setShowPenalty] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Focus input and show keyboard when modal opens
  useEffect(() => {
    if (visible) {
      // Small delay to ensure modal is rendered before focusing
      const focusTimer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(focusTimer);
    }
  }, [visible]);

  // Flash penalty when guess is wrong
  useEffect(() => {
    if (isCorrect === false) {
      setShowPenalty(true);
      const timer = setTimeout(() => {
        setShowPenalty(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isCorrect]);

  const handleSubmit = () => {
    if (!value.trim() || disabled) return;
    onSubmit();
  };

  // If correct, show celebration instead of input
  if (isCorrect === true) {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={[styles.modal, styles.winModal]}>
            <Text style={styles.winEmoji}>🎉</Text>
            <Text style={styles.winTitle}>Correct!</Text>
            <Text style={styles.winWord}>"{centerWord}"</Text>
            <Text style={styles.winSubtitle}>You solved it!</Text>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.centeredContainer}
        >
          <View style={styles.modal}>
            {/* Penalty Flash */}
            {showPenalty && (
              <View style={styles.penaltyFlash}>
                <Text style={styles.penaltyText}>❌ Wrong! -5 seconds</Text>
              </View>
            )}

            <Text style={styles.title}>What's the mystery word?</Text>
            <Text style={styles.subtitle}>Enter your guess below</Text>

            <TextInput
              ref={inputRef}
              style={[styles.input, showPenalty && styles.inputError]}
              value={value}
              onChangeText={onChangeText}
              placeholder="Type your guess..."
              placeholderTextColor="#666"
              editable={!disabled}
              maxLength={20}
              onSubmitEditing={handleSubmit}
              returnKeyType="go"
              keyboardType="default"
              autoCapitalize="none"
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.guessButton, (!value.trim() || disabled) && styles.guessButtonDisabled]}
                onPress={handleSubmit}
                disabled={!value.trim() || disabled}
              >
                <Text style={styles.guessText}>Guess</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredContainer: {
    width: '100%',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 32,
    width: '85%',
    maxWidth: 340,
    borderWidth: 2,
    borderColor: 'rgba(100, 244, 244, 0.4)',
    shadowColor: '#64f4f4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  winModal: {
    borderColor: 'rgba(100, 244, 100, 0.6)',
    shadowColor: '#64f464',
    alignItems: 'center',
  },
  penaltyFlash: {
    position: 'absolute',
    top: -50,
    left: 0,
    right: 0,
    backgroundColor: '#ff4444',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  penaltyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    color: '#fff',
    fontSize: 18,
    borderWidth: 1,
    borderColor: 'rgba(100, 244, 244, 0.4)',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputError: {
    borderColor: '#ff4444',
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelText: {
    color: '#ccc',
    fontSize: 16,
    fontWeight: '600',
  },
  guessButton: {
    flex: 1,
    backgroundColor: '#64f4f4',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  guessButtonDisabled: {
    backgroundColor: '#444',
  },
  guessText: {
    color: '#0a0a1f',
    fontSize: 16,
    fontWeight: '700',
  },
  winEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  winTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#64f464',
    marginBottom: 8,
  },
  winWord: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  winSubtitle: {
    fontSize: 16,
    color: '#888',
  },
});
