// এই sub-branch build টা একটা নির্দিষ্ট branch এর জন্য। branch id দুইভাবে আসতে পারে:
// ১. লগইন করা user এর নিজের branch_id (localStorage এ "user") — অ্যাপের বাকি
//    জায়গায় (যেমন SellPage) এভাবেই ধরা হয়, তাই এটাকেই প্রথম priority দেওয়া হলো।
// ২. .env এর VITE_BRANCH_ID — user object এ branch_id না থাকলে fallback হিসেবে।
export function getSubBranchId() {
  try {
    const raw = localStorage.getItem("user");
    if (raw) {
      const user = JSON.parse(raw);
      const fromUser = user?.branch_id ?? user?.branch?.id ?? null;
      if (fromUser) return Number(fromUser);
    }
  } catch {
    // ignore, fall through to env
  }
  return import.meta.env.VITE_BRANCH_ID ? Number(import.meta.env.VITE_BRANCH_ID) : null;
}

export const SUB_BRANCH_ID = getSubBranchId();

