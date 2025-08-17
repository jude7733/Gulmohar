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

// Fetch raw storage file (download)
export async function fetchStorage(url: string, category: Category) {
  const { data, error } = await supabase.storage
    .from(category)
    .download(`${category}/${url}`);
  return { data, error };
}

// Get public URL for storage file
export function getStorageUrl(category: Category, filePath: string): string | undefined {
  const fullPath = `${category}/${filePath}`;
  const { data } = supabase.storage
    .from(category)
    .getPublicUrl(fullPath);
  return data.publicUrl;
}

