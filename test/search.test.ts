import { matchesFilter, filterUsers, sortUsers } from "../src/search";
import { createUser } from "../src/user";

const users = [
  createUser({ id: "u-ada", name: "Ada Lovelace", email: "ada@example.com", role: "admin", status: "active" }),
  createUser({ id: "u-bob", name: "Bob Builder", email: "bob@example.com", role: "editor", status: "active" }),
  createUser({ id: "u-eve", name: "Eve Eavesdrop", email: "eve@example.com", role: "viewer", status: "suspended" }),
];

describe("matchesFilter", () => {
  it("matches by name substring", () => {
    expect(matchesFilter(users[0], { query: "ada" })).toBe(true);
    expect(matchesFilter(users[1], { query: "ada" })).toBe(false);
  });

  it("matches by role", () => {
    expect(matchesFilter(users[0], { role: "admin" })).toBe(true);
    expect(matchesFilter(users[1], { role: "admin" })).toBe(false);
  });

  it("matches by status", () => {
    expect(matchesFilter(users[2], { status: "suspended" })).toBe(true);
    expect(matchesFilter(users[0], { status: "suspended" })).toBe(false);
  });
});

describe("filterUsers", () => {
  it("returns all for empty filter", () => {
    expect(filterUsers(users, {})).toHaveLength(3);
  });

  it("filters by combined criteria", () => {
    expect(filterUsers(users, { role: "editor", status: "active" })).toHaveLength(1);
  });
});

describe("sortUsers", () => {
  it("sorts by name ascending", () => {
    const sorted = sortUsers(users, "name");
    expect(sorted[0].name).toBe("Ada Lovelace");
    expect(sorted[2].name).toBe("Eve Eavesdrop");
  });

  it("sorts descending", () => {
    const sorted = sortUsers(users, "name", "desc");
    expect(sorted[0].name).toBe("Eve Eavesdrop");
  });
});
