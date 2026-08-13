import { supabase } from './supabase';

export type Template = {
  id: string;
  name: string;
  background_asset: string;
};

export type Post = {
  id: string;
  user_id: string;
  template_id: string;
  joke_text: string;
  is_draft: boolean;
  like_count: number;
  created_at: string;
  text_color?: string;
  templates?: Template;
};

export async function getTemplates(): Promise<{ data: Template[] | null; error: any }> {
  const { data, error } = await supabase.from('templates').select('*').order('name');
  return { data, error };
}

export async function createPost(templateId: string, jokeText: string, isDraft: boolean, textColor: string = '#2B1B12') {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { data: null, error: 'Not logged in' };

  const { data, error } = await supabase
    .from('posts')
    .insert({
      user_id: authData.user.id,
      template_id: templateId,
      joke_text: jokeText,
      is_draft: isDraft,
      text_color: textColor,
    })
    .select()
    .single();

  return { data, error };
}

export async function updatePost(postId: string, updates: { joke_text?: string; template_id?: string; is_draft?: boolean; text_color?: string }) {
  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', postId)
    .select()
    .single();
  return { data, error };
}

export async function deletePost(postId: string) {
  const { error } = await supabase.from('posts').delete().eq('id', postId);
  return { error };
}

export async function getMyDrafts(): Promise<{ data: Post[] | null; error: any }> {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { data: null, error: 'Not logged in' };

  const { data, error } = await supabase
    .from('posts')
    .select('*, templates(*)')
    .eq('user_id', authData.user.id)
    .eq('is_draft', true)
    .order('created_at', { ascending: false });

  return { data, error };
}

export async function getMyPosts(): Promise<{ data: Post[] | null; error: any }> {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { data: null, error: 'Not logged in' };

  const { data, error } = await supabase
    .from('posts')
    .select('*, templates(*)')
    .eq('user_id', authData.user.id)
    .eq('is_draft', false)
    .order('created_at', { ascending: false });

  return { data, error };
}
