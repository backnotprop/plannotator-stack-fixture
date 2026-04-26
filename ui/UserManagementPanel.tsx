import React, { useState } from "react";
import { User } from "../src/types";
import { canAccessResource } from "../src/auth";
import { formatUserLabel } from "../src/format";
import { UserRow } from "./components/UserRow";
import { EditUserModal } from "./components/EditUserModal";
import { useUpdateUser } from "./hooks/useUpdateUser";

interface Props {
  users: User[];
  actor: User;
  onUsersChange?: (updated: User[]) => void;
}

export function UserManagementPanel({ users, actor, onUsersChange }: Props) {
  const [editTarget, setEditTarget] = useState<User | null>(null);
  const { updateUser, error } = useUpdateUser();

  const canManage = canAccessResource(actor, "user", "write");

  async function handleSave(userId: string, changes: Partial<User>) {
    await updateUser({ targetUserId: userId, changes, actor });
    if (onUsersChange) {
      onUsersChange(
        users.map((u) => (u.id === userId ? { ...u, ...changes } : u))
      );
    }
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Users</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>
            Signed in as {formatUserLabel(actor)}
          </p>
        </div>
        <span style={{ fontSize: 13, color: "#9ca3af" }}>{users.length} members</span>
      </div>

      {error && (
        <div style={{ padding: "10px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6, color: "#dc2626", fontSize: 13, marginBottom: 12 }}>
          {error}
        </div>
      )}

      {!canManage && (
        <div style={{ padding: "10px 14px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 6, color: "#6b7280", fontSize: 13, marginBottom: 12 }}>
          You have read-only access to this list.
        </div>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
        <thead>
          <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
            <th style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>User</th>
            <th style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Role</th>
            <th style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</th>
            <th style={{ padding: "10px 16px" }} />
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              actor={actor}
              onEdit={setEditTarget}
            />
          ))}
        </tbody>
      </table>

      {editTarget && (
        <EditUserModal
          user={editTarget}
          actor={actor}
          onSave={handleSave}
          onClose={() => setEditTarget(null)}
        />
      )}
    </div>
  );
}
