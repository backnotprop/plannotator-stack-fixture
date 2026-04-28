import { UserRole, UserId } from "./types";
import { ValidationError } from "./errors";
import { validateRole } from "./validation";

export type InviteStatus = "pending" | "accepted" | "expired" | "revoked";

export interface Invite {
  id: string;
  email: string;
  role: UserRole;
  invitedBy: UserId;
  status: InviteStatus;
  token: string;
  createdAt: Date;
  expiresAt: Date;
}

const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
let invites: Invite[] = [];
let nextInviteId = 1;

function generateToken(): string {
  return Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 36).toString(36)
  ).join("");
}

export function createInvite(
  email: string,
  role: unknown,
  invitedBy: UserId
): Invite {
  if (!email || !email.includes("@")) {
    throw new ValidationError("email", "Valid email is required", "FORMAT");
  }

  const existing = invites.find(
    (i) => i.email === email && i.status === "pending"
  );
  if (existing) {
    throw new ValidationError(
      "email",
      "A pending invite already exists for this email",
      "DUPLICATE"
    );
  }

  const validRole = validateRole(role);
  const now = new Date();
  const invite: Invite = {
    id: `inv-${nextInviteId++}`,
    email: email.toLowerCase().trim(),
    role: validRole,
    invitedBy,
    status: "pending",
    token: generateToken(),
    createdAt: now,
    expiresAt: new Date(now.getTime() + INVITE_TTL_MS),
  };
  invites.push(invite);
  return invite;
}

export function acceptInvite(token: string): Invite {
  const invite = invites.find((i) => i.token === token);
  if (!invite) {
    throw new ValidationError("token", "Invalid invite token", "NOT_FOUND");
  }
  if (invite.status !== "pending") {
    throw new ValidationError("token", `Invite is ${invite.status}`, "INVALID_STATE");
  }
  if (new Date() > invite.expiresAt) {
    invite.status = "expired";
    throw new ValidationError("token", "Invite has expired", "EXPIRED");
  }
  invite.status = "accepted";
  return invite;
}

export function revokeInvite(inviteId: string): void {
  const invite = invites.find((i) => i.id === inviteId);
  if (!invite) throw new ValidationError("id", "Invite not found", "NOT_FOUND");
  if (invite.status !== "pending") {
    throw new ValidationError("id", "Can only revoke pending invites", "INVALID_STATE");
  }
  invite.status = "revoked";
}

export function getPendingInvites(): Invite[] {
  return invites.filter((i) => i.status === "pending");
}

export function clearInvites(): void {
  invites = [];
  nextInviteId = 1;
}
