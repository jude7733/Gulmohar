import { ScrollView, ImageBackground } from 'react-native';
import { BlurView } from 'expo-blur';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';

export default function About() {
  return (
    <ScrollView>
      <ImageBackground
        source={{ uri: "https://images.unsplash.com/photo-1679304319966-61712c71ebe4?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGhleXlhbXxlbnwwfHwwfHx8MA%3D%3D" }}
        imageStyle={{ width: "100%", height: "100%" }}
        resizeMode="cover"
        className='md:flex-1 md:flex-row md:justify-center md:items-center md:p-8 md:py-20'
      >
        <BlurView intensity={100} className='rounded-xl'>
          <Card className='bg-card/50  p-8 py-20 rounded-xl max-w-5xl'>
            <Text className='text-2xl text-center'>Vision</Text>
            <Text className='text-lg text-center mt-4 max-w-3xl'>
              BMC is home to a diverse community of talented artists with unique skills and creations. However, their art often remains unseen and unappreciated outside of small circles. This platform was created to bridge that gap — providing a space where their work can be shared, celebrated, and accessed by a wider audience.
            </Text>
          </Card>
        </BlurView>
      </ImageBackground>
      <ImageBackground
        source={{ uri: "https://images.unsplash.com/photo-1546778316-dfda79f1c84e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDExfHx8ZW58MHx8fHx8" }}
        imageStyle={{ width: "100%", height: "100%" }}
        resizeMode="cover"
        className='md:flex-1 md:flex-row md:justify-center md:items-center md:p-8 md:py-20'
      >
        <BlurView intensity={100} className='rounded-xl'>
          <Card className='bg-card/50 p-8 py-20 rounded-xl max-w-5xl'>
            <Text className='text-2xl text-center'>About</Text>
            <Text className='text-lg text-center mt-4 max-w-3xl'>
              This platform allows artists across the college to showcase their work by uploading it here. The art can then be accessed and appreciated by everyone, providing a wider audience for each artist’s creations. This not only enables more people to experience and enjoy the artwork, but also gives well-deserved recognition to the artists themselves.
            </Text>
          </Card>
        </BlurView>
      </ImageBackground>
    </ScrollView>
  );
}
