import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { colors } from '../theme/colors';
import CardCanvas from './CardCanvas';
import Avatar from './Avatar';
import CardMenu from './CardMenu';
import { FeedPost } from '../lib/feed';
import { isPostLikedByMe } from '../lib/likes';
import { isPostSavedByMe } from '../lib/saves';
import { supabase } from '../lib/supabase';

type Props = {
  post: FeedPost;
  onDeleted?: () => void;
  fullScreen?: boolean; // used by the swipeable Home Feed — image fills the available space, gestures replace manual buttons
};

export default function PostCard({ post, onDeleted, fullScreen = false }: Props) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [isOwnPost, setIsOwnPost] = useState(false);
  const viewShotRef = useRef<ViewShot>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setIsOwnPost(data.user?.id === post.user_id);
    });
  }, [post.id, post.user_id]);

  async function handleShareCardImage() {
    try {
      const uri = await viewShotRef.current?.capture?.();
      if (!uri) return;

      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert('Sharing not available', 'Your device cannot share files right now.');
        return;
      }
      await Sharing.shareAsync(uri, { mimeType: 'image/png' });
    } catch (err) {
      Alert.alert('Could not share card', 'Something went wrong while creating the image.');
    }
  }

  if (fullScreen) {
    return (
      <View style={styles.fullScreenContainer}>
        {post.templates && (
          <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }} style={styles.fullScreenShot}>
            <CardCanvas
              backgroundUrl={post.templates.background_asset}
              jokeText={post.joke_text}
              height={undefined}
              fillHeight
              textColor={post.text_color}
            />
          </ViewShot>
        )}

        {/* Poster info + menu overlaid on the card itself */}
        <View style={styles.overlayHeader}>
          <Avatar url={post.users?.avatar_url} name={post.users?.name} size={34} />
          <Text style={styles.overlayName}>{post.users?.name ?? 'Unknown'}</Text>
          <TouchableOpacity onPress={() => setMenuVisible(true)} hitSlop={10}>
            <Ionicons name="ellipsis-horizontal" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>

        <CardMenu
          visible={menuVisible}
          onClose={() => setMenuVisible(false)}
          jokeText={post.joke_text}
          isOwnPost={isOwnPost}
          postId={post.id}
          onDeleted={onDeleted}
          onShareCardImage={handleShareCardImage}
        />
      </View>
    );
  }

  // Normal (non-fullscreen) layout — used in Search results
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar url={post.users?.avatar_url} name={post.users?.name} size={36} />
        <Text style={styles.name}>{post.users?.name ?? 'Unknown'}</Text>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {post.templates && (
        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
          <CardCanvas backgroundUrl={post.templates.background_asset} jokeText={post.joke_text} height={340} textColor={post.text_color} />
        </ViewShot>
      )}

      <CardMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        jokeText={post.joke_text}
        isOwnPost={isOwnPost}
        postId={post.id}
        onDeleted={onDeleted}
        onShareCardImage={handleShareCardImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20, paddingHorizontal: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  name: { flex: 1, fontSize: 14, fontWeight: '700', color: colors.text },

  fullScreenContainer: { flex: 1 },
  fullScreenShot: { flex: 1, borderRadius: 0 },
  overlayHeader: {
    position: 'absolute',
    top: 14,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    zIndex: 10,
  },
  overlayName: {
    flex: 1,
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowRadius: 4,
  },
});
