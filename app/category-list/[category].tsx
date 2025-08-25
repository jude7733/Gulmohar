import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { fetchContentByCategory } from '~/backend/database-functions';
import { Category, ContentItem } from '~/lib/types';
import { useEffect, useState } from 'react';
import { getCategoryInfo } from '~/lib/constants';
import { CategoryContentCard } from '~/components/Category-content-card';

export default function CategoryListScreen() {
  const params = useLocalSearchParams();
  const category = params.category as Category;
  const router = useRouter();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');

  const categoryInfo = getCategoryInfo(category);

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
          header: () => (
            <View className="flex-row items-center px-4 py-2 bg-white dark:bg-gray-900">
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
          ),
        }}
      />

      <Image
        source={require('../../assets/images/icon.png')}
        className='absolute w-[400px] h-[400px] mt-[-200px] ml-[-200px] md:w-[600px] md:h-[600px] md:mt-[-500px] md:ml-[-500px]'
        style={{
          left: '50%',
          top: '50%',
        }}
      />
      <View className="flex-1">
        {/* Header Section */}
        {/* <View className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700"> */}
        {/* Sort Options */}
        {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}> */}
        {/*   <View className="flex-row gap-2"> */}
        {/*     {sortOptions.map((option) => ( */}
        {/*       <Pressable */}
        {/*         key={option.key} */}
        {/*         onPress={() => setSortBy(option.key as any)} */}
        {/*         className={`px-4 py-2 rounded-full border ${sortBy === option.key */}
        {/*           ? 'bg-blue-500 border-blue-500' */}
        {/*           : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600' */}
        {/*           }`} */}
        {/*       > */}
        {/*         <Text className={`text-sm font-medium ${sortBy === option.key */}
        {/*           ? 'text-white' */}
        {/*           : 'text-gray-700 dark:text-gray-300' */}
        {/*           }`}> */}
        {/*           {option.label} */}
        {/*         </Text> */}
        {/*       </Pressable> */}
        {/*     ))} */}
        {/*   </View> */}
        {/* </ScrollView> */}
        {/* </View> */}

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
          <FlatList
            data={content}
            keyExtractor={item => item.content_id}
            contentContainerStyle={{ padding: 16, margin: 2 }}
            renderItem={({ item }) => (
              <CategoryContentCard
                key={item.content_id}
                item={item}
                onPress={handleContentPress}
              />
            )}
          />
        )}
      </View>
    </>
  );
}
