import { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator, Platform, ScrollView } from 'react-native';
import { fetchLatest } from '~/backend/database-functions';
import { useRouter } from 'expo-router';
import { ContentCard } from './content-card';
import { Feather } from '@expo/vector-icons';

interface ContentHorizontalListProps {
  title: string;
  type: 'latest' | 'featured';
}

export function ContentHorizontalList({ title, type }: ContentHorizontalListProps) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const flatListRef = useRef<FlatList | null>(null);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const { data } = await fetchLatest();
      setItems(data);
      setLoading(false);
    };
    fetchContent();
  }, [type]);

  const handleContentPress = (content_id: string) => {
    router.push({
      pathname: '/content/[id]',
      params: { id: content_id },
    });
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (items.length === 0) return;

    let newIndex = 0;
    if (direction === 'right') {
      newIndex = Math.min(currentIndex + 2, items.length - 2);
    } else {
      newIndex = Math.max(currentIndex - 2, 0);
    }

    if (Platform.OS === 'web' && scrollViewRef.current) {
      // For web, calculate scroll position (card width + gap)
      const scrollOffset = newIndex * (280 + 20); // 280px card width + 20px gap
      scrollViewRef.current.scrollTo({ x: scrollOffset, animated: true });
    } else if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: newIndex, animated: true });
    }

    setCurrentIndex(newIndex);
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  return (
    <View className='md:max-w-5xl mt-4 md:mt-40' style={{ flex: 1, alignSelf: 'center' }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title} className='text-foreground'>{title}</Text>
          <View style={styles.arrowContainer} className='hidden md:flex'>
            <Pressable
              onPress={() => handleScroll('left')}
              disabled={currentIndex === 0}
              style={({ pressed }) => [styles.arrowButton, { opacity: pressed ? 0.7 : 1.0 }]}
            >
              <Feather name="arrow-left" size={20} color={currentIndex === 0 ? '#9ca3af' : '#111827'} />
            </Pressable>
            <Pressable
              onPress={() => handleScroll('right')}
              disabled={currentIndex >= items.length - 1}
              style={({ pressed }) => [styles.arrowButton, { opacity: pressed ? 0.7 : 1.0 }]}
            >
              <Feather name="arrow-right" size={20} color={currentIndex >= items.length - 1 ? '#9ca3af' : '#111827'} />
            </Pressable>
          </View>
        </View>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#4f46e5" />
          </View>
        ) : Platform.OS === 'web' ? (
          // Web-optimized ScrollView
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContentContainer}
            style={styles.scrollView}
          >
            {items.map((item, index) => (
              <View key={item.id} style={{ marginRight: index === items.length - 1 ? 0 : 20 }}>
                <ContentCard item={item} onPress={handleContentPress} />
              </View>
            ))}
          </ScrollView>
        ) : (
          // Native FlatList
          <FlatList
            ref={flatListRef}
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ContentCard item={item} onPress={handleContentPress} />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContentContainer}
            ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            scrollEventThrottle={200}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 34,
    height: 320,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  arrowContainer: {
    flexDirection: 'row',
  },
  arrowButton: {
    padding: 8,
    borderRadius: 99,
    marginHorizontal: 4,
    backgroundColor: '#f3f4f6',
  },
  listContentContainer: {
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
