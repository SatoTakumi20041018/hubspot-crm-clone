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
  RefreshCw,
  Calendar,
  DollarSign,
  User,
  CreditCard,
} from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

const statusConfig: Record<string, { label: string; variant: "success" | "warning" | "danger" | "default" }> = {
  active: { label: "アクティブ", variant: "success" },
  past_due: { label: "支払い遅延", variant: "danger" },
  canceling: { label: "解約予定", variant: "warning" },
  canceled: { label: "解約済み", variant: "default" },
};

const subscriptions = [
  { id: 1, customer: "田中商事株式会社", plan: "Enterprise", mrr: 450000, startDate: "2025-04-01", nextBilling: "2026-04-01", status: "active", billing: "年額" },
  { id: 2, customer: "鈴木テクノロジー", plan: "Professional", mrr: 280000, startDate: "2025-07-15", nextBilling: "2026-04-15", status: "active", billing: "月額" },
  { id: 3, customer: "グローバルシステム", plan: "Enterprise", mrr: 350000, startDate: "2025-01-01", nextBilling: "2026-04-01", status: "active", billing: "年額" },
  { id: 4, customer: "イノベーション株式会社", plan: "Professional", mrr: 180000, startDate: "2025-09-01", nextBilling: "2026-04-01", status: "active", billing: "月額" },
  { id: 5, customer: "東京マーケティング", plan: "Professional", mrr: 220000, startDate: "2025-06-15", nextBilling: "2026-04-15", status: "active", billing: "月額" },
  { id: 6, customer: "さくらデザイン", plan: "Starter", mrr: 120000, startDate: "2025-11-01", nextBilling: "2026-04-01", status: "past_due", billing: "月額" },
  { id: 7, customer: "フューチャーテック", plan: "Enterprise", mrr: 350000, startDate: "2024-10-01", nextBilling: "2026-04-01", status: "canceling", billing: "年額" },
  { id: 8, customer: "サンライズメディア", plan: "Professional", mrr: 190000, startDate: "2025-08-01", nextBilling: "2026-04-01", status: "active", billing: "月額" },
  { id: 9, customer: "太陽コーポレーション", plan: "Enterprise", mrr: 280000, startDate: "2025-03-01", nextBilling: "2026-04-01", status: "active", billing: "年額" },
];

export default function SubscriptionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const item = subscriptions.find((s) => String(s.id) === params.id);
      if (item) {
        setData(item);
      } else {
        setError("サブスクリプションが見つかりません");
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

  const status = statusConfig[data.status] || { label: data.status, variant: "default" as const };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-700">ホーム</Link>
        <span>/</span>
        <Link href="/subscriptions" className="hover:text-gray-700">サブスクリプション</Link>
        <span>/</span>
        <span className="text-gray-900">{data.customer}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            戻る
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">サブスクリプション詳細</h1>
            <p className="text-sm text-gray-500">{data.customer}</p>
          </div>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <RefreshCw className="h-5 w-5 text-[#ff4800]" />
              サブスクリプション情報
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <User className="h-4 w-4" />
                顧客
              </div>
              <span className="text-sm font-medium text-gray-900">{data.customer}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CreditCard className="h-4 w-4" />
                プラン
              </div>
              <Badge variant={data.plan === "Enterprise" ? "purple" : data.plan === "Professional" ? "info" : "default"}>{data.plan}</Badge>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <DollarSign className="h-4 w-4" />
                MRR
              </div>
              <span className="text-lg font-bold text-gray-900">¥{data.mrr.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                開始日
              </div>
              <span className="text-sm font-medium text-gray-900">{data.startDate}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                次回請求日
              </div>
              <span className="text-sm font-medium text-gray-900">{data.nextBilling}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-gray-500">ステータス</span>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">サマリー</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF1ED] mb-4">
                <DollarSign className="h-8 w-8 text-[#ff4800]" />
              </div>
              <p className="text-3xl font-bold text-gray-900">¥{data.mrr.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">月間定期収益（MRR）</p>
              <p className="text-xs text-gray-400 mt-1">{data.plan} | {data.billing}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
