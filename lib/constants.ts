import { CategoryItem } from "./types";

export const NAV_THEME = {
  light: {
    background: 'hsl(0 0% 100%)', // background
    border: 'hsl(240 5.9% 90%)', // border
    card: 'hsl(0 0% 100%)', // card
    notification: 'hsl(0 84.2% 60.2%)', // destructive
    primary: 'hsl(240 5.9% 10%)', // primary
    text: 'hsl(240 10% 3.9%)', // foreground
  },
  dark: {
    background: 'hsl(240 10% 3.9%)', // background
    border: 'hsl(240 3.7% 15.9%)', // border
    card: 'hsl(240 10% 3.9%)', // card
    notification: 'hsl(0 72% 51%)', // destructive
    primary: 'hsl(0 0% 98%)', // primary
    text: 'hsl(0 0% 98%)', // foreground
  },
};


export const categories: CategoryItem[] = [
  {
    category: "Literary Arts",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    items: ["Poetry", "Short Stories", "Novels"],
  },
  {
    category: "Print Media",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
    items: ["Newspapers", "Magazines"],
  },
  {
    category: "Visual Arts",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600&q=80",
    items: [
      "Mural Art",
      "Contemporary Painting",
      "Sketches & Illustrations",
    ],
  },
  {
    category: "Photography",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
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
