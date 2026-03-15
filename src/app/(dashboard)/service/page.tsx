"use client";

import { useState, useEffect, useRef } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import {
  Ticket,
  Clock,
  ThumbsUp,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  MessageSquare,
  Search,
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
  ArrowUpDown,
  Plus,
  Download,
  X,
} from "lucide-react";

const kpis = [
  {
    label: "未解決チケット",
    value: "28",
    change: -12.5,
    icon: Ticket,
    color: "text-orange-600",
    bg: "bg-orange-50",
    tooltip: "現在未解決のサポートチケット数",
  },
  {
    label: "平均解決時間",
    value: "4.2h",
    change: -18.3,
    icon: Clock,
    color: "text-blue-600",
    bg: "bg-blue-50",
    tooltip: "チケット作成から解決までの平均時間",
  },
  {
    label: "CSAT スコア",
    value: "92.3%",
    change: 3.5,
    icon: ThumbsUp,
    color: "text-green-600",
    bg: "bg-green-50",
    tooltip: "顧客満足度調査の平均スコア（過去30日間）",
  },
  {
    label: "NPS スコア",
    value: "+48",
    change: 5.2,
    icon: TrendingUp,
    color: "text-purple-600",
    bg: "bg-purple-50",
    tooltip: "Net Promoter Score（推奨者 - 批判者の割合）",
  },
];

const ticketStatusDistribution = [
  { status: "新規", count: 8, color: "bg-blue-400" },
  { status: "対応中", count: 12, color: "bg-yellow-400" },
  { status: "待機中", count: 5, color: "bg-gray-400" },
  { status: "エスカレーション", count: 3, color: "bg-red-400" },
  { status: "解決済み", count: 45, color: "bg-green-400" },
];

const totalTickets = ticketStatusDistribution.reduce((s, t) => s + t.count, 0);

const recentTickets = [
  { id: "TK-011", subject: "SSO設定でエラーが発生", priority: "緊急", status: "新規", contact: "松本 隆", time: "30分前" },
  { id: "TK-006", subject: "通知メールが届かない", priority: "緊急", status: "新規", contact: "伊藤 さくら", time: "2時間前" },
  { id: "TK-001", subject: "ログイン不具合の報告", priority: "高", status: "対応中", contact: "田中 太郎", time: "5時間前" },
  { id: "TK-003", subject: "請求書のPDF出力でレイアウト崩れ", priority: "高", status: "対応中", contact: "山田 一郎", time: "昨日" },
  { id: "TK-009", subject: "インポート時のデータ重複問題", priority: "高", status: "対応中", contact: "小林 誠", time: "2日前" },
  { id: "TK-007", subject: "ダッシュボードの表示速度改善", priority: "中", status: "対応中", contact: "渡辺 大輔", time: "3日前" },
];

const knowledgeBaseStats = [
  { label: "公開記事数", value: "156" },
  { label: "今月の閲覧数", value: "12,450" },
  { label: "平均評価", value: "4.6/5.0" },
  { label: "自己解決率", value: "34.2%" },
];

const slaCompliance = [
  { tier: "緊急 (1h)", target: 95, actual: 88 },
  { tier: "高 (4h)", target: 90, actual: 92 },
  { tier: "中 (24h)", target: 85, actual: 96 },
  { tier: "低 (72h)", target: 80, actual: 98 },
];

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case "新規": return "info" as const;
    case "対応中": return "warning" as const;
    case "解決済み": return "success" as const;
    default: return "default" as const;
  }
};

const priorityBadgeVariant = (priority: string) => {
  switch (priority) {
    case "緊急": return "danger" as const;
    case "高": return "danger" as const;
    case "中": return "warning" as const;
    default: return "default" as const;
  }
};

function RowActions() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-50 w-44 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={(e) => { e.stopPropagation(); alert("編集"); setOpen(false); }}>
            <Pencil className="h-3.5 w-3.5" /> 編集
          </button>
          <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={(e) => { e.stopPropagation(); alert("複製"); setOpen(false); }}>
            <Copy className="h-3.5 w-3.5" /> 複製
          </button>
          <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); alert("削除"); setOpen(false); }}>
            <Trash2 className="h-3.5 w-3.5" /> 削除
          </button>
        </div>
      )}
    </div>
  );
}

const savedViews = ["すべて", "未解決", "解決済み"];

export default function ServicePage() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState(savedViews[0]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };
  const sorted = [...recentTickets].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = String((a as unknown as Record<string,unknown>)[sortField] ?? "");
    const bVal = String((b as unknown as Record<string,unknown>)[sortField] ?? "");
    return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });
  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginatedItems = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedItems.map((t) => t.id)));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-gray-100 rounded-lg animate-pulse mt-4" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="サービスハブ"
        description="カスタマーサポートの概要とパフォーマンス"
      />
      {/* Saved View Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200">
        {savedViews.map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeView === view
                ? "border-[#ff4800] text-[#ff4800]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {view}
          </button>
        ))}
        <button
          className="px-2 py-2 text-gray-400 hover:text-gray-600 -mb-px border-b-2 border-transparent"
          onClick={() => alert("ビュー追加は準備中です")}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <p className="text-sm text-gray-500">{recentTickets.length}件のチケット</p>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg bg-[#1f1f1f] px-4 py-2.5 text-white">
          <span className="text-sm font-medium">{selectedIds.size}件を選択中</span>
          <div className="h-4 w-px bg-gray-600" />
          <button className="flex items-center gap-1.5 rounded px-2.5 py-1 text-sm hover:bg-white/10 transition-colors" onClick={() => alert("一括編集は準備中です")}>
            <Pencil className="h-3.5 w-3.5" /> 編集
          </button>
          <button className="flex items-center gap-1.5 rounded px-2.5 py-1 text-sm hover:bg-white/10 transition-colors" onClick={() => alert("エクスポートは準備中です")}>
            <Download className="h-3.5 w-3.5" /> エクスポート
          </button>
          <button className="flex items-center gap-1.5 rounded px-2.5 py-1 text-sm text-red-400 hover:bg-white/10 transition-colors" onClick={() => alert("一括削除は準備中です")}>
            <Trash2 className="h-3.5 w-3.5" /> 削除
          </button>
          <div className="flex-1" />
          <button className="rounded p-1 hover:bg-white/10 transition-colors" onClick={() => setSelectedIds(new Set())}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          const isPositive = kpi.label === "未解決チケット" || kpi.label === "平均解決時間"
            ? kpi.change < 0
            : kpi.change > 0;
          return (
            <div key={kpi.label} title={kpi.tooltip}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${kpi.bg}`}>
                    <Icon className={`h-5 w-5 ${kpi.color}`} />
                  </div>
                  <div className={`flex items-center gap-0.5 ${isPositive ? "text-green-600" : "text-red-600"}`}>
                    {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    <span className="text-xs font-medium">{Math.abs(kpi.change)}%</span>
                  </div>
                </div>
                <p className="text-xl font-bold text-gray-900">{kpi.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
              </CardContent>
            </Card>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Ticket Status Distribution */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">チケットステータス分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-6 rounded-full overflow-hidden mb-4">
              {ticketStatusDistribution.map((item) => (
                <div
                  key={item.status}
                  className={`${item.color} transition-all`}
                  style={{ width: `${(item.count / totalTickets) * 100}%` }}
                  title={`${item.status}: ${item.count}件`}
                />
              ))}
            </div>
            <div className="space-y-2">
              {ticketStatusDistribution.map((item) => (
                <div key={item.status} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${item.color}`} />
                    <span className="text-gray-600">{item.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{item.count}</span>
                    <span className="text-gray-400 text-xs">
                      ({((item.count / totalTickets) * 100).toFixed(0)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Knowledge Base Stats */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-gray-400" />
              ナレッジベース
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {knowledgeBaseStats.map((stat) => (
                <div key={stat.label} className="rounded-lg bg-gray-50 p-3 text-center">
                  <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SLA Compliance */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">SLA コンプライアンス</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {slaCompliance.map((sla) => (
                <div key={sla.tier} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{sla.tier}</span>
                    <span className={`font-medium ${sla.actual >= sla.target ? "text-green-600" : "text-red-600"}`}>
                      {sla.actual}%
                      <span className="text-gray-400 text-xs ml-1">/ {sla.target}%</span>
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div
                      className={`h-2 rounded-full ${sla.actual >= sla.target ? "bg-green-400" : "bg-red-400"}`}
                      style={{ width: `${Math.min(sla.actual, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tickets */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>最近のチケット</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="検索..." className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-[#ff4800]/20 focus:border-[#ff4800]" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left font-medium text-gray-500 w-10">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={paginatedItems.length > 0 && selectedIds.size === paginatedItems.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("id")}><div className="flex items-center gap-1">ID <ArrowUpDown className="h-3 w-3" /></div></th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("subject")}><div className="flex items-center gap-1">件名 <ArrowUpDown className="h-3 w-3" /></div></th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("priority")}><div className="flex items-center gap-1">優先度 <ArrowUpDown className="h-3 w-3" /></div></th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">ステータス</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">コンタクト</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">経過</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.filter(item => {
                  if (searchQuery && !JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase())) return false;
                  return true;
                }).map((ticket) => (
                  <tr key={ticket.id} className={`border-b border-gray-100 hover:bg-gray-50 ${selectedIds.has(ticket.id) ? "bg-blue-50/50" : ""}`}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedIds.has(ticket.id)}
                        onChange={() => toggleSelect(ticket.id)}
                      />
                    </td>
                    <td className="px-6 py-3 text-gray-500 font-mono text-xs">{ticket.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {ticket.subject}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={priorityBadgeVariant(ticket.priority)}>{ticket.priority}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusBadgeVariant(ticket.status)}>{ticket.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{ticket.contact}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{ticket.time}</td>
                    <td className="px-4 py-3"><RowActions /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 mt-2">
                <p className="text-sm text-gray-500">{sorted.length}件中 {(currentPage-1)*itemsPerPage+1}〜{Math.min(currentPage*itemsPerPage, sorted.length)}件</p>
                <div className="flex gap-1">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage===1} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">前へ</button>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage===totalPages} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">次へ</button>
                </div>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
