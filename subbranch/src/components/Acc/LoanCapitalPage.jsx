import React, { useState, useEffect } from "react";
import { fetchLoans, createLoan, payLoan } from "../../api/acc/loanService";
import {
  Landmark,
  Loader2,
  Search,
  ChevronDown,
  Filter,
  Download,
  X,
  Wallet,
  CheckCircle2,
  ArrowLeft,
  ArrowUpRight,
  ArrowDownLeft,
  Banknote,
  Plus,
  AlertTriangle,
  CalendarClock,
  Percent,
} from "lucide-react";

/* ---------------------------------------------------------------------
   Design Tokens
--------------------------------------------------------------------- */
const COLORS = {
  paper: "#FAF8F4",
  panel: "#FFFFFF",
  ink: "#241C1A",
  muted: "#8A7F78",
  line: "#EAE3DC",
  vermillion: "#C1440E",
  magenta: "#9B2954",
};
const FONTS = {
  BODY: "'Inter', system-ui, sans-serif",
  MONO: "'JetBrains Mono', ui-monospace, monospace",
};

const vermillionSoft = `${COLORS.vermillion}1A`;
const magentaSoft = `${COLORS.magenta}1A`;
const greenSoft = "#E7F6EC";
const green = "#1E9E5A";
const grayaSoft = "#EFEBE7";
const graya = "#6B6058";
const blueSoft = "#E8EEFC";
const blue = "#2657C7";
const amberSoft = "#FDF1E0";
const amber = "#B4740E";

function taka(n) {
  const val = Number(n) || 0;
  return "৳" + Math.round(val).toLocaleString("en-BD");
}

const PARTY_TYPE_META = {
  Bank: { color: blue, soft: blueSoft },
  NBFC: { color: COLORS.magenta, soft: magentaSoft },
  Personal: { color: amber, soft: amberSoft },
  Owner: { color: COLORS.vermillion, soft: vermillionSoft },
  Partner: { color: green, soft: greenSoft },
};

const LOAN_STATUS_META = {
  active: { label: "Active", color: blue, soft: blueSoft, icon: CalendarClock },
  closed: { label: "Closed", color: green, soft: greenSoft, icon: CheckCircle2 },
  overdue: { label: "Overdue", color: COLORS.vermillion, soft: vermillionSoft, icon: AlertTriangle },
};

function StatCard({ icon: Icon, label, value, sub, color, soft }) {
  return (
    <div className="rounded-2xl border p-4" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
      <div className="flex items-center gap-2.5 mb-1.5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: soft }}>
          <Icon size={14} style={{ color }} />
        </div>
        <div className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
          {label}
        </div>
      </div>
      <div className="text-[22px] font-bold" style={{ color, fontFamily: FONTS.MONO }}>
        {value}
      </div>
      {sub && (
        <div className="text-[11.5px] mt-0.5" style={{ color: COLORS.muted }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function Select({ value, onChange, options, icon: Icon }) {
  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-lg px-3 py-2 border" style={{ borderColor: COLORS.line, backgroundColor: COLORS.panel }}>
        {Icon && <Icon size={13} style={{ color: COLORS.muted }} />}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent outline-none text-[12.5px] font-semibold appearance-none pr-5"
          style={{ color: COLORS.ink }}
        >
          {options.map((o) => (
            <option key={o.id || o} value={o.id || o}>
              {o.name || o}
            </option>
          ))}
        </select>
        <ChevronDown size={12} style={{ color: COLORS.muted, marginLeft: -18, pointerEvents: "none" }} />
      </div>
    </div>
  );
}

function PartyPill({ type }) {
  const meta = PARTY_TYPE_META[type] || { color: graya, soft: grayaSoft };
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold whitespace-nowrap"
      style={{ backgroundColor: meta.soft, color: meta.color }}
    >
      {type || "General"}
    </span>
  );
}

function LoanStatusPill({ status }) {
  const meta = LOAN_STATUS_META[status] || LOAN_STATUS_META.active;
  const Icon = meta.icon;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap"
      style={{ backgroundColor: meta.soft, color: meta.color }}
    >
      <Icon size={11} />
      {meta.label}
    </span>
  );
}

function RepaymentBar({ principal = 0, outstanding = 0 }) {
  const p = Number(principal) || 1;
  const o = Number(outstanding) || 0;
  const paidPct = Math.max(0, Math.min(100, ((p - o) / p) * 100));
  return (
    <div className="w-full">
      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.line }}>
        <div className="h-full rounded-full" style={{ width: `${paidPct}%`, backgroundColor: paidPct >= 100 ? green : COLORS.vermillion }} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------
   Create New Entry Modal
--------------------------------------------------------------------- */
function CreateEntryModal({ isOpen, onClose, onSuccess }) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    kind: "loan",
    party: "",
    party_type: "Bank",
    principal: "",
    rate: "0",
    tenure_months: "12",
    emi: "",
    taken_on: new Date().toISOString().split("T")[0],
    next_due: "",
    purpose: "",
    account: "cash",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.party || !formData.principal) {
      alert("Please enter party name and principal amount.");
      return;
    }

    try {
      setSubmitting(true);
      await createLoan({
        ...formData,
        principal: parseFloat(formData.principal),
        rate: parseFloat(formData.rate) || 0,
        tenure_months: parseInt(formData.tenure_months) || null,
        emi: formData.emi ? parseFloat(formData.emi) : null,
      });
      onSuccess("New entry created successfully!");
      onClose();
    } catch (err) {
      console.error("Failed to create entry:", err);
      alert(err.response?.data?.message || "Failed to create entry. Check inputs.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="w-full max-w-lg rounded-2xl p-6 border shadow-xl" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
        <div className="flex items-center justify-between pb-4 mb-4 border-b" style={{ borderColor: COLORS.line }}>
          <h2 className="text-16 font-bold" style={{ color: COLORS.ink }}>
            Create New Loan / Capital
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-black/5">
            <X size={16} style={{ color: COLORS.muted }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11.5px] font-semibold block mb-1" style={{ color: COLORS.muted }}>
                Entry Type
              </label>
              <select
                value={formData.kind}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    kind: e.target.value,
                    party_type: e.target.value === "loan" ? "Bank" : "Owner",
                  })
                }
                className="w-full rounded-lg border px-3 py-2 text-[13px] outline-none"
                style={{ borderColor: COLORS.line, backgroundColor: COLORS.paper }}
              >
                <option value="loan">Loan (Borrowing)</option>
                <option value="capital">Capital (Owner/Partner)</option>
              </select>
            </div>

            <div>
              <label className="text-[11.5px] font-semibold block mb-1" style={{ color: COLORS.muted }}>
                Party Type
              </label>
              <select
                value={formData.party_type}
                onChange={(e) => setFormData({ ...formData, party_type: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-[13px] outline-none"
                style={{ borderColor: COLORS.line, backgroundColor: COLORS.paper }}
              >
                {formData.kind === "loan" ? (
                  <>
                    <option value="Bank">Bank</option>
                    <option value="NBFC">NBFC</option>
                    <option value="Personal">Personal</option>
                  </>
                ) : (
                  <>
                    <option value="Owner">Owner</option>
                    <option value="Partner">Partner</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11.5px] font-semibold block mb-1" style={{ color: COLORS.muted }}>
              Party / Lender / Owner Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Uttara Bank / Rafiq Islam"
              value={formData.party}
              onChange={(e) => setFormData({ ...formData, party: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 text-[13px] outline-none"
              style={{ borderColor: COLORS.line }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11.5px] font-semibold block mb-1" style={{ color: COLORS.muted }}>
                Amount (Principal) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={formData.principal}
                onChange={(e) => setFormData({ ...formData, principal: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-[13px] outline-none"
                style={{ borderColor: COLORS.line }}
              />
            </div>

            <div>
              <label className="text-[11.5px] font-semibold block mb-1" style={{ color: COLORS.muted }}>
                Account Received
              </label>
              <select
                value={formData.account}
                onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-[13px] outline-none"
                style={{ borderColor: COLORS.line, backgroundColor: COLORS.paper }}
              >
                <option value="cash">Cash in Hand</option>
                <option value="bank">Bank Account</option>
              </select>
            </div>
          </div>

          {formData.kind === "loan" && (
            <>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11.5px] font-semibold block mb-1" style={{ color: COLORS.muted }}>
                    Rate (% p.a.)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="9.0"
                    value={formData.rate}
                    onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                    className="w-full rounded-lg border px-3 py-2 text-[13px] outline-none"
                    style={{ borderColor: COLORS.line }}
                  />
                </div>
                <div>
                  <label className="text-[11.5px] font-semibold block mb-1" style={{ color: COLORS.muted }}>
                    Tenure (Months)
                  </label>
                  <input
                    type="number"
                    placeholder="12"
                    value={formData.tenure_months}
                    onChange={(e) => setFormData({ ...formData, tenure_months: e.target.value })}
                    className="w-full rounded-lg border px-3 py-2 text-[13px] outline-none"
                    style={{ borderColor: COLORS.line }}
                  />
                </div>
                <div>
                  <label className="text-[11.5px] font-semibold block mb-1" style={{ color: COLORS.muted }}>
                    EMI Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Monthly EMI"
                    value={formData.emi}
                    onChange={(e) => setFormData({ ...formData, emi: e.target.value })}
                    className="w-full rounded-lg border px-3 py-2 text-[13px] outline-none"
                    style={{ borderColor: COLORS.line }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11.5px] font-semibold block mb-1" style={{ color: COLORS.muted }}>
                    Taken On
                  </label>
                  <input
                    type="date"
                    value={formData.taken_on}
                    onChange={(e) => setFormData({ ...formData, taken_on: e.target.value })}
                    className="w-full rounded-lg border px-3 py-2 text-[13px] outline-none"
                    style={{ borderColor: COLORS.line }}
                  />
                </div>
                <div>
                  <label className="text-[11.5px] font-semibold block mb-1" style={{ color: COLORS.muted }}>
                    Next Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.next_due}
                    onChange={(e) => setFormData({ ...formData, next_due: e.target.value })}
                    className="w-full rounded-lg border px-3 py-2 text-[13px] outline-none"
                    style={{ borderColor: COLORS.line }}
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-[11.5px] font-semibold block mb-1" style={{ color: COLORS.muted }}>
              Purpose / Note
            </label>
            <input
              type="text"
              placeholder="e.g. Working capital injection"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 text-[13px] outline-none"
              style={{ borderColor: COLORS.line }}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t" style={{ borderColor: COLORS.line }}>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[12.5px] font-semibold border rounded-lg"
              style={{ borderColor: COLORS.line }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-[12.5px] font-semibold text-white rounded-lg flex items-center gap-2"
              style={{ backgroundColor: COLORS.vermillion }}
            >
              {submitting && <Loader2 className="animate-spin" size={14} />}
              Save Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------
   Pay Loan Payment Modal
--------------------------------------------------------------------- */
function PayLoanModal({ entry, isOpen, onClose, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [account, setAccount] = useState("cash");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (entry) {
      setAmount(entry.emi || entry.outstanding || "");
    }
  }, [entry]);

  if (!isOpen || !entry) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await payLoan(entry.id, {
        amount: parseFloat(amount),
        account,
        note,
      });
      onSuccess(`Payment of ${taka(amount)} recorded.`);
      onClose();
    } catch (err) {
      console.error("Payment failed:", err);
      alert(err.response?.data?.message || "Failed to record payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="w-full max-w-md rounded-2xl p-6 border shadow-xl" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
        <div className="flex items-center justify-between pb-3 mb-3 border-b" style={{ borderColor: COLORS.line }}>
          <h2 className="text-15 font-bold" style={{ color: COLORS.ink }}>
            Record Loan Payment ({entry.loan_no || entry.id})
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-black/5">
            <X size={16} style={{ color: COLORS.muted }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[11.5px] font-semibold block mb-1" style={{ color: COLORS.muted }}>
              Repayment Amount *
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-[13px] outline-none"
              style={{ borderColor: COLORS.line }}
            />
          </div>

          <div>
            <label className="text-[11.5px] font-semibold block mb-1" style={{ color: COLORS.muted }}>
              Paid From Account
            </label>
            <select
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-[13px] outline-none"
              style={{ borderColor: COLORS.line, backgroundColor: COLORS.paper }}
            >
              <option value="cash">Cash in Hand</option>
              <option value="bank">Bank Account</option>
            </select>
          </div>

          <div>
            <label className="text-[11.5px] font-semibold block mb-1" style={{ color: COLORS.muted }}>
              Note / Reference
            </label>
            <input
              type="text"
              placeholder="e.g. Installment for August"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-[13px] outline-none"
              style={{ borderColor: COLORS.line }}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t" style={{ borderColor: COLORS.line }}>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[12.5px] font-semibold border rounded-lg"
              style={{ borderColor: COLORS.line }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-[12.5px] font-semibold text-white rounded-lg flex items-center gap-1.5"
              style={{ backgroundColor: COLORS.vermillion }}
            >
              {loading && <Loader2 className="animate-spin" size={13} />}
              Confirm Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------
   Ledger Drawer
--------------------------------------------------------------------- */
function LedgerDrawer({ entry, onClose, onOpenPayment, onCloseLoan }) {
  if (!entry) return null;
  const isLoan = entry.kind === "loan";
  const partyType = entry.party_type || entry.partyType;
  const tenureMonths = entry.tenure_months || entry.tenureMonths;
  const takenOn = entry.taken_on || entry.takenOn;
  const nextDue = entry.next_due || entry.nextDue;
  const loanCode = entry.loan_no || entry.id;

  const paidSoFar = isLoan ? entry.principal - entry.outstanding : null;
  const paidPct = isLoan ? Math.max(0, Math.min(100, (paidSoFar / (entry.principal || 1)) * 100)) : null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="h-full w-full max-w-md flex flex-col animate-[slideIn_0.2s_ease-out]"
        style={{ backgroundColor: COLORS.panel, fontFamily: FONTS.BODY }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0" style={{ borderColor: COLORS.line }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: isLoan ? vermillionSoft : magentaSoft }}>
              {isLoan ? <Landmark size={15} style={{ color: COLORS.vermillion }} /> : <Wallet size={15} style={{ color: COLORS.magenta }} />}
            </div>
            <div>
              <h2 className="text-[14.5px] font-bold" style={{ color: COLORS.ink }}>
                {loanCode}
              </h2>
              <p className="text-[11px]" style={{ color: COLORS.muted }}>
                {isLoan ? "Loan folio" : "Capital entry"} · {entry.party}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/5">
            <X size={15} style={{ color: COLORS.muted }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div
            className="rounded-xl border p-4"
            style={{
              borderColor: COLORS.line,
              backgroundImage: `repeating-linear-gradient(${COLORS.paper}, ${COLORS.paper} 27px, ${COLORS.line} 28px)`,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10.5px] font-semibold uppercase tracking-wider" style={{ color: COLORS.muted }}>
                {isLoan ? "ঋণ খতিয়ান" : "মূলধন এন্ট্রি"}
              </span>
              <PartyPill type={partyType} />
            </div>

            <div className="text-[15px] font-bold mb-0.5" style={{ color: COLORS.ink }}>
              {entry.party}
            </div>
            <div className="text-[11.5px] mb-4" style={{ color: COLORS.muted }}>
              {isLoan ? entry.purpose : entry.note}
            </div>

            <div className="border-t border-dashed my-3" style={{ borderColor: COLORS.line }} />

            {isLoan ? (
              <>
                <div className="grid grid-cols-2 gap-y-2.5 text-[12.5px]">
                  <div style={{ color: COLORS.muted }}>Principal</div>
                  <div className="text-right font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                    {taka(entry.principal)}
                  </div>
                  <div style={{ color: COLORS.muted }}>Interest rate</div>
                  <div className="text-right font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                    {entry.rate > 0 ? `${entry.rate}% p.a.` : "Interest-free"}
                  </div>
                  <div style={{ color: COLORS.muted }}>Tenure</div>
                  <div className="text-right font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                    {tenureMonths ? `${tenureMonths} months` : "—"}
                  </div>
                  <div style={{ color: COLORS.muted }}>EMI</div>
                  <div className="text-right font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                    {taka(entry.emi)} / mo
                  </div>
                  <div style={{ color: COLORS.muted }}>Taken on</div>
                  <div className="text-right font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                    {takenOn || "—"}
                  </div>
                </div>

                <div className="border-t my-3" style={{ borderColor: COLORS.line }} />

                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
                    Repaid
                  </span>
                  <span className="text-[12px] font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                    {Math.round(paidPct)}%
                  </span>
                </div>
                <RepaymentBar principal={entry.principal} outstanding={entry.outstanding} />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px]" style={{ color: COLORS.muted }}>
                    {taka(paidSoFar)} paid
                  </span>
                  <span className="text-[11px]" style={{ color: COLORS.muted }}>
                    {taka(entry.outstanding)} left
                  </span>
                </div>

                <div className="border-t border-dashed my-4" style={{ borderColor: COLORS.line }} />

                <div className="flex items-center justify-between">
                  <span className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
                    Outstanding balance
                  </span>
                  <span
                    className="text-[16px] font-bold"
                    style={{ color: entry.outstanding > 0 ? COLORS.vermillion : green, fontFamily: FONTS.MONO }}
                  >
                    {taka(entry.outstanding)}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-y-2.5 text-[12.5px]">
                  <div style={{ color: COLORS.muted }}>Direction</div>
                  <div
                    className="text-right font-semibold flex items-center justify-end gap-1"
                    style={{ color: entry.direction === "in" ? green : COLORS.vermillion }}
                  >
                    {entry.direction === "in" ? <ArrowDownLeft size={13} /> : <ArrowUpRight size={13} />}
                    {entry.direction === "in" ? "Injection" : "Withdrawal"}
                  </div>
                  <div style={{ color: COLORS.muted }}>Date</div>
                  <div className="text-right font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                    {entry.date || takenOn}
                  </div>
                </div>

                <div className="border-t border-dashed my-4" style={{ borderColor: COLORS.line }} />

                <div className="flex items-center justify-between">
                  <span className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: COLORS.muted }}>
                    Amount
                  </span>
                  <span
                    className="text-[16px] font-bold"
                    style={{ color: entry.direction === "in" ? green : COLORS.vermillion, fontFamily: FONTS.MONO }}
                  >
                    {entry.direction === "in" ? "+" : "−"}
                    {taka(entry.amount || entry.principal)}
                  </span>
                </div>
              </>
            )}
          </div>

          {isLoan && (
            <div className="mt-5 flex items-center justify-between text-[12px]">
              <span style={{ color: COLORS.muted }}>Status</span>
              <LoanStatusPill status={entry.status} />
            </div>
          )}
          {isLoan && nextDue && (
            <div className="mt-2.5 flex items-center justify-between text-[12px]">
              <span style={{ color: COLORS.muted }}>Next installment due</span>
              <span className="font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                {nextDue}
              </span>
            </div>
          )}
        </div>

        {isLoan && entry.status === "active" && (
          <div className="flex items-center justify-end gap-2 px-5 py-4 border-t shrink-0" style={{ borderColor: COLORS.line }}>
            <button
              onClick={() => onCloseLoan(entry)}
              className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12.5px] font-semibold border"
              style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.panel }}
            >
              Foreclose
            </button>
            <button
              onClick={() => onOpenPayment(entry)}
              className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12.5px] font-semibold text-white"
              style={{ backgroundColor: COLORS.vermillion }}
            >
              <Banknote size={13} />
              Record EMI payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------
   Main Page Component
--------------------------------------------------------------------- */
export function LoanCapitalPage({ onNavigate }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [kindFilter, setKindFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [active, setActive] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [paymentEntry, setPaymentEntry] = useState(null);
  const [toast, setToast] = useState("");

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const loadEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchLoans({ kind: kindFilter, status: statusFilter });
      const fetchedLoans = res.data?.loans || res.loans || res.data || [];
      setEntries(fetchedLoans);
    } catch (err) {
      console.error("Error loading loans:", err);
      setError("Failed to load loan and capital list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, [kindFilter, statusFilter]);

  const handleForecloseLoan = async (entry) => {
    if (!window.confirm(`Are you sure you want to foreclosure loan ${entry.loan_no || entry.id}?`)) return;

    try {
      await payLoan(entry.id, { amount: entry.outstanding, note: "Loan Foreclosure" });
      notify(`${entry.loan_no || entry.id} foreclosed successfully.`);
      setActive(null);
      loadEntries();
    } catch (err) {
      console.error("Error foreclosing loan:", err);
      alert("Failed to foreclose loan.");
    }
  };

  const filtered = entries.filter((e) => {
    const code = e.loan_no || e.id || "";
    const pType = e.party_type || e.partyType || "";
    const matchesQuery = [code, e.party, pType].join(" ").toLowerCase().includes(query.toLowerCase());
    return matchesQuery;
  });

  const activeLoans = entries.filter((e) => e.kind === "loan" && e.status === "active");
  const totalOutstanding = activeLoans.reduce((s, e) => s + (Number(e.outstanding) || 0), 0);
  const totalEmi = activeLoans.reduce((s, e) => s + (Number(e.emi) || 0), 0);
  const capitalIn = entries
    .filter((e) => e.kind === "capital" && e.direction === "in")
    .reduce((s, e) => s + (Number(e.amount || e.principal) || 0), 0);
  const capitalOut = entries
    .filter((e) => e.kind === "capital" && e.direction === "out")
    .reduce((s, e) => s + (Number(e.amount || e.principal) || 0), 0);
  const netCapital = capitalIn - capitalOut;

  return (
    <div className="p-6" style={{ backgroundColor: COLORS.paper, fontFamily: FONTS.BODY, minHeight: "100%" }}>
      <style>{`@keyframes slideIn { from { transform: translateX(24px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: vermillionSoft }}>
            <Landmark size={16} style={{ color: COLORS.vermillion }} />
          </div>
          <div>
            <h1 className="text-[17px] font-bold" style={{ color: COLORS.ink }}>
              Loan &amp; Capital
            </h1>
            <p className="text-[12px]" style={{ color: COLORS.muted }}>
              Borrowed money and owner's equity, tracked in one register
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => onNavigate && onNavigate("dashboard")}
            className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12.5px] font-semibold border"
            style={{ borderColor: COLORS.line, color: COLORS.ink, backgroundColor: COLORS.panel }}
          >
            <ArrowLeft size={13} />
            Dashboard
          </button>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[12.5px] font-semibold text-white cursor-pointer"
            style={{ backgroundColor: COLORS.vermillion }}
          >
            <Plus size={13} />
            New entry
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        <StatCard
          icon={Landmark}
          label="Outstanding loans"
          value={taka(totalOutstanding)}
          sub={`${activeLoans.length} active`}
          color={COLORS.vermillion}
          soft={vermillionSoft}
        />
        <StatCard icon={CalendarClock} label="Monthly EMI due" value={taka(totalEmi)} sub="Across active loans" color={blue} soft={blueSoft} />
        <StatCard icon={Wallet} label="Net capital" value={taka(netCapital)} sub={`${taka(capitalIn)} in · ${taka(capitalOut)} out`} color={green} soft={greenSoft} />
        <StatCard
          icon={Percent}
          label="Blended rate"
          value={
            activeLoans.length
              ? (activeLoans.reduce((s, e) => s + (Number(e.rate) || 0), 0) / activeLoans.length).toFixed(1) + "%"
              : "—"
          }
          sub="Weighted avg., active loans"
          color={COLORS.magenta}
          soft={magentaSoft}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2.5 mb-4">
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2 border flex-1 min-w-[220px]"
          style={{ borderColor: COLORS.line, backgroundColor: COLORS.panel }}
        >
          <Search size={14} style={{ color: COLORS.muted }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search entry ID / lender / owner"
            className="bg-transparent outline-none text-[13px] w-full"
            style={{ color: COLORS.ink }}
          />
        </div>

        <Select
          value={kindFilter}
          onChange={(v) => {
            setKindFilter(v);
            setStatusFilter("ALL");
          }}
          icon={Filter}
          options={[
            { id: "ALL", name: "Loans & capital" },
            { id: "loan", name: "Loans only" },
            { id: "capital", name: "Capital only" },
          ]}
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          icon={Filter}
          options={[
            { id: "ALL", name: "All statuses" },
            { id: "active", name: "Active" },
            { id: "closed", name: "Closed" },
          ]}
        />
      </div>

      {/* Register Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}>
        {loading ? (
          <div className="flex items-center justify-center py-10 gap-2" style={{ color: COLORS.muted }}>
            <Loader2 className="animate-spin" size={20} />
            <span>Loading entries...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8" style={{ color: COLORS.vermillion }}>
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px] border-collapse">
              <thead>
                <tr>
                  {["Entry", "Party", "Type", "Amount", "Progress / Date", "Status", ""].map((label) => (
                    <th key={label} className="text-left px-5 py-3 text-white" style={{ backgroundColor: COLORS.vermillion }}>
                      <span className="text-[11px] font-semibold uppercase tracking-wide">{label}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => {
                  const isLoan = e.kind === "loan";
                  const partyType = e.party_type || e.partyType;
                  const entryCode = e.loan_no || e.id;
                  const takenDate = e.taken_on || e.takenOn || e.date;

                  return (
                    <tr
                      key={e.id}
                      className="border-b hover:bg-black/[0.02] transition-colors cursor-pointer"
                      style={{ borderColor: COLORS.line }}
                      onClick={() => setActive(e)}
                    >
                      <td
                        className="px-5 py-3.5 font-semibold whitespace-nowrap"
                        style={{ color: isLoan ? COLORS.vermillion : COLORS.magenta, fontFamily: FONTS.MONO, fontSize: 12.5 }}
                      >
                        <div className="flex items-center gap-1.5">
                          {isLoan ? <Landmark size={12} /> : <Wallet size={12} />}
                          {entryCode}
                        </div>
                      </td>
                      <td className="px-5 py-3.5" style={{ color: COLORS.ink }}>
                        <div className="font-semibold">{e.party}</div>
                        {isLoan && <div className="text-[11px]" style={{ color: COLORS.muted }}>{e.purpose}</div>}
                      </td>
                      <td className="px-5 py-3.5">
                        <PartyPill type={partyType} />
                      </td>
                      <td className="px-5 py-3.5 font-semibold whitespace-nowrap" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                        {isLoan ? (
                          taka(e.principal)
                        ) : (
                          <span className="flex items-center gap-1" style={{ color: e.direction === "in" ? green : COLORS.vermillion }}>
                            {e.direction === "in" ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                            {taka(e.amount || e.principal)}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 min-w-[140px]">
                        {isLoan ? (
                          <RepaymentBar principal={e.principal} outstanding={e.outstanding} />
                        ) : (
                          <span style={{ color: COLORS.muted, fontFamily: FONTS.MONO, fontSize: 12.5 }}>{takenDate}</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        {isLoan ? (
                          <LoanStatusPill status={e.status} />
                        ) : (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap"
                            style={{ backgroundColor: greenSoft, color: green }}
                          >
                            <CheckCircle2 size={11} />
                            Posted
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={(ev) => {
                            ev.stopPropagation();
                            setActive(e);
                          }}
                          className="text-[11.5px] font-semibold whitespace-nowrap hover:underline"
                          style={{ color: COLORS.magenta }}
                        >
                          View folio
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-[13px]" style={{ color: COLORS.muted }}>
                      No entries match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Notification Toast */}
      {toast && (
        <div
          className="fixed bottom-5 right-5 flex items-center gap-2 rounded-xl px-4 py-3 text-[12.5px] font-semibold text-white shadow-lg z-50"
          style={{ backgroundColor: COLORS.magenta }}
        >
          <Banknote size={14} />
          {toast}
        </div>
      )}

      {/* Create Modal */}
      <CreateEntryModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={(msg) => {
          notify(msg);
          loadEntries();
        }}
      />

      {/* Pay EMI Modal */}
      <PayLoanModal
        entry={paymentEntry}
        isOpen={Boolean(paymentEntry)}
        onClose={() => setPaymentEntry(null)}
        onSuccess={(msg) => {
          notify(msg);
          setActive(null);
          loadEntries();
        }}
      />

      {/* Ledger Drawer */}
      <LedgerDrawer
        entry={active}
        onClose={() => setActive(null)}
        onOpenPayment={(entry) => setPaymentEntry(entry)}
        onCloseLoan={handleForecloseLoan}
      />
    </div>
  );
}

export default LoanCapitalPage;