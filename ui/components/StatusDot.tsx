import React from "react";
import { UserStatus } from "../../src/types";

const COLORS: Record<UserStatus, string> = {
  active:    "#22c55e",
  suspended: "#ef4444",
  pending:   "#f59e0b",
};

const LABELS: Record<UserStatus, string> = {
  active:    "Active",
  suspended: "Suspended",
  pending:   "Pending",
};

interface Props {
  status: UserStatus;
}

export function StatusDot({ status }: Props) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: COLORS[status],
          display: "inline-block",
        }}
      />
      <span style={{ fontSize: 13, color: "#6b7280" }}>{LABELS[status]}</span>
    </span>
  );
}
