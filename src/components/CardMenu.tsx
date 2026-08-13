import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Share, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { deletePost } from '../lib/posts';

type Props = {
  visible: boolean;
  onClose: () => void;
  jokeText: string;
  isOwnPost: boolean;
  postId: string;
  onDeleted?: () => void;
};

export default function CardMenu({ visible, onClose, jokeText, isOwnPost, postId, onDeleted }: Props) {
  async function handleShareCard() {
    onClose();
    // Native OS share sheet — WhatsApp, Instagram, and everything else
    // installed on the phone shows up here automatically, no separate integration needed.
    await Share.share({ message: `${jokeText}\n\n— shared from Hasya` });
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
            <Ionicons name="share-social-outline" size={20} color={colors.text} />
            <Text style={styles.rowText}>Share Card</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} onPress={handleShareLink}>
            <Ionicons name="link-outline" size={20} color={colors.text} />
            <Text style={styles.rowText}>Share Link</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} onPress={handleCopyText}>
            <Ionicons name="copy-outline" size={20} color={colors.text} />
            <Text style={styles.rowText}>Copy Text</Text>
          </TouchableOpacity>
          {isOwnPost && (
            <TouchableOpacity style={styles.row} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={20} color={colors.coral} />
              <Text style={[styles.rowText, { color: colors.coral }]}>Delete</Text>
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

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.card,
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
  rowText: { fontSize: 15, color: colors.text, fontWeight: '500' },
  cancelRow: {
    marginTop: 8,
    paddingVertical: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelText: { fontSize: 15, color: colors.textMuted, fontWeight: '600' },
});
