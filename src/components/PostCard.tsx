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
import { isPostLikedByMe, toggleLike } from '../lib/likes';
import { isPostSavedByMe, toggleSave } from '../lib/saves';
import { supabase } from '../lib/supabase';

type Props = {
  post: FeedPost;
  onDeleted?: () => void;
};

export default function PostCard({ post, onDeleted }: Props) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(post.like_count);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isOwnPost, setIsOwnPost] = useState(false);
  const viewShotRef = useRef<ViewShot>(null);

  useEffect(() => {
    isPostLikedByMe(post.id).then(setLiked);
    isPostSavedByMe(post.id).then(setSaved);
    supabase.auth.getUser().then(({ data }) => {
      setIsOwnPost(data.user?.id === post.user_id);
    });
  }, [post.id, post.user_id]);

  async function handleLikePress() {
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((c) => (wasLiked ? Math.max(c - 1, 0) : c + 1));

    const { error } = await toggleLike(post.id, wasLiked);
    if (error) {
      setLiked(wasLiked);
      setLikeCount((c) => (wasLiked ? c + 1 : Math.max(c - 1, 0)));
    }
  }

  async function handleSavePress() {
    const wasSaved = saved;
    setSaved(!wasSaved);
    const { error } = await toggleSave(post.id, wasSaved);
    if (error) setSaved(wasSaved);
  }

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

      <View style={styles.footer}>
        <TouchableOpacity style={styles.likeRow} onPress={handleLikePress}>
          <Ionicons name={liked ? 'heart' : 'heart-outline'} size={22} color={liked ? colors.coral : colors.textMuted} />
          <Text style={styles.likeCount}>{likeCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSavePress}>
          <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={20} color={saved ? colors.rust : colors.textMuted} />
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

const styles = StyleSheet.create({
  container: { marginBottom: 20, paddingHorizontal: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  name: { flex: 1, fontSize: 14, fontWeight: '700', color: colors.text },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  likeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  likeCount: { fontSize: 14, color: colors.textMuted, fontWeight: '600' },
});
