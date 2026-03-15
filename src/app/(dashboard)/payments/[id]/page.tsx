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
  CreditCard,
  Calendar,
  DollarSign,
  User,
  Wallet,
} from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

const statusConfig: Record<string, { label: string; variant: "success" | "warning" | "danger" | "purple" | "default" }> = {
  completed: { label: "完了", variant: "success" },
  pending: { label: "処理中", variant: "warning" },
  failed: { label: "失敗", variant: "danger" },
  refunded: { label: "返金済み", variant: "purple" },
};

const payments = [
  { id: "PAY-001", customer: "田中商事株式会社", amount: 450000, method: "クレジットカード", date: "2026-03-14", status: "completed" },
  { id: "PAY-002", customer: "鈴木テクノロジー", amount: 280000, method: "銀行振込", date: "2026-03-14", status: "completed" },
  { id: "PAY-003", customer: "グローバルシステム", amount: 350000, method: "クレジットカード", date: "2026-03-13", status: "completed" },
  { id: "PAY-004", customer: "イノベーション株式会社", amount: 180000, method: "クレジットカード", date: "2026-03-13", status: "pending" },
  { id: "PAY-005", customer: "東京マーケティング", amount: 220000, method: "銀行振込", date: "2026-03-12", status: "completed" },
  { id: "PAY-006", customer: "さくらデザイン", amount: 120000, method: "クレジットカード", date: "2026-03-11", status: "completed" },
  { id: "PAY-007", customer: "フューチャーテック", amount: 350000, method: "銀行振込", date: "2026-03-10", status: "completed" },
  { id: "PAY-008", customer: "サンライズメディア", amount: 190000, method: "クレジットカード", date: "2026-03-09", status: "completed" },
  { id: "PAY-009", customer: "太陽コーポレーション", amount: 280000, method: "銀行振込", date: "2026-03-08", status: "refunded" },
  { id: "PAY-010", customer: "ハーモニー株式会社", amount: 150000, method: "クレジットカード", date: "2026-03-07", status: "completed" },
  { id: "PAY-011", customer: "クロスブリッジ", amount: 200000, method: "クレジットカード", date: "2026-03-06", status: "completed" },
  { id: "PAY-012", customer: "プライムデータ", amount: 320000, method: "銀行振込", date: "2026-03-05", status: "completed" },
  { id: "PAY-013", customer: "ネクサス株式会社", amount: 480000, method: "クレジットカード", date: "2026-03-04", status: "completed" },
  { id: "PAY-014", customer: "ピクセルラボ", amount: 95000, method: "クレジットカード", date: "2026-03-03", status: "failed" },
  { id: "PAY-015", customer: "テクノフューチャー株式会社", amount: 550000, method: "銀行振込", date: "2026-03-02", status: "completed" },
  { id: "PAY-016", customer: "デジタルブリッジ", amount: 175000, method: "クレジットカード", date: "2026-03-01", status: "completed" },
];

export default function PaymentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const item = payments.find((p) => p.id === params.id);
      if (item) {
        setData(item);
      } else {
        setError("支払いが見つかりません");
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
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-700">ホーム</Link>
        <span>/</span>
        <Link href="/payments" className="hover:text-gray-700">支払い</Link>
        <span>/</span>
        <span className="text-gray-900">{data.id}</span>
      </div>

      {/* Back + Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            戻る
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">支払い詳細</h1>
            <p className="text-sm text-gray-500">{data.id}</p>
          </div>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      {/* Detail Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="h-5 w-5 text-[#ff4800]" />
              支払い情報
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                日付
              </div>
              <span className="text-sm font-medium text-gray-900">{data.date}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <DollarSign className="h-4 w-4" />
                金額
              </div>
              <span className="text-lg font-bold text-gray-900">¥{data.amount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <User className="h-4 w-4" />
                顧客
              </div>
              <span className="text-sm font-medium text-gray-900">{data.customer}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Wallet className="h-4 w-4" />
                決済方法
              </div>
              <span className="text-sm font-medium text-gray-900">{data.method}</span>
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
              <p className="text-3xl font-bold text-gray-900">¥{data.amount.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">{data.customer}</p>
              <p className="text-xs text-gray-400 mt-1">{data.date} | {data.method}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
