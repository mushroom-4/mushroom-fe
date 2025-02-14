import { getToken } from "../utils/auth";

const API_BASE_URL = "https://mutt-iroom.store/api/v1/users";

export const fetchBidHistory = async (page = 1) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bids?page=${page}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${getToken()}`,
      },
    });

    const data = await response.json();
    if (response.ok) {
      return data.data;
    } else {
      return { content: [], page: { totalPages: 1 }, message: data.message };
    }
  } catch (error) {
    return { content: [], page: { totalPages: 1 }, message: "네트워크 오류 발생" };
  }
};

export const fetchBidDetail = async (bidId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bids/${bidId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${getToken()}`,
      },
    });

    const data = await response.json();
    if (response.ok) {
      return data.data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};