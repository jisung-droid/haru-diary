import { useState, useEffect } from 'react';
import { useAudioPlayer } from 'expo-audio';

export function useAudioPlayback(audioUrl: string | null) {
  const player = useAudioPlayer(audioUrl || undefined);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!player) return;

    const interval = setInterval(() => {
      if (player.playing) {
        setPosition(player.currentTime * 1000);
        setDuration(player.duration * 1000);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [player]);

  const play = async () => {
    if (!player) return;
    player.play();
    setIsPlaying(true);
  };

  const pause = () => {
    if (!player) return;
    player.pause();
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  return {
    isPlaying,
    position,
    duration,
    togglePlayback,
  };
}
