import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getTemplates, Template } from '../lib/posts';

export default function TemplatePickerScreen({ navigation }: any) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await getTemplates();
      if (data) setTemplates(data);
      setLoading(false);
    })();
  }, []);

  function handleNext() {
    const selected = templates.find((t) => t.id === selectedId);
    if (!selected) return;
    navigation.navigate('WriteJoke', { template: selected });
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.rust} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Choose a Template</Text>
        <TouchableOpacity onPress={() => navigation.navigate('MyDrafts')}>
          <Ionicons name="document-text-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={templates}
        numColumns={3}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => {
          const isSelected = item.id === selectedId;
          return (
            <TouchableOpacity
              style={[styles.tile, isSelected && styles.tileSelected]}
              onPress={() => setSelectedId(item.id)}
            >
              <Image source={{ uri: item.background_asset }} style={styles.tileImage} />
              {isSelected && (
                <View style={styles.checkBadge}>
                  <Ionicons name="checkmark" size={14} color={theme.white} />
                </View>
              )}
            </TouchableOpacity>
          );
        }}
      />

      <TouchableOpacity
        style={[styles.nextButton, !selectedId && styles.nextButtonDisabled]}
        onPress={handleNext}
        disabled={!selectedId}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16,
  },
  title: { fontSize: 17, fontWeight: '700', color: theme.text },
  grid: { paddingHorizontal: 16, paddingBottom: 16 },
  tile: {
  width: '30%',
  aspectRatio: 1,
  margin: '1.5%',
  borderRadius: 14,
  overflow: 'hidden',
  borderWidth: 2,
  borderColor: 'transparent',
},
  tileSelected: {
    borderColor: theme.rust,
  },
  tileImage: { width: '100%', height: '100%', resizeMode:"cover" },
  checkBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: theme.rust,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButton: {
    backgroundColor: theme.rust,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  nextButtonDisabled: { opacity: 0.4 },
  nextButtonText: { color: theme.white, fontSize: 16, fontWeight: '600' },
});
