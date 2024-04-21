//web client id: 95257513350-h65r6h5g6gpgjlujak87ulldrl3tknjf.apps.googleusercontent.com
//web client secret: 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
//android: 95257513350-al7els8e4558f626n21rq6ncfcggd20p.apps.googleusercontent.com
//ios: 95257513350-bi9mlkn4cstevc6ls6vpds5la1962n96.apps.googleusercontent.com
import { useEffect, useState } from "react";
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
}) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    scopes: ["https://www.googleapis.com/auth/fitness.heart_rate.read"],
    androidClientId:
      "95257513350-al7els8e4558f626n21rq6ncfcggd20p.apps.googleusercontent.com",
    iosClientId:
      "95257513350-bi9mlkn4cstevc6ls6vpds5la1962n96.apps.googleusercontent.com",
    webClientId:
      "95257513350-h65r6h5g6gpgjlujak87ulldrl3tknjf.apps.googleusercontent.com",
    responseType: "code",
    shouldAutoExchangeCode: false,
    prompt: "consent",
    extraParams: {
      access_type: "offline",
    },
  });
  console.log("request", request);

  useEffect(() => {
    getAutorizedCode();
  }, [response]);

  const getAutorizedCode = () => {
    console.log("response", response);
    if (response?.type === "success") {
      toastMessage("success", "Google Fit Access Granted");
      const { code, state, scope, prompt } = response.params;
      const userId = getUserIdFromSession();
      console.log("codeVerifier1", request.codeVerifier);
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
    console.log("codeVerifier2", codeVerifier);
    try {
      awsLambdaService.postAuthorizedCode(
        authorizedCode,
        userId,
        scope,
        state,
        codeVerifier,
        platform,
        clientId,
        redirectUri
      );
    } catch (error) {
      console.log(error);
    }
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
    !isAuthorized && (
      <View className="flex-1 justify-end items-center h-full m-2 p-2 w-full bg-background">
        <Pressable
          onPress={() => promptAsync()}
          className="bg-primary px-5 py-2 rounded-lg flex-row items-center w-full justify-center"
        >
          <MaterialIcons name="fitness-center" size={24} color="white" />
          <Text className="text-white ml-2">Google Fit Access</Text>
        </Pressable>
      </View>
    )
  );
}
