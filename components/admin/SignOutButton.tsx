"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="flex items-center gap-2 rounded-xl border border-jb-border px-3 py-2 text-sm font-medium text-jb-text-muted transition-colors hover:border-jb-danger hover:text-jb-danger"
    >
      <LogOut size={15} />
      Sign out
    </button>
  );
}
