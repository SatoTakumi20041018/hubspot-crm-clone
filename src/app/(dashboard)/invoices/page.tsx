"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatsCard } from "@/components/ui/stats-card";
import {
  FileText,
  Plus,
  Download,
  AlertTriangle,
  DollarSign,
  Clock,
  CheckCircle,
  MoreHorizontal,
  Send,
  Eye,
} from "lucide-react";

const invoices = [
  { id: "INV-2401", customer: "さくらデザイン", email: "nakamura@sakura-design.jp", amount: 120000, status: "overdue" as const, issueDate: "2026-02-01", dueDate: "2026-03-01", paidDate: null },
  { id: "INV-2402", customer: "フューチャーテック", email: "kobayashi@future-tech.co.jp", amount: 350000, status: "sent" as const, issueDate: "2026-03-01", dueDate: "2026-03-20", paidDate: null },
  { id: "INV-2403", customer: "太陽コーポレーション", email: "matsumoto@taiyo-corp.jp", amount: 280000, status: "paid" as const, issueDate: "2026-02-15", dueDate: "2026-03-15", paidDate: "2026-03-10" },
  { id: "INV-2404", customer: "ハーモニー株式会社", email: "inoue@harmony-inc.jp", amount: 150000, status: "draft" as const, issueDate: "2026-03-14", dueDate: "2026-03-25", paidDate: null },
  { id: "INV-2405", customer: "サンライズメディア", email: "kato@sunrise-media.jp", amount: 190000, status: "sent" as const, issueDate: "2026-03-05", dueDate: "2026-03-22", paidDate: null },
  { id: "INV-2406", customer: "田中商事株式会社", email: "tanaka@tanaka-corp.jp", amount: 450000, status: "paid" as const, issueDate: "2026-02-01", dueDate: "2026-03-01", paidDate: "2026-02-28" },
  { id: "INV-2407", customer: "鈴木テクノロジー", email: "suzuki@suzuki-tech.co.jp", amount: 280000, status: "paid" as const, issueDate: "2026-02-15", dueDate: "2026-03-15", paidDate: "2026-03-12" },
  { id: "INV-2408", customer: "クロスブリッジ", email: "kimura@cross-bridge.jp", amount: 200000, status: "overdue" as const, issueDate: "2026-01-20", dueDate: "2026-02-20", paidDate: null },
  { id: "INV-2409", customer: "グローバルシステム", email: "watanabe@global-sys.jp", amount: 350000, status: "sent" as const, issueDate: "2026-03-10", dueDate: "2026-03-28", paidDate: null },
  { id: "INV-2410", customer: "イノベーション株式会社", email: "ito@innovation.jp", amount: 180000, status: "draft" as const, issueDate: "2026-03-14", dueDate: "2026-04-01", paidDate: null },
  { id: "INV-2411", customer: "プライムデータ", email: "hayashi@prime-data.jp", amount: 320000, status: "paid" as const, issueDate: "2026-02-10", dueDate: "2026-03-10", paidDate: "2026-03-08" },
];

const statusConfig = {
  draft: { label: "下書き", variant: "default" as const },
  sent: { label: "送信済み", variant: "info" as const },
  paid: { label: "支払済み", variant: "success" as const },
  overdue: { label: "期限超過", variant: "danger" as const },
};

export default function InvoicesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = invoices.filter((inv) => {
    const matchSearch = inv.customer.includes(search) || inv.id.includes(search);
    const matchStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalOutstanding = invoices
    .filter((inv) => inv.status === "sent" || inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const overdueCount = invoices.filter((inv) => inv.status === "overdue").length;
  const paidThisMonth = invoices
    .filter((inv) => inv.status === "paid" && inv.paidDate && inv.paidDate >= "2026-03-01")
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="請求書"
        description="請求書の作成・管理・追跡"
        breadcrumbs={[
          { label: "ホーム", href: "/" },
          { label: "コマース", href: "/commerce" },
          { label: "請求書" },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => alert("エクスポート機能は準備中です")}>
              <Download className="h-4 w-4 mr-1" />
              エクスポート
            </Button>
            <Button size="sm" onClick={() => alert("請求書作成は準備中です")}>
              <Plus className="h-4 w-4 mr-1" />
              請求書作成
            </Button>
          </div>
        }
      />

      {/* KPI */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatsCard label="未払い合計" value={`¥${totalOutstanding.toLocaleString()}`} icon={DollarSign} />
        <StatsCard label="期限超過" value={`${overdueCount}件`} icon={AlertTriangle} />
        <StatsCard label="今月回収額" value={`¥${paidThisMonth.toLocaleString()}`} change={15} changeLabel="前月比" icon={CheckCircle} />
        <StatsCard label="請求書総数" value={invoices.length} icon={FileText} />
      </div>

      {/* Overdue Alerts */}
      {overdueCount > 0 && (
        <Card className="border-[#d9002b]/20 bg-red-50">
          <div className="flex items-center gap-3 p-4">
            <AlertTriangle className="h-5 w-5 text-[#d9002b]" />
            <div>
              <p className="text-sm font-semibold text-[#d9002b]">
                {overdueCount}件の請求書が期限を超過しています
              </p>
              <p className="text-xs text-[#d9002b]/70">
                合計: ¥{invoices.filter(i => i.status === "overdue").reduce((s, i) => s + i.amount, 0).toLocaleString()}
              </p>
            </div>
            <Button variant="outline" size="sm" className="ml-auto border-[#d9002b]/30 text-[#d9002b] hover:bg-red-100">
              リマインダー送信
            </Button>
          </div>
        </Card>
      )}

      {/* Invoice Table */}
      <Card>
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-72">
              <Input
                variant="search"
                placeholder="請求書番号、顧客名で検索..."
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
              <option value="draft">下書き</option>
              <option value="sent">送信済み</option>
              <option value="paid">支払済み</option>
              <option value="overdue">期限超過</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-medium text-gray-500">請求書番号</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">顧客</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">金額</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">ステータス</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">発行日</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">期日</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">支払日</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-medium text-[#ff4800]">{invoice.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{invoice.customer}</p>
                    <p className="text-xs text-gray-500">{invoice.email}</p>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">¥{invoice.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusConfig[invoice.status].variant}>
                      {statusConfig[invoice.status].label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{invoice.issueDate}</td>
                  <td className="px-4 py-3 text-gray-600">{invoice.dueDate}</td>
                  <td className="px-4 py-3 text-gray-600">{invoice.paidDate || "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="rounded p-1 text-gray-400 hover:bg-gray-100" title="プレビュー">
                        <Eye className="h-4 w-4" />
                      </button>
                      {invoice.status === "draft" && (
                        <button className="rounded p-1 text-gray-400 hover:bg-gray-100" title="送信">
                          <Send className="h-4 w-4" />
                        </button>
                      )}
                      <button className="rounded p-1 text-gray-400 hover:bg-gray-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-gray-200 px-4 py-3">
          <p className="text-sm text-gray-500">{filtered.length}件の請求書を表示</p>
        </div>
      </Card>
    </div>
  );
}
