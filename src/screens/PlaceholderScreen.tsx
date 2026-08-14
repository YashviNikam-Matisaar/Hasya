import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function PlaceholderScreen({ route }: any) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const label = route?.name ?? 'Screen';
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{label}</Text>
      <Text style={styles.subtext}>Coming soon</Text>
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 20, fontWeight: '700', color: theme.text },
  subtext: { fontSize: 14, color: theme.textMuted, marginTop: 6 },
});
