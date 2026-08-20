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

/* ---------------------------------------------------------------------
   Laravel পাঠায়/আশা করে snake_case (bank_name, account_name, ...),
   কিন্তু ফ্রন্টএন্ড ফর্ম camelCase (bankName, accountName, ...) ব্যবহার
   করে। এই দুই ফাংশন সেই ম্যাপিং করে, যাতে UI কোড পরিবর্তন না করেই
   backend validation-এর সাথে ফিল্ড নাম মিলে যায়।

   এছাড়া backend-এ দুইটা আলাদা আইডেন্টিফায়ার আছে:
   - id         → numeric primary key, route model binding-এ ব্যবহার হয়
                  (update/delete-এর জন্য এটাই পাঠাতে হবে)
   - code       → human readable "BNK-001" স্ট্রিং, শুধু display-এর জন্য
--------------------------------------------------------------------- */

// Backend (snake_case) → Frontend (camelCase)
const bankFromApi = (b) => ({
  id: b.id,
  code: b.code,
  bankName: b.bank_name,
  branch: b.branch || "",
  accountName: b.account_name,
  accountNumber: b.account_number,
  routingNumber: b.routing_number || "",
  type: b.type,
  openingBalance: Number(b.opening_balance) || 0,
  balance: Number(b.balance) || 0,
  status: b.status,
  branchId: b.branch_id,
});

// Frontend (camelCase) → Backend (snake_case)
const bankToApi = (form) => {
  const payload = {
    bank_name: form.bankName,
    branch: form.branch,
    account_name: form.accountName,
    account_number: form.accountNumber,
    routing_number: form.routingNumber,
    type: form.type,
  };
  if (form.openingBalance !== undefined) payload.opening_balance = Number(form.openingBalance) || 0;
  if (form.balance !== undefined) payload.balance = Number(form.balance) || 0;
  if (form.status !== undefined) payload.status = form.status;
  if (form.branchId !== undefined) payload.branch_id = form.branchId;
  return payload;
};

// ১. ব্যাংক লিস্ট আনা (filters: type, status, search)
// Controller@index রিটার্ন করে { banks, summary } — data.data নয়, তাই এখানে
// সেই শেপকে normalize করে { data, summary } আকারে ফেরত দেওয়া হচ্ছে।
export const fetchBanks = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/banks${queryString ? `?${queryString}` : ""}`;
  const res = await request(endpoint, { method: "GET" });
  return {
    data: (res.banks || []).map(bankFromApi),
    summary: res.summary,
  };
};

// ২. একটি নির্দিষ্ট ব্যাংক অ্যাকাউন্ট আনা
export const fetchBank = async (id) => {
  const res = await request(`/banks/${id}`, { method: "GET" });
  return bankFromApi(res);
};

// ৩. নতুন ব্যাংক অ্যাকাউন্ট তৈরি করা
export const createBank = async (bankData) => {
  const res = await request("/banks", {
    method: "POST",
    body: JSON.stringify(bankToApi(bankData)),
  });
  return bankFromApi(res);
};

// ৪. ব্যাংক অ্যাকাউন্ট আপডেট করা (id অবশ্যই numeric primary key হতে হবে, code নয়)
export const updateBank = async (id, bankData) => {
  const res = await request(`/banks/${id}`, {
    method: "PUT",
    body: JSON.stringify(bankToApi(bankData)),
  });
  return bankFromApi(res);
};

// ৫. ব্যাংক অ্যাকাউন্ট ডিলিট করা (id অবশ্যই numeric primary key হতে হবে, code নয়)
export const deleteBank = async (id) => {
  return request(`/banks/${id}`, {
    method: "DELETE",
  });
};