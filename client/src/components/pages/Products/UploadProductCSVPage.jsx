import React from "react";
import { Download, HelpCircle } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { FieldLabel } from "../../shared/FormElements";
import { COLORS, PETALS, FONTS } from "../../../constants";

export function UploadProductCSVPage() {
  const [fileName, setFileName] = React.useState("");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5 items-stretch">
      {/* LEFT: file select + upload */}
      <div
        className="relative rounded-2xl p-6 pt-7 border overflow-hidden"
        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
      >
        <ScallopBorder id="scallop-csv-left" colors={PETALS} />
        <FieldLabel>Select File</FieldLabel>
        <label
          className="flex items-center gap-2 rounded-lg border cursor-pointer overflow-hidden text-[12.5px] font-medium mb-4 max-w-md"
          style={{
            borderColor: COLORS.line,
            backgroundColor: COLORS.paper,
            color: COLORS.muted,
          }}
        >
          <span
            className="px-3 py-2.5 font-semibold"
            style={{ backgroundColor: COLORS.line, color: COLORS.ink }}
          >
            Choose File
          </span>
          <span className="pr-3 truncate">{fileName || "No file chosen"}</span>
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
          />
        </label>

        <button
          className="text-white font-semibold text-[13px] px-5 py-2.5 rounded-lg shadow-md"
          style={{
            backgroundColor: COLORS.purple,
            boxShadow: `0 4px 10px ${COLORS.purple}40`,
          }}
        >
          Upload
        </button>
      </div>

      {/* RIGHT: procedure + downloads */}
      <div
        className="relative rounded-2xl p-6 pt-7 border overflow-hidden flex flex-col gap-3"
        style={{ backgroundColor: COLORS.paper, borderColor: COLORS.line }}
      >
        <ScallopBorder id="scallop-csv-right" colors={PETALS} />
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <HelpCircle size={15} style={{ color: COLORS.peacock }} />
          <span
            className="font-bold text-[13.5px]"
            style={{ color: COLORS.peacock, fontFamily: FONTS.HEAD }}
          >
            Procedure
          </span>
        </div>

        <button
          className="w-full text-white font-bold text-[13px] py-3 rounded-lg flex items-center justify-center gap-2 shadow-md"
          style={{
            backgroundColor: COLORS.peacock,
            boxShadow: `0 4px 10px ${COLORS.peacock}40`,
          }}
        >
          <Download size={14} /> Product Demo CSV Download
        </button>

        <button
          className="w-full text-white font-bold text-[13px] py-3 rounded-lg flex items-center justify-center gap-2 shadow-md"
          style={{
            backgroundColor: COLORS.forest,
            boxShadow: `0 4px 10px ${COLORS.forest}40`,
          }}
        >
          <Download size={14} /> Existing all Product CSV Download
        </button>
      </div>
    </div>
  );
}