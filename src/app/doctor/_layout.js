import { Redirect, Stack } from 'expo-router';
import { useSession } from '../../ctx';
import { Text } from 'react-native';
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";

export default function AppLayout() {
  
  const {isLoading, session} = useSession();
  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  let decoded;
  try {
    decoded = jwtDecode(session);
  } catch (e) {
    return <Redirect href="/auth" />;
  }
  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (decoded.role !== process.env.EXPO_PUBLIC_ROLE_DOCTOR) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/auth" />;
  }

  // This layout can be deferred because it's not the root layout.
  return <Stack />;
}
