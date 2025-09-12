import { Image } from "expo-image";
import { Pressable, StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { fetchPublicUrl } from "~/backend/database-functions";

const GradientOverlay = () => {
  const gradientSteps = Array.from({ length: 15 });
  return (
    <View style={cardStyles.gradient}>
      {gradientSteps.map((_, index) => {
        const opacity = (index / (gradientSteps.length - 1)) * 0.8;
        return (
          <View
            key={index}
            style={{
              flex: 1,
              backgroundColor: `rgba(0, 0, 0, ${opacity})`,
            }}
          />
        );
      })}
    </View>
  );
};

export const ContentCard = ({ item, onPress }) => {
  const [publicUrl, setPublicUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      if (item?.media_items?.[0]?.storagePath) {
        try {
          const defaultPath = item.media_items[0].thumbnailPath ?? item.media_items[0].storagePath;
          const url = await fetchPublicUrl(item.category, defaultPath);
          setPublicUrl(url);
        } catch (error) {
          console.error('Error fetching public URL:', error);
        }
      }
      setLoading(false);
    };
    fetchContent();
  }, [item]);

  const handlePress = () => {
    onPress(item.content_id);
  };

  return (
    <Pressable style={cardStyles.container} onPress={handlePress}>
      {loading ? (
        <View style={cardStyles.loader}>
          <ActivityIndicator size="small" color="#ffffff" />
        </View>
      ) : (
        <>
          <Image
            source={{ uri: publicUrl }}
            style={cardStyles.image}
            contentFit="cover"
          />
          <GradientOverlay />
          <View style={cardStyles.infoContainer}>
            <Text style={cardStyles.title}>{item.title}</Text>
            <Text style={cardStyles.author}>by {item.author_name}</Text>
          </View>
        </>
      )}
    </Pressable>
  );
};

const cardStyles = StyleSheet.create({
  container: {
    width: 200,
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    backgroundColor: '#333',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  infoContainer: {
    padding: 16,
    zIndex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  author: {
    fontSize: 12,
    color: '#e5e7eb',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
