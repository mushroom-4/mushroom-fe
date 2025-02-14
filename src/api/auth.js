import { request } from "./apiClient";
import { API_ENDPOINTS } from "./apiEndpoints";

/** ✅ 회원가입 */
export const register = (nickname, email, password) => {
  return request(API_ENDPOINTS.AUTH.REGISTER, "POST", { nickname, email, password, userRole: "USER" }, false);
};

/** ✅ 로그인 */
export const login = (email, password) => {
  return request(API_ENDPOINTS.AUTH.LOGIN, "POST", { email, password }, false);
};