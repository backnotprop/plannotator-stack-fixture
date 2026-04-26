export interface User {
  id: string;
  name: string;
  roles: string[];
}

export function getUser(id: string): User {
  if (!id.trim()) {
    throw new Error("id is required");
  }

  return { id, name: "Ada", roles: ["reader"] };
}

export function hasRole(user: User, role: string): boolean {
  return user.roles.includes(role);
}
