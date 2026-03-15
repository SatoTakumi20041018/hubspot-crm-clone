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
  Phone,
  HelpCircle,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  sidebarCollapsed: boolean;
}

const quickCreateItems = [
  { label: "コンタクト", href: "/contacts/new", icon: Users },
  { label: "会社", href: "/companies/new", icon: Building2 },
  { label: "取引", href: "/deals/new", icon: Handshake },
  { label: "チケット", href: "/tickets/new", icon: Ticket },
];

const userMenuItems = [
  { label: "プロフィール", href: "/settings/profile", icon: User },
  { label: "設定", href: "/settings", icon: Settings },
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
        "fixed right-0 top-0 z-30 flex h-14 items-center justify-between border-b border-[rgba(0,0,0,0.11)] bg-white px-4 transition-all duration-300",
        sidebarCollapsed ? "left-14" : "left-[240px]"
      )}
    >
      {/* Global Search */}
      <div className="relative w-full max-w-lg">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgba(0,0,0,0.38)]" />
        <input
          type="text"
          placeholder="検索..."
          className="h-9 w-full rounded-[4px] border border-[rgba(0,0,0,0.11)] bg-[#fcfcfa] pl-10 pr-20 text-sm text-[#1f1f1f] placeholder:text-[rgba(0,0,0,0.38)] focus:border-[#2f7579] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2f7579]/20"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-[4px] border border-[rgba(0,0,0,0.11)] bg-[#f8f5ee] px-1.5 py-0.5 text-xs text-[rgba(0,0,0,0.62)]">
          Cmd+K
        </kbd>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-1 ml-4">
        {/* Quick Create (+) */}
        <div ref={quickCreateRef} className="relative">
          <button
            onClick={() => {
              setQuickCreateOpen(!quickCreateOpen);
              setUserMenuOpen(false);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff4800] text-white hover:bg-[#c93700] active:bg-[#9f2800] transition-colors"
            aria-label="クイック作成"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
          </button>

          {quickCreateOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-[8px] border border-[rgba(0,0,0,0.11)] bg-white py-1 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
              <p className="px-3 py-2 text-[0.75rem] font-medium uppercase tracking-[0.05em] text-[rgba(0,0,0,0.38)]">
                新規作成
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

        {/* Calling Icon */}
        <button
          className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[rgba(0,0,0,0.54)] hover:bg-[#f8f5ee] transition-colors"
          aria-label="通話"
        >
          <Phone className="h-[18px] w-[18px]" />
        </button>

        {/* Marketplace Icon */}
        <button
          className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[rgba(0,0,0,0.54)] hover:bg-[#f8f5ee] transition-colors"
          aria-label="マーケットプレイス"
        >
          <ShoppingBag className="h-[18px] w-[18px]" />
        </button>

        {/* Help Icon */}
        <button
          className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[rgba(0,0,0,0.54)] hover:bg-[#f8f5ee] transition-colors"
          aria-label="ヘルプ"
        >
          <HelpCircle className="h-[18px] w-[18px]" />
        </button>

        {/* Settings Gear → /settings */}
        <Link
          href="/settings"
          className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[rgba(0,0,0,0.54)] hover:bg-[#f8f5ee] transition-colors"
          aria-label="設定"
        >
          <Settings className="h-[18px] w-[18px]" />
        </Link>

        {/* Notifications Bell with Badge */}
        <button
          className="relative flex h-8 w-8 items-center justify-center rounded-[6px] text-[rgba(0,0,0,0.54)] hover:bg-[#f8f5ee] transition-colors"
          aria-label="通知"
        >
          <Bell className="h-[18px] w-[18px]" />
          {notificationCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#d9002b] px-1 text-[10px] font-bold text-white leading-none">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>

        {/* Breeze AI Sparkle */}
        <button
          className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[rgba(0,0,0,0.54)] hover:bg-[#f8f5ee] transition-colors"
          aria-label="Breeze AI"
        >
          <Sparkles className="h-[18px] w-[18px]" />
        </button>

        {/* Divider */}
        <div className="mx-1 h-6 w-px bg-[rgba(0,0,0,0.11)]" />

        {/* User Avatar Menu */}
        <div ref={userMenuRef} className="relative">
          <button
            onClick={() => {
              setUserMenuOpen(!userMenuOpen);
              setQuickCreateOpen(false);
            }}
            className="flex items-center gap-1.5 rounded-[8px] px-1 py-1 text-[#1f1f1f] hover:bg-[#f8f5ee] transition-colors"
            aria-label="ユーザーメニュー"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff4800] text-sm font-semibold text-white">
              匠
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-[rgba(0,0,0,0.38)]" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-[8px] border border-[rgba(0,0,0,0.11)] bg-white py-1 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
              {/* User Info */}
              <div className="border-b border-[rgba(0,0,0,0.11)] px-4 py-3">
                <p className="text-sm font-medium text-[#1f1f1f]">佐藤 匠</p>
                <p className="text-xs text-[rgba(0,0,0,0.62)]">satotakumi20041018@gmail.com</p>
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
                  <span>ログアウト</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
