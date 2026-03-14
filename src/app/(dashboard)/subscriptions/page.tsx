"use client";

import { useState } from "react";
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

export default function SubscriptionsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = subscriptions.filter((s) => {
    const matchSearch = s.customer.includes(search) || s.plan.includes(search);
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalMRR = subscriptions.filter((s) => s.status === "active").reduce((sum, s) => sum + s.mrr, 0);
  const activeCount = subscriptions.filter((s) => s.status === "active").length;
  const churnRate = 2.8;
  const maxMrr = Math.max(...mrrTrend.map((m) => m.mrr));

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
      />

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

      {/* Subscriptions Table */}
      <Card>
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-72">
              <Input
                variant="search"
                placeholder="顧客名、プランで検索..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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
                <th className="px-4 py-3 text-left font-medium text-gray-500">顧客</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">プラン</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">MRR</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">課金</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">開始日</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">次回請求</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">ステータス</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub) => (
                <tr key={sub.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
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
                    <button className="rounded p-1 text-gray-400 hover:bg-gray-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-gray-200 px-4 py-3">
          <p className="text-sm text-gray-500">{filtered.length}件のサブスクリプションを表示</p>
        </div>
      </Card>
    </div>
  );
}
