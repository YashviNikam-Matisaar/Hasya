import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from '../lib/auth';
import { useTheme } from '../context/ThemeContext'; // ✅ Import the theme hook

// ✅ Regular Row with chevron
function Row({ icon, label, onPress, danger }: { icon: any; label: string; onPress: () => void; danger?: boolean }) {
  const { theme } = useTheme(); // Get theme inside the component
  return (
    <TouchableOpacity style={[styles.row, { borderBottomColor: theme.border }]} onPress={onPress}>
      <Ionicons name={icon} size={20} color={danger ? theme.coral : theme.text} style={{ width: 28 }} />
      <Text style={[styles.rowLabel, danger && { color: theme.coral }, { color: danger ? theme.coral : theme.text }]}>
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
    </TouchableOpacity>
  );
}

// ✅ NEW Toggle Row for Dark Mode
function ToggleRow({ icon, label, value, onValueChange }: { icon: any; label: string; value: boolean; onValueChange: () => void }) {
  const { theme } = useTheme();
  return (
    <View style={[styles.row, { borderBottomColor: theme.border }]}>
      <Ionicons name={icon} size={20} color={theme.text} style={{ width: 28 }} />
      <Text style={[styles.rowLabel, { color: theme.text }]}>{label}</Text>
      <Switch
        trackColor={{ false: theme.border, true: theme.rust }}
        thumbColor={value ? theme.white : theme.textMuted}
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );
}

export default function SettingsScreen({ navigation }: any) {
  const { theme, isDarkMode, toggleTheme } = useTheme(); // ✅ Get theme and toggle function

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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
        <View style={{ width: 26 }} />
      </View>

      <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>ACCOUNT</Text>
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Row icon="person-outline" label="Account Details" onPress={() => navigation.navigate('EditProfile')} />
        <Row icon="lock-closed-outline" label="Change Password" onPress={() => navigation.navigate('ForgotPassword')} />
      </View>

      {/* ✅ Add the Dark Mode toggle below here */}
      <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>PREFERENCES</Text>
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <ToggleRow 
          icon="moon-outline" 
          label="Dark Mode" 
          value={isDarkMode} 
          onValueChange={toggleTheme} 
        />
      </View>

      <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>OTHER</Text>
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Row icon="log-out-outline" label="Log Out" onPress={handleLogout} danger />
      </View>

      <Text style={[styles.version, { color: theme.textMuted }]}>Hasya v1.0.0</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  title: { fontSize: 18, fontWeight: '700' },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 20,
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  section: {
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
  },
  rowLabel: { flex: 1, fontSize: 15 },
  version: { textAlign: 'center', fontSize: 12, marginTop: 40 },
});