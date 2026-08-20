const API_BASE_URL = import.meta.env.VITE_API_URL;

// Common Fetch Helper Function
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

// ১. CRM পারমিশন লিস্ট আনা (Search & Pagination সহ)
export const fetchCrmPermissions = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/crm-permissions${queryString ? `?${queryString}` : ""}`;
  return request(endpoint, { method: "GET" });
};

// ২. নতুন CRM পারমিশন তৈরি করা
export const createCrmPermission = async (data) => {
  return request("/crm-permissions", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// ৩. CRM পারমিশন আপডেট করা
export const updateCrmPermission = async (id, data) => {
  return request(`/crm-permissions/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// ৪. CRM পারমিশন ডিলিট করা
export const deleteCrmPermission = async (id) => {
  return request(`/crm-permissions/${id}`, {
    method: "DELETE",
  });
};