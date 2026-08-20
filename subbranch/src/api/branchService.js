const API_BASE_URL = import.meta.env.VITE_API_URL;

// Common Fetch Helper
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
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


export const fetchBranches = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/branches${queryString ? `?${queryString}` : ""}`;
  return request(endpoint, { method: "GET" });
};


export const createBranch = async (branchData) => {
  return request("/branches", {
    method: "POST",
    body: JSON.stringify(branchData),
  });
};


export const updateBranch = async (id, branchData) => {
  return request(`/branches/${id}`, {
    method: "PUT",
    body: JSON.stringify(branchData),
  });
};


export const deleteBranch = async (id) => {
  return request(`/branches/${id}`, {
    method: "DELETE",
  });
};