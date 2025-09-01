import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { ContentItem, MediaItem } from '~/lib/types';
import { fetchContentById, fetchPublicUrl } from '~/backend/database-functions';
import { Image } from 'expo-image';
import PDFViewer from '~/components/filerender/PDFViewer';
import { ShareArticle } from '~/components/share-article';
import { useColorScheme } from 'nativewind';
import { Text } from '~/components/ui/text';
import VideoScreen from '~/components/filerender/VideoPlayer';
import AudioComponent from '~/components/filerender/AudioPlayer';
import VideoPlayer from '~/components/filerender/VideoPlayer';

export default function ContentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [details, setDetails] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [fileUrl, setFileUrl] = useState<string[] | null>(null);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const { data, error } = await fetchContentById(id);
      setDetails(data);
      if (data?.media_items?.length) {
        const urls = await Promise.all(
          data.media_items.map(async (mediaItem: MediaItem) => {
            const filePath = await fetchPublicUrl(data.category, mediaItem.storagePath);
            return filePath;
          })
        );
        setFileUrl(urls);
      } else {
        setFileUrl(null);
      }
      setLoading(false);
    };
    fetchContent();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3182ce" />
        <Text className="mt-2 text-gray-600 dark:text-gray-400">Loading content...</Text>
      </View>
    );
  }

  if (!details) {
    return (
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-xl font-semibold text-gray-900 dark:text-white">Content not found</Text>
      </View>
    );
  }

  const renderMediaItem = (media: MediaItem, index: number) => {
    if (!fileUrl) return null;

    const publicUrl = Array.isArray(fileUrl) && fileUrl.length > 1 ? fileUrl[index] : fileUrl[0];

    switch (media.type) {
      case 'image':
        return (
          <View key={index} className="mb-1">
            <ShareArticle publicUrl={publicUrl} />
            <Image
              source={{ uri: publicUrl }}
              style={{
                width: screenWidth,
                height: screenHeight - 240,
                borderRadius: 12,
              }}
              contentFit="contain"
            />
          </View>
        );
      case 'pdf':
        return (
          <View key={index} className="mb-4 rounded-lg" style={{ height: screenHeight - 240 }}>
            <ShareArticle publicUrl={publicUrl} />
            <PDFViewer uri={publicUrl} />
          </View>
        );
      case 'video':
        return (
          <View key={index} className="mb-4 space-y-8 rounded-lg" style={{ height: screenHeight - 240 }}>
            <ShareArticle publicUrl={publicUrl} />
            <VideoPlayer url={publicUrl} />
          </View>
        )
      case 'audio':
        return (
          <View key={index} className="mb-4 space-y-8 rounded-lg" style={{ height: screenHeight - 240 }}>
            <ShareArticle publicUrl={publicUrl} />
            <VideoPlayer url={publicUrl} isAudio />
          </View>
        )
      default:
        return null;
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: details.title,
          headerStyle: { backgroundColor: colorScheme === "dark" ? "#310047" : "#f3ccff" },
        }}
      />
      <View className="flex-1 bg-accent py-8">
        <View className='px-4'>
          <View className='flex flex-row items-center justify-between mb-8'>
            <Text className="text-md">
              {details.author_name}
            </Text>
            <Text className="text-md text-gray-600 dark:text-gray-400">
              {details.department}
            </Text>
          </View>
          <Text className="text-sm italic text-gray-700 dark:text-gray-300 mb-6">{details.body}</Text>
        </View>
        {details.media_items.map(renderMediaItem)}
      </View>
    </>
  );
}
