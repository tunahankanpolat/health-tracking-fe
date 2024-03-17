import { Drawer } from "expo-router/drawer";
import CustomDrawerContent from "./utils/CustomDrawerContent";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function GenericStack() {
  return (

    <GestureHandlerRootView style={{ flex: 1 }}>
    <Drawer drawerContent={CustomDrawerContent}>
      <Drawer.Screen
        name="index" // This is the name of the page and must match the url from root
        label="Home"
        options={{
          label: "<Text>Home</Text>",
          title: " My Home",
        }}
      />
    </Drawer>
    </GestureHandlerRootView>

  );
}
