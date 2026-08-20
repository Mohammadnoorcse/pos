// src/api/soldInvoicesService.js

const API_BASE_URL = import.meta.env.VITE_API_URL;

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

// Fetch sold invoices (paginated, filterable)
export const fetchSoldInvoices = async (params = {}) => {
  // Strip out empty/undefined values so we don't send blank query params
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== "" && v !== undefined && v !== null)
  );
  const queryString = new URLSearchParams(cleaned).toString();
  return request(`/sales${queryString ? `?${queryString}` : ""}`, { method: "GET" });
};