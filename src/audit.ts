import { UserId, UserRole, UserStatus } from "./types";

export type AuditAction =
  | "user.created"
  | "user.updated"
  | "user.suspended"
  | "user.activated"
  | "user.role_changed"
  | "user.invited"
  | "user.deleted";

export interface AuditEntry {
  id: string;
  action: AuditAction;
  targetUserId: UserId;
  actorId: UserId;
  timestamp: Date;
  changes?: Record<string, { from: unknown; to: unknown }>;
  metadata?: Record<string, unknown>;
}

let auditLog: AuditEntry[] = [];
let nextId = 1;

export function recordAudit(
  action: AuditAction,
  targetUserId: UserId,
  actorId: UserId,
  changes?: AuditEntry["changes"],
  metadata?: AuditEntry["metadata"]
): AuditEntry {
  const entry: AuditEntry = {
    id: `audit-${nextId++}`,
    action,
    targetUserId,
    actorId,
    timestamp: new Date(),
    changes,
    metadata,
  };
  auditLog.push(entry);
  return entry;
}

export function getAuditLog(filters?: {
  targetUserId?: UserId;
  actorId?: UserId;
  action?: AuditAction;
  since?: Date;
}): AuditEntry[] {
  let entries = [...auditLog];
  if (filters?.targetUserId) entries = entries.filter((e) => e.targetUserId === filters.targetUserId);
  if (filters?.actorId) entries = entries.filter((e) => e.actorId === filters.actorId);
  if (filters?.action) entries = entries.filter((e) => e.action === filters.action);
  if (filters?.since) entries = entries.filter((e) => e.timestamp >= filters.since);
  return entries;
}

export function clearAuditLog(): void {
  auditLog = [];
  nextId = 1;
}

export function deriveAuditAction(changes: {
  role?: UserRole;
  status?: UserStatus;
  name?: string;
}): AuditAction {
  if (changes.status === "suspended") return "user.suspended";
  if (changes.status === "active") return "user.activated";
  if (changes.role) return "user.role_changed";
  return "user.updated";
}
