import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import { useToast } from "../contexts/ToastContext";
import { formatDate, isDefaultUser, parseApiErrors } from "../utils/helpers";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";
import Pagination from "../components/common/Pagination";
import ConfirmModal from "../components/common/ConfirmModal";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import type { User } from "../types";

const SORT_FIELDS = [
  { key: "username",    label: "نام کاربری" },
  { key: "email",       label: "ایمیل" },
  { key: "first_name",  label: "نام" },
  { key: "last_name",   label: "نام خانوادگی" },
  { key: "is_active",   label: "وضعیت" },
  { key: "date_joined", label: "تاریخ عضویت" },
];

function SortBtn({ field, active, dir, onClick }: { field:string; active:boolean; dir:string; onClick:()=>void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1 hover:text-blue-600 transition-colors select-none w-full justify-end">
      <span>{SORT_FIELDS.find(f=>f.key===field)?.label ?? field}</span>
      <span className={`text-xs ${active ? "text-blue-500" : "text-gray-300 dark:text-gray-600"}`}>
        {active ? (dir==="asc" ? "↑" : "↓") : "↕"}
      </span>
    </button>
  );
}

export default function UsersListPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [users, setUsers]   = useState<User[]>([]);
  const [total, setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string|null>(null);

  const [page, setPage]           = useState(1);
  const [pageSize, setPageSize]   = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch]       = useState("");
  const [filterActive, setFilter] = useState("");
  const [sortField, setSortField] = useState("date_joined");
  const [sortDir, setSortDir]     = useState<"asc"|"desc">("desc");

  const [delTarget, setDelTarget] = useState<User|null>(null);
  const [delLoading, setDelLoad]  = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function onSearchInput(val: string) {
    setSearchInput(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { setSearch(val); setPage(1); }, 400);
  }

  const fetchUsers = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const params: Record<string,any> = {
        page, page_size: pageSize,
        ordering: sortDir === "desc" ? `-${sortField}` : sortField,
      };
      if (search)        params.username  = search;
      if (filterActive !== "") params.is_active = filterActive === "true";
      const { data } = await userService.getUsers(params);
      setUsers(Array.isArray(data) ? data : (data.results ?? []));
      setTotal(typeof data.count === "number" ? data.count : (Array.isArray(data) ? data.length : 0));
    } catch (err) {
      const msg = parseApiErrors(err).__general__ ?? "خطا در بارگذاری کاربران.";
      setError(msg); toast.error(msg);
    } finally { setLoading(false); }
  }, [page, pageSize, search, filterActive, sortField, sortDir]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  function handleSort(field: string) {
    if (sortField === field) setSortDir((d) => (d==="asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
    setPage(1);
  }

  function tryDelete(u: User) {
    if (isDefaultUser(u.id, u.username)) { toast.warning("کاربران پیش‌فرض سیستم قابل حذف نیستند."); return; }
    setDelTarget(u);
  }

  async function confirmDel() {
    if (!delTarget) return;
    setDelLoad(true);
    try {
      await userService.deleteUser(delTarget.id);
      toast.success(`کاربر "${delTarget.username}" حذف شد.`);
      setDelTarget(null); fetchUsers();
    } catch (err) {
      toast.error(parseApiErrors(err).__general__ ?? "خطا در حذف.");
    } finally { setDelLoad(false); }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">مدیریت کاربران</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {total > 0 ? `${total} کاربر در سیستم` : "لیست کاربران"}
          </p>
        </div>
        <Button onClick={() => navigate("/users/create")}>+ افزودن کاربر</Button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[180px] relative">
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input value={searchInput} onChange={(e) => onSearchInput(e.target.value)}
              placeholder="جستجوی نام کاربری..."
              className="w-full pr-9 pl-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={filterActive} onChange={(e) => { setFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">همه کاربران</option>
            <option value="true">فعال</option>
            <option value="false">غیرفعال</option>
          </select>
          <Button variant="secondary" onClick={fetchUsers} disabled={loading}>
            {loading ? <Spinner size="sm" /> : "↻"} بروزرسانی
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                {["#", "username","email","first_name","نقش","is_active","date_joined","عملیات"].map((col) => {
                  const sf = SORT_FIELDS.find(f => f.key === col);
                  return (
                    <th key={col} className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                      {sf
                        ? <SortBtn field={col} active={sortField===col} dir={sortDir} onClick={() => handleSort(col)} />
                        : (col === "#" ? "شناسه" : col === "عملیات" ? "عملیات" : col === "نقش" ? "نقش" : col)
                      }
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading && users.length === 0
                ? <tr><td colSpan={8} className="py-20"><div className="flex justify-center"><Spinner size="lg" /></div></td></tr>
                : error
                  ? <tr><td colSpan={8}><ErrorState message={error} onRetry={fetchUsers} /></td></tr>
                  : users.length === 0
                    ? <tr><td colSpan={8}><EmptyState message="هیچ کاربری یافت نشد." /></td></tr>
                    : users.map((u) => {
                        const isDef = isDefaultUser(u.id, u.username);
                        return (
                          <tr key={u.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${isDef ? "bg-blue-50/20 dark:bg-blue-900/5" : ""}`}>
                            <td className="px-4 py-3 font-mono text-gray-400 text-xs">#{u.id}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                  {(u.username?.[0] ?? "?").toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-gray-100">{u.username}</p>
                                  {isDef && <span className="text-xs text-blue-500 dark:text-blue-400">پیش‌فرض</span>}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-300 max-w-[180px] truncate" title={u.email}>{u.email || "—"}</td>
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{[u.first_name, u.last_name].filter(Boolean).join(" ") || "—"}</td>
                            <td className="px-4 py-3"><Badge text={u.profile?.role === "admin" ? "مدیر" : "کاربر"} variant={u.profile?.role === "admin" ? "info" : "default"} /></td>
                            <td className="px-4 py-3"><Badge text={u.is_active ? "فعال" : "غیرفعال"} variant={u.is_active ? "success" : "danger"} /></td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-300 text-xs whitespace-nowrap">{formatDate(u.date_joined)}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1 justify-end">
                                <Button variant="ghost" size="sm" disabled={isDef}
                                  className={isDef ? "opacity-30" : ""}
                                  title={isDef ? "کاربر پیش‌فرض قابل ویرایش نیست" : "ویرایش"}
                                  onClick={() => navigate(`/users/${u.id}/edit`)}>✏️</Button>
                                <Button variant="ghost" size="sm" disabled={isDef}
                                  className={`text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 ${isDef ? "opacity-30" : ""}`}
                                  title={isDef ? "کاربر پیش‌فرض قابل حذف نیست" : "حذف"}
                                  onClick={() => tryDelete(u)}>🗑️</Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
              }
            </tbody>
          </table>
        </div>
        {!loading && users.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <Pagination page={page} pageSize={pageSize} total={total}
              onPageChange={setPage}
              onPageSizeChange={(s) => { setPageSize(s); setPage(1); }} />
          </div>
        )}
      </div>

      <ConfirmModal open={!!delTarget} title="حذف کاربر"
        message={`آیا از حذف کاربر "${delTarget?.username}" مطمئن هستید؟ این عملیات غیرقابل بازگشت است.`}
        onConfirm={confirmDel} onCancel={() => setDelTarget(null)}
        loading={delLoading} confirmText="بله، حذف کن" danger />
    </div>
  );
}