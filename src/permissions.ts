import { UserRole } from "./types";

export type ResourceType = "document" | "workspace" | "user" | "billing";
export type Action = "read" | "write" | "delete" | "manage";

type PermissionMatrix = Record<ResourceType, Action[]>;

const ROLE_PERMISSIONS: Record<UserRole, PermissionMatrix> = {
  admin: {
    document: ["read", "write", "delete", "manage"],
    workspace: ["read", "write", "delete", "manage"],
    user: ["read", "write", "delete", "manage"],
    billing: ["read", "manage"],
  },
  editor: {
    document: ["read", "write", "delete"],
    workspace: ["read", "write"],
    user: ["read"],
    billing: [],
  },
  viewer: {
    document: ["read"],
    workspace: ["read"],
    user: [],
    billing: [],
  },
};

export function getRolePermissions(role: UserRole): PermissionMatrix {
  return ROLE_PERMISSIONS[role];
}

export function roleHasPermission(
  role: UserRole,
  resource: ResourceType,
  action: Action
): boolean {
  return ROLE_PERMISSIONS[role][resource].includes(action);
}
