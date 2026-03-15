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
  Megaphone,
  DollarSign,
  MousePointerClick,
  TrendingUp,
  BarChart3,
} from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

const campaigns = [
  { id: "ad1", name: "CRM プロダクト認知キャンペーン", platform: "Google Ads", status: "有効", budget: 500000, spent: 342000, clicks: 4560, impressions: 125000, conversions: 89, roi: 245, cpc: 75 },
  { id: "ad2", name: "リード獲得キャンペーン - IT業界", platform: "LinkedIn Ads", status: "有効", budget: 300000, spent: 218000, clicks: 1890, impressions: 45000, conversions: 56, roi: 312, cpc: 115 },
  { id: "ad3", name: "リターゲティング - サイト訪問者", platform: "Facebook Ads", status: "有効", budget: 200000, spent: 167000, clicks: 3200, impressions: 89000, conversions: 42, roi: 198, cpc: 52 },
  { id: "ad4", name: "ウェビナー集客キャンペーン", platform: "Google Ads", status: "完了", budget: 150000, spent: 148000, clicks: 2100, impressions: 67000, conversions: 34, roi: 178, cpc: 70 },
  { id: "ad5", name: "ブランド認知 - Instagram", platform: "Instagram Ads", status: "有効", budget: 180000, spent: 95000, clicks: 2800, impressions: 156000, conversions: 28, roi: 156, cpc: 34 },
  { id: "ad6", name: "導入事例プロモーション", platform: "LinkedIn Ads", status: "停止中", budget: 250000, spent: 123000, clicks: 1100, impressions: 32000, conversions: 18, roi: 134, cpc: 112 },
];

const platformColors: Record<string, { color: string; bg: string }> = {
  "Google Ads": { color: "text-blue-600", bg: "bg-blue-50" },
  "Facebook Ads": { color: "text-blue-700", bg: "bg-blue-50" },
  "LinkedIn Ads": { color: "text-sky-700", bg: "bg-sky-50" },
  "Instagram Ads": { color: "text-pink-600", bg: "bg-pink-50" },
};

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case "有効": return "success" as const;
    case "停止中": return "default" as const;
    case "完了": return "info" as const;
    default: return "default" as const;
  }
};

export default function AdDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const item = campaigns.find((c) => c.id === params.id);
      if (item) {
        setData(item);
      } else {
        setError("キャンペーンが見つかりません");
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

  const pConfig = platformColors[data.platform] || { color: "text-gray-600", bg: "bg-gray-50" };
  const spentPercent = Math.round((data.spent / data.budget) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-700">ホーム</Link>
        <span>/</span>
        <Link href="/ads" className="hover:text-gray-700">広告</Link>
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
            <h1 className="text-2xl font-bold text-gray-900">{data.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-medium ${pConfig.color} ${pConfig.bg} rounded px-2 py-1`}>{data.platform}</span>
              <Badge variant={statusBadgeVariant(data.status)}>{data.status}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card><CardContent className="p-4 text-center"><DollarSign className="h-5 w-5 text-blue-600 mx-auto mb-2" /><p className="text-xl font-bold text-gray-900">¥{data.budget.toLocaleString()}</p><p className="text-xs text-gray-500">予算</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><DollarSign className="h-5 w-5 text-orange-600 mx-auto mb-2" /><p className="text-xl font-bold text-gray-900">¥{data.spent.toLocaleString()}</p><p className="text-xs text-gray-500">消化額</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><MousePointerClick className="h-5 w-5 text-green-600 mx-auto mb-2" /><p className="text-xl font-bold text-gray-900">{data.clicks.toLocaleString()}</p><p className="text-xs text-gray-500">クリック</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><TrendingUp className="h-5 w-5 text-purple-600 mx-auto mb-2" /><p className="text-xl font-bold text-gray-900">{data.conversions}</p><p className="text-xs text-gray-500">コンバージョン</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Megaphone className="h-5 w-5 text-[#ff4800]" />
              キャンペーン情報
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">キャンペーン名</span>
              <span className="text-sm font-medium text-gray-900">{data.name}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">プラットフォーム</span>
              <span className={`text-xs font-medium ${pConfig.color} ${pConfig.bg} rounded px-2 py-1`}>{data.platform}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">予算消化率</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 rounded-full bg-gray-100">
                  <div className={`h-2 rounded-full ${spentPercent > 90 ? "bg-red-400" : spentPercent > 70 ? "bg-yellow-400" : "bg-green-400"}`} style={{ width: `${Math.min(spentPercent, 100)}%` }} />
                </div>
                <span className="text-sm font-medium text-gray-900">{spentPercent}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">CPC</span>
              <span className="text-sm font-medium text-gray-900">¥{data.cpc.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-gray-500">インプレッション</span>
              <span className="text-sm font-medium text-gray-900">{data.impressions.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-5 w-5 text-[#ff4800]" />
              ROI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative flex h-32 w-32 items-center justify-center">
                <svg className="h-32 w-32 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke={data.roi >= 200 ? "#22c55e" : data.roi >= 150 ? "#eab308" : "#ef4444"} strokeWidth="8" strokeDasharray={`${Math.min(data.roi / 4, 251)} 251`} strokeLinecap="round" />
                </svg>
                <div className="absolute text-center">
                  <p className={`text-3xl font-bold ${data.roi >= 200 ? "text-green-600" : data.roi >= 150 ? "text-yellow-600" : "text-gray-900"}`}>{data.roi}%</p>
                  <p className="text-xs text-gray-500">ROI</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
