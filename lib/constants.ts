import { Category, CategoryItem } from "./types";

export const categories: CategoryItem[] = [
  {
    category: "Literary Arts",
    image: "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&w=600&q=80",
    items: ["Poetry", "Short Stories", "Novels"],
  },
  {
    category: "Print Media",
    image: "https://images.unsplash.com/photo-1616873065098-9bdc6fda9c68?auto=format&fit=crop&w=600&q=80",
    items: ["Newspapers", "Magazines"],
  },
  {
    category: "Visual Arts",
    image: "https://images.unsplash.com/photo-1570804606950-8b2eb25a2d68?auto=format&fit=crop&w=600&q=80",
    items: [
      "Mural Art",
      "Contemporary Painting",
      "Sketches & Illustrations",
    ],
  },
  {
    category: "Photography",
    image: "https://images.unsplash.com/photo-1541516160071-4bb0c5af65ba?auto=format&fit=crop&w=600&q=80",
    items: ["Documentary Photography", "Artistic Photography"],
  },
  {
    category: "Media & Mixed Arts",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
    items: [
      "Film & Television",
      "Short Films",
      "Documentaries",
      "TV Serials",
    ],
  },
  {
    category: "Radio & Podcasts",
    image: "https://images.unsplash.com/photo-1627667050025-be23c83837e9?auto=format&fit=crop&w=600&q=80",
    items: [
      "Radio Plays",
      "Literary Podcasts",
    ],
  },
  {
    category: "Blogs",
    image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80",
    items: [
      "Tech Blogs",
      "Travel Blogs",
      "Lifestyle Blogs",
      "Educational Blogs",
    ],
  },
];



export const getCategoryInfo = (category: Category) => {
  const categoryMap: { [key: string]: { icon: string; color: string } } = {
    'Literary Arts': { icon: '📚', color: '#FF6B6B' },
    'Print Media': { icon: '📰', color: '#4ECDC4' },
    'Visual Arts': { icon: '🎨', color: '#45B7D1' },
    'Photography': { icon: '📸', color: '#96CEB4' },
    'Media & Mixed Arts': { icon: '🎬', color: '#FFEAA7' },
    'Radio & Podcasts': { icon: '🎵', color: '#DDA0DD' },
    'Blogs': { icon: '✍️', color: '#A0E7E5' }
  };
  return categoryMap[category] || { icon: '📄', color: '#gray' };
};

