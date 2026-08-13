import React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

type Props = {
  backgroundUrl: string;
  jokeText: string;
  height?: number;
};

export default function CardCanvas({ backgroundUrl, jokeText, height = 380 }: Props) {
  return (
    <ImageBackground
      source={{ uri: backgroundUrl }}
      style={[styles.card, { height }]}
      imageStyle={styles.image}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.jokeText} numberOfLines={12}>
          {jokeText || 'Your joke will appear here…'}
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  image: {
    borderRadius: 20,
  },
  overlay: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  jokeText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 28,
    textAlign: 'center',
  },
});
