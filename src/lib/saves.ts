import { supabase } from './supabase';

export async function isPostSavedByMe(postId: string): Promise<boolean> {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return false;

  const { data } = await supabase
    .from('saves')
    .select('post_id')
    .eq('post_id', postId)
    .eq('user_id', authData.user.id)
    .maybeSingle();

  return !!data;
}

export async function toggleSave(postId: string, currentlySaved: boolean) {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { error: 'Not logged in' };

  if (currentlySaved) {
    const { error } = await supabase
      .from('saves')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', authData.user.id);
    return { error };
  } else {
    const { error } = await supabase
      .from('saves')
      .insert({ post_id: postId, user_id: authData.user.id });
    return { error };
  }
}

export async function getMySavedPosts() {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { data: null, error: 'Not logged in' };

  const { data, error } = await supabase
    .from('saves')
    .select('post_id, posts(*, templates(background_asset))')
    .eq('user_id', authData.user.id)
    .order('created_at', { ascending: false });

  return { data, error };
}
