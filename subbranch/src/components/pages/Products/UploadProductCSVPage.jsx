import React, { useState, useRef } from "react";
import { Download, HelpCircle, Loader2, CheckCircle2, AlertCircle, Upload } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { FieldLabel } from "../../shared/FormElements";
import { COLORS, PETALS, FONTS } from "../../../constants";

// API Services (downloadDemoCSV ইমপোর্ট যুক্ত করা হয়েছে)
import {
 uploadProductCsv
  
} from "../../../api/productService";

export function UploadProductCSVPage() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloadingDemo, setIsDownloadingDemo] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: '' }

  // File Input Ref (ফাইল রিসেট নিশ্চিত করার জন্য)
  const fileInputRef = useRef(null);

  // ১. ফাইল ক্লিয়ার করার জন্য হেল্পার ফাংশন
  const resetFileInput = () => {
    setFile(null);
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ২. ফাইল সিলেক্ট হ্যান্ডলার
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith(".csv")) {
        setStatus({ type: "error", message: "Please select a valid .csv file." });
        resetFileInput();
        return;
      }
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setStatus(null);
    }
  };

  // ৩. CSV ফাইল ব্যাকএন্ডে আপলোড
  const handleUpload = async () => {
    if (!file) {
      setStatus({ type: "error", message: "Please select a CSV file first!" });
      return;
    }

    setIsUploading(true);
    setStatus(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      await uploadProductCsv(formData);

      setStatus({
        type: "success",
        message: "Products imported successfully from CSV!",
      });

      // Reset File Input
      resetFileInput();
    } catch (err) {
      console.error("CSV Upload Error:", err);
      setStatus({
        type: "error",
        message: err.message || "Failed to upload CSV file. Please check format.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // ৪. ডেমো CSV ডাউনলোড
  const handleDownloadDemo = async () => {
    setIsDownloadingDemo(true);
    try {
      if (typeof downloadDemoCSV === "function") {
        await downloadDemoCSV();
      } else {
        // Fallback sample download
        const sampleCsv = "title,purchase_price,selling_price,category,brand,stock_qty,barcode\nSample Product,100,150,General,BrandX,10,123456789";
        const blob = new Blob([sampleCsv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "product_import_sample.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error("Demo CSV Error:", err);
      setStatus({
        type: "error",
        message: "Failed to download sample CSV: " + (err.message || "Unknown error"),
      });
    } finally {
      setIsDownloadingDemo(false);
    }
  };

  // ৫. বিদ্যমান প্রোডাক্টের CSV এক্সপোর্ট/ডাউনলোড
  const handleExportExisting = async () => {
    setIsExporting(true);
    try {
      if (typeof exportProductsCSV === "function") {
        await exportProductsCSV();
      } else {
        setStatus({ type: "error", message: "Export service API is not connected." });
      }
    } catch (err) {
      console.error("Export Error:", err);
      setStatus({
        type: "error",
        message: "Failed to export existing products: " + (err.message || "Unknown error"),
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5 items-stretch">
      {/* LEFT: file select + upload */}
      <div
        className="relative rounded-2xl p-6 pt-7 border overflow-hidden flex flex-col justify-between"
        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
      >
        <ScallopBorder id="scallop-csv-left" colors={PETALS} />

        <div>
          <FieldLabel>Select File</FieldLabel>
          <label
            className="flex items-center gap-2 rounded-lg border cursor-pointer overflow-hidden text-[12.5px] font-medium mb-4 max-w-md transition-opacity hover:opacity-90"
            style={{
              borderColor: COLORS.line,
              backgroundColor: COLORS.paper,
              color: COLORS.muted,
            }}
          >
            <span
              className="px-3 py-2.5 font-semibold shrink-0"
              style={{ backgroundColor: COLORS.line, color: COLORS.ink }}
            >
              Choose File
            </span>
            <span className="pr-3 truncate">{fileName || "No file chosen"}</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {/* Status Alert Notification */}
          {status && (
            <div
              className={`mb-4 p-3 rounded-lg text-[12.5px] flex items-center gap-2 ${
                status.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}
            >
              {status.type === "success" ? (
                <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle size={16} className="shrink-0 text-rose-600" />
              )}
              <span>{status.message}</span>
            </div>
          )}
        </div>

        <div>
          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading || !file}
            className="text-white font-semibold text-[13px] px-5 py-2.5 rounded-lg shadow-md disabled:opacity-40 flex items-center gap-2 transition-opacity hover:opacity-90"
            style={{
              backgroundColor: COLORS.purple,
              boxShadow: `0 4px 10px ${COLORS.purple}40`,
            }}
          >
            {isUploading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={14} />
                Upload
              </>
            )}
          </button>
        </div>
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

        {/* Demo CSV Download Button */}
        <button
          type="button"
          onClick={handleDownloadDemo}
          disabled={isDownloadingDemo}
          className="w-full text-white font-bold text-[13px] py-3 rounded-lg flex items-center justify-center gap-2 shadow-md transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{
            backgroundColor: COLORS.peacock,
            boxShadow: `0 4px 10px ${COLORS.peacock}40`,
          }}
        >
          {isDownloadingDemo ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Download size={14} />
          )}
          Product Demo CSV Download
        </button>

        {/* Existing Products CSV Download Button */}
        <button
          type="button"
          onClick={handleExportExisting}
          disabled={isExporting}
          className="w-full text-white font-bold text-[13px] py-3 rounded-lg flex items-center justify-center gap-2 shadow-md transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{
            backgroundColor: COLORS.forest,
            boxShadow: `0 4px 10px ${COLORS.forest}40`,
          }}
        >
          {isExporting ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Download size={14} />
          )}
          Existing all Product CSV Download
        </button>
      </div>
    </div>
  );
}