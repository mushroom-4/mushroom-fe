export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `/api/auth/register`,
    LOGIN: `/api/auth/login`,
    UPDATE_INFO: `/api/users/info`,
    UPDATE_PASSWORD: `/api/users/password`,
  },
  AUCTION: {
    LIST: `/api/auction-items`,
    SEARCH: `/api/auction-items/search`,
    CONTROL: (id) => `/api/auction-items/${id}`,
    DETAIL: (id) => `/api/auction-items/${id}/info`,
    BID: (id) => `/api/auction-items/${id}/bids`,
    PAYMENT: `/api/payments/confirm`,
    CHAT: (chatRoomId) => `/api/bids/chats/${chatRoomId}`,
    POPULAR: `/api/auction-items/popular-keywords`,
    NOTICE: `/api/users/notices`,
  },
  USER: {
    REGISTRATIONS: `/api/users/registrations`,
    BIDS: `/api/users/bids`,
    BID_DETAIL: (bidId) => `/api/users/bids/${bidId}`,
    REVIEWS: (sellerId) => `/api/sellers/${sellerId}/reviews`,
    CREATE_REVIEW: (bidId) => `/api/bids/reviews?bidId=${bidId}`,
    DELETE_REVIEW: (reviewId) => `/api/bids/reviews/${reviewId}`,
  },
  ADMIN: {
    ITEM_LIST: `/api/admin/auction-items`,
    AUCTION_ITEM_CHANGE_STATUS: (id) => `/api/admin/auction-items/${id}`,
  },
  LIKE: {
    SET_LIKE: (auctionItemId) => `/api/auction-items/${auctionItemId}/likes`,
    GET_LIKE_ITEMS: `/api/users/auction-items/likes`,
  }
};
