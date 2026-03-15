"use client";

import { useState } from "react";
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

export default function ForecastingPage() {
  const [period, setPeriod] = useState("Q1 2026");

  return (
    <div className="space-y-6">
      <PageHeader
        title="売上予測"
        description="パイプラインに基づく売上予測と目標達成状況"
        actions={
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
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
          <CardTitle>チーム別予測</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left font-medium text-gray-500">担当者</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">クォータ</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">予測</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">成約済み</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">パイプライン</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">案件数</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">達成率</th>
                </tr>
              </thead>
              <tbody>
                {teamForecast.map((person) => (
                  <tr key={person.name} className="border-b border-gray-100 hover:bg-gray-50">
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
