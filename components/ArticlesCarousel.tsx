import { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { FeaturedContent } from '~/lib/types';
import { ArticleCard } from './ArticlesCard';

type ArticlesCarouselProps = {
  articles: FeaturedContent[];
}

export const ArticlesCarousel = ({ articles }: ArticlesCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { width: screenWidth } = Dimensions.get('window');

  const cardHorizontalMargin = 8;
  const cardWidth = screenWidth * 0.95;
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

  return (
    <View className="mt-6">
      <View className="flex-row justify-between items-center px-4 mb-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
          Latest Articles
        </Text>
        <TouchableOpacity>
          <Text className="text-blue-500 font-medium">View All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={articles}
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

      <View className="flex-row justify-center mt-4 space-x-2">
        {articles.map((_, index) => (
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

