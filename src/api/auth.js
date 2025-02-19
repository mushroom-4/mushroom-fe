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

/** ✅ 닉네임 및 프로필 이미지 변경 */
export const updateUserInfo = (formData) => {
  return request(API_ENDPOINTS.AUTH.UPDATE_INFO, "PUT", formData, true, true);
};

/** ✅ 비밀번호 변경 */
export const updateUserPassword = (body) => {
  return request(API_ENDPOINTS.AUTH.UPDATE_PASSWORD, "PUT", body, true);
};