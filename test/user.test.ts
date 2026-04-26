import { createUser, normalizeUserId, isActiveUser } from "../src/user";
import { formatDisplayName, formatUserLabel } from "../src/format";

describe("normalizeUserId", () => {
  it("lowercases and trims", () => {
    expect(normalizeUserId("  ABC-123  ")).toBe("abc-123");
  });

  it("is idempotent", () => {
    expect(normalizeUserId(normalizeUserId("User-99"))).toBe("user-99");
  });
});

describe("createUser", () => {
  it("defaults to viewer + pending", () => {
    const user = createUser({ id: "u1", name: "Ada", email: "ada@example.com" });
    expect(user.role).toBe("viewer");
    expect(user.status).toBe("pending");
  });

  it("normalizes id and email", () => {
    const user = createUser({ id: "  U1  ", name: "Ada", email: "  Ada@Example.COM  " });
    expect(user.id).toBe("u1");
    expect(user.email).toBe("ada@example.com");
  });
});

describe("isActiveUser", () => {
  it("returns true for active status", () => {
    const user = createUser({ id: "u1", name: "Ada", email: "ada@example.com", status: "active" });
    expect(isActiveUser(user)).toBe(true);
  });

  it("returns false for suspended", () => {
    const user = createUser({ id: "u1", name: "Ada", email: "ada@example.com", status: "suspended" });
    expect(isActiveUser(user)).toBe(false);
  });
});

describe("formatDisplayName", () => {
  it("falls back to email prefix when name is blank", () => {
    const user = createUser({ id: "u1", name: "  ", email: "ada@example.com" });
    expect(formatDisplayName(user)).toBe("ada");
  });
});

describe("formatUserLabel", () => {
  it("includes expanded role name", () => {
    const user = createUser({ id: "u1", name: "Ada", email: "ada@example.com", role: "admin" });
    expect(formatUserLabel(user)).toBe("Ada (Administrator)");
  });
});
