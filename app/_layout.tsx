import '~/global.css';

import { ThemeProvider } from '@react-navigation/native';
import { Link, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, Text, View } from 'react-native';
import { NAV_THEME } from '~/lib/theme';
import { PortalHost } from '@rn-primitives/portal';
import { ThemeToggle } from '~/components/ThemeToggle';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

const navLinks = [
  { href: '/', title: 'Home' },
  { href: '/category', title: 'Category' },
  { href: '/about', title: 'About' },
];

function WebLayout() {

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* --- Web Navbar --- */}
      <View className="flex-row items-center justify-between p-4 border-b-2 bg-secondary border-border">
        <Link href="/">
          <Text className="text-xl font-bold text-foreground">BMC-Art-Gallery</Text>
        </Link>
        <View className="flex-row items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-foreground hover:text-primary text-sm md:text-xl">
              <Text>{link.title}</Text>
            </Link>
          ))}
          <ThemeToggle />
        </View>
      </View>

      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="category-list/[category]"
          options={{
            headerShown: true,
            presentation: 'modal',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="content/[id]"
          options={{
            headerShown: true,
            presentation: 'modal',
            animation: 'slide_from_right',
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}

function NativeLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'right', 'left']}>
      <Stack
        screenOptions={{
          animation: Platform.OS === 'android' ? 'slide_from_right' : 'default',
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            title: 'BMC-Art-Gallery',
            headerRight: () => <ThemeToggle />,
          }}
        />
        <Stack.Screen
          name="category-list/[category]"
          options={{
            headerShown: true,
            presentation: 'modal',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="content/[id]"
          options={{
            headerShown: true,
            presentation: 'modal',
            animation: 'slide_from_right',
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? 'dark']}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      {Platform.OS === 'web' ? <WebLayout /> : <NativeLayout />}
      <PortalHost />
    </ThemeProvider>
  );
}
