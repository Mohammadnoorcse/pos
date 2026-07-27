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

// ১. প্রোডাক্ট স্টক ফিল্টারড লিস্ট এবং সামারি আনা
export const fetchProductStocks = async (params = {}) => {
  const queryParams = new URLSearchParams();

  if (params.branch_id) queryParams.append("branch_id", params.branch_id);
  if (params.search) queryParams.append("search", params.search);
  if (params.active_only) queryParams.append("active_only", "1");
  if (params.category_id) queryParams.append("category_id", params.category_id);
  if (params.brand_id) queryParams.append("brand_id", params.brand_id);
  if (params.per_page) queryParams.append("per_page", params.per_page);
  if (params.page) queryParams.append("page", params.page);

  const queryString = queryParams.toString();
  const endpoint = `/product-stocks${queryString ? `?${queryString}` : ""}`;
  return request(endpoint, { method: "GET" });
};

// ২. ম্যানুয়াল স্টক কারেকশন / এডজাস্ট করা
export const adjustProductStock = async (adjustmentData) => {
  return request("/product-stocks/adjust", {
    method: "POST",
    body: JSON.stringify(adjustmentData),
  });
};

export const fetchStockAlerts = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/stock-alerts${queryString ? `?${queryString}` : ""}`;
  return request(endpoint, { method: "GET" });
};