import { request } from "./apiClient";
import { API_ENDPOINTS } from "./apiEndpoints";

/** ✅ 회원가입 (multipart/form-data) */
export const register = (formData) => {
  return request(API_ENDPOINTS.AUTH.REGISTER, "POST", formData, false, true);
};

/** ✅ 로그인 */
export const login = (email, password) => {
  return request(API_ENDPOINTS.AUTH.LOGIN, "POST", { email, password }, false);
};