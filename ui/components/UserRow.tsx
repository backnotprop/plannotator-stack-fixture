import React from "react";
import { User } from "../../src/types";
import { formatDisplayName } from "../../src/format";
import { canAccessResource } from "../../src/auth";
import { RoleBadge } from "./RoleBadge";
import { StatusDot } from "./StatusDot";

interface Props {
  user: User;
  actor: User;
  onEdit: (user: User) => void;
}

export function UserRow({ user, actor, onEdit }: Props) {
  const canEdit = canAccessResource(actor, "user", "write");

  return (
    <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
      <td style={{ padding: "12px 16px" }}>
        <div style={{ fontWeight: 500, fontSize: 14 }}>{formatDisplayName(user)}</div>
        <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{user.email}</div>
      </td>
      <td style={{ padding: "12px 16px" }}>
        <RoleBadge role={user.role} />
      </td>
      <td style={{ padding: "12px 16px" }}>
        <StatusDot status={user.status} />
      </td>
      <td style={{ padding: "12px 16px", textAlign: "right" }}>
        {canEdit && (
          <button
            onClick={() => onEdit(user)}
            style={{
              fontSize: 13,
              color: "#4f46e5",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: 4,
            }}
          >
            Edit
          </button>
        )}
      </td>
    </tr>
  );
}
