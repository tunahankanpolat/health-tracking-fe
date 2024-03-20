import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { View, TextInput, Text, Pressable } from 'react-native';
import Toast from 'react-native-root-toast';
import { toast } from 'react-toastify';
import toastMessage from '../utils/toastMessage';
import PatientRelativeService from '../services/patient-relativeService'; // PatientRelativeService import edildi.
import { useSession } from '../../ctx';

// Form doğrulama şeması
const PatientRelativeSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  surname: Yup.string().required('Surname is required'),
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
  phoneNumber: Yup.string().required('Phone number is required'),
  emailAddress: Yup.string().email('Invalid email'),
  address: Yup.string(),
  relationship: Yup.string().required('Relationship is required'),
});

const handleCreation = (token, values) => {
  let patientRelativeService = new PatientRelativeService(); // PatientRelativeService nesnesi oluşturuldu.
  console.log(token);
  console.log(values);
  patientRelativeService.createPatient_relative(token, values).then((response) => {
    toastMessage('success', response.data);
  }).catch((error) => {
    console.log(error.response.data);
    toastMessage('error', error.response.data.message.toString());
  });
}

const CreatePatientRelativeForm = () => {
  const { isLoading, session } = useSession();
  if (isLoading) return null;
  return (
    <Formik
      initialValues={{
        name: '',
        surname: '',
        username: '',
        password: '',
        phoneNumber: '',
        emailAddress: '',
        address: '',
        relationship: '',
      }}
      validationSchema={PatientRelativeSchema}
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

export default CreatePatientRelativeForm;
