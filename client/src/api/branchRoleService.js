const API_BASE_URL = import.meta.env.VITE_API_URL;

// Common Fetch Helper
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

// ১. মাস্টার পারমিশন ক্যাটালগ আনা
export const fetchPermissionCatalog = async () => {
  return request("/branch-roles/permission-catalog", { method: "GET" });
};

// ২. ব্রাঞ্চ রোলগুলোর লিস্ট আনা
export const fetchBranchRoles = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/branch-roles${queryString ? `?${queryString}` : ""}`;
  return request(endpoint, { method: "GET" });
};

// ৩. নতুন রোল তৈরি করা
export const createBranchRole = async (roleData) => {
  return request("/branch-roles", {
    method: "POST",
    body: JSON.stringify(roleData),
  });
};

// ৪. রোলের নাম আপডেট করা
export const updateBranchRole = async (id, roleData) => {
  return request(`/branch-roles/${id}`, {
    method: "PUT",
    body: JSON.stringify(roleData),
  });
};

// ৫. রোল ডিলিট করা
export const deleteBranchRole = async (id) => {
  return request(`/branch-roles/${id}`, {
    method: "DELETE",
  });
};

// ৬. রোলের পারমিশন আপডেট (Sync) করা
export const updateRolePermissions = async (roleId, permissionsArray) => {
  return request(`/branch-roles/${roleId}/permissions`, {
    method: "PUT",
    body: JSON.stringify({ permissions: permissionsArray }),
  });
};