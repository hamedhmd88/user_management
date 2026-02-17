import React, { useEffect } from "react";

interface Props {
  open: boolean; title: string;
  children: React.ReactNode;
  onClose: () => void;
  footer?: React.ReactNode;
}

export default function Modal({ open, title, children, onClose, footer }: Props) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-custom-card rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col border border-custom-border">
        <div className="flex items-center justify-between px-6 py-4 border-b border-custom-border">
          <h2 className="text-lg font-semibold text-custom-text">{title}</h2>
          <button onClick={onClose} className="text-custom-muted hover:text-custom-text text-xl transition-colors">×</button>
        </div>
        <div className="px-6 py-4 overflow-y-auto flex-1">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-custom-border flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}