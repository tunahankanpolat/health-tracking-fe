import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, Pressable } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import PatientService from "../services/patientService";
import AwsLambdaService from "../services/awsLambdaService";
import toastMessage from "../utils/toastMessage";
import { useSession } from "../../ctx";
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";

const MedicineGrid = ({
  grid,
  drugList,
  removeDrug,
  selectedDrugs,
  setSelectedDrugs,
  selectedTimes,
  setSelectedTimes,
}) => (
  <View className="flex-1 flex-row flex-wrap content-start">
    {grid.map((item, index) => (
      <View
        className="w-1/3 h-30 px-2 py-1 android:w-full ios:w-full"
        key={index}
      >
        <View
          key={index}
          className="flex flex-1 flex-row w-full h-full justify-between  rounded border border-gray-300 p-2 gap-2"
        >
          <View className="flex flex-1 justify-center">
            <RNPickerSelect
              style={{
                textAlign: "center",
                inputWeb: {
                  borderRadius: 5,
                  backgroundColor: "#f0f0f0",
                  color: "black",
                },
              }}
              selectedValue={selectedDrugs[index]}
              onValueChange={(drugName) => {
                const newSelectedDrugs = [...selectedDrugs];
                newSelectedDrugs[index] = drugName;
                setSelectedDrugs(newSelectedDrugs);
              }}
              placeholder={{ label: "Select Drug", value: "" }}
              items={drugList.map((drug) => ({
                key: drug.drugId,
                label: drug.drugName,
                value: drug.drugName,
              }))}
            />
          </View>
          <View className="flex flex-1 flex-col justify-center gap-2">
            {drugList.length > 0 &&
              Array(drugList[index].frequency)
                .fill(null)
                .map((_, i) => (
                  <TimeInput
                    key={i}
                    index={index}
                    selectedTimes={selectedTimes}
                    setSelectedTimes={setSelectedTimes}
                    id={i}
                  />
                ))}
          </View>
        </View>
      </View>
    ))}
  </View>
);
const TimeInput = ({ id, index, selectedTimes, setSelectedTimes }) => {
  const handleTimeChange = (text) => {
    // Remove non-numeric characters and limit to 4 characters
    const formattedTime = text.replace(/[^0-9]/g, "").slice(0, 4);

    // Validate and format time input to HH:MM
    let displayTime = formattedTime;
    if (formattedTime.length > 2) {
      const hours = parseInt(formattedTime.slice(0, 2), 10);
      const minutes = parseInt(formattedTime.slice(2), 10);

      // Ensure valid hours and minutes
      const validHours =
        isNaN(hours) || hours < 0 || hours > 23
          ? "00"
          : formattedTime.slice(0, 2);
      const validMinutes =
        isNaN(minutes) || minutes < 0 || minutes > 59
          ? "00"
          : formattedTime.slice(2);

      displayTime = `${validHours}:${validMinutes}`;
    }

    let newSelectedTimes = [...selectedTimes];
    if (!newSelectedTimes[index]) {
      newSelectedTimes[index] = []; // Ensure this index is initialized
    }
    newSelectedTimes[index][id] = displayTime;
    setSelectedTimes(newSelectedTimes);
  };

  return (
    <TextInput
      value={
        selectedTimes[index] && selectedTimes[index][id]
          ? selectedTimes[index][id]
          : ""
      }
      onChangeText={handleTimeChange}
      placeholder="00:00"
      keyboardType="numeric"
      className="border border-gray-300 rounded p-2 pt-1 text-lg"
      maxLength={5} // Limit input length to 5 characters (HH:MM)
    />
  );
};
const formatDrugData = (selectedDrugs, selectedTimes) => {
  const drugData = {};

  selectedDrugs.forEach((drugName, index) => {
    if (drugName) {
      // Check if a drug has been selected
      const timeEntries = selectedTimes[index].map((time) => time);
      const drugEntry = [{ [drugName]: timeEntries }];

      drugData[`${index}`] = drugEntry; // Unique key for each drug entry
    }
  });

  return drugData; // Format for pretty printing
};

// Example usage inside a function or component method:
const handleSubmit = () => {
  const formattedData = formatDrugData(selectedDrugs, selectedTimes);
  console.log("Formatted Drug Data:", formattedData);

  // You can then send 'formattedData' to your backend or use it as needed
};

const frequencyArray = (drugList, index) => {
  if (!drugList || drugList.length === 0) return [];
  console.log("Drug List:", drugList);
  console.log("Index:", index);
  return Array(drugList[index].frequency).fill(null);
};

const MedicinePage = () => {
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  const [grid, setGrid] = useState(Array(6).fill(null));
  const [drugList, setDrugList] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([[]]);
  const { isLoading, session } = useSession();
  if (isLoading) return null;
  console.log("Selected Drugs:", selectedDrugs);
  console.log(
    "Formatted Drug Data:",
    formatDrugData(selectedDrugs, selectedTimes)
  );
  useEffect(() => {
    const userId = getUserIdFromSession();
    const patientService = new PatientService();
    patientService
      .getDrugUsages(session, userId)
      .then((response) => {
        console.log("Drug List:", response.data);
        setDrugList(response.data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }, []);

  useEffect(() => {
    const initialTimes = Array(6)
      .fill()
      .map((_, index) => frequencyArray(drugList, index)); // Use underscore (_) to indicate that the parameter is unused
    setSelectedTimes(initialTimes);
  }, [drugList]);

  const getUserIdFromSession = () => {
    let userId;
    try {
      decoded = jwtDecode(session);
      userId = decoded.userId;
      console.log("User ID:", userId);
    } catch (e) {
      console.log(e);
    }
    return userId;
  };

  const removeDrug = (drugId) => {
    // const drugList = drugList.filter((drug) => drug.drugId !== drugId);
    // setDrugList(drugList);
  };

  const handleSubmit = () => {
    const awsLambdaService = new AwsLambdaService();
    console.log("handleSubmit:");
    awsLambdaService
      .setDrugSchedule(
        getUserIdFromSession(),
        formatDrugData(selectedDrugs, selectedTimes)
      )
      .then((response) => {
        toastMessage("success", "Medicine schedule updated successfully!");
        console.log("Response:", response);
      })
      .catch((error) => {
        toastMessage("error", "Failed to update medicine schedule");
        console.log("Error:", error);
      });
  };

  return (
    <ScrollView className="flex-1">
      <MedicineGrid
        grid={grid}
        drugList={drugList}
        removeDrug={removeDrug}
        selectedDrugs={selectedDrugs}
        setSelectedDrugs={setSelectedDrugs}
        selectedTimes={selectedTimes}
        setSelectedTimes={setSelectedTimes}
      />
      <Pressable
        onPress={handleSubmit}
        className="bg-blue-500 p-4 rounded-lg flex-row items-center justify-center mt-4"
      >
        <Text className="text-white font-bold">Submit</Text>
      </Pressable>
    </ScrollView>
  );
};

export default MedicinePage;
