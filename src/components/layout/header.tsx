"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
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
  Clock,
  Mail,
  CheckSquare,
  Calendar,
  DollarSign,
  FileText,
  X,
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

const recentItems = [
  { label: "田中 太郎", type: "コンタクト", icon: Users, href: "/contacts/1" },
  { label: "サンプル株式会社", type: "会社", icon: Building2, href: "/companies/1" },
  { label: "新規ウェブサイト制作", type: "取引", icon: Handshake, href: "/deals/1" },
];

const mockNotifications = [
  { id: 1, title: "田中太郎がメールを開封しました", time: "3分前", icon: Mail, read: false },
  { id: 2, title: "取引「新規ウェブサイト制作」のステージが更新されました", time: "1時間前", icon: DollarSign, read: false },
  { id: 3, title: "チケット #1024 が割り当てられました", time: "2時間前", icon: Ticket, read: false },
  { id: 4, title: "タスク「フォローアップメール」の期限が明日です", time: "5時間前", icon: CheckSquare, read: true },
  { id: 5, title: "山本健太がフォームを送信しました", time: "1日前", icon: FileText, read: true },
];

// Toast notification system (G3)
let toastId = 0;
interface ToastItem {
  id: number;
  message: string;
  removing: boolean;
}

function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, removing: false }]);
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, removing: true } : t)));
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 300);
    }, 3000);
  }, []);

  return { toasts, addToast };
}

export function Header({ sidebarCollapsed }: HeaderProps) {
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationCount] = useState(3);
  const { toasts, addToast } = useToast();

  const quickCreateRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdowns when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (quickCreateRef.current && !quickCreateRef.current.contains(event.target as Node)) {
        setQuickCreateOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setQuickCreateOpen(false);
        setUserMenuOpen(false);
        setNotificationOpen(false);
        setSearchFocused(false);
      }
      // G6: 'n' key to open quick create (only when not in an input/textarea)
      const target = event.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
      if (event.key === "n" && !isInput && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault();
        setQuickCreateOpen(true);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Expose addToast globally for other components
  useEffect(() => {
    (window as any).__hubspotToast = addToast;
  }, [addToast]);

  const showSearchDropdown = searchFocused && !searchQuery;

  return (
    <>
      <header
        className={cn(
          "fixed right-0 top-0 z-30 flex h-14 items-center justify-between border-b border-[rgba(0,0,0,0.11)] bg-white px-4 transition-all duration-300",
          sidebarCollapsed ? "left-14" : "left-[240px]"
        )}
      >
        {/* Global Search (D2) */}
        <div ref={searchRef} className="relative w-full max-w-lg">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgba(0,0,0,0.38)]" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            className="h-9 w-full rounded-[4px] border border-[rgba(0,0,0,0.11)] bg-[#fcfcfa] pl-10 pr-20 text-sm text-[#1f1f1f] placeholder:text-[rgba(0,0,0,0.38)] focus:border-[#2f7579] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2f7579]/20"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-[4px] border border-[rgba(0,0,0,0.11)] bg-[#f8f5ee] px-1.5 py-0.5 text-xs text-[rgba(0,0,0,0.62)]">
            Cmd+K
          </kbd>

          {/* Search results dropdown - shows recent items when empty (D2) */}
          {showSearchDropdown && (
            <div className="absolute left-0 top-full mt-1 w-full rounded-[8px] border border-[rgba(0,0,0,0.11)] bg-white py-2 shadow-[0_4px_16px_rgba(0,0,0,0.12)] animate-slide-down">
              <p className="px-3 py-1.5 text-[0.75rem] font-medium uppercase tracking-[0.05em] text-[rgba(0,0,0,0.38)] flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                最近のアイテム
              </p>
              {recentItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSearchFocused(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#1f1f1f] hover:bg-[#f8f5ee]"
                  >
                    <Icon className="h-4 w-4 text-[rgba(0,0,0,0.38)]" />
                    <span className="flex-1">{item.label}</span>
                    <span className="text-xs text-[rgba(0,0,0,0.38)]">{item.type}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-1 ml-4">
          {/* Quick Create (+) with icons (D1) */}
          <div ref={quickCreateRef} className="relative">
            <button
              onClick={() => {
                setQuickCreateOpen(!quickCreateOpen);
                setUserMenuOpen(false);
                setNotificationOpen(false);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff4800] text-white hover:bg-[#c93700] active:bg-[#9f2800] transition-colors"
              aria-label="クイック作成"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
            </button>

            {quickCreateOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-[8px] border border-[rgba(0,0,0,0.11)] bg-white py-1 shadow-[0_4px_16px_rgba(0,0,0,0.12)] animate-slide-down">
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

          {/* Settings Gear */}
          <Link
            href="/settings"
            className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[rgba(0,0,0,0.54)] hover:bg-[#f8f5ee] transition-colors"
            aria-label="設定"
          >
            <Settings className="h-[18px] w-[18px]" />
          </Link>

          {/* Notifications Bell with Panel (D3) */}
          <div ref={notificationRef} className="relative">
            <button
              onClick={() => {
                setNotificationOpen(!notificationOpen);
                setQuickCreateOpen(false);
                setUserMenuOpen(false);
              }}
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

            {notificationOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 rounded-[8px] border border-[rgba(0,0,0,0.11)] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] animate-slide-down">
                <div className="flex items-center justify-between border-b border-[rgba(0,0,0,0.11)] px-4 py-3">
                  <h3 className="text-sm font-semibold text-[#1f1f1f]">通知</h3>
                  <button className="text-xs text-[#ff4800] hover:underline">すべて既読にする</button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {mockNotifications.map((n) => {
                    const Icon = n.icon;
                    return (
                      <div
                        key={n.id}
                        className={cn(
                          "flex items-start gap-3 px-4 py-3 hover:bg-[#f8f5ee] transition-colors cursor-pointer border-b border-[rgba(0,0,0,0.06)] last:border-0",
                          !n.read && "bg-blue-50/30"
                        )}
                      >
                        <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                          <Icon className="h-3.5 w-3.5 text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-sm text-gray-700 leading-snug", !n.read && "font-medium text-gray-900")}>
                            {n.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                        </div>
                        {!n.read && (
                          <div className="mt-2 h-2 w-2 rounded-full bg-[#ff4800] flex-shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-[rgba(0,0,0,0.11)] p-2">
                  <button className="w-full rounded-md py-1.5 text-center text-sm text-[#ff4800] hover:bg-[#f8f5ee] transition-colors">
                    すべての通知を見る
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Breeze AI Sparkle with pulse glow (D5) */}
          <button
            className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[rgba(0,0,0,0.54)] hover:bg-[#f8f5ee] transition-colors animate-breeze-glow"
            aria-label="Breeze AI"
          >
            <Sparkles className="h-[18px] w-[18px]" />
          </button>

          {/* Divider */}
          <div className="mx-1 h-6 w-px bg-[rgba(0,0,0,0.11)]" />

          {/* User Avatar Menu with account name/portal ID (D4) */}
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => {
                setUserMenuOpen(!userMenuOpen);
                setQuickCreateOpen(false);
                setNotificationOpen(false);
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
              <div className="absolute right-0 top-full mt-2 w-56 rounded-[8px] border border-[rgba(0,0,0,0.11)] bg-white py-1 shadow-[0_4px_16px_rgba(0,0,0,0.12)] animate-slide-down">
                {/* User Info with account name/portal ID (D4) */}
                <div className="border-b border-[rgba(0,0,0,0.11)] px-4 py-3">
                  <p className="text-sm font-medium text-[#1f1f1f]">佐藤 匠</p>
                  <p className="text-xs text-[rgba(0,0,0,0.62)]">satotakumi20041018@gmail.com</p>
                  <div className="mt-1.5 flex items-center gap-1">
                    <span className="text-[10px] text-[rgba(0,0,0,0.38)] bg-gray-100 rounded px-1.5 py-0.5">サンプル株式会社</span>
                    <span className="text-[10px] text-[rgba(0,0,0,0.38)]">Portal ID: 48271935</span>
                  </div>
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

      {/* Toast Notifications (G3) */}
      <div className="fixed top-4 right-4 z-[100] space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex items-center gap-2 rounded-lg bg-[#1f1f1f] px-4 py-3 text-sm text-white shadow-lg",
              toast.removing ? "animate-toast-out" : "animate-toast-in"
            )}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => {
                /* immediate dismiss handled by timeout */
              }}
              className="ml-2 text-white/60 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
