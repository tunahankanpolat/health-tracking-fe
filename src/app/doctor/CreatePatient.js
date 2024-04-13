import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  View,
  TextInput,
  Text,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";
import toastMessage from "../utils/toastMessage";
import PatientService from "../services/patientService";
import { useSession } from "../../ctx";
import CustomDatePicker from "../utils/CustomDatePicker";

const PatientSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(3, "Name must be between 3 and 20 characters long")
    .max(20, "Name must be between 3 and 20 characters long"),
  surname: Yup.string()
    .required("Surname is required")
    .min(3, "Surname must be between 3 and 20 characters long")
    .max(20, "Surname must be between 3 and 20 characters long"),
  username: Yup.string()
    .required("Username is required")
    .min(3, "Username must be between 3 and 20 characters long")
    .max(20, "Username must be between 3 and 20 characters long"),
  password: Yup.string()

    .required("Password is required")
    .min(8, "Password must be between 8 and 20 characters long")
    .max(20, "Password must be between 8 and 20 characters long"),
  birthDate: Yup.date()
    .required("Birth date is required")
    .max(new Date(), "Birth date must be in the past"),
  gender: Yup.string(),
  height: Yup.number().positive("Height must be positive"),
  weight: Yup.number().positive("Weight must be positive"),
  bloodType: Yup.string(),
  rfidTag: Yup.string(),
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .min(11, "Phone number must be 11 characters long")
    .max(11, "Phone number must be 11 characters long"),
  emailAddress: Yup.string().email("Invalid email"),
  address: Yup.string()
    .required("Address is required")
    .min(3, "Address must be between 3 and 200 characters long")
    .max(200, "Address must be between 3 and 200 characters long"),
});

const handleCreation = (token, values) => {
  let patientService = new PatientService();
  Object.keys(values).forEach(
    (key) => values[key] === "" && delete values[key]
  );
  patientService
    .createPatient(token, values)
    .then((response) => {
      toastMessage("success", response.data);
    })
    .catch((error) => {
      console.log(error.response.data.message);
      toastMessage("error", error.response.data.message);
    });
};

const CreatePatientForm = () => {
  const { isLoading, session } = useSession();
  if (isLoading) return null;

  const setBirthDateField = (setFieldValue, value) => {
    setFieldValue("birthDate", value);
  };
  return (
    <ScrollView>
      <Formik
        children={CustomDatePicker}
        initialValues={{
          name: "",
          surname: "",
          username: "",
          password: "",
          birthDate: "",
          gender: "",
          height: "",
          weight: "",
          bloodType: "",
          rfidTag: "",
          phoneNumber: "",
          emailAddress: "",
          address: "",
        }}
        validationSchema={PatientSchema}
        onSubmit={(values) => handleCreation(session, values)}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
        }) => (
          <View className="p-4 mx-80 android:mx-2 ios:mx-2">
            {Object.keys(values).map((key) => (
              <View key={key} className="mb-4">
                {key === "birthDate" ? (
                  <CustomDatePicker
                    className="flex-1 ml-10"
                    setField={(value) =>
                      setBirthDateField(setFieldValue, value)
                    }
                    value={values[key]}
                    fieldName="Birth Date"
                  />
                ) : (
                  <TextInput
                    onChangeText={handleChange(key)}
                    onBlur={handleBlur(key)}
                    value={values[key]}
                    placeholder={
                      key == "birthDate"
                        ? "Birth Date: dd-mm-yyyy"
                        : key.charAt(0).toUpperCase() + key.slice(1)
                    }
                    className="border border-gray-300 rounded p-2 text-lg"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={key === "password"}
                  />
                )}

                {errors[key] && touched[key] && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors[key]}
                  </Text>
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
    </ScrollView>
  );
};

export default CreatePatientForm;
