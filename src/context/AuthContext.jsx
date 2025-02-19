import { createContext, useContext, useEffect, useState } from "react";
import { getToken, setToken, removeToken, getUserInfoFromToken } from "../utils/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());
  const [user, setUser] = useState(getUserInfoFromToken()); // 닉네임 + 프로필 이미지 포함

  useEffect(() => {
    setIsAuthenticated(!!getToken());
    setUser(getUserInfoFromToken());
  }, []);

  const login = (token) => {
    setToken(token);
    setIsAuthenticated(true);
    setUser(getUserInfoFromToken());
  };

  const logout = () => {
    removeToken();
    setIsAuthenticated(false);
    setUser({ nickname: null, imageUrl: null });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);