import React from "react";
import { ChevronDown } from "lucide-react";
import { COLORS, FONTS } from "../../constants";

export function FieldLabel({ children, required }) {
  return (
    <label
      className="block text-[12.5px] font-semibold mb-1.5"
      style={{ color: COLORS.ink, fontFamily: FONTS.BODY }}
    >
      {required && <span style={{ color: COLORS.vermillion }}>*</span>}
      {children}
    </label>
  );
}

export function TextField({
  label,
  required,
  placeholder,
  defaultValue,
  type = "text",
}) {
  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none transition-colors focus:ring-2"
        style={{
          backgroundColor: COLORS.paper,
          borderColor: COLORS.line,
          color: COLORS.ink,
          fontFamily: FONTS.BODY,
        }}
        onFocus={(e) => (e.target.style.borderColor = COLORS.magenta)}
        onBlur={(e) => (e.target.style.borderColor = COLORS.line)}
      />
    </div>
  );
}

export function SelectField({ label, required, placeholder, options = [] }) {
  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      <div className="relative">
        <select
          defaultValue=""
          className="w-full appearance-none rounded-lg px-3.5 py-2.5 text-[13px] border outline-none cursor-pointer"
          style={{
            backgroundColor: COLORS.paper,
            borderColor: COLORS.line,
            color: COLORS.ink,
            fontFamily: FONTS.BODY,
          }}
        >
          <option value="" disabled style={{ color: COLORS.muted }}>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: COLORS.muted }}
        />
      </div>
    </div>
  );
}

export function RadioOption({
  name,
  label,
  value,
  checked,
  onChange,
  dotColor,
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <span
        className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
        style={{ borderColor: checked ? dotColor : COLORS.line }}
        onClick={() => onChange(value)}
      >
        {checked && (
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: dotColor }}
          />
        )}
      </span>
      <span
        className="text-[13px] font-medium"
        style={{ color: checked ? COLORS.ink : COLORS.muted }}
        onClick={() => onChange(value)}
      >
        {label}
      </span>
      <input
        type="radio"
        name={name}
        className="sr-only"
        checked={checked}
        onChange={() => onChange(value)}
      />
    </label>
  );
}