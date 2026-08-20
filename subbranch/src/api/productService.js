const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  const isFormData = options.body instanceof FormData;

  const headers = {
    "Accept": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// ১. প্রোডাক্ট লিস্ট আনা
export const fetchProducts = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/products${queryString ? `?${queryString}` : ""}`;
  return request(endpoint, { method: "GET" });
};

// ২. একটি নির্দিষ্ট প্রোডাক্টের তথ্য আনা
export const fetchProductById = async (id) => {
  return request(`/products/${id}`, { method: "GET" });
};

// ৩. নতুন প্রোডাক্ট তৈরি করা (FormData বা JSON)
export const createProduct = async (productData) => {
  return request("/products", {
    method: "POST",
    body: productData instanceof FormData ? productData : JSON.stringify(productData),
  });
};

// ৪. প্রোডাক্ট আপডেট করা
export const updateProduct = async (id, productData) => {
  if (productData instanceof FormData) {
    productData.append("_method", "PUT");
    return request(`/products/${id}`, {
      method: "POST",
      body: productData,
    });
  }
  return request(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(productData),
  });
};

// ৫. প্রোডাক্ট ডিলিট করা
export const deleteProduct = async (id) => {
  return request(`/products/${id}`, { method: "DELETE" });
};

// ৬. বারকোড জেনারেট করা
export const generateBarcode = async () => {
  return request("/products/generate-barcode", { method: "POST" });
};

// ৭. সিএসভি আপলোড করা
export const uploadProductCsv = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return request("/products/upload-csv", {
    method: "POST",
    body: formData,
  });
};