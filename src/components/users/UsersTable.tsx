import React from "react";
import { useNavigate } from "react-router-dom";
import { formatDate, isDefaultUser } from "../../utils/helpers";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import EmptyState from "../common/EmptyState";
import ErrorState from "../common/ErrorState";
import type { User } from "../../types";

// ── Types ──────────────────────────────────────────────────────

interface SortConfig {
  field: string;
  dir: "asc" | "desc";
}

interface Props {
  users: User[];
  loading: boolean;
  error: string | null;
  sortConfig: SortConfig;
  onSort: (field: string) => void;
  onDeleteClick: (user: User) => void;
  onRetry: () => void;
}

// ── Sortable columns config ────────────────────────────────────

const COLUMNS: {
  key: string;
  label: string;
  sortable: boolean;
  className?: string;
}[] = [
  { key: "id",          label: "شناسه",        sortable: false, className: "w-16" },
  { key: "username",    label: "نام کاربری",   sortable: true  },
  { key: "email",       label: "ایمیل",        sortable: true  },
  { key: "first_name",  label: "نام کامل",     sortable: true  },
  { key: "role",        label: "نقش",          sortable: false },
  { key: "is_active",   label: "وضعیت",        sortable: true  },
  { key: "date_joined", label: "تاریخ عضویت",  sortable: true  },
  { key: "actions",     label: "عملیات",       sortable: false, className: "w-24" },
];

// ── Sort Icon ──────────────────────────────────────────────────

function SortIcon({ field, sortConfig }: { field: string; sortConfig: SortConfig }) {
  if (sortConfig.field !== field) {
    return <span className="text-gray-300 dark:text-gray-600 text-xs">↕</span>;
  }
  return (
    <span className="text-blue-500 text-xs font-bold">
      {sortConfig.dir === "asc" ? "↑" : "↓"}
    </span>
  );
}

// ── Avatar ─────────────────────────────────────────────────────

function UserAvatar({ username }: { username: string }) {
  const colors = [
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-pink-600",
    "from-green-500 to-teal-600",
    "from-orange-500 to-red-500",
    "from-cyan-500 to-blue-500",
  ];
  // Pick color based on first char code for consistency
  const idx = (username.charCodeAt(0) || 0) % colors.length;
  return (
    <div
      className={`w-8 h-8 rounded-full bg-gradient-to-br ${colors[idx]} flex items-center justify-center text-white text-xs font-bold shrink-0 select-none`}
    >
      {(username?.[0] ?? "?").toUpperCase()}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────

export default function UsersTable({
  users,
  loading,
  error,
  sortConfig,
  onSort,
  onDeleteClick,
  onRetry,
}: Props) {
  const navigate = useNavigate();

  // Loading skeleton rows
  if (loading && users.length === 0) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <TableHead sortConfig={sortConfig} onSort={onSort} />
          <tbody>
            <tr>
              <td colSpan={COLUMNS.length}>
                <div className="flex items-center justify-center py-20">
                  <Spinner size="lg" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <TableHead sortConfig={sortConfig} onSort={onSort} />
          <tbody>
            <tr>
              <td colSpan={COLUMNS.length}>
                <ErrorState message={error} onRetry={onRetry} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  // Empty state
  if (users.length === 0) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <TableHead sortConfig={sortConfig} onSort={onSort} />
          <tbody>
            <tr>
              <td colSpan={COLUMNS.length}>
                <EmptyState message="هیچ کاربری با این مشخصات یافت نشد." />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <TableHead sortConfig={sortConfig} onSort={onSort} />
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              onEdit={() => navigate(`/users/${user.id}/edit`)}
              onDelete={() => onDeleteClick(user)}
            />
          ))}
        </tbody>
      </table>

      {/* Subtle loading overlay when refreshing existing data */}
      {loading && users.length > 0 && (
        <div className="flex items-center justify-center gap-2 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <Spinner size="sm" />
          <span className="text-xs text-gray-400">در حال بروزرسانی...</span>
        </div>
      )}
    </div>
  );
}

// ── Table Head (extracted for reuse in empty/error states) ─────

function TableHead({
  sortConfig,
  onSort,
}: {
  sortConfig: SortConfig;
  onSort: (field: string) => void;
}) {
  return (
    <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
      <tr>
        {COLUMNS.map((col) => (
          <th
            key={col.key}
            className={`px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${col.className ?? ""} ${
              col.sortable
                ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors select-none"
                : ""
            }`}
            onClick={() => col.sortable && onSort(col.key)}
          >
            <span className="inline-flex items-center justify-end gap-1.5">
              {col.label}
              {col.sortable && (
                <SortIcon field={col.key} sortConfig={sortConfig} />
              )}
            </span>
          </th>
        ))}
      </tr>
    </thead>
  );
}

// ── User Row ───────────────────────────────────────────────────

function UserRow({
  user,
  onEdit,
  onDelete,
}: {
  user: User;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const isDef = isDefaultUser(user.id, user.username);

  return (
    <tr
      className={`group transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30 ${
        isDef ? "bg-blue-50/20 dark:bg-blue-900/5" : ""
      }`}
    >
      {/* ID */}
      <td className="px-4 py-3">
        <span className="font-mono text-xs text-gray-400 dark:text-gray-500">
          #{user.id}
        </span>
      </td>

      {/* Username */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <UserAvatar username={user.username} />
          <div className="min-w-0">
            <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
              {user.username}
            </p>
            {isDef && (
              <span className="text-xs text-blue-500 dark:text-blue-400">
                پیش‌فرض سیستم
              </span>
            )}
          </div>
        </div>
      </td>

      {/* Email */}
      <td className="px-4 py-3">
        <span
          className="text-gray-600 dark:text-gray-300 text-xs truncate block max-w-[200px]"
          title={user.email}
        >
          {user.email || "—"}
        </span>
      </td>

      {/* Full Name */}
      <td className="px-4 py-3">
        <span className="text-gray-700 dark:text-gray-300">
          {[user.first_name, user.last_name].filter(Boolean).join(" ") || (
            <span className="text-gray-400">—</span>
          )}
        </span>
      </td>

      {/* Role */}
      <td className="px-4 py-3">
        <Badge
          text={user.profile?.role === "admin" ? "مدیر" : "کاربر"}
          variant={user.profile?.role === "admin" ? "info" : "default"}
        />
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <Badge
          text={user.is_active ? "فعال" : "غیرفعال"}
          variant={user.is_active ? "success" : "danger"}
        />
      </td>

      {/* Date Joined */}
      <td className="px-4 py-3">
        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
          {formatDate(user.date_joined)}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Edit */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            disabled={isDef}
            title={isDef ? "کاربران پیش‌فرض قابل ویرایش نیستند" : "ویرایش کاربر"}
            className={`${isDef ? "opacity-30 cursor-not-allowed" : "hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"}`}
          >
            ✏️
          </Button>

          {/* Delete */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            disabled={isDef}
            title={isDef ? "کاربران پیش‌فرض قابل حذف نیستند" : "حذف کاربر"}
            className={`${
              isDef
                ? "opacity-30 cursor-not-allowed"
                : "text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            }`}
          >
            🗑️
          </Button>
        </div>
      </td>
    </tr>
  );
}