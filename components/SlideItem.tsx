import { useState, useEffect } from "react";
import { Pressable, View } from "react-native";
import { fetchPublicUrl } from "~/backend/database-functions";
import { FeaturedContent } from "~/lib/types";
import { useRouter } from "expo-router";
import { Skeleton } from "./ui/skeleton";
import {
  StyleSheet,
  Text,
  type ViewProps,
} from "react-native";
import type { AnimatedProps } from "react-native-reanimated";
import Animated from "react-native-reanimated";

interface Props extends AnimatedProps<ViewProps> {
  index?: number;
  item?: FeaturedContent;
}

export const SlideItem: React.FC<Props> = (props) => {
  const { index = 0, item, testID, ...animatedViewProps } = props;
  const [publicUrl, setPublicUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

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

  const handleContentPress = (id: string) => {
    router.push({
      pathname: '/content/[id]',
      params: { id: id }
    });
  };

  if (loading) {
    return (
      <View className="flex-1">
        <Skeleton className="h-[600px] w-full rounded-md" />
      </View>
    )
  }

  return (
    <Pressable
      onPress={() => handleContentPress(item?.content_id)}
    >
      <Animated.View
        testID={testID}
        style={styles.card}
        {...animatedViewProps}
      >
        <Animated.Image
          style={styles.image}
          source={{ uri: publicUrl }}
          resizeMode="cover"
        />
        {/* Elegant overlay at the bottom */}
        <View style={styles.overlay}>
          <View style={styles.overlayTextContainer}>
            <Text style={styles.title} numberOfLines={1}>{item?.title}</Text>
            <Text style={styles.author} numberOfLines={1}>{item?.author_name}</Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: 458,
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 24,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  overlayTextContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    width: "100%",
    padding: 10,
    borderRadius: 10,
    minWidth: 40,
    minHeight: 40,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 2,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  author: {
    color: "#eaeaea",
    fontSize: 14,
    fontWeight: "500",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
