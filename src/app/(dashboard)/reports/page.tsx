"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Users,
  DollarSign,
  CheckSquare,
  ArrowUpRight,
} from "lucide-react";

const dateRanges = [
  "今月",
  "先月",
  "今四半期",
  "前四半期",
  "今年",
  "カスタム",
];

// Deal Revenue by Stage
const dealRevenueByStage = [
  { stage: "初回商談", value: 8000000, color: "bg-blue-400" },
  { stage: "提案中", value: 17700000, color: "bg-cyan-400" },
  { stage: "見積提出", value: 21600000, color: "bg-yellow-400" },
  { stage: "交渉中", value: 8700000, color: "bg-orange-400" },
  { stage: "契約締結", value: 10700000, color: "bg-green-400" },
  { stage: "失注", value: 1800000, color: "bg-red-400" },
];
const maxDealRevenue = Math.max(...dealRevenueByStage.map((d) => d.value));

// Contacts by Lifecycle Stage
const contactsByStage = [
  { stage: "サブスクライバー", count: 245, color: "bg-gray-400" },
  { stage: "リード", count: 412, color: "bg-blue-400" },
  { stage: "MQL", count: 186, color: "bg-purple-400" },
  { stage: "SQL", count: 98, color: "bg-cyan-400" },
  { stage: "商談中", count: 67, color: "bg-orange-400" },
  { stage: "顧客", count: 234, color: "bg-green-400" },
  { stage: "エバンジェリスト", count: 42, color: "bg-yellow-400" },
];
const maxContacts = Math.max(...contactsByStage.map((c) => c.count));

// Activity by Type
const activityByType = [
  { type: "メール", count: 342, color: "bg-blue-400" },
  { type: "通話", count: 128, color: "bg-green-400" },
  { type: "ミーティング", count: 56, color: "bg-purple-400" },
  { type: "メモ", count: 89, color: "bg-gray-400" },
  { type: "タスク", count: 214, color: "bg-orange-400" },
];
const maxActivity = Math.max(...activityByType.map((a) => a.count));

// Monthly Revenue Trend (simple bar chart)
const monthlyRevenue = [
  { month: "10月", value: 4200000 },
  { month: "11月", value: 5800000 },
  { month: "12月", value: 7100000 },
  { month: "1月", value: 6300000 },
  { month: "2月", value: 8900000 },
  { month: "3月", value: 12450000 },
];
const maxMonthlyRevenue = Math.max(...monthlyRevenue.map((m) => m.value));

// Task completion
const taskStats = {
  total: 156,
  completed: 124,
  overdue: 8,
  rate: 79.5,
};

// Top performers
const topPerformers = [
  { name: "佐藤 匠", deals: 18, revenue: 32500000, tasks: 89 },
  { name: "田村 愛", deals: 12, revenue: 18200000, tasks: 67 },
  { name: "山本 健太", deals: 8, revenue: 12400000, tasks: 45 },
];

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);

  const [dateRange, setDateRange] = useState("今月");


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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">レポート</h1>
          <p className="text-sm text-gray-500 mt-1">
            営業・マーケティング分析ダッシュボード
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <select
            className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:border-[#ff4800] focus:outline-none focus:ring-1 focus:ring-[#ff4800]"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            {dateRanges.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">新規コンタクト</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">186</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-xs font-medium text-green-600">
                    +24.3%
                  </span>
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">成約数</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">15</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-xs font-medium text-green-600">
                    +12.5%
                  </span>
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">売上合計</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ¥12.4M
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-xs font-medium text-green-600">
                    +39.8%
                  </span>
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">タスク完了率</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {taskStats.rate}%
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-gray-500">
                    {taskStats.completed}/{taskStats.total}件完了
                  </span>
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                <CheckSquare className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Deal Revenue by Stage */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-gray-400" />
              ステージ別取引金額
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dealRevenueByStage.map((item) => (
                <div key={item.stage} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{item.stage}</span>
                    <span className="text-gray-900 font-medium">
                      ¥{(item.value / 10000).toLocaleString()}万
                    </span>
                  </div>
                  <div className="h-5 w-full rounded bg-gray-100">
                    <div
                      className={`h-5 rounded ${item.color} transition-all flex items-center justify-end pr-2`}
                      style={{
                        width: `${(item.value / maxDealRevenue) * 100}%`,
                      }}
                    >
                      {item.value / maxDealRevenue > 0.15 && (
                        <span className="text-[10px] font-medium text-white">
                          {((item.value / dealRevenueByStage.reduce((s, d) => s + d.value, 0)) * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Revenue Trend */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-gray-400" />
              月次売上推移
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 h-48">
              {monthlyRevenue.map((month) => (
                <div
                  key={month.month}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <span className="text-[10px] text-gray-500">
                    ¥{(month.value / 10000).toLocaleString()}万
                  </span>
                  <div className="w-full flex items-end" style={{ height: "160px" }}>
                    <div
                      className="w-full rounded-t bg-[#ff4800] hover:bg-[#c93700] transition-colors"
                      style={{
                        height: `${(month.value / maxMonthlyRevenue) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{month.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Contacts by Lifecycle */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              ライフサイクル別コンタクト
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {contactsByStage.map((item) => (
                <div key={item.stage} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 text-xs">{item.stage}</span>
                    <span className="text-gray-900 font-medium text-xs">
                      {item.count}
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-gray-100">
                    <div
                      className={`h-3 rounded-full ${item.color}`}
                      style={{
                        width: `${(item.count / maxContacts) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity by Type */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">アクティビティ種別</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {activityByType.map((item) => (
                <div key={item.type} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 text-xs">{item.type}</span>
                    <span className="text-gray-900 font-medium text-xs">
                      {item.count}件
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-gray-100">
                    <div
                      className={`h-3 rounded-full ${item.color}`}
                      style={{
                        width: `${(item.count / maxActivity) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                合計: {activityByType.reduce((s, a) => s + a.count, 0)}件
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Task Completion & Top Performers */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">タスク完了率</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Circular-like progress */}
            <div className="flex items-center justify-center mb-4">
              <div className="relative flex h-28 w-28 items-center justify-center">
                <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#f3f4f6"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#ff4800"
                    strokeWidth="8"
                    strokeDasharray={`${taskStats.rate * 2.51} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {taskStats.rate}%
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-bold text-gray-900">
                  {taskStats.completed}
                </p>
                <p className="text-[10px] text-gray-500">完了</p>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">
                  {taskStats.total - taskStats.completed - taskStats.overdue}
                </p>
                <p className="text-[10px] text-gray-500">進行中</p>
              </div>
              <div>
                <p className="text-lg font-bold text-red-600">
                  {taskStats.overdue}
                </p>
                <p className="text-[10px] text-gray-500">期限超過</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>トップパフォーマー</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  担当者
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">
                  成約件数
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">
                  売上合計
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">
                  完了タスク
                </th>
              </tr>
            </thead>
            <tbody>
              {topPerformers.map((person, i) => (
                <tr
                  key={person.name}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff4800] text-xs font-medium text-white">
                        {person.name.charAt(0)}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {person.name}
                        </span>
                        {i === 0 && (
                          <span className="text-xs text-yellow-600">
                            Top
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {person.deals}件
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    ¥{(person.revenue / 10000).toLocaleString()}万
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {person.tasks}件
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
