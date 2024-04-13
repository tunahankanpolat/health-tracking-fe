import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import DrugService from "../services/drugService";

// A component to display each drug
const DrugItem = ({ drug }) => (
  <View className="border border-gray-300 rounded-lg p-4 bg-card mb-4">
    <Text className="text-2xl font-bold">{drug.name}</Text>
    <View style={{flex: 1}}>
      <View className="flex-row border-b border-gray-300"/>
</View>

    <Text className="text-xl font-medium my-4">Description: </Text>
    <Text className="text-sm text-gray-600">{drug.description}</Text>
    <Text className="text-xl font-medium my-4">Instructions: </Text>
    <Text className="text-sm text-gray-600">{drug.instructions}</Text>
  </View>
);

// The main component to display the drug list and pagination
const DrugList = () => {
  const [drugs, setDrugs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const drugsPerPage = 5; // Adjust this value as needed

  useEffect(() => {
    const drugService = new DrugService();
    drugService
      .getAllDrugs()
      .then((response) => {
        setDrugs(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Calculate the drugs to display on the current page
  const indexOfLastDrug = currentPage * drugsPerPage;
  const indexOfFirstDrug = indexOfLastDrug - drugsPerPage;
  const currentDrugs = drugs.slice(indexOfFirstDrug, indexOfLastDrug);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <FlatList
      data={currentDrugs}
      className="px-80 py-2 android:p-2 ios:p-2 rounded-lg"
      renderItem={({ item }) => <DrugItem drug={item} />}
      keyExtractor={(item) => item.id}
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
            disabled={currentPage * drugsPerPage >= drugs.length}
          >
            <Text className="text-white text-lg">Next</Text>
          </Pressable>
        </View>
      )}
    />
  );
};

export default DrugList;
