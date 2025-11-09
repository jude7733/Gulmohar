import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { View, Linking, Text, Platform } from "react-native";
import { Button } from "./ui/button";

const footerLinks = {
  quickLinks: [
    { href: '/', title: 'Home' },
    { href: '/category', title: 'Browse Gallery' },
    { href: '/upload', title: 'Submit Artwork' },
    { href: '/about', title: 'About Us' },
  ],
  resources: [
    { href: '/privacy', title: 'Privacy Policy' },
    { href: '/terms', title: 'Terms of Service' },
    { href: '/contact', title: 'Contact' },
    { href: '/faq', title: 'FAQ' },
  ],
};

export function Footer() {
  if (Platform.OS !== 'web') {
    return null;
  }

  const handleDownloadAPK = () => {
    Linking.openURL('https://expo.dev/artifacts/eas/rwrEhysje8MNNWGdGbdkyV.apk');
  };

  return (
    <View className="w-full bg-secondary dark:bg-gray-900 border-t-2 border-border mt-auto">
      <View className="max-w-7xl mx-auto w-full px-4 md:px-6 py-8 md:py-12">

        {/* Download Banner */}
        <View className="w-full items-center justify-center mb-8 md:mb-0">
          <View className="bg-primary/10 w-full dark:bg-primary/20 max-w-full md:max-w-md rounded-lg p-4 md:p-6 mb-6 md:mb-8 flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
            <View className="flex-1 items-center md:items-start">
              <Text className="text-base md:text-lg font-bold text-foreground mb-2 text-center md:text-left">
                Download Gulmohar Mobile App
              </Text>
              <Text className="text-xs md:text-sm text-foreground/70 text-center md:text-left">
                Get the best experience with our native mobile application (beta)
              </Text>
            </View>
            <Button
              onPress={handleDownloadAPK}
              size='icon'
            >
              <Feather name="download" size={18} color="#ffffff" />
            </Button>
          </View>
        </View>

        {/* Footer Content */}
        <View className="flex-col md:flex-row justify-center gap-8 md:gap-24 mb-6 md:mb-8">
          {/* About Section */}
          <View className="w-full md:max-w-md">
            <Text className="text-lg md:text-xl font-bold text-foreground mb-3 md:mb-4 text-center md:text-left">
              Gulmohar
            </Text>
            <Text className="text-sm text-foreground/70 leading-6 mb-3 md:mb-4 text-center md:text-left">
              The official art gallery platform for students of Bharata Mata College
              Autonomous. Showcasing creativity, talent, and artistic excellence.
            </Text>
            <Text className="text-xs text-foreground/60 text-center md:text-left">
              © {new Date().getFullYear()} Bharata Mata College. All rights reserved.
            </Text>
          </View>

          {/* Quick Links */}
          <View className="w-full md:w-auto items-center md:items-start">
            <Text className="text-base font-bold text-foreground mb-3 md:mb-4">Quick Links</Text>
            <View className="gap-3 items-center md:items-start">
              {footerLinks.quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-foreground/70 hover:text-primary"
                >
                  <Text>{link.title}</Text>
                </Link>
              ))}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
