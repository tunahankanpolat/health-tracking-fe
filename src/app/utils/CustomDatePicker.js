import React, { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { createElement } from "react";
import "react-datepicker/dist/react-datepicker.css";
const MyWebDatePicker = (props) => {
  const { setField } = props;
  return createElement("input", {
    type: "date",
    onChange: (event) => {
      setField(event.target.value);
    },
    className:
      "border border-gray-300 rounded p-2 pt-[10px] text-lg text-[#9ca3af] flex-1 w-full h-full bg-background",
  });
};
export default function CustomDatePicker(props) {
  const { setField, value, fieldName } = props;
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  if (Platform.OS === "web") {
    return (
      <View className="flex-row flex-2">
        <Text className="border border-gray-300 rounded p-2 pt-[10px] text-lg text-[#9ca3af] flex-1 w-full ios:border-gray-300">
          {fieldName}
        </Text>
        <MyWebDatePicker
          setField={setField}
          className="border border-gray-300 rounded p-2 pt-[10px] text-lg text-[#9ca3af] flex-1 w-full h-full"
        />
      </View>
    );
  } else {
    return (
      <View className="flex-row flex-2">
        <Text className="border border-gray-300 rounded p-2 pt-[10px] text-lg text-[#9ca3af] flex-1 ios:border-gray-300">
          {value ? `${new Date(value).toLocaleDateString("tr-TR")}` : fieldName }
        </Text>
        <Pressable
          onPress={() => showDatePicker()}
          className="bg-primary p-3 rounded-lg items-center ml-2 flex-1"
        >
          <Text className="text-white text-lg flex-1">Select {fieldName}</Text>
        </Pressable>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={(date) => {
            hideDatePicker();
            setField(date);
          }}
          onCancel={() => hideDatePicker()}
        />
      </View>
    );
  }
}
