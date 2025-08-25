import { Image, FlatList, Text, Pressable, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { categories } from '~/lib/constants';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Button } from '~/components/ui/button';

export default function Category() {
  const { colorScheme } = useColorScheme();
  const router = useRouter();

  const handleCategoryPress = (categoryName: string) => {
    router.push({
      pathname: '/category-list/[category]',
      params: { category: categoryName }
    });
  };

  return (
    <View className='flex-1 pb-5'>
      <FlatList
        data={categories}
        keyExtractor={item => item.category}
        contentContainerStyle={{ padding: 16, margin: 2 }}
        renderItem={({ item }) => (
          <View className='md:flex-1 justify-center items-center m-2 lg:mx-80 rounded-md'>
            <Pressable
              onPress={() => handleCategoryPress(item.category)}
              className="w-full max-w-3xl"
            >
              <Card className='mb-4 w-full bg-card/90 dark:bg-card/60 shadow-primary shadow-md'>
                <CardHeader>
                  <Image
                    source={{ uri: item.image }}
                    style={{
                      width: "100%",
                      height: 200,
                      borderTopLeftRadius: 12,
                      borderTopRightRadius: 12,
                      marginBottom: 12,
                      resizeMode: "cover"
                    }}
                  />
                  <CardTitle className="text-xl font-bold">{item.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  {item.items.map((subitem, idx) => (
                    <CardDescription key={idx} className='mb-2 italic font-semibold'>
                      {subitem}
                    </CardDescription>
                  ))}
                  <Button variant="link" className="p-0 mt-2">
                    <Text className="text-sm text-muted-foreground">
                      Tap to view all {item.category} content →
                    </Text>
                  </Button>
                </CardContent>
              </Card>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}
