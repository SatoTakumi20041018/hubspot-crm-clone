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
  MessageSquare,
  TrendingUp,
  Users,
  Calendar,
} from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

const surveys = [
  { id: "s1", name: "全体顧客満足度調査（Q1 2026）", type: "CSAT", responses: 342, score: 92.3, status: "有効", createdAt: "2026-01-01", lastResponse: "2026-03-14" },
  { id: "s2", name: "NPS 定期調査", type: "NPS", responses: 256, score: 48, status: "有効", createdAt: "2026-01-15", lastResponse: "2026-03-13" },
  { id: "s3", name: "サポート後満足度", type: "CSAT", responses: 189, score: 88.5, status: "有効", createdAt: "2025-12-01", lastResponse: "2026-03-14" },
  { id: "s4", name: "オンボーディング体験調査", type: "CES", responses: 67, score: 4.2, status: "有効", createdAt: "2026-02-01", lastResponse: "2026-03-12" },
  { id: "s5", name: "製品フィードバック調査", type: "CSAT", responses: 123, score: 85.2, status: "停止中", createdAt: "2025-10-01", lastResponse: "2026-01-15" },
  { id: "s6", name: "Q2 NPS 準備中", type: "NPS", responses: 0, score: 0, status: "下書き", createdAt: "2026-03-10", lastResponse: "-" },
];

const typeBadgeVariant = (type: string) => {
  switch (type) {
    case "NPS": return "purple" as const;
    case "CSAT": return "info" as const;
    case "CES": return "warning" as const;
    default: return "default" as const;
  }
};

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case "有効": return "success" as const;
    case "停止中": return "default" as const;
    case "下書き": return "warning" as const;
    default: return "default" as const;
  }
};

export default function FeedbackDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const item = surveys.find((s) => s.id === params.id);
      if (item) {
        setData(item);
      } else {
        setError("アンケートが見つかりません");
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

  const scoreDisplay = data.score > 0
    ? data.type === "NPS" ? `+${data.score}` : data.type === "CES" ? `${data.score}/5.0` : `${data.score}%`
    : "-";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-700">ホーム</Link>
        <span>/</span>
        <Link href="/feedback" className="hover:text-gray-700">フィードバック</Link>
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
              <Badge variant={typeBadgeVariant(data.type)}>{data.type}</Badge>
              <Badge variant={statusBadgeVariant(data.status)}>{data.status}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card><CardContent className="p-4 text-center"><MessageSquare className="h-5 w-5 text-blue-600 mx-auto mb-2" /><p className="text-xl font-bold text-gray-900">{data.responses > 0 ? data.responses.toLocaleString() : "-"}</p><p className="text-xs text-gray-500">回答数</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><TrendingUp className="h-5 w-5 text-green-600 mx-auto mb-2" /><p className="text-xl font-bold text-gray-900">{scoreDisplay}</p><p className="text-xs text-gray-500">スコア</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><Calendar className="h-5 w-5 text-purple-600 mx-auto mb-2" /><p className="text-xl font-bold text-gray-900">{data.createdAt}</p><p className="text-xs text-gray-500">作成日</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><Users className="h-5 w-5 text-orange-600 mx-auto mb-2" /><p className="text-xl font-bold text-gray-900">{data.lastResponse}</p><p className="text-xs text-gray-500">最終回答</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="h-5 w-5 text-[#ff4800]" />
            アンケート詳細
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-sm text-gray-500">アンケート名</span>
            <span className="text-sm font-medium text-gray-900">{data.name}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-sm text-gray-500">タイプ</span>
            <Badge variant={typeBadgeVariant(data.type)}>{data.type}</Badge>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-sm text-gray-500">回答数</span>
            <span className="text-sm font-medium text-gray-900">{data.responses > 0 ? data.responses.toLocaleString() : "-"}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-sm text-gray-500">スコア</span>
            <span className="text-lg font-bold text-gray-900">{scoreDisplay}</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-gray-500">ステータス</span>
            <Badge variant={statusBadgeVariant(data.status)}>{data.status}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
