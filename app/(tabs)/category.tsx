import { Image, FlatList, Text } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useColorScheme } from '~/lib/useColorScheme';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

export default function Category() {
  const { isDarkColorScheme } = useColorScheme();
  const tint = isDarkColorScheme ? 'dark' : 'light';

  const content = [
    {
      category: "Written Forms (Literary Arts)",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80", // Kerala books library
      items: ["Poetry", "Short Stories", "Novels"],
    },
    {
      category: "Print Media (Literary Arts)",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80", // Malayalam newspaper
      items: ["Newspapers", "Magazines"],
    },
    {
      category: "Painting & Drawing (Visual Arts)",
      image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600&q=80", // Kathakali face painting Kerala
      items: [
        "Mural Art",
        "Contemporary Painting",
        "Sketches & Illustrations",
      ],
    },
    {
      category: "Photography",
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80", // Kerala landscape photography
      items: ["Documentary Photography", "Artistic Photography"],
    },
    {
      category: "Media & Mixed Arts",
      image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
      items: [
        "Film & Television",
        "Short Films",
        "Documentaries",
        "TV Serials",
      ],
    },
    {
      category: "Radio & Podcasts",
      image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80", // Kerala radio/podcast
      items: [
        "Radio Plays",
        "Literary Podcasts",
      ],
    },
    {
      category: "Blogs",
      image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80", // Kerala backwaters/travel
      items: [
        "Tech Blogs",
        "Travel Blogs",
        "Lifestyle Blogs",
        "Educational Blogs",
      ],
    },
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView className='flex-1 pb-5' edges={['left', 'right']}>
        <Image
          source={require('../../assets/images/icon.png')}
          className='absolute w-[400px] h-[400px] mt-[-200px] ml-[-200px] md:w-[600px] md:h-[600px] md:mt-[-500px] md:ml-[-500px]'
          style={{
            left: '50%',
            top: '50%',
          }}
        />
        <Text className='text-foreground text-3xl text-center p-4 bg-secondary/40'>Categories</Text>
        <FlatList
          data={content}
          keyExtractor={item => item.category}
          contentContainerStyle={{ padding: 16, margin: 2 }}
          renderItem={({ item }) => (
            <BlurView tint={tint} intensity={100} className='md:flex-1 justify-center items-center m-2 lg:mx-80 rounded-md'>
              <Card className='mb-4 w-full max-w-3xl bg-card/90 dark:bg-card/60'>
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
                  <CardTitle>{item.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  {item.items.map((subitem, idx) => (
                    <CardDescription key={idx} className='mb-2 italic font-semibold'>
                      {subitem}
                    </CardDescription>
                  ))}
                </CardContent>
              </Card>
            </BlurView>
          )}
        />
      </SafeAreaView>
    </SafeAreaProvider >
  );
}
