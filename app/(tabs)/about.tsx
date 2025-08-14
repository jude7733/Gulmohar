import { View, Text } from 'react-native';

export default function About() {
  return (
    <View className='bg-background flex flex-col p-6 items-center w-full justify-center'>
      <Text className='text-foreground text-4xl'>This is the About screen.</Text>
    </View>
  );
}

