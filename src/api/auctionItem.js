import { request } from "./apiClient";
import { API_ENDPOINTS } from "./apiEndpoints";

/** ✅ 경매 물품 목록 조회 */
export const fetchAuctionItems = (params = {}) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD 형식 검증
  if (params.startDate && dateRegex.test(params.startDate)) {
    params.startDate = `${params.startDate}T00:00:00`;
  }
  if (params.endDate && dateRegex.test(params.endDate)) {
    params.endDate = `${params.endDate}T23:59:59`;
  }
  const queryString = new URLSearchParams(params).toString();
  return request(`${API_ENDPOINTS.AUCTION.SEARCH}?${queryString}`, "GET", null, false, false);
};

/** ✅ 경매 물품 상세 조회 */
export const fetchAuctionItemDetail = (auctionItemId) => {
  return request(API_ENDPOINTS.AUCTION.DETAIL(auctionItemId), "GET", null, false, false);
};

/** ✅ 입찰 요청 */
export const placeBid = (auctionItemId, biddingPrice) => {
  return request(API_ENDPOINTS.AUCTION.BID(auctionItemId), "POST", { biddingPrice });
};

/** ✅ 경매 물품 목록 조회 (어드민) */
export const fetchAdminAuctionItems = (page = 1, status = []) => {
  const statusQuery = status.map(s => `status=${s}`).join("&");
  return request(`${API_ENDPOINTS.ADMIN.ITEM_LIST}?page=${page}&${statusQuery}`, "GET", null, true, false);
};

/** ✅ 경매 물품 상태 변경 (어드민) */
export const setStatusAdminAuctionItems = (auctionItemId, action) => {
  return request(API_ENDPOINTS.ADMIN.AUCTION_ITEM_CHANGE_STATUS(auctionItemId), "PATCH", { action }, true, false);
};

/** ✅ 경매 물품에 좋아요 */
export const likeAuctionItems = (auctionItemId) => {
  return request(API_ENDPOINTS.LIKE.SET_LIKE(auctionItemId), "POST", null, true, false);
};

/** ✅ 경매 물품에 좋아요 취소 */
export const unlikeAuctionItems = (auctionItemId) => {
  return request(API_ENDPOINTS.LIKE.SET_LIKE(auctionItemId), "DELETE", null, true, false);
};

/** ✅ 좋아요한 경매 물품들 */
export const allLikeAuctionItems = (page = 1) => {
  return request(`${API_ENDPOINTS.LIKE.GET_LIKE_ITEMS}?page=${page}`, "GET", null, true, false);
};

/** ✅ 채팅 조회 */
export const auctionItemChat = (auctionItemId) => {
  return request(`${API_ENDPOINTS.AUCTION.CHAT(auctionItemId)}`, "GET", null, true, false);
};

// ✅ 인기 검색어 API 요청 함수
export const fetchPopularKeywords = async () => {
  return request(API_ENDPOINTS.AUCTION.POPULAR, "GET", null, false, false);
};