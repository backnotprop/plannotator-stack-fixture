import { handleListUsersRequest } from "../src/list-api";
import { createUser } from "../src/user";
import { AuthorizationError } from "../src/errors";

const admin = createUser({ id: "u-admin", name: "Admin", email: "admin@example.com", role: "admin", status: "active" });
const viewer = createUser({ id: "u-viewer", name: "Viewer", email: "viewer@example.com", role: "viewer", status: "active" });

const allUsers = [
  createUser({ id: "u-1", name: "Alice", email: "alice@example.com", role: "editor", status: "active" }),
  createUser({ id: "u-2", name: "Bob", email: "bob@example.com", role: "viewer", status: "active" }),
  createUser({ id: "u-3", name: "Charlie", email: "charlie@example.com", role: "admin", status: "suspended" }),
];

describe("handleListUsersRequest", () => {
  it("returns paginated users for admin", () => {
    const result = handleListUsersRequest(allUsers, { actor: admin });
    expect(result.items).toHaveLength(3);
    expect(result.total).toBe(3);
  });

  it("filters by role", () => {
    const result = handleListUsersRequest(allUsers, {
      actor: admin,
      filter: { role: "editor" },
    });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].name).toBe("Alice");
  });

  it("paginates correctly", () => {
    const result = handleListUsersRequest(allUsers, {
      actor: admin,
      pagination: { page: 1, perPage: 2 },
    });
    expect(result.items).toHaveLength(2);
    expect(result.hasNext).toBe(true);
  });

  it("throws for viewer (no user read access)", () => {
    expect(() =>
      handleListUsersRequest(allUsers, { actor: viewer })
    ).toThrow(AuthorizationError);
  });
});
