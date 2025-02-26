import { request } from "./apiClient";
import { API_ENDPOINTS } from "./apiEndpoints";

export const fetchSellerReviews = (sellerId) => {
  return request(API_ENDPOINTS.USER.REVIEWS(sellerId), "GET", null, false, false);
};
