import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginClient, registerClient, logout as logoutRequest } from "../api/api";

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

  // El backend responde { message, id, fullName } y deja la sesión en una cookie httpOnly.
  // No hay token que guardar: axios reenvía la cookie automáticamente en cada request (withCredentials).
  const login = async (email, password) => {
    const res = await loginClient({ email, password });
    const clientData = { id: res.data.id, fullName: res.data.fullName, email };
    await AsyncStorage.setItem("puppy_client", JSON.stringify(clientData));
    setClient(clientData);
    return clientData;
  };

  // Campos reales del backend: fullName, email, password, phoneNumber
  const register = async ({ fullName, email, password, phoneNumber }) => {
    const res = await registerClient({ fullName, email, password, phoneNumber });
    return res.data;
  };

  const logout = async () => {
    await logoutRequest().catch(() => {});
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
