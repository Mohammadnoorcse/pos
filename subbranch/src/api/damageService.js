const API_BASE_URL = import.meta.env.VITE_API_URL;

// Helper function for API Requests
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
};

// ১. ড্যামেজ করার জন্য প্রোডাক্টের লিস্ট আনা
export const fetchDamageProducts = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/damage-products${queryString ? `?${queryString}` : ""}`;
  return request(endpoint, { method: "GET" });
};

// ২. সব ড্যামেজ রেকর্ডের লিস্ট আনা
export const fetchDamageRecords = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/damage-records${queryString ? `?${queryString}` : ""}`;
  return request(endpoint, { method: "GET" });
};

// ৩. নতুন ড্যামেজ রেকর্ড যুক্ত করা
export const createDamageRecord = async (damageData) => {
  return request("/damage-records", {
    method: "POST",
    body: JSON.stringify(damageData),
  });
};