import { FlatList, Pressable, View, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { categories } from '~/lib/constants';
import { useRouter } from 'expo-router';
import { Text } from '~/components/ui/text';
import { Badge } from '~/components/ui/badge';
import { useColorScheme } from 'nativewind';

export default function Category() {
  const router = useRouter();
  const window = useWindowDimensions();
  const { colorScheme } = useColorScheme()

  const isDesktop = window.width >= 768; // md breakpoint approx

  const handleCategoryPress = (categoryName: string) => {
    router.push({
      pathname: '/category-list/[category]',
      params: { category: categoryName }
    });
  };

  return (
    <View
      style={{ flex: 1 }}
    >
      <View className='flex-1 md:p-20'>
        <FlatList
          data={categories}
          keyExtractor={item => item.category}
          contentContainerStyle={{ padding: 16, paddingVertical: 16, gap: 20 }}
          showsVerticalScrollIndicator={false}
          numColumns={isDesktop ? 2 : 1}
          columnWrapperStyle={isDesktop ? { justifyContent: 'space-between' } : undefined}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleCategoryPress(item.category)}
              className={`justify-center p-0 items-center rounded-2xl ${isDesktop ? 'flex-1 max-w-[48%]' : 'w-full max-w-3xl'}`}
              android_ripple={{ color: '#ccc', radius: 100, borderless: true, foreground: true }}
            >
              <View className="w-full rounded-2xl p-0 flex-row items-center justify-between"
                style={{ backgroundColor: colorScheme == "dark" ? item.mutedDark : item.mutedLight }}
              >
                <View className='px-4'
                  style={{ flex: 1 }}
                >
                  <Text className="text-lg font-bold mb-4 text-white">{item.category}</Text>
                  <View className="flex w-full flex-row flex-wrap gap-2">
                    {item.items.map((subitem, idx) => (
                      <Badge
                        key={idx}
                        className="bg-blue-100 dark:bg-blue-800"
                      >
                        <Text className="text-[10px] text-blue-700 dark:text-blue-300">
                          {subitem}
                        </Text>
                      </Badge>
                    ))}
                  </View>
                </View>
                <View style={{ flex: 1.35 }} className='p-0 items-end justify-end'>
                  <Image
                    source={{ uri: item.image }}
                    style={{
                      flex: 1,
                      width: "100%",
                      height: 200,
                    }}
                    contentFit='contain'
                  />
                </View>
              </View>
            </Pressable>
          )}
        />
      </View>
    </View >
  );
}
