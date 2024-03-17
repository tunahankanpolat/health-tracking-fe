import { Platform } from "react-native";
import Toast from 'react-native-root-toast';
import { toast } from 'react-toastify';

export default function toastMessage(type, message) {
      if (Platform.OS === "web") {
            switch (type) {
            case "success":
                  toast.success(message);
                  break;
            case "error":
                  toast.error(message);
                  break;
            case "info":
                  toast.info(message);
                  break;
            case "warning":
                  toast.warning(message);
                  break;
            default:
                  toast(message);
            }
            } else {
            switch (type) {
            case "success":
                  Toast.show(message, {
                        duration: Toast.durations.SHORT,
                        position: Toast.positions.BOTTOM,
                        shadow: true,
                        animation: true,
                        hideOnPress: true,
                        delay: 0,
                  });
                  break;
            case "error":
                  Toast.show(message, {
                        duration: Toast.durations.SHORT,
                        position: Toast.positions.BOTTOM,
                        shadow: true,
                        animation: true,
                        hideOnPress: true,
                        delay: 0,
                  });
                  break;
            case "info":
                  Toast.show(message, {
                        duration: Toast.durations.SHORT,
                        position: Toast.positions.BOTTOM,
                        shadow: true,
                        animation: true,
                        hideOnPress: true,
                        delay: 0,
                  });
                  break;
            case "warning":
                  Toast.show(message, {
                        duration: Toast.durations.SHORT,
                        position: Toast.positions.BOTTOM,
                        shadow: true,
                        animation: true,
                        hideOnPress: true,
                        delay: 0,
                  });
                  break;
            default:
                  Toast.show(message, {
                        duration: Toast.durations.SHORT,
                        position: Toast.positions.BOTTOM,
                        shadow: true,
                        animation: true,
                        hideOnPress: true,
                        delay: 0,
                  });
            }
      }
      
  return (
    <div>toastMessage</div>
  )
}
