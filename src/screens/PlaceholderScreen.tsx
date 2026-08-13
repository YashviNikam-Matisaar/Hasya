import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function PlaceholderScreen({ route }: any) {
  const label = route?.name ?? 'Screen';
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{label}</Text>
      <Text style={styles.subtext}>Coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 20, fontWeight: '700', color: colors.text },
  subtext: { fontSize: 14, color: colors.textMuted, marginTop: 6 },
});
