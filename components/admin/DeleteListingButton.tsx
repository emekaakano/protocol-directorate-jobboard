"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteListing } from "@/lib/actions";

interface DeleteListingButtonProps {
  id: string;
  title: string;
}

export function DeleteListingButton({ id, title }: DeleteListingButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Delete "${title}"?\n\nThis cannot be undone.`)) return;
    startTransition(async () => {
      await deleteListing(id);
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      title="Delete listing"
      className="flex h-8 w-8 items-center justify-center rounded-lg text-jb-text-muted transition-colors hover:bg-jb-danger-light hover:text-jb-danger disabled:opacity-40"
    >
      <Trash2 size={14} />
    </button>
  );
}
