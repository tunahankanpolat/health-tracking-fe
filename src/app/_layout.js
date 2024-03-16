import "../index.css";
import { Slot } from "expo-router";
import { SessionProvider } from "../ctx";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  return (
    <SessionProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Slot />
      </GestureHandlerRootView>
    </SessionProvider>
  );
}
