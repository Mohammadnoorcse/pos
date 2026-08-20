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

// ১. ইনকামের লিস্ট আনা (filters: type, category, account, from, to)
export const fetchIncomes = async (params = {}) => {
  const queryString = new URLSearchParams(withBranchParams(params)).toString();
  const endpoint = `/incomes${queryString ? `?${queryString}` : ""}`;
  return request(endpoint, { method: "GET" });
};

// ২. নতুন ইনকাম যোগ করা
export const createIncome = async (incomeData) => {
  return request("/incomes", {
    method: "POST",
    body: JSON.stringify(withBranchBody(incomeData)),
  });
};

// ৩. ইনকাম ডিলিট করা
export const deleteIncome = async (id) => {
  return request(`/incomes/${id}`, {
    method: "DELETE",
  });
};
