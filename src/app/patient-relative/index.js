import { useEffect, useState } from "react";
import { View } from "react-native";
import PatientRelativeService from "../services/patientReletiveService";
import AwsLambdaService from "../services/awsLambdaService";
import CustomLineChart from "../utils/CustomLineChart";
import { useSession } from "../../ctx";

export default function Page() {
  const { session, isLoading } = useSession();
  if (isLoading) return null;
  const [healthData, setHealthData] = useState([]);
  useEffect(() => {
    let patientId;
    const patientRelativeService = new PatientRelativeService();
    patientRelativeService.getPatientId(session).then((response) => {
      patientId = response.data;
      const awsLambdaService = new AwsLambdaService();
      awsLambdaService.getHealthData(patientId).then((response) => {
        setHealthData(response.data);
      });
    });
  }, []);

  return (
    <View className="flex-1 justify-center between bg-background object-top">
      <View className="flex-1 self-top justify-center items-center w-full bg-background px-4 py-10 android:mx-0 android:px-0 ios:mx-0 ios:mx-0">
        {healthData.length != 0 && (
          <CustomLineChart healthData={healthData} thema="background" />
        )}
      </View>
    </View>
  );
}
