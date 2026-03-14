"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Bell,
  User,
  Users,
  Building2,
  Handshake,
  Ticket,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  sidebarCollapsed: boolean;
}

const quickCreateItems = [
  { label: "Contact", href: "/contacts/new", icon: Users },
  { label: "Company", href: "/companies/new", icon: Building2 },
  { label: "Deal", href: "/deals/new", icon: Handshake },
  { label: "Ticket", href: "/tickets/new", icon: Ticket },
];

const userMenuItems = [
  { label: "Profile", href: "/settings/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Header({ sidebarCollapsed }: HeaderProps) {
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationCount] = useState(3);

  const quickCreateRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        quickCreateRef.current &&
        !quickCreateRef.current.contains(event.target as Node)
      ) {
        setQuickCreateOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={cn(
        "fixed right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 transition-all duration-300",
        sidebarCollapsed ? "left-16" : "left-[250px]"
      )}
    >
      {/* Global Search */}
      <div className="relative w-full max-w-lg">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-20 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#FF7A59] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF7A59]/20"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-gray-200 bg-gray-100 px-1.5 py-0.5 text-xs text-gray-400">
          Cmd+K
        </kbd>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-2 ml-4">
        {/* Quick Create */}
        <div ref={quickCreateRef} className="relative">
          <button
            onClick={() => {
              setQuickCreateOpen(!quickCreateOpen);
              setUserMenuOpen(false);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FF7A59] text-white hover:bg-[#FF957A] transition-colors"
            aria-label="Quick create"
          >
            <Plus className="h-5 w-5" />
          </button>

          {quickCreateOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Create new
              </p>
              {quickCreateItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setQuickCreateOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Icon className="h-4 w-4 text-gray-400" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Notifications */}
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>

        {/* User Menu */}
        <div ref={userMenuRef} className="relative">
          <button
            onClick={() => {
              setUserMenuOpen(!userMenuOpen);
              setQuickCreateOpen(false);
            }}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="User menu"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2D3E50] text-sm font-medium text-white">
              U
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
              {/* User Info */}
              <div className="border-b border-gray-100 px-4 py-3">
                <p className="text-sm font-medium text-gray-900">User Name</p>
                <p className="text-xs text-gray-500">user@example.com</p>
              </div>

              {/* Menu Items */}
              {userMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Icon className="h-4 w-4 text-gray-400" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Logout */}
              <div className="border-t border-gray-100">
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    // TODO: implement logout
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
