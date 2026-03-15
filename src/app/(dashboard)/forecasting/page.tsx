"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import {
  TrendingUp,
  Target,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
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

const forecastPeriods = ["Q1 2026", "Q2 2026", "Q3 2026", "Q4 2026"];

const forecastSummary = [
  { label: "クォータ（目標）", value: "¥45.0M", icon: Target, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "予測値", value: "¥38.2M", icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
  { label: "確定（成約済み）", value: "¥22.4M", icon: DollarSign, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "達成率", value: "84.9%", icon: BarChart3, color: "text-orange-600", bg: "bg-orange-50" },
];

const pipelineVsForecast = [
  { month: "1月", pipeline: 18500000, forecast: 12000000, closed: 6300000 },
  { month: "2月", pipeline: 22000000, forecast: 15000000, closed: 8900000 },
  { month: "3月", pipeline: 28000000, forecast: 18000000, closed: 12450000 },
  { month: "4月", pipeline: 32000000, forecast: 20000000, closed: 0 },
  { month: "5月", pipeline: 25000000, forecast: 16000000, closed: 0 },
  { month: "6月", pipeline: 20000000, forecast: 13000000, closed: 0 },
];
const maxBarValue = Math.max(...pipelineVsForecast.map((m) => m.pipeline));

const teamForecast = [
  {
    name: "佐藤 匠",
    quota: 18000000,
    forecast: 15800000,
    closed: 9500000,
    pipeline: 24000000,
    deals: 8,
    attainment: 87.8,
  },
  {
    name: "田村 愛",
    quota: 14000000,
    forecast: 11200000,
    closed: 7200000,
    pipeline: 16000000,
    deals: 6,
    attainment: 80.0,
  },
  {
    name: "山本 健太",
    quota: 8000000,
    forecast: 6800000,
    closed: 3800000,
    pipeline: 10000000,
    deals: 4,
    attainment: 85.0,
  },
  {
    name: "鈴木 直美",
    quota: 5000000,
    forecast: 4400000,
    closed: 1900000,
    pipeline: 7500000,
    deals: 3,
    attainment: 88.0,
  },
];

const monthlyTrend = [
  { month: "10月", actual: 4200000, target: 5000000 },
  { month: "11月", actual: 5800000, target: 5500000 },
  { month: "12月", actual: 7100000, target: 6000000 },
  { month: "1月", actual: 6300000, target: 6500000 },
  { month: "2月", actual: 8900000, target: 7000000 },
  { month: "3月", actual: 12450000, target: 8000000 },
];
const maxTrend = Math.max(...monthlyTrend.map((m) => Math.max(m.actual, m.target)));

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

const savedViews = ["月次", "四半期"];

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mt-2" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
      <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
    </div>
  );
}

export default function ForecastingPage() {
  const [period, setPeriod] = useState("Q1 2026");
  const [activeView, setActiveView] = useState(savedViews[0]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };
  const sortedTeam = [...teamForecast].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = String((a as unknown as Record<string,unknown>)[sortField] ?? "");
    const bVal = String((b as unknown as Record<string,unknown>)[sortField] ?? "");
    return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedTeam.length / itemsPerPage);
  const paginatedItems = sortedTeam.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedItems.map((p) => p.name)));
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

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="売上予測"
        description="パイプラインに基づく売上予測と目標達成状況"
        actions={
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />

      <p className="text-sm text-gray-500">{teamForecast.length}件のチーム予測</p>

            <select
              className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:border-[#ff4800] focus:outline-none focus:ring-1 focus:ring-[#ff4800]"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              {forecastPeriods.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        }
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {forecastSummary.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${item.bg}`}>
                    <Icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                </div>
                <p className="text-xl font-bold text-gray-900">{item.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pipeline vs Forecast Bar Chart */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-gray-400" />
              パイプライン vs 予測 vs 成約
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded bg-blue-300" />
                <span className="text-gray-600">パイプライン</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded bg-[#ff4800]" />
                <span className="text-gray-600">予測</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded bg-green-400" />
                <span className="text-gray-600">成約</span>
              </div>
            </div>
            <div className="space-y-3">
              {pipelineVsForecast.map((m) => (
                <div key={m.month} className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{m.month}</span>
                    <span>¥{(m.pipeline / 10000).toLocaleString()}万</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-3 rounded bg-gray-100">
                      <div
                        className="h-3 rounded bg-blue-300"
                        style={{ width: `${(m.pipeline / maxBarValue) * 100}%` }}
                      />
                    </div>
                    <div className="h-3 rounded bg-gray-100">
                      <div
                        className="h-3 rounded bg-[#ff4800]"
                        style={{ width: `${(m.forecast / maxBarValue) * 100}%` }}
                      />
                    </div>
                    {m.closed > 0 && (
                      <div className="h-3 rounded bg-gray-100">
                        <div
                          className="h-3 rounded bg-green-400"
                          style={{ width: `${(m.closed / maxBarValue) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-gray-400" />
              月次売上トレンド
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded bg-[#ff4800]" />
                <span className="text-gray-600">実績</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded bg-gray-300" />
                <span className="text-gray-600">目標</span>
              </div>
            </div>
            <div className="flex items-end gap-4 h-48">
              {monthlyTrend.map((m) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="flex items-end gap-1 w-full" style={{ height: "160px" }}>
                    <div
                      className="flex-1 rounded-t bg-[#ff4800] hover:bg-[#e64200] transition-colors"
                      style={{ height: `${(m.actual / maxTrend) * 100}%` }}
                    />
                    <div
                      className="flex-1 rounded-t bg-gray-300"
                      style={{ height: `${(m.target / maxTrend) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{m.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Forecast Breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>チーム別予測</CardTitle>
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
                  <th className="px-6 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("name")}><div className="flex items-center gap-1">担当者 <ArrowUpDown className="h-3 w-3" /></div></th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("quota")}><div className="flex items-center justify-end gap-1">クォータ <ArrowUpDown className="h-3 w-3" /></div></th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("forecast")}><div className="flex items-center justify-end gap-1">予測 <ArrowUpDown className="h-3 w-3" /></div></th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">成約済み</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">パイプライン</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">案件数</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">達成率</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.filter(item => {
                  if (searchQuery && !JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase())) return false;
                  return true;
                }).map((person) => (
                  <tr key={person.name} className={`border-b border-gray-100 hover:bg-gray-50 ${selectedIds.has(person.name) ? "bg-blue-50/50" : ""}`}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedIds.has(person.name)}
                        onChange={() => toggleSelect(person.name)}
                      />
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff4800] text-xs font-medium text-white">
                          {person.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900">{person.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      ¥{(person.quota / 10000).toLocaleString()}万
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      ¥{(person.forecast / 10000).toLocaleString()}万
                    </td>
                    <td className="px-4 py-3 text-right text-green-600 font-medium">
                      ¥{(person.closed / 10000).toLocaleString()}万
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      ¥{(person.pipeline / 10000).toLocaleString()}万
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">{person.deals}件</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-gray-100">
                          <div
                            className={`h-2 rounded-full ${person.attainment >= 85 ? "bg-green-400" : person.attainment >= 70 ? "bg-yellow-400" : "bg-red-400"}`}
                            style={{ width: `${Math.min(person.attainment, 100)}%` }}
                          />
                        </div>
                        <span className={`text-sm font-medium ${person.attainment >= 85 ? "text-green-600" : person.attainment >= 70 ? "text-yellow-600" : "text-red-600"}`}>
                          {person.attainment}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><RowActions /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 mt-2">
                <p className="text-sm text-gray-500">{sortedTeam.length}件中 {(currentPage-1)*itemsPerPage+1}〜{Math.min(currentPage*itemsPerPage, sortedTeam.length)}件</p>
                <div className="flex gap-1">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage===1} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">前へ</button>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage===totalPages} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">次へ</button>
                </div>
              </div>
            )}
        </CardContent>
      </Card>

      {teamForecast.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <TrendingUp className="h-8 w-8 text-gray-300" />
          </div>
          <h3 className="text-base font-medium text-gray-900 mb-1">データがありません</h3>
          <p className="text-sm text-gray-500">新しい予測データを作成して始めましょう</p>
        </div>
      )}
    </div>
  );
}
