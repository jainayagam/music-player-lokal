import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { usePlayerStore } from "../store/playerStore";
import { usePlayer } from "../hooks/usePlayer";
import Slider from "@react-native-community/slider";

const { width } = Dimensions.get("window");

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export default function Player() {
  const navigation = useNavigation<any>();
  const { currentSong, isPlaying, position, duration } = usePlayerStore();
  const { togglePlay, seekTo, playNext, playPrevious } = usePlayer();

  if (!currentSong) return null;

  return (
    <View style={{ flex: 1, backgroundColor: "#0f172a" }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 56, paddingHorizontal: 20, paddingBottom: 16 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="chevron-down" size={28} color="white" /></TouchableOpacity>
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: "#6b7280", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>Now Playing</Text>
        </View>
      </View>

      <View style={{ alignItems: "center", marginTop: 24, marginBottom: 40 }}>
        {currentSong.image ? (
          <Image source={{ uri: currentSong.image }} style={{ width: width - 80, height: width - 80, borderRadius: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 16 }} />
        ) : (
          <View style={{ width: width - 80, height: width - 80, borderRadius: 20, backgroundColor: "#1e293b", alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="musical-notes" size={80} color="#6b7280" />
          </View>
        )}
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 24, marginBottom: 24 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "white", fontSize: 22, fontWeight: "bold" }} numberOfLines={1}>{currentSong.name}</Text>
          <Text style={{ color: "#6b7280", fontSize: 16, marginTop: 4 }} numberOfLines={1}>{currentSong.artists}</Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: 24, marginBottom: 8 }}>
        <Slider style={{ width: "100%", height: 40 }} minimumValue={0} maximumValue={duration} value={position} minimumTrackTintColor="#f97316" maximumTrackTintColor="#334155" thumbTintColor="#f97316" onSlidingComplete={(value) => seekTo(value)} />
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: -8 }}>
          <Text style={{ color: "#6b7280", fontSize: 12 }}>{formatTime(position)}</Text>
          <Text style={{ color: "#6b7280", fontSize: 12 }}>{formatTime(duration)}</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 32, marginTop: 16 }}>
        <TouchableOpacity onPress={() => navigation.navigate("Queue")}><Ionicons name="list" size={24} color="white" /></TouchableOpacity>
        <TouchableOpacity onPress={playPrevious}><Ionicons name="play-skip-back" size={32} color="white" /></TouchableOpacity>
        <TouchableOpacity onPress={togglePlay} style={{ width: 68, height: 68, borderRadius: 34, backgroundColor: "#f97316", alignItems: "center", justifyContent: "center", shadowColor: "#f97316", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 12 }}>
          <Ionicons name={isPlaying ? "pause" : "play"} size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={playNext}><Ionicons name="play-skip-forward" size={32} color="white" /></TouchableOpacity>
        <TouchableOpacity><Ionicons name="repeat" size={24} color="#6b7280" /></TouchableOpacity>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 24, marginTop: 32, gap: 12 }}>
        <Ionicons name="volume-low" size={20} color="#6b7280" />
        <Slider style={{ flex: 1, height: 40 }} minimumValue={0} maximumValue={1} value={1} minimumTrackTintColor="#6b7280" maximumTrackTintColor="#334155" thumbTintColor="#6b7280" />
        <Ionicons name="volume-high" size={20} color="#6b7280" />
      </View>
    </View>
  );
}