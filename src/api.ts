import { User } from "./types";
import { canAccessResource } from "./auth";
import { validateUserId, validateUpdateUserPayload, UpdateUserPayload } from "./validation";
import { AuthorizationError } from "./errors";

export interface UpdateUserRequest {
  targetUserId: unknown;
  payload: unknown;
  actor: User;
}

export interface UpdateUserResult {
  userId: string;
  changes: UpdateUserPayload;
  updatedBy: string;
}

export function handleUpdateUserRequest(req: UpdateUserRequest): UpdateUserResult {
  const targetId = validateUserId(req.targetUserId);
  const changes = validateUpdateUserPayload(req.payload);

  if (!canAccessResource(req.actor, "user", "write")) {
    throw new AuthorizationError(req.actor.id, "user", "write");
  }

  // admins are the only role that can change another user's role or status
  if ((changes.role || changes.status) && req.actor.role !== "admin") {
    throw new AuthorizationError(req.actor.id, "user.role/status", "write");
  }

  return {
    userId: targetId,
    changes,
    updatedBy: req.actor.id,
  };
}
