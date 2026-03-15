"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import {
  Plus,
  LayoutDashboard,
  BarChart3,
  TrendingUp,
  Hash,
  Table2,
  Filter as FilterIcon,
  MoreHorizontal,
  Eye,
  Clock,
  Star,
  Search,
  ArrowUpDown,
  Pencil,
  Download,
  Trash2,
  X,
} from "lucide-react";

type WidgetType = "chart" | "number" | "table" | "funnel";

interface Widget {
  id: string;
  name: string;
  type: WidgetType;
  value?: string;
}

interface Dashboard {
  id: string;
  name: string;
  description: string;
  widgets: Widget[];
  lastViewed: string;
  createdBy: string;
  shared: boolean;
  favorite: boolean;
}

const dashboards: Dashboard[] = [
  {
    id: "db1",
    name: "営業パフォーマンス",
    description: "営業チーム全体のKPIとパフォーマンス指標",
    widgets: [
      { id: "w1", name: "月間売上", type: "number", value: "¥12.4M" },
      { id: "w2", name: "成約率推移", type: "chart" },
      { id: "w3", name: "パイプライン金額", type: "number", value: "¥68.5M" },
      { id: "w4", name: "セールスファネル", type: "funnel" },
      { id: "w5", name: "取引一覧", type: "table" },
      { id: "w6", name: "月次売上推移", type: "chart" },
    ],
    lastViewed: "2026-03-14",
    createdBy: "佐藤 匠",
    shared: true,
    favorite: true,
  },
  {
    id: "db2",
    name: "マーケティング分析",
    description: "マーケティング施策の効果測定ダッシュボード",
    widgets: [
      { id: "w7", name: "リード獲得数", type: "number", value: "186" },
      { id: "w8", name: "チャネル別リード", type: "chart" },
      { id: "w9", name: "メール開封率", type: "number", value: "28.5%" },
      { id: "w10", name: "フォームCVR", type: "chart" },
    ],
    lastViewed: "2026-03-13",
    createdBy: "田村 愛",
    shared: true,
    favorite: false,
  },
  {
    id: "db3",
    name: "カスタマーサービス",
    description: "サポートチームの対応状況とCSAT",
    widgets: [
      { id: "w11", name: "未解決チケット", type: "number", value: "28" },
      { id: "w12", name: "CSAT スコア", type: "number", value: "92.3%" },
      { id: "w13", name: "解決時間推移", type: "chart" },
      { id: "w14", name: "チケット一覧", type: "table" },
      { id: "w15", name: "SLA達成率", type: "chart" },
    ],
    lastViewed: "2026-03-12",
    createdBy: "佐藤 匠",
    shared: false,
    favorite: true,
  },
  {
    id: "db4",
    name: "収益予測",
    description: "四半期ごとの収益予測と実績比較",
    widgets: [
      { id: "w16", name: "Q1 予測", type: "number", value: "¥38.2M" },
      { id: "w17", name: "予測 vs 実績", type: "chart" },
      { id: "w18", name: "チーム別予測", type: "table" },
      { id: "w19", name: "パイプラインファネル", type: "funnel" },
    ],
    lastViewed: "2026-03-11",
    createdBy: "佐藤 匠",
    shared: true,
    favorite: false,
  },
  {
    id: "db5",
    name: "チーム活動状況",
    description: "営業チームのアクティビティ追跡",
    widgets: [
      { id: "w20", name: "今日のコール数", type: "number", value: "42" },
      { id: "w21", name: "週間アクティビティ", type: "chart" },
      { id: "w22", name: "タスク完了率", type: "number", value: "79.5%" },
    ],
    lastViewed: "2026-03-10",
    createdBy: "田村 愛",
    shared: false,
    favorite: false,
  },
];

const widgetTypeConfig: Record<WidgetType, { icon: typeof BarChart3; label: string; color: string; bg: string }> = {
  chart: { icon: BarChart3, label: "チャート", color: "text-blue-600", bg: "bg-blue-50" },
  number: { icon: Hash, label: "数値", color: "text-green-600", bg: "bg-green-50" },
  table: { icon: Table2, label: "テーブル", color: "text-purple-600", bg: "bg-purple-50" },
  funnel: { icon: FilterIcon, label: "ファネル", color: "text-orange-600", bg: "bg-orange-50" },
};

export default function DashboardsPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);

  const [filter, setFilter] = useState<"all" | "favorites" | "shared">("all");
  const [activeView, setActiveView] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<"name" | "lastViewed" | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const handleSort = (field: "name" | "lastViewed") => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const views = [
    { key: "all", label: "すべて" },
    { key: "mine", label: "マイダッシュボード" },
  ];

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((d) => d.id)));
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

  const filtered = dashboards.filter((db) => {
    if (filter === "favorites") return db.favorite;
    if (filter === "shared") return db.shared;
    if (searchQuery && !db.name.toLowerCase().includes(searchQuery.toLowerCase()) && !db.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField];
    const bVal = b[sortField];
    return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });


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
        title="ダッシュボード"
        description="カスタムダッシュボードでデータを可視化"
        actions={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

      <p className="text-sm text-gray-500">{dashboards.length}件のダッシュボード</p>

              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="ダッシュボードを検索..." className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-[#ff4800]/20 focus:border-[#ff4800]" />
            </div>
            <Button size="sm" onClick={() => alert("ダッシュボード作成は準備中です")}>
              <Plus className="h-4 w-4 mr-1" />
              ダッシュボード作成
            </Button>
          </div>
        }
      />

      <div className="flex items-center gap-1 border-b border-gray-200 px-1 mb-4">
        {views.map((v) => (
          <button key={v.key} onClick={() => setActiveView(v.key)}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeView === v.key ? "border-[#ff4800] text-[#1f1f1f]" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>{v.label}</button>
        ))}
        <button className="ml-1 p-1.5 text-gray-400 hover:text-gray-600 rounded"><Plus className="h-4 w-4" /></button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {[
          { key: "all" as const, label: "すべて", count: dashboards.length },
          { key: "favorites" as const, label: "お気に入り", count: dashboards.filter((d) => d.favorite).length },
          { key: "shared" as const, label: "共有", count: dashboards.filter((d) => d.shared).length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              filter === tab.key
                ? "border-[#ff4800] text-[#ff4800]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            <span className={`rounded-full px-1.5 py-0.5 text-xs ${
              filter === tab.key ? "bg-[#ff4800]/10 text-[#ff4800]" : "bg-gray-100 text-gray-500"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Sort Controls */}
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-1.5 text-sm text-gray-500">
          <input
            type="checkbox"
            className="rounded border-gray-300"
            checked={filtered.length > 0 && selectedIds.size === filtered.length}
            onChange={toggleSelectAll}
          />
          すべて選択
        </label>
        <button onClick={() => handleSort("name")} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          名前順 <ArrowUpDown className="h-3 w-3" />
        </button>
        <button onClick={() => handleSort("lastViewed")} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          最終閲覧順 <ArrowUpDown className="h-3 w-3" />
        </button>
      </div>

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

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filtered.map((dashboard) => (
          <Card key={dashboard.id} className={`hover:border-gray-300 transition-all ${selectedIds.has(dashboard.id) ? "ring-2 ring-[#ff4800]/30" : ""}`}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 mt-1"
                    checked={selectedIds.has(dashboard.id)}
                    onChange={() => toggleSelect(dashboard.id)}
                  />
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFF1ED]">
                    <LayoutDashboard className="h-5 w-5 text-[#ff4800]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-gray-900">{dashboard.name}</h3>
                      {dashboard.favorite && <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />}
                      {dashboard.shared && <Badge variant="info">共有</Badge>}
                    </div>
                    <p className="text-xs text-gray-500">{dashboard.description}</p>
                  </div>
                </div>
                <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>

              {/* Widget Grid Preview */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {dashboard.widgets.slice(0, 6).map((widget) => {
                  const wConfig = widgetTypeConfig[widget.type];
                  const WIcon = wConfig.icon;
                  return (
                    <div key={widget.id} className={`rounded-md ${wConfig.bg} p-2 text-center`}>
                      <WIcon className={`h-4 w-4 mx-auto mb-0.5 ${wConfig.color}`} />
                      <p className="text-[9px] text-gray-600 truncate">{widget.name}</p>
                      {widget.value && (
                        <p className="text-xs font-bold text-gray-900">{widget.value}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-100">
                <span className="flex items-center gap-1">
                  <LayoutDashboard className="h-3 w-3" />
                  {dashboard.widgets.length} ウィジェット
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {dashboard.lastViewed}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {dashboard.createdBy}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <LayoutDashboard className="h-8 w-8 text-gray-300" />
          </div>
          <h3 className="text-base font-medium text-gray-900 mb-1">データがありません</h3>
          <p className="text-sm text-gray-500">新しいダッシュボードを作成して始めましょう</p>
        </div>
      )}
    </div>
  );
}
