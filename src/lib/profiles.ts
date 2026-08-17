import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';

export type Profile = {
  id: string;
  username: string;
  name: string;
  avatar_url: string | null;
  role: string;
};

export async function getMyProfile(): Promise<{ data: Profile | null; error: any }> {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { data: null, error: 'Not logged in' };

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  return { data, error };
}

export async function updateMyProfile(updates: { name?: string; username?: string; avatar_url?: string }) {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { data: null, error: 'Not logged in' };

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', authData.user.id)
    .select()
    .single();

  return { data, error };
}

// Uploads a local image (from expo-image-picker) to the "avatars" bucket,
// stored under {user_id}/avatar.jpg so RLS storage policies can match on folder name.
export async function uploadAvatar(localUri: string): Promise<{ url: string | null; error: any }> {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { url: null, error: 'Not logged in' };

  try {
    const base64 = await FileSystem.readAsStringAsync(localUri, { encoding: FileSystem.EncodingType.Base64 });
    const path = `${authData.user.id}/avatar.jpg`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, decode(base64), { contentType: 'image/jpeg', upsert: true });

    if (uploadError) return { url: null, error: uploadError };

    const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(path);
    // Cache-bust so the new photo shows immediately instead of a stale cached image
    const bustedUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;

    return { url: bustedUrl, error: null };
  } catch (err) {
    return { url: null, error: err };
  }
}
