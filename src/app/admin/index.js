import { Text } from "react-native";
import AdminService from "../services/adminService";
import { useEffect, useState } from "react";
import { useSession } from "../../ctx";
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";
import { ActivityIndicator, View } from "react-native";

export default function Page() {
  const { session } = useSession();
  const [admin, setAdmin] = useState(null);
  const getUserIdFromSession = () => {
    let userId;
    try {
      decoded = jwtDecode(session);
      userId = decoded.userId;
    } catch (e) {
      console.log(e);
    }
    return userId;
  };

  useEffect(() => {
    const adminService = new AdminService();
    adminService
      .getAdmin(session, getUserIdFromSession())
      .then((response) => setAdmin(response.data));
  }, [session]);

  return admin ? (
    <View className="flex-1 justify-center items-center bg-gray-100 p-4">
      <Text className="text-2xl font-bold text-gray-800">
        Welcome, Administrator {admin.name} {admin.surname}
      </Text>
    </View>
  ) : (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#00ff00" />
    </View>
  );
}
