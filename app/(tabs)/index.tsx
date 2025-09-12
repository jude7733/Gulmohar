import { useColorScheme } from 'nativewind';
import { Text, View, ScrollView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FeaturedCarousel from '~/components/FeaturedCarousel';

export default function Home() {
  const { colorScheme } = useColorScheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView className="flex-1 pb-2 gap-4 bg-background"
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        <View className='px-4 pt-6 items-center justify-center'>
          <Text
            className={`text-xl md:text-3xl font-bold ${colorScheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
          >
            Discover Creative Excellence
          </Text>
          <Text
            className={`
          mt-3 max-w-2xl text-center font-thin text-md md:text-lg
          ${colorScheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}
        `}
          >
            Explore the vibrant artistic landscape of Bharata Mata College. From visual arts to literature, discover talents that make our community extraordinary.
          </Text>
        </View>

        <FeaturedCarousel />
        {/* <NewsUpdates /> */}

      </ScrollView >
    </GestureHandlerRootView>
  );
}
