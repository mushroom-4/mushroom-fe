import { getToken } from "../utils/auth";

const API_BASE_URL = "https://mutt-iroom.store/api/v1";
export const IMAGE_BASE_URL = "https://yeim-vpc-bucket-240130.s3.ap-northeast-2.amazonaws.com/public/";


const authHeader = () => ({
  Authorization: getToken(),
});

/** ✅ 등록된 경매 아이템 목록 조회 */
export const fetchRegisteredAuctionItems = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/registrations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
    });

    return response.ok ? await response.json() : Promise.reject(await response.json());
  } catch (error) {
    return { success: false, message: "네트워크 오류 발생" };
  }
};

/** ✅ 특정 경매 아이템 상세 조회 */
export const fetchAuctionItemDetail = async (auctionItemId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auction-items/${auctionItemId}/info`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
    });

    return response.ok ? await response.json() : Promise.reject(await response.json());
  } catch (error) {
    return { success: false, message: "네트워크 오류 발생" };
  }
};

/** ✅ 경매 아이템 생성 */
export const createAuctionItem = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auction-items`, {
      method: "POST",
      headers: authHeader(), // `Content-Type`은 FormData 사용 시 자동 설정됨
      body: formData,
    });

    return response.ok ? await response.json() : Promise.reject(await response.json());
  } catch (error) {
    return { success: false, message: "네트워크 오류 발생" };
  }
};

/** ✅ 경매 아이템 수정 */
export const updateAuctionItem = async (auctionItemId, formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auction-items/${auctionItemId}`, {
      method: "PUT",
      headers: authHeader(),
      body: formData,
    });

    return response.ok ? await response.json() : Promise.reject(await response.json());
  } catch (error) {
    return { success: false, message: "네트워크 오류 발생" };
  }
};

/** ✅ 경매 아이템 삭제 */
export const deleteAuctionItem = async (auctionItemId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auction-items/${auctionItemId}`, {
      method: "DELETE",
      headers: authHeader(),
    });

    return response.ok ? await response.json() : Promise.reject(await response.json());
  } catch (error) {
    return { success: false, message: "네트워크 오류 발생" };
  }
};