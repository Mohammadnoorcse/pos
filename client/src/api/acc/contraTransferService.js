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

// ১. কন্ট্রা ট্রান্সফার লিস্ট আনা (filter: status)
export const fetchContraTransfers = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/contra-transfers${queryString ? `?${queryString}` : ""}`;
  return request(endpoint, { method: "GET" });
};

// ২. নতুন কন্ট্রা ট্রান্সফার তৈরি করা
export const createContraTransfer = async (transferData) => {
  return request("/contra-transfers", {
    method: "POST",
    body: JSON.stringify(transferData),
  });
};

// ৩. কন্ট্রা ট্রান্সফার ক্যান্সেল করা
export const cancelContraTransfer = async (id) => {
  return request(`/contra-transfers/${id}/cancel`, {
    method: "PATCH",
  });
};
