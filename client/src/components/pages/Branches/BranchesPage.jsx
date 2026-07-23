import React from "react";
import { Plus, Pencil } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { AddBranchModal } from "../../shared/Modal";
import { COLORS, PETALS, FONTS, DEFAULT_SHOP_BRANCHES } from "../../../constants";

export function BranchesPage() {
  const [branches, setBranches] = React.useState(DEFAULT_SHOP_BRANCHES);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [editingBranch, setEditingBranch] = React.useState(null);

  const handleCreateBranch = (name, address) => {
    const nextId = branches.length ? Math.max(...branches.map((b) => b.id)) + 1 : 1;
    setBranches((prev) => [...prev, { id: nextId, name, address }]);
    setShowAddModal(false);
  };

  const handleUpdateBranch = (name, address) => {
    setBranches((prev) =>
      prev.map((b) => (b.id === editingBranch.id ? { ...b, name, address } : b))
    );
    setEditingBranch(null);
  };

  return (
    <div
      className="relative rounded-2xl p-6 pt-7 border overflow-hidden"
      style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
    >
      <ScallopBorder id="scallop-branches" colors={PETALS} />
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2
          className="font-bold text-[16px]"
          style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}
        >
          Shop branches
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="text-white font-semibold text-[12.5px] px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-md"
          style={{
            backgroundColor: COLORS.vermillion,
            boxShadow: `0 4px 10px ${COLORS.vermillion}40`,
          }}
        >
          <Plus size={14} /> Add New Branch
        </button>
      </div>

      <div className="overflow-x-auto">
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
                Branch Name
              </th>
              <th
                className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b"
                style={{ borderColor: COLORS.line }}
              >
                Address
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
            {branches.map((branch, i) => (
              <tr
                key={branch.id}
                style={
                  i !== branches.length - 1
                    ? { borderBottom: `1px solid ${COLORS.line}` }
                    : undefined
                }
              >
                <td className="py-3 px-2.5" style={{ color: COLORS.muted, fontFamily: FONTS.MONO }}>
                  {branch.id}
                </td>
                <td className="py-3 px-2.5 font-semibold" style={{ color: COLORS.ink }}>
                  {branch.name}
                </td>
                <td className="py-3 px-2.5" style={{ color: COLORS.muted }}>
                  {branch.address || "—"}
                </td>
                <td className="py-3 px-2.5">
                  <button
                    onClick={() => setEditingBranch(branch)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: COLORS.peacock }}
                    title="Edit branch"
                  >
                    <Pencil size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <AddBranchModal
          onClose={() => setShowAddModal(false)}
          onCreate={handleCreateBranch}
        />
      )}

      {editingBranch && (
        <AddBranchModal
          onClose={() => setEditingBranch(null)}
          onCreate={handleUpdateBranch}
          title="Edit Branch"
          buttonLabel="Save Changes"
          initialName={editingBranch.name}
          initialAddress={editingBranch.address}
        />
      )}
    </div>
  );
}