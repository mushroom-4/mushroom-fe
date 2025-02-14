export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
  },
  AUCTION: {
    LIST: "/auction-items",
    CONTROL: (id) => `/auction-items/${id}`,
    DETAIL: (id) => `/auction-items/${id}/info`,
    BID: (id) => `/auction-items/${id}/bids`,
  },
  USER: {
    REGISTRATIONS: "/users/registrations",
    BIDS: "/users/bids",
    BID_DETAIL: (bidId) => `/users/bids/${bidId}`,
  },
};
