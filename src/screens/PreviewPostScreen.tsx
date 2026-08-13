import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import CardCanvas from '../components/CardCanvas';
import { createPost, updatePost } from '../lib/posts';

export default function PreviewPostScreen({ route, navigation }: any) {
  const { template, jokeText, textColor, draftId } = route.params;
  const [posting, setPosting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  async function handlePost() {
    setPosting(true);
    const result = draftId
      ? await updatePost(draftId, { joke_text: jokeText, template_id: template.id, is_draft: false, text_color: textColor })
      : await createPost(template.id, jokeText, false, textColor);
    setPosting(false);

    if (result.error) {
      Alert.alert('Could not post', typeof result.error === 'string' ? result.error : result.error.message);
      return;
    }

    Alert.alert('Posted!', 'Your joke is live.', [
      { text: 'OK', onPress: () => navigation.popToTop() },
    ]);
  }

  async function handleSaveDraft() {
    setSavingDraft(true);
    const result = draftId
      ? await updatePost(draftId, { joke_text: jokeText, template_id: template.id, is_draft: true, text_color: textColor })
      : await createPost(template.id, jokeText, true, textColor);
    setSavingDraft(false);

    if (result.error) {
      Alert.alert('Could not save draft', typeof result.error === 'string' ? result.error : result.error.message);
      return;
    }

    navigation.navigate('MyDrafts');
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Preview</Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.cardWrap}>
        <CardCanvas backgroundUrl={template.background_asset} jokeText={jokeText} height={380} textColor={textColor} />
      </View>

      <View style={styles.footerRow}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Text style={styles.iconButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={handleSaveDraft} disabled={savingDraft}>
          <Text style={styles.iconButtonText}>{savingDraft ? 'Saving…' : 'Save Draft'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.postButton} onPress={handlePost} disabled={posting}>
          <Text style={styles.postButtonText}>{posting ? 'Posting…' : 'Post'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16,
  },
  title: { fontSize: 17, fontWeight: '700', color: colors.text },
  cardWrap: { paddingHorizontal: 20, flex: 1, justifyContent: 'center' },
  footerRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  iconButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  iconButtonText: { color: colors.text, fontWeight: '600', fontSize: 13 },
  postButton: {
    flex: 1,
    backgroundColor: colors.rust,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  postButtonText: { color: colors.white, fontWeight: '600', fontSize: 13 },
});
