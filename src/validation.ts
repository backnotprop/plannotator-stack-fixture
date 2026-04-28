import { UserRole, UserStatus, UserId } from "./types";
import { ValidationError } from "./errors";

const VALID_ROLES: UserRole[] = ["admin", "editor", "viewer"];
const VALID_STATUSES: UserStatus[] = ["active", "suspended", "pending"];
const USER_ID_PATTERN = /^[a-z0-9][a-z0-9_-]{0,62}[a-z0-9]$/;

export function validateUserId(id: unknown): UserId {
  if (typeof id !== "string" || !id.trim()) {
    throw new ValidationError("id", "User ID is required", "REQUIRED");
  }
  const normalized = id.trim().toLowerCase();
  if (!USER_ID_PATTERN.test(normalized)) {
    throw new ValidationError(
      "id",
      "User ID must be 2–64 lowercase alphanumeric characters, hyphens, or underscores",
      "FORMAT"
    );
  }
  return normalized;
}

export function validateRole(role: unknown): UserRole {
  if (!VALID_ROLES.includes(role as UserRole)) {
    throw new ValidationError(
      "role",
      `Role must be one of: ${VALID_ROLES.join(", ")}`,
      "INVALID_ENUM"
    );
  }
  return role as UserRole;
}

export function validateStatus(status: unknown): UserStatus {
  if (!VALID_STATUSES.includes(status as UserStatus)) {
    throw new ValidationError(
      "status",
      `Status must be one of: ${VALID_STATUSES.join(", ")}`,
      "INVALID_ENUM"
    );
  }
  return status as UserStatus;
}

export interface UpdateUserPayload {
  name?: string;
  role?: UserRole;
  status?: UserStatus;
}

export function validateUpdateUserPayload(input: unknown): UpdateUserPayload {
  if (typeof input !== "object" || input === null) {
    throw new ValidationError("body", "Request body must be an object", "REQUIRED");
  }

  const raw = input as Record<string, unknown>;
  const payload: UpdateUserPayload = {};

  if ("name" in raw) {
    if (typeof raw.name !== "string" || !raw.name.trim()) {
      throw new ValidationError("name", "Name must be a non-empty string", "INVALID");
    }
    payload.name = raw.name.trim();
  }

  if ("role" in raw) {
    payload.role = validateRole(raw.role);
  }

  if ("status" in raw) {
    payload.status = validateStatus(raw.status);
  }

  if (Object.keys(payload).length === 0) {
    throw new ValidationError("body", "At least one field must be provided", "EMPTY");
  }

  return payload;
}
