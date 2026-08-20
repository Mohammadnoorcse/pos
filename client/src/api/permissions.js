/**
 * পারমিশন সংক্রান্ত সব লজিক এক জায়গায়।
 * ব্যাকএন্ড থেকে আসা flat permission-key লিস্ট এখানে localStorage-এ রাখা হয়
 * (owner হলে ব্যাকএন্ড ["*"] পাঠায় — তার মানে সব পারমিশন আছে)।
 */

const PERMISSIONS_KEY = "permissions";

/** লগইন/me রেসপন্স থেকে পাওয়া permissions অ্যারে সেভ করা */
export function storePermissions(permissions) {
  localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(permissions || []));
}

/** সেভ করা permissions অ্যারে পড়া */
export function getStoredPermissions() {
  try {
    const raw = localStorage.getItem(PERMISSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearStoredPermissions() {
  localStorage.removeItem(PERMISSIONS_KEY);
}

/**
 * একটা নির্দিষ্ট permission key ইউজারের আছে কিনা।
 * - key না থাকলে (undefined) ধরে নেওয়া হয় এটা "ungated" — লগইন করা যে কেউ দেখতে পারবে।
 * - "*" থাকলে (owner) সব পারমিশন আছে ধরা হয়।
 */
export function hasPermission(userPermissions, key) {
  if (!key) return true;
  if (!Array.isArray(userPermissions)) return false;
  return userPermissions.includes("*") || userPermissions.includes(key);
}

/** একগুচ্ছ key-এর মধ্যে অন্তত একটা থাকলেই true (nav group visible রাখতে কাজে লাগে) */
export function hasAnyPermission(userPermissions, keys = []) {
  if (!keys.length) return true;
  return keys.some((k) => hasPermission(userPermissions, k));
}

/**
 * নির্দিষ্ট কিছু মেনু/পেজ শুধু owner-এর জন্য (যেমন Role/Permission ম্যানেজমেন্ট)।
 * ক্যাটালগে এদের কোনো permission-key নেই, তাই user_type দিয়ে গার্ড করা হয়।
 */
export function isOwner(user) {
  return user?.user_type === "owner";
}

/** একটা nav item (permission / ownerOnly রুল সহ) বর্তমান ইউজার দেখতে পারবে কিনা */
export function canSeeNavItem(item, { permissions, user }) {
  if (item.ownerOnly) return isOwner(user);
  if (item.permission) return hasPermission(permissions, item.permission);
  return true; // ungated item — লগইন করা সবাই দেখবে
}