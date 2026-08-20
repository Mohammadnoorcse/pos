const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

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

// ১. ইউনিট টাইপ লিস্ট ফেচ করা
export const fetchUnitTypes = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/unit-types${queryString ? `?${queryString}` : ""}`;
  return request(endpoint, { method: "GET" });
};

// ২. নতুন ইউনিট টাইপ তৈরি করা
export const createUnitType = async (unitData) => {
  return request("/unit-types", {
    method: "POST",
    body: JSON.stringify(unitData),
  });
};

// ৩. ইউনিট টাইপ আপডেট করা
export const updateUnitType = async (id, unitData) => {
  return request(`/unit-types/${id}`, {
    method: "PUT",
    body: JSON.stringify(unitData),
  });
};

// ৪. ইউনিট টাইপ ডিলিট করা
export const deleteUnitType = async (id) => {
  return request(`/unit-types/${id}`, {
    method: "DELETE",
  });
};