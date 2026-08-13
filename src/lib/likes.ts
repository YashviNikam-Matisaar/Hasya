import { supabase } from './supabase';

export async function isPostLikedByMe(postId: string): Promise<boolean> {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return false;

  const { data } = await supabase
    .from('likes')
    .select('post_id')
    .eq('post_id', postId)
    .eq('user_id', authData.user.id)
    .maybeSingle();

  return !!data;
}

export async function toggleLike(postId: string, currentlyLiked: boolean) {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { error: 'Not logged in' };

  if (currentlyLiked) {
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', authData.user.id);
    return { error };
  } else {
    const { error } = await supabase
      .from('likes')
      .insert({ post_id: postId, user_id: authData.user.id });
    return { error };
  }
}