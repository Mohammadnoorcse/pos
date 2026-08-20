import React, { useState, useEffect } from "react";
import { KpiCard } from "../../shared";
import { SalesChart } from "./SalesChart";
import { StockAlertSection } from "./StockAlertSection";
import { TransactionTable } from "./TransactionTable";
import { BranchFilter } from "./BranchFilter";
import { DateRangeFilter } from "./DateRangeFilter";
import { COLORS, FONTS } from "../../../constants";
import { ShoppingCart, Package, Wallet, TrendingUp, AlertCircle, Landmark, Users } from "lucide-react";
import { fetchDashboardKpis } from "../../../api/dashboardService";

function taka(n) {
  const num = Number(n) || 0;
  return "৳" + num.toLocaleString("en-BD");
}

function buildKpiData(kpis) {
  if (!kpis) return [];
  return [
    { label: "Total Sales", value: taka(kpis.total_sales), icon: ShoppingCart, color: COLORS.vermillion ?? "#C1440E" },
    { label: "Instant Paid", value: taka(kpis.instant_paid), icon: Wallet, color: "#1E9E5A" },
    { label: "Total Due", value: taka(kpis.total_due), icon: AlertCircle, color: "#B8720A" },
    { label: "Due Collected", value: taka(kpis.due_paid), icon: TrendingUp, color: "#3B6FA0" },
    { label: "Total Expense", value: taka(kpis.total_expense), icon: Package, color: COLORS.magenta ?? "#9B2954" },
    { label: "Total Return", value: taka(kpis.total_return), icon: Landmark, color: "#6B5FA8" },
    { label: "Stock Alerts", value: kpis.stock_alert_qty, icon: AlertCircle, color: "#C1440E" },
    { label: "Transactions", value: kpis.transaction_count, icon: Users, color: "#1E9E5A" },
  ];
}

const todayStr = new Date().toISOString().slice(0, 10);

export function DashboardPage() {
  const [branchId, setBranchId] = useState(null);
  const [range, setRange] = useState({ from: todayStr, to: todayStr });

  const [kpis, setKpis] = useState(null);
  const [kpiLoading, setKpiLoading] = useState(true);
  const [kpiError, setKpiError] = useState(null);

  const loadKpis = async () => {
    try {
      setKpiLoading(true);
      setKpiError(null);
      const data = await fetchDashboardKpis({ branch_id: branchId, from: range.from, to: range.to });
      console.log('kps',data);
      setKpis(data);
    } catch (err) {
      console.error("Error loading KPIs:", err);
      setKpiError("KPI ডাটা লোড করতে সমস্যা হয়েছে।");
    } finally {
      setKpiLoading(false);
    }
  };

  useEffect(() => {
    loadKpis();
  }, [branchId, range.from, range.to]);

  const kpiData = buildKpiData(kpis);

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-bold text-lg flex items-center gap-2" style={{ fontFamily: FONTS.HEAD }}>
            <span>📊</span> Daily Sales & Return Summary
          </h1>
          <p className="text-[12.5px]" style={{ color: COLORS.muted }}>
            সব শাখার হালনাগাদ তথ্য
          </p>
        </div>
        <div className="flex gap-2.5">
          <BranchFilter branchId={branchId} onChange={setBranchId} />
          <DateRangeFilter from={range.from} to={range.to} onChange={setRange} />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiLoading ? (
          <div className="col-span-4 text-center py-6 text-slate-500 text-[12.5px]">লোড হচ্ছে...</div>
        ) : kpiError ? (
          <div className="col-span-4 text-center py-6 text-red-500 text-[12.5px]">{kpiError}</div>
        ) : (
          kpiData.map((item, i) => (
            <KpiCard key={item.label} item={item} patternId={`scallop-${i}`} />
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4">
        <SalesChart branchId={branchId} from={range.from} to={range.to} />
        <StockAlertSection branchId={branchId} />
      </div>

      <TransactionTable branchId={branchId} limit={10} />
    </>
  );
}