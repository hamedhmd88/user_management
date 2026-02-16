import React from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

interface Props {
  open: boolean; title: string; message: string;
  onConfirm: () => void; onCancel: () => void;
  loading?: boolean; confirmText?: string; danger?: boolean;
}

export default function ConfirmModal({ open, title, message, onConfirm, onCancel, loading, confirmText="تأیید", danger }: Props) {
  return (
    <Modal open={open} title={title} onClose={onCancel}
      footer={<>
        <Button variant="secondary" onClick={onCancel} disabled={loading}>انصراف</Button>
        <Button variant={danger ? "danger" : "primary"} onClick={onConfirm} loading={loading}>{confirmText}</Button>
      </>}
    >
      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{message}</p>
    </Modal>
  );
}