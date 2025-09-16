import { Category } from "~/lib/types";
import { supabase } from './supabase';

export async function fetchContentByCategory(category: Category) {
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });
  return { data, error };
}

export async function fetchContentById(contentId: string) {
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .eq('content_id', contentId)
    .single();
  return { data, error };
}

export function categoryToBucketName(category: Category): string {
  const mapping: Record<Category, string> = {
    'Literary Arts': 'literary-arts',
    'Print Media': 'print-media',
    'Visual Arts': 'visual-arts',
    'Photography': 'photography',
    'Media & Mixed Arts': 'media-mixed-arts',
    'Radio & Podcasts': 'radio-podcasts',
    'Blogs': 'blogs',
  };
  return mapping[category];
}

export async function fetchPublicUrl(category: Category, filePath: string) {
  const bucket = categoryToBucketName(category);
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  if (!data?.publicUrl) {
    console.warn(`Failed to get public URL for "${filePath}" in bucket "${bucket}". Returning default thumbnail.`);
    return "https://ionicframework.com/docs/img/demos/thumbnail.svg";
  }

  return data.publicUrl;
}


export async function fetchFeatured() {
  const { data, error } = await supabase
    .from('content')
    .select('content_id, title, author_name, category, media_items')
    .eq('is_featured', true).order('created_at', { ascending: false });
  return { data, error };
}

export async function fetchLatest() {
  const { data, error } = await supabase
    .from('content')
    .select('content_id, created_at, title, author_name, category, tags, media_items')
    .order('created_at', { ascending: false })
    .limit(8);
  return { data, error };
}

