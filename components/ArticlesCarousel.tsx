import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import PDFViewer from './filerender/PDFViewer';

interface Article {
  id: string;
  title: string;
  author: string;
  date: string;
  pdfUrl: string;
  description?: string;
}

interface ArticlesCarouselProps {
  articles?: Article[];
}

export const ArticlesCarousel: React.FC<ArticlesCarouselProps> = ({ articles }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { width: screenWidth } = Dimensions.get('window');

  // Sample data - replace with your actual article data
  const defaultArticles: Article[] = [
    {
      id: '1',
      title: 'Gulmohar Newsletter Nov 2022',
      author: 'Editorial Team',
      date: 'Nov 2022',
      pdfUrl: 'https://rvxwbisktphfyibdcfcd.supabase.co/storage/v1/object/public/print-media/Gulmohar%20newspaper%20Nov%202022.pdf',
      description: 'Latest campus news and updates'
    },
    {
      id: '2',
      title: 'Gulmohar Newsletter Nov 2023',
      author: 'Editorial Team',
      date: 'Nov 2022',
      pdfUrl: 'https://rvxwbisktphfyibdcfcd.supabase.co/storage/v1/object/public/print-media/Gulmohar%20newspaper%20Sept%202023.pdf',
      description: 'Latest campus news and updates'
    },
  ];

  const articleData = articles || defaultArticles;
  const cardWidth = screenWidth * 0.85;
  const cardMargin = 10;

  const renderArticleCard = ({ item, index }: { item: Article; index: number }) => {
    const isActive = index === currentIndex;

    return (
      <View
        className={`mx-2 rounded-xl overflow-hidden shadow-lg ${isActive ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'
          }`}
        style={{ width: cardWidth }}
      >
        {/* PDF Preview */}
        <View className="h-64 bg-gray-100 dark:bg-gray-600">
          <PDFViewer
            uri={item.pdfUrl}
            width={cardWidth}
            height={256}
          />
        </View>

        {/* Article Info */}
        <View className="p-4">
          <Text className="text-lg font-bold text-gray-900 dark:text-white mb-2" numberOfLines={2}>
            {item.title}
          </Text>

          <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            By {item.author} • {item.date}
          </Text>

          {item.description && (
            <Text className="text-sm text-gray-700 dark:text-gray-300" numberOfLines={2}>
              {item.description}
            </Text>
          )}

          <TouchableOpacity className="mt-3 bg-blue-500 py-2 px-4 rounded-lg">
            <Text className="text-white text-center font-medium">Read Full Article</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const onScroll = (event: any) => {
    const slideSize = cardWidth + (cardMargin * 2);
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setCurrentIndex(index);
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
      {/* Section Header */}
      <View className="flex-row justify-between items-center px-4 mb-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
          Latest Articles
        </Text>
        <TouchableOpacity>
          <Text className="text-blue-500 font-medium">View All</Text>
        </TouchableOpacity>
      </View>

      {/* Carousel */}
      <FlatList
        ref={flatListRef}
        data={articleData}
        renderItem={renderArticleCard}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + (cardMargin * 2)}
        snapToAlignment="start"
        decelerationRate="fast"
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingHorizontal: (screenWidth - cardWidth) / 2,
        }}
      />

      {/* Pagination Dots */}
      <View className="flex-row justify-center mt-4 space-x-2">
        {articleData.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full ${index === currentIndex
              ? 'bg-blue-500'
              : 'bg-gray-300 dark:bg-gray-600'
              }`}
          />
        ))}
      </View>
    </View>
  );
};

