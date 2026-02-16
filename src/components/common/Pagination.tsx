import React from "react";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

interface Props {
  page: number; pageSize: number; total: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
}

export default function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange }: Props) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 0) return null;

  const delta = 2;
  const pages: number[] = [];
  for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) pages.push(i);

  const btn = "px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300";

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <span>نمایش:</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          {PAGE_SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <span>از {total} مورد</span>
      </div>
      <div className="flex items-center gap-1">
        <button className={btn} onClick={() => onPageChange(1)} disabled={page===1}>«</button>
        <button className={btn} onClick={() => onPageChange(page-1)} disabled={page===1}>‹</button>
        {pages[0]>1 && <span className="px-1 text-gray-400 text-xs">…</span>}
        {pages.map((p) => (
          <button key={p} onClick={() => onPageChange(p)}
            className={`px-3 py-1 text-xs rounded border transition-colors ${
              p===page ? "bg-blue-600 text-white border-blue-600"
                       : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >{p}</button>
        ))}
        {pages[pages.length-1]<totalPages && <span className="px-1 text-gray-400 text-xs">…</span>}
        <button className={btn} onClick={() => onPageChange(page+1)} disabled={page===totalPages}>›</button>
        <button className={btn} onClick={() => onPageChange(totalPages)} disabled={page===totalPages}>»</button>
      </div>
    </div>
  );
}