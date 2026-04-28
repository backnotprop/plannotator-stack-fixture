import { User, UserRole, UserStatus } from "./types";
import { handleUpdateUserRequest, UpdateUserResult } from "./api";
import { createInvite, Invite } from "./invite";
import { recordAudit, deriveAuditAction } from "./audit";

export interface BulkUpdateRequest {
  actor: User;
  userIds: string[];
  changes: { name?: string; role?: UserRole; status?: UserStatus };
}

export interface BulkUpdateResult {
  succeeded: UpdateUserResult[];
  failed: { userId: string; error: string }[];
}

export function handleBulkUpdate(req: BulkUpdateRequest): BulkUpdateResult {
  const succeeded: UpdateUserResult[] = [];
  const failed: { userId: string; error: string }[] = [];

  for (const userId of req.userIds) {
    try {
      const result = handleUpdateUserRequest({
        actor: req.actor,
        targetUserId: userId,
        payload: req.changes,
      });
      succeeded.push(result);
      recordAudit(
        deriveAuditAction(req.changes),
        userId,
        req.actor.id,
        Object.fromEntries(
          Object.entries(req.changes).map(([k, v]) => [k, { from: null, to: v }])
        )
      );
    } catch (err) {
      failed.push({
        userId,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  return { succeeded, failed };
}

export interface BulkInviteRequest {
  actor: User;
  invites: { email: string; role: UserRole }[];
}

export interface BulkInviteResult {
  sent: Invite[];
  failed: { email: string; error: string }[];
}

export function handleBulkInvite(req: BulkInviteRequest): BulkInviteResult {
  const sent: Invite[] = [];
  const failed: { email: string; error: string }[] = [];

  for (const item of req.invites) {
    try {
      const invite = createInvite(item.email, item.role, req.actor.id);
      sent.push(invite);
    } catch (err) {
      failed.push({
        email: item.email,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  return { sent, failed };
}
