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

// ১. ভ্যারিয়েশন লিস্ট ফেচ করা
export const fetchVariations = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/variations${queryString ? `?${queryString}` : ""}`;
  return request(endpoint, { method: "GET" });
};

// ২. নতুন ভ্যারিয়েশন তৈরি করা
export const createVariation = async (variationData) => {
  return request("/variations", {
    method: "POST",
    body: JSON.stringify(variationData),
  });
};

// ৩. ভ্যারিয়েশন আপডেট করা
export const updateVariation = async (id, variationData) => {
  return request(`/variations/${id}`, {
    method: "PUT",
    body: JSON.stringify(variationData),
  });
};

// ৪. ভ্যারিয়েশন ডিলিট করা
export const deleteVariation = async (id) => {
  return request(`/variations/${id}`, {
    method: "DELETE",
  });
};