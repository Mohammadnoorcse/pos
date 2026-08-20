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

// ==========================================
// 👤 CUSTOMER API SERVICES
// ==========================================

// ১. কাস্টমার লিস্ট আনা (ফিল্টারিং, সার্চ ও পেজিনেশন সহ)
export const fetchCustomers = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/customers${queryString ? `?${queryString}` : ""}`;
  return request(endpoint, { method: "GET" });
};

// ২. কাস্টমারের বিস্তারিত তথ্য ও সাম্প্রতিক সেলস আনা
export const fetchCustomerDetails = async (id) => {
  return request(`/customers/${id}`, { method: "GET" });
};

// ৩. কাস্টমারের সম্পূর্ণ হিস্ট্রি, লেনদেন টাইমলাইন ও কেনা প্রোডাক্ট সামারি আনা
export const fetchCustomerHistory = async (id) => {
  return request(`/customers/${id}/history`, { method: "GET" });
};

// ৪. নতুন কাস্টমার তৈরি করা
export const createCustomer = async (customerData) => {
  return request("/customers", {
    method: "POST",
    body: JSON.stringify(customerData),
  });
};

// ৫. কাস্টমার তথ্য আপডেট করা
export const updateCustomer = async (id, customerData) => {
  return request(`/customers/${id}`, {
    method: "PUT",
    body: JSON.stringify(customerData),
  });
};

// ৬. কাস্টমার ডিলিট করা
export const deleteCustomer = async (id) => {
  return request(`/customers/${id}`, {
    method: "DELETE",
  });
};

// ==========================================
// 📦 PRODUCT API SERVICES
// ==========================================

// ৭. প্রোডাক্ট লিস্ট আনা (কারেন্ট ব্রাঞ্চ স্টক ও টোটাল স্টক সহ)
export const fetchProducts = async (params = {}) => {
  // params উদাহরণ: { branch_id: 1, search: 'ji hujur', per_page: 25 }
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/products${queryString ? `?${queryString}` : ""}`;
  return request(endpoint, { method: "GET" });
};