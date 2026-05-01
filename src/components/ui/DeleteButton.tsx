'use client';

interface DeleteButtonProps {
  label?: string;
  confirmMessage?: string;
}

export function DeleteButton({
  label = 'Delete',
  confirmMessage = 'Are you sure you want to delete this?',
}: DeleteButtonProps) {
  return (
    <button
      type="submit"
      className="text-xs text-red-500 hover:text-red-700 hover:underline"
      onClick={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
    >
      {label}
    </button>
  );
}
