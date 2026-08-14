import React, { useCallback, useState, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme/colors';
import SwipeableCard from '../components/SwipeableCard';
import GestureTooltipOverlay from '../components/GestureTooltipOverlay';
import Toast from '../components/Toast';
import { getFeedPosts, FeedPost } from '../lib/feed';
import { toggleLike, isPostLikedByMe } from '../lib/likes';
import { toggleSave, isPostSavedByMe } from '../lib/saves';

const TUTORIAL_SEEN_KEY = 'hasya_gesture_tutorial_seen';

export default function HomeFeedScreen({ navigation }: any) {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [toast, setToast] = useState<{ message: string; icon: any } | null>(null);
  const historyRef = useRef<number[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await getFeedPosts();
    setPosts(data ?? []);
    setCurrentIndex(0);
    historyRef.current = [];
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem(TUTORIAL_SEEN_KEY).then((seen) => {
        if (!seen) setShowTutorial(true);
      });
    }, [])
  );

  async function dismissTutorial() {
    await AsyncStorage.setItem(TUTORIAL_SEEN_KEY, 'true');
    setShowTutorial(false);
  }

  function goToNext() {
    historyRef.current.push(currentIndex);
    setCurrentIndex((i) => Math.min(i + 1, posts.length));
  }

  function goToPrevious() {
    const prev = historyRef.current.pop();
    if (prev !== undefined) {
      setCurrentIndex(prev);
    }
  }

  function handleRestart() {
    setCurrentIndex(0);
    historyRef.current = [];
  }

  const currentPost = posts[currentIndex];

  async function handleSwipeUp() {
    if (!currentPost) return;
    const wasLiked = await isPostLikedByMe(currentPost.id);
    await toggleLike(currentPost.id, wasLiked);
    setToast({ message: wasLiked ? 'Unliked' : 'Liked', icon: wasLiked ? 'heart-outline' : 'heart' });
    goToNext();
  }

  async function handleSwipeDown() {
    if (!currentPost) return;
    const wasSaved = await isPostSavedByMe(currentPost.id);
    await toggleSave(currentPost.id, wasSaved);
    setToast({ message: wasSaved ? 'Removed from Saved' : 'Saved', icon: wasSaved ? 'bookmark-outline' : 'bookmark' });
    goToNext();
  }

  function handleSwipeRight() {
    goToNext();
  }

  function handleSwipeLeft() {
    goToPrevious();
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.logo}>Hasya</Text>
        <TouchableOpacity style={styles.searchBar} onPress={() => navigation.navigate('Search')}>
          <Ionicons name="search" size={16} color={colors.textMuted} />
          <Text style={styles.searchPlaceholder}>Search jokes or users...</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.rust} />
        </View>
      ) : !currentPost ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>
            {posts.length === 0 ? 'No jokes yet — be the first to post!' : "You're all caught up!"}
          </Text>
          {posts.length > 0 && (
            <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
              <Ionicons name="refresh" size={16} color={colors.white} />
              <Text style={styles.restartButtonText}>Back to Start</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.stackArea}>
          <View style={{ flex: 1 }}>
            <SwipeableCard
              key={currentPost.id}
              post={currentPost}
              onSwipeUp={handleSwipeUp}
              onSwipeDown={handleSwipeDown}
              onSwipeRight={handleSwipeRight}
              onSwipeLeft={handleSwipeLeft}
              onDeleted={load}
            />
          </View>
        </View>
      )}

      {toast && <Toast message={toast.message} icon={toast.icon} onHide={() => setToast(null)} />}

      <GestureTooltipOverlay visible={showTutorial} onDismiss={dismissTutorial} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyText: { color: colors.textMuted, fontSize: 14, textAlign: 'center' },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10 },
  logo: { fontSize: 22, fontWeight: '800', color: colors.rust, marginBottom: 10 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchPlaceholder: { fontSize: 14, color: colors.textMuted },
  stackArea: { flex: 1 },
  counter: { textAlign: 'center', color: colors.textMuted, fontSize: 12, marginBottom: 6, fontWeight: '600' },
  restartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.rust,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  restartButtonText: { color: colors.white, fontWeight: '700', fontSize: 14 },
});
