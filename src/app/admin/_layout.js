import { Redirect } from "expo-router";
import { useSession } from "../../ctx";
import { Text } from "react-native";
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";
import GenericStack from "../GenericStack";

export default function AppLayout() {
  const { signOut } = useSession();
  const { isLoading, session } = useSession();
  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) return null;
  let decoded;
  try {
    decoded = jwtDecode(session);
  } catch (e) {
    return <Redirect href="/auth" />;
  }
  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (decoded.role !== process.env.EXPO_PUBLIC_ROLE_ADMIN) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/auth" />;
  }

  // if (Platform.OS === 'web') {
  //   return (
  //     <View style={{ flex: 1 }}>
  //       <View style={{ height: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, backgroundColor: '#f0f0f0' }}>
  //         <Text>Admin</Text>
  //         <Pressable onPress={() => signOut()}>
  //           <Text>Sign Out</Text>
  //         </Pressable>
  //       </View>
  //     </View>
  //   );
  // }
  // This layout can be deferred because it's not the root layout.
  return <GenericStack path="/admin" />;
}
