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

// ১. ক্যাটাগরি লিস্ট ফেচ করা
export const fetchCategories = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/categories${queryString ? `?${queryString}` : ""}`;
  return request(endpoint, { method: "GET" });
};

// ২. নতুন ক্যাটাগরি তৈরি করা
export const createCategory = async (categoryData) => {
  return request("/categories", {
    method: "POST",
    body: JSON.stringify(categoryData),
  });
};

// ৩. ক্যাটাগরি আপডেট করা
export const updateCategory = async (id, categoryData) => {
  return request(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(categoryData),
  });
};

// ৪. ক্যাটাগরি ডিলিট করা
export const deleteCategory = async (id) => {
  return request(`/categories/${id}`, {
    method: "DELETE",
  });
};