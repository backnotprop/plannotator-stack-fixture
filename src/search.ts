import { User, UserRole, UserStatus } from "./types";

export interface UserSearchFilter {
  query?: string;
  role?: UserRole;
  status?: UserStatus;
  createdAfter?: Date;
  createdBefore?: Date;
}

export function matchesFilter(user: User, filter: UserSearchFilter): boolean {
  if (filter.query) {
    const q = filter.query.toLowerCase();
    const inName = user.name.toLowerCase().includes(q);
    const inEmail = user.email.toLowerCase().includes(q);
    if (!inName && !inEmail) return false;
  }

  if (filter.role && user.role !== filter.role) return false;
  if (filter.status && user.status !== filter.status) return false;

  if (filter.createdAfter && user.createdAt < filter.createdAfter) return false;
  if (filter.createdBefore && user.createdAt > filter.createdBefore) return false;

  return true;
}

export function filterUsers(users: User[], filter: UserSearchFilter): User[] {
  return users.filter((u) => matchesFilter(u, filter));
}

export type SortField = "name" | "email" | "role" | "createdAt";
export type SortDirection = "asc" | "desc";

export function sortUsers(
  users: User[],
  field: SortField,
  direction: SortDirection = "asc"
): User[] {
  const sorted = [...users].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];
    if (aVal < bVal) return -1;
    if (aVal > bVal) return 1;
    return 0;
  });
  return direction === "desc" ? sorted.reverse() : sorted;
}
