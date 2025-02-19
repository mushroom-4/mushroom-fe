import { request } from "./apiClient";
import {API_ENDPOINTS} from "./apiEndpoints";

export const confirmPayment = (paymentKey, orderId, amount) => {
  return request(API_ENDPOINTS.AUCTION.PAYMENT, "POST", { paymentKey, orderId, amount }, true);
};
