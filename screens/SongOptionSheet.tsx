import { View, Text, Image, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { forwardRef } from "react";
import { Song, usePlayerStore } from "../store/playerStore";


interface Props {
  song: Song | null;
  onClose: () => void;
}

const SongOptionsSheet = forwardRef<BottomSheet, Props>(({ song, onClose }, ref) => {
  const { setCurrentSong, addToQueue, setSheetOpen } = usePlayerStore();

  const handlePlay = () => {
    if (!song) return;
    setCurrentSong(song);
    onClose();
  };

  const handlePlayNext = () => {
    if (!song) return;
    const { queue, currentIndex } = usePlayerStore.getState();
    const newQueue = [...queue];
    newQueue.splice(currentIndex + 1, 0, song);
    usePlayerStore.setState({ queue: newQueue });
    onClose();
  };

  const handleAddToQueue = () => {
    if (!song) return;
    addToQueue(song);
    onClose();
  };

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={["35%"]}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: "#1e293b" }}
      handleIndicatorStyle={{ backgroundColor: "#6b7280" }}
      onChange={(index) => setSheetOpen(index >= 0)}
    >
      <BottomSheetView style={{ padding: 16 }}>
        {/* Song Preview */}
        {song && (
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20, gap: 12 }}>
            {song.image ? (
              <Image
                source={{ uri: song.image }}
                style={{ width: 52, height: 52, borderRadius: 8 }}
              />
            ) : null}
            <View style={{ flex: 1 }}>
              <Text style={{ color: "white", fontWeight: "600", fontSize: 15 }} numberOfLines={1}>
                {song.name}
              </Text>
              <Text style={{ color: "#6b7280", fontSize: 13, marginTop: 2 }} numberOfLines={1}>
                {song.artists}
              </Text>
            </View>
          </View>
        )}

        {/* Divider */}
        <View style={{ height: 1, backgroundColor: "#334155", marginBottom: 16 }} />

        {/* Options */}
        <TouchableOpacity
          onPress={handlePlay}
          style={{ flexDirection: "row", alignItems: "center", paddingVertical: 14, gap: 16 }}
        >
          <Ionicons name="play-circle-outline" size={24} color="white" />
          <Text style={{ color: "white", fontSize: 16 }}>Play</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handlePlayNext}
          style={{ flexDirection: "row", alignItems: "center", paddingVertical: 14, gap: 16 }}
        >
          <Ionicons name="play-skip-forward-outline" size={24} color="white" />
          <Text style={{ color: "white", fontSize: 16 }}>Play Next</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleAddToQueue}
          style={{ flexDirection: "row", alignItems: "center", paddingVertical: 14, gap: 16 }}
        >
          <Ionicons name="add-circle-outline" size={24} color="white" />
          <Text style={{ color: "white", fontSize: 16 }}>Add to Queue</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheet>
  );
});

export default SongOptionsSheet;