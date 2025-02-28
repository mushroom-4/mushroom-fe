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
    // Base64 디코딩
    const decodedStr = atob(token.split(".")[1]);
    // UTF-8 디코딩
    const bytes = new Uint8Array(decodedStr.split('').map(char => char.charCodeAt(0)));
    const decodedText = new TextDecoder('utf-8').decode(bytes);
    
    const payload = JSON.parse(decodedText);
    
    return {
      nickname: payload.nickname || null,
      imageUrl: payload.imageUrl || null,
      email: payload.email || null,
      userRole: payload.userRole || null,
    };
  } catch (error) {
    return { nickname: null, imageUrl: null };
  }
};