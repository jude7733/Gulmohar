import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet, View } from 'react-native';

interface VideoPlayerProps {
  url: string;
}

export default function VideoPlayer({ url }: VideoPlayerProps) {
  const player = useVideoPlayer(url, (player) => {
    player.loop = true;
  });

  return (
    <View style={styles.videoBackground}>
      <VideoView
        style={styles.video}
        player={player}
        allowsPictureInPicture
        fullscreenOptions={{
          enable: true
        }}
        crossOrigin="anonymous"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  videoBackground: {
    flex: 1,
    maxHeight: 500,
    width: '100%',
    backgroundColor: '#000',
  },
  video: {
    maxHeight: 500,
    flex: 1,
  },
});
