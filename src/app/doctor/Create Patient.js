import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  View,
  TextInput,
  Text,
  Pressable,
  ScrollView,
  VirtualizedList,
} from "react-native";
import toastMessage from "../utils/toastMessage";
import PatientService from "../services/patientService";
import { useSession } from "../../ctx";
import CustomDatePicker from "../utils/CustomDatePicker";
import RNPickerSelect from "react-native-picker-select";

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
  gender: Yup.string()
    .required("Gender is required")
    .matches(/^[a-zA-Z]+$/, "Gender must contain only letters"), //Eklendi
  height: Yup.number().positive("Height must be positive"),
  weight: Yup.number().positive("Weight must be positive"),
  bloodType: Yup.string().required("Blood type is required"),
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]+$/, "Phone number must contain only digits") //Eklendi
    .min(11, "Phone number must be 11 characters long")
    .max(11, "Phone number must be 11 characters long"),
  emailAddress: Yup.string().email("Invalid email"),
  address: Yup.string()
    .required("Address is required")
    .min(3, "Address must be between 3 and 200 characters long")
    .max(200, "Address must be between 3 and 200 characters long"),
});

const handleCreation = (token, values, resetForm) => {
  let patientService = new PatientService();

  console.log(values);
  console.log(token);
  patientService
    .createPatient(token, values)
    .then((response) => {
      toastMessage("success", response.data);
      resetForm();
      // Yeni doktor eklendikten sonra sayfanın yeniden yüklenmesi için bir işlem yapılabilir.
      //window.location.reload(); // Sayfanın yeniden yüklenmesi
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
          phoneNumber: "",
          emailAddress: "",
          address: "",
        }}
        validationSchema={PatientSchema}
        onSubmit={(values, { resetForm }) => handleCreation(session, values, resetForm)}
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
                ) : key === "gender" ? (
                  <View className="flex-1 border border-gray-300 rounded-lg text-lg justify-center p-2">
                    <RNPickerSelect
                      style={{
                        textAlign: "center",
                        inputWeb: {
                          borderRadius: 5,
                          backgroundColor: "#f0f0f0",
                          color: "black",
                        },
                      }}
                      onValueChange={(value) => setFieldValue(key, value)}
                      placeholder={{ label: "Select Gender", value: "" }}
                      items={[
                        { label: "Male", value: "Male" },
                        { label: "Female", value: "Female" },
                        { label: "Other", value: "Other" },
                      ]}
                      value={values[key]}
                    />
                  </View>
                ) : key === "bloodType" ? (
                  <View className="flex flex-1 border border-gray-300 rounded-lg text-lg justify-center p-2">
                    <RNPickerSelect
                      style={{
                        textAlign: "center",
                        inputWeb: {
                          borderRadius: 5,
                          backgroundColor: "#f0f0f0",
                          color: "black",
                        },
                      }}
                      onValueChange={(value) => setFieldValue(key, value)}
                      placeholder={{ label: "Select Blood Type", value: "" }}
                      items={[
                        { label: "A Rh(+)", value: "A Rh(+)" },
                        { label: "A Rh(-)", value: "A Rh(-)" },
                        { label: "B Rh(+)", value: "B Rh(+)" },
                        { label: "B Rh(-)", value: "B Rh(-)" },
                        { label: "AB Rh(+)", value: "AB Rh(+)" },
                        { label: "AB Rh(-)", value: "AB Rh(-)" },
                        { label: "0 Rh(+)", value: "0 Rh(+)" },
                        { label: "0 Rh(-)", value: "0 Rh(-)" },
                      ]}
                      value={values[key]}
                    />
                  </View>
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
