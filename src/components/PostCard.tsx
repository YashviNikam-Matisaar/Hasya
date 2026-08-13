import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import CardCanvas from './CardCanvas';
import Avatar from './Avatar';
import CardMenu from './CardMenu';
import { FeedPost } from '../lib/feed';
import { isPostLikedByMe, toggleLike } from '../lib/likes';
import { supabase } from '../lib/supabase';

type Props = {
  post: FeedPost;
  onDeleted?: () => void;
};

export default function PostCard({ post, onDeleted }: Props) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.like_count);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isOwnPost, setIsOwnPost] = useState(false);

  useEffect(() => {
    isPostLikedByMe(post.id).then(setLiked);
    supabase.auth.getUser().then(({ data }) => {
      setIsOwnPost(data.user?.id === post.user_id);
    });
  }, [post.id, post.user_id]);

  async function handleLikePress() {
    const wasLiked = liked;
    // Optimistic update — feels instant, corrected below if the request fails
    setLiked(!wasLiked);
    setLikeCount((c) => (wasLiked ? Math.max(c - 1, 0) : c + 1));

    const { error } = await toggleLike(post.id, wasLiked);
    if (error) {
      // Revert on failure
      setLiked(wasLiked);
      setLikeCount((c) => (wasLiked ? c + 1 : Math.max(c - 1, 0)));
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
        <CardCanvas backgroundUrl={post.templates.background_asset} jokeText={post.joke_text} height={340} />
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.likeRow} onPress={handleLikePress}>
          <Ionicons name={liked ? 'heart' : 'heart-outline'} size={22} color={liked ? colors.coral : colors.textMuted} />
          <Text style={styles.likeCount}>{likeCount}</Text>
        </TouchableOpacity>
      </View>

      <CardMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        jokeText={post.joke_text}
        isOwnPost={isOwnPost}
        postId={post.id}
        onDeleted={onDeleted}
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
  footer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  likeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  likeCount: { fontSize: 14, color: colors.textMuted, fontWeight: '600' },
});
