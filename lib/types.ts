export type Category =
  | 'Literary Arts'
  | 'Print Media'
  | 'Visual Arts'
  | 'Photography'
  | 'Media & Mixed Arts'
  | 'Radio & Podcasts'
  | 'Blogs';

export type CategoryItem = {
  category: Category;
  value: string;
  image: string;
  items: string[];
  mutedDark: string;
  mutedLight: string;
  vibrantColor: string;
}

export type MediaItem = {
  type: "pdf" | "video" | "audio" | "image";
  storagePath: string;
  title?: string;
  thumbnailPath?: string;
};

export interface ContentItem {
  content_id: string;
  title: string;
  author_name: string;
  department: string;
  category: Category;
  body: string;
  created_at: Date;
  media_items: MediaItem[];
  is_featured: boolean;
  tags: string[];
}

export type FeaturedContent = {
  content_id: string;
  title: string;
  author_name: string;
  category: Category;
  media_items: MediaItem[];
}

export type UpdateItem = {
  id: string;
  title: string;
  desc: string;
  link: string;
  created_at: Date;
}
