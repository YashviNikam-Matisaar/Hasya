import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

type Props = {
  message: string;
  icon: any;
  onHide: () => void;
};

export default function Toast({ message, icon, onHide }: Props) {
  useEffect(() => {
    const timer = setTimeout(onHide, 1200);
    return () => clearTimeout(timer);
  }, [onHide]);

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.container} pointerEvents="none">
      <View style={styles.pill}>
        <Ionicons name={icon} size={16} color={colors.white} />
        <Text style={styles.text}>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
  },
  text: { color: colors.white, fontWeight: '600', fontSize: 13 },
});
