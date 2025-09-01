import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

interface VideoPlayerProps {
  url: string;
  isAudio?: boolean;
}

export default function VideoPlayer({ url, isAudio = false }: VideoPlayerProps) {
  const player = useVideoPlayer(url, (player) => {
    player.loop = true;
  });

  // If isAudio, wrap VideoView with ImageBackground
  if (isAudio) {
    return (
      <ImageBackground
        source={{ uri: "https://images.unsplash.com/photo-1698429894931-fa699270a2fa?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }}
        style={styles.audioBackground}
        resizeMode="cover"
      >
        <VideoView
          style={styles.audioVideo}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
        />
      </ImageBackground>
    );
  }

  // Otherwise just render VideoView directly
  return (
    <View style={styles.videoBackground}>
      <VideoView
        style={styles.video}
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
    maxHeight: 500,
    width: '100%',
    backgroundColor: '#000',
  },
  audioBackground: {
    height: 300,
    width: '100%',
  },
  video: {
    flex: 1,
  },
  audioVideo: {
    height: 300,
    width: '100%',
    backgroundColor: 'transparent',
  },
});
