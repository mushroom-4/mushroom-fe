export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `/api/v2/auth/register`,
    LOGIN: `/api/v1/auth/login`,
    UPDATE_INFO: `/api/v1/users/info`,
    UPDATE_PASSWORD: `/api/v1/users/password`,
  },
  AUCTION: {
    LIST: `/api/v1/auction-items`,
    SEARCH: `/api/v1/auction-items/search`,
    CONTROL: (id) => `/api/v1/auction-items/${id}`,
    DETAIL: (id) => `/api/v2/auction-items/${id}/info`,
    BID: (id) => `/api/v1/auction-items/${id}/bids`,
    PAYMENT: `/api/v2/payments/confirm/widget`,
    CHAT: (chatRoomId) => `/api/v2/bids/chats/${chatRoomId}`,
    POPULAR: `/api/v1/auction-items/popular-keywords`,
    NOTICE: `/api/v2/users/notices`,
  },
  USER: {
    REGISTRATIONS: `/api/v1/users/registrations`,
    BIDS: `/api/v1/users/bids`,
    BID_DETAIL: (bidId) => `/api/v1/users/bids/${bidId}`,
  },
  ADMIN: {
    ITEM_LIST: `/api/v1/admin/auction-items`,
    AUCTION_ITEM_CHANGE_STATUS: (id) => `/api/v1/admin/auction-items/${id}`,
  },
  LIKE: {
    SET_LIKE: (auctionItemId) => `/api/v1/auction-items/${auctionItemId}/likes`,
    GET_LIKE_ITEMS: `/api/v2/users/auction-items/likes`,
  }
};
