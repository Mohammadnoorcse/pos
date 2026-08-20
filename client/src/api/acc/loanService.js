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

// ১. লোন/ক্যাপিটাল লিস্ট আনা (filters: kind, status)
export const fetchLoans = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/loans${queryString ? `?${queryString}` : ""}`;
  return request(endpoint, { method: "GET" });
};

// ২. নতুন লোন/ক্যাপিটাল এন্ট্রি তৈরি করা
export const createLoan = async (loanData) => {
  return request("/loans", {
    method: "POST",
    body: JSON.stringify(loanData),
  });
};

// ৩. লোনের কিস্তি/রিপেমেন্ট রেকর্ড করা
export const payLoan = async (id, paymentData) => {
  return request(`/loans/${id}/payments`, {
    method: "POST",
    body: JSON.stringify(paymentData),
  });
};
