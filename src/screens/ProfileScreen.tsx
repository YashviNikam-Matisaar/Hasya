import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme/colors';
import Avatar from '../components/Avatar';
import { getMyProfile, Profile } from '../lib/profiles';

type TabKey = 'jokes' | 'saved';

export default function ProfileScreen({ navigation }: any) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('jokes');

  const loadProfile = useCallback(async () => {
    setLoading(true);
    const { data } = await getMyProfile();
    setProfile(data);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.rust} />
        </View>
      </SafeAreaView>
    );
  }

  if (!profile) {
    // Guest mode — no profile row exists
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.guestText}>Couldn't load your profile</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={loadProfile}
          >
            <Text style={styles.primaryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Avatar url={profile.avatar_url} name={profile.name} size={64} />
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.username}>@{profile.username}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'jokes' && styles.tabActive]}
          onPress={() => setActiveTab('jokes')}
        >
          <Text style={[styles.tabText, activeTab === 'jokes' && styles.tabTextActive]}>My Jokes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'saved' && styles.tabActive]}
          onPress={() => setActiveTab('saved')}
        >
          <Text style={[styles.tabText, activeTab === 'saved' && styles.tabTextActive]}>🔖 Saved</Text>
        </TouchableOpacity>
      </View>

      {/* Grid will populate once posts/saves exist — empty state for now */}
      <FlatList
        data={[]}
        numColumns={2}
        keyExtractor={(_, i) => String(i)}
        renderItem={null}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {activeTab === 'jokes' ? 'No jokes posted yet' : 'No saved jokes yet'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, gap: 16 },
  guestText: { fontSize: 15, color: colors.textMuted },
  primaryButton: { backgroundColor: colors.rust, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 24 },
  primaryButtonText: { color: colors.white, fontWeight: '600' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  name: { fontSize: 18, fontWeight: '700', color: colors.text },
  username: { fontSize: 14, color: colors.textMuted, marginTop: 2 },
  tabRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  tabActive: { backgroundColor: colors.primary },
  tabText: { color: colors.textMuted, fontWeight: '600', fontSize: 14 },
  tabTextActive: { color: colors.text },
  grid: { paddingHorizontal: 16, flexGrow: 1 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyText: { color: colors.textMuted, fontSize: 14 },
});
