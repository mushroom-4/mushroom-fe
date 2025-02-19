import { getToken, removeToken } from "../utils/auth";
import {API_BASE_URL} from "../config";

/** ✅ 공통 요청 함수 */
export const request = async (url, method = "GET", body = null, isAuth = true, isFormData = false) => {
  const headers = isFormData ? {} : { "Content-Type": "application/json" };

  if (isAuth) {
    const token = getToken();
    if (!token) {
      return { success: false, message: "로그인이 필요합니다." };
    }
    headers.Authorization = token;
  }

  const bodyObj = !!body ? {body: isFormData ? body : JSON.stringify(body)} : {};
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method,
      headers,
      ...bodyObj,
    });

    if (response.status === 401) {
      removeToken(); // 401 발생 시 자동 로그아웃
      alert('인증이 만료되었습니다. 다시 로그인해주세요.');
      document.location.href = '/login';
      return { success: false, message: "인증이 만료되었습니다. 다시 로그인해주세요." };
    }

    if (response.status === 204) {
      return { success: true, message: "정상적으로 삭제되었습니다. "};
    }

    const data = await response.json();
    return response.ok ? data : { success: false, message: data.message || "오류 발생" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "네트워크 오류 발생" };
  }
};
