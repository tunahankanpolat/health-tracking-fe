import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useSession } from "../../ctx";

export default function CustomDrawerContent(props: any) {
  const { signOut } = useSession();

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label={"Logout"} onPress={() => signOut()} />
    </DrawerContentScrollView>
  );
}
