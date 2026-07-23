import React from "react";

export function usePageState(initialPage = "dashboard") {
  const [activePage, setActivePage] = React.useState(initialPage);
  const [selectedRole, setSelectedRole] = React.useState(null);
  const [selectedBranchRole, setSelectedBranchRole] = React.useState(null);
  const [transferHistory, setTransferHistory] = React.useState([]);

  const addTransferRecord = (record) =>
    setTransferHistory((prev) => [record, ...prev]);

  return {
    activePage,
    setActivePage,
    selectedRole,
    setSelectedRole,
    selectedBranchRole,
    setSelectedBranchRole,
    transferHistory,
    addTransferRecord,
  };
}