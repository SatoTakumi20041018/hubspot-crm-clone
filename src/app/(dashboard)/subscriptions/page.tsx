"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatsCard } from "@/components/ui/stats-card";
import {
  RefreshCw,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  BarChart3,
  MoreHorizontal,
  AlertTriangle,
  Plus,
  ArrowUpDown,
  Download,
} from "lucide-react";

const subscriptions = [
  { id: 1, customer: "田中商事株式会社", plan: "Enterprise", mrr: 450000, startDate: "2025-04-01", nextBilling: "2026-04-01", status: "active" as const, billing: "年額" },
  { id: 2, customer: "鈴木テクノロジー", plan: "Professional", mrr: 280000, startDate: "2025-07-15", nextBilling: "2026-04-15", status: "active" as const, billing: "月額" },
  { id: 3, customer: "グローバルシステム", plan: "Enterprise", mrr: 350000, startDate: "2025-01-01", nextBilling: "2026-04-01", status: "active" as const, billing: "年額" },
  { id: 4, customer: "イノベーション株式会社", plan: "Professional", mrr: 180000, startDate: "2025-09-01", nextBilling: "2026-04-01", status: "active" as const, billing: "月額" },
  { id: 5, customer: "東京マーケティング", plan: "Professional", mrr: 220000, startDate: "2025-06-15", nextBilling: "2026-04-15", status: "active" as const, billing: "月額" },
  { id: 6, customer: "さくらデザイン", plan: "Starter", mrr: 120000, startDate: "2025-11-01", nextBilling: "2026-04-01", status: "past_due" as const, billing: "月額" },
  { id: 7, customer: "フューチャーテック", plan: "Enterprise", mrr: 350000, startDate: "2024-10-01", nextBilling: "2026-04-01", status: "canceling" as const, billing: "年額" },
  { id: 8, customer: "サンライズメディア", plan: "Professional", mrr: 190000, startDate: "2025-08-01", nextBilling: "2026-04-01", status: "active" as const, billing: "月額" },
  { id: 9, customer: "太陽コーポレーション", plan: "Enterprise", mrr: 280000, startDate: "2025-03-01", nextBilling: "2026-04-01", status: "active" as const, billing: "年額" },
];

const mrrTrend = [
  { month: "2025/10", mrr: 2150000, new: 180000, churned: 120000 },
  { month: "2025/11", mrr: 2280000, new: 250000, churned: 120000 },
  { month: "2025/12", mrr: 2350000, new: 190000, churned: 120000 },
  { month: "2026/01", mrr: 2420000, new: 220000, churned: 150000 },
  { month: "2026/02", mrr: 2350000, new: 80000, churned: 150000 },
  { month: "2026/03", mrr: 2420000, new: 190000, churned: 120000 },
];

const statusConfig = {
  active: { label: "アクティブ", variant: "success" as const },
  past_due: { label: "支払い遅延", variant: "danger" as const },
  canceling: { label: "解約予定", variant: "warning" as const },
  canceled: { label: "解約済み", variant: "default" as const },
};


function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button onClick={(e) => { e.stopPropagation(); setOpen(!open); }} className="p-1 rounded hover:bg-gray-100">
        <MoreHorizontal className="h-4 w-4 text-gray-400" />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-10 w-40 rounded-lg border bg-white py-1 shadow-lg">
          <button onClick={() => { onEdit(); setOpen(false); }} className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50">編集</button>
          <button onClick={() => { onEdit(); setOpen(false); }} className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50">複製</button>
          <button onClick={() => { onDelete(); setOpen(false); }} className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">削除</button>
        </div>
      )}
    </div>
  );
}

export default function SubscriptionsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);

  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState("all");

  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const filteredBase = subscriptions.filter((s) => {
    const matchSearch = s.customer.includes(search) || s.plan.includes(search);
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const filtered = [...filteredBase].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = String((a as unknown as Record<string,unknown>)[sortField] ?? "");
    const bVal = String((b as unknown as Record<string,unknown>)[sortField] ?? "");
    return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((item) => String(item.id))));
    }
  };

  const toggle = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const totalMRR = subscriptions.filter((s) => s.status === "active").reduce((sum, s) => sum + s.mrr, 0);
  const activeCount = subscriptions.filter((s) => s.status === "active").length;
  const churnRate = 2.8;
  const maxMrr = Math.max(...mrrTrend.map((m) => m.mrr));


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
        title="サブスクリプション"
        description="サブスクリプションの管理と収益追跡"
        breadcrumbs={[
          { label: "ホーム", href: "/" },
          { label: "コマース", href: "/commerce" },
          { label: "サブスクリプション" },
        ]}
      
        actions={
          <Button variant="outline" size="sm" onClick={() => alert("エクスポート機能は準備中です")}>
            <Download className="h-4 w-4 mr-1" />
            エクスポート
          </Button>
        }
      />

      {/* Saved View Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 px-1">
        {[
          { key: "all", label: "すべて" },
          { key: "active", label: "アクティブ" },
          { key: "canceling", label: "解約" },
        ].map((v) => (
          <button key={v.key} onClick={() => { setStatusFilter(v.key === "all" ? "all" : v.key); setCurrentPage(1); }}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
              statusFilter === (v.key === "all" ? "all" : v.key) ? "border-[#ff4800] text-[#1f1f1f]" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>{v.label}</button>
        ))}
        <button className="ml-1 p-1.5 text-gray-400 hover:text-gray-600 rounded" onClick={() => alert("ビューの追加は準備中です")}><Plus className="h-4 w-4" /></button>
      </div>

      <p className="text-sm text-gray-500">{filtered.length}件のサブスクリプション</p>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatsCard label="合計MRR" value={`¥${(totalMRR / 10000).toLocaleString()}万`} change={3} changeLabel="前月比" icon={DollarSign} />
        <StatsCard label="アクティブ数" value={activeCount} change={2} changeLabel="前月比" icon={Users} />
        <StatsCard label="チャーンレート" value={`${churnRate}%`} change={-0.5} changeLabel="前月比" icon={TrendingDown} />
        <StatsCard label="ARPU" value={`¥${Math.round(totalMRR / activeCount).toLocaleString()}`} change={5} changeLabel="前月比" icon={TrendingUp} />
      </div>

      {/* MRR Trend Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#ff4800]" />
            <CardTitle>MRR推移</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4 h-44">
            {mrrTrend.map((month) => (
              <div key={month.month} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-medium text-gray-600">
                  ¥{(month.mrr / 10000).toFixed(0)}万
                </span>
                <div className="relative w-full">
                  <div
                    className="w-full rounded-t-md bg-[#ff4800]"
                    style={{ height: `${(month.mrr / maxMrr) * 130}px` }}
                  />
                </div>
                <span className="text-xs text-gray-500">{month.month}</span>
                <div className="flex gap-2 text-xs">
                  <span className="text-[#00823a]">+¥{(month.new / 10000).toFixed(0)}万</span>
                  <span className="text-[#d9002b]">-¥{(month.churned / 10000).toFixed(0)}万</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Churn Rate Card */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#fcc6b1] p-3">
                <TrendingDown className="h-5 w-5 text-[#d9002b]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">月次チャーンレート</p>
                <p className="text-2xl font-bold text-gray-900">{churnRate}%</p>
                <p className="text-xs text-[#00823a]">目標: 3.0%以下</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#b9cdbe] p-3">
                <TrendingUp className="h-5 w-5 text-[#00823a]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">ネットMRR成長率</p>
                <p className="text-2xl font-bold text-gray-900">+2.9%</p>
                <p className="text-xs text-gray-500">¥+70,000/月</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#ece6d9] p-3">
                <AlertTriangle className="h-5 w-5 text-[#8a6d00]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">リスクサブスクリプション</p>
                <p className="text-2xl font-bold text-gray-900">2件</p>
                <p className="text-xs text-[#d9002b]">MRR影響: ¥470,000</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      
      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <RefreshCw className="h-8 w-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">データがありません</h3>
          <p className="text-sm text-gray-500 mb-4">新しいサブスクリプションを作成して始めましょう</p>
          <Button size="sm" onClick={() => alert("作成は準備中です")}>
            <Plus className="h-4 w-4 mr-1" /> サブスクリプションを作成
          </Button>
        </div>
      )}

      {/* Subscriptions Table */}
      <Card>
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-72">
              <Input
                variant="search"
                placeholder="顧客名、プランで検索..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <select
              className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="all">すべてのステータス</option>
              <option value="active">アクティブ</option>
              <option value="past_due">支払い遅延</option>
              <option value="canceling">解約予定</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="w-10 px-3"><input type="checkbox" className="rounded border-gray-300" onChange={toggleAll} checked={filtered.length > 0 && selectedIds.size === filtered.length} /></th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("customer")}><div className="flex items-center gap-1">顧客 <ArrowUpDown className="h-3 w-3" /></div></th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("plan")}><div className="flex items-center gap-1">プラン <ArrowUpDown className="h-3 w-3" /></div></th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("mrr")}><div className="flex items-center justify-end gap-1">MRR <ArrowUpDown className="h-3 w-3" /></div></th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">課金</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">開始日</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">次回請求</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">ステータス</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((sub) => (
                <tr key={sub.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => router.push(`/subscriptions/${sub.id}`)}>
                  <td className="w-10 px-3"><input type="checkbox" className="rounded border-gray-300" checked={selectedIds.has(String(sub.id))} onChange={() => toggle(String(sub.id))} onClick={(e) => e.stopPropagation()} /></td>
                  <td className="px-4 py-3 font-medium text-gray-900">{sub.customer}</td>
                  <td className="px-4 py-3">
                    <Badge variant={sub.plan === "Enterprise" ? "purple" : sub.plan === "Professional" ? "info" : "default"}>
                      {sub.plan}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">¥{sub.mrr.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-600">{sub.billing}</td>
                  <td className="px-4 py-3 text-gray-600">{sub.startDate}</td>
                  <td className="px-4 py-3 text-gray-600">{sub.nextBilling}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusConfig[sub.status].variant}>
                      {statusConfig[sub.status].label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <RowActions onEdit={() => alert("編集は準備中です")} onDelete={() => alert("削除は準備中です")} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 mt-2">
                <p className="text-sm text-gray-500">{filtered.length}件中 {(currentPage-1)*itemsPerPage+1}〜{Math.min(currentPage*itemsPerPage, filtered.length)}件</p>
                <div className="flex gap-1">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage===1} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">前へ</button>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage===totalPages} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">次へ</button>
                </div>
              </div>
            )}

      </Card>
    </div>
  );
}
