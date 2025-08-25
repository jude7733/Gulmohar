import { Text, View, ScrollView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ArticlesCarousel } from '~/components/ArticlesCarousel';
import NewsUpdates from '~/components/news';

export default function Home() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView className="flex-1 pb-2 gap-4 bg-background">
        <View className="px-4 lg:px-96 py-4 md:mt-20">
          <Text className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Welcome enthusiast!
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 mt-2">
            Discover the latest articles and publications
          </Text>
        </View>

        <ArticlesCarousel />
        <NewsUpdates />

      </ScrollView >
    </GestureHandlerRootView>
  );
}
