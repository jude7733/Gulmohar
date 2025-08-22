import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // Conditionally hide the tab bar on web
        tabBarStyle: {
          display: Platform.OS === 'web' ? 'none' : 'flex',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="category"
        options={{
          title: 'Category',
          tabBarIcon: ({ color }) => <FontAwesome name="compass" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color }) => <FontAwesome name="info-circle" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
