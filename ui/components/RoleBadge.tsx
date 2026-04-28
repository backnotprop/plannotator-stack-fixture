import React from "react";
import { UserRole } from "../../src/types";

const STYLES: Record<UserRole, { bg: string; text: string }> = {
  admin:  { bg: "#fef3c7", text: "#92400e" },
  editor: { bg: "#dbeafe", text: "#1e40af" },
  viewer: { bg: "#f3f4f6", text: "#374151" },
};

const LABELS: Record<UserRole, string> = {
  admin:  "Admin",
  editor: "Editor",
  viewer: "Viewer",
};

interface Props {
  role: UserRole;
}

export function RoleBadge({ role }: Props) {
  const { bg, text } = STYLES[role];
  return (
    <span
      style={{
        backgroundColor: bg,
        color: text,
        padding: "2px 8px",
        borderRadius: 9999,
        fontSize: 12,
        fontWeight: 500,
        whiteSpace: "nowrap",
      }}
    >
      {LABELS[role]}
    </span>
  );
}
