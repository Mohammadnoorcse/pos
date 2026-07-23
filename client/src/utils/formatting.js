import { COLORS } from "../constants";

export function formatCurrency(value) {
  return Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function todayISO() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export function stockAlertSeverity(item) {
  if (item.currentStock <= 0) {
    return {
      color: COLORS.vermillion,
      bg: COLORS.vermillionTint,
      label: "Out of stock",
    };
  }
  if (item.currentStock <= item.alertQty) {
    return { color: COLORS.rust, bg: COLORS.rustTint, label: "At alert line" };
  }
  return {
    color: COLORS.forestDark,
    bg: COLORS.forestTint,
    label: "OK",
  };
}