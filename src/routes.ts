import { ResourceType, Action } from "./permissions";

export interface RoutePermission {
  resource: ResourceType;
  action: Action;
}

export interface RouteMeta {
  path: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  permission: RoutePermission;
  description: string;
}

export const ROUTES: RouteMeta[] = [
  {
    path: "/documents",
    method: "GET",
    permission: { resource: "document", action: "read" },
    description: "List all documents",
  },
  {
    path: "/documents/:id",
    method: "PUT",
    permission: { resource: "document", action: "write" },
    description: "Update a document",
  },
  {
    path: "/documents/:id",
    method: "DELETE",
    permission: { resource: "document", action: "delete" },
    description: "Delete a document",
  },
  {
    path: "/users/:id",
    method: "PATCH",
    permission: { resource: "user", action: "write" },
    description: "Update a user",
  },
  {
    path: "/workspaces/:id/members",
    method: "POST",
    permission: { resource: "workspace", action: "manage" },
    description: "Add workspace member",
  },
];

export function getRoutePermission(
  path: string,
  method: RouteMeta["method"]
): RoutePermission | undefined {
  return ROUTES.find((r) => r.path === path && r.method === method)?.permission;
}
