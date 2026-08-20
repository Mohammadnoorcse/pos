const API_BASE_URL = import.meta.env.VITE_API_URL;

// Common API Request Helper
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

// ১. ব্র্যান্ডের লিস্ট ফেচ করা (Search & Pagination সহ)
export const fetchBrands = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/brands${queryString ? `?${queryString}` : ""}`;
  return request(endpoint, { method: "GET" });
};

// ২. নতুন ব্র্যান্ড তৈরি করা
export const createBrand = async (brandData) => {
  return request("/brands", {
    method: "POST",
    body: JSON.stringify(brandData),
  });
};

// ৩. ব্র্যান্ড আপডেট করা
export const updateBrand = async (id, brandData) => {
  return request(`/brands/${id}`, {
    method: "PUT",
    body: JSON.stringify(brandData),
  });
};

// ৪. ব্র্যান্ড ডিলিট করা
export const deleteBrand = async (id) => {
  return request(`/brands/${id}`, {
    method: "DELETE",
  });
};