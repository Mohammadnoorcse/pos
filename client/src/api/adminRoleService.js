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

// ১. মাস্টার উইং ও পারমিশন ক্যাটালগ আনা
export const fetchPermissionCatalog = async () => {
  return request("/admin-roles/permission-catalog", { method: "GET" });
};

// ২. এডমিন রোলগুলোর লিস্ট আনা
export const fetchAdminRoles = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/admin-roles${queryString ? `?${queryString}` : ""}`;
  return request(endpoint, { method: "GET" });
};

// ৩. নতুন রোল তৈরি করা
export const createAdminRole = async (roleData) => {
  return request("/admin-roles", {
    method: "POST",
    body: JSON.stringify(roleData),
  });
};

// ৪. রোলের নাম আপডেট করা
export const updateAdminRole = async (id, roleData) => {
  return request(`/admin-roles/${id}`, {
    method: "PUT",
    body: JSON.stringify(roleData),
  });
};

// ৫. রোল ডিলিট করা
export const deleteAdminRole = async (id) => {
  return request(`/admin-roles/${id}`, {
    method: "DELETE",
  });
};

// ৬. উইং ভিত্তিক পারমিশন আপডেট করা
// body format: { permissions: { "Account_Wing": ["account.dashboard"], "Godown_Wing": [...] } }
export const updateAdminRolePermissions = async (roleId, permissionsData) => {
  return request(`/admin-roles/${roleId}/permissions`, {
    method: "PUT",
    body: JSON.stringify({ permissions: permissionsData }),
  });
};