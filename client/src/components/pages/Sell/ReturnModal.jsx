import React from "react";
import { X, Minus, Plus, RotateCcw, ArrowRight, Loader2, Receipt } from "lucide-react";
import { fetchCustomerSales, fetchReturnableItems, createSaleReturn } from "../../../api/saleReturnService";

function ReturnModal({ onClose, onApplied, customer, C, FONT_MONO, Modal }) {
  const [step, setStep] = React.useState("pick-invoice"); // "pick-invoice" | "pick-items"
  const [sales, setSales] = React.useState([]);
  const [loadingSales, setLoadingSales] = React.useState(false);
  const [selectedSale, setSelectedSale] = React.useState(null);

  const [returnableItems, setReturnableItems] = React.useState([]);
  const [loadingItems, setLoadingItems] = React.useState(false);
  const [qtys, setQtys] = React.useState({});

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState(null);

  // Step 1: load this customer's past sales
  React.useEffect(() => {
    if (!customer) return;
    let cancelled = false;
    setLoadingSales(true);
    fetchCustomerSales(customer.id)
      .then((res) => {
        if (cancelled) return;
        const list = Array.isArray(res?.data) ? res.data : res?.data?.data ?? [];
        setSales(list);
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoadingSales(false));
    return () => { cancelled = true; };
  }, [customer]);

  // Step 2: load returnable items for the chosen invoice
  const openInvoice = (sale) => {
    setSelectedSale(sale);
    setStep("pick-items");
    setLoadingItems(true);
    setError(null);
    fetchReturnableItems(sale.id)
      .then((res) => {
        setReturnableItems(res.items || []);
        const init = {};
        (res.items || []).forEach((it) => { init[it.sale_item_id] = 0; });
        setQtys(init);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoadingItems(false));
  };

  const setQty = (saleItemId, max, delta) => {
    setQtys((prev) => {
      const next = Math.max(0, Math.min(max, (prev[saleItemId] || 0) + delta));
      return { ...prev, [saleItemId]: next };
    });
  };

  const selected = returnableItems
    .map((it) => ({ ...it, returnQty: qtys[it.sale_item_id] || 0 }))
    .filter((it) => it.returnQty > 0);

  const returnTotal = selected.reduce((s, it) => s + it.unit_price * it.returnQty, 0);

  const handleConfirmReturn = async () => {
    if (selected.length === 0) return;
    setSubmitting(true);
    setError(null);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const results = [];
      // sequential, so one failed line doesn't corrupt partial state silently
      for (const it of selected) {
        const res = await createSaleReturn({
          sale_id: selectedSale.id,
          sale_item_id: it.sale_item_id,
          quantity: it.returnQty,
          return_date: today,
        });
        results.push(res);
      }
      onApplied(
        selected.map((it) => ({
          id: it.product_id,
          name: it.product_name,
          unit: it.unit_price,
          qty: it.returnQty,
        })),
        results
      );
      onClose();
    } catch (err) {
      setError(err.message || "Return failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={step === "pick-invoice" ? "Select Invoice to Return From" : `Return — ${selectedSale?.invoice_no}`}
      subtitle={
        step === "pick-invoice"
          ? `${customer?.name || "Customer"}'r আগের কেনা পণ্যের ইনভয়েস বেছে নিন`
          : "কোন পণ্য কত পরিমাণ ফেরত নিচ্ছেন বেছে নিন"
      }
      onClose={onClose}
      wide
    >
      {error && (
        <div className="text-[12px] font-semibold mb-3" style={{ color: C.vermillion }}>
          {error}
        </div>
      )}

      {step === "pick-invoice" && (
        <>
          {loadingSales && (
            <div className="flex items-center justify-center py-8 gap-2" style={{ color: C.muted }}>
              <Loader2 size={16} className="animate-spin" /> লোড হচ্ছে…
            </div>
          )}
          {!loadingSales && sales.length === 0 && (
            <div className="text-center py-8 text-[12.5px]" style={{ color: C.muted }}>
              এই কাস্টমারের কোনো পূর্বের সেল পাওয়া যায়নি
            </div>
          )}
          <div className="space-y-2">
            {sales.map((sale) => (
              <button
                key={sale.id}
                onClick={() => openInvoice(sale)}
                className="w-full flex items-center justify-between p-3 rounded-xl border text-left"
                style={{ borderColor: C.line, backgroundColor: C.paper }}
              >
                <div className="flex items-center gap-2">
                  <Receipt size={15} style={{ color: C.peacock }} />
                  <div>
                    <div className="text-[13px] font-bold">{sale.invoice_no}</div>
                    <div className="text-[11px]" style={{ color: C.muted }}>{sale.sale_date}</div>
                  </div>
                </div>
                <div className="text-[13px] font-bold" style={{ fontFamily: FONT_MONO }}>
                  ৳{Number(sale.total).toLocaleString()}
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {step === "pick-items" && (
        <>
          {loadingItems ? (
            <div className="flex items-center justify-center py-8 gap-2" style={{ color: C.muted }}>
              <Loader2 size={16} className="animate-spin" /> লোড হচ্ছে…
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden mb-3.5" style={{ borderColor: C.line }}>
              <div
                className="grid grid-cols-[1fr_120px_90px] text-[10.5px] font-bold text-white px-3 py-2"
                style={{ backgroundColor: C.vermillion }}
              >
                <div>Product</div>
                <div className="text-center">Return Qty</div>
                <div className="text-right">Amount</div>
              </div>
              {returnableItems.length === 0 && (
                <div className="text-center text-[12.5px] py-8" style={{ color: C.muted }}>
                  এই ইনভয়েসে ফেরতযোগ্য কোনো পণ্য নেই
                </div>
              )}
              {returnableItems.map((it, i) => {
                const q = qtys[it.sale_item_id] || 0;
                return (
                  <div
                    key={it.sale_item_id}
                    className="grid grid-cols-[1fr_120px_90px] items-center px-3 py-2.5"
                    style={i !== returnableItems.length - 1 ? { borderBottom: `1px solid ${C.line}` } : undefined}
                  >
                    <div>
                      <div className="text-[12.5px] font-semibold">{it.product_name}</div>
                      <div className="text-[10.5px]" style={{ color: C.muted, fontFamily: FONT_MONO }}>
                        ৳{it.unit_price} × remaining {it.remaining_quantity}
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setQty(it.sale_item_id, it.remaining_quantity, -1)}
                        className="w-6 h-6 rounded-md flex items-center justify-center border"
                        style={{ borderColor: C.line, color: C.muted }}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center text-[13px] font-bold" style={{ fontFamily: FONT_MONO }}>
                        {q}
                      </span>
                      <button
                        onClick={() => setQty(it.sale_item_id, it.remaining_quantity, 1)}
                        className="w-6 h-6 rounded-md flex items-center justify-center text-white"
                        style={{ backgroundColor: C.vermillion }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <div className="text-right text-[12.5px] font-bold" style={{ fontFamily: FONT_MONO }}>
                      ৳{(it.unit_price * q).toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div
            className="flex items-center justify-between rounded-lg px-3 py-2.5"
            style={{ backgroundColor: C.vermillionTint, color: C.vermillion }}
          >
            <span className="text-[12.5px] font-bold flex items-center gap-1.5">
              <RotateCcw size={14} /> Total Return Amount
            </span>
            <span className="text-[15px] font-bold" style={{ fontFamily: FONT_MONO }}>
              ৳{returnTotal.toLocaleString()}
            </span>
          </div>
        </>
      )}

      <div className="flex gap-2.5 mt-5">
        <button
          onClick={step === "pick-items" ? () => setStep("pick-invoice") : onClose}
          disabled={submitting}
          className="flex-1 text-[13px] font-semibold py-2.5 rounded-lg border"
          style={{ borderColor: C.line, color: C.muted }}
        >
          {step === "pick-items" ? "← ইনভয়েস পরিবর্তন" : "বাতিল"}
        </button>
        {step === "pick-items" && (
          <button
            onClick={handleConfirmReturn}
            disabled={submitting || selected.length === 0}
            className="flex-1 flex items-center justify-center gap-1.5 text-[13px] font-bold py-2.5 rounded-lg text-white disabled:opacity-60"
            style={{ backgroundColor: C.vermillion }}
          >
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <>Confirm Return <ArrowRight size={14} /></>}
          </button>
        )}
      </div>
    </Modal>
  );
}

export default ReturnModal;