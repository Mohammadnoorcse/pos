import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { FieldLabel } from "../../shared/FormElements";
import { COLORS, PETALS, FONTS } from "../../../constants";
import {
  fetchStaffDetail,
  updateStaffDetails,
  createSalaryPayment,
  deleteSalaryPayment,
} from "../../../api/staffService";

const money = (n) => "৳" + Number(n || 0).toLocaleString("en-BD");

const inputStyle = {
  backgroundColor: COLORS.paper,
  borderColor: COLORS.line,
  color: COLORS.ink,
  fontFamily: FONTS.BODY,
};

function thisMonthISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function StaffDetailPage({ staff: staffProp, onBack }) {
  const [staff, setStaff] = useState(staffProp || null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    phone: "",
    address: "",
    joining_date: "",
    monthly_salary: "",
  });

  const [payForm, setPayForm] = useState({
    amount: "",
    for_month: thisMonthISO(),
    paid_on: todayISO(),
    note: "",
  });
  const [addingPayment, setAddingPayment] = useState(false);

  const load = useCallback(async () => {
    if (!staffProp?.id) return;
    try {
      setLoading(true);
      const data = await fetchStaffDetail(staffProp.id);
      setStaff(data);
      setForm({
        phone: data.phone || "",
        address: data.address || "",
        joining_date: data.joining_date || "",
        monthly_salary: data.monthly_salary != null ? data.monthly_salary : "",
      });
    } catch (err) {
      console.error("Error loading staff detail:", err);
      alert("স্টাফ ডিটেইলস লোড করা যায়নি।");
    } finally {
      setLoading(false);
    }
  }, [staffProp]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSaveDetails = async () => {
    try {
      setSaving(true);
      await updateStaffDetails(staff.id, {
        phone: form.phone || null,
        address: form.address || null,
        joining_date: form.joining_date || null,
        monthly_salary: form.monthly_salary === "" ? null : form.monthly_salary,
      });
      alert("স্টাফের তথ্য আপডেট হয়েছে!");
      load();
    } catch (err) {
      console.error("Error saving staff details:", err);
      alert(err.message || "সেভ করা সম্ভব হয়নি।");
    } finally {
      setSaving(false);
    }
  };

  const handleAddPayment = async () => {
    if (!payForm.amount || Number(payForm.amount) <= 0) {
      alert("সঠিক Amount দিন।");
      return;
    }
    try {
      setAddingPayment(true);
      await createSalaryPayment({
        user_id: staff.id,
        amount: payForm.amount,
        for_month: payForm.for_month,
        paid_on: payForm.paid_on,
        note: payForm.note || null,
      });
      setPayForm({ amount: "", for_month: thisMonthISO(), paid_on: todayISO(), note: "" });
      load();
    } catch (err) {
      console.error("Error adding salary payment:", err);
      alert(err.message || "Salary payment যোগ করা যায়নি।");
    } finally {
      setAddingPayment(false);
    }
  };

  const handleDeletePayment = async (id) => {
    if (!window.confirm("এই salary payment রেকর্ডটি ডিলিট করতে চান?")) return;
    try {
      await deleteSalaryPayment(id);
      load();
    } catch (err) {
      console.error("Error deleting salary payment:", err);
      alert("ডিলিট করা যায়নি।");
    }
  };

  if (!staffProp) {
    return (
      <div className="py-10 text-center" style={{ color: COLORS.muted }}>
        কোনো স্টাফ সিলেক্ট করা হয়নি।{" "}
        <button onClick={onBack} className="underline">
          ফিরে যান
        </button>
      </div>
    );
  }

  const totalPaid = (staff?.salary_payments || []).reduce(
    (sum, p) => sum + Number(p.amount || 0),
    0
  );

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[12.5px] font-semibold mb-4 hover:underline"
        style={{ color: COLORS.muted }}
      >
        <ArrowLeft size={14} /> Back to Staff & Salary
      </button>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-500 gap-2">
          <Loader2 className="animate-spin" size={24} />
          <span>লোড হচ্ছে...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          {/* LEFT: Staff details form */}
          <div
            className="relative rounded-2xl p-6 pt-7 border overflow-hidden"
            style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
          >
            <ScallopBorder id="scallop-staff-detail-left" colors={PETALS} />
            <h2 className="font-bold text-[16px] mb-1" style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}>
              {staff?.name}
            </h2>
            <p className="text-[12.5px] mb-4" style={{ color: COLORS.muted }}>
              {staff?.email} · {staff?.branch?.name || "No branch"} ·{" "}
              {staff?.user_type === "owner"
                ? "Owner"
                : staff?.user_type === "admin"
                ? staff?.admin_role?.name || "Admin"
                : staff?.branch_role?.name || "Branch staff"}
            </p>

            <div className="space-y-4">
              <div>
                <FieldLabel>Phone</FieldLabel>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="01XXXXXXXXX"
                  className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none"
                  style={inputStyle}
                />
              </div>
              <div>
                <FieldLabel>Address</FieldLabel>
                <input
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="বাসা/এলাকা/শহর"
                  className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none"
                  style={inputStyle}
                />
              </div>
              <div>
                <FieldLabel>Joining Date</FieldLabel>
                <input
                  type="date"
                  value={form.joining_date || ""}
                  onChange={(e) => setForm({ ...form, joining_date: e.target.value })}
                  className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none"
                  style={inputStyle}
                />
              </div>
              <div>
                <FieldLabel>Monthly Salary (reference)</FieldLabel>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.monthly_salary}
                  onChange={(e) => setForm({ ...form, monthly_salary: e.target.value })}
                  placeholder="e.g. 15000"
                  className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none"
                  style={inputStyle}
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={handleSaveDetails}
                disabled={saving}
                className="text-white font-semibold text-[13px] px-5 py-2.5 rounded-lg shadow-md flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: COLORS.purple, boxShadow: `0 4px 10px ${COLORS.purple}40` }}
              >
                {saving && <Loader2 className="animate-spin" size={14} />}
                {saving ? "Saving..." : "Save Details"}
              </button>
            </div>
          </div>

          {/* RIGHT: Salary payment history */}
          <div
            className="relative rounded-2xl p-6 pt-7 border overflow-hidden"
            style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
          >
            <ScallopBorder id="scallop-staff-detail-right" colors={PETALS} />
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-bold text-[16px]" style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}>
                Salary Payment History
              </h2>
              <span className="text-[12.5px] font-semibold" style={{ color: COLORS.forest }}>
                Total paid: {money(totalPaid)}
              </span>
            </div>

            {/* Add payment form */}
            <div
              className="mt-4 mb-4 p-3 rounded-xl border grid grid-cols-2 gap-2.5"
              style={{ borderColor: COLORS.line, backgroundColor: COLORS.paper }}
            >
              <div>
                <FieldLabel required>Amount</FieldLabel>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={payForm.amount}
                  onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })}
                  placeholder="৳"
                  className="w-full rounded-lg px-3 py-2 text-[12.5px] border outline-none"
                  style={inputStyle}
                />
              </div>
              <div>
                <FieldLabel required>For Month</FieldLabel>
                <input
                  type="month"
                  value={(payForm.for_month || "").slice(0, 7)}
                  onChange={(e) => setPayForm({ ...payForm, for_month: `${e.target.value}-01` })}
                  className="w-full rounded-lg px-3 py-2 text-[12.5px] border outline-none"
                  style={inputStyle}
                />
              </div>
              <div>
                <FieldLabel required>Paid On</FieldLabel>
                <input
                  type="date"
                  value={payForm.paid_on}
                  onChange={(e) => setPayForm({ ...payForm, paid_on: e.target.value })}
                  className="w-full rounded-lg px-3 py-2 text-[12.5px] border outline-none"
                  style={inputStyle}
                />
              </div>
              <div>
                <FieldLabel>Note</FieldLabel>
                <input
                  value={payForm.note}
                  onChange={(e) => setPayForm({ ...payForm, note: e.target.value })}
                  placeholder="ঐচ্ছিক"
                  className="w-full rounded-lg px-3 py-2 text-[12.5px] border outline-none"
                  style={inputStyle}
                />
              </div>
              <div className="col-span-2 flex justify-end">
                <button
                  onClick={handleAddPayment}
                  disabled={addingPayment}
                  className="text-white font-semibold text-[12.5px] px-4 py-2 rounded-lg shadow-md flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: COLORS.vermillion, boxShadow: `0 4px 10px ${COLORS.vermillion}40` }}
                >
                  {addingPayment ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />}
                  Add Payment
                </button>
              </div>
            </div>

            {/* History list */}
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {(staff?.salary_payments || []).length === 0 ? (
                <div className="text-[12.5px] py-6 text-center" style={{ color: COLORS.muted }}>
                  এখনও কোনো salary payment রেকর্ড করা হয়নি।
                </div>
              ) : (
                staff.salary_payments.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-2.5 rounded-lg border"
                    style={{ borderColor: COLORS.line }}
                  >
                    <div>
                      <div className="text-[13px] font-semibold" style={{ color: COLORS.ink }}>
                        {money(p.amount)}{" "}
                        <span className="text-[11.5px] font-normal" style={{ color: COLORS.muted }}>
                          for {String(p.for_month).slice(0, 7)}
                        </span>
                      </div>
                      <div className="text-[11px]" style={{ color: COLORS.muted }}>
                        Paid on {String(p.paid_on).slice(0, 10)}
                        {p.note ? ` · ${p.note}` : ""}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeletePayment(p.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: COLORS.rust || COLORS.vermillion }}
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
