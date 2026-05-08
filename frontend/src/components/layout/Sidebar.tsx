"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, BrainCircuit, CheckSquare, Compass, Home, LogOut, Upload } from "lucide-react";
import { categoryProfiles, clearSession, getSession } from "@/lib/auth";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/dashboard", label: "Mission Control", icon: Home },
  { href: "/upload", label: "Ingest Material", icon: Upload },
  { href: "/study/recent", label: "Study Briefs", icon: BookOpen },
  { href: "/tests/demo", label: "Assessments", icon: CheckSquare },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const session = getSession();
  const category = session?.category ?? "School / Boards";
  const profile = categoryProfiles[category];

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="border-b border-sidebar-border px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-sidebar-primary font-heading text-lg font-semibold text-sidebar-primary-foreground">
            F
          </div>
          <div>
            <p className="font-heading text-xl font-semibold">FLOW</p>
            <p className="text-sm text-sidebar-foreground/70">AI Learning OS</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-5">
        <div className="rounded-2xl border border-sidebar-border bg-sidebar-accent p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-sidebar-foreground/55">Active Track</p>
          <p className="mt-2 font-heading text-lg font-semibold">{category}</p>
          <p className="mt-2 text-sm leading-6 text-sidebar-foreground/75">{profile.strategy}</p>
        </div>
      </div>

      <nav className="grid gap-2 px-3">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 px-4">
        <div className="rounded-2xl border border-sidebar-border/80 bg-sidebar-accent/70 p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <BrainCircuit className="h-4 w-4" />
            Personalization Signal
          </div>
          <p className="mt-3 text-sm leading-6 text-sidebar-foreground/75">{profile.focus}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-sidebar-foreground/60">
            <Compass className="h-3.5 w-3.5" />
            Weak-topic engine and revision loops ready for expansion
          </div>
        </div>
      </div>

      <div className="mt-auto border-t border-sidebar-border p-4">
        <button
          type="button"
          onClick={() => {
            clearSession();
            router.push("/login");
          }}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-200 transition hover:bg-red-500/10 hover:text-red-100"
        >
          <LogOut className="h-4 w-4" />
          Exit Session
        </button>
      </div>
    </aside>
  );
}
