import { Audio, AVPlaybackStatus } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import type { JSX } from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface AudioPlayerProps {
  audioSource: number;  // For require() sources
}

export default function AudioPlayer({ audioSource }: AudioPlayerProps): JSX.Element {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setupAudio();
    return () => cleanup();
  }, []);

  const setupAudio = async () => {
    try {
      if (Platform.OS !== 'web') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: false,
          playThroughEarpieceAndroid: false,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
        });
      }
    } catch (error) {
      console.warn('Error setting audio mode:', error);
    }
  };
  function cleanup() {
    if (soundRef.current) {
      try {
        soundRef.current.unloadAsync().catch(error => {
          console.error('Failed to unload sound:', error);
        });
      } catch (error) {
        console.error('Failed to unload sound:', error);
      }
      soundRef.current = null;
    }
  }
  function onPlaybackStatusUpdate(status: AVPlaybackStatus) {
    if (!status.isLoaded) return;
    setIsPlaying(status.isPlaying);
    if (status.didJustFinish) {
      setIsPlaying(false);
    }
  }

  const togglePlayback = async () => {
    try {
      if (isLoading) return;
      setIsLoading(true);

      if (!soundRef.current) {
        const { sound } = await Audio.Sound.createAsync(
          audioSource,
          { shouldPlay: true },
          onPlaybackStatusUpdate
        );
        soundRef.current = sound;
        setIsPlaying(true);
      } else {
        const status = await soundRef.current.getStatusAsync();
        if (status.isLoaded) {
          if (status.isPlaying) {
            await soundRef.current.pauseAsync();
          } else {
            await soundRef.current.playAsync();
          }
        }
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ padding: 10 }}>
      <TouchableOpacity 
        onPress={togglePlayback}
        disabled={isLoading}
        accessibilityLabel={isPlaying ? "Pause audio" : "Play audio"}
      >
        <Feather 
          name={isPlaying ? 'pause-circle' : 'play-circle'} 
          size={32} 
          color={isLoading ? "#999999" : "#007AFF"} 
        />
      </TouchableOpacity>
    </View>
  );
}