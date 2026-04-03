import { useEffect } from "react";
import { useNavigationState } from "@react-navigation/native";
import { usePlayerStore } from "../store/playerStore";

export default function NavigationTracker() {
  const { setActiveScreen } = usePlayerStore();

  const routeName = useNavigationState((state) => {
    const route = state?.routes?.[state.index];
    return route?.name ?? "";
  });

  useEffect(() => {
    setActiveScreen(routeName);
  }, [routeName]);

  return null;
}