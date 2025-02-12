import { createContext, useContext, useEffect, useState } from "react";
import { getToken, setToken, removeToken, getNicknameFromToken } from "../utils/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());
  const [nickname, setNickname] = useState(getNicknameFromToken());

  useEffect(() => {
    setIsAuthenticated(!!getToken());
    setNickname(getNicknameFromToken());
  }, []);

  const login = (token) => {
    setToken(token);
    setIsAuthenticated(true);
    setNickname(getNicknameFromToken());
  };

  const logout = () => {
    removeToken();
    setIsAuthenticated(false);
    setNickname(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, nickname, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);