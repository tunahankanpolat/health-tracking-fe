import { useEffect } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import toastMessage from "../utils/toastMessage";
import { jwtDecode } from "jwt-decode";
import AwsLambdaService from "../services/awsLambdaService";
import "core-js/stable/atob";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleFitAccessButton({
  setIsAuthorized,
  isAuthorized,
  session,
  setHealthData,
  setIsHealthDataLoading,
  patient,
}) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    scopes: ["https://www.googleapis.com/auth/fitness.heart_rate.read"],
    androidClientId:
      "",
    iosClientId:
      "",
    webClientId:
      "",
    responseType: "code",
    shouldAutoExchangeCode: false,
    prompt: "consent",
    extraParams: {
      access_type: "offline",
    },
  });

  useEffect(() => {
    getAutorizedCode();
  }, [response]);

  const getAutorizedCode = () => {
    if (response?.type === "success") {
      toastMessage("success", "Google Fit Access Granted");
      const { code, state, scope, prompt } = response.params;
      const userId = getUserIdFromSession();
      postAuthorizedCode(
        code,
        userId,
        scope,
        state,
        request.codeVerifier,
        Platform.OS,
        request.clientId,
        request.redirectUri
      );
      setIsAuthorized(true);
    } else if (response?.type === "dismiss" || response?.type === "cancel") {
      toastMessage("error", "Google Fit Access Denied");
    }
  };

  const postAuthorizedCode = (
    authorizedCode,
    userId,
    scope,
    state,
    codeVerifier,
    platform,
    clientId,
    redirectUri
  ) => {
    
    const awsLambdaService = new AwsLambdaService();
    setIsHealthDataLoading(true);
    awsLambdaService.postAuthorizedCode(authorizedCode,
      userId,
      scope,
      state,
      codeVerifier,
      platform,
      clientId,
      redirectUri).then((response) => {
        awsLambdaService.getHealthData(patient).then((response) => {
          setHealthData(response.data);
          setIsHealthDataLoading(false);
        });
      }
    ).catch((error) => {
      console.log("Error:", error);
    });
  };

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

  return (
      <View className="flex-1 justify-end items-center h-full p-2 w-full bg-background">
        <Pressable
          onPress={() => promptAsync()}
          className="bg-primary px-5 py-2 rounded-lg flex-row items-center w-full justify-center"
        >
          <MaterialIcons name="fitness-center" size={24} color="white" />
          <Text className="text-white ml-2">Google Fit Access</Text>
        </Pressable>
      </View>
  );
}
