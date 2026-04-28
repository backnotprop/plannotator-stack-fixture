import { handleUpdateUserRequest } from "../src/api";
import { createUser } from "../src/user";
import { ValidationError, AuthorizationError } from "../src/errors";

const admin = createUser({ id: "u-admin", name: "Admin", email: "admin@example.com", role: "admin", status: "active" });
const editor = createUser({ id: "u-editor", name: "Editor", email: "editor@example.com", role: "editor", status: "active" });
const suspended = createUser({ id: "u-sus", name: "Sus", email: "sus@example.com", role: "admin", status: "suspended" });

describe("handleUpdateUserRequest", () => {
  it("admin can update name and role", () => {
    const result = handleUpdateUserRequest({
      actor: admin,
      targetUserId: "u-target",
      payload: { name: "Grace", role: "editor" },
    });
    expect(result.changes).toEqual({ name: "Grace", role: "editor" });
    expect(result.updatedBy).toBe("u-admin");
  });

  it("editor can update name but not role", () => {
    expect(() =>
      handleUpdateUserRequest({
        actor: editor,
        targetUserId: "u-target",
        payload: { role: "admin" },
      })
    ).toThrow(AuthorizationError);
  });

  it("editor can update their own name", () => {
    const result = handleUpdateUserRequest({
      actor: editor,
      targetUserId: "u-target",
      payload: { name: "New Name" },
    });
    expect(result.changes.name).toBe("New Name");
  });

  it("throws ValidationError for bad user id", () => {
    expect(() =>
      handleUpdateUserRequest({
        actor: admin,
        targetUserId: "",
        payload: { name: "Ada" },
      })
    ).toThrow(ValidationError);
  });

  it("throws AuthorizationError for suspended actor", () => {
    expect(() =>
      handleUpdateUserRequest({
        actor: suspended,
        targetUserId: "u-target",
        payload: { name: "Ada" },
      })
    ).toThrow(AuthorizationError);
  });

  it("throws ValidationError for empty payload", () => {
    expect(() =>
      handleUpdateUserRequest({
        actor: admin,
        targetUserId: "u-target",
        payload: {},
      })
    ).toThrow(ValidationError);
  });
});
