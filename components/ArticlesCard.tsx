import { useState, useEffect } from "react";
import { Pressable, View } from "react-native";
import { fetchPublicUrl } from "~/backend/database-functions";
import { FeaturedContent } from "~/lib/types";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "./ui/card";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { Image } from 'expo-image';
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
      <View className="flex-1">
        <Skeleton className="h-[800px] w-full rounded-md" />
      </View>
    )
  }

  return (
    <Pressable onPress={() => handleContentPress(item.content_id)} style={{ width: cardWidth, marginHorizontal: 8 }}>
      <Card
        style={{
          backgroundColor: isActive ? (isDarkColorScheme ? '#2c2a4a' : '#ddd6fe') : (isDarkColorScheme ? '#374151' : '#f9fafb'),
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
            source={{ uri: publicUrl || undefined }}
            style={{ width: '100%', height: 356 }}
            className="lg:h-[700px]"
            contentFit="cover"
          />
        </CardHeader>
        <CardContent style={{ padding: 16 }} className="flex flex-col items-center justify-start">
          <CardTitle numberOfLines={2} style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>
            {item.title}
          </CardTitle>
          <CardDescription style={{ fontSize: 14, marginBottom: 6 }}>
            By {item.author_name}
          </CardDescription>
        </CardContent>
      </Card>
    </Pressable>
  );
};
