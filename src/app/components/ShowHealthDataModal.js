import { View, Modal, Text, Pressable } from "react-native";
import CustomLineChart from "../utils/CustomLineChart";

export default function ShowPrescriptionModal(props) {
  const { modalVisible, setModalVisible, healthData } = props;

  const handleClose = () => {
    setModalVisible(false);
  };

  return (
    <Modal
      visible={modalVisible}
      onRequestClose={handleClose}
      transparent={true}
      className="flex-1 justify-center items-center"
    >
      <View className="flex-1 justify-center items-center bg-primary rounded-lg p-4 m-2 py-20 my-10 android:mx-0 android:px-0 ios:mx-0 ios:mx-0">
        <View className="flex-1 justify-center items-center bg-primary w-full h-full">
          <Pressable className="self-end" onPress={() => handleClose()}>
            <View className="border-b-2 border-gray-300 ">
              <Text className="border-2 p-1 mb-2 text-white rounded-xl text-lg text-center border-white">
                X
              </Text>
            </View>
          </Pressable>

          {healthData.length != 0 && (
            <CustomLineChart healthData={healthData} thema="primary" />
          )}
        </View>
      </View>
    </Modal>
  );
}
