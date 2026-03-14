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
        "fixed right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-[rgba(0,0,0,0.11)] bg-white px-6 transition-all duration-300",
        sidebarCollapsed ? "left-14" : "left-[240px]"
      )}
    >
      {/* Global Search */}
      <div className="relative w-full max-w-lg">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgba(0,0,0,0.38)]" />
        <input
          type="text"
          placeholder="Search..."
          className="h-10 w-full rounded-[4px] border border-[rgba(0,0,0,0.11)] bg-[#fcfcfa] pl-10 pr-20 text-sm text-[#1f1f1f] placeholder:text-[rgba(0,0,0,0.38)] focus:border-[#2f7579] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2f7579]/20"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-[4px] border border-[rgba(0,0,0,0.11)] bg-[#f8f5ee] px-1.5 py-0.5 text-xs text-[rgba(0,0,0,0.62)]">
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
            className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#ff4800] text-white hover:bg-[#c93700] active:bg-[#9f2800] transition-colors"
            aria-label="Quick create"
          >
            <Plus className="h-5 w-5" />
          </button>

          {quickCreateOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-[8px] border border-[rgba(0,0,0,0.11)] bg-white py-1 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
              <p className="px-3 py-2 text-[0.75rem] font-medium uppercase tracking-[0.05em] text-[rgba(0,0,0,0.38)]">
                Create new
              </p>
              {quickCreateItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setQuickCreateOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#1f1f1f] hover:bg-[#f8f5ee]"
                  >
                    <Icon className="h-4 w-4 text-[rgba(0,0,0,0.38)]" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Notifications */}
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-[8px] text-[rgba(0,0,0,0.62)] hover:bg-[#f8f5ee] transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#d9002b] text-[10px] font-bold text-white">
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
            className="flex items-center gap-2 rounded-[8px] px-2 py-1.5 text-[#1f1f1f] hover:bg-[#f8f5ee] transition-colors"
            aria-label="User menu"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1f1f1f] text-sm font-medium text-[#f8f5ee]">
              U
            </div>
            <ChevronDown className="h-4 w-4 text-[rgba(0,0,0,0.38)]" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-[8px] border border-[rgba(0,0,0,0.11)] bg-white py-1 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
              {/* User Info */}
              <div className="border-b border-[rgba(0,0,0,0.11)] px-4 py-3">
                <p className="text-sm font-medium text-[#1f1f1f]">User Name</p>
                <p className="text-xs text-[rgba(0,0,0,0.62)]">user@example.com</p>
              </div>

              {/* Menu Items */}
              {userMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#1f1f1f] hover:bg-[#f8f5ee]"
                  >
                    <Icon className="h-4 w-4 text-[rgba(0,0,0,0.38)]" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Logout */}
              <div className="border-t border-[rgba(0,0,0,0.11)]">
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    // TODO: implement logout
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-[#d9002b] hover:bg-[#fcc6b1]/20"
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
