import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { fetchContentByCategory } from '~/backend/database-functions';
import { Category, ContentItem } from '~/lib/types';
import { useEffect, useState } from 'react';
import { getCategoryInfo } from '~/lib/constants';
import { CategoryContentCard } from '~/components/Category-content-card';
import { ArrowLeft } from 'lucide-react-native';

export default function CategoryListScreen() {
  const params = useLocalSearchParams();
  const category = params.category as Category;
  const router = useRouter();
  const window = useWindowDimensions();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');

  const categoryInfo = getCategoryInfo(category);
  const isDesktop = window.width >= 768;

  const fetchContent = async () => {
    try {
      setLoading(true);

      if (!category) {
        Alert.alert('Error', 'No category specified');
        return;
      }

      const { data, error } = await fetchContentByCategory(category);

      if (error) {
        console.error('Error fetching content:', error);
        Alert.alert('Error', 'Failed to load content. Please try again.');
        return;
      }

      let sortedData = data || [];

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          sortedData = sortedData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          break;
        case 'oldest':
          sortedData = sortedData.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
          break;
        case 'popular':
          sortedData = sortedData.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
          break;
      }

      setContent(sortedData);
    } catch (error) {
      console.error('Unexpected error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (category) {
      fetchContent();
    }
  }, [category]);

  const handleContentPress = (content_id: string) => {
    router.push({
      pathname: '/content/[id]',
      params: {
        id: content_id,
      }
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <View className="flex-row items-center px-4 py-2 bg-white dark:bg-gray-900">
              <Pressable onPress={() => router.back()} className="mr-3 p-1"
                android_ripple={{ color: '#ccc', radius: 40, borderless: true, foreground: true }}
              >
                <ArrowLeft size={28} color="#999" style={{ marginRight: 8 }} />
              </Pressable>
              <Text className="text-3xl mr-3">{categoryInfo.icon}</Text>
              <View className="flex-1">
                <Text className="text-xl font-bold text-gray-900 dark:text-white">{category}</Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">{content.length} items</Text>
              </View>
            </View>
          ),
        }}
      />

      <View style={{ flex: 1, width: '100%' }}>
        <View className="flex-1 p-2 lg:p-20 w-full">
          {loading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color={categoryInfo.color} />
              <Text className="text-gray-600 dark:text-gray-400 mt-2">Loading content...</Text>
            </View>
          ) : content.length === 0 ? (
            <View className="flex-1 justify-center items-center px-6">
              <Text className="text-6xl mb-4">{categoryInfo.icon}</Text>
              <Text className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No content found</Text>
              <Text className="text-gray-600 dark:text-gray-400 text-center">
                There are no items in the {category} category yet.
              </Text>
            </View>
          ) : (
            <FlatList
              data={content}
              keyExtractor={item => item.content_id}
              contentContainerStyle={{ paddingVertical: 40, gap: 14 }}
              showsVerticalScrollIndicator={false}
              numColumns={isDesktop ? 2 : 1}
              columnWrapperStyle={isDesktop ? { justifyContent: 'space-between' } : undefined}
              renderItem={({ item }) => (
                <CategoryContentCard item={item} onPress={handleContentPress} />
              )}
            />
          )}
        </View>
      </View>
    </>
  );
}
