import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, FlatList } from 'react-native';
import { useSession } from '../../ctx';
import DoctorService from '../services/doctorService';

const DoctorItem = ({ doctor }) => {
      return (
        <View className="border border-gray-300 rounded-lg p-4 mb-4 bg-card">
          <Text className="text-lg font-semibold">{doctor.name} {doctor.surname}</Text>
          <Text className="text-gray-600">{doctor.username}</Text>
          <Text className="text-gray-600">{doctor.specialization}</Text>
          <Text className="text-gray-600">{doctor.phoneNumber}</Text>
          {doctor.emailAddress && <Text className="text-gray-600">{doctor.emailAddress}</Text>}
          {doctor.address && <Text className="text-gray-600">{doctor.address}</Text>}
        </View>
      );
    };
    

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 10;

  useEffect(() => {
      const doctorService = new DoctorService();
      doctorService
        .getAllDoctors()
        .then((response) => {
          setDoctors(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }, []);

  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
      <FlatList
        data={currentDoctors}
        className="px-80 py-2 android:p-2 rounded-lg"
        renderItem={({ item }) => <DoctorItem doctor={item} />}
        keyExtractor={item => item.id.toString()}
        ListFooterComponent={() => (
          <View className="flex-row justify-center mb-4">
            <Pressable onPress={() => paginate(currentPage - 1)}
              className="bg-primary p-3 rounded-lg items-center m-2"
              disabled={currentPage === 1}>
              <Text className="text-white text-lg">Previous</Text>
            </Pressable>
            <Pressable onPress={() => paginate(currentPage + 1)}
              className="bg-primary p-3 rounded-lg items-center m-2"
              disabled={currentPage === Math.ceil(doctors.length / doctorsPerPage)}>
              <Text className="text-white text-lg">Next</Text>
            </Pressable>
          </View>
        )}
      />
    );
};

export default DoctorsList;
