import { useState, useEffect } from "react";
import { Image, Pressable, View } from "react-native";
import { fetchPublicUrl } from "~/backend/database-functions";
import { FeaturedContent } from "~/lib/types";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "./ui/card";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { Skeleton } from "./ui/skeleton";

type ArticleCardProps = {
  item: FeaturedContent;
  isActive: boolean;
  cardWidth: number;
};

export const ArticleCard = ({ item, isActive, cardWidth }: ArticleCardProps) => {
  const [publicUrl, setPublicUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const { colorScheme } = useColorScheme();
  const isDarkColorScheme = colorScheme === 'dark';
  const router = useRouter();

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      if (item?.media_items?.[0]?.storagePath) {
        try {
          const defaultPath = item.media_items[0].thumbnailPath ?? item.media_items[0].storagePath;
          const url = await fetchPublicUrl(item.category, defaultPath);
          setPublicUrl(url);
        } catch (error) {
          console.error('Error fetching public URL:', error);
        }
      }
      setLoading(false);
    };
    fetchContent();
  }, [item]);

  const handleContentPress = (id: string) => { // Added type for id
    router.push({
      pathname: '/content/[id]',
      params: { id: id }
    });
  };

  if (loading) {
    return (
      <View className="flex flex-row items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <View className="gap-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </View>
      </View>
    )
  }

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
            className="lg:h-[500px]"
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
      </Card>
    </Pressable>
  );
};
