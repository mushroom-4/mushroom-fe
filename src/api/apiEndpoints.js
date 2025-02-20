export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `/v2/auth/register`,
    LOGIN: `/v1/auth/login`,
    UPDATE_INFO: `/v1/users/info`,
    UPDATE_PASSWORD: `/v1/users/password`,
  },
  AUCTION: {
    LIST: `/v1/auction-items`,
    CONTROL: (id) => `/v1/auction-items/${id}`,
    DETAIL: (id) => `/v1/auction-items/${id}/info`,
    BID: (id) => `/v1/auction-items/${id}/bids`,
    PAYMENT: `/v2/payments/confirm/widget`,
  },
  USER: {
    REGISTRATIONS: `/v1/users/registrations`,
    BIDS: `/v1/users/bids`,
    BID_DETAIL: (bidId) => `/v1/users/bids/${bidId}`,
  },
  ADMIN: {
    ITEM_LIST: `/v1/admin/auction-items`,
    AUCTION_ITEM_CHANGE_STATUS: (id) => `/v1/admin/auction-items/${id}`,
  },
  LIKE: {
    SET_LIKE: (auctionItemId) => `/v1/auction-items/${auctionItemId}/likes`,
    GET_LIKE_ITEMS: `/v2/users/auction-items/likes`,
  }
};
