import { User } from "./types";
import { isActiveUser } from "./user";
import { roleHasPermission, ResourceType, Action } from "./permissions";

export interface AuthContext {
  actor: User;
  resource: ResourceType;
  action: Action;
}

export function canAccessResource(
  actor: User,
  resource: ResourceType,
  action: Action
): boolean {
  if (!isActiveUser(actor)) return false;
  return roleHasPermission(actor.role, resource, action);
}

export function assertCanAccess(
  actor: User,
  resource: ResourceType,
  action: Action
): void {
  if (!canAccessResource(actor, resource, action)) {
    throw new Error(
      `User ${actor.id} (${actor.role}) cannot ${action} ${resource}`
    );
  }
}
