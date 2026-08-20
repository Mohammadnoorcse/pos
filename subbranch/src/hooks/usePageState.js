import React from "react";

export function usePageState(initialPage = "dashboard") {
  const [activePage, setActivePage] = React.useState(initialPage);
  const [selectedRole, setSelectedRole] = React.useState(null);
  const [selectedStaff, setSelectedStaff] = React.useState(null);
  const [transferHistory, setTransferHistory] = React.useState([]);

  const addTransferRecord = (record) =>
    setTransferHistory((prev) => [record, ...prev]);

  return {
    activePage,
    setActivePage,
    selectedRole,
    setSelectedRole,
    selectedStaff,
    setSelectedStaff,
    transferHistory,
    addTransferRecord,
  };
}