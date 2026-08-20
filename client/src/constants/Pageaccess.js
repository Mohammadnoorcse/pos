import { NAV_ITEMS } from "./navItems";
import { ACC_NAV_ITEMS } from "./AccNavItems";
import { SUPPLIER_NAV_ITEMS } from "./SupplierNavItems";

/**
 * nav config গুলো থেকে { [page]: { permission?, ownerOnly? } } ম্যাপ বানায়।
 * এটাই "single source of truth" — Sidebar-এ যা visible/hidden, ঠিক একই নিয়মে
 * সরাসরি activePage সেট করে (URL হ্যাক করে বা অন্য কোনোভাবে) কেউ যেন
 * না-দেখা পাতায় ঢুকতে না পারে, সেটা Dashboard.jsx-এ এই ম্যাপ দিয়েই আটকানো হয়।
 */
function buildPageAccessMap(...navSources) {
  const map = {};

  const visit = (item) => {
    if (item.page) {
      map[item.page] = {
        permission: item.permission,
        ownerOnly: !!item.ownerOnly,
      };
    }
    if (item.children) item.children.forEach(visit);
  };

  navSources.forEach((items) => items.forEach(visit));
  return map;
}

export const PAGE_ACCESS_MAP = buildPageAccessMap(NAV_ITEMS, ACC_NAV_ITEMS, SUPPLIER_NAV_ITEMS);

/**
 * pages যেগুলো কোনো nav-এ নেই (যেমন detail/sub-page: role-permissions,
 * branch-role-permissions-detail, sell ইত্যাদি) কিন্তু গার্ড করা দরকার —
 * এগুলো ম্যানুয়ালি এখানে যোগ করা।
 */
Object.assign(PAGE_ACCESS_MAP, {
  "role-permissions": { ownerOnly: true },
  "branch-role-permissions-detail": { ownerOnly: true },
  "staff-detail": { permission: "admin.staff.view" },
  sell: { permission: "branch.sell" },
});