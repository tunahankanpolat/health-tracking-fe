import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable, FlatList } from "react-native";
import { useSession } from "../../ctx";
import PatientService from "../services/patientService";

const PatientItem = ({ patient }) => {
  const handleShowDrugUsage = () => {
    // Delete patient logic
  };

  const handleShowPrescription = () => {
    // Show prescription logic
  };

  const handleShowHealthData = () => {
    // Show health data logic
  };

  return (
    <View className="border border-gray-300 rounded-lg p-4 mb-4 bg-card">
      <Text className="text-lg font-semibold">
        {patient.name} {patient.surname}
      </Text>
      <Text className="text-gray-600">{patient.phoneNumber}</Text>
      {patient.emailAddress && (
        <Text className="text-gray-600">{patient.emailAddress}</Text>
      )}
      {patient.address && (
        <Text className="text-gray-600">{patient.address}</Text>
      )}
      {patient.birthDate && (
        <Text className="text-gray-600">
          Birth Date: {new Date(patient.birthDate).toLocaleDateString("tr-TR")}
        </Text>
      )}
      {patient.gender && (
        <Text className="text-gray-600">Gender: {patient.gender}</Text>
      )}
      {patient.height && (
        <Text className="text-gray-600">Height: {patient.height}</Text>
      )}
      {patient.weight && (
        <Text className="text-gray-600">Weight: {patient.weight}</Text>
      )}
      {patient.bloodType && (
        <Text className="text-gray-600">Blood Type: {patient.bloodType}</Text>
      )}
      {patient.rfidTag && (
        <Text className="text-gray-600">RFID Tag: {patient.rfidTag}</Text>
      )}

      <View className="absolute top-0 right-0 mt-2 mr-2">
        <Pressable
          onPress={handleShowPrescription}
          className="bg-primary p-2 rounded-lg m-1"
        >
          <Text className="text-white">Show Prescriptions</Text>
        </Pressable>
        <Pressable
          onPress={handleShowDrugUsage}
          className="bg-primary p-2 rounded-lg m-1"
        >
          <Text className="text-white">Show Drug Usage</Text>
        </Pressable>
        <Pressable
          onPress={handleShowHealthData}
          className="bg-primary p-2 rounded-lg m-1"
        >
          <Text className="text-white">Show Health Data</Text>
        </Pressable>
      </View>
    </View>
  );
};

const PatientsList = () => {
  const { isLoading, session } = useSession();
  if (isLoading) return null;
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 10;

  useEffect(() => {
    const patientService = new PatientService();
    patientService
      .getAllPatients(session)
      .then((response) => {
        console.log(response.data);
        setPatients(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = patients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <FlatList
      data={currentPatients}
      className="px-80 py-2 android:p-2 ios:p-2 rounded-lg"
      renderItem={({ item }) => <PatientItem patient={item} />}
      keyExtractor={(item) => item.id.toString()}
      ListFooterComponent={() => (
        <View className="flex-row justify-center mb-4">
          <Pressable
            onPress={() => paginate(currentPage - 1)}
            className="bg-primary p-3 rounded-lg items-center m-2"
            disabled={currentPage === 1}
          >
            <Text className="text-white text-lg">Previous</Text>
          </Pressable>
          <Pressable
            onPress={() => paginate(currentPage + 1)}
            className="bg-primary p-3 rounded-lg items-center m-2"
            disabled={
              currentPage === Math.ceil(patients.length / patientsPerPage)
            }
          >
            <Text className="text-white text-lg">Next</Text>
          </Pressable>
        </View>
      )}
    />
  );
};

export default PatientsList;
