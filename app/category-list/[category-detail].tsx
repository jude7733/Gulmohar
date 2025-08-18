import {
  View,
  ScrollView,
  Text,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { fetchContentByCategory } from '~/backend/database-functions';
import { Category, ContentItem } from '~/lib/types';
import { useEffect, useState } from 'react';


const getCategoryInfo = (category: Category) => {
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

const ContentCard = ({ item, onPress }: { item: ContentItem; onPress: () => void }) => {
  const date = new Date(item.created_at).toDateString();

  return (
    <Pressable onPress={onPress} className="mb-4">
      <Card className="bg-blue-100/50 dark:bg-card/50 border border-gray-700 dark:border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white leading-6 mb-1">
                {item.title}
              </Text>
              <View className="flex-row items-center mb-2">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  by {item.author_name}
                </Text>
                {item.department && (
                  <>
                    <Text className="text-sm text-gray-500 dark:text-gray-400 mx-2">•</Text>
                    <Text className="text-sm text-gray-600 dark:text-gray-400">
                      {item.department}
                    </Text>
                  </>
                )}
              </View>
            </View>
            <View className="items-center">
              {item.is_featured && (
                <View className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded-full">
                  <Text className="text-xs font-medium text-yellow-800 dark:text-yellow-200">
                    Featured
                  </Text>
                </View>
              )}
            </View>
          </View>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Thumbnail for visual content */}
          {/* {thumbnailUrl && ( */}
          {/*   <Image */}
          {/*     source={{ uri: thumbnailUrl }} */}
          {/*     className="w-full h-48 rounded-lg mb-3" */}
          {/*     style={{ resizeMode: 'cover' }} */}
          {/*   /> */}
          {/* )} */}

          {item.body && (
            <Text
              className="text-sm text-gray-600 dark:text-gray-300 leading-5 mb-3"
              numberOfLines={2}
            >
              {item.body}
            </Text>
          )}

          <View
            className="bg-gray-100 dark:bg-gray-700 mb-3 px-2 py-1 max-w-[150px] rounded-md"
          >
            <Text className="text-xs text-gray-600 dark:text-gray-300">
              {date}
            </Text>
          </View>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <View className="flex-row flex-wrap gap-1">
              {item.tags.slice(0, 3).map((tag, index) => (
                <View
                  key={index}
                  className="bg-blue-50 dark:bg-blue-900 px-2 py-1 rounded-full"
                >
                  <Text className="text-xs text-blue-700 dark:text-blue-300">
                    #{tag}
                  </Text>
                </View>
              ))}
              {item.tags.length > 3 && (
                <View className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                  <Text className="text-xs text-gray-600 dark:text-gray-400">
                    +{item.tags.length - 3} more
                  </Text>
                </View>
              )}
            </View>
          )}
        </CardContent>
      </Card>
    </Pressable>
  );
};

// Main Component
export default function CategoryListScreen() {
  const params = useLocalSearchParams();
  const category = params.category as Category;
  const router = useRouter();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');

  const categoryInfo = getCategoryInfo(category);

  // Fetch content using your function
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
  }, [category, sortBy]);

  const handleContentPress = (item: ContentItem) => {
    router.push({
      pathname: '/content/[detail]',
      params: {
        detail: item.content_id,
        data: JSON.stringify(item)
      }
    });
  };

  // Sort options
  const sortOptions = [
    { key: 'newest', label: 'Newest First' },
    { key: 'oldest', label: 'Oldest First' },
    { key: 'popular', label: 'Most Popular' }
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: category || 'Category',
          headerStyle: {
            backgroundColor: categoryInfo.color,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />

      <View className="flex-1 bg-gray-50 dark:bg-gray-900">
        {/* Header Section */}
        <View className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
          <View className="flex-row items-center mb-3">
            <Text className="text-3xl mr-3">{categoryInfo.icon}</Text>
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900 dark:text-white">
                {category}
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                {content.length} items
              </Text>
            </View>
          </View>

          {/* Sort Options */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {sortOptions.map((option) => (
                <Pressable
                  key={option.key}
                  onPress={() => setSortBy(option.key as any)}
                  className={`px-4 py-2 rounded-full border ${sortBy === option.key
                    ? 'bg-blue-500 border-blue-500'
                    : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                    }`}
                >
                  <Text className={`text-sm font-medium ${sortBy === option.key
                    ? 'text-white'
                    : 'text-gray-700 dark:text-gray-300'
                    }`}>
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Content List */}
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color={categoryInfo.color} />
            <Text className="text-gray-600 dark:text-gray-400 mt-2">
              Loading content...
            </Text>
          </View>
        ) : content.length === 0 ? (
          <View className="flex-1 justify-center items-center px-6">
            <Text className="text-6xl mb-4">{categoryInfo.icon}</Text>
            <Text className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No content found
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 text-center">
              There are no items in the {category} category yet.
            </Text>
          </View>
        ) : (
          <ScrollView className="flex-1 px-4 py-4">
            {content.map((item) => (
              <ContentCard
                key={item.content_id}
                item={item}
                onPress={() => handleContentPress(item)}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </>
  );
}
