import { Category, CategoryItem } from "./types";

export const categories: CategoryItem[] = [
  {
    category: "Literary Arts",
    image: "https://rvxwbisktphfyibdcfcd.supabase.co/storage/v1/object/public/assets/Literary%20Arts.png",
    items: ["Poetry", "Short Stories", "Novels"],
    mutedDark: "#271b19",
    mutedLight: "#cfb086",
    vibrantColor: "#bd9064",
  },
  {
    category: "Visual Arts",
    image: "https://rvxwbisktphfyibdcfcd.supabase.co/storage/v1/object/public/assets/Visual%20Arts.png",
    items: [
      "Mural Art",
      "Painting",
      "Illustrations"
    ],
    mutedDark: "#3b6188",
    mutedLight: "#7ca8ad",
    vibrantColor: "#96755a",

  },
  {
    category: "Print Media",
    image: "https://rvxwbisktphfyibdcfcd.supabase.co/storage/v1/object/public/assets/Print%20Media.png",
    items: ["Newspapers", "Magazines", "Publications"],
    mutedDark: "#3e3332",
    mutedLight: "#948c7c",
    vibrantColor: "#837058",
  },
  {
    category: "Photography",
    image: "https://rvxwbisktphfyibdcfcd.supabase.co/storage/v1/object/public/assets/Photography.png",
    items: ["Artistic Photography", "Portraits"],
    mutedDark: "#2f3440",
    mutedLight: "#b7babb",
    vibrantColor: "#6d767d",
  },
  {
    category: "Media & Mixed Arts",
    image: "https://rvxwbisktphfyibdcfcd.supabase.co/storage/v1/object/public/assets/Media%20&%20Mixed%20Arts.png",
    items: [
      "Film & Television",
      "Short Films",
      "Documentaries",
    ],
    mutedDark: "#1b2d53",
    mutedLight: "#c59dc4",
    vibrantColor: "#397eb9",
  },
  {
    category: "Radio & Podcasts",
    image: "https://rvxwbisktphfyibdcfcd.supabase.co/storage/v1/object/public/assets/Radio%20&%20Podcasts.png",
    items: [
      "Radio Plays",
      "Podcasts",
      "Interviews",
    ],
    mutedDark: "#312935",
    mutedLight: "#4dc3de",
    vibrantColor: "#a76765",
  },
  {
    category: "Blogs",
    image: "https://rvxwbisktphfyibdcfcd.supabase.co/storage/v1/object/public/assets/Blogs.png",
    items: [
      "Travel Blogs",
      "Lifestyle Blogs",
    ],
    mutedDark: "#565960",
    mutedLight: "#6462a8",
    vibrantColor: "#442d3e",
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


export const contacts = [
  { name: 'Fr Varghese paul', phone: '+91 95626 86623' },
  { name: 'Karun k', phone: '+91 98475 30608' },
];

import type { ScaledSize } from "react-native";
import { Dimensions, Platform } from "react-native";

export const HEADER_HEIGHT = 100;

export const ElementsText = {
  AUTOPLAY: "AutoPlay",
};

const isWeb = Platform.OS === "web";
const isDesktop = isWeb && Dimensions.get("window").width >= 1024;

export const MAX_WIDTH = isDesktop ? 800 : 400;

export const window: ScaledSize = isWeb
  ? { width: MAX_WIDTH, height: 800, scale: 1, fontScale: 1 }
  : Dimensions.get("screen");
