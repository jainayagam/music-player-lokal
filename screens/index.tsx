import { Text, View, Image, FlatList, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";
import AlbumDetails from "./AlbumDetails";
import BlurView from "expo-blur/build/BlurView";

const decodeHtml = (text: string) => {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
};

const categories = [
  { label: "Trending", query: "trending hits" },
  { label: "Bollywood", query: "bollywood 2024" },
  { label: "Tamil", query: "tamil 2024" },
  { label: "Telugu", query: "telugu 2024" },
  { label: "Kannada", query: "kannada 2024" },
  { label: "Punjabi", query: "punjabi hits" },
  { label: "Arijit Singh", query: "arijit singh" },
  { label: "Romantic", query: "romantic hindi" },
];

export default function Home() {
  const [sections, setSections] = useState<{ label: string; albums: any[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchAllSections();
  }, []);

  const fetchAllSections = async () => {
    try {
      const results = await Promise.all(
        categories.map(async (cat) => {
          const res = await fetch(
            `https://saavn.sumit.co/api/search/albums?query=${encodeURIComponent(cat.query)}&limit=10`
          );
          const data = await res.json();
          return {
            label: cat.label,
            albums: data?.data?.results ?? [],
          };
        })
      );
      setSections(results);
    } catch (error) {
      console.error("Error fetching home sections:", error);
    } finally {
      setLoading(false);
    }
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
    <BlurView intensity={50} tint="dark" style={{ position: "absolute", top: 0, left: 0, right: 0, height: 50, zIndex: 10 }} />
    <ScrollView className="flex-1 bg-[#0f172a]" showsVerticalScrollIndicator={false}>
      <View className="px-4 pt-20 pb-4">
        <Text className="text-white text-3xl font-bold">Home</Text>

      </View>

      {sections.map((section) => (
        <View key={section.label} className="mb-6">

          <View className="flex-row justify-between items-center px-4 mb-3">
            <Text className="text-white text-lg font-semibold">{section.label}</Text>
            <TouchableOpacity>
              <Text className="text-orange-400 text-sm">See all</Text>
            </TouchableOpacity>
          </View>


          <FlatList
            data={section.albums}
            keyExtractor={(item: any) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            renderItem={({ item }: any) => {
              const imageUri = item.image?.[2]?.link ?? item.image?.[2]?.url;
              const artistNames = item.artists?.primary?.map((a: any) => a.name).join(", ")
                ?? item.primaryArtists
                ?? "";

              return (
                <TouchableOpacity className="mr-4 w-36" onPress={() => navigation.navigate("AlbumDetails", { albumId: item.id, albumName: item.name, albumImage: imageUri })}>

                  {imageUri ? (
                    <Image
                      source={{ uri: imageUri }}
                      className="w-36 h-36 rounded-xl"
                    />
                  ) : (
                    <View className="w-36 h-36 rounded-xl bg-[#1e293b] items-center justify-center">
                      <Ionicons name="musical-notes" size={32} color="#6b7280" />
                    </View>
                  )}


                  <Text className="text-white text-sm font-semibold mt-2"  numberOfLines={1}>
                    {decodeHtml(item.name ?? "")}
                  </Text>


                  {artistNames ? (
                    <Text
                      className="text-gray-400 text-xs mt-0.5"
                      numberOfLines={1}
                    >
                      {decodeHtml(artistNames)}
                    </Text>
                  ) : null}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      ))}

      <View className="h-24" />
    </ScrollView>
    </>
  );
}