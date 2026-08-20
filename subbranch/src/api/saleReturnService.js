const API_BASE_URL = import.meta.env.VITE_API_URL;

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
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

// Sales made by a specific customer (so we can pick which invoice to return from)
export const fetchCustomerSales = async (customerId, params = {}) => {
  const query = new URLSearchParams({ customer_id: customerId, ...params }).toString();
  return request(`/sales?${query}`, { method: "GET" });
};

// Items still returnable for a given sale (uses SaleController::returnableItems)
export const fetchReturnableItems = async (saleId) => {
  return request(`/sales/${saleId}/returnable-items`, { method: "GET" });
};

// Submit one return line (SaleReturnController::store expects ONE sale_item at a time)
export const createSaleReturn = async ({
  sale_id,
  sale_item_id,
  quantity,
  return_date,
  refund_action, // 'direct' | 'exchange'
  account,       // 'cash' or a banks.code, used when refund_action === 'direct'
  note,
}) => {
  return request("/sale-returns", {
    method: "POST",
    body: JSON.stringify({
      sale_id,
      sale_item_id,
      quantity,
      return_date,
      refund_action,
      account,
      note,
    }),
  });
};