import { Text, View, Image, FlatList, TextInput, TouchableOpacity } from "react-native";
import { useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";
import { usePlayerStore } from "../store/playerStore";
import { Song } from "../store/playerStore";
import BottomSheet from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet";
import SongOptionsSheet from "./SongOptionSheet";





export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigation = useNavigation();
  const { setCurrentSong } = usePlayerStore();
  
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);


  const openMenu = (item: any) => {
    setSelectedSong({
      id: item.id,
      name: item.name,
      artists: item.artists?.primary?.map((a: any) => a.name).join(", ") || "Unknown Artist",
      image: item.image?.[2]?.link ?? item.image?.[2]?.url ?? "",
      url: item.downloadUrl?.[4]?.url ?? item.downloadUrl?.[3]?.url ?? "",
      duration: Number(item.duration) * 1000,
    });
    bottomSheetRef.current?.expand();
  };
 
  const decodeHTML = (str: string) => {
    return str
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  };

  const searchSong = async (text: string) => {
    setQuery(text);
    if (text.length > 2) {
      try {
        const res = await fetch(`https://saavn.sumit.co/api/search/songs?query=${text}`);
        const data = await res.json();
        setResults(data.data.results);
        // console.log(data.data.results);
      } catch (error) {
        console.error("Error searching song:", error);
      }
    } else {
      setResults([]);
    }


  };

  return (
    <>
    <View className="flex-1 bg-[#0f172a] px-4 pt-10">
      <Text className="text-white text-2xl font-bold px-3 pt-10">Search</Text>

      <TextInput placeholder="Search songs..." placeholderTextColor="#6b7280" value={query} onChangeText={searchSong} className="bg-[#1e293b] text-white px-4 py-3 mt-2 rounded-xl "/>


      {results.length > 0 && (
        <Text className="text-gray-400 mt-4 text-sm">{results.length} songs</Text>
      )}


      <FlatList data={results} keyExtractor={(item: any) => item.id} showsVerticalScrollIndicator={false} renderItem={({ item }: any) => {
          const imageUri = item.image?.[1]?.link ?? item.image?.[1]?.url;

          return (
            <TouchableOpacity className="mb-4" onPress={() => navigation.navigate("AlbumDetails", { albumId: item.album.id, albumName: item.album.name, albumImage: imageUri })}>
            <View className="flex-row items-center mt-5" >

              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  className="w-14 h-14 rounded-xl mr-4"
                />
              ) : (
                <View className="w-14 h-14 rounded-xl mr-4 bg-[#1e293b] items-center justify-center">
                  <Ionicons name="musical-note" size={24} color="#6b7280" />
                </View>
              )}


              <View className="flex-1">
                <Text className="text-white font-semibold text-base" numberOfLines={1}>
                  {decodeHTML(item.name)}
                </Text>
                <Text className="text-gray-400 text-sm mt-1" numberOfLines={1}>
                  {/* {item.primaryArtists} */}
                  {decodeHTML(item.artists?.primary?.map((a: any) => a.name).join(", ") || "Unknown Artist")}
                    - {decodeHTML(item.album.name)}

                </Text>
              </View>


              <TouchableOpacity className="bg-orange-500 p-3 rounded-full mr-3" onPress={() =>
                setCurrentSong({
                  id: item.id,
                  name: item.name,
                  artists: item.artists?.primary?.map((a: any) => a.name).join(", ") || "Unknown Artist",
                  image: item.image?.[2]?.url ?? item.image?.[2]?.url ?? "",
                  url: item.downloadUrl?.[4]?.url ?? item.downloadUrl?.[3]?.url ?? "",
                  duration: Number(item.duration) * 1000,
                })}>
                  {/* {console.log(item.downloadUrl?.[4]?.url ?? item.downloadUrl?.[3]?.url ?? "")} */}
                <Ionicons name="play" size={16} color="white" />
              </TouchableOpacity>

              <TouchableOpacity className="" onPress={() => openMenu(item)}>  
                <Ionicons name="ellipsis-vertical" size={18} color="#9ca3af" />
              </TouchableOpacity>
            </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
    <SongOptionsSheet ref={bottomSheetRef} song={selectedSong} onClose={() => bottomSheetRef.current?.close()}/>
    </>
  );
}