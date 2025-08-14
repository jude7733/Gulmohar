import { View, Text } from 'react-native';

export default function Home() {
  return (
    <View className='bg-background flex flex-col p-6 items-center w-full justify-center'>
      <Text className='text-4xl text-foreground'>This is the Home screen.</Text>
    </View>
  );
}
