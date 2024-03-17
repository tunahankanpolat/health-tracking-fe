import "../index.css";
import { Slot } from "expo-router";
import { SessionProvider } from "../ctx";
import { RootSiblingParent } from "react-native-root-siblings";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Platform } from "react-native";
export default function Layout() {
  return (
    <RootSiblingParent>
      {Platform.OS == "web" && (
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      )}
      <SessionProvider>
        <Slot />
      </SessionProvider>
    </RootSiblingParent>
  );
}
