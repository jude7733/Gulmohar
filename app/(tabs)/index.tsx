import { useColorScheme } from 'nativewind';
import { Text, View, ScrollView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ArticlesCarousel } from '~/components/ArticlesCarousel';
import NewsUpdates from '~/components/news';

export default function Home() {
  const { colorScheme } = useColorScheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView className="flex-1 pb-2 gap-4 bg-background"
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        <View
          className={`
        px-4 lg:px-96 py-4 rounded-lg shadow-md 
        ${colorScheme === 'dark' ? 'bg-gray-900/90 from-gray-900 to-transparent' : 'bg-white/90 from-white to-transparent'}
      `}
          style={{
            backgroundImage: 'linear-gradient(to bottom, var(--tw-gradient-stops))',
          }}
        >
          <Text
            className={`text-2xl md:text-4xl font-extrabold drop-shadow-md ${colorScheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
          >
            Welcome enthusiast!
          </Text>
          <Text
            className={`
          mt-3 max-w-xl text-md md:text-xl
          ${colorScheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
        `}
          >
            Discover the latest articles and publications curated just for you.
          </Text>
        </View>

        <ArticlesCarousel />
        <NewsUpdates />

      </ScrollView >
    </GestureHandlerRootView>
  );
}
