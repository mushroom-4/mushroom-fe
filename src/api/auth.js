const API_BASE_URL = "https://mutt-iroom.store/api/v1/auth";

export const register = async (nickname, email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, email, password, userRole: "USER" }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: "네트워크 오류 발생" };
  }
};

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: "네트워크 오류 발생" };
  }
};