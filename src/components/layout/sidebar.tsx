"use client";

import React, { useState, useEffect } from "react";
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
  ListChecks,
  Megaphone,
  Globe,
  MousePointerClick,
  Search as SearchIcon,
  Briefcase,
  Send,
  Video,
  Quote,
  TrendingUp,
  FileStack,
  BookMarked,
  Phone,
  Headphones,
  MessageSquare,
  HelpCircle,
  ShoppingCart,
  CreditCard,
  Workflow,
  PenTool,
  FileEdit,
  Target,
  Database,
  Sparkles,
  Bot,
  Share2,
  Heart,
  Brain,
  Receipt,
  RefreshCw,
  Upload,
  Star,
  Bookmark,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const bookmarks = [
  { label: "コンタクト", href: "/contacts", icon: Users },
  { label: "取引", href: "/deals", icon: Handshake },
  { label: "タスク", href: "/tasks", icon: CheckSquare },
  { label: "ダッシュボード", href: "/dashboards", icon: LayoutDashboard },
];

const navSections: NavSection[] = [
  {
    label: "Breeze",
    items: [
      { label: "Overview", href: "/breeze", icon: Sparkles },
      { label: "Prospecting Agent", href: "/prospecting", icon: SearchIcon },
      { label: "Customer Agent", href: "/customer-success", icon: Bot },
      { label: "Content Agent", href: "/content", icon: FileText },
      { label: "Social Agent", href: "/social", icon: Share2 },
    ],
  },
  {
    label: "Workspaces",
    items: [
      { label: "Prospecting", href: "/prospecting", icon: SearchIcon },
      { label: "Customer Success", href: "/customer-success", icon: Heart },
      { label: "Help Desk", href: "/help-desk", icon: Headphones, badge: "5" },
    ],
  },
  {
    label: "CRM",
    items: [
      { label: "Contacts", href: "/contacts", icon: Users },
      { label: "Companies", href: "/companies", icon: Building2 },
      { label: "Deals", href: "/deals", icon: Handshake },
      { label: "Tickets", href: "/tickets", icon: Ticket, badge: "10" },
      { label: "Tasks", href: "/tasks", icon: CheckSquare, badge: "3" },
      { label: "Lists", href: "/lists", icon: ListChecks },
      { label: "Import", href: "/import", icon: Upload },
    ],
  },
  {
    label: "Marketing",
    items: [
      { label: "Overview", href: "/marketing", icon: Megaphone },
      { label: "Email", href: "/email", icon: Mail },
      { label: "Forms", href: "/forms", icon: FileText },
      { label: "Landing Pages", href: "/landing-pages", icon: FileCode2 },
      { label: "Social", href: "/social", icon: Megaphone },
      { label: "Ads", href: "/ads", icon: MousePointerClick },
      { label: "SEO", href: "/seo", icon: SearchIcon },
      { label: "AEO", href: "/aeo", icon: Brain },
    ],
  },
  {
    label: "Sales",
    items: [
      { label: "Workspace", href: "/sales", icon: Briefcase },
      { label: "Deals", href: "/deals", icon: Kanban },
      { label: "Sequences", href: "/sequences", icon: Send },
      { label: "Meetings", href: "/meetings", icon: Calendar },
      { label: "Quotes", href: "/quotes", icon: Quote },
      { label: "Forecasting", href: "/forecasting", icon: TrendingUp },
      { label: "Documents", href: "/documents", icon: FileStack },
      { label: "Playbooks", href: "/playbooks", icon: BookMarked },
      { label: "Calls", href: "/calls", icon: Phone },
    ],
  },
  {
    label: "Service",
    items: [
      { label: "Overview", href: "/service", icon: Headphones },
      { label: "Help Desk", href: "/help-desk", icon: Headphones },
      { label: "Knowledge Base", href: "/knowledge-base", icon: BookOpen },
      { label: "Feedback", href: "/feedback", icon: HelpCircle },
      { label: "Chatflows", href: "/chatflows", icon: MessageSquare },
    ],
  },
  {
    label: "Commerce",
    items: [
      { label: "Overview", href: "/commerce", icon: ShoppingCart },
      { label: "Payments", href: "/payments", icon: CreditCard },
      { label: "Invoices", href: "/invoices", icon: Receipt },
      { label: "Subscriptions", href: "/subscriptions", icon: RefreshCw },
      { label: "Quotes", href: "/quotes", icon: Quote },
      { label: "Products", href: "/products", icon: ShoppingCart },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Overview", href: "/content", icon: FileEdit },
      { label: "Blog", href: "/blog", icon: PenTool },
      { label: "Website Pages", href: "/website-pages", icon: Globe },
      { label: "Video", href: "/video", icon: Video },
      { label: "Landing Pages", href: "/landing-pages", icon: FileCode2 },
    ],
  },
  {
    label: "Automations",
    items: [
      { label: "Workflows", href: "/workflows", icon: Workflow },
    ],
  },
  {
    label: "Reporting",
    items: [
      { label: "Dashboards", href: "/dashboards", icon: LayoutDashboard },
      { label: "Reports", href: "/reports", icon: BarChart3 },
      { label: "Goals", href: "/goals", icon: Target },
    ],
  },
  {
    label: "Data Management",
    items: [
      { label: "Data Quality", href: "/data-quality", icon: Database },
      { label: "Lists", href: "/lists", icon: ListChecks },
    ],
  },
];

// E5: Section record count badges
const sectionCounts: Record<string, string> = {
  CRM: "67",
  Marketing: "",
  Sales: "",
  Service: "",
};

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    Breeze: false,
    Workspaces: true,
    CRM: true,
    Marketing: false,
    Sales: true,
    Service: false,
    Commerce: false,
    Content: false,
    Automations: false,
    Reporting: true,
    "Data Management": false,
  });

  // E4: Auto-expand active section when navigating
  useEffect(() => {
    for (const section of navSections) {
      const hasActiveChild = section.items.some((item) => {
        if (item.href === "/") return pathname === "/";
        return pathname.startsWith(item.href);
      });
      if (hasActiveChild && !expandedSections[section.label]) {
        setExpandedSections((prev) => ({ ...prev, [section.label]: true }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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

  const renderIcon = (Icon: React.ElementType, active: boolean, label?: string) => {
    const icon = <Icon className={cn("h-5 w-5 shrink-0", active ? "text-[#f8f5ee]" : "text-[#f8f5ee]/60")} />;
    if (collapsed && label) {
      return (
        <Tooltip content={label} side="right">
          {icon}
        </Tooltip>
      );
    }
    return icon;
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col bg-[#1f1f1f] text-[#f8f5ee] transition-all duration-300",
        collapsed ? "w-14" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center justify-between border-b border-white/10 px-4">
        {!collapsed && (
          <Link href="/" className="text-xl font-bold tracking-tight text-[#f8f5ee]">
            HubSpot
          </Link>
        )}
        <button
          onClick={onToggleCollapse}
          className="rounded-[8px] p-1.5 text-[#f8f5ee]/60 hover:bg-white/10 hover:text-[#f8f5ee]"
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
          title={collapsed ? "Home" : undefined}
          className={cn(
            "mb-1 flex items-center gap-3 rounded-[8px] px-3 py-2 text-sm font-medium transition-colors",
            isActive("/") && pathname === "/"
              ? "border-l-[3px] border-[#ff4800] bg-white/10 text-[#f8f5ee]"
              : "text-[#f8f5ee]/60 hover:bg-white/10 hover:text-[#f8f5ee]",
            collapsed && "justify-center px-2"
          )}
        >
          {collapsed ? (
            <Tooltip content="Home" side="right">
              <Home className={cn("h-5 w-5 shrink-0", isActive("/") && pathname === "/" ? "text-[#f8f5ee]" : "text-[#f8f5ee]/60")} />
            </Tooltip>
          ) : (
            <Home className={cn("h-5 w-5 shrink-0", isActive("/") && pathname === "/" ? "text-[#f8f5ee]" : "text-[#f8f5ee]/60")} />
          )}
          {!collapsed && <span>Home</span>}
        </Link>

        {/* E1: Bookmarks section */}
        {!collapsed && (
          <div className="mt-2 mb-1">
            <div className="flex items-center gap-1.5 px-3 py-1.5 text-[0.75rem] font-medium uppercase tracking-[0.05em] text-[#f8f5ee]/40">
              <Bookmark className="h-3 w-3" />
              <span>Bookmarks</span>
            </div>
            <ul className="mt-0.5 space-y-0.5">
              {bookmarks.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <li key={`bm-${item.href}`}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-[8px] px-3 py-1.5 text-sm transition-colors",
                        active
                          ? "bg-white/10 font-medium text-[#f8f5ee]"
                          : "text-[#f8f5ee]/60 hover:bg-white/10 hover:text-[#f8f5ee]"
                      )}
                    >
                      <Star className={cn("h-3.5 w-3.5 shrink-0", active ? "text-[#ff4800] fill-[#ff4800]" : "text-[#f8f5ee]/30")} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            {/* E2: Section divider line */}
            <div className="mx-3 mt-2 mb-1 h-px bg-white/10" />
          </div>
        )}

        {/* Nav Sections */}
        {navSections.map((section) => (
          <div key={section.label} className="mt-3">
            {!collapsed && (
              <>
                <button
                  onClick={() => toggleSection(section.label)}
                  className="flex w-full items-center justify-between px-3 py-1.5 text-[0.75rem] font-medium uppercase tracking-[0.05em] text-[#f8f5ee]/40 hover:text-[#f8f5ee]/60"
                >
                  <span className="flex items-center gap-1.5">
                    {section.label}
                    {/* E5: Section count badges */}
                    {sectionCounts[section.label] && (
                      <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-white/10 px-1 text-[9px] font-bold text-[#f8f5ee]/50 leading-none">
                        {sectionCounts[section.label]}
                      </span>
                    )}
                  </span>
                  {expandedSections[section.label] ? (
                    <ChevronDown className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5" />
                  )}
                </button>
                {/* E2: Section divider line */}
                {!expandedSections[section.label] && (
                  <div className="mx-3 mt-1 h-px bg-white/6" />
                )}
              </>
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
                          "flex items-center gap-3 rounded-[8px] px-3 py-2 text-sm transition-colors",
                          active
                            ? "border-l-[3px] border-[#ff4800] bg-white/10 font-medium text-[#f8f5ee]"
                            : "text-[#f8f5ee]/60 hover:bg-white/10 hover:text-[#f8f5ee]",
                          collapsed && "justify-center px-2"
                        )}
                      >
                        {/* E3: Tooltips on collapsed icons */}
                        {renderIcon(Icon, active, collapsed ? item.label : undefined)}
                        {!collapsed && (
                          <>
                            <span className="flex-1">{item.label}</span>
                            {item.badge && (
                              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#d9002b] px-1.5 text-[10px] font-bold text-white leading-none">
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
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
          title={collapsed ? "Settings" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-[8px] px-3 py-2 text-sm transition-colors",
            isActive("/settings")
              ? "border-l-[3px] border-[#ff4800] bg-white/10 font-medium text-[#f8f5ee]"
              : "text-[#f8f5ee]/60 hover:bg-white/10 hover:text-[#f8f5ee]",
            collapsed && "justify-center px-2"
          )}
        >
          {renderIcon(Settings, isActive("/settings"), collapsed ? "Settings" : undefined)}
          {!collapsed && <span>Settings</span>}
        </Link>
      </div>
    </aside>
  );
}
