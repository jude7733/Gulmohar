import { FlatList, Pressable, View, useWindowDimensions } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Image } from 'expo-image';
import { categories } from '~/lib/constants';
import { useRouter } from 'expo-router';
import { Text } from '~/components/ui/text';
import { Badge } from '~/components/ui/badge';

export default function Category() {
  const router = useRouter();
  const window = useWindowDimensions();

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
          contentContainerStyle={{ padding: 8, paddingVertical: 40, margin: 2, gap: 14 }}
          showsVerticalScrollIndicator={false}
          numColumns={isDesktop ? 2 : 1}
          columnWrapperStyle={isDesktop ? { justifyContent: 'space-between' } : undefined}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleCategoryPress(item.category)}
              className={`justify-center items-center rounded-md mb-2 ${isDesktop ? 'flex-1 max-w-[48%]' : 'w-full max-w-3xl'}`}
              accessibilityRole="button"
              android_ripple={{ color: '#ccc', radius: 20, borderless: true, foreground: true }}
            >
              <Card className={`w-full bg-card dark:bg-card shadow-primary shadow-md`}>
                <CardHeader className='bg-secondary py-4'>
                  <CardTitle className="text-lg font-bold">{item.category}</CardTitle>
                </CardHeader>
                <Image
                  source={{ uri: item.image }}
                  style={{
                    width: "100%",
                    height: 300,
                    marginBottom: 20,
                  }}
                  contentFit='cover'
                />
                <CardContent>
                  <View className="flex w-full flex-row flex-wrap gap-2">
                    {item.items.map((subitem, idx) => (
                      <Badge key={idx} className='bg-[#4895ef]'>
                        <Text className='font-light text-xs'>
                          {subitem}
                        </Text>
                      </Badge>
                    ))}
                  </View>
                </CardContent>
              </Card>
            </Pressable>
          )}
        />
      </View>
    </View>
  );
}
