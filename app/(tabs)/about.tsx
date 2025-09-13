import { ScrollView, View, Pressable, Linking } from 'react-native';
import { Image } from 'expo-image';
import { Text } from '~/components/ui/text';
import { Feather } from '@expo/vector-icons';
import React, { useEffect } from 'react';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

const AnimatedSection = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 500 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 500 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
};


const StatItem = ({ value, label }: { value: string; label: string }) => (
  <View className="items-center">
    <Text className="text-2xl md:text-4xl font-bold text-white">{value}</Text>
    <Text className="text-sm text-amber-200">{label}</Text>
  </View>
);

const CreditLink = ({ username }: { username: string }) => {
  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <Pressable
      className="flex-row items-center gap-2"
      onPress={() => openLink(`https://github.com/${username}`)}
    >
      <Feather name="github" size={16} className="text-foreground" color="grey" />
      <Text className="text-base text-foreground font-semibold">
        {username}
      </Text>
    </Pressable>
  );
};

export default function About() {
  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <ScrollView
      className="flex-1 w-full bg-background"
      contentContainerStyle={{
        paddingBottom: 40,
        alignItems: 'center',
        paddingHorizontal: 16,
      }}
    >
      <View className="w-full max-w-5xl items-center">
        <AnimatedSection delay={0}>
          <View className="items-center text-center my-12">
            <Image
              source="https://github.com/teconiq-dev/Zynapse/blob/main/public/bmclogo.png?raw=true"
              style={{ width: 150, height: 150 }}
              contentFit="contain"
            />
            <Text className="text-4xl font-bold mt-6 text-foreground">About Art Gallery</Text>
            <Text className="text-lg text-center mt-2 text-muted-foreground">
              Bharata Mata College, Thrikkakara is home to a diverse community of talented artists with unique skills and creations. However, their art often remains unseen and unappreciated outside of small circles. This platform was created to bridge that gap — providing a space where their work can be shared, celebrated, and accessed by a wider audience. The idea for this platform was initially coined by the students of Malayalam department.
            </Text>
          </View>
        </AnimatedSection>

        <AnimatedSection delay={150}>
          <View className="flex-col md:flex-row gap-6 w-full">
            <View className="flex-1 p-6 bg-card rounded-xl border border-border">
              <View className="w-12 h-12 bg-primary rounded-full items-center justify-center mb-4">
                <Feather name="eye" size={24} color="white" />
              </View>
              <Text className="text-2xl font-bold mb-2 text-foreground">Our Vision</Text>
              <Text className="text-base text-muted-foreground leading-relaxed">
                To create a vibrant digital space that showcases the diverse artistic talents of our college community, fostering recognition, appreciation, and connection among students, faculty, and art enthusiasts.
              </Text>
            </View>
            <View className="flex-1 p-6 bg-card rounded-xl border border-border">
              <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center mb-4">
                <Feather name="heart" size={24} color="white" />
              </View>
              <Text className="text-2xl font-bold mb-2 text-foreground">Our Purpose</Text>
              <Text className="text-base text-muted-foreground leading-relaxed">
                We believe every creative work deserves an audience. This platform provides the tools for students to share their artistic journey, gain well-deserved recognition, and inspire others in our creative community.
              </Text>
            </View>
          </View>
        </AnimatedSection>

        <View className="mt-16 w-full">
          <AnimatedSection delay={300}>
            <Text className="text-3xl font-bold mb-6 text-center text-foreground">Get In Touch</Text>
            <View className="flex-col md:flex-row gap-6 w-full">
              <View className="flex-1 p-6 bg-card rounded-xl border border-border gap-4">
                <Text className="text-xl font-semibold text-foreground">Contact Information</Text>
                <Pressable className="flex-row items-center gap-3" onPress={() => openLink('mailto:artgallery@bmc.edu.in')}>
                  <Feather name="mail" size={18} className="text-primary" color="#AF2B68" />
                  <Text className="text-base text-muted-foreground">artgallery@bmc.edu.in</Text>
                </Pressable>
                <View className="flex-row items-start gap-3">
                  <Feather name="phone" size={18} className="text-primary mt-1" color="#BF40BF" />
                  <View>
                    <View className="mb-2">
                      <Text className="text-base text-foreground font-medium">Fr Varghese Paul</Text>
                      <Pressable onPress={() => openLink('tel:+919562686623')}>
                        <Text className="text-base text-muted-foreground">+91 95626 86623</Text>
                      </Pressable>
                    </View>
                    <View>
                      <Text className="text-base text-foreground font-medium">Karun K</Text>
                      <Pressable onPress={() => openLink('tel:+919847530608')}>
                        <Text className="text-base text-muted-foreground">+91 98475 30608</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
                <View className="flex-row items-start gap-3">
                  <Feather name="map-pin" size={18} className="text-primary mt-1" color="#5D3FD3" />
                  <Text className="text-base text-muted-foreground">
                    Bharata Mata College{'\n'}Thrikkakara, Kochi, Kerala 682021
                  </Text>
                </View>
              </View>

              <View className="flex-1 p-6 bg-card rounded-xl border border-border gap-4">
                <Text className="text-xl font-semibold text-foreground">Support & Feedback</Text>
                <Text className="text-base text-muted-foreground">Have questions, suggestions, or found a bug? We'd love to hear from you!</Text>
                <Pressable className="p-3 bg-cyan-500 rounded-lg" onPress={() => openLink('mailto:jude7733@protonmail.com')}>
                  <Text className="text-base font-semibold text-center text-white">Send Feedback</Text>
                </Pressable>
                <Pressable className="flex-row items-center justify-center gap-3 p-3 border border-border rounded-lg" onPress={() => openLink('mailto:jude7733@protonmail.com')}>
                  <Feather name="tool" size={18} className="text-foreground" color="red" />
                  <Text className="text-base font-semibold text-foreground">Report a Bug</Text>
                </Pressable>
              </View>
            </View>
          </AnimatedSection>
        </View>

        <View className="mt-16 w-full">
          <AnimatedSection delay={450}>
            <View
              className="bg-blue-400 dark:bg-blue-800 rounded-xl w-full lg:bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-800 dark:to-red-900"
            >
              <View className="p-8 md:p-12">
                <Text className="text-3xl font-bold text-center text-gray-100 mb-8">Platform Statistics</Text>
                <View className="flex-row flex-wrap justify-around items-center gap-y-6">
                  <StatItem value="50+" label="Artworks" />
                  <StatItem value="25+" label="Artists" />
                  <StatItem value="12" label="Departments" />
                  <StatItem value="7" label="Categories" />
                </View>
              </View>
            </View>
          </AnimatedSection>
        </View>

        <AnimatedSection delay={600}>
          <View className="items-center mt-14 py-8 border-t border-border w-full">
            <Text className="text-base text-muted-foreground mb-4">
              This project was developed by
            </Text>
            <View className="flex-row flex-wrap justify-center gap-x-6 gap-y-2">
              <CreditLink username="jude7733" />
              <CreditLink username="JeffinPappachan" />
            </View>
          </View>
        </AnimatedSection>
      </View>
    </ScrollView>
  );
}
