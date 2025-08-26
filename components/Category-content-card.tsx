import { BlurView } from 'expo-blur';
import { useColorScheme } from 'nativewind';
import { Pressable, useWindowDimensions, View } from 'react-native';
import { Image } from 'expo-image';
import { fetchPublicUrl } from '~/backend/database-functions';
import { ContentItem } from '~/lib/types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { useEffect, useState } from 'react';
import { Skeleton } from './ui/skeleton';
import { Text } from './ui/text';

type CategoryContentCardProps = {
  item: ContentItem;
  onPress: (id: string) => void;
};

export const CategoryContentCard = ({ item, onPress }: CategoryContentCardProps) => {
  const [publicUrl, setPublicUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const date = new Date(item.created_at).toDateString();
  const { colorScheme } = useColorScheme();
  const window = useWindowDimensions();

  const isDesktop = window.width >= 768;

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

  if (loading) {
    return (
      <View className="flex flex-col items-center gap-4">
        <Skeleton className="h-[500px] w-full rounded-md" />
        <Skeleton className="h-[500px] w-full rounded-md" />
      </View>
    );
  }
  return (
    <Pressable onPress={() => onPress(item.content_id)}
      className={`overflow-hidden justify-center items-center rounded-xl ${isDesktop ? 'flex-1 max-w-[48%]' : 'w-full max-w-3xl'}`}
      accessibilityRole="button"
      android_ripple={{ color: '#c7d2fe' }}
    >
      <Card className="mb-4 w-full bg-card/90 dark:bg-card/90 shadow-xl shadow-primary rounded-md">
        <BlurView tint={colorScheme} intensity={100} className="md:flex-1 justify-center items-center rounded-xl p-2 md:p-4">
          <Image
            source={{ uri: publicUrl }}
            style={{
              width: '100%',
              height: 350,
              marginBottom: 12,
              borderRadius: 12,
            }}
            contentFit="cover"
          />
          <CardHeader>
            <CardTitle className="text-xl font-semibold">{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="flex-row items-center justify-between mb-2 md:mb-8">
              <Text className="text-sm font-medium">{item.author_name}</Text>
              <View className="flex-row items-center ml-2">
                <Text className="text-xs font-medium text-gray-700 dark:text-gray-300">{date}</Text>
              </View>
            </View>

            {/* Tags List */}
            {item.tags.length > 0 && (
              <View className="flex-row flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <View
                    key={tag}
                    className="bg-blue-100 dark:bg-blue-800 px-3 py-1 rounded-full"
                  >
                    <Text className="text-xs text-blue-700 dark:text-blue-300 font-semibold">
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </CardContent>
          <CardFooter>
            {item.is_featured && (
              <View className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded-full">
                <Text className="text-xs font-medium text-yellow-800 dark:text-yellow-200">Featured</Text>
              </View>
            )}
          </CardFooter>
        </BlurView>
      </Card>
    </Pressable >
  );
};
