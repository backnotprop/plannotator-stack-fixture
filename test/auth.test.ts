import { canAccessResource, assertCanAccess } from "../src/auth";
import { createUser } from "../src/user";

const admin = createUser({ id: "u-admin", name: "Admin", email: "admin@example.com", role: "admin", status: "active" });
const editor = createUser({ id: "u-editor", name: "Editor", email: "editor@example.com", role: "editor", status: "active" });
const viewer = createUser({ id: "u-viewer", name: "Viewer", email: "viewer@example.com", role: "viewer", status: "active" });
const suspended = createUser({ id: "u-sus", name: "Sus", email: "sus@example.com", role: "admin", status: "suspended" });

describe("canAccessResource", () => {
  it("admin can manage users", () => {
    expect(canAccessResource(admin, "user", "manage")).toBe(true);
  });

  it("editor can write documents", () => {
    expect(canAccessResource(editor, "document", "write")).toBe(true);
  });

  it("editor cannot manage users", () => {
    expect(canAccessResource(editor, "user", "manage")).toBe(false);
  });

  it("viewer can only read documents", () => {
    expect(canAccessResource(viewer, "document", "read")).toBe(true);
    expect(canAccessResource(viewer, "document", "write")).toBe(false);
  });

  it("suspended admin is denied regardless of role", () => {
    expect(canAccessResource(suspended, "document", "read")).toBe(false);
  });

  it("viewer has no billing access", () => {
    expect(canAccessResource(viewer, "billing", "read")).toBe(false);
  });
});

describe("assertCanAccess", () => {
  it("throws with role info on denial", () => {
    expect(() => assertCanAccess(viewer, "user", "write")).toThrow(
      "viewer"
    );
  });

  it("does not throw when access is granted", () => {
    expect(() => assertCanAccess(admin, "billing", "manage")).not.toThrow();
  });
});
