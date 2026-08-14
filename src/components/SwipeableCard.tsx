import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import PostCard from './PostCard';
import { FeedPost } from '../lib/feed';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 100;

type Props = {
  post: FeedPost;
  onSwipeUp: () => void;   // like + next
  onSwipeDown: () => void; // save + next
  onSwipeRight: () => void; // skip, no action
  onSwipeLeft: () => void;  // go back
  onDeleted?: () => void;
};

export default function SwipeableCard({ post, onSwipeUp, onSwipeDown, onSwipeRight, onSwipeLeft, onDeleted }: Props) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd((e) => {
      const { translationX, translationY } = e;
      const absX = Math.abs(translationX);
      const absY = Math.abs(translationY);

      if (absX > absY && absX > SWIPE_THRESHOLD) {
        // Horizontal swipe wins
        if (translationX > 0) {
          translateX.value = withSpring(SCREEN_WIDTH, {}, () => runOnJS(onSwipeRight)());
        } else {
          translateX.value = withSpring(-SCREEN_WIDTH, {}, () => runOnJS(onSwipeLeft)());
        }
      } else if (absY > SWIPE_THRESHOLD) {
        // Vertical swipe wins
        if (translationY < 0) {
          translateY.value = withSpring(-600, {}, () => runOnJS(onSwipeUp)());
        } else {
          translateY.value = withSpring(600, {}, () => runOnJS(onSwipeDown)());
        }
      } else {
        // Not far enough — spring back to center
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(translateX.value, [-SCREEN_WIDTH, 0, SCREEN_WIDTH], [-12, 0, 12]);
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <PostCard post={post} onDeleted={onDeleted} fullScreen />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    flex: 1,
  },
});
