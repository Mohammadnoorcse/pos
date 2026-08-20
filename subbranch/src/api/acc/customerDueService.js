import { withBranchParams, withBranchBody } from "./branchScope";

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

// ১. বাকি থাকা কাস্টমারদের লিস্ট আনা (aging list)
export const fetchDueCustomers = async (params = {}) => {
  const queryString = new URLSearchParams(withBranchParams(params)).toString();
  const endpoint = `/customer-dues/customers${queryString ? `?${queryString}` : ""}`;
  return request(endpoint, { method: "GET" });
};

// ২. বাকি আদায়ের (collections) লিস্ট আনা (filters: customer_id, account)
export const fetchDueCollections = async (params = {}) => {
  const queryString = new URLSearchParams(withBranchParams(params)).toString();
  const endpoint = `/customer-dues/collections${queryString ? `?${queryString}` : ""}`;
  return request(endpoint, { method: "GET" });
};

// ৩. নতুন বাকি আদায় (collection) রেকর্ড করা
export const createDueCollection = async (collectionData) => {
  return request("/customer-dues/collections", {
    method: "POST",
    body: JSON.stringify(withBranchBody(collectionData)),
  });
};
