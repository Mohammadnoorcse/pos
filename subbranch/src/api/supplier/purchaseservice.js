const API_BASE_URL = import.meta.env.VITE_API_URL;

// Same request helper as adminRoleService.js — kept local so this file has no
// cross-import surprises. If you already centralize this in api/client.js,
// delete this copy and import that one instead.
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
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  // DELETE endpoints etc. may return an empty body — guard against json() throwing.
  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

/**
 * GET /api/purchases
 * params: { search, due_only, per_page, page }
 * Backend: PurchaseController::index — paginated Laravel response
 * { data: [...], current_page, last_page, total, per_page, ... }
 */
export const fetchPurchases = async (params = {}) => {
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
  );
  const queryString = new URLSearchParams(cleaned).toString();
  const endpoint = `/purchases${queryString ? `?${queryString}` : ""}`;
  return request(endpoint, { method: "GET" });
};

export const fetchPurchase = async (id) => {
  return request(`/purchases/${id}`, { method: "GET" });
};

export const createPurchase = async (payload) => {
  return request("/purchases", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};