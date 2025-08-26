import { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { FeaturedContent } from '~/lib/types';
import { ArticleCard } from './ArticlesCard';
import { fetchFeatured } from '~/backend/database-functions';
import { useRouter } from 'expo-router';
import { Button } from './ui/button';
import { Text } from './ui/text';

export const ArticlesCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [featuredList, setFeaturedList] = useState<FeaturedContent[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const { width: screenWidth } = Dimensions.get('window');
  const router = useRouter()

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

  const handleViewAll = () => {
    router.push('/category');
  }

  const cardHorizontalMargin = 8;
  const cardWidth = screenWidth * (Platform.OS === 'web' ? 0.7 : 0.95);
  const cardMargin = 10;


  const onScroll = (event: any) => {
    const slideSize = cardWidth + (cardMargin * 2);
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize); setCurrentIndex(index);
  };

  const goToSlide = (index: number) => {
    const slideSize = cardWidth + (cardMargin * 2);
    flatListRef.current?.scrollToOffset({
      offset: index * slideSize,
      animated: true,
    });
    setCurrentIndex(index);
  };

  const goToNext = () => goToSlide(currentIndex + 1);
  const goToPrev = () => goToSlide(currentIndex - 1);

  return (
    <View className="mt-6 py-8 md:py-14">
      <View className="flex-row justify-between md:justify-evenly items-center px-4 mb-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
          Latest Articles
        </Text>
        <TouchableOpacity>
          <Button size="sm" variant="default" onPress={handleViewAll}>
            <Text className='text-sm'>Explore</Text>
          </Button>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={featuredList}
        renderItem={({ item, index }) => (
          <ArticleCard
            item={item} isActive={index === currentIndex}
            cardWidth={cardWidth}
          />
        )}
        keyExtractor={(item) => item.content_id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + (cardHorizontalMargin * 2)}
        snapToAlignment="center"
        decelerationRate="fast"
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingHorizontal: (screenWidth - cardWidth) / 2 - cardHorizontalMargin,
        }}
      />
      {/* Arrow Buttons... */}
      <TouchableOpacity
        onPress={goToPrev}
        disabled={currentIndex === 0}
        className={`hidden md:block absolute top-1/2 -translate-y-1/2 z-10 bg-black/40 rounded-full p-2 shadow-lg disabled:opacity-20 ${Platform.OS === 'web' ? 'left-20' : 'left-5'}`}
      >
        <Text className="text-white font-bold text-xl leading-none px-1">{'<'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={goToNext}
        disabled={currentIndex === featuredList.length - 1}
        className={`hidden md:block absolute top-1/2 -translate-y-1/2 z-10 bg-black/40 rounded-full p-2 shadow-lg disabled:opacity-20 ${Platform.OS === 'web' ? 'right-20' : 'right-5'}`}
      >
        <Text className="text-white font-bold text-xl leading-none px-1">{'>'}</Text>
      </TouchableOpacity>
      <View className="flex-row justify-center mt-2 space-x-2">
        {featuredList.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => goToSlide(index)}
            className={`w-2 h-2 mx-1 rounded-full ${index === currentIndex
              ? 'bg-blue-500'
              : 'bg-gray-300 dark:bg-gray-600'
              }`}
          />
        ))}
      </View>
    </View>
  );
};

