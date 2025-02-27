import { request } from "./apiClient";
import { API_ENDPOINTS } from "./apiEndpoints";

export const fetchSellerReviews = (sellerId) => {
  return request(API_ENDPOINTS.USER.REVIEWS(sellerId), "GET", null, false, false);
};

export const createSellerReview = (bidId, review) => {
  return request(API_ENDPOINTS.USER.CREATE_REVIEW(bidId), "POST", review, true, false);
}

export const deleteSellerReview = (reviewId) => {
  return request(API_ENDPOINTS.USER.DELETE_REVIEW(reviewId), "DELETE", null, true, false);
}