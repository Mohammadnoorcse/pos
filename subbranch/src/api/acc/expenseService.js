import { withBranchParams, withBranchBody } from "./branchScope";

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

// ১. খরচের লিস্ট আনা (filters: date, from, to, category, account)
export const fetchExpenses = async (params = {}) => {
  const queryString = new URLSearchParams(withBranchParams(params)).toString();
  const endpoint = `/expenses${queryString ? `?${queryString}` : ""}`;
  return request(endpoint, { method: "GET" });
};

// ২. নতুন খরচ যোগ করা
export const createExpense = async (expenseData) => {
  return request("/expenses", {
    method: "POST",
    body: JSON.stringify(withBranchBody(expenseData)),
  });
};

// ৩. খরচ ডিলিট করা
export const deleteExpense = async (id) => {
  return request(`/expenses/${id}`, {
    method: "DELETE",
  });
};
