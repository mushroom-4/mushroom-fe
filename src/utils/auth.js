export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const getUserInfoFromToken = () => {
  const token = getToken();
  if (!token) return { nickname: null, imageUrl: null };

  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // JWT Payload 디코딩
    return {
      nickname: payload.nickname || null,
      imageUrl: payload.imageUrl || null, // 프로필 이미지 URL 추가
    };
  } catch (error) {
    return { nickname: null, imageUrl: null };
  }
};