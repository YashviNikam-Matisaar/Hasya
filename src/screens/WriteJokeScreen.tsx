import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import CardCanvas from '../components/CardCanvas';
import { createPost, updatePost } from '../lib/posts';

const MAX_LENGTH = 280;

const TEXT_COLORS = ['#2B1B12', '#FFFFFF', '#9A4C41', '#EE2D2C', '#1E4620', '#1B3A5C', '#4A2E1B'];

export default function WriteJokeScreen({ route, navigation }: any) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { template, draft } = route.params;
  const [jokeText, setJokeText] = useState(draft?.joke_text ?? '');
  const [textColor, setTextColor] = useState(draft?.text_color ?? '#2B1B12');
  const [saving, setSaving] = useState(false);

  async function handleSaveDraft() {
    if (!jokeText.trim()) {
      Alert.alert('Empty joke', 'Write something before saving as a draft.');
      return;
    }
    setSaving(true);
    const result = draft
      ? await updatePost(draft.id, { joke_text: jokeText, template_id: template.id, is_draft: true, text_color: textColor })
      : await createPost(template.id, jokeText, true, textColor);
    setSaving(false);

    if (result.error) {
      Alert.alert('Could not save draft', typeof result.error === 'string' ? result.error : result.error.message);
    } else {
      navigation.navigate('MyDrafts');
    }
  }

  function handlePreview() {
    if (!jokeText.trim()) {
      Alert.alert('Empty joke', 'Write something before previewing.');
      return;
    }
    navigation.navigate('PreviewPost', { template, jokeText, textColor, draftId: draft?.id ?? null });
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 20 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={26} color={theme.text} />
            </TouchableOpacity>
            <Text style={styles.title}>Write your joke</Text>
            <TouchableOpacity onPress={handlePreview}>
              <Text style={styles.nextLink}>Next</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardWrap}>
            <CardCanvas backgroundUrl={template.background_asset} jokeText={jokeText} height={320} textColor={textColor} />
          </View>

          <Text style={styles.colorLabel}>Text Color</Text>
          <View style={styles.colorRow}>
            {TEXT_COLORS.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setTextColor(c)}
                style={[
                  styles.swatch,
                  { backgroundColor: c },
                  textColor === c && styles.swatchSelected,
                ]}
              />
            ))}
          </View>

          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Write your joke..."
              placeholderTextColor={theme.textMuted}
              multiline
              maxLength={MAX_LENGTH}
              value={jokeText}
              onChangeText={setJokeText}
            />
            <Text style={styles.counter}>{jokeText.length}/{MAX_LENGTH}</Text>
          </View>

          <View style={styles.footerRow}>
            <TouchableOpacity style={styles.draftButton} onPress={handleSaveDraft} disabled={saving}>
              <Ionicons name="document-text-outline" size={18} color={theme.text} />
              <Text style={styles.draftButtonText}>{saving ? 'Saving…' : 'Save Draft'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.previewButton} onPress={handlePreview}>
              <Text style={styles.previewButtonText}>Preview</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16,
  },
  title: { fontSize: 17, fontWeight: '700', color: theme.text },
  nextLink: { color: theme.rust, fontWeight: '700', fontSize: 15 },
  cardWrap: { paddingHorizontal: 20, marginBottom: 16 },
  colorLabel: { fontSize: 13, color: theme.textMuted, marginLeft: 20, marginBottom: 8 },
  colorRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginBottom: 18 },
  swatch: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: theme.border },
  swatchSelected: { borderColor: theme.rust, borderWidth: 3 },
  inputWrap: { paddingHorizontal: 20 },
  input: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: theme.text,
    minHeight: 70,
    textAlignVertical: 'top',
  },
  counter: { textAlign: 'right', color: theme.textMuted, fontSize: 12, marginTop: 4 },
  footerRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  draftButton: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: theme.border,
    borderRadius: 14,
    paddingVertical: 14,
  },
  draftButtonText: { color: theme.text, fontWeight: '600', fontSize: 14 },
  previewButton: {
    flex: 1,
    backgroundColor: theme.rust,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  previewButtonText: { color: theme.white, fontWeight: '600', fontSize: 14 },
});
