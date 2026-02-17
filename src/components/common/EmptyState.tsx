import React from "react";

export default function EmptyState({ message = "هیچ موردی یافت نشد" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-16 h-16 rounded-full bg-custom-hover flex items-center justify-center text-3xl">📋</div>
      <p className="text-custom-muted text-sm">{message}</p>
    </div>
  );
}