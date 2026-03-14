"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  Building2,
  Handshake,
  Ticket,
  Mail,
  FileText,
  FileCode2,
  Kanban,
  CheckSquare,
  Calendar,
  BookOpen,
  LayoutDashboard,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    label: "CRM",
    items: [
      { label: "Contacts", href: "/contacts", icon: Users },
      { label: "Companies", href: "/companies", icon: Building2 },
      { label: "Deals", href: "/deals", icon: Handshake },
      { label: "Tickets", href: "/tickets", icon: Ticket },
    ],
  },
  {
    label: "Marketing",
    items: [
      { label: "Email", href: "/marketing/email", icon: Mail },
      { label: "Forms", href: "/marketing/forms", icon: FileText },
      { label: "Landing Pages", href: "/marketing/landing-pages", icon: FileCode2 },
    ],
  },
  {
    label: "Sales",
    items: [
      { label: "Deals Pipeline", href: "/sales/pipeline", icon: Kanban },
      { label: "Tasks", href: "/sales/tasks", icon: CheckSquare },
      { label: "Meetings", href: "/sales/meetings", icon: Calendar },
    ],
  },
  {
    label: "Service",
    items: [
      { label: "Tickets", href: "/service/tickets", icon: Ticket },
      { label: "Knowledge Base", href: "/service/knowledge-base", icon: BookOpen },
    ],
  },
  {
    label: "Reports",
    items: [
      { label: "Dashboards", href: "/reports/dashboards", icon: LayoutDashboard },
      { label: "Reports", href: "/reports", icon: BarChart3 },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    CRM: true,
    Marketing: true,
    Sales: true,
    Service: true,
    Reports: true,
  });

  const toggleSection = (label: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col bg-[#2D3E50] text-white transition-all duration-300",
        collapsed ? "w-16" : "w-[250px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
        {!collapsed && (
          <Link href="/" className="text-xl font-bold tracking-tight">
            HubSpot
          </Link>
        )}
        <button
          onClick={onToggleCollapse}
          className="rounded-md p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5 rotate-90" />
          )}
        </button>
      </div>

      {/* Scrollable Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {/* Home Link */}
        <Link
          href="/"
          className={cn(
            "mb-1 flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            isActive("/") && pathname === "/"
              ? "border-l-3 border-[#FF7A59] bg-white/10 text-white"
              : "text-white/70 hover:bg-white/10 hover:text-white",
            collapsed && "justify-center px-2"
          )}
        >
          <Home className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Home</span>}
        </Link>

        {/* Nav Sections */}
        {navSections.map((section) => (
          <div key={section.label} className="mt-4">
            {!collapsed && (
              <button
                onClick={() => toggleSection(section.label)}
                className="flex w-full items-center justify-between px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/50 hover:text-white/70"
              >
                <span>{section.label}</span>
                {expandedSections[section.label] ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
              </button>
            )}

            {(collapsed || expandedSections[section.label]) && (
              <ul className="mt-0.5 space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        title={collapsed ? item.label : undefined}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                          active
                            ? "border-l-3 border-[#FF7A59] bg-white/10 font-medium text-white"
                            : "text-white/70 hover:bg-white/10 hover:text-white",
                          collapsed && "justify-center px-2"
                        )}
                      >
                        <Icon className="h-4.5 w-4.5 shrink-0" />
                        {!collapsed && <span>{item.label}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}
      </nav>

      {/* Settings Link (Bottom) */}
      <div className="border-t border-white/10 p-2">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
            isActive("/settings")
              ? "border-l-3 border-[#FF7A59] bg-white/10 font-medium text-white"
              : "text-white/70 hover:bg-white/10 hover:text-white",
            collapsed && "justify-center px-2"
          )}
        >
          <Settings className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>
      </div>
    </aside>
  );
}
