import '~/global.css';

import { ThemeProvider } from '@react-navigation/native';
import { Link, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, Text, View } from 'react-native';
import { NAV_THEME } from '~/lib/theme';
import { PortalHost } from '@rn-primitives/portal';
import { ThemeToggle } from '~/components/ThemeToggle';
import { useColorScheme } from 'nativewind';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

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
    <SafeAreaProvider>
      {/* --- Web Navbar --- */}
      <View className="flex-row items-center justify-between p-4 border-b-2 bg-secondary dark:bg-gray-900 border-border">
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
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="content/[id]"
          options={{
            headerShown: true,
            presentation: 'modal',
            webModalStyle: {
              height: '75vh',
              width: '80vw',
            },
            sheetAllowedDetents: [0.95, 1],
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}

function NativeLayout() {
  const { colorScheme } = useColorScheme();
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          title: 'Art Gallery',
          headerRight: () => <ThemeToggle />,
          headerStyle: { backgroundColor: colorScheme === "dark" ? "#111827" : "#f3ccff" },
          headerTitleStyle: { fontWeight: 'bold' },
          animation: 'fade',
        }}
      />
      <Stack.Screen
        name="category-list/[category]"
        options={{
          headerShown: true,
          animation: 'flip',
        }}
      />
      <Stack.Screen
        name="content/[id]"
        options={{
          headerShown: true,
          animation: 'fade_from_bottom',
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? 'dark']}>
      <StatusBar translucent />
      <SafeAreaView edges={['left', 'right', 'bottom']} className="bg-background" style={{ flex: 1 }}>
        {Platform.OS === 'web' ? <WebLayout /> : <NativeLayout />}
      </SafeAreaView>
      <PortalHost />
    </ThemeProvider>
  );
}
