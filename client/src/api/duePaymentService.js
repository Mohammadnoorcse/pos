// src/api/duePaymentService.js

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

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

/**
 * Fetch due payment invoices with optional filters
 * @param {Object} params - { from_date, to_date, search, per_page }
 */
export const fetchDueInvoices = async (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== "" && value !== null && value !== undefined)
  );
  const queryString = new URLSearchParams(cleanParams).toString();
  return request(`/due-payment-invoices${queryString ? `?${queryString}` : ""}`);
};

/**
 * Toggle the paid status of a specific invoice
 * @param {string|number} invoiceId 
 * @param {boolean} currentStatus 
 */
export const toggleInvoicePaymentStatus = async (invoiceId, currentStatus) => {
  return request(`/invoices/${invoiceId}/toggle-status`, {
    method: "PATCH",
    body: JSON.stringify({ paid: !currentStatus }),
  });
};