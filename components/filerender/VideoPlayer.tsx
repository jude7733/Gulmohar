import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet, View, useWindowDimensions, Platform } from 'react-native';

interface VideoPlayerProps {
  url: string;
}

export default function VideoPlayer({ url }: VideoPlayerProps) {
  const { height } = useWindowDimensions();
  const player = useVideoPlayer(url, (player) => {
    player.loop = true;
  });

  const HEIGHT_LIMIT = 800;
  const INCREASED_VIDEO_HEIGHT = 500;
  const INCREASED_CONTAINER_HEIGHT = 600;

  const isLargeDesktop = Platform.OS === 'web' && height > HEIGHT_LIMIT;

  return (
    <View style={[
      styles.videoBackground,
      isLargeDesktop && { maxHeight: INCREASED_CONTAINER_HEIGHT }
    ]}>
      <VideoView
        style={[
          styles.video,
          isLargeDesktop && { maxHeight: INCREASED_VIDEO_HEIGHT }
        ]}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
      />
    </View>
  );
}

const styles = StyleSheet.create({
  videoBackground: {
    flex: 1,
    maxHeight: 400,
    width: '100%',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    maxHeight: 300,
    flex: 1,
  },
});
