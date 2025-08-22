import { useState, useEffect } from "react";
import { Image, Pressable } from "react-native";
import { fetchPublicUrl } from "~/backend/database-functions";
import { FeaturedContent } from "~/lib/types";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "./ui/card";
import { useColorScheme } from "~/lib/useColorScheme";
import { Text } from "./ui/text";
import { useRouter } from "expo-router";

type ArticleCardProps = {
  item: FeaturedContent;
  isActive: boolean;
  cardWidth: number;
};

export const ArticleCard = ({ item, isActive, cardWidth }: ArticleCardProps) => {
  // State for the image URL now lives inside each card, which is correct.
  const [publicUrl, setPublicUrl] = useState<string>("");
  const { isDarkColorScheme } = useColorScheme();
  const router = useRouter();

  // This useEffect fetches the image URL for this specific card when it mounts.
  useEffect(() => {
    const fetchContent = async () => {
      if (item?.media_items?.[0]?.storagePath) {
        try {
          const defaultPath = item.media_items[0].thumbnailPath ?? item.media_items[0].storagePath;
          console.log("Fetching public URL for:", item.category, defaultPath);
          const url = await fetchPublicUrl(item.category, defaultPath);
          setPublicUrl(url);
          console.log("Fetched public URL:", url);
        } catch (error) {
          console.error('Error fetching public URL:', error);
        }
      }
    };
    fetchContent();
  }, [item]); // Dependency array ensures this runs if the item changes.

  const handleContentPress = (id: string) => { // Added type for id
    router.push({
      pathname: '/content/[detail]',
      params: { id: id }
    });
  };

  return (
    <Pressable onPress={() => handleContentPress(item.content_id)} style={{ width: cardWidth, marginHorizontal: 8 }}>
      <Card
        style={{
          backgroundColor: isActive ? (isDarkColorScheme ? '#1f2937' : '#fff') : (isDarkColorScheme ? '#374151' : '#f9fafb'),
          borderRadius: 12,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 5,
        }}
      >
        <CardHeader>
          <Image
            source={{ uri: publicUrl || undefined }} // Use the state variable here
            style={{ width: '100%', height: 356, backgroundColor: isDarkColorScheme ? '#4b5563' : '#e5e7eb' }}
            resizeMode="cover"
          />
        </CardHeader>
        <CardContent style={{ padding: 16 }}>
          <CardTitle numberOfLines={2} style={{ fontSize: 20, fontWeight: 'bold', color: isDarkColorScheme ? '#fff' : '#111827', marginBottom: 8 }}>
            {item.title}
          </CardTitle>
          <CardDescription style={{ fontSize: 14, color: isDarkColorScheme ? '#9ca3af' : '#6b7280', marginBottom: 6 }}>
            By {item.author_name}
          </CardDescription>
          <CardDescription numberOfLines={2} style={{ fontSize: 14, color: isDarkColorScheme ? '#d1d5db' : '#4b5563' }}>
            {item.title}
          </CardDescription>
        </CardContent>
        <CardContent style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <Pressable
            // Note: You probably intended to pass the content_id here, not the whole item object.
            onPress={() => handleContentPress(item.content_id)}
            style={{
              backgroundColor: '#3b82f6',
              paddingVertical: 10,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>Read Full Article</Text>
          </Pressable>
        </CardContent>
      </Card>
    </Pressable>
  );
};
