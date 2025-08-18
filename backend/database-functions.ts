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

function categoryToBucketName(category: Category): string {
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
  console.log(bucket)

  return data.publicUrl;
}
