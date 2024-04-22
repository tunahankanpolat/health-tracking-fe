import React from "react";
import { useStorageState } from "./useStorageState";

const AuthContext = React.createContext<{
  signIn: (token) => void;
  signOut: () => void;
  setIsAuthorized: (authorized: boolean) => void;
  isAuthorized: boolean;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  setIsAuthorized: () => null,
  isAuthorized: false,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }
  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");
  const [[, authorized], setAuthorized] = useStorageState("authorized");
  return (
    <AuthContext.Provider
      value={{
        signIn: (token) => {
          // Perform sign-in logic here
          setSession(token);
        },
        signOut: () => {
          setSession(null);
        },
        setIsAuthorized: (authorized: boolean) => {
          setAuthorized(authorized ? "authorized" : null);
        },
        isAuthorized: !!authorized,
        session,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
