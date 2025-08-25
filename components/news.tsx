import { useEffect, useState } from "react";
import { FlatList, Pressable, Linking, View } from "react-native";
import Animated, { FadeInLeft, FadeInRight } from "react-native-reanimated";
import { fetchUpdates } from "~/backend/database-functions";
import { UpdateItem } from "~/lib/types";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "./ui/card";
import { ArrowUpRight } from "lucide-react-native";
import { Text } from "./ui/text";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

function UpdatesCard({ item, index }: { item: UpdateItem; index: number }) {
  const AnimatedCard = Animated.createAnimatedComponent(View);

  const animation = index % 2 === 0 ? FadeInLeft : FadeInRight;
  const cardAlign = index % 2 === 0 ? "flex-start" : "flex-end";

  const handlePress = () => {
    Linking.openURL(item.link);
  };
  return (
    <AnimatedCard
      entering={animation.duration(550)}
      style={{
        alignItems: cardAlign,
        marginBottom: 16,
      }}
    >
      <Pressable onPress={handlePress} style={{ width: "96%" }} className="max-w-3xl">
        <Card className="rounded-lg border border-border shadow-md shadow-primary">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle numberOfLines={2}>{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{item.desc}</CardDescription>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button size="icon">
              <ArrowUpRight size={18} />
            </Button>
          </CardFooter>
        </Card>
      </Pressable>
    </AnimatedCard>
  );
}

export default function NewsUpdates() {
  const [loading, setLoading] = useState(true);
  const [updates, setUpdates] = useState<UpdateItem[]>([]);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const { data, error } = await fetchUpdates()
      setUpdates(data || []);
      if (error) {
        console.error("Error fetching updates:", error);
      }
      setLoading(false);
    };
    fetchContent();
  }, []);
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <FlatList
          data={[1, 2, 3, 4]}
          keyExtractor={(item) => item.toString()}
          renderItem={() => (
            <View className="w-full mb-4">
              <Skeleton className="h-40 w-full rounded-md" />
            </View>
          )}
          contentContainerStyle={{ padding: 16 }}
        />
      </View>
    );

  }

  return (
    <View className="mt-6 max-w-5xl flex flex-1 self-center w-full">
      <Text className="text-2xl font-bold mt-10 text-gray-900 dark:text-white px-4 mb-4">
        News & Updates
      </Text>
      <View className="h-[600px]">
        <FlatList
          data={updates}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <UpdatesCard item={item} index={index} />
          )}
          contentContainerStyle={{ padding: 16 }}
          nestedScrollEnabled
        />
      </View>
    </View>
  );
}
