const API_BASE_URL = import.meta.env.VITE_API_URL;

// Helper function for API Requests (same pattern as adminRoleService.js)
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

const toQuery = (params = {}) => {
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== null && v !== undefined && v !== "")
  );
  const qs = new URLSearchParams(clean).toString();
  return qs ? `?${qs}` : "";
};

// ১. KPI কার্ডগুলোর ডাটা
export const fetchDashboardKpis = async (params = {}) => {
  return request(`/dashboard/kpis${toQuery(params)}`, { method: "GET" });
};

// ২. বিক্রয় প্রবণতা (গত N দিন)
export const fetchSalesTrend = async (params = {}) => {
  return request(`/dashboard/sales-trend${toQuery(params)}`, { method: "GET" });
};

// ৩. সাম্প্রতিক লেনদেন
export const fetchRecentTransactions = async (params = {}) => {
  return request(`/dashboard/recent-transactions${toQuery(params)}`, { method: "GET" });
};

// ৪. টপ সেলিং প্রোডাক্ট
export const fetchTopProducts = async (params = {}) => {
  return request(`/dashboard/top-products${toQuery(params)}`, { method: "GET" });
};

// ৫. পেমেন্ট মেথড ব্রেকডাউন
export const fetchPaymentBreakdown = async (params = {}) => {
  return request(`/dashboard/payment-breakdown${toQuery(params)}`, { method: "GET" });
};

// ৬. স্টাফ পারফরম্যান্স
export const fetchStaffPerformance = async (params = {}) => {
  return request(`/dashboard/staff-performance${toQuery(params)}`, { method: "GET" });
};

// ৭. ক্যাটাগরি-ভিত্তিক বিক্রয়
export const fetchCategorySales = async (params = {}) => {
  return request(`/dashboard/category-sales${toQuery(params)}`, { method: "GET" });
};

// ৮. আজকের খরচ
export const fetchExpensesToday = async (params = {}) => {
  return request(`/dashboard/expenses-today${toQuery(params)}`, { method: "GET" });
};

// ৯. ব্রাঞ্চ ভিত্তিক তুলনা
export const fetchBranchComparison = async (params = {}) => {
  return request(`/dashboard/branch-comparison${toQuery(params)}`, { method: "GET" });
};

// ১০. ক্যাশ সামারি (ড্রয়ার রিকনসিলিয়েশন)
export const fetchCashSummary = async (params = {}) => {
  return request(`/dashboard/cash-summary${toQuery(params)}`, { method: "GET" });
};

// ১১. অ্যাক্টিভিটি ফিড
export const fetchActivityFeed = async (params = {}) => {
  return request(`/dashboard/activity-feed${toQuery(params)}`, { method: "GET" });
};

// ১২. স্টক অ্যালার্ট (আগে থেকেই route আছে StockAlertController-এর)
export const fetchStockAlerts = async (params = {}) => {
  return request(`/stock-alerts${toQuery(params)}`, { method: "GET" });
};

// ১৩. ব্রাঞ্চ লিস্ট (dropdown filter-এর জন্য)
export const fetchBranchesLite = async () => {
  return request(`/branches?per_page=100`, { method: "GET" });
};