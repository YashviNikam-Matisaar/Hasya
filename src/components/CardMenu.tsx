import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Share, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { deletePost } from '../lib/posts';

type Props = {
  visible: boolean;
  onClose: () => void;
  jokeText: string;
  isOwnPost: boolean;
  postId: string;
  onDeleted?: () => void;
  onShareCardImage?: () => void | Promise<void>;
};

export default function CardMenu({ visible, onClose, jokeText, isOwnPost, postId, onDeleted, onShareCardImage }: Props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  async function handleShareCard() {
    onClose();
    // Captures the actual rendered card and opens the native share sheet
    // (WhatsApp, Instagram, etc. all show up automatically as image-share targets).
    await onShareCardImage?.();
  }

  async function handleShareLink() {
    onClose();
    await Share.share({ message: `Check out this joke on Hasya: hasya://post/${postId}` });
  }

  async function handleCopyText() {
    await Clipboard.setStringAsync(jokeText);
    onClose();
    Alert.alert('Copied', 'Joke text copied to clipboard.');
  }

  function handleDelete() {
    onClose();
    Alert.alert('Delete this joke?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deletePost(postId);
          onDeleted?.();
        },
      },
    ]);
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <View style={styles.sheet}>
          <TouchableOpacity style={styles.row} onPress={handleShareCard}>
            <Ionicons name="share-social-outline" size={20} color={theme.text} />
            <Text style={styles.rowText}>Share Card</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} onPress={handleShareLink}>
            <Ionicons name="link-outline" size={20} color={theme.text} />
            <Text style={styles.rowText}>Share Link</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} onPress={handleCopyText}>
            <Ionicons name="copy-outline" size={20} color={theme.text} />
            <Text style={styles.rowText}>Copy Text</Text>
          </TouchableOpacity>
          {isOwnPost && (
            <TouchableOpacity style={styles.row} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={20} color={theme.coral} />
              <Text style={[styles.rowText, { color: theme.coral }]}>Delete</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.cancelRow} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: theme.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  rowText: { fontSize: 15, color: theme.text, fontWeight: '500' },
  cancelRow: {
    marginTop: 8,
    paddingVertical: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  cancelText: { fontSize: 15, color: theme.textMuted, fontWeight: '600' },
});
