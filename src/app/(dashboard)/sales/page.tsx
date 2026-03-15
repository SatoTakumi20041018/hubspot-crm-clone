"use client";

import { useState, useEffect, useRef } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import {
  Handshake,
  TrendingUp,
  Target,
  DollarSign,
  ArrowUpRight,
  Trophy,
  CheckSquare,
  Phone,
  Mail,
  Calendar,
  Clock,
  ArrowUpDown,
  Search,
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
} from "lucide-react";

const kpis = [
  {
    label: "進行中の取引",
    value: "42",
    change: "+8.3%",
    icon: Handshake,
    color: "text-blue-600",
    bg: "bg-blue-50",
    tooltip: "現在パイプラインで進行中の取引数",
  },
  {
    label: "今月の成約",
    value: "12",
    change: "+25.0%",
    icon: Trophy,
    color: "text-green-600",
    bg: "bg-green-50",
    tooltip: "今月成約（クローズ済み）した取引の件数",
  },
  {
    label: "パイプライン金額",
    value: "¥68.5M",
    change: "+15.2%",
    icon: TrendingUp,
    color: "text-purple-600",
    bg: "bg-purple-50",
    tooltip: "パイプライン内の全取引の合計金額",
  },
  {
    label: "平均取引サイズ",
    value: "¥4.2M",
    change: "+5.8%",
    icon: DollarSign,
    color: "text-orange-600",
    bg: "bg-orange-50",
    tooltip: "成約済み取引の平均金額",
  },
  {
    label: "成約率",
    value: "28.5%",
    change: "+3.2%",
    icon: Target,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    tooltip: "全取引のうち成約に至った割合",
  },
];

const activityFeed = [
  { type: "email", text: "田中太郎へ提案書を送信", time: "10分前", icon: Mail },
  { type: "call", text: "鈴木花子と30分通話", time: "1時間前", icon: Phone },
  { type: "meeting", text: "ABC株式会社とのデモ完了", time: "2時間前", icon: Calendar },
  { type: "deal", text: "ECサイト構築案件が「見積提出」に移動", time: "3時間前", icon: Handshake },
  { type: "task", text: "四半期営業レポート完了", time: "4時間前", icon: CheckSquare },
  { type: "email", text: "グローバルシステムへフォローメール", time: "5時間前", icon: Mail },
  { type: "deal", text: "Webアプリ開発が「交渉中」に移動", time: "昨日", icon: Handshake },
];

const upcomingTasks = [
  { title: "田中様へフォローアップメール送信", dueDate: "今日", priority: "high" },
  { title: "鈴木テクノロジー 提案書修正", dueDate: "今日", priority: "high" },
  { title: "ABC株式会社 契約書送付", dueDate: "明日", priority: "medium" },
  { title: "高橋様 見積書の確認連絡", dueDate: "期限超過", priority: "high" },
  { title: "グローバルシステム 要件定義レビュー", dueDate: "3月18日", priority: "high" },
];

const topDeals = [
  { name: "基幹システムリプレイス", company: "グローバルシステム", amount: 15000000, stage: "見積提出", probability: 50 },
  { name: "クラウド移行プロジェクト", company: "鈴木テクノロジー", amount: 8500000, stage: "提案中", probability: 40 },
  { name: "ECプラットフォーム導入", company: "太陽コーポレーション", amount: 7200000, stage: "契約締結", probability: 100 },
  { name: "データ分析基盤構築", company: "デジタルソリューションズ", amount: 6800000, stage: "提案中", probability: 30 },
  { name: "Webアプリ開発", company: "フューチャーテック", amount: 5500000, stage: "交渉中", probability: 80 },
];

const leaderboard = [
  { name: "佐藤 匠", deals: 18, revenue: 32500000, winRate: 32.1 },
  { name: "田村 愛", deals: 12, revenue: 18200000, winRate: 27.8 },
  { name: "山本 健太", deals: 8, revenue: 12400000, winRate: 24.5 },
  { name: "鈴木 直美", deals: 6, revenue: 8900000, winRate: 21.3 },
];

const stageBadgeVariant = (stage: string) => {
  switch (stage) {
    case "契約締結": return "success" as const;
    case "交渉中": return "warning" as const;
    case "見積提出": return "warning" as const;
    case "提案中": return "info" as const;
    case "初回商談": return "info" as const;
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

export default function SalesPage() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };
  const sortedDeals = [...topDeals].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = String((a as unknown as Record<string,unknown>)[sortField] ?? "");
    const bVal = String((b as unknown as Record<string,unknown>)[sortField] ?? "");
    return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });
  const filteredDeals = sortedDeals.filter(item => {
    if (searchQuery && !JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });
  const totalPages = Math.ceil(filteredDeals.length / itemsPerPage);
  const paginatedItems = filteredDeals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


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
        title="セールスワークスペース"
        description="営業活動の概要とパフォーマンス"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} title={kpi.tooltip}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${kpi.bg}`}>
                    <Icon className={`h-5 w-5 ${kpi.color}`} />
                  </div>
                  <div className="flex items-center gap-0.5 text-green-600">
                    <ArrowUpRight className="h-3 w-3" />
                    <span className="text-xs font-medium">{kpi.change}</span>
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Activity Feed */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">最近のアクティビティ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activityFeed.map((activity, i) => {
                const Icon = activity.icon;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                      <Icon className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.text}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">今後のタスク</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingTasks.map((task, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-gray-100 p-3">
                  <CheckSquare className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{task.title}</p>
                    <p className={`text-xs mt-1 ${task.dueDate === "期限超過" ? "text-red-600 font-medium" : "text-gray-500"}`}>
                      {task.dueDate}
                    </p>
                  </div>
                  <Badge variant={
                    task.priority === "high" ? "danger" :
                    task.priority === "medium" ? "warning" : "default"
                  }>
                    {task.priority === "high" ? "高" : task.priority === "medium" ? "中" : "低"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sales Leaderboard */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">セールスリーダーボード</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.map((person, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#ff4800] text-xs font-medium text-white">
                    {person.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">{person.name}</p>
                      {i === 0 && <span className="text-xs text-yellow-600 font-medium">Top</span>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                      <span>{person.deals}件成約</span>
                      <span>¥{(person.revenue / 10000).toLocaleString()}万</span>
                      <span>成約率 {person.winRate}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Deals Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>トップ取引</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="検索..." className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-[#ff4800]/20 focus:border-[#ff4800]" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("name")}><div className="flex items-center gap-1">取引名 <ArrowUpDown className="h-3 w-3" /></div></th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("company")}><div className="flex items-center gap-1">会社 <ArrowUpDown className="h-3 w-3" /></div></th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("amount")}><div className="flex items-center justify-end gap-1">金額 <ArrowUpDown className="h-3 w-3" /></div></th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">ステージ</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">確度</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.map((deal, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">{deal.name}</td>
                    <td className="px-4 py-3 text-gray-600">{deal.company}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      ¥{deal.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={stageBadgeVariant(deal.stage)}>{deal.stage}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">{deal.probability}%</td>
                    <td className="px-4 py-3"><RowActions /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 mt-2">
                <p className="text-sm text-gray-500">{filteredDeals.length}件中 {(currentPage-1)*itemsPerPage+1}〜{Math.min(currentPage*itemsPerPage, filteredDeals.length)}件</p>
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
