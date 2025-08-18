import { Text, Image, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useColorScheme } from '~/lib/useColorScheme';

export default function Home() {
  const { isDarkColorScheme } = useColorScheme();
  const tint = isDarkColorScheme ? 'dark' : 'light';


  return (
    <View className='flex-1 py-10'>
      <Image
        source={require('../../assets/images/icon.png')}
        className='absolute w-[400px] h-[400px] mt-[-200px] ml-[-200px] md:w-[600px] md:h-[600px] md:mt-[-500px] md:ml-[-500px]'
        style={{
          left: '50%',
          top: '50%',
        }}
      />
      <BlurView tint={tint} intensity={100} className='md:flex-1 justify-center items-center p-8 mt-14 rounded-md'>
        <Text className='text-2xl text-center text-foreground'>This is the Home screen</Text>
      </BlurView>
    </View>
  );
}
