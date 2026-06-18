"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Browse Jobs" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-jb-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-jb-text"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-jb-primary">
            <Briefcase className="text-white" size={16} />
          </div>
          <span className="text-base">JobBoard</span>
        </Link>

        <nav className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-jb-primary-light text-jb-primary"
                  : "text-jb-text-muted hover:bg-slate-100 hover:text-jb-text"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin/login"
            className={cn(
              "ml-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors",
              pathname.startsWith("/admin")
                ? "bg-jb-primary text-white"
                : "border border-jb-border text-jb-text hover:bg-slate-50"
            )}
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
