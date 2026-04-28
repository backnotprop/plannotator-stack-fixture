import { recordAudit, getAuditLog, clearAuditLog, deriveAuditAction } from "../src/audit";

beforeEach(() => clearAuditLog());

describe("recordAudit", () => {
  it("creates an entry with incrementing id", () => {
    const entry = recordAudit("user.created", "u-target", "u-admin");
    expect(entry.id).toBe("audit-1");
    expect(entry.action).toBe("user.created");
  });

  it("stores changes diff", () => {
    const entry = recordAudit("user.role_changed", "u-target", "u-admin", {
      role: { from: "viewer", to: "editor" },
    });
    expect(entry.changes?.role).toEqual({ from: "viewer", to: "editor" });
  });
});

describe("getAuditLog", () => {
  beforeEach(() => {
    recordAudit("user.created", "u-1", "u-admin");
    recordAudit("user.updated", "u-2", "u-admin");
    recordAudit("user.suspended", "u-1", "u-admin");
  });

  it("returns all entries without filters", () => {
    expect(getAuditLog()).toHaveLength(3);
  });

  it("filters by target user", () => {
    expect(getAuditLog({ targetUserId: "u-1" })).toHaveLength(2);
  });

  it("filters by action", () => {
    expect(getAuditLog({ action: "user.suspended" })).toHaveLength(1);
  });
});

describe("deriveAuditAction", () => {
  it("returns suspended for status change to suspended", () => {
    expect(deriveAuditAction({ status: "suspended" })).toBe("user.suspended");
  });

  it("returns role_changed for role updates", () => {
    expect(deriveAuditAction({ role: "admin" })).toBe("user.role_changed");
  });

  it("returns updated for name-only changes", () => {
    expect(deriveAuditAction({ name: "New Name" })).toBe("user.updated");
  });
});
