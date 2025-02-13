import { getToken } from "../utils/auth";

const API_BASE_URL = "https://mutt-iroom.store/api/v1";

/**
 * 경매 물품 목록 조회 (페이지네이션 추가)
 */
export const fetchAuctionItems = async (page = 1) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auction-items?page=${page}`);
    const data = await response.json();
    return data.success ? data.data : { content: [], page: {} };
  } catch (error) {
    console.error("API 요청 중 오류 발생:", error);
    return { content: [], page: {} };
  }
};

/**
 * 경매 물품 상세 조회
 */
export const fetchAuctionItemDetail = async (auctionItemId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auction-items/${auctionItemId}/info`);
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("API 요청 중 오류 발생:", error);
    return null;
  }
};

/**
 * 입찰 요청 API (Authorization 포함)
 */
export const placeBid = async (auctionItemId, biddingPrice) => {
  const token = getToken();

  console.log(token);
  
  if (!token) {
    return { success: false, message: "로그인이 필요합니다." };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auction-items/${auctionItemId}/bids`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ biddingPrice }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error("입찰 요청 중 오류 발생:", error);
    return { success: false, message: "네트워크 오류가 발생했습니다." };
  }
};