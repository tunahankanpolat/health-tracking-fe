import { Text, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import { View } from "react-native";
import GoogleFitAccessButton from "../components/GoogleFitAccessButton"; // GoogleSignInButton'ın doğru kütüphane yolunu ekleyin
import { useSession } from "../../ctx";
import AwsLambdaService from "../services/awsLambdaService";
import { jwtDecode } from "jwt-decode";
import CustomLineChart from "../utils/CustomLineChart";

export default function Page() {
  const { isLoading, session, setIsAuthorized, isAuthorized } = useSession();
  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) return null;
  const [healthData, setHealthData] = useState([]);

  useEffect(() => {
    let patient;
    try {
      decoded = jwtDecode(session);
      patient = decoded.userId;
    } catch (e) {
      console.log(e);
    }
    const awsLambdaService = new AwsLambdaService();
    awsLambdaService.getHealthData(patient).then((response) => {
      setHealthData(response.data);
    });
  }, []);

  return (
    <View className="flex-1 justify-center between bg-background object-top">
      <View className="flex-1 self-top justify-center items-center w-full bg-background px-4 py-10 android:mx-0 android:px-0 ios:mx-0 ios:mx-0">
        {healthData.length != 0 && (
          <CustomLineChart healthData={healthData} thema="background" />
        )}
      </View>
      <GoogleFitAccessButton
        session={session}
        setIsAuthorized={setIsAuthorized}
        isAuthorized={isAuthorized}
      />
    </View>
  );
}
