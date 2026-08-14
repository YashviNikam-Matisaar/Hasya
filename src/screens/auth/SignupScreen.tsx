import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { signUp, isUsernameAvailable } from '../../lib/auth';

export default function SignupScreen({ navigation }: any) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    if (!name || !username || !email || !password) {
      Alert.alert('Missing info', 'Please fill in all fields.');
      return;
    }

    const cleanUsername = username.trim().replace(/^@/, '').toLowerCase();

    setLoading(true);

    const { available } = await isUsernameAvailable(cleanUsername);
    if (!available) {
      setLoading(false);
      Alert.alert('Username taken', 'Please choose a different username.');
      return;
    }

    const { error } = await signUp(email, password, cleanUsername, name);
    setLoading(false);

    if (error) {
      Alert.alert('Signup failed', error.message);
    } else {
      Alert.alert('Account created', 'Check your email to confirm your account before logging in.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={26} color={theme.text} />
          </TouchableOpacity>

          <Text style={styles.title}>Create Account</Text>

          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarLetter}>{name ? name[0].toUpperCase() : '?'}</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Your Name"
              placeholderTextColor={theme.textMuted}
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="@username"
              placeholderTextColor={theme.textMuted}
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="something@example.com"
              placeholderTextColor={theme.textMuted}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={styles.passwordInput}
                placeholder="password"
                placeholderTextColor={theme.textMuted}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color={theme.textMuted} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={handleSignup} disabled={loading}>
              <Text style={styles.primaryButtonText}>{loading ? 'Creating…' : 'Sign Up'}</Text>
            </TouchableOpacity>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.footerLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background, paddingHorizontal: 24 },
  backButton: { marginTop: 8, marginBottom: 8 },
  backText: { fontSize: 28, color: theme.text },
  title: { fontSize: 26, fontWeight: '700', color: theme.text, marginBottom: 20 },
  avatarPlaceholder: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: theme.border,
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center', marginBottom: 20,
  },
  avatarLetter: { fontSize: 28, color: theme.textMuted, fontWeight: '600' },
  form: { gap: 6 },
  label: { fontSize: 13, color: theme.textMuted, marginTop: 14, marginBottom: 6 },
  input: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: theme.text,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: theme.text,
  },
  eyeButton: {
    padding: 4,
  },
  primaryButton: {
    backgroundColor: theme.rust,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  primaryButtonText: { color: theme.white, fontSize: 16, fontWeight: '600' },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { color: theme.textMuted, fontSize: 14 },
  footerLink: { color: theme.rust, fontSize: 14, fontWeight: '700' },
});
