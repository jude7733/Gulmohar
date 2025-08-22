import { useEffect, useState } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { fetchFeatured } from '~/backend/database-functions';
import { ArticlesCarousel } from '~/components/ArticlesCarousel';
import { NewsComponent } from '~/components/news';
import { FeaturedContent } from '~/lib/types';

export default function Home() {
  const [featuredList, setFeaturedList] = useState<FeaturedContent[]>([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await fetchFeatured()
        setFeaturedList(data || []);
      }
      catch (error) {
        console.error('Error fetching featured content:', error);
      }
    }
    fetchContent()
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView className="flex-1 py-2 bg-gray-50 dark:bg-gray-900">
        <View className="px-4 pb-4">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome to Gulmohar
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 mt-2">
            Discover the latest articles and publications
          </Text>
        </View>

        <ArticlesCarousel articles={featuredList} />
        <NewsComponent />

      </ScrollView >
    </GestureHandlerRootView>
  );
}
