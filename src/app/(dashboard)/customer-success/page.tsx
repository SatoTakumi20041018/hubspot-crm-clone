"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatsCard } from "@/components/ui/stats-card";
import {
  Heart,
  AlertTriangle,
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  Activity,
  Shield,
  ChevronRight,
  MoreHorizontal,
  Calendar,
  ArrowUpDown,
} from "lucide-react";

const customers = [
  { id: 1, name: "田中商事株式会社", health: "green" as const, healthScore: 92, mrr: 450000, lastActivity: "2026-03-14", renewalDate: "2026-09-15", csm: "佐藤 匠", plan: "Enterprise", tickets: 1, deals: 2 },
  { id: 2, name: "鈴木テクノロジー", health: "green" as const, healthScore: 88, mrr: 280000, lastActivity: "2026-03-13", renewalDate: "2026-07-01", csm: "佐藤 匠", plan: "Professional", tickets: 0, deals: 1 },
  { id: 3, name: "グローバルシステム", health: "green" as const, healthScore: 85, mrr: 350000, lastActivity: "2026-03-12", renewalDate: "2026-11-30", csm: "田村 愛", plan: "Enterprise", tickets: 2, deals: 0 },
  { id: 4, name: "イノベーション株式会社", health: "yellow" as const, healthScore: 65, mrr: 180000, lastActivity: "2026-03-08", renewalDate: "2026-05-15", csm: "佐藤 匠", plan: "Professional", tickets: 5, deals: 0 },
  { id: 5, name: "東京マーケティング", health: "yellow" as const, healthScore: 58, mrr: 220000, lastActivity: "2026-03-05", renewalDate: "2026-06-01", csm: "田村 愛", plan: "Professional", tickets: 3, deals: 1 },
  { id: 6, name: "さくらデザイン", health: "red" as const, healthScore: 32, mrr: 120000, lastActivity: "2026-02-20", renewalDate: "2026-04-15", csm: "佐藤 匠", plan: "Starter", tickets: 8, deals: 0 },
  { id: 7, name: "フューチャーテック", health: "red" as const, healthScore: 28, mrr: 350000, lastActivity: "2026-02-15", renewalDate: "2026-04-01", csm: "田村 愛", plan: "Enterprise", tickets: 12, deals: 0 },
  { id: 8, name: "サンライズメディア", health: "green" as const, healthScore: 90, mrr: 190000, lastActivity: "2026-03-14", renewalDate: "2026-08-20", csm: "佐藤 匠", plan: "Professional", tickets: 0, deals: 1 },
  { id: 9, name: "太陽コーポレーション", health: "yellow" as const, healthScore: 55, mrr: 280000, lastActivity: "2026-03-03", renewalDate: "2026-05-30", csm: "田村 愛", plan: "Enterprise", tickets: 4, deals: 0 },
  { id: 10, name: "ハーモニー株式会社", health: "green" as const, healthScore: 82, mrr: 150000, lastActivity: "2026-03-11", renewalDate: "2026-10-01", csm: "佐藤 匠", plan: "Professional", tickets: 1, deals: 2 },
  { id: 11, name: "クロスブリッジ", health: "yellow" as const, healthScore: 60, mrr: 200000, lastActivity: "2026-03-06", renewalDate: "2026-06-15", csm: "田村 愛", plan: "Professional", tickets: 3, deals: 0 },
];

const activities = [
  { id: 1, customer: "田中商事株式会社", action: "サポートチケット #1234 を解決", time: "30分前", type: "ticket" },
  { id: 2, customer: "フューチャーテック", action: "エスカレーションチケット #1230 を作成", time: "2時間前", type: "alert" },
  { id: 3, customer: "鈴木テクノロジー", action: "四半期レビューミーティングを完了", time: "3時間前", type: "meeting" },
  { id: 4, customer: "さくらデザイン", action: "契約更新の打診メールを送信", time: "5時間前", type: "email" },
  { id: 5, customer: "イノベーション株式会社", action: "NPS回答: 6 (Detractor)", time: "1日前", type: "alert" },
  { id: 6, customer: "東京マーケティング", action: "オンボーディング完了", time: "1日前", type: "success" },
];

const riskAlerts = [
  { customer: "フューチャーテック", reason: "チケット数が3倍に急増。更新期限まで18日。", severity: "critical" as const, mrr: 350000 },
  { customer: "さくらデザイン", reason: "30日間ログインなし。更新期限まで32日。", severity: "critical" as const, mrr: 120000 },
  { customer: "太陽コーポレーション", reason: "利用率が前月比40%低下。主要機能の使用停止。", severity: "high" as const, mrr: 280000 },
  { customer: "イノベーション株式会社", reason: "NPS回答でDetector判定。サポート満足度低下。", severity: "medium" as const, mrr: 180000 },
];

export default function CustomerSuccessPage() {
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]);
  const [search, setSearch] = useState("");
  const [healthFilter, setHealthFilter] = useState("all");

  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const filteredBase = customers.filter((c) => {
    const matchSearch = c.name.includes(search);
    const matchHealth = healthFilter === "all" || c.health === healthFilter;
    return matchSearch && matchHealth;
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

  const healthCounts = {
    green: customers.filter((c) => c.health === "green").length,
    yellow: customers.filter((c) => c.health === "yellow").length,
    red: customers.filter((c) => c.health === "red").length,
  };

  const totalMRR = customers.reduce((sum, c) => sum + c.mrr, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="カスタマーサクセスワークスペース"
        description="顧客の健全性を監視し、プロアクティブにリテンションを強化"
        breadcrumbs={[
          { label: "ホーム", href: "/" },
          { label: "カスタマーサクセス" },
        ]}
      />

      {/* Health Score Dashboard */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatsCard label="総MRR" value={`¥${(totalMRR / 10000).toLocaleString()}万`} change={8} changeLabel="前月比" icon={DollarSign} />
        <StatsCard label="顧客数" value={customers.length} change={3} changeLabel="前月比" icon={Users} />
        <StatsCard label="平均ヘルススコア" value="68" change={-5} changeLabel="前月比" icon={Heart} />
        <StatsCard label="更新予定（90日以内）" value="5" icon={Calendar} />
      </div>

      {/* Health Score Gauge */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md" onClick={() => setHealthFilter("green")}>
          <div className="flex items-center gap-4 p-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#b9cdbe]">
              <Shield className="h-7 w-7 text-[#00823a]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#00823a]">{healthCounts.green}</p>
              <p className="text-sm text-gray-500">健全</p>
            </div>
          </div>
        </Card>
        <Card className="cursor-pointer hover:shadow-md" onClick={() => setHealthFilter("yellow")}>
          <div className="flex items-center gap-4 p-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ece6d9]">
              <AlertTriangle className="h-7 w-7 text-[#8a6d00]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#8a6d00]">{healthCounts.yellow}</p>
              <p className="text-sm text-gray-500">注意</p>
            </div>
          </div>
        </Card>
        <Card className="cursor-pointer hover:shadow-md" onClick={() => setHealthFilter("red")}>
          <div className="flex items-center gap-4 p-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fcc6b1]">
              <AlertTriangle className="h-7 w-7 text-[#d9002b]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#d9002b]">{healthCounts.red}</p>
              <p className="text-sm text-gray-500">危険</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex gap-4">
        {/* Customer List */}
        <div className="flex-1">
          <Card>
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-64">
                  <Input
                    variant="search"
                    placeholder="顧客名で検索..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  />
                </div>
                <select
                  className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm"
                  value={healthFilter}
                  onChange={(e) => { setHealthFilter(e.target.value); setCurrentPage(1); }}
                >
                  <option value="all">すべてのステータス</option>
                  <option value="green">健全</option>
                  <option value="yellow">注意</option>
                  <option value="red">危険</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("name")}><div className="flex items-center gap-1">顧客名 <ArrowUpDown className="h-3 w-3" /></div></th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("healthScore")}><div className="flex items-center gap-1">ヘルス <ArrowUpDown className="h-3 w-3" /></div></th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("mrr")}><div className="flex items-center gap-1">MRR <ArrowUpDown className="h-3 w-3" /></div></th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">最終活動</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">更新日</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">CSM</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map((customer) => (
                    <tr
                      key={customer.id}
                      className={`border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedCustomer.id === customer.id ? "bg-orange-50" : ""
                      }`}
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">{customer.name}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`h-3 w-3 rounded-full ${
                            customer.health === "green" ? "bg-[#00823a]" :
                            customer.health === "yellow" ? "bg-[#8a6d00]" : "bg-[#d9002b]"
                          }`} />
                          <span className="text-gray-700">{customer.healthScore}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">¥{customer.mrr.toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-600">{customer.lastActivity}</td>
                      <td className="px-4 py-3 text-gray-600">{customer.renewalDate}</td>
                      <td className="px-4 py-3 text-gray-600">{customer.csm}</td>
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

        {/* Right Sidebar */}
        <div className="w-80 shrink-0 space-y-4">
          {/* Customer Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{selectedCustomer.name}</CardTitle>
              <Badge variant={selectedCustomer.plan === "Enterprise" ? "purple" : selectedCustomer.plan === "Professional" ? "info" : "default"}>
                {selectedCustomer.plan}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">ヘルススコア</span>
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${
                    selectedCustomer.health === "green" ? "bg-[#00823a]" :
                    selectedCustomer.health === "yellow" ? "bg-[#8a6d00]" : "bg-[#d9002b]"
                  }`} />
                  <span className="font-semibold">{selectedCustomer.healthScore}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">MRR</span>
                <span className="font-semibold">¥{selectedCustomer.mrr.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">オープンチケット</span>
                <span className="font-semibold">{selectedCustomer.tickets}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">進行中の取引</span>
                <span className="font-semibold">{selectedCustomer.deals}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">更新日</span>
                <span className="font-semibold">{selectedCustomer.renewalDate}</span>
              </div>
            </CardContent>
          </Card>

          {/* Risk Alerts */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-[#d9002b]" />
                <CardTitle className="text-base">チャーンリスク</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {riskAlerts.map((alert, i) => (
                <div key={i} className="rounded-lg border border-gray-100 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{alert.customer}</p>
                    <Badge variant={alert.severity === "critical" ? "danger" : alert.severity === "high" ? "warning" : "default"}>
                      {alert.severity === "critical" ? "緊急" : alert.severity === "high" ? "高" : "中"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{alert.reason}</p>
                  <p className="mt-1 text-xs font-medium text-gray-700">MRR: ¥{alert.mrr.toLocaleString()}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-[#ff4800]" />
                <CardTitle className="text-base">最近のアクティビティ</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-2">
                    <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                      activity.type === "alert" ? "bg-[#d9002b]" :
                      activity.type === "success" ? "bg-[#00823a]" : "bg-gray-400"
                    }`} />
                    <div>
                      <p className="text-xs font-medium text-gray-900">{activity.customer}</p>
                      <p className="text-xs text-gray-500">{activity.action}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
