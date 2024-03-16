import { Stack, Link } from "expo-router";
import { Text, View, Pressable } from "react-native";
import { useSession } from "../ctx";

export default function GenericStack(path) {
  const { signOut } = useSession();
  return (
    <Stack
      screenOptions={{
        headerTitle: "",
        headerLeft: () => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              fontWeight: "bold",
            }}
            className="font-bold gap-20 ml-60 android:gap-2 android:ml-2"
          >
            <Link href={path} className="font-bold text-xl">
              Main Menu
            </Link>
          </View>
        ),
        headerRight: () => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              fontWeight: "bold",
            }}
            className="font-bold gap-20 mr-60 android:gap-2 android:mr-2"
          >
            <Pressable onPress={() => signOut()}>
              <Text className="font-bold text-xl">Sign Out</Text>
            </Pressable>
          </View>
        ),
      }}
    ></Stack>
  );
}
