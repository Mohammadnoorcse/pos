const API_BASE_URL = import.meta.env.VITE_API_URL;

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

  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

/**
 * GET /api/suppliers
 * params: { search, per_page, page }
 */
export const fetchSuppliers = async (params = {}) => {
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
  );
  const queryString = new URLSearchParams(cleaned).toString();
  const endpoint = `/suppliers${queryString ? `?${queryString}` : ""}`;
  return request(endpoint, { method: "GET" });
};

/**
 * POST /api/suppliers
 */
export const createSupplier = async (payload) => {
  return request("/suppliers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};