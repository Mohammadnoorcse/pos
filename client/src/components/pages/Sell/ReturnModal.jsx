import React from "react";
import { Minus, Plus, RotateCcw, ArrowRight, Loader2, Receipt, Wallet, CreditCard, RefreshCw } from "lucide-react";
import { fetchCustomerSales, fetchReturnableItems, createSaleReturn } from "../../../api/saleReturnService";

const bankMethods = ["bKash", "Nagad", "Rocket", "Bank Transfer"];

function ReturnModal({ onClose, onApplied, customer, C, FONT_MONO, Modal }) {
  const [step, setStep] = React.useState("pick-invoice"); // "pick-invoice" | "pick-items"
  const [sales, setSales] = React.useState([]);
  const [loadingSales, setLoadingSales] = React.useState(false);
  const [selectedSale, setSelectedSale] = React.useState(null);

  const [returnableItems, setReturnableItems] = React.useState([]);
  const [loadingItems, setLoadingItems] = React.useState(false);
  const [qtys, setQtys] = React.useState({});

  // Refund Process Options
  const [refundAction, setRefundAction] = React.useState("direct"); 
  const [refundMethod, setRefundMethod] = React.useState("cash"); 
  const [bankMethod, setBankMethod] = React.useState(bankMethods[0]);

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState(null);

  // ১. কাস্টমারের আগের সেলস লোড করা
  React.useEffect(() => {
    if (!customer) return;
    let cancelled = false;
    setLoadingSales(true);
    fetchCustomerSales(customer.id)
      .then((res) => {
        if (cancelled) return;
        const list = Array.isArray(res) ? res : res?.data ?? [];
        setSales(list);
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoadingSales(false));
    return () => { cancelled = true; };
  }, [customer]);

  // ২. নির্বাচিত ইনভয়েসের আইটেম লোড করা
  const openInvoice = (sale) => {
    setSelectedSale(sale);
    setStep("pick-items");
    setLoadingItems(true);
    setError(null);
    fetchReturnableItems(sale.id)
      .then((res) => {
        const items = Array.isArray(res) ? res : res?.items || res?.data || [];
        setReturnableItems(items);
        const init = {};
        items.forEach((it) => { init[it.sale_item_id || it.id] = 0; });
        setQtys(init);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoadingItems(false));
  };

  const setQty = (itemId, max, delta) => {
    setQtys((prev) => {
      const next = Math.max(0, Math.min(max, (prev[itemId] || 0) + delta));
      return { ...prev, [itemId]: next };
    });
  };

  const selected = returnableItems
    .map((it) => ({
      ...it,
      itemId: it.sale_item_id || it.id,
      returnQty: qtys[it.sale_item_id || it.id] || 0,
    }))
    .filter((it) => it.returnQty > 0);

  const returnTotal = selected.reduce((s, it) => s + (it.unit_price || it.price) * it.returnQty, 0);

  // ৩. রিটার্ন কনফার্ম করা
  const handleConfirmReturn = async () => {
    if (selected.length === 0) return;
    setSubmitting(true);
    setError(null);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const results = [];

      for (const it of selected) {
        const res = await createSaleReturn({
          sale_id: selectedSale.id,
          sale_item_id: it.itemId,
          quantity: it.returnQty,
          return_date: today,
          refund_method: refundAction === "direct" ? refundMethod : "exchange",
          bank_method: refundAction === "direct" && refundMethod === "bank" ? bankMethod : null,
        });
        results.push(res);
      }

      onApplied(
        selected.map((it) => ({
          id: it.product_id,
          name: it.product_name || it.name,
          unit: it.unit_price || it.price,
          qty: it.returnQty,
        })),
        results,
        {
          refundAction,
          refundMethod,
          bankMethod,
          returnTotal,
        }
      );
      onClose();
    } catch (err) {
      setError(err.message || "Return process failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={step === "pick-invoice" ? "Select Invoice to Return" : `Return — Invoice #${selectedSale?.invoice_no || selectedSale?.id}`}
      subtitle={step === "pick-invoice" ? `${customer?.name || "Customer"}-এর পূর্বের ইনভয়েস নির্বাচন করুন` : "ফেরত পণ্যের পরিমাণ ও রিফান্ড অপশন বেছে নিন"}
      onClose={onClose}
      wide
    >
      {error && (
        <div className="text-[12px] font-semibold mb-3 p-2.5 rounded-lg" style={{ color: C.vermillion, backgroundColor: C.vermillionTint }}>
          {error}
        </div>
      )}

      {step === "pick-invoice" && (
        <div className="space-y-2">
          {loadingSales ? (
            <div className="flex items-center justify-center py-8 gap-2" style={{ color: C.muted }}>
              <Loader2 size={16} className="animate-spin" /> ইনভয়েস লোড হচ্ছে…
            </div>
          ) : sales.length === 0 ? (
            <div className="text-center py-8 text-[12.5px]" style={{ color: C.muted }}>
              এই কাস্টমারের কোনো পূর্বের বিক্রয় পাওয়া যায়নি
            </div>
          ) : (
            sales.map((sale) => (
              <button
                key={sale.id}
                onClick={() => openInvoice(sale)}
                className="w-full flex items-center justify-between p-3 rounded-xl border text-left transition hover:border-slate-400"
                style={{ borderColor: C.line, backgroundColor: C.paper }}
              >
                <div className="flex items-center gap-2.5">
                  <Receipt size={16} style={{ color: C.peacock }} />
                  <div>
                    <div className="text-[13px] font-bold">Invoice #{sale.invoice_no || sale.id}</div>
                    <div className="text-[11px]" style={{ color: C.muted }}>{sale.created_at || sale.sale_date}</div>
                  </div>
                </div>
                <div className="text-[13px] font-bold" style={{ fontFamily: FONT_MONO }}>
                  ৳{Number(sale.total_amount || sale.total || 0).toLocaleString()}
                </div>
              </button>
            ))
          )}
        </div>
      )}

      {step === "pick-items" && (
        <>
          {loadingItems ? (
            <div className="flex items-center justify-center py-8 gap-2" style={{ color: C.muted }}>
              <Loader2 size={16} className="animate-spin" /> আইটেম লোড হচ্ছে…
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
              {returnableItems.length === 0 ? (
                <div className="text-center text-[12.5px] py-8" style={{ color: C.muted }}>
                  এই ইনভয়েসে ফেরতযোগ্য কোনো পণ্য অবশিষ্ট নেই
                </div>
              ) : (
                returnableItems.map((it, i) => {
                  const itemId = it.sale_item_id || it.id;
                  const q = qtys[itemId] || 0;
                  const maxQty = it.remaining_quantity ?? it.quantity;
                  const unitPrice = it.unit_price || it.price;
                  return (
                    <div
                      key={itemId}
                      className="grid grid-cols-[1fr_120px_90px] items-center px-3 py-2.5"
                      style={i !== returnableItems.length - 1 ? { borderBottom: `1px solid ${C.line}` } : undefined}
                    >
                      <div>
                        <div className="text-[12.5px] font-semibold">{it.product_name || it.name}</div>
                        <div className="text-[10.5px]" style={{ color: C.muted, fontFamily: FONT_MONO }}>
                          ৳{unitPrice} × Max: {maxQty}
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setQty(itemId, maxQty, -1)}
                          className="w-6 h-6 rounded-md flex items-center justify-center border"
                          style={{ borderColor: C.line, color: C.muted }}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center text-[13px] font-bold" style={{ fontFamily: FONT_MONO }}>
                          {q}
                        </span>
                        <button
                          onClick={() => setQty(itemId, maxQty, 1)}
                          className="w-6 h-6 rounded-md flex items-center justify-center text-white"
                          style={{ backgroundColor: C.vermillion }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <div className="text-right text-[12.5px] font-bold" style={{ fontFamily: FONT_MONO }}>
                        ৳{(unitPrice * q).toLocaleString()}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Refund Method Section */}
          {selected.length > 0 && (
            <div className="mb-3.5 p-3 rounded-xl border" style={{ borderColor: C.line, backgroundColor: C.paper }}>
              <label className="text-[11.5px] font-bold mb-2 block" style={{ color: C.plum }}>
                রিটার্ন প্রসেস অপশন (Select Return Process)
              </label>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setRefundAction("direct")}
                  className="flex items-center justify-center gap-1.5 text-[12px] font-bold py-2 rounded-lg border transition"
                  style={
                    refundAction === "direct"
                      ? { backgroundColor: C.vermillion, borderColor: C.vermillion, color: "#fff" }
                      : { borderColor: C.line, color: C.muted }
                  }
                >
                  <Wallet size={13} /> সরাসরি রিফান্ড
                </button>

                <button
                  type="button"
                  onClick={() => setRefundAction("exchange")}
                  className="flex items-center justify-center gap-1.5 text-[12px] font-bold py-2 rounded-lg border transition"
                  style={
                    refundAction === "exchange"
                      ? { backgroundColor: C.peacock, borderColor: C.peacock, color: "#fff" }
                      : { borderColor: C.line, color: C.muted }
                  }
                >
                  <RefreshCw size={13} /> বিল অ্যাডজাস্ট/এক্সচেঞ্জ
                </button>
              </div>

              {refundAction === "direct" && (
                <div className="pt-2 border-t space-y-2" style={{ borderColor: C.line }}>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setRefundMethod("cash")}
                      className="flex-1 text-[11.5px] font-bold py-1.5 rounded-md border"
                      style={refundMethod === "cash" ? { borderColor: C.vermillion, color: C.vermillion, backgroundColor: C.vermillionTint } : { borderColor: C.line, color: C.muted }}
                    >
                      Cash Payment
                    </button>
                    <button
                      type="button"
                      onClick={() => setRefundMethod("bank")}
                      className="flex-1 text-[11.5px] font-bold py-1.5 rounded-md border"
                      style={refundMethod === "bank" ? { borderColor: C.vermillion, color: C.vermillion, backgroundColor: C.vermillionTint } : { borderColor: C.line, color: C.muted }}
                    >
                      Bank / MFS
                    </button>
                  </div>

                  {refundMethod === "bank" && (
                    <select
                      value={bankMethod}
                      onChange={(e) => setBankMethod(e.target.value)}
                      className="w-full text-[12px] rounded-md border p-2 outline-none"
                      style={{ borderColor: C.line, backgroundColor: C.panel }}
                    >
                      {bankMethods.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  )}
                </div>
              )}
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
          {step === "pick-items" ? "← ইনভয়েস পরিবর্তন" : "বাতিল"}
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