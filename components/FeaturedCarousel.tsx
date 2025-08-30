import { View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { window } from "~/lib/constants";
import { SlideItem } from "./SlideItem";
import { fetchFeatured } from "~/backend/database-functions";
import { useEffect, useState } from "react";

function FeaturedCarousel() {
  const progress = useSharedValue<number>(0);
  const [featuredList, setFeaturedList] = useState<any[]>([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await fetchFeatured()
        setFeaturedList(data || []);
      }
      catch (error) {
        console.error('Error fetching featured content:', error);
      }
    }
    fetchContent()
  }, []);

  return (
    <View
      id="carousel-component"
      className="flex-1 items-center justify-center"
      dataSet={{ kind: "basic-layouts", name: "parallax" }}
    >
      <Carousel
        autoPlayInterval={4000}
        data={featuredList}
        autoPlay={true}
        height={458}
        loop={true}
        pagingEnabled={true}
        snapEnabled={true}
        width={window.width}
        style={{
          width: window.width,
        }}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        onProgressChange={progress}
        renderItem={({ item, index }) => (
          <SlideItem
            item={item} index={index}
          />
        )}
      />
    </View>
  );
}

export default FeaturedCarousel;

