import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme/colors';
import PostCard from '../components/PostCard';
import GestureTooltipOverlay from '../components/GestureTooltipOverlay';
import { getFeedPosts, FeedPost } from '../lib/feed';

const TUTORIAL_SEEN_KEY = 'hasya_gesture_tutorial_seen';

export default function HomeFeedScreen() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  const load = useCallback(async () => {
  const { data, error } = await getFeedPosts();
  if (error) console.log('Feed error:', error);
  setPosts(data ?? []);
  setLoading(false);
  setRefreshing(false);
}, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  // One-time gesture tutorial — will actually matter once swipe gestures
  // are layered on in the next build phase; wired now so it's ready.
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

  function handleRefresh() {
    setRefreshing(true);
    load();
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.logo}>Hasya</Text>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jokes or users..."
            placeholderTextColor={colors.textMuted}
            editable={false}
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.rust} />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PostCard post={item} onDeleted={load} />}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No jokes yet — be the first to post!</Text>
            </View>
          }
        />
      )}

      <GestureTooltipOverlay visible={showTutorial} onDismiss={dismissTutorial} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyText: { color: colors.textMuted, fontSize: 14, textAlign: 'center', paddingHorizontal: 40 },
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
  searchInput: { flex: 1, fontSize: 14, color: colors.text },
});
