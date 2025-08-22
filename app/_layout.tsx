import '~/global.css';

import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Appearance, Platform } from 'react-native';
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

const usePlatformSpecificSetup = Platform.select({
  web: useSetWebBackgroundClassName,
  android: useSetAndroidNavigationBar,
  default: noop,
});

export default function RootLayout() {
  usePlatformSpecificSetup();
  const { isDarkColorScheme } = useColorScheme();

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} animated translucent />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'right', 'left']}>
        <Stack
          screenOptions={{
            animation: Platform.OS === 'android' ? 'slide_from_right' : 'default',
            statusBarStyle: isDarkColorScheme ? 'light' : 'dark',
          }}
        >
          <Stack.Screen
            name='(tabs)'
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
              animation: 'slide_from_right'
            }}
          />
          <Stack.Screen
            name="content/[id]"
            options={{
              headerShown: true,
              presentation: 'modal',
              animation: 'slide_from_right'
            }}
          />
        </Stack>
      </SafeAreaView>
      <PortalHost />
    </ThemeProvider >
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined' ? useEffect : useLayoutEffect;

function useSetWebBackgroundClassName() {
  useIsomorphicLayoutEffect(() => {
    // Adds the background color to the html element to prevent white background on overscroll.
    document.documentElement.classList.add('bg-background');
  }, []);
}

function useSetAndroidNavigationBar() {
  useLayoutEffect(() => {
    setAndroidNavigationBar(Appearance.getColorScheme() ?? 'dark');
  }, []);
}

function noop() { }
