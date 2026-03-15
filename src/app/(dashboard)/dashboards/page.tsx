"use client";

import { useState } from "react";
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
  const [filter, setFilter] = useState<"all" | "favorites" | "shared">("all");

  const filtered = dashboards.filter((db) => {
    if (filter === "favorites") return db.favorite;
    if (filter === "shared") return db.shared;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="ダッシュボード"
        description="カスタムダッシュボードでデータを可視化"
        actions={
          <Button size="sm" onClick={() => alert("ダッシュボード作成は準備中です")}>
            <Plus className="h-4 w-4 mr-1" />
            ダッシュボード作成
          </Button>
        }
      />

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
                ? "border-[#FF7A59] text-[#FF7A59]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            <span className={`rounded-full px-1.5 py-0.5 text-xs ${
              filter === tab.key ? "bg-[#FF7A59]/10 text-[#FF7A59]" : "bg-gray-100 text-gray-500"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filtered.map((dashboard) => (
          <Card key={dashboard.id} className="hover:border-gray-300 transition-all">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFF1ED]">
                    <LayoutDashboard className="h-5 w-5 text-[#FF7A59]" />
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
    </div>
  );
}
