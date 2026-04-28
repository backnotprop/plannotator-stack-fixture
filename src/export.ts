import { User } from "./types";
import { formatDisplayName } from "./format";

export type ExportFormat = "csv" | "json";

export interface ExportColumn {
  key: keyof User | "displayName";
  label: string;
}

const DEFAULT_COLUMNS: ExportColumn[] = [
  { key: "id", label: "ID" },
  { key: "displayName", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "status", label: "Status" },
  { key: "createdAt", label: "Created" },
];

function resolveColumn(user: User, col: ExportColumn): string {
  if (col.key === "displayName") return formatDisplayName(user);
  const val = user[col.key];
  if (val instanceof Date) return val.toISOString();
  return String(val);
}

function escapeCsvField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportToCsv(
  users: User[],
  columns: ExportColumn[] = DEFAULT_COLUMNS
): string {
  const header = columns.map((c) => escapeCsvField(c.label)).join(",");
  const rows = users.map((user) =>
    columns.map((col) => escapeCsvField(resolveColumn(user, col))).join(",")
  );
  return [header, ...rows].join("\n");
}

export function exportToJson(
  users: User[],
  columns: ExportColumn[] = DEFAULT_COLUMNS
): string {
  const data = users.map((user) =>
    Object.fromEntries(
      columns.map((col) => [col.key, resolveColumn(user, col)])
    )
  );
  return JSON.stringify(data, null, 2);
}

export function exportUsers(
  users: User[],
  format: ExportFormat,
  columns?: ExportColumn[]
): string {
  switch (format) {
    case "csv":
      return exportToCsv(users, columns);
    case "json":
      return exportToJson(users, columns);
  }
}
