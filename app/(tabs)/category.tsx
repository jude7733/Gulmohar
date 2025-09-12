import { FlatList, Pressable, View, useWindowDimensions, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { categories } from '~/lib/constants';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Text } from '~/components/ui/text';
import { useColorScheme } from 'nativewind';
import { Badge } from '~/components/ui/badge';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';


type CardItemProps = {
  item: typeof categories[0];
  index: number;
  isDesktop: boolean;
  colorScheme: 'light' | 'dark';
  onPress: () => void;
};

const CardItem = ({ item, index, isDesktop, colorScheme, onPress }: CardItemProps) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  useEffect(() => {
    const delay = index * 100;

    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 300 }));
  }, []);


  return (
    <Animated.View style={[animatedStyle, isDesktop ? { flex: 1 } : { width: '100%' }]}>
      <Pressable
        onPress={onPress}
        className={`rounded-xl overflow-hidden w-full`}
        style={{
          backgroundColor: colorScheme === 'dark' ? item.mutedDark : item.mutedLight,
          minHeight: 220,
          justifyContent: 'flex-end',
        }}
      >
        <View style={styles.contentWrapper}>
          <View style={styles.infoContainer}>
            <Text className="text-2xl lg:text-3xl font-bold text-white mb-4" numberOfLines={2}>
              {item.category}
            </Text>

            <View className="flex-row flex-wrap gap-2 mt-2" style={{ maxWidth: '60%' }}>
              {item.items?.map((tag, i) => (
                <Badge key={i}
                  style={{
                    backgroundColor: item.vibrantColor,
                  }}
                  className="border-0 p-1.5 px-2">
                  <Text className="text-white text-[11px] font-semibold">{tag}</Text>
                </Badge>
              ))}
            </View>
          </View>

          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: item.image }}
              style={styles.cardImage}
              contentFit="cover"
            />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};


export default function Category() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const window = useWindowDimensions();

  const isDesktop = window.width >= 768;

  const handleCategoryPress = (categoryName: string) => {
    router.push({
      pathname: '/category-list/[category]',
      params: { category: categoryName },
    });
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', paddingTop: 16 }}>
      <FlatList
        style={{ width: '100%', maxWidth: 1280 }}
        data={categories}
        keyExtractor={(item) => item.category}
        contentContainerStyle={{ padding: 16 }}
        numColumns={isDesktop ? 2 : 1}
        columnWrapperStyle={isDesktop ? { gap: 16 } : undefined}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <CardItem
            item={item}
            index={index}
            isDesktop={isDesktop}
            colorScheme={colorScheme ?? 'light'}
            onPress={() => handleCategoryPress(item.category)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contentWrapper: {
    flex: 1,
    padding: 16,
    position: 'relative',
  },
  infoContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    zIndex: 1,
    alignItems: 'flex-start',
    maxWidth: '70%',
  },
  imageWrapper: {
    position: 'absolute',
    bottom: -10,
    right: -5,
    width: 250,
    height: 250,
    borderRadius: 8,
    overflow: 'hidden',
    zIndex: 0,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
});
