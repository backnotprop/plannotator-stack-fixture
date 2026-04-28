import { User, UserId, UserRole, UserStatus } from "./types";

export function createUser(params: {
  id: UserId;
  name: string;
  email: string;
  role?: UserRole;
  status?: UserStatus;
}): User {
  return {
    id: normalizeUserId(params.id),
    name: params.name.trim(),
    email: params.email.toLowerCase().trim(),
    role: params.role ?? "viewer",
    status: params.status ?? "pending",
    createdAt: new Date(),
  };
}

export function normalizeUserId(id: UserId): UserId {
  return id.toLowerCase().trim();
}

export function isActiveUser(user: User): boolean {
  return user.status === "active";
}

export function getUserSummary(user: User) {
  return {
    id: user.id,
    displayName: user.name,
    role: user.role,
  };
}
