import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { AddRoleModal } from "../../shared/Modal";
import { COLORS, PETALS, FONTS } from "../../../constants";
import {
  fetchCrmPermissions,
  createCrmPermission,
  updateCrmPermission,
  deleteCrmPermission,
} from "../../../api/crmPermissionService";

export function CRMPage() {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);

  // API থেকে ডাটা ফেচ করা
  const loadPermissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchCrmPermissions();
      // Backend controller paginate response দেয় (data Array)
      setPermissions(response.data || []);
    } catch (err) {
      console.error("Error loading CRM permissions:", err);
      setError("CRM পারমিশন লিস্ট লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPermissions();
  }, []);

  // নতুন পারমিশন তৈরি
  const handleCreate = async (name) => {
    try {
      await createCrmPermission({ name });
      setShowAddModal(false);
      loadPermissions();
    } catch (err) {
      console.error("Error creating CRM permission:", err);
      alert(err.message || "পারমিশন তৈরি করা সম্ভব হয়নি। ইউনিক নাম ব্যবহার করুন।");
    }
  };

  // পারমিশন আপডেট
  const handleUpdate = async (name) => {
    if (!editingPermission) return;
    try {
      await updateCrmPermission(editingPermission.id, { name });
      setEditingPermission(null);
      loadPermissions();
    } catch (err) {
      console.error("Error updating CRM permission:", err);
      alert(err.message || "পারমিশন আপডেট করতে সমস্যা হয়েছে।");
    }
  };

  // পারমিশন ডিলিট
  const handleDelete = async (id) => {
    if (!window.confirm("আপনি কি নিশ্চিত যে এই পারমিশনটি ডিলিট করতে চান?")) return;

    try {
      await deleteCrmPermission(id);
      loadPermissions();
    } catch (err) {
      console.error("Error deleting CRM permission:", err);
      alert("পারমিশন ডিলিট করতে সমস্যা হয়েছে।");
    }
  };

  return (
    <div
      className="relative rounded-2xl p-6 pt-7 border overflow-hidden"
      style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
    >
      <ScallopBorder id="scallop-crm" colors={PETALS} />

      {/* Header Bar */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2
          className="font-bold text-[16px]"
          style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}
        >
          CRM List
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="text-white font-semibold text-[12.5px] px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-md hover:opacity-90 transition-opacity"
          style={{
            backgroundColor: COLORS.magenta,
            boxShadow: `0 4px 10px ${COLORS.magenta}40`,
          }}
        >
          <Plus size={14} /> Add CRM Permission
        </button>
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-10 text-slate-500 gap-2">
            <Loader2 className="animate-spin" size={20} />
            <span>ডাটা লোড হচ্ছে...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left" style={{ color: COLORS.muted }}>
                <th
                  className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b"
                  style={{ borderColor: COLORS.line }}
                >
                  SI
                </th>
                <th
                  className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b"
                  style={{ borderColor: COLORS.line }}
                >
                  Permission Name
                </th>
                <th
                  className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b"
                  style={{ borderColor: COLORS.line }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((perm, i) => (
                <tr
                  key={perm.id}
                  style={
                    i !== permissions.length - 1
                      ? { borderBottom: `1px solid ${COLORS.line}` }
                      : undefined
                  }
                >
                  <td
                    className="py-3 px-2.5"
                    style={{ color: COLORS.muted, fontFamily: FONTS.MONO }}
                  >
                    {i + 1}
                  </td>
                  <td
                    className="py-3 px-2.5 font-semibold"
                    style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}
                  >
                    {perm.name}
                  </td>
                  <td className="py-3 px-2.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingPermission(perm)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: COLORS.peacock }}
                        title="Edit permission"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(perm.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: COLORS.vermillion }}
                        title="Remove permission"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {permissions.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="py-8 text-center text-[13px]"
                    style={{ color: COLORS.muted }}
                  >
                    No CRM permissions added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddRoleModal
          onClose={() => setShowAddModal(false)}
          onCreate={handleCreate}
          accentColor={COLORS.magenta}
          title="Add CRM Permission"
          fieldLabel="Permission Name"
          placeholder="e.g. crm.lead.assign"
          buttonLabel="Add Permission"
        />
      )}

      {editingPermission && (
        <AddRoleModal
          onClose={() => setEditingPermission(null)}
          onCreate={handleUpdate}
          accentColor={COLORS.magenta}
          title="Edit CRM Permission"
          fieldLabel="Permission Name"
          placeholder="e.g. crm.lead.assign"
          buttonLabel="Save Changes"
          initialValue={editingPermission.name}
        />
      )}
    </div>
  );
}