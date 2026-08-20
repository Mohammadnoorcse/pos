import React from "react";
import { X, ScanLine, CameraOff, Loader2 } from "lucide-react";

/**
 * QRScannerModal
 * ----------------------------------------------------------------------
 * Camera-based QR / barcode scanner for the POS Sell page.
 *
 * Uses the browser-native BarcodeDetector API (supported on Chrome /
 * Edge / most Android WebViews — the typical environment for POS
 * touchscreen terminals). If the API or a camera isn't available,
 * the modal shows a clear message instead of silently failing.
 *
 * Props:
 *  - open: boolean
 *  - onClose: () => void
 *  - onDetect: (value: string) => void   // called once per successful scan
 */
export default function QRScannerModal({ open, onClose, onDetect }) {
  const videoRef = React.useRef(null);
  const streamRef = React.useRef(null);
  const rafRef = React.useRef(null);
  const detectorRef = React.useRef(null);
  const lastValueRef = React.useRef(null);
  const lastTimeRef = React.useRef(0);

  const [status, setStatus] = React.useState("init"); // init | scanning | unsupported | denied | error
  const [errorMsg, setErrorMsg] = React.useState("");

  React.useEffect(() => {
    if (!open) return;

    let cancelled = false;

    const stop = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };

    const start = async () => {
      setStatus("init");
      setErrorMsg("");

      if (!("BarcodeDetector" in window)) {
        setStatus("unsupported");
        return;
      }

      try {
        detectorRef.current = new window.BarcodeDetector({
          formats: [
            "qr_code",
            "ean_13",
            "ean_8",
            "code_128",
            "code_39",
            "upc_a",
            "upc_e",
          ],
        });
      } catch {
        setStatus("unsupported");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setStatus("scanning");
        tick();
      } catch (err) {
        if (err && err.name === "NotAllowedError") {
          setStatus("denied");
        } else {
          setStatus("error");
          setErrorMsg(err?.message || "ক্যামেরা চালু করা যায়নি");
        }
      }
    };

    const tick = async () => {
      if (cancelled || !videoRef.current || !detectorRef.current) return;
      try {
        const codes = await detectorRef.current.detect(videoRef.current);
        if (codes && codes.length > 0) {
          const value = codes[0].rawValue;
          const now = Date.now();
          // Debounce duplicate reads of the same code within 1.5s
          if (value && (value !== lastValueRef.current || now - lastTimeRef.current > 1500)) {
            lastValueRef.current = value;
            lastTimeRef.current = now;
            onDetect?.(value);
          }
        }
      } catch {
        // Detection errors on a single frame are non-fatal; keep scanning.
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    start();

    return () => {
      cancelled = true;
      stop();
    };
  }, [open, onDetect]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center"
      style={{ background: "rgba(15,15,20,0.72)" }}
      onClick={onClose}
    >
      <div
        className="w-[92vw] max-w-[420px] rounded-2xl overflow-hidden bg-white flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2 font-bold text-[14px]">
            <ScanLine size={18} />
            QR / Barcode স্ক্যান করুন
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-black/5"
            style={{ minWidth: 40, minHeight: 40 }}
            aria-label="Close scanner"
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative bg-black aspect-square flex items-center justify-center">
          {status === "scanning" && (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted
              playsInline
            />
          )}

          {status === "init" && (
            <div className="text-white flex flex-col items-center gap-2 text-[13px]">
              <Loader2 size={22} className="animate-spin" />
              ক্যামেরা চালু হচ্ছে...
            </div>
          )}

          {status === "scanning" && (
            <div
              className="absolute inset-8 rounded-xl border-2 pointer-events-none"
              style={{ borderColor: "rgba(255,255,255,0.85)" }}
            />
          )}

          {status === "unsupported" && (
            <div className="text-white flex flex-col items-center gap-2 text-[13px] px-6 text-center">
              <CameraOff size={22} />
              এই ব্রাউজারে ক্যামেরা স্ক্যানার সাপোর্ট করে না। অনুগ্রহ করে Chrome
              বা Android WebView ব্যবহার করুন, অথবা হার্ডওয়্যার বারকোড
              স্ক্যানার দিয়ে সরাসরি ইনপুট বক্সে স্ক্যান করুন।
            </div>
          )}

          {status === "denied" && (
            <div className="text-white flex flex-col items-center gap-2 text-[13px] px-6 text-center">
              <CameraOff size={22} />
              ক্যামেরা পারমিশন দেওয়া হয়নি। ব্রাউজার সেটিংস থেকে ক্যামেরা এক্সেস
              চালু করুন।
            </div>
          )}

          {status === "error" && (
            <div className="text-white flex flex-col items-center gap-2 text-[13px] px-6 text-center">
              <CameraOff size={22} />
              {errorMsg || "ক্যামেরায় সমস্যা হয়েছে।"}
            </div>
          )}
        </div>

        <div className="px-4 py-3 text-[12px] text-center" style={{ color: "#666" }}>
          QR কোড বা বারকোড ক্যামেরার সামনে ধরুন — পাওয়া গেলে স্বয়ংক্রিয়ভাবে
          যুক্ত হবে।
        </div>
      </div>
    </div>
  );
}