import '~/global.css';

import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { Link, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Appearance, Platform, Text, View } from 'react-native';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import { PortalHost } from '@rn-primitives/portal';
import { ThemeToggle } from '~/components/ThemeToggle';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useLayoutEffect } from 'react';

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// --- Helper hooks for platform-specific setup ---
const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

function useSetWebBackgroundClassName() {
  useIsomorphicLayoutEffect(() => {
    document.documentElement.classList.add('bg-background');
    return () => {
      document.documentElement.classList.remove('bg-background');
    };
  }, []);
}

function useSetAndroidNavigationBar() {
  useLayoutEffect(() => {
    setAndroidNavigationBar(Appearance.getColorScheme() ?? 'dark');
  }, []);
}

const navLinks = [
  { href: '/', title: 'Home' },
  { href: '/category', title: 'Category' },
  { href: '/about', title: 'About' },
];

function WebLayout() {
  const { isDarkColorScheme } = useColorScheme();
  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* --- Web Navbar --- */}
      <View className="flex-row items-center justify-between p-4 border-b-2 bg-secondary border-border">
        <Link href="/">
          <Text className="text-xl font-bold text-foreground">BMC-Art-Gallery</Text>
        </Link>
        <View className="flex-row items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-foreground hover:text-primary text-xl">
              <Text>{link.title}</Text>
            </Link>
          ))}
          <ThemeToggle />
        </View>
      </View>

      <Stack
        screenOptions={{
          statusBarStyle: isDarkColorScheme ? 'dark' : 'light',
        }}
      >
        {/* Hide the header for tab screens, as our custom navbar replaces it */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Keep modal screens as they were */}
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
  Platform.OS === 'web' ? useSetWebBackgroundClassName() : useSetAndroidNavigationBar();
  const { isDarkColorScheme } = useColorScheme();
  // TODO: fix status nav bar color on android

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar
        style={isDarkColorScheme ? 'light' : 'dark'}
        animated
        backgroundColor={isDarkColorScheme ? '#000' : '#FFF'}
        translucent={false}
      />
      {Platform.OS === 'web' ? <WebLayout /> : <NativeLayout />}
      <PortalHost />
    </ThemeProvider>
  );
}
