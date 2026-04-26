import { User, UserRole } from "./types";

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrator",
  editor: "Editor",
  viewer: "Viewer",
};

export function formatDisplayName(user: User): string {
  return user.name.trim() || user.email.split("@")[0];
}

export function formatUserLabel(user: User): string {
  const role = ROLE_LABELS[user.role];
  return `${formatDisplayName(user)} (${role})`;
}

export function formatUserId(id: string): string {
  return `user:${id}`;
}
