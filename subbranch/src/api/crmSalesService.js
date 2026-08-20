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

// আজকে / এই মাসে / এই বছরে / সর্বমোট সেলস সামারি
export const fetchCrmSummary = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return request(`/crm/summary${queryString ? `?${queryString}` : ""}`, { method: "GET" });
};

// কোন প্রোডাক্ট কতো সেল হচ্ছে (product-wise sold list)
export const fetchCrmSoldProducts = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return request(`/crm/sold-products${queryString ? `?${queryString}` : ""}`, { method: "GET" });
};

// কে কি বিক্রি করলো (invoice-wise sales list)
export const fetchCrmSalesList = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return request(`/crm/sales-list${queryString ? `?${queryString}` : ""}`, { method: "GET" });
};
