import { supabase } from './supabase';
 
export type FeedPost = {
  id: string;
  user_id: string;
  template_id: string;
  joke_text: string;
  like_count: number;
  created_at: string;
  text_color?: string;
  templates: { background_asset: string } | null;
  users: { username: string; name: string; avatar_url: string | null } | null;
};
 
export async function getFeedPosts(): Promise<{ data: FeedPost[] | null; error: any }> {
  const { data, error } = await supabase
    .from('posts')
    .select('*, templates(background_asset), users!posts_user_id_fkey(username, name, avatar_url)')
    .eq('is_draft', false)
    .order('created_at', { ascending: false });
 
  return { data, error };
}