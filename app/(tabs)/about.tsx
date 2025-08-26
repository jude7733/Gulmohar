import { ScrollView, View, Pressable, Linking } from 'react-native';
import { Image, ImageBackground } from 'expo-image';
import { Text } from '~/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { adLogos, contacts } from '~/lib/constants';

export default function About() {
  const imageUrl =
    'https://images.unsplash.com/photo-1642658228905-3672d6c64d9b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  const openPhone = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const openEmail = () => {
    Linking.openURL('mailto:jude7733@protonmail.com?subject=Bug Report');
  };

  return (
    <ImageBackground
      source={imageUrl}
      contentFit="cover"
      style={{ flex: 1, alignItems: 'center' }}
    >
      <ScrollView
        className="flex-1 w-full"
        contentContainerStyle={{
          paddingBottom: 40,
          alignItems: 'center',
          gap: 20,
          paddingHorizontal: 16,
          paddingVertical: 24,
        }}
      >
        {/* About Card */}
        <Card className="p-8 py-10 gap-4 rounded-xl max-w-4xl flex-row flex-wrap items-center justify-center">
          <CardHeader>
            <CardTitle>
              <Text className="text-4xl text-center">About us</Text>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Image
              source="https://github.com/teconiq-dev/Zynapse/blob/main/public/bmclogo.png?raw=true"
              style={{ width: 250, height: 250, alignSelf: 'center' }}
              contentFit="contain"
            />
            <Text className="text-lg text-center mt-4 max-w-2xl">
              BMC-Bharata Mata College, Thrikkakara is home to a diverse community
              of talented artists with unique skills and creations. However, their art
              often remains unseen and unappreciated outside of small circles.
              This platform was created to bridge that gap — providing a space where
              their work can be shared, celebrated, and accessed by a wider audience.
              The idea for this platform was initially coined by the students of
              Malayalam department.
            </Text>
          </CardContent>
        </Card>

        {/* Vision Card */}
        <Card className="p-8 py-10 rounded-xl max-w-4xl items-center justify-center">
          <CardHeader>
            <CardTitle>
              <Text className="text-2xl text-center">Vision</Text>
            </CardTitle>
          </CardHeader>
          <Text className="text-lg text-center mt-4">
            This platform allows artists across the college to showcase their work by uploading it here.
            The art can then be accessed and appreciated by everyone, providing a wider audience for
            each artist’s creations. This not only enables more people to experience and enjoy the artwork,
            but also gives well-deserved recognition to the artists themselves.
          </Text>
        </Card>

        {/* Ads Section */}
        <Card className="pt-4 rounded-xl max-w-4xl bg-secondary items-center justify-center">
          <Text className="text-3xl font-bold mb-6 text-center">Our Sponsors</Text>
          <View className="flex-row flex-wrap justify-center gap-8 bg-violet-950">
            {adLogos.map((logoUrl, idx) => (
              <Image
                key={idx}
                source={logoUrl}
                style={{ width: 280, height: 180 }}
                contentFit="contain"
              />
            ))}
          </View>
        </Card>

        {/* Contact Us Section */}
        <View className="rounded-xl max-w-4xl w-full p-6 bg-white dark:bg-gray-900 shadow-md">
          <Text className="text-3xl font-bold mb-6 text-center">Contact Us</Text>
          {contacts.map((contact, index) => (
            <Pressable
              key={index}
              onPress={() => openPhone(contact.phone)}
              className="mb-4"
            >
              <Text className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                {contact.name}
              </Text>
              <Text className="text-lg text-gray-700 dark:text-gray-300 underline">
                {contact.phone}
              </Text>
            </Pressable>
          ))}
          <Button variant="destructive" onPress={openEmail}>
            <Text>
              Report a Bug
            </Text>
          </Button>
        </View>

      </ScrollView>
    </ImageBackground>
  );
}
