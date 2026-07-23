import React from "react";
import { KpiCard } from "../../shared";
import { SalesChart } from "./SalesChart";
import { StockAlertSection } from "./StockAlertSection";
import { TransactionTable } from "./TransactionTable";
import { COLORS, FONTS, KPI_DATA } from "../../../constants";
import { ChevronDown } from "lucide-react";

export function DashboardPage() {
  return (
    <>
      {/* PANEL HEAD */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1
            className="font-bold text-lg flex items-center gap-2"
            style={{ fontFamily: FONTS.HEAD }}
          >
            <span>📊</span> Daily Sales & Return Summary
          </h1>
          <p className="text-[12.5px]" style={{ color: COLORS.muted }}>
            সব শাখার আজকের হালনাগাদ তথ্য
          </p>
        </div>
        <div className="flex gap-2.5">
          <div
            className="rounded-lg px-3.5 py-2 text-[12.5px] font-semibold flex items-center gap-2 border"
            style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
          >
            All Branch <ChevronDown size={13} />
          </div>
          <div
            className="rounded-lg px-3.5 py-2 text-[12.5px] font-semibold border"
            style={{
              backgroundColor: COLORS.panel,
              borderColor: COLORS.line,
              fontFamily: FONTS.MONO,
            }}
          >
            📅 04/19/2025
          </div>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {KPI_DATA.map((item, i) => (
          <KpiCard key={item.label} item={item} patternId={`scallop-${i}`} />
        ))}
      </div>

      {/* SPLIT: chart + stock alert */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4">
        <SalesChart />
        <StockAlertSection />
      </div>

      {/* RECENT TRANSACTIONS */}
      <TransactionTable />
    </>
  );
}