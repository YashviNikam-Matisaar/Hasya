import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';
import Avatar from '../components/Avatar';
import { getMyProfile, updateMyProfile, uploadAvatar } from '../lib/profiles';

export default function EditProfileScreen({ navigation }: any) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await getMyProfile();
      if (data) {
        setName(data.name);
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
      }
      setLoading(false);
    })();
  }, []);

  async function handleChangePhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow photo access to set a profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled || !result.assets?.[0]) return;

    setUploadingPhoto(true);
    const { url, error } = await uploadAvatar(result.assets[0].uri);
    setUploadingPhoto(false);

    if (error) {
      Alert.alert('Upload failed', typeof error === 'string' ? error : error.message ?? 'Something went wrong.');
      return;
    }

    if (url) {
      setAvatarUrl(url);
      // Persist immediately so a photo change isn't lost if the user backs out without saving
      await updateMyProfile({ avatar_url: url });
    }
  }

  async function handleSave() {
    if (!name || !username) {
      Alert.alert('Missing info', 'Name and username cannot be empty.');
      return;
    }
    setSaving(true);
    const { error } = await updateMyProfile({ name, username });
    setSaving(false);
    if (error) {
      Alert.alert('Could not save', typeof error === 'string' ? error : error.message);
    } else {
      navigation.goBack();
    }
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
        <Text style={styles.title}>Account Details</Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.avatarSection}>
        <Avatar url={avatarUrl} name={name} size={88} />
        <TouchableOpacity style={styles.changePhoto} onPress={handleChangePhoto} disabled={uploadingPhoto}>
          {uploadingPhoto ? (
            <ActivityIndicator size="small" color={theme.rust} />
          ) : (
            <Text style={styles.changePhotoText}>Change Photo</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor={theme.textMuted} />

      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="username"
        placeholderTextColor={theme.textMuted}
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
        <Text style={styles.saveButtonText}>{saving ? 'Saving…' : 'Save Changes'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background, paddingHorizontal: 20 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 12, paddingBottom: 16,
  },
  title: { fontSize: 18, fontWeight: '700', color: theme.text },
  avatarSection: { alignItems: 'center', marginBottom: 24, gap: 10 },
  changePhoto: { paddingVertical: 4 },
  changePhotoText: { color: theme.rust, fontWeight: '600', fontSize: 14 },
  label: { fontSize: 13, color: theme.textMuted, marginBottom: 6, marginTop: 14 },
  input: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: theme.text,
  },
  saveButton: {
    backgroundColor: theme.rust,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 28,
  },
  saveButtonText: { color: theme.white, fontSize: 16, fontWeight: '600' },
});
