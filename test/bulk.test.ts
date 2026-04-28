import { handleBulkUpdate, handleBulkInvite } from "../src/bulk";
import { createUser } from "../src/user";
import { clearAuditLog, getAuditLog } from "../src/audit";
import { clearInvites, getPendingInvites } from "../src/invite";

const admin = createUser({ id: "u-admin", name: "Admin", email: "admin@example.com", role: "admin", status: "active" });

beforeEach(() => {
  clearAuditLog();
  clearInvites();
});

describe("handleBulkUpdate", () => {
  it("updates multiple users, collecting failures", () => {
    const result = handleBulkUpdate({
      actor: admin,
      userIds: ["u-one", "u-two", ""],
      changes: { name: "Updated" },
    });
    expect(result.succeeded).toHaveLength(2);
    expect(result.failed).toHaveLength(1);
    expect(result.failed[0].userId).toBe("");
  });

  it("records audit entries for successes", () => {
    handleBulkUpdate({
      actor: admin,
      userIds: ["u-one", "u-two"],
      changes: { status: "suspended" },
    });
    expect(getAuditLog({ action: "user.suspended" })).toHaveLength(2);
  });
});

describe("handleBulkInvite", () => {
  it("sends multiple invites", () => {
    const result = handleBulkInvite({
      actor: admin,
      invites: [
        { email: "a@example.com", role: "editor" },
        { email: "b@example.com", role: "viewer" },
      ],
    });
    expect(result.sent).toHaveLength(2);
    expect(getPendingInvites()).toHaveLength(2);
  });

  it("collects failures for bad emails", () => {
    const result = handleBulkInvite({
      actor: admin,
      invites: [
        { email: "good@example.com", role: "editor" },
        { email: "bad-email", role: "viewer" },
      ],
    });
    expect(result.sent).toHaveLength(1);
    expect(result.failed).toHaveLength(1);
  });
});
