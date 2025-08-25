import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Image, Dimensions, SafeAreaView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { ContentItem, MediaItem } from '~/lib/types';
import { fetchContentById, fetchPublicUrl } from '~/backend/database-functions';
import PDFViewer from '~/components/filerender/PDFViewer';
import { ShareArticle } from '~/components/share-article';

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
        console.log('No media items found for this content.');
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

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

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
          <>
            <ShareArticle publicUrl={publicUrl} />
            <Image
              source={{ uri: publicUrl }}
              style={{ width: screenWidth, height: screenHeight - 240, borderRadius: 12, marginBottom: 4 }}
              resizeMode="contain"
            />
          </>
        );
      case 'pdf':
        return (
          <View className="mb-4 rounded-lg">
            <ShareArticle publicUrl={publicUrl} />
            <PDFViewer uri={publicUrl} classname="w-full" />
          </View>
        );
      case 'video':
        return (
          <View className="mb-4 p-4 rounded-lg">
            <Text className="font-semibold text-gray-900 dark:text-white">{media.title}</Text>
            <Text className="text-sm text-blue-600 underline">{publicUrl}</Text>
          </View>
        );
      case 'audio':
        return (
          <View className="mb-4 p-4 rounded-lg">
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
      <Stack.Screen options={{
        headerShown: false
      }}
      />
      <ScrollView className="flex-1 px-2 py-8 bg-secondary">
        <Text className="px-4 text-3xl font-bold text-gray-900 dark:text-white mb-2">{details.title}</Text>
        <Text className="px-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
          By {details.author_name} • {details.department} • {date}
        </Text>
        <Text className="text-base px-4 text-gray-700 dark:text-gray-300 mb-6">{details.body}</Text>

        {details.media_items.map(renderMediaItem)}
      </ScrollView>
    </>
  );
}
