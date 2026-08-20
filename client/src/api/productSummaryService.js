// src/api/productSummaryService.js

const API_BASE_URL = import.meta.env.VITE_API_URL;

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

// 1. Fetch Branches list
export const fetchBranches = async () => {
  return request("/branches", { method: "GET" });
};

// 2. Fetch Sold Products
export const fetchSoldProducts = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return request(`/sales${queryString ? `?${queryString}` : ""}`, { method: "GET" });
};

// 3. Fetch Returned Products
export const fetchReturnedProducts = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return request(`/sale-returns${queryString ? `?${queryString}` : ""}`, { method: "GET" });
};

// 4. Fetch Damaged Products Records
export const fetchDamagedRecords = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return request(`/damage-records${queryString ? `?${queryString}` : ""}`, { method: "GET" });
};