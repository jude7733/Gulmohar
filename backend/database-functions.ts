import { Category } from "~/lib/types";
import { supabase } from './supabase';

// Fetch content by category
export async function fetchContentByCategory(category: Category) {
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });
  return { data, error };
}

// Fetch content by ID
export async function fetchContentById(contentId: string) {
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .eq('content_id', contentId)
    .single();
  return { data, error };
}

// Fetch raw storage file (download)
export async function fetchStorage(url: string, category: Category) {
  const { data, error } = await supabase.storage
    .from(category)
    .download(`${category}/${url}`);
  return { data, error };
}
