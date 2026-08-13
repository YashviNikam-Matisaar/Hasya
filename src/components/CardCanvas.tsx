import React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';

type Props = {
  backgroundUrl: string;
  jokeText: string;
  height?: number;
  textColor?: string;
};

export default function CardCanvas({ backgroundUrl, jokeText, height = 380, textColor = '#2B1B12' }: Props) {
  return (
    <ImageBackground
      source={{ uri: backgroundUrl }}
      style={[styles.card, { height }]}
      imageStyle={styles.image}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text
          style={[styles.jokeText, { color: textColor }]}
          numberOfLines={10}
          adjustsFontSizeToFit
          minimumFontScale={0.5}
        >
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
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 30,
    textAlign: 'center',
  },
});
