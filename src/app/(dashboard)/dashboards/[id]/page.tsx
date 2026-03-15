"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  Loader2,
  AlertCircle,
  LayoutDashboard,
  BarChart3,
  Hash,
  Table2,
  Filter as FilterIcon,
  Eye,
  Clock,
  Star,
} from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

type WidgetType = "chart" | "number" | "table" | "funnel";

const widgetTypeConfig: Record<WidgetType, { icon: typeof BarChart3; label: string; color: string; bg: string }> = {
  chart: { icon: BarChart3, label: "チャート", color: "text-blue-600", bg: "bg-blue-50" },
  number: { icon: Hash, label: "数値", color: "text-green-600", bg: "bg-green-50" },
  table: { icon: Table2, label: "テーブル", color: "text-purple-600", bg: "bg-purple-50" },
  funnel: { icon: FilterIcon, label: "ファネル", color: "text-orange-600", bg: "bg-orange-50" },
};

const dashboards = [
  {
    id: "db1", name: "営業パフォーマンス", description: "営業チーム全体のKPIとパフォーマンス指標",
    widgets: [
      { id: "w1", name: "月間売上", type: "number" as WidgetType, value: "¥12.4M" },
      { id: "w2", name: "成約率推移", type: "chart" as WidgetType },
      { id: "w3", name: "パイプライン金額", type: "number" as WidgetType, value: "¥68.5M" },
      { id: "w4", name: "セールスファネル", type: "funnel" as WidgetType },
      { id: "w5", name: "取引一覧", type: "table" as WidgetType },
      { id: "w6", name: "月次売上推移", type: "chart" as WidgetType },
    ],
    lastViewed: "2026-03-14", createdBy: "佐藤 匠", shared: true, favorite: true,
  },
  {
    id: "db2", name: "マーケティング分析", description: "マーケティング施策の効果測定ダッシュボード",
    widgets: [
      { id: "w7", name: "リード獲得数", type: "number" as WidgetType, value: "186" },
      { id: "w8", name: "チャネル別リード", type: "chart" as WidgetType },
      { id: "w9", name: "メール開封率", type: "number" as WidgetType, value: "28.5%" },
      { id: "w10", name: "フォームCVR", type: "chart" as WidgetType },
    ],
    lastViewed: "2026-03-13", createdBy: "田村 愛", shared: true, favorite: false,
  },
  {
    id: "db3", name: "カスタマーサービス", description: "サポートチームの対応状況とCSAT",
    widgets: [
      { id: "w11", name: "未解決チケット", type: "number" as WidgetType, value: "28" },
      { id: "w12", name: "CSAT スコア", type: "number" as WidgetType, value: "92.3%" },
      { id: "w13", name: "解決時間推移", type: "chart" as WidgetType },
      { id: "w14", name: "チケット一覧", type: "table" as WidgetType },
      { id: "w15", name: "SLA達成率", type: "chart" as WidgetType },
    ],
    lastViewed: "2026-03-12", createdBy: "佐藤 匠", shared: false, favorite: true,
  },
  {
    id: "db4", name: "収益予測", description: "四半期ごとの収益予測と実績比較",
    widgets: [
      { id: "w16", name: "Q1 予測", type: "number" as WidgetType, value: "¥38.2M" },
      { id: "w17", name: "予測 vs 実績", type: "chart" as WidgetType },
      { id: "w18", name: "チーム別予測", type: "table" as WidgetType },
      { id: "w19", name: "パイプラインファネル", type: "funnel" as WidgetType },
    ],
    lastViewed: "2026-03-11", createdBy: "佐藤 匠", shared: true, favorite: false,
  },
  {
    id: "db5", name: "チーム活動状況", description: "営業チームのアクティビティ追跡",
    widgets: [
      { id: "w20", name: "今日のコール数", type: "number" as WidgetType, value: "42" },
      { id: "w21", name: "週間アクティビティ", type: "chart" as WidgetType },
      { id: "w22", name: "タスク完了率", type: "number" as WidgetType, value: "79.5%" },
    ],
    lastViewed: "2026-03-10", createdBy: "田村 愛", shared: false, favorite: false,
  },
];

export default function DashboardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const item = dashboards.find((d) => d.id === params.id);
      if (item) {
        setData(item);
      } else {
        setError("ダッシュボードが見つかりません");
      }
    } catch {
      setError("データの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          戻る
        </Button>
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-600 font-medium mb-2">エラー</p>
            <p className="text-sm text-gray-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-700">ホーム</Link>
        <span>/</span>
        <Link href="/dashboards" className="hover:text-gray-700">ダッシュボード</Link>
        <span>/</span>
        <span className="text-gray-900">{data.name}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            戻る
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{data.name}</h1>
              {data.favorite && <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />}
            </div>
            <p className="text-sm text-gray-500 mt-1">{data.description}</p>
          </div>
        </div>
        {data.shared && <Badge variant="info">共有</Badge>}
      </div>

      {/* Meta */}
      <div className="flex items-center gap-6 text-sm text-gray-500">
        <span className="flex items-center gap-1"><LayoutDashboard className="h-4 w-4" />{data.widgets.length} ウィジェット</span>
        <span className="flex items-center gap-1"><Eye className="h-4 w-4" />最終閲覧: {data.lastViewed}</span>
        <span className="flex items-center gap-1"><Clock className="h-4 w-4" />作成者: {data.createdBy}</span>
      </div>

      {/* Widgets Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <LayoutDashboard className="h-5 w-5 text-[#ff4800]" />
            ウィジェット一覧
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.widgets.map((widget: any) => {
              const wConfig = widgetTypeConfig[widget.type as WidgetType];
              const WIcon = wConfig.icon;
              return (
                <div key={widget.id} className={`rounded-lg border border-gray-100 p-4 ${wConfig.bg}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <WIcon className={`h-5 w-5 ${wConfig.color}`} />
                    <span className="text-xs font-medium text-gray-500">{wConfig.label}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{widget.name}</p>
                  {widget.value && (
                    <p className="text-xl font-bold text-gray-900 mt-1">{widget.value}</p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
