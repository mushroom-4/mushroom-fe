import { request } from "./apiClient";
import { API_ENDPOINTS } from "./apiEndpoints";

/** ✅ 경매 물품 목록 조회 */
export const fetchAuctionItems = (page = 1) => {
  return request(`${API_ENDPOINTS.AUCTION.LIST}?page=${page}`, "GET", null, false, false);
};

/** ✅ 경매 물품 상세 조회 */
export const fetchAuctionItemDetail = (auctionItemId) => {
  return request(API_ENDPOINTS.AUCTION.DETAIL(auctionItemId), "GET", null, false, false);
};

/** ✅ 입찰 요청 */
export const placeBid = (auctionItemId, biddingPrice) => {
  return request(API_ENDPOINTS.AUCTION.BID(auctionItemId), "POST", { biddingPrice });
};
