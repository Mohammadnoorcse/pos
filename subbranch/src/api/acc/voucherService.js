import { withBranchParams } from "./branchScope";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Helper function for API Requests
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

// ১. ভাউচার লিস্ট আনা (filters: type, account, from, to, search)
export const fetchVouchers = async (params = {}) => {
  const queryString = new URLSearchParams(withBranchParams(params)).toString();
  const endpoint = `/vouchers${queryString ? `?${queryString}` : ""}`;
  return request(endpoint, { method: "GET" });
};

// ২. নতুন (ম্যানুয়াল) ভাউচার তৈরি করা, যেমন Journal Voucher
export const createVoucher = async (voucherData) => {
  return request("/vouchers", {
    method: "POST",
    body: JSON.stringify(voucherData),
  });
};
