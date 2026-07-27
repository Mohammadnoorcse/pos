const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// ১. ট্রান্সফার হিস্ট্রি লিস্ট আনা — GET /stock-transfers?type=&branch_id=&search=&per_page=
export const fetchStockTransfers = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/stock-transfers${queryString ? `?${queryString}` : ""}`;
  return request(endpoint, { method: "GET" });
};

// ২. একটি নির্দিষ্ট ট্রান্সফারের বিবরণ আনা — GET /stock-transfers/{id}
export const fetchStockTransferById = async (id) => {
  return request(`/stock-transfers/${id}`, { method: "GET" });
};

// ৩. sender branch এর স্টকে থাকা প্রোডাক্ট আনা — GET /stock-transfers/sender-stock?branch_id=&search=
export const fetchSenderStock = async (branchId, params = {}) => {
  const queryString = new URLSearchParams({ branch_id: branchId, ...params }).toString();
  return request(`/stock-transfers/sender-stock?${queryString}`, { method: "GET" });
};

// ৪. নতুন স্টক ট্রান্সফার কনফার্ম করা — POST /stock-transfers
export const createStockTransfer = async (transferData) => {
  return request("/stock-transfers", {
    method: "POST",
    body: JSON.stringify(transferData),
  });
};