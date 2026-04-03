import { getPlayer } from "../screens/AudioProvider";
import { usePlayerStore } from "../store/playerStore";

export function usePlayer() {
  const { isPlaying, playNext, playPrevious } = usePlayerStore();

  const togglePlay = () => {
    const player = getPlayer();
    if (!player) return;
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  const seekTo = (positionMillis: number) => {
    const player = getPlayer();
    if (!player) return;
    player.seekTo(positionMillis / 1000);
  };

  return { togglePlay, seekTo, playNext, playPrevious };
}