import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GameScreen } from './src/components/GameScreen';

type Screen = 'login' | 'select' | 'game';
type GameMode = 'solo' | 'friend' | 'daily';

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <KeyboardAvoidingView
      style={loginStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={loginStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={loginStyles.header}>
          <Text style={loginStyles.icon}>🧠</Text>
          <Text style={loginStyles.title}>Mind Map Mystery</Text>
          <Text style={loginStyles.subtitle}>Sign in to play</Text>
        </View>

        <View style={loginStyles.form}>
          <Text style={loginStyles.label}>Email</Text>
          <TextInput
            style={loginStyles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={loginStyles.label}>Password</Text>
          <TextInput
            style={loginStyles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor="#666"
            secureTextEntry
          />

          <TouchableOpacity
            style={[loginStyles.button, (!email.trim() || !password.trim()) && loginStyles.buttonDisabled]}
            onPress={() => email.trim() && password.trim() && onLogin()}
            disabled={!email.trim() || !password.trim()}
          >
            <Text style={loginStyles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1f',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
  },
  form: {
    gap: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ccc',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(100, 244, 244, 0.3)',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#64f4f4',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: '#333',
  },
  buttonText: {
    color: '#0a0a1f',
    fontSize: 18,
    fontWeight: '700',
  },
});

// Mode Selection Screen
function ModeSelect({ onSelect }: { onSelect: (mode: GameMode) => void }) {
  return (
    <View style={selectStyles.container}>
      <View style={selectStyles.header}>
        <Text style={selectStyles.icon}>🎯</Text>
        <Text style={selectStyles.title}>Select Mode</Text>
      </View>

      <TouchableOpacity style={[selectStyles.card, { borderColor: '#64f4f4' }]} onPress={() => onSelect('solo')}>
        <Text style={selectStyles.cardIcon}>🎮</Text>
        <View>
          <Text style={selectStyles.cardTitle}>Solo Play</Text>
          <Text style={selectStyles.cardDesc}>Challenge yourself</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={[selectStyles.card, { borderColor: '#f464f4' }]} onPress={() => onSelect('friend')}>
        <Text style={selectStyles.cardIcon}>👥</Text>
        <View>
          <Text style={selectStyles.cardTitle}>Play with Friend</Text>
          <Text style={selectStyles.cardDesc}>Compete together</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={[selectStyles.card, { borderColor: '#a464f4' }]} onPress={() => onSelect('daily')}>
        <Text style={selectStyles.cardIcon}>📅</Text>
        <View>
          <Text style={selectStyles.cardTitle}>Daily Puzzle</Text>
          <Text style={selectStyles.cardDesc}>New puzzle every day</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const selectStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1f',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    gap: 16,
  },
  cardIcon: {
    fontSize: 32,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  cardDesc: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
});

// Main App
export default function App() {
  const [screen, setScreen] = useState<Screen>('login');
  const [mode, setMode] = useState<GameMode>('solo');

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {screen === 'login' && <LoginScreen onLogin={() => setScreen('select')} />}
      {screen === 'select' && <ModeSelect onSelect={(m) => { setMode(m); setScreen('game'); }} />}
      {screen === 'game' && <GameScreen mode={mode} onBack={() => setScreen('select')} />}
    </SafeAreaProvider>
  );
}
