import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { ContentItem, MediaItem } from '~/lib/types';
import { fetchContentById, fetchPublicUrl } from '~/backend/database-functions';
import { Image } from 'expo-image';
import PDFViewer from '~/components/filerender/PDFViewer';
import { ShareArticle } from '~/components/share-article';

export default function ContentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [details, setDetails] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [fileUrl, setFileUrl] = useState<string[] | null>(null);
  const date = details && new Date(details.created_at).toDateString();
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

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
      case 'audio':
        return (
          <View key={index} className="mb-4 p-4 rounded-lg">
            <Text className="font-semibold text-gray-900 dark:text-white">{media.title}</Text>
            <Text className="text-sm text-blue-600 underline">{publicUrl}</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: details.title,
          headerStyle: { backgroundColor: '#00ccd3' },
          headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          headerTintColor: '#1a202c',
        }}
      />
      <View className="flex-1 bg-secondary px-2 py-8">
        <View>
          <Text className="px-4 text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-20">
            By {details.author_name} • {details.department} • {date}
          </Text>
          <Text className="text-base px-4 text-gray-700 dark:text-gray-300 mb-6">{details.body}</Text>
          {details.media_items.map(renderMediaItem)}
        </View>
      </View>
    </>
  );
}
