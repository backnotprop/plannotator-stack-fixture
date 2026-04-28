import { User } from "./types";
import { UserSearchFilter, filterUsers, sortUsers, SortField, SortDirection } from "./search";
import { PaginationParams, PaginatedResult, paginate, validatePaginationParams } from "./pagination";
import { canAccessResource } from "./auth";
import { AuthorizationError } from "./errors";

export interface ListUsersRequest {
  actor: User;
  filter?: UserSearchFilter;
  sort?: { field: SortField; direction?: SortDirection };
  pagination?: { page?: unknown; perPage?: unknown };
}

export type ListUsersResult = PaginatedResult<User>;

export function handleListUsersRequest(
  allUsers: User[],
  req: ListUsersRequest
): ListUsersResult {
  if (!canAccessResource(req.actor, "user", "read")) {
    throw new AuthorizationError(req.actor.id, "user", "read");
  }

  let result = req.filter ? filterUsers(allUsers, req.filter) : [...allUsers];

  if (req.sort) {
    result = sortUsers(result, req.sort.field, req.sort.direction);
  }

  const paginationParams: PaginationParams = validatePaginationParams(
    req.pagination ?? {}
  );

  return paginate(result, paginationParams);
}
