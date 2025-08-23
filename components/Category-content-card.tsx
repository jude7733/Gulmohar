import { BlurView } from 'expo-blur';
import { useColorScheme } from 'nativewind';
import { Image, Pressable, View } from 'react-native';
import { fetchPublicUrl } from '~/backend/database-functions';
import { ContentItem } from '~/lib/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';
import { useEffect, useState } from 'react';
import { Skeleton } from './ui/skeleton';
import { Text } from './ui/text';

export const CategoryContentCard = ({ item, onPress }: { item: ContentItem; onPress: (id: string) => void }) => {
  const [publicUrl, setPublicUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const date = new Date(item.created_at).toDateString();
  const thumbnail = item.media_items[0].thumbnailPath ?? item.media_items[0].storagePath;
  console.log('Thumbnail URL:', thumbnail);
  const { colorScheme } = useColorScheme();

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
    <BlurView tint={colorScheme} intensity={100} className='md:flex-1 justify-center items-center m-2 lg:mx-80 rounded-md'>
      <Pressable
        onPress={() => onPress(item.content_id)}
        className="w-full max-w-3xl"
      >
        <Card className='mb-4 w-full bg-card/90 dark:bg-card/60'>
          <CardHeader>
            <Image
              source={{ uri: publicUrl }}
              style={{
                width: "100%",
                height: 200,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                marginBottom: 12,
                resizeMode: "cover"
              }}
            />
            <CardTitle className="text-xl font-bold">{item.title}</CardTitle>
          </CardHeader>

          <CardContent>
            <CardDescription >
              <View className="flex-row items-center mb-2">
                <Text className="text-sm font-medium">
                  by {item.author_name}
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400 mx-2">•</Text>
                {item.is_featured && (
                  <View className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded-full">
                    <Text className="text-xs font-medium text-yellow-800 dark:text-yellow-200">
                      Featured
                    </Text>
                  </View>
                )}
              </View>
            </CardDescription>
            <View
              className="bg-gray-100 dark:bg-gray-700 mb-3 px-2 py-1 max-w-[120px] rounded-md"
            >
              <Text className="text-xs text-gray-600 dark:text-gray-300">
                {date}
              </Text>
            </View>
          </CardContent>
        </Card>
      </Pressable>
    </BlurView >
  );
};

