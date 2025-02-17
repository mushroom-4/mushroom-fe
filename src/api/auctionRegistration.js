import { request } from "./apiClient";
import { API_ENDPOINTS } from "./apiEndpoints";

/** ✅ 등록한 경매 아이템 목록 조회 */
export const fetchRegisteredAuctionItems = () => {
  return request(API_ENDPOINTS.USER.REGISTRATIONS);
};

/** ✅ 특정 경매 아이템 상세 조회 */
export const fetchAuctionItemDetail = (auctionItemId) => {
  return request(API_ENDPOINTS.AUCTION.DETAIL(auctionItemId));
};

/** ✅ 경매 아이템 생성 (FormData) */
export const createAuctionItem = (formData) => {
  return request(API_ENDPOINTS.AUCTION.LIST, "POST", formData, true, true);
};

/** ✅ 경매 아이템 수정 (FormData) */
export const updateAuctionItem = (auctionItemId, formData) => {
  return request(API_ENDPOINTS.AUCTION.CONTROL(auctionItemId), "PUT", formData, true, true);
};

/** ✅ 경매 아이템 삭제 */
export const deleteAuctionItem = (auctionItemId) => {
  return request(API_ENDPOINTS.AUCTION.CONTROL(auctionItemId), "DELETE");
};