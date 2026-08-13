import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { getMyDrafts, deletePost, Post } from '../lib/posts';

export default function MyDraftsScreen({ navigation }: any) {
  const [drafts, setDrafts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await getMyDrafts();
    setDrafts(data ?? []);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  function handleEdit(draft: Post) {
    if (!draft.templates) return;
    navigation.navigate('WriteJoke', { template: draft.templates, draft });
  }

  function handlePreview(draft: Post) {
    if (!draft.templates) return;
    navigation.navigate('PreviewPost', { template: draft.templates, jokeText: draft.joke_text, draftId: draft.id });
  }

  function handleDelete(draft: Post) {
    Alert.alert('Delete draft?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deletePost(draft.id);
          load();
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>My Drafts</Text>
        <View style={{ width: 26 }} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.rust} />
        </View>
      ) : (
        <FlatList
          data={drafts}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.grid}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No drafts yet</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.tile}>
              <TouchableOpacity onPress={() => handlePreview(item)}>
                <Image source={{ uri: item.templates?.background_asset }} style={styles.tileImage} />
                <View style={styles.tileTextOverlay}>
                  <Text style={styles.tileText} numberOfLines={3}>{item.joke_text}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.tileActions}>
                <TouchableOpacity onPress={() => handleEdit(item)} style={styles.tileActionButton}>
                  <Ionicons name="create-outline" size={16} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item)} style={styles.tileActionButton}>
                  <Ionicons name="trash-outline" size={16} color={colors.coral} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyText: { color: colors.textMuted, fontSize: 14 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16,
  },
  title: { fontSize: 17, fontWeight: '700', color: colors.text },
  grid: { paddingHorizontal: 14, paddingBottom: 20 },
  tile: {
    flex: 1,
    margin: 6,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: colors.card,
  },
  tileImage: { width: '100%', aspectRatio: 0.8, resizeMode: 'cover' },
 tileTextOverlay: {
  position: 'absolute',
  top: 0, left: 0, right: 0, bottom: 0,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 10,
},
  tileText: { color: colors.white, fontSize: 11, fontWeight: '600' },
  tileActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 4,
    padding: 6,
  },
  tileActionButton: { padding: 6 },
});
