import React from "react";
import Button from "../ui/Button";

export default function ErrorState({ message = "خطایی رخ داد", onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-3xl">⚠️</div>
      <p className="text-gray-600 dark:text-gray-400 text-center text-sm max-w-xs">{message}</p>
      {onRetry && <Button onClick={onRetry}>تلاش مجدد</Button>}
    </div>
  );
}