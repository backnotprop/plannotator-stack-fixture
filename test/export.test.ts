import { exportToCsv, exportToJson, exportUsers } from "../src/export";
import { createUser } from "../src/user";

const users = [
  createUser({ id: "u-1", name: "Ada Lovelace", email: "ada@example.com", role: "admin", status: "active" }),
  createUser({ id: "u-2", name: "Bob, Builder", email: "bob@example.com", role: "editor", status: "active" }),
];

describe("exportToCsv", () => {
  it("generates header row and data rows", () => {
    const csv = exportToCsv(users);
    const lines = csv.split("\n");
    expect(lines[0]).toBe("ID,Name,Email,Role,Status,Created");
    expect(lines).toHaveLength(3);
  });

  it("escapes commas in values", () => {
    const csv = exportToCsv(users);
    expect(csv).toContain('"Bob, Builder"');
  });
});

describe("exportToJson", () => {
  it("returns valid JSON array", () => {
    const json = exportToJson(users);
    const parsed = JSON.parse(json);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].email).toBe("ada@example.com");
  });
});

describe("exportUsers", () => {
  it("dispatches to csv", () => {
    const result = exportUsers(users, "csv");
    expect(result).toContain("ID,Name");
  });

  it("dispatches to json", () => {
    const result = exportUsers(users, "json");
    expect(result).toContain('"email"');
  });
});
