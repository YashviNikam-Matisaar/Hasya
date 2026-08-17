import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import PostCard from './PostCard';
import { FeedPost } from '../lib/feed';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = 100;
// Exit distance is 1.5x the screen so the card is always fully, visibly gone
// before the next one appears underneath — no lingering corner left on screen.
const EXIT_X = SCREEN_WIDTH * 1.5;
const EXIT_Y = SCREEN_HEIGHT * 1.5;

type Props = {
  post: FeedPost;
  onSwipeUp: () => void;   // like + next
  onSwipeDown: () => void; // save + next
  onSwipeRight: () => void; // skip, no action
  onSwipeLeft: () => void;  // go back
  onDeleted?: () => void;
  canGoBack: boolean; // when false, a left-swipe just springs back instead of exiting into nothing
};

export default function SwipeableCard({ post, onSwipeUp, onSwipeDown, onSwipeRight, onSwipeLeft, onDeleted, canGoBack }: Props) {
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

      // withTiming gives a fixed, predictable exit — always fully off-screen,
      // unlike withSpring which can settle just short of the target.
      const exitConfig = { duration: 220 };

      if (absX > absY && absX > SWIPE_THRESHOLD) {
        if (translationX > 0) {
          translateX.value = withTiming(EXIT_X, exitConfig, () => runOnJS(onSwipeRight)());
        } else if (canGoBack) {
          translateX.value = withTiming(-EXIT_X, exitConfig, () => runOnJS(onSwipeLeft)());
        } else {
          // No previous card to go back to — spring back instead of
          // leaving an exited card with nothing behind it.
          translateX.value = withSpring(0);
        }
      } else if (absY > SWIPE_THRESHOLD) {
        if (translationY < 0) {
          translateY.value = withTiming(-EXIT_Y, exitConfig, () => runOnJS(onSwipeUp)());
        } else {
          translateY.value = withTiming(EXIT_Y, exitConfig, () => runOnJS(onSwipeDown)());
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
