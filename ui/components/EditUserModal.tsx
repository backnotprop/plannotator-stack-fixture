import React, { useState } from "react";
import { User, UserRole } from "../../src/types";
import { validateUpdateUserPayload } from "../../src/validation";
import { ValidationError } from "../../src/errors";
import { formatDisplayName } from "../../src/format";

interface Props {
  user: User;
  actor: User;
  onSave: (userId: string, changes: { name?: string; role?: UserRole }) => Promise<void>;
  onClose: () => void;
}

export function EditUserModal({ user, actor, onSave, onClose }: Props) {
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState<UserRole>(user.role);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const canChangeRole = actor.role === "admin";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const changes = validateUpdateUserPayload({
        name: name !== user.name ? name : undefined,
        role: role !== user.role ? role : undefined,
      });
      setSaving(true);
      await onSave(user.id, changes);
      onClose();
    } catch (err) {
      if (err instanceof ValidationError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: "#fff", borderRadius: 8, padding: 24, width: 360, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
        <h2 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600 }}>
          Edit {formatDisplayName(user)}
        </h2>

        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ display: "block", width: "100%", marginTop: 4, padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14, boxSizing: "border-box" }}
            />
          </label>

          {canChangeRole && (
            <label style={{ display: "block", marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>Role</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                style={{ display: "block", width: "100%", marginTop: 4, padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14, boxSizing: "border-box" }}
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </label>
          )}

          {error && (
            <p style={{ fontSize: 13, color: "#dc2626", margin: "0 0 12px" }}>{error}</p>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button type="button" onClick={onClose} style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #d1d5db", background: "#fff", fontSize: 14, cursor: "pointer" }}>
              Cancel
            </button>
            <button type="submit" disabled={saving} style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: "#4f46e5", color: "#fff", fontSize: 14, fontWeight: 500, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
