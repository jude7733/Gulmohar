import { useColorScheme } from 'nativewind';
import { Text, View, ScrollView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FeaturedCarousel from '~/components/FeaturedCarousel';
import { ContentHorizontalList } from '~/components/horizontal-list';

export default function Home() {
  const { colorScheme } = useColorScheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView className="flex-1 pb-2 gap-8 bg-background">
        <View className='px-4 pt-6 items-center justify-center mb-6 md:my-20'>
          <Text
            className={`text-xl md:text-3xl font-bold ${colorScheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
          >
            Discover Creative Excellence
          </Text>
          <Text
            className={`
          mt-3 max-w-2xl text-center font-extralight text-md md:text-lg
          ${colorScheme === 'dark' ? 'text-gray-300' : 'text-gray-800'}
        `}
          >
            Explore the vibrant artistic landscape of Bharata Mata College. From visual arts to literature, discover talents that make our community extraordinary.
          </Text>
        </View>

        <FeaturedCarousel />

        <ContentHorizontalList
          type="latest"
          title="Latest Additions"
          onViewAllPress={() => alert('Navigate to All Additions')}
        />
      </ScrollView >
    </GestureHandlerRootView>
  );
}
