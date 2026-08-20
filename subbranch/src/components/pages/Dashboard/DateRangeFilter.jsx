import React, { useState, useRef, useEffect } from "react";
import { Calendar } from "lucide-react";
import { COLORS, FONTS } from "../../../constants";

function fmt(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

// quick presets — emits { from, to } as YYYY-MM-DD strings
function presetRange(key) {
  const today = new Date();
  const toStr = (d) => d.toISOString().slice(0, 10);
  const start = new Date(today);

  switch (key) {
    case "today":
      return { from: toStr(today), to: toStr(today) };
    case "this_week": {
      const day = today.getDay() || 7;
      start.setDate(today.getDate() - day + 1);
      return { from: toStr(start), to: toStr(today) };
    }
    case "this_month":
      start.setDate(1);
      return { from: toStr(start), to: toStr(today) };
    case "last_7":
      start.setDate(today.getDate() - 6);
      return { from: toStr(start), to: toStr(today) };
    case "last_30":
      start.setDate(today.getDate() - 29);
      return { from: toStr(start), to: toStr(today) };
    default:
      return { from: toStr(today), to: toStr(today) };
  }
}

const PRESETS = [
  { key: "today", label: "আজ" },
  { key: "this_week", label: "এই সপ্তাহ" },
  { key: "this_month", label: "এই মাস" },
  { key: "last_7", label: "গত ৭ দিন" },
  { key: "last_30", label: "গত ৩০ দিন" },
];

export function DateRangeFilter({ from, to, onChange }) {
  const [open, setOpen] = useState(false);
  const [draftFrom, setDraftFrom] = useState(from || "");
  const [draftTo, setDraftTo] = useState(to || "");
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setDraftFrom(from || "");
    setDraftTo(to || "");
  }, [from, to]);

  const applyPreset = (key) => {
    const range = presetRange(key);
    onChange(range);
    setOpen(false);
  };

  const applyCustom = () => {
    if (draftFrom && draftTo) {
      onChange({ from: draftFrom, to: draftTo });
      setOpen(false);
    }
  };

  const label = from && to ? `${fmt(from)} — ${fmt(to)}` : "আজ";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="rounded-lg px-3.5 py-2 text-[12.5px] font-semibold border flex items-center gap-2"
        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line, fontFamily: FONTS.MONO }}
      >
        <Calendar size={13} />
        {label}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-1.5 w-72 rounded-lg border shadow-lg z-20 p-3"
          style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
        >
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {PRESETS.map((p) => (
              <button
                key={p.key}
                onClick={() => applyPreset(p.key)}
                className="text-[12px] font-semibold px-2.5 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: COLORS.purpleTint, color: COLORS.purple }}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="border-t pt-3" style={{ borderColor: COLORS.line }}>
            <div className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: COLORS.muted }}>
              Custom Range
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1">
                <label className="text-[10.5px]" style={{ color: COLORS.muted }}>From</label>
                <input
                  type="date"
                  value={draftFrom}
                  onChange={(e) => setDraftFrom(e.target.value)}
                  className="w-full text-[12px] px-2 py-1.5 rounded-lg border mt-0.5"
                  style={{ borderColor: COLORS.line }}
                />
              </div>
              <div className="flex-1">
                <label className="text-[10.5px]" style={{ color: COLORS.muted }}>To</label>
                <input
                  type="date"
                  value={draftTo}
                  onChange={(e) => setDraftTo(e.target.value)}
                  className="w-full text-[12px] px-2 py-1.5 rounded-lg border mt-0.5"
                  style={{ borderColor: COLORS.line }}
                />
              </div>
            </div>
            <button
              onClick={applyCustom}
              disabled={!draftFrom || !draftTo}
              className="w-full text-white font-semibold text-[12px] px-3 py-2 rounded-lg disabled:opacity-40"
              style={{ backgroundColor: COLORS.peacock }}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}