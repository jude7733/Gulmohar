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
  image: string;
  items: string[];
}

export type MediaItem = {
  type: "pdf" | "video" | "audio" | "image";
  storagePath: string;
  title?: string;
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
