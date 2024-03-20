import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { View, TextInput, Text, Pressable } from 'react-native';
import Toast from 'react-native-root-toast';
import { toast } from 'react-toastify';
import toastMessage from '../utils/toastMessage';
import DoctorService from '../services/doctorService';
import { useSession } from '../../ctx';
// Form doğrulama şeması
const DoctorSchema = Yup.object().shape({
  name: Yup.string().required('Name is required').min(3, 'Name must be between 3 and 20 characters long').max(20, 'Name must be between 3 and 20 characters long'),
  surname: Yup.string().required('Surname is required').min(3, 'Surname must be between 3 and 20 characters long').max(20, 'Surname must be between 3 and 20 characters long'),
  username: Yup.string().required('Username is required').min(3, 'Username must be between 3 and 20 characters long').max(20, 'Username must be between 3 and 20 characters long'),
  password: Yup.string().required('Password is required').min(3, 'Password must be between 3 and 20 characters long').max(20, 'Password must be between 3 and 20 characters long'),
  specialization: Yup.string().required('Specialization is required').min(3, 'Specialization must be between 3 and 20 characters long').max(20, 'Specialization must be between 3 and 20 characters long'),
  phoneNumber: Yup.string().required('Phone number is required').min(11, 'Phone number must be between 11 and 11 characters long').max(11, 'Phone number must be between 11 and 11 characters long'),
  emailAddress: Yup.string().email('Invalid email'),
  address: Yup.string(),
});

const handleCreation = (token, values) => {
  let doctorService = new DoctorService();
  Object.keys(values).forEach(key => values[key] === "" && delete values[key]);
  doctorService.createDoctor(token, values).then((response) => {
    toastMessage('success', response.data);
  }
  ).catch((error) => {
    console.log(error.response.data.message);
    toastMessage('error', error.response.data.message);
  }
  );
}

const CreateDoctorForm = () => {
  const { isLoading, session } = useSession();
  if (isLoading) return null;
  return (
    <Formik
      initialValues={{
        name: '',
        surname: '',
        username: '',
        password: '',
        specialization: '',
        phoneNumber: '',
        emailAddress: '',
        address: '',
      }}
      validationSchema={DoctorSchema}
      onSubmit={(values) => handleCreation(session, values)}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View className="p-4 mx-80 android:mx-2">
          {Object.keys(values).map((key) => (
            <View key={key} className="mb-4">
              <TextInput
                onChangeText={handleChange(key)}
                onBlur={handleBlur(key)}
                value={values[key]}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                className="border border-gray-300 rounded p-2 text-lg"
                placeholderTextColor="#9ca3af"
              />
              {errors[key] && touched[key] && (
                <Text className="text-red-500 text-xs mt-1">{errors[key]}</Text>
              )}
            </View>
          ))}
          <Pressable
            onPress={handleSubmit}
            className="bg-primary p-3 rounded-lg items-center"
          >
            <Text className="text-white text-lg">Submit</Text>
          </Pressable>
        </View>
      )}
    </Formik>
  );
};

export default CreateDoctorForm;
