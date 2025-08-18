import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert, Image, Dimensions } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { ContentItem, MediaItem } from '~/lib/types';
import { fetchStorage } from '~/backend/database-functions';

// Format date utility

export default function ContentDetailScreen() {
  const { data } = useLocalSearchParams<{ data: string }>();
  const dataObj: ContentItem = data ? JSON.parse(data) : null;
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<string | null>(null);

  const date = new Date(dataObj.created_at).toDateString();

  useEffect(() => {
    const fetchContent = async () => {
      if (!dataObj) return;
      setLoading(true);
      const { data, error } = await fetchStorage(
        dataObj.media_items[0].storagePath,
        dataObj.category
      );
      const text = data && await data.text();
      text && setFile(text);
      if (error) {
        Alert.alert('Error', 'Failed to load content.');
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

  if (!dataObj) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900 px-6">
        <Text className="text-xl font-semibold text-gray-900 dark:text-white">Content not found</Text>
      </View>
    );
  }

  const screenWidth = Dimensions.get('window').width;

  // Render media items
  const renderMediaItem = (media: MediaItem, index: number) => {
    const publicUrl = media.storagePath

    switch (media.type) {
      case 'image':
        return (
          <Image
            key={index}
            source={{ uri: publicUrl }}
            style={{ width: screenWidth - 32, height: 250, borderRadius: 12, marginBottom: 16 }}
            resizeMode="cover"
          />
        );
      case 'pdf':
        // You may integrate a PDF viewer library here
        return (
          <View key={index} className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <Text className="font-semibold text-gray-900 dark:text-white">{media.title}</Text>
            <Text className="text-sm text-blue-600 underline">{publicUrl}</Text>
          </View>
        );
      case 'video':
        // Integrate video player if needed
        return (
          <View key={index} className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <Text className="font-semibold text-gray-900 dark:text-white">{media.title}</Text>
            <Text className="text-sm text-blue-600 underline">{publicUrl}</Text>
          </View>
        );
      case 'audio':
        // Integrate audio player if needed
        return (
          <View key={index} className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
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
          title: dataObj.title,
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
        <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{dataObj.title}</Text>
        <Text className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          By {dataObj.author_name} • {dataObj.department} • {date}
        </Text>
        <Text className="text-base text-gray-700 dark:text-gray-300 mb-6">{dataObj.body}</Text>

        {dataObj.media_items && dataObj.media_items.map(renderMediaItem)}
      </ScrollView>
    </>
  );
}
