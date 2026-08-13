import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import PostCard from '../components/PostCard';
import Avatar from '../components/Avatar';
import { supabase } from '../lib/supabase';

type UserResult = { id: string; username: string; name: string; avatar_url: string | null };
type PostResult = any; // FeedPost shape, reused loosely here

export default function SearchScreen({ navigation }: any) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserResult[]>([]);
  const [posts, setPosts] = useState<PostResult[]>([]);
  const [searched, setSearched] = useState(false);

  async function handleSearch(text: string) {
    setQuery(text);
    if (!text.trim()) {
      setUsers([]);
      setPosts([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);

    const [userRes, postRes] = await Promise.all([
      supabase.from('users').select('*').ilike('username', `%${text}%`).limit(10),
      supabase
        .from('posts')
        .select('*, templates(background_asset), users!posts_user_id_fkey(username, name, avatar_url)')
        .eq('is_draft', false)
        .ilike('joke_text', `%${text}%`)
        .limit(20),
    ]);

    setUsers(userRes.data ?? []);
    setPosts(postRes.data ?? []);
    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jokes or people..."
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={handleSearch}
            autoFocus
          />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.rust} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            users.length > 0 ? (
              <View style={styles.usersSection}>
                {users.map((u) => (
                  <View key={u.id} style={styles.userRow}>
                    <Avatar url={u.avatar_url} name={u.name} size={36} />
                    <View style={{ marginLeft: 10 }}>
                      <Text style={styles.userName}>{u.name}</Text>
                      <Text style={styles.userHandle}>@{u.username}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : null
          }
          renderItem={({ item }) => <PostCard post={item} />}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
          ListEmptyComponent={
            searched ? (
              <View style={styles.centered}>
                <Text style={styles.emptyText}>No results found</Text>
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyText: { color: colors.textMuted, fontSize: 14 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10 },
  searchBar: {
    flex: 1,
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
  usersSection: { paddingHorizontal: 16, paddingBottom: 8 },
  userRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  userName: { fontSize: 14, fontWeight: '700', color: colors.text },
  userHandle: { fontSize: 12, color: colors.textMuted },
});
