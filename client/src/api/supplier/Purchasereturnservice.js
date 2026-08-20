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

// ১. রিটার্ন লিস্ট আনা (সার্চ + পেজিনেশন সহ)
// params: { search, purchase_id, supplier_id, per_page, page }
export const fetchPurchaseReturns = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/purchase-returns${queryString ? `?${queryString}` : ""}`;
  return request(endpoint, { method: "GET" });
};

// ২. একটি নির্দিষ্ট রিটার্নের ডিটেইল আনা
export const fetchPurchaseReturn = async (id) => {
  return request(`/purchase-returns/${id}`, { method: "GET" });
};

// ৩. নতুন রিটার্ন রেকর্ড করা
// payload: { purchase_id, reason?, return_date, items: [{ purchase_item_id?, product_id?, name, qty, price }] }
export const createPurchaseReturn = async (returnData) => {
  return request("/purchase-returns", {
    method: "POST",
    body: JSON.stringify(returnData),
  });
};

// ৪. রিটার্ন ডিলিট করা (purchase-এর due/receivable আবার রিক্যালকুলেট হয়ে যায় ব্যাকএন্ডে)
export const deletePurchaseReturn = async (id) => {
  return request(`/purchase-returns/${id}`, {
    method: "DELETE",
  });
};