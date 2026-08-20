import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Loader2, Store } from "lucide-react";
import { COLORS, FONTS } from "../../../constants";
import { fetchBranchesLite } from "../../../api/dashboardService";

export function BranchFilter({ branchId, onChange }) {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    fetchBranchesLite()
      .then((data) => setBranches(data?.data || []))
      .catch((err) => console.error("Error loading branches:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = branches.find((b) => String(b.id) === String(branchId));
  const label = branchId ? (selected?.name ?? "...") : "All Branch";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="rounded-lg px-3.5 py-2 text-[12.5px] font-semibold flex items-center gap-2 border"
        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line, fontFamily: FONTS.HEAD }}
      >
        <Store size={13} />
        {label}
        <ChevronDown size={13} />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-1.5 w-56 rounded-lg border shadow-lg z-20 py-1.5 max-h-72 overflow-y-auto"
          style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-4 text-slate-500 gap-2 text-[12px]">
              <Loader2 className="animate-spin" size={14} /> লোড হচ্ছে...
            </div>
          ) : (
            <>
              <button
                onClick={() => { onChange(null); setOpen(false); }}
                className="w-full text-left px-3.5 py-2 text-[12.5px] font-semibold hover:bg-black/[0.03] transition-colors"
                style={{ color: !branchId ? COLORS.peacock : COLORS.ink }}
              >
                All Branch
              </button>
              {branches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => { onChange(b.id); setOpen(false); }}
                  className="w-full text-left px-3.5 py-2 text-[12.5px] font-semibold hover:bg-black/[0.03] transition-colors"
                  style={{ color: String(b.id) === String(branchId) ? COLORS.peacock : COLORS.ink }}
                >
                  {b.name}
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}