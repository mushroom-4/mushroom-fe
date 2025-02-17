import { request } from "./apiClient";
import { API_ENDPOINTS } from "./apiEndpoints";

/** ✅ 입찰 내역 목록 조회 */
export const fetchBidHistory = (page = 1) => {
  return request(`${API_ENDPOINTS.USER.BIDS}?page=${page}`);
};

/** ✅ 특정 입찰 상세 조회 */
export const fetchBidDetail = (bidId) => {
  return request(API_ENDPOINTS.USER.BID_DETAIL(bidId));
};