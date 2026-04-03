import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { usePlayer } from "../hooks/usePlayer";
import { usePlayerStore } from "../store/playerStore";
import { useEffect } from "react";

export default function MiniPlayer() {
  const { currentSong, isPlaying, position, duration, activeScreen, isSheetOpen } = usePlayerStore();
  const { togglePlay } = usePlayer();
  const navigation = useNavigation<any>();

  useEffect(() => {
    if(isSheetOpen) return;
  }, [isSheetOpen]);

  if (!currentSong || activeScreen === "Player") return null;

  

  const progress = duration > 0 ? position / duration : 0;

  return (
    <View className="absolute bottom-[85px] left-3 right-3 bg-[#1e293b] rounded-2xl overflow-hidden shadow-lg" style={{ zIndex: isSheetOpen ? 0 : 999, opacity: isSheetOpen ? 0 : 1, bottom: isSheetOpen ? 0 : activeScreen === "AlbumDetails" ? 30 : 85, }} pointerEvents={isSheetOpen ? "none" : "auto"}>
    
      <View className="flex-row items-center p-3 gap-3">
        {/* Middle section - opens full player */}
        <TouchableOpacity
          className="flex-1 flex-row items-center gap-3"
          onPress={() => navigation.navigate("Player")}
        >
          {currentSong.image ? (
            <Image
              source={{ uri: currentSong.image }}
              className="w-11 h-11 rounded-lg"
            />
          ) : (
            <View className="w-11 h-11 rounded-lg bg-[#0f172a] items-center justify-center">
              <Ionicons name="musical-note" size={20} color="#6b7280" />
            </View>
          )}

          <View className="flex-1">
            <Text className="text-white font-semibold text-sm" numberOfLines={1}>
              {currentSong.name}
            </Text>
            <Text className="text-gray-500 text-xs mt-0.5" numberOfLines={1}>
              {currentSong.artists}
            </Text>
          </View>
        </TouchableOpacity>


        <TouchableOpacity
          onPress={togglePlay}
          className="bg-orange-500 w-10 h-10 rounded-full items-center justify-center"
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={18}
            color="white"
          />
        </TouchableOpacity>
      </View>

       <View className="h-[3px] bg-[#334155]">
            <View
            className="h-[3px] bg-orange-500"
            style={{ width: `${progress * 100}%` }}
            />
        </View>

    </View>
  );
}