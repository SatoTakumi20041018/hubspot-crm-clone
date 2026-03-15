"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatsCard } from "@/components/ui/stats-card";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Download,
  Filter,
  MoreHorizontal,
  ArrowUpDown,
  BarChart3,
} from "lucide-react";

const payments = [
  { id: "PAY-001", customer: "田中商事株式会社", amount: 450000, method: "クレジットカード", date: "2026-03-14", status: "completed" as const },
  { id: "PAY-002", customer: "鈴木テクノロジー", amount: 280000, method: "銀行振込", date: "2026-03-14", status: "completed" as const },
  { id: "PAY-003", customer: "グローバルシステム", amount: 350000, method: "クレジットカード", date: "2026-03-13", status: "completed" as const },
  { id: "PAY-004", customer: "イノベーション株式会社", amount: 180000, method: "クレジットカード", date: "2026-03-13", status: "pending" as const },
  { id: "PAY-005", customer: "東京マーケティング", amount: 220000, method: "銀行振込", date: "2026-03-12", status: "completed" as const },
  { id: "PAY-006", customer: "さくらデザイン", amount: 120000, method: "クレジットカード", date: "2026-03-11", status: "completed" as const },
  { id: "PAY-007", customer: "フューチャーテック", amount: 350000, method: "銀行振込", date: "2026-03-10", status: "completed" as const },
  { id: "PAY-008", customer: "サンライズメディア", amount: 190000, method: "クレジットカード", date: "2026-03-09", status: "completed" as const },
  { id: "PAY-009", customer: "太陽コーポレーション", amount: 280000, method: "銀行振込", date: "2026-03-08", status: "refunded" as const },
  { id: "PAY-010", customer: "ハーモニー株式会社", amount: 150000, method: "クレジットカード", date: "2026-03-07", status: "completed" as const },
  { id: "PAY-011", customer: "クロスブリッジ", amount: 200000, method: "クレジットカード", date: "2026-03-06", status: "completed" as const },
  { id: "PAY-012", customer: "プライムデータ", amount: 320000, method: "銀行振込", date: "2026-03-05", status: "completed" as const },
  { id: "PAY-013", customer: "ネクサス株式会社", amount: 480000, method: "クレジットカード", date: "2026-03-04", status: "completed" as const },
  { id: "PAY-014", customer: "ピクセルラボ", amount: 95000, method: "クレジットカード", date: "2026-03-03", status: "failed" as const },
  { id: "PAY-015", customer: "テクノフューチャー株式会社", amount: 550000, method: "銀行振込", date: "2026-03-02", status: "completed" as const },
  { id: "PAY-016", customer: "デジタルブリッジ", amount: 175000, method: "クレジットカード", date: "2026-03-01", status: "completed" as const },
];

const monthlyRevenue = [
  { month: "2025/10", amount: 3200000 },
  { month: "2025/11", amount: 3450000 },
  { month: "2025/12", amount: 3800000 },
  { month: "2026/01", amount: 3600000 },
  { month: "2026/02", amount: 3950000 },
  { month: "2026/03", amount: 4390000 },
];

const statusConfig = {
  completed: { label: "完了", variant: "success" as const },
  pending: { label: "処理中", variant: "warning" as const },
  failed: { label: "失敗", variant: "danger" as const },
  refunded: { label: "返金済み", variant: "purple" as const },
};

export default function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = payments.filter((p) => {
    const matchSearch = p.customer.includes(search) || p.id.includes(search);
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalRevenue = payments.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.amount, 0);
  const refundedAmount = payments.filter((p) => p.status === "refunded").reduce((sum, p) => sum + p.amount, 0);

  const maxRevenue = Math.max(...monthlyRevenue.map((r) => r.amount));

  return (
    <div className="space-y-6">
      <PageHeader
        title="支払い"
        description="支払い履歴と売上管理"
        breadcrumbs={[
          { label: "ホーム", href: "/" },
          { label: "コマース", href: "/commerce" },
          { label: "支払い" },
        ]}
        actions={
          <Button variant="outline" size="sm" onClick={() => alert("エクスポート機能は準備中です")}>
            <Download className="h-4 w-4 mr-1" />
            エクスポート
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatsCard label="今月の売上" value={`¥${(totalRevenue / 10000).toLocaleString()}万`} change={12} changeLabel="前月比" icon={DollarSign} />
        <StatsCard label="支払い件数" value={payments.length} change={8} changeLabel="前月比" icon={CreditCard} />
        <StatsCard label="平均決済額" value={`¥${Math.round(totalRevenue / payments.filter(p => p.status === "completed").length).toLocaleString()}`} icon={TrendingUp} />
        <StatsCard label="返金額" value={`¥${refundedAmount.toLocaleString()}`} icon={RefreshCw} />
      </div>

      {/* Monthly Revenue Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#ff4800]" />
            <CardTitle>月次売上推移</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3 h-48">
            {monthlyRevenue.map((rev) => (
              <div key={rev.month} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-medium text-gray-600">
                  ¥{(rev.amount / 10000).toFixed(0)}万
                </span>
                <div
                  className="w-full rounded-t-md bg-[#ff4800] transition-all hover:bg-[#c93700]"
                  style={{ height: `${(rev.amount / maxRevenue) * 160}px` }}
                />
                <span className="text-xs text-gray-500">{rev.month}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment History Table */}
      <Card>
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-72">
              <Input
                variant="search"
                placeholder="顧客名、支払いIDで検索..."
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
              <option value="completed">完了</option>
              <option value="pending">処理中</option>
              <option value="failed">失敗</option>
              <option value="refunded">返金済み</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-medium text-gray-500">日付</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">支払いID</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">顧客</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">金額</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">決済方法</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">ステータス</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-600">{payment.date}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{payment.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{payment.customer}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">¥{payment.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-600">{payment.method}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusConfig[payment.status].variant}>
                      {statusConfig[payment.status].label}
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
          <p className="text-sm text-gray-500">{filtered.length}件の支払いを表示</p>
        </div>
      </Card>
    </div>
  );
}
