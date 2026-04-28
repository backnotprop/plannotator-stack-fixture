import { createInvite, acceptInvite, revokeInvite, getPendingInvites, clearInvites } from "../src/invite";
import { ValidationError } from "../src/errors";

beforeEach(() => clearInvites());

describe("createInvite", () => {
  it("creates a pending invite", () => {
    const inv = createInvite("ada@example.com", "editor", "u-admin");
    expect(inv.status).toBe("pending");
    expect(inv.email).toBe("ada@example.com");
    expect(inv.role).toBe("editor");
    expect(inv.token).toHaveLength(32);
  });

  it("rejects invalid email", () => {
    expect(() => createInvite("not-an-email", "editor", "u-admin")).toThrow(ValidationError);
  });

  it("rejects duplicate pending invite", () => {
    createInvite("ada@example.com", "editor", "u-admin");
    expect(() => createInvite("ada@example.com", "viewer", "u-admin")).toThrow("pending invite");
  });

  it("rejects invalid role", () => {
    expect(() => createInvite("ada@example.com", "superuser", "u-admin")).toThrow(ValidationError);
  });
});

describe("acceptInvite", () => {
  it("marks invite as accepted", () => {
    const inv = createInvite("ada@example.com", "editor", "u-admin");
    const accepted = acceptInvite(inv.token);
    expect(accepted.status).toBe("accepted");
  });

  it("rejects unknown token", () => {
    expect(() => acceptInvite("bogus-token")).toThrow("Invalid");
  });

  it("rejects already accepted invite", () => {
    const inv = createInvite("ada@example.com", "editor", "u-admin");
    acceptInvite(inv.token);
    expect(() => acceptInvite(inv.token)).toThrow("accepted");
  });
});

describe("revokeInvite", () => {
  it("revokes a pending invite", () => {
    const inv = createInvite("ada@example.com", "editor", "u-admin");
    revokeInvite(inv.id);
    expect(getPendingInvites()).toHaveLength(0);
  });

  it("cannot revoke accepted invite", () => {
    const inv = createInvite("ada@example.com", "editor", "u-admin");
    acceptInvite(inv.token);
    expect(() => revokeInvite(inv.id)).toThrow("pending");
  });
});
