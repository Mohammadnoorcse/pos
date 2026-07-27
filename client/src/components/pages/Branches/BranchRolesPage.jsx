import React, { useState, useEffect } from "react";
import { Plus, Pencil, KeyRound, Loader2 } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { AddRoleModal } from "../../shared/Modal";
import { COLORS, PETALS, FONTS } from "../../../constants";
import {
  fetchBranchRoles,
  createBranchRole,
  updateBranchRole,
} from "../../../api/branchRoleService";

export function BranchRolesPage({ onOpenPermissions }) {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  // রোল লিস্ট ফেচ করা
  const loadRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchBranchRoles();
      setRoles(data.data || []); // Laravel Pagination structure (data.data)
    } catch (err) {
      console.error("Error loading roles:", err);
      setError("রোল লিস্ট লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  // নতুন রোল তৈরি
  const handleCreateRole = async (name) => {
    try {
      await createBranchRole({ name });
      setShowAddModal(false);
      loadRoles();
    } catch (err) {
      console.error("Error creating role:", err);
      alert("রোল তৈরি করা সম্ভব হয়নি। ইনপুট চেক করুন।");
    }
  };

  // রোল আপডেট
  const handleUpdateRole = async (name) => {
    if (!editingRole) return;
    try {
      await updateBranchRole(editingRole.id, { name });
      setEditingRole(null);
      loadRoles();
    } catch (err) {
      console.error("Error updating role:", err);
      alert("রোল আপডেট করতে সমস্যা হয়েছে।");
    }
  };

  return (
    <div
      className="relative rounded-2xl p-6 pt-7 border overflow-hidden"
      style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
    >
      <ScallopBorder id="scallop-branch-roles" colors={PETALS} />

      {/* Header Bar */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2
          className="font-bold text-[16px]"
          style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}
        >
          Branch User Role & Permissions
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="text-white font-semibold text-[12.5px] px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-md hover:opacity-90 transition-opacity"
          style={{
            backgroundColor: COLORS.purple,
            boxShadow: `0 4px 10px ${COLORS.purple}40`,
          }}
        >
          <Plus size={14} /> Add New Role
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
                <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: COLORS.line }}>
                  SI
                </th>
                <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: COLORS.line }}>
                  Role Name
                </th>
                <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: COLORS.line }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {roles.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-6 text-gray-400">
                    কোন রোল পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                roles.map((role, i) => (
                  <tr
                    key={role.id}
                    style={i !== roles.length - 1 ? { borderBottom: `1px solid ${COLORS.line}` } : undefined}
                  >
                    <td className="py-3 px-2.5" style={{ color: COLORS.muted, fontFamily: FONTS.MONO }}>
                      {i + 1}
                    </td>
                    <td className="py-3 px-2.5 font-semibold" style={{ color: COLORS.ink }}>
                      {role.name}
                    </td>
                    <td className="py-3 px-2.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingRole(role)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: COLORS.peacock }}
                          title="Edit role name"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => onOpenPermissions(role)}
                          className="flex items-center gap-1.5 text-[12px] font-bold px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
                          style={{
                            backgroundColor: COLORS.purpleTint,
                            color: COLORS.purple,
                          }}
                        >
                          <KeyRound size={13} /> Permissions
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddRoleModal
          onClose={() => setShowAddModal(false)}
          onCreate={handleCreateRole}
          accentColor={COLORS.purple}
          title="Add New Branch Role"
        />
      )}

      {editingRole && (
        <AddRoleModal
          onClose={() => setEditingRole(null)}
          onCreate={handleUpdateRole}
          accentColor={COLORS.purple}
          title="Edit Branch Role"
          buttonLabel="Save Changes"
          initialValue={editingRole.name}
        />
      )}
    </div>
  );
}