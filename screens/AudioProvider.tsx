// import { usePlayer } from "../hooks/usePlayer";

// // This component just mounts the hook globally
// export default function AudioProvider() {
//   usePlayer();
//   return null;
// }
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useEffect, useRef } from "react";
import { usePlayerStore } from "../store/playerStore";

let globalPlayer: any = null;
export const getPlayer = () => globalPlayer;

export default function AudioProvider() {
  const { currentSong, setIsPlaying, setPosition, setDuration } = usePlayerStore();
  const player = useAudioPlayer(
    currentSong?.url ? { uri: currentSong.url } : { uri: "" }
  );
  const status = useAudioPlayerStatus(player);
  const lastSongId = useRef<string | null>(null);

  globalPlayer = player;

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
    });
  }, []);

  useEffect(() => {
    if (!currentSong) return;
    if (currentSong.id === lastSongId.current) return;
    lastSongId.current = currentSong.id;

    const load = async () => {
      try {
        await player.replace({ uri: currentSong.url });
        player.play();
      } catch (e) {
        console.error("Playback error:", e);
      }
    };

    load();
  }, [currentSong?.id]);

  useEffect(() => {
    if (!status) return;
    setIsPlaying(status.playing ?? false);
    setPosition((status.currentTime ?? 0) * 1000);
    setDuration((status.duration ?? 0) * 1000);
  }, [status]);

  return null;
}