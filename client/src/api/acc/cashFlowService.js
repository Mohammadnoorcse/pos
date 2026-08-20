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

// ১. ক্যাশ ফ্লো এন্ট্রি লিস্ট আনা (filters: from, to, type, source)
export const fetchCashFlowEntries = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/cash-flow${queryString ? `?${queryString}` : ""}`;
  return request(endpoint, { method: "GET" });
};

// ২. নতুন ক্যাশ ফ্লো এন্ট্রি তৈরি করা
export const createCashFlowEntry = async (entryData) => {
  return request("/cash-flow", {
    method: "POST",
    body: JSON.stringify(entryData),
  });
};

// ৩. ক্যাশ ফ্লো এন্ট্রি ডিলিট করা
export const deleteCashFlowEntry = async (id) => {
  return request(`/cash-flow/${id}`, {
    method: "DELETE",
  });
};
