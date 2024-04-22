import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { View, TextInput, Text, Pressable } from "react-native";
import toastMessage from "../utils/toastMessage";
import DrugService from "../services/drugService";
import { useSession } from "../../ctx";

// Drug form validation schema
const DrugSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is mandatory")
    .min(3, "Name must be between 3 and 20 characters long")
    .max(20, "Name must be between 3 and 20 characters long"),
  instructions: Yup.string()
    .required("Instructions are mandatory")
    .min(3, "Instructions must be between 3 and 10000 characters long")
    .max(10000, "Instructions must be between 3 and 100 characters long"),
  description: Yup.string()
    .required("Description is mandatory")
    .min(3, "Description must be between 3 and 10000 characters long")
    .max(10000, "Description must be between 3 and 100 characters long"),
});

const handleCreation = (token, values) => {
  let drugService = new DrugService();
  Object.keys(values).forEach(
    (key) => values[key] === "" && delete values[key]
  );
  drugService
    .createDrug(token, values)
    .then((response) => {
      toastMessage("success", response.data);
    })
    .catch((error) => {
      console.log(error.response.data.message);
      toastMessage("error", error.response.data.message);
    });
};

const CreateDrugForm = () => {
  const { isLoading, session } = useSession();
  if (isLoading) return null;
  return (
    <Formik
      initialValues={{
        name: "",
        instructions: "",
        description: "",
      }}
      validationSchema={DrugSchema}
      onSubmit={(values) => handleCreation(session.token, values)} // Assuming session contains a token property
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <View className="p-4 mx-80 android:mx-2 ios:mx-2">
          {Object.keys(values).map((key) => (
            <View key={key} className="mb-4">
              <TextInput
                onChangeText={handleChange(key)}
                onBlur={handleBlur(key)}
                value={values[key]}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                style={{
                  minHeight: key === "name" ? 40 : 100,
                  textAlignVertical: "top",
                }}
                className="border border-gray-300 rounded p-2 text-lg"
                placeholderTextColor="#9ca3af"
                multiline={key !== "name"}
                numberOfLines={key === "name" ? 1 : 4}
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

export default CreateDrugForm;
