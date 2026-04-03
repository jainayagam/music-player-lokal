import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useEffect, useRef, useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { usePlayerStore } from "../store/playerStore";
import BottomSheet from "@gorhom/bottom-sheet";
import SongOptionsSheet from "./SongOptionSheet";
import { Song } from "../store/playerStore";
import { BlurView } from "expo-blur";

const decodeHtml = (text: string) => {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
};

export default function AlbumDetails() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { albumId, albumName, albumImage } = route.params;

  const [songs, setSongs] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const { setCurrentSong } = usePlayerStore();

  useEffect(() => { fetchAlbumSongs(); }, [albumId]);

  const fetchAlbumSongs = async () => {
    try {
      const res = await fetch(`https://saavn.sumit.co/api/albums?id=${albumId}`);
      const data = await res.json();
      const fetchedSongs = data?.data?.songs ?? [];
      setSongs(fetchedSongs);
      const firstArtist = fetchedSongs[0]?.artists?.primary?.[0]?.name;
      const query = firstArtist ?? albumName;
      fetchSuggestions(query);
    } catch (error) {
      console.error("Error fetching album songs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async (query: string) => {
    try {
      const res = await fetch(`https://saavn.sumit.co/api/search/albums?query=${encodeURIComponent(query)}&limit=10`);
      const data = await res.json();
      const filtered = (data?.data?.results ?? []).filter((a: any) => String(a.id) !== String(albumId));
      setSuggestions(filtered);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const openMenu = (item: any) => {
    setSelectedSong({
      id: item.id,
      name: item.name,
      artists: item.artists?.primary?.map((a: any) => a.name).join(", ") || "Unknown Artist",
      image: item.image?.[2]?.url ?? "",
      url: item.downloadUrl?.[4]?.url ?? item.downloadUrl?.[3]?.url ?? "",
      duration: Number(item.duration) * 1000,
    });
    bottomSheetRef.current?.expand();
  };

  if (loading) {
    return (
      <View className="flex-1 bg-[#0f172a] items-center justify-center">
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <>
      <View className="flex-1 bg-[#0f172a]">


        <BlurView intensity={50} tint="dark" style={{ position: "absolute", top: 0, left: 0, right: 0, height: 50, zIndex: 10 }} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}>

          <View className="pt-16 pb-4 flex-row items-center">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-xl font-bold flex-1" numberOfLines={1}>{albumName}</Text>
          </View>

          {albumImage && (
            <Image source={{ uri: albumImage }} className="w-56 h-56 rounded-2xl self-center mb-6" />
          )}

          <Text className="text-white text-lg font-semibold mb-3">Songs</Text>

          {songs.map((item: any, index: number) => {
            const imageUri = item.image?.[1]?.url ?? item.image?.[1]?.link;
            const artistNames = item.artists?.primary?.map((a: any) => a.name).join(", ") ?? "";

            return (
              <View key={item.id} className="flex-row items-center mb-4">
                <Text className="text-gray-500 w-6 text-sm">{index + 1}</Text>

                {imageUri ? (
                  <Image source={{ uri: imageUri }} className="w-12 h-12 rounded-lg mx-3" />
                ) : (
                  <View className="w-12 h-12 rounded-lg mx-3 bg-[#1e293b] items-center justify-center">
                    <Ionicons name="musical-note" size={20} color="#6b7280" />
                  </View>
                )}

                <View className="flex-1">
                  <Text className="text-white font-semibold text-sm" numberOfLines={1}>{decodeHtml(item.name ?? "")}</Text>
                  <Text className="text-gray-400 text-xs mt-0.5" numberOfLines={1}>{decodeHtml(artistNames)}</Text>
                </View>

                <TouchableOpacity className="bg-orange-500 p-2.5 rounded-full mr-3" onPress={() => setCurrentSong({
                  id: item.id,
                  name: item.name,
                  artists: item.artists?.primary?.map((a: any) => a.name).join(", ") || "Unknown Artist",
                  image: item.image?.[2]?.url ?? "",
                  url: item.downloadUrl?.[4]?.url ?? item.downloadUrl?.[3]?.url ?? "",
                  duration: Number(item.duration) * 1000,
                })}>
                  <Ionicons name="play" size={14} color="white" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => openMenu(item)}>
                  <Ionicons name="ellipsis-vertical" size={18} color="#9ca3af" />
                </TouchableOpacity>
              </View>
            );
          })}

          {suggestions.length > 0 && (
            <View className="mt-6">
              <Text className="text-white text-lg font-semibold mb-3">More Like This</Text>

              {suggestions.map((item: any) => {
                const imageUri = item.image?.[2]?.link ?? item.image?.[2]?.url;
                const artistNames = item.artists?.primary?.map((a: any) => a.name).join(", ") ?? item.primaryArtists ?? "";

                return (
                  <TouchableOpacity key={item.id} onPress={() => navigation.replace("AlbumDetails", { albumId: item.id, albumName: decodeHtml(item.name ?? ""), albumImage: imageUri })} className="flex-row items-center mb-4">
                    {imageUri ? (
                      <Image source={{ uri: imageUri }} style={{ width: 56, height: 56, borderRadius: 8, marginRight: 12 }} />
                    ) : (
                      <View style={{ width: 56, height: 56, borderRadius: 8, marginRight: 12, backgroundColor: "#1e293b", alignItems: "center", justifyContent: "center" }}>
                        <Ionicons name="musical-notes" size={24} color="#6b7280" />
                      </View>
                    )}
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: "white", fontWeight: "600", fontSize: 14 }} numberOfLines={1}>{decodeHtml(item.name ?? "")}</Text>
                      {artistNames ? <Text style={{ color: "#6b7280", fontSize: 12, marginTop: 2 }} numberOfLines={1}>{decodeHtml(artistNames)}</Text> : null}
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#6b7280" />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>
      </View>

      <SongOptionsSheet ref={bottomSheetRef} song={selectedSong} onClose={() => bottomSheetRef.current?.close()} />
    </>
  );
}