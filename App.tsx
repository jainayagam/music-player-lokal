import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./navigation/TabNavigator";
import "./global.css"
import AlbumDetails from "./screens/AlbumDetails";
import { View } from "react-native";
import MiniPlayer from "./screens/MiniPlayer";
import AudioProvider from "./screens/AudioProvider";
import Player from "./screens/Player";
import NavigationTracker from "./screens/NavigationTracker";
import { usePlayerStore } from "./store/playerStore";
import { useEffect } from "react";
import Queue from "./screens/queue";
import { GestureHandlerRootView } from "react-native-gesture-handler";



const Stack = createNativeStackNavigator();

export default function App() {
    const {loadQueue} = usePlayerStore();


    useEffect(() => {
        loadQueue();
    }, [])
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer onStateChange={(state) => { const route = state?.routes?.[state.index];  usePlayerStore.getState().setActiveScreen(route?.name ?? "");}} >
                <AudioProvider />
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Tabs" component={TabNavigator} />
                    <Stack.Screen name="AlbumDetails" component={AlbumDetails} />
                    <Stack.Screen name="Player" component={Player} />
                    <Stack.Screen name="Queue" component={Queue} />
                </Stack.Navigator>
                <MiniPlayer />           
        </NavigationContainer>
    </GestureHandlerRootView >
  );
}
