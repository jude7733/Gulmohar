import { FlatList, Platform, Pressable, View, useWindowDimensions } from 'react-native';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Image } from 'expo-image';
import { categories } from '~/lib/constants';
import { useRouter } from 'expo-router';
import { ImageBackground } from 'expo-image';

export default function Category() {
  const router = useRouter();
  const window = useWindowDimensions();

  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
  const isDesktop = window.width >= 768; // md breakpoint approx

  const baseUrl = 'https://images.unsplash.com/photo-1597730945481-f35a5cf39021?ixlib=rb-4.1.0';
  const imageUrl = isDesktop
    ? `${baseUrl}&w=1920&dpr=2&fit=crop&auto=format`
    : `${baseUrl}&w=640&dpr=1&fit=crop&auto=format`;

  const handleCategoryPress = (categoryName: string) => {
    router.push({
      pathname: '/category-list/[category]',
      params: { category: categoryName }
    });
  };

  return (
    <ImageBackground
      source={imageUrl}
      blurRadius={isDesktop ? 20 : 3}
      contentFit="cover"
      style={{ flex: 1 }}
      placeholder={blurhash}
    >
      <View className='flex-1 md:p-20'>
        <FlatList
          data={categories}
          keyExtractor={item => item.category}
          contentContainerStyle={{ padding: 16, margin: 2, gap: 14 }}
          showsVerticalScrollIndicator={false}
          numColumns={isDesktop ? 2 : 1}
          columnWrapperStyle={isDesktop ? { justifyContent: 'space-between' } : undefined}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleCategoryPress(item.category)}
              className={`overflow-hidden justify-center items-center rounded-md mb-2 ${isDesktop ? 'flex-1 max-w-[48%]' : 'w-full max-w-3xl'}`}
              accessibilityRole="button"
              android_ripple={{ color: '#c7d2fe' }}
            >
              <Card className={`w-full bg-card/90 dark:bg-card/90 ${Platform.OS == "web" && "bg-card dark:bg-card"} shadow-primary shadow-md`}>
                <CardHeader className='bg-secondary py-4'>
                  <CardTitle className="text-xl font-bold">{item.category}</CardTitle>
                </CardHeader>
                <Image
                  source={{ uri: item.image }}
                  style={{
                    width: "100%",
                    height: 200,
                    marginBottom: 12,
                  }}
                  contentFit='cover'
                />
                <CardContent>
                  {item.items.map((subitem, idx) => (
                    <CardDescription key={idx} className='mb-2 italic font-semibold'>
                      {subitem}
                    </CardDescription>
                  ))}
                </CardContent>
              </Card>
            </Pressable>
          )}
        />
      </View>
    </ImageBackground>
  );
}
