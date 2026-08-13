import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { sendPasswordReset } from '../../lib/auth';

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    if (!email) {
      Alert.alert('Missing info', 'Please enter your email.');
      return;
    }
    setLoading(true);
    const { error } = await sendPasswordReset(email);
    setLoading(false);
    if (error) {
      Alert.alert('Something went wrong', error.message);
    } else {
      Alert.alert('Check your email', 'We sent you a reset link.');
      navigation.goBack();
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={26} color={colors.text} />
      </TouchableOpacity>

      <Text style={styles.title}>Forgot Password</Text>

      <View style={styles.iconCircle}>
        <Text style={styles.iconText}>✉️</Text>
      </View>

      <Text style={styles.description}>
        Enter your email or phone and we'll send you a reset link.
      </Text>

      <Text style={styles.label}>Email or Phone</Text>
      <TextInput
        style={styles.input}
        placeholder="something@example.com"
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity style={styles.primaryButton} onPress={handleReset} disabled={loading}>
        <Text style={styles.primaryButtonText}>{loading ? 'Sending…' : 'Send Reset Link'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 20 }}>
        <Text style={styles.footerLink}>Back to Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 24 },
  backButton: { marginTop: 8, marginBottom: 8 },
  backText: { fontSize: 28, color: colors.text },
  title: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 24 },
  iconCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center', marginBottom: 20,
  },
  iconText: { fontSize: 28 },
  description: { fontSize: 14, color: colors.textMuted, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  label: { fontSize: 13, color: colors.textMuted, marginBottom: 6 },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.text,
  },
  primaryButton: {
    backgroundColor: colors.rust,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  primaryButtonText: { color: colors.white, fontSize: 16, fontWeight: '600' },
  footerLink: { color: colors.rust, fontSize: 14, fontWeight: '700', textAlign: 'center' },
});
