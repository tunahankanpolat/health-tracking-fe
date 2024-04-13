import { Picker } from "@react-native-picker/picker";
import RNPickerSelect from "react-native-picker-select";
import {
  View,
  Text,
  Pressable,
  FlatList,
  Modal,
  ScrollView,
  Platform,
} from "react-native";
import { useState, useEffect } from "react";
import PatientService from "../services/patientService";

export default function ShowPrescriptionModal(props) {
  const { modalVisible, setModalVisible, patientId, session } = props;
  const [prescriptions, setPrescriptions] = useState([]);

  const handleClose = () => {
      setModalVisible(false);
      };

  useEffect(() => {
      const patientService = new PatientService();
      patientService
        .getPrescriptions(session, patientId)
        .then((response) => {
          setPrescriptions(response.data);
        });
  }, []);

  return (
    <Modal visible={modalVisible} onRequestClose={() => handleClose()}  transparent={true}>
      <View className="flex-1 rounded-xl justify-center items-center gap-y-2 m-2 bg-white my-20 mx-80 android:mx-0 ios:mx-0 p-2">
      {prescriptions.length != 0 &&
          (Platform.OS === "web" ? (
            <ScrollView className="flex-1 w-full">
              {getFlatList(prescriptions, handleClose)}
            </ScrollView>
          ) : (
            getFlatList(prescriptions, handleClose)
          ))}


      </View>
    </Modal>
  );
}

const getFlatList = (prescriptions, handleClose) => {
      return (
            <FlatList
            ListHeaderComponent={
                  <View className="border-b-2 border-gray-300 items-end">
                  <Pressable onPress={() => handleClose()}>
                        <Text className="border-2 p-1 mb-2 border-gray-300 rounded-xl text-lg text-center">X</Text>
                  </Pressable>
                  </View>
            }
            data={prescriptions}
            renderItem={({ item }) => (
            <View className="flex-row flex-3 w-full justify-between border-b-2 border-gray-300 gap-x-20 android:gap-x-2 ios:gap-x-2">
                  <View className="flex-col flex-2 android:flex-1 ios:flex-1">
                    <Text className="flex-1 text-lg text-start">Prescription Date: {new Date(item.prescriptionDate).toLocaleDateString("tr-TR")}</Text>
                    <Text className="flex-1 text-lg text-start">Expiry Date: {new Date(item.expiryDate).toLocaleDateString("tr-TR")}</Text>
                    
                    <Text className="flex-1 text-lg text-start">Instructions: {item.instructions}</Text>
                    </View>
                    <View className="flex-1 android:flex-2 ios:flex-2">
                    <FlatList
                  ListHeaderComponent={
                        <View className="flex-row flex-3 justify-between border-b-2 border-gray-300 p-2 w-full">
                              <Text className="flex-1 text-lg">Drug</Text>
                              <Text className="flex-1 text-lg">Dosage</Text>
                              <Text className="flex-1 text-lg text-end">Frequency</Text>
                        </View>
                  }
                        data={item.drugUsages}
                        renderItem={({ item }) => (
                          <View className="flex-row flex-3 justify-between border-b-2 border-gray-300 p-2 w-full">
                        <Text className="flex-1 text-lg">{item.drugName}</Text>
                        <Text className="flex-1 text-lg">{item.dosage}</Text>
                        <Text className="flex-1 text-lg text-end">{item.frequency}</Text>
                          </View>
                        )}
                        keyExtractor={(item) => item.drugUsageId}
                    />
                    </View>
  
            </View>
            )}
            keyExtractor={(item) => item.prescriptionId}
      />
      );
}
