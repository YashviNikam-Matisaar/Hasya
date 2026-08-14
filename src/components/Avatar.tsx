import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

type Props = {
  url?: string | null;
  name?: string | null;
  size?: number;
};

export default function Avatar({ url, name, size = 64 }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const initial = (name?.trim()?.[0] ?? '?').toUpperCase();

  if (url) {
    return (
      <Image
        source={{ uri: url }}
        style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
      />
    );
  }

  return (
    <View style={[styles.fallback, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.initial, { fontSize: size * 0.4 }]}>{initial}</Text>
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  image: { backgroundColor: theme.border },
  fallback: {
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: { color: theme.white, fontWeight: '700' },
});
