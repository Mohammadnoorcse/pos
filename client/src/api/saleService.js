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

// ১. সেলস লিস্ট আনা (ফিল্টারিং ও পেজিনেশন সহ)
export const fetchSales = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/sales${queryString ? `?${queryString}` : ""}`;
  return request(endpoint, { method: "GET" });
};

// ২. নির্দিষ্ট কোন সেলের বিস্তারিত তথ্য আনা
export const fetchSaleDetails = async (id) => {
  return request(`/sales/${id}`, { method: "GET" });
};

// ৩. নতুন সেল তৈরি করা (POS Checkout)
export const createSale = async (saleData) => {
  return request("/sales", {
    method: "POST",
    body: JSON.stringify(saleData),
  });
};

// ৪. সেল আপডেট করা
export const updateSale = async (id, saleData) => {
  return request(`/sales/${id}`, {
    method: "PUT",
    body: JSON.stringify(saleData),
  });
};

// ৫. সেল ডিলিট করা
export const deleteSale = async (id) => {
  return request(`/sales/${id}`, {
    method: "DELETE",
  });
};

// ৬. সেলের বকেয়া টাকা (Due Collection) জমা করা
export const recordSalePayment = async (saleId, paymentData) => {
  return request(`/sales/${saleId}/payments`, {
    method: "POST",
    body: JSON.stringify(paymentData),
  });
};