import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import Home from "../screens/index";
import Search from "../screens/search";
import NavigationTracker from "@/screens/NavigationTracker";
import { StyleSheet } from "react-native";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <>
      <NavigationTracker />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: { position: "absolute", backgroundColor: "rgba(15, 23, 42, 0.85)", borderTopWidth: 0, elevation: 0 },
          tabBarBackground: () => <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />,
          tabBarActiveTintColor: "#f97316",
          tabBarInactiveTintColor: "#6b7280",
          tabBarIcon: ({ color, size }) => {
            const icon = route.name === "Home" ? "home" : "search";
            return <Ionicons name={icon} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Search" component={Search} />
      </Tab.Navigator>
    </>
  );
}