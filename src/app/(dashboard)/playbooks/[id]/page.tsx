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
  BookOpen,
  Clock,
  Users,
  CheckSquare,
} from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

const categoryBadgeVariant = (category: string) => {
  switch (category) {
    case "初回商談": return "info" as const;
    case "提案": return "purple" as const;
    case "交渉": return "warning" as const;
    case "クロージング": return "success" as const;
    case "導入": return "default" as const;
    default: return "default" as const;
  }
};

const playbooks = [
  { id: "pb1", name: "ディスカバリーコール", category: "初回商談", usageCount: 145, lastUsed: "2026-03-14", createdBy: "佐藤 匠", description: "初回のディスカバリーコールで使用する質問リストと進行ガイド", steps: ["自己紹介・アイスブレイク", "現在の課題ヒアリング", "ゴール・KPIの確認", "予算・タイムライン確認", "次のステップ合意"] },
  { id: "pb2", name: "デモンストレーション", category: "提案", usageCount: 89, lastUsed: "2026-03-13", createdBy: "佐藤 匠", description: "製品デモの進め方と重要なポイントをまとめたガイド", steps: ["アジェンダ確認", "ペインポイントの再確認", "製品デモ実施", "Q&A対応", "ROI説明", "フォローアップ合意"] },
  { id: "pb3", name: "競合対策ガイド", category: "交渉", usageCount: 67, lastUsed: "2026-03-12", createdBy: "田村 愛", description: "主要競合との比較ポイントと差別化トーク", steps: ["競合状況の確認", "当社の差別化ポイント提示", "顧客事例の紹介", "価格比較の説明", "決定要因の確認"] },
  { id: "pb4", name: "オブジェクション対応", category: "交渉", usageCount: 112, lastUsed: "2026-03-14", createdBy: "佐藤 匠", description: "よくある反対意見とその対処法のガイド", steps: ["反対意見の傾聴", "共感の表現", "具体的な回答", "事例での裏付け", "次のアクション提案"] },
  { id: "pb5", name: "クロージング手順", category: "クロージング", usageCount: 56, lastUsed: "2026-03-10", createdBy: "佐藤 匠", description: "契約締結に向けた最終確認プロセス", steps: ["条件の最終確認", "契約書のレビュー", "決裁者の確認", "導入スケジュール合意", "契約書送付"] },
  { id: "pb6", name: "オンボーディングキックオフ", category: "導入", usageCount: 34, lastUsed: "2026-03-08", createdBy: "田村 愛", description: "新規顧客のオンボーディング開始時のキックオフミーティングガイド", steps: ["チーム紹介", "プロジェクト概要説明", "マイルストーン設定", "コミュニケーション方法合意", "初回タスク割り当て"] },
];

export default function PlaybookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const item = playbooks.find((p) => p.id === params.id);
      if (item) {
        setData(item);
      } else {
        setError("プレイブックが見つかりません");
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
        <Link href="/playbooks" className="hover:text-gray-700">プレイブック</Link>
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
              <Badge variant={categoryBadgeVariant(data.category)}>{data.category}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-4 text-center"><Users className="h-5 w-5 text-blue-600 mx-auto mb-2" /><p className="text-xl font-bold text-gray-900">{data.usageCount}</p><p className="text-xs text-gray-500">使用回数</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><Clock className="h-5 w-5 text-green-600 mx-auto mb-2" /><p className="text-xl font-bold text-gray-900">{data.lastUsed}</p><p className="text-xs text-gray-500">最終使用日</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><CheckSquare className="h-5 w-5 text-purple-600 mx-auto mb-2" /><p className="text-xl font-bold text-gray-900">{data.steps.length}</p><p className="text-xs text-gray-500">ステップ数</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="h-5 w-5 text-[#ff4800]" />
              プレイブック情報
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">名前</span>
              <span className="text-sm font-medium text-gray-900">{data.name}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">カテゴリ</span>
              <Badge variant={categoryBadgeVariant(data.category)}>{data.category}</Badge>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">使用回数</span>
              <span className="text-sm font-medium text-gray-900">{data.usageCount}回</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">最終使用日</span>
              <span className="text-sm font-medium text-gray-900">{data.lastUsed}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">作成者</span>
              <span className="text-sm font-medium text-gray-900">{data.createdBy}</span>
            </div>
            <div className="py-3">
              <p className="text-sm text-gray-500 mb-1">説明</p>
              <p className="text-sm text-gray-900">{data.description}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">ステップ一覧</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.steps.map((step: string, i: number) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-gray-100 p-3">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#ff4800] text-xs font-bold text-white">
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-900 pt-1">{step}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
