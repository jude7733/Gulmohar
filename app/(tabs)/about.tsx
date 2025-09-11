import { ScrollView, View, Pressable, Linking } from 'react-native';
import { Image, ImageBackground } from 'expo-image';
import { Text } from '~/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { contacts } from '~/lib/constants';
import { Github } from 'lucide-react-native';

export default function About() {
  const developers = [
    {
      name: 'Jude Saju',
      socialUrl: 'https://github.com/jude7733',
    },
    {
      name: 'Jeffin Pappachan',
      socialUrl: 'https://github.com/JeffinPappachan',
    },
  ];

  const openPhone = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const openEmail = () => {
    Linking.openURL('mailto:jude7733@protonmail.com?subject=Bug Report');
  };

  const openUrl = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView
      className="flex-1 w-full"
      contentContainerStyle={{
        paddingBottom: 20,
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 12,
        paddingVertical: 24,
      }}
    >
      {/* About Card */}
      <Card className="md:p-8 md:py-10 gap-4 rounded-xl max-w-4xl flex-row flex-wrap items-center justify-center">
        <CardHeader>
          <CardTitle>
            <Text className="text-4xl text-center">About Us</Text>
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
      <Card className="md:p-8 md:py-10 gap-4 rounded-xl max-w-4xl flex-row flex-wrap items-center justify-center">
        <CardHeader>
          <CardTitle>
            <Text className="text-2xl text-center">Vision</Text>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Text className="text-lg text-center mt-4 max-w-2xl">
            This platform allows artists across the college to showcase their work by uploading it here.
            The art can then be accessed and appreciated by everyone, providing a wider audience for
            each artist’s creations. This not only enables more people to experience and enjoy the artwork,
            but also gives well-deserved recognition to the artists themselves.
          </Text>
        </CardContent>
      </Card>

      {/*  Developers Section  */}
      {/* <Card className="rounded-xl max-w-4xl w-full"> */}
      {/*   <CardHeader className="items-center"> */}
      {/*     <CardTitle> */}
      {/*       <Text className="text-2xl font-bold mb-4 text-center">Meet the Developers</Text> */}
      {/*     </CardTitle> */}
      {/*   </CardHeader> */}
      {/*   <CardContent className="gap-y-2"> */}
      {/*     {developers.map((dev, index) => ( */}
      {/*       <View */}
      {/*         key={index} */}
      {/*         className="flex-row items-center justify-between w-full" */}
      {/*       > */}
      {/*         <Text className="text-lg">{dev.name}</Text> */}
      {/*         <Button size="icon" variant="default" onPress={() => openUrl(dev.socialUrl)}> */}
      {/*           <Github className="inline-block" color="white" size={16} /> */}
      {/*         </Button> */}
      {/*       </View> */}
      {/*     ))} */}
      {/*   </CardContent> */}
      {/* </Card> */}

      {/* Contact Us Section */}
      <View className="rounded-xl max-w-4xl w-full p-6 bg-white dark:bg-gray-900 shadow-md">
        <Text className="text-2xl font-bold mb-6 text-center">Contact Us</Text>
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
  );
}
