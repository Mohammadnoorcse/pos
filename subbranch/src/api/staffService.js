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

// ১. Branch অনুযায়ী স্টাফ লিস্ট (branch_id দিলে সেই branch, না দিলে সবার)
export const fetchStaffList = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/staff${queryString ? `?${queryString}` : ""}`;
  return request(endpoint, { method: "GET" });
};

// ২. একজন স্টাফের ডিটেইলস + salary payment history
export const fetchStaffDetail = async (id) => {
  return request(`/staff/${id}`, { method: "GET" });
};

// ৩. স্টাফের employment details (phone, address, joining date, monthly salary) আপডেট
export const updateStaffDetails = async (id, data) => {
  return request(`/staff/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// ৪. Salary payment history (filter: user_id, branch_id, month=YYYY-MM)
export const fetchSalaryPayments = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/staff-salary-payments${queryString ? `?${queryString}` : ""}`;
  return request(endpoint, { method: "GET" });
};

// ৫. নতুন salary payment রেকর্ড করা
export const createSalaryPayment = async (data) => {
  return request("/staff-salary-payments", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// ৬. salary payment রেকর্ড ডিলিট করা
export const deleteSalaryPayment = async (id) => {
  return request(`/staff-salary-payments/${id}`, { method: "DELETE" });
};
