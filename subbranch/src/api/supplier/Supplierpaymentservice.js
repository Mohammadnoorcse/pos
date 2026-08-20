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

// ১. পেমেন্ট লিস্ট আনা (সার্চ + পেজিনেশন সহ)
// params: { search, per_page, page }
export const fetchSupplierPayments = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/supplier-payments${queryString ? `?${queryString}` : ""}`;
  return request(endpoint, { method: "GET" });
};

// ২. নতুন পেমেন্ট রেকর্ড করা
// payload: { supplier_id, purchase_id?, amount, method, note?, received_by?, paid_by?, paid_date }
export const createSupplierPayment = async (paymentData) => {
  return request("/supplier-payments", {
    method: "POST",
    body: JSON.stringify(paymentData),
  });
};

// ৩. পেমেন্ট ডিলিট করা
export const deleteSupplierPayment = async (id) => {
  return request(`/supplier-payments/${id}`, {
    method: "DELETE",
  });
};

// ৪. সাপ্লায়ার লিস্ট আনা ("Add payment" মডালের ড্রপডাউনের জন্য)
// backend endpoint নাম আলাদা হলে এখানে পরিবর্তন করুন
export const fetchSuppliers = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/suppliers${queryString ? `?${queryString}` : ""}`;
  return request(endpoint, { method: "GET" });
};