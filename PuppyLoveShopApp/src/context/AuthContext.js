import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginClient, registerClient } from "../api/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("puppy_client");
        if (stored) setClient(JSON.parse(stored));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email, password) => {
    const res = await loginClient({ email, password });
    const { token, client: clientData } = res.data;
    await AsyncStorage.setItem("puppy_token", token);
    await AsyncStorage.setItem("puppy_client", JSON.stringify(clientData));
    setClient(clientData);
    return clientData;
  };

  const register = async (data) => {
    const res = await registerClient(data);
    return res.data;
  };

  const logout = async () => {
    await AsyncStorage.removeItem("puppy_token");
    await AsyncStorage.removeItem("puppy_client");
    setClient(null);
  };

  return (
    <AuthContext.Provider value={{ client, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
