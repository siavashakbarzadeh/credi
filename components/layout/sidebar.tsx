"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../../lib/utils";
import {
  LayoutDashboard,
  FileText,
  Users,
  Bell,
  Settings,
  CreditCard,
} from "lucide-react";

const navigation = [
  { name: "Pannello di controllo", href: "/dashboard", icon: LayoutDashboard },
  { name: "Pratiche", href: "/applications", icon: FileText },
  { name: "Richiedenti", href: "/applicants", icon: Users },
  { name: "Notifiche", href: "/notifications", icon: Bell },
  { name: "Impostazioni", href: "/settings", icon: Settings },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("flex h-full w-64 flex-col border-r bg-card", className)}>
      <div className="flex items-center gap-2 border-b px-6 py-5">
        <CreditCard className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold tracking-tight">Credi</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
            U
          </div>
          <div className="flex-1 truncate">
            <p className="truncate text-sm font-medium">Utente</p>
            <p className="truncate text-xs text-muted-foreground">credi.it</p>
          </div>
        </div>
      </div>
    </div>
  );
}
