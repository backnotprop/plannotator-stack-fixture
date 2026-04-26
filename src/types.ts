export type UserId = string;

export type UserRole = "admin" | "editor" | "viewer";

export type UserStatus = "active" | "suspended" | "pending";

export interface User {
  id: UserId;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
}

export interface UserSummary {
  id: UserId;
  displayName: string;
  role: UserRole;
}
