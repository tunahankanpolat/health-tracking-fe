import { Drawer } from "expo-router/drawer";
import CustomDrawerContent from "./utils/CustomDrawerContent";

export default function GenericStack() {
  return (
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
  );
}
