import { View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance, Pagination } from "react-native-reanimated-carousel";
import { window } from "~/lib/constants";
import { SlideItem } from "./SlideItem";
import { fetchFeatured } from "~/backend/database-functions";
import { useEffect, useRef, useState } from "react";

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

  const ref = useRef<ICarouselInstance>(null);
  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <View
      id="carousel-component"
      className="flex-1 items-center justify-center"
      dataSet={{ kind: "basic-layouts", name: "parallax" }}
    >
      <Carousel
        autoPlayInterval={4000}
        data={featuredList}
        ref={ref}
        autoPlay={true}
        height={600}
        loop={true}
        pagingEnabled={true}
        snapEnabled={true}
        width={window.width}
        style={{
          width: window.width + 700,
          alignItems: "center",
          justifyContent: "center",
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
      <Pagination.Basic<{ color: string }>
        progress={progress}
        data={featuredList.map((color) => ({ color }))}
        dotStyle={{
          width: 25,
          height: 4,
          backgroundColor: "#4cc9f0",
        }}
        activeDotStyle={{
          overflow: "hidden",
          backgroundColor: "#4361ee",
        }}
        containerStyle={{
          gap: 10,
          marginBottom: 10,
        }}
        horizontal
        onPress={onPressPagination}
      />

    </View>
  );
}

export default FeaturedCarousel;

