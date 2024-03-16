import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";
import { Redirect } from "expo-router";


export default function loggedUserRedirection(isLoading, session) {
  if (isLoading) {
    return true;
  }
  if (session) {
    const decoded = jwtDecode(session);
    return (
      <Redirect href={"/" + decoded.role.replace("_", "-").toLowerCase()} />
    );
  }
  return false;
}
