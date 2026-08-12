import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [userToken, setUserToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setUserToken(localStorage.getItem('token'));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ userToken, setUserToken }}>
      {children}
    </AuthContext.Provider>
  );
}