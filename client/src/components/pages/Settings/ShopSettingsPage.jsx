import React from "react";
import { Globe, UploadCloud, ImageIcon, X } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { TextField, FieldLabel } from "../../shared/FormElements";
import { COLORS, PETALS, FONTS } from "../../../constants";

export function ShopSettingsPage() {
  return (
    <div
      className="relative rounded-2xl border overflow-hidden"
      style={{ backgroundColor: "transparent" }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-5 items-start">
        {/* LEFT: main form card */}
        <div
          className="relative rounded-2xl p-6 pt-7 border overflow-hidden"
          style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
        >
          <ScallopBorder id="scallop-settings-form" colors={PETALS} />
          <h2
            className="font-bold text-[16px] mb-5"
            style={{ fontFamily: FONTS.HEAD }}
          >
            Shop Setting &amp; Others
          </h2>

          <div className="space-y-5">
            <TextField
              label="Business / Shop Name"
              required
              defaultValue="My Business"
            />
            <TextField label="Proprietor" defaultValue="Sohag Ahmed Moon" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <TextField
                label="Business / Shop Email"
                required
                type="email"
                defaultValue="Mybusines@gmail.com"
              />
              <TextField
                label="Business / Shop Phone"
                required
                defaultValue="+8801676526444, +8801954444608"
              />
            </div>

            <TextField
              label="Business / Address"
              required
              defaultValue="Shop-1205, Saha Ali Plaza, Mirpur-10, Dhaka-1216"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <TextField label="BIN" defaultValue="551148758254129" />
              <TextField label="TIN" defaultValue="496252834961" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <TextField label="NID" defaultValue="77768547125" />
              <TextField label="Trade License" defaultValue="15322390799" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <FieldLabel>Business / Shop Website</FieldLabel>
                <div
                  className="flex items-center gap-2 rounded-lg px-3.5 py-2.5 border"
                  style={{
                    backgroundColor: COLORS.paper,
                    borderColor: COLORS.line,
                  }}
                >
                  <Globe size={14} style={{ color: COLORS.muted }} />
                  <input
                    placeholder="https://yourshop.com"
                    className="bg-transparent outline-none flex-1 text-[13px]"
                    style={{
                      color: COLORS.ink,
                      fontFamily: FONTS.BODY,
                    }}
                  />
                </div>
              </div>
              <div>
                <FieldLabel>Business / Shop Logo</FieldLabel>
                <div
                  className="flex items-center gap-2 rounded-lg px-3.5 py-2.5 border border-dashed cursor-pointer"
                  style={{
                    backgroundColor: COLORS.marigoldTint,
                    borderColor: COLORS.marigold,
                    color: COLORS.rust,
                  }}
                >
                  <UploadCloud size={14} />
                  <span className="text-[12.5px] font-semibold">Upload new logo</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                className="text-white font-semibold text-[13px] px-5 py-2.5 rounded-lg shadow-md"
                style={{
                  backgroundColor: COLORS.forest,
                  boxShadow: `0 4px 10px ${COLORS.forest}40`,
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: logo card + points + save */}
        <div className="space-y-4">
          <div
            className="relative rounded-2xl border overflow-hidden"
            style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
          >
            <ScallopBorder id="scallop-settings-logo" colors={PETALS} />
            <div className="flex flex-col items-center justify-center gap-3 pt-8 pb-5 px-5">
              <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center border"
                style={{
                  backgroundColor: COLORS.paper,
                  borderColor: COLORS.line,
                  color: COLORS.muted,
                }}
              >
                <ImageIcon size={30} />
              </div>
              <div
                className="text-[13px] font-bold"
                style={{
                  color: COLORS.ink,
                  fontFamily: FONTS.HEAD,
                }}
              >
                My Business Logo
              </div>
            </div>
            <button
              className="w-full flex items-center justify-center gap-1.5 text-white font-semibold text-[12.5px] py-2.5"
              style={{ backgroundColor: COLORS.vermillion }}
            >
              <X size={13} /> Remove Shop Logo
            </button>

            <div
              className="p-5 space-y-2"
              style={{ borderTop: `1px dashed ${COLORS.line}` }}
            >
              <div className="text-[12.5px]">
                <span className="font-semibold" style={{ color: COLORS.ink }}>
                  Start Date:{" "}
                </span>
                <span
                  style={{
                    color: COLORS.muted,
                    fontFamily: FONTS.MONO,
                  }}
                >
                  10 Jul, 2023
                </span>
              </div>
              <div className="text-[12.5px]">
                <span className="font-semibold" style={{ color: COLORS.ink }}>
                  Business Code:{" "}
                </span>
                <span
                  style={{
                    color: COLORS.muted,
                    fontFamily: FONTS.MONO,
                  }}
                >
                  230710646
                </span>
              </div>
              <div
                className="text-[12.5px] font-semibold"
                style={{ color: COLORS.vermillion }}
              >
                Monthly Renew Charge:{" "}
                <span style={{ fontFamily: FONTS.MONO }}>৳3.00</span>
              </div>
            </div>
          </div>

          <div
            className="relative rounded-2xl p-5 pt-6 border overflow-hidden"
            style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
          >
            <ScallopBorder id="scallop-settings-points" colors={PETALS} />
            <FieldLabel>Do You Use Customer Points?</FieldLabel>
            <select
              className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none mb-4"
              style={{
                backgroundColor: COLORS.paper,
                borderColor: COLORS.line,
                color: COLORS.ink,
                fontFamily: FONTS.BODY,
              }}
              defaultValue="No"
            >
              <option>No</option>
              <option>Yes</option>
            </select>
            <div className="flex justify-end">
              <button
                className="text-white font-semibold text-[13px] px-5 py-2.5 rounded-lg shadow-md"
                style={{
                  backgroundColor: COLORS.forest,
                  boxShadow: `0 4px 10px ${COLORS.forest}40`,
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}