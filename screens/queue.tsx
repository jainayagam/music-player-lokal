import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { usePlayerStore } from "../store/playerStore";

export default function Queue() {
  const navigation = useNavigation<any>();
  const { queue, currentIndex, playSongFromQueue, removeFromQueue, clearQueue } = usePlayerStore();

  return (
    <View style={{ flex: 1, backgroundColor: "#0f172a" }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 56, paddingHorizontal: 20, paddingBottom: 16 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="chevron-down" size={28} color="white" /></TouchableOpacity>
        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>Queue</Text>
        <TouchableOpacity onPress={clearQueue}><Text style={{ color: "#f97316", fontSize: 14 }}>Clear</Text></TouchableOpacity>
      </View>

      {queue.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="musical-notes-outline" size={64} color="#334155" />
          <Text style={{ color: "#6b7280", marginTop: 16, fontSize: 16 }}>Your queue is empty</Text>
        </View>
      ) : (
        <FlatList
          data={queue}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item, index }) => {
            const isCurrentSong = index === currentIndex;
            return (
              <TouchableOpacity onPress={() => playSongFromQueue(index)} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 10, backgroundColor: isCurrentSong ? "#1e293b" : "transparent", borderRadius: 12, paddingHorizontal: 8, marginBottom: 4 }}>
                <View style={{ width: 24, alignItems: "center" }}>
                  {isCurrentSong ? <Ionicons name="musical-note" size={16} color="#f97316" /> : <Text style={{ color: "#6b7280", fontSize: 13 }}>{index + 1}</Text>}
                </View>

                {item.image ? (
                  <Image source={{ uri: item.image }} style={{ width: 48, height: 48, borderRadius: 8, marginHorizontal: 12 }} />
                ) : (
                  <View style={{ width: 48, height: 48, borderRadius: 8, marginHorizontal: 12, backgroundColor: "#1e293b", alignItems: "center", justifyContent: "center" }}>
                    <Ionicons name="musical-note" size={20} color="#6b7280" />
                  </View>
                )}

                <View style={{ flex: 1 }}>
                  <Text style={{ color: isCurrentSong ? "#f97316" : "white", fontWeight: "600", fontSize: 14 }} numberOfLines={1}>{item.name}</Text>
                  <Text style={{ color: "#6b7280", fontSize: 12, marginTop: 2 }} numberOfLines={1}>{item.artists}</Text>
                </View>

                <TouchableOpacity onPress={() => removeFromQueue(index)}>
                  <Ionicons name="close-circle-outline" size={22} color="#6b7280" />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          }}
          ListFooterComponent={<View style={{ height: 100 }} />}
        />
      )}
    </View>
  );
}