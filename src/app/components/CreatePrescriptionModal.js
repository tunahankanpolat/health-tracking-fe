import { Picker } from "@react-native-picker/picker";
import RNPickerSelect from "react-native-picker-select";
import {
  View,
  Text,
  Pressable,
  FlatList,
  Modal,
  TextInput,
  Platform,
} from "react-native";
import CustomDatePicker from "../utils/CustomDatePicker";
import DrugService from "../services/drugService";
import { useState, useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import PrescriptionService from "../services/prescriptionService";
import { useSession } from "../../ctx";
import toastMessage from '../utils/toastMessage';

export default function CreatePrescriptionModal(props) {
  const { modalVisible, setModalVisible, patientId, session, drugList } = props;
  const [prescriptionDate, setPrescriptionDate] = useState(new Date());
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [instructions, setInstructions] = useState("");
  const [selectedDrugUsages, setSelectedDrugUsages] = useState([]);
  const [drugId, setDrugId] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");

  const handleClose = () => {
      setPrescriptionDate(new Date());
      setExpiryDate(new Date());
      setInstructions("");
      setSelectedDrugUsages([]);
      setDrugId("");
      setDosage("");
      setFrequency("");
      setModalVisible(false);
      };

  const handleCreatePrescription = (patientId, selectedDrugUsages, token) => {
    const drugUsages = selectedDrugUsages.map((drugUsage) => ({
      drugId: drugUsage.drugId,
      dosage: drugUsage.dosage,
      frequency: drugUsage.frequency,
    }));

    // Create prescription logic
    const prescription = {
      patientId: patientId,
      prescriptionDate: prescriptionDate,
      expiryDate: expiryDate,
      instructions: instructions,
      drugUsages: drugUsages,
    };
    console.log(prescription);

    const prescriptionService = new PrescriptionService();
    prescriptionService
      .createPrescription(token, prescription)
      .then((response) => {
            console.log("response", response);
            handleClose();
        toastMessage("success", response.data);
      })
      .catch((error) => {
            console.log("error", error.response.data.message);
        toastMessage("error", error.response.data.message);
      });
  };



  const handleAddDrugUsage = (drugId, dosage, frequency) => {
    const selectedDrug = drugList.find((drug) => drug.id == drugId);
    const selectedDrugUsage = {
      id: selectedDrugUsages.length + 1,
      name: selectedDrug.name,
      drugId: drugId,
      dosage: dosage,
      frequency: frequency,
    };

    if (selectedDrugUsage) {
      setSelectedDrugUsages((prevDrugUsages) => [
        ...prevDrugUsages,
        selectedDrugUsage,
      ]);
    }
  };

  const handleRemoveDrugUsage = (drugId) => {
    setSelectedDrugUsages((prevDrugUsages) => {
      if (Array.isArray(prevDrugUsages)) {
        return prevDrugUsages.filter(
          (drugUsage) => drugUsage.drugId !== drugId
        );
      }
      return [];
    });
  };

  return (
    <Modal visible={modalVisible} onRequestClose={() => handleClose()}  transparent={true}>
      <View className="flex-1 rounded-xl justify-center items-center gap-y-2 m-2 bg-white my-20 mx-auto android:mx-0 ios:mx-0 p-2">
        <Text className="text-lg font-semibold mb-4">Create Prescription</Text>
        <CustomDatePicker
          className="flex-1 ml-10"
          setField={(value) => setPrescriptionDate(value)}
          value={prescriptionDate}
          fieldName="Prescription Date"
        />
        {Platform.OS !== "web" && <View />}
        <CustomDatePicker
          className="flex-1 ml-10"
          setField={(value) => setExpiryDate(value)}
          value={expiryDate}
          fieldName="Expiry Date          "
        />

        <TextInput
          value={instructions}
          onChangeText={setInstructions}
          className="border border-gray-300 rounded-lg p-2 mb-2 text-lg android:w-full ios:w-full"
          style={{ minHeight: 100, textAlignVertical: "top", minWidth: 325 }}
          multiline
          numberOfLines={4}
          placeholderTextColor="#9ca3af"
          placeholder="Enter instructions"
        />
        <Text className="text-gray-600 mb-2">Select Drug Usages:</Text>
        <View className="flex-row flex-4 gap-x-1">
          <View className="flex-1 border border-gray-300 rounded-lg text-lg justify-center">
            <RNPickerSelect
              selectedValue={drugId}
              onValueChange={(drugId) => setDrugId(drugId)}
              placeholder={{ label: "Select Drug", value: "" }}
              items={drugList.map((drug) => ({
                key: drug.id,
                label: drug.name,
                value: drug.name,
              }))}
            />
          </View>
          <TextInput
            placeholder="Dosage"
            keyboardType="numeric"
            className="flex-2 border border-gray-300 rounded-lg p-2 text-lg"
            onChangeText={setDosage}
          />
          <TextInput
            placeholder="Frequency"
            keyboardType="numeric"
            className="flex-2 border border-gray-300 rounded-lg p-2 text-lg"
            onChangeText={setFrequency}
          />
          <Pressable
            onPress={() => handleAddDrugUsage(drugId, dosage, frequency)}
            className="bg-primary p-2 rounded-lg m-2 justify-center items-center"
          >
            <Text className="text-white">Add</Text>
          </Pressable>
        </View>

        {selectedDrugUsages.length != 0 &&
          (Platform.OS === "web" ? (
            <ScrollView className="flex-1 w-full">
              {getFlatList(selectedDrugUsages, handleRemoveDrugUsage)}
            </ScrollView>
          ) : (
            getFlatList(selectedDrugUsages, handleRemoveDrugUsage)
          ))}

        {selectedDrugUsages.length != 0 && (
          <Pressable
            onPress={() =>
              handleCreatePrescription(patientId, selectedDrugUsages, session)
            }
            className="bg-primary p-2 rounded-lg mt-4"
          >
            <Text className="text-white">Create Prescription</Text>
          </Pressable>
        )}

        <Pressable
          onPress={() => handleClose()}
          className="bg-gray-300 p-2 rounded-lg mt-2"
        >
          <Text>Cancel</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const getFlatList = (selectedDrugUsages, handleRemoveDrugUsage) => {
  return (
    <FlatList
      data={selectedDrugUsages}
      className="border border-gray-300 rounded-lg p-2 mt-2 w-full android:w-full ios:w-full"
      renderItem={({ item }) => (
        <View className="flex-row p-2 justify-between text-center items-center w-full androd:w-full ios:w-full">
          <Text className="text-gray-600 flex-1 text-start">{item.name}</Text>
          <Text className="text-gray-600 flex-1 text-center">
            {item.dosage}
          </Text>
          <Text className="text-gray-600 flex-1 text-center">
            {item.frequency}
          </Text>
          <Pressable
            onPress={() => handleRemoveDrugUsage(item.drugId)}
            className="bg-gray-300 p-2 rounded-lg flex-1 text-center"
          >
            <Text>Remove</Text>
          </Pressable>
        </View>
      )}
      keyExtractor={(item) => item.id}
    />
  );
};
