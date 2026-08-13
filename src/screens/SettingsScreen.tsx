import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { signOut } from '../lib/auth';

function Row({ icon, label, onPress, danger }: { icon: any; label: string; onPress: () => void; danger?: boolean }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <Ionicons name={icon} size={20} color={danger ? colors.coral : colors.text} style={{ width: 28 }} />
      <Text style={[styles.rowLabel, danger && { color: colors.coral }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

export default function SettingsScreen({ navigation }: any) {
  async function handleLogout() {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 26 }} />
      </View>

      <Text style={styles.sectionLabel}>ACCOUNT</Text>
      <View style={styles.section}>
        <Row icon="person-outline" label="Account Details" onPress={() => navigation.navigate('EditProfile')} />
        <Row icon="lock-closed-outline" label="Change Password" onPress={() => navigation.navigate('ForgotPassword')} />
      </View>

      <Text style={styles.sectionLabel}>OTHER</Text>
      <View style={styles.section}>
        <Row icon="log-out-outline" label="Log Out" onPress={handleLogout} danger />
      </View>

      <Text style={styles.version}>Hasya v1.0.0</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  title: { fontSize: 18, fontWeight: '700', color: colors.text },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    marginLeft: 20,
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  section: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    borderRadius: 14,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLabel: { flex: 1, fontSize: 15, color: colors.text },
  version: { textAlign: 'center', color: colors.textMuted, fontSize: 12, marginTop: 40 },
});
