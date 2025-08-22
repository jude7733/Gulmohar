import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Image, Dimensions, Button, SafeAreaView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { ContentItem, MediaItem } from '~/lib/types';
import { fetchContentById, fetchPublicUrl } from '~/backend/database-functions';
import { openInBrowser, sharePdfWithNativeApp } from '~/lib/file-funtions/pdf';
import PDFViewer from '~/components/filerender/PDFViewer';

export default function ContentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [details, setDetails] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [fileUrl, setFileUrl] = useState<string[] | null>(null);

  const date = details && new Date(details.created_at).toDateString();

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const { data, error } = await fetchContentById(id);
      setDetails(data);

      if (details?.media_items?.length) {
        const urls = await Promise.all(
          details.media_items.map(async (mediaItem) => {
            const filePath = await fetchPublicUrl(details.category, mediaItem.storagePath);
            return filePath;
          })
        );
        setFileUrl(urls);
      }

      if (error) {
        console.log('Error', 'Failed to load content.');
        setLoading(false);
        return;
      }
      setLoading(false);
    };

    fetchContent();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900">
        <ActivityIndicator size="large" color="#3182ce" />
        <Text className="mt-2 text-gray-600 dark:text-gray-400">Loading content...</Text>
      </View>
    );
  }

  if (!details) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900 px-6">
        <Text className="text-xl font-semibold text-gray-900 dark:text-white">Content not found</Text>
      </View>
    );
  }

  const screenWidth = Dimensions.get('window').width;

  const renderMediaItem = (media: MediaItem, index: number) => {
    if (!fileUrl) return null;

    // If fileUrl is array and has more than one file, map over it
    if (Array.isArray(fileUrl) && fileUrl.length > 1) {
      return fileUrl.map((url, i) => (
        <RenderSingleMediaItem key={`${index}-${i}`} media={media} publicUrl={url} />
      ));
    }

    // Otherwise treat as single URL
    const publicUrl = Array.isArray(fileUrl) ? fileUrl[0] : fileUrl;

    return <RenderSingleMediaItem key={index} media={media} publicUrl={publicUrl} />;
  };

  // Helper single item render component
  const RenderSingleMediaItem = ({
    media,
    publicUrl,
  }: {
    media: MediaItem;
    publicUrl: string;
  }) => {
    switch (media.type) {
      case 'image':
        return (
          <Image
            source={{ uri: publicUrl }}
            style={{ width: screenWidth - 32, height: 250, borderRadius: 12, marginBottom: 16 }}
            resizeMode="cover"
          />
        );
      case 'pdf':
        return (
          <View className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <View className="flex-row justify-between mt-2">
              <Button title="Open" onPress={() => openInBrowser(publicUrl)} />
              <Button title="Share" onPress={() => sharePdfWithNativeApp(publicUrl)} />
            </View>
            <PDFViewer uri={publicUrl} classname="w-full overflow-hidden py-4" />
          </View>
        );
      case 'video':
        return (
          <View className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <Text className="font-semibold text-gray-900 dark:text-white">{media.title}</Text>
            <Text className="text-sm text-blue-600 underline">{publicUrl}</Text>
          </View>
        );
      case 'audio':
        return (
          <View className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
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
      <SafeAreaView style={{ flex: 1 }}>
        <Stack.Screen
          options={{
            title: details.title,
            headerStyle: {
              backgroundColor: '#3182ce',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <ScrollView className="flex-1 bg-[#5cbdb9] dark:bg-gray-900 px-4 py-4">
          <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{details.title}</Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            By {details.author_name} • {details.department} • {date}
          </Text>
          <Text className="text-base text-gray-700 dark:text-gray-300 mb-6">{details.body}</Text>

          {details.media_items && details.media_items.map(renderMediaItem)}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
