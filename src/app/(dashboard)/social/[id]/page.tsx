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
  Share2,
  Heart,
  MessageCircle,
  Eye,
  Calendar,
} from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

type Platform = "Twitter" | "Facebook" | "Instagram" | "LinkedIn";

const platformConfig: Record<Platform, { color: string; bg: string; label: string }> = {
  Twitter: { color: "text-sky-500", bg: "bg-sky-50", label: "X" },
  Facebook: { color: "text-blue-600", bg: "bg-blue-50", label: "FB" },
  Instagram: { color: "text-pink-500", bg: "bg-pink-50", label: "IG" },
  LinkedIn: { color: "text-blue-700", bg: "bg-blue-50", label: "LI" },
};

const posts = [
  { id: "sp1", platform: "Twitter" as Platform, content: "新機能リリースのお知らせ！CRMダッシュボードが大幅にアップデートされました。", status: "公開済み", engagement: { likes: 45, comments: 12, shares: 8, impressions: 2340 }, date: "2026-03-14", time: "09:00" },
  { id: "sp2", platform: "LinkedIn" as Platform, content: "業界トレンドレポート2026を公開しました。デジタルトランスフォーメーションの最新動向をまとめています。", status: "公開済み", engagement: { likes: 128, comments: 34, shares: 42, impressions: 8900 }, date: "2026-03-13", time: "10:00" },
  { id: "sp3", platform: "Instagram" as Platform, content: "チームメンバーの紹介シリーズ第3弾！今回は開発チームの裏側をお見せします。", status: "公開済み", engagement: { likes: 234, comments: 18, shares: 5, impressions: 4560 }, date: "2026-03-13", time: "12:00" },
  { id: "sp4", platform: "Facebook" as Platform, content: "4月開催の無料ウェビナー「CRM活用術」の参加者を募集中！詳しくはリンクをチェック。", status: "公開済み", engagement: { likes: 67, comments: 23, shares: 15, impressions: 3200 }, date: "2026-03-12", time: "14:00" },
  { id: "sp5", platform: "Twitter" as Platform, content: "お客様導入事例を公開！「売上30%アップを実現した太陽コーポレーション様」の成功の秘訣とは？", status: "公開済み", engagement: { likes: 32, comments: 8, shares: 12, impressions: 1890 }, date: "2026-03-11", time: "11:00" },
  { id: "sp6", platform: "LinkedIn" as Platform, content: "採用情報：プロダクトマネージャーを募集しています。CRM業界の未来を一緒に創りませんか？", status: "予約済み", engagement: { likes: 0, comments: 0, shares: 0, impressions: 0 }, date: "2026-03-15", time: "09:00" },
  { id: "sp7", platform: "Instagram" as Platform, content: "オフィスの新しいリラックススペースを紹介！社員の創造性を高める環境づくりに力を入れています。", status: "予約済み", engagement: { likes: 0, comments: 0, shares: 0, impressions: 0 }, date: "2026-03-16", time: "12:00" },
  { id: "sp8", platform: "Facebook" as Platform, content: "セミナーレポート：「2026年のマーケティング戦略」セミナーの内容をまとめました。", status: "公開済み", engagement: { likes: 89, comments: 15, shares: 22, impressions: 5600 }, date: "2026-03-10", time: "15:00" },
  { id: "sp9", platform: "Twitter" as Platform, content: "今週のTips: ワークフロー自動化の3つのベストプラクティスをご紹介します。", status: "下書き", engagement: { likes: 0, comments: 0, shares: 0, impressions: 0 }, date: "-", time: "-" },
  { id: "sp10", platform: "LinkedIn" as Platform, content: "パートナーシップのお知らせ：新たにABC社との提携が始まりました。", status: "公開済み", engagement: { likes: 156, comments: 28, shares: 35, impressions: 12000 }, date: "2026-03-08", time: "10:00" },
  { id: "sp11", platform: "Instagram" as Platform, content: "ユーザーカンファレンス2026の写真をアップしました！ご参加いただいた皆様、ありがとうございました。", status: "公開済み", engagement: { likes: 312, comments: 45, shares: 18, impressions: 7800 }, date: "2026-03-07", time: "18:00" },
];

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case "公開済み": return "success" as const;
    case "予約済み": return "info" as const;
    case "下書き": return "default" as const;
    default: return "default" as const;
  }
};

export default function SocialDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const item = posts.find((p) => p.id === params.id);
      if (item) {
        setData(item);
      } else {
        setError("投稿が見つかりません");
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

  const config = platformConfig[data.platform as Platform];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-700">ホーム</Link>
        <span>/</span>
        <Link href="/social" className="hover:text-gray-700">ソーシャル</Link>
        <span>/</span>
        <span className="text-gray-900">{data.id}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            戻る
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">投稿詳細</h1>
            <p className="text-sm text-gray-500">{data.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${config.bg}`}>
            <span className={`text-xs font-bold ${config.color}`}>{config.label}</span>
          </div>
          <Badge variant={statusBadgeVariant(data.status)}>{data.status}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Share2 className="h-5 w-5 text-[#ff4800]" />
              投稿内容
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${config.bg}`}>
                <span className={`text-sm font-bold ${config.color}`}>{config.label}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{data.platform}</p>
                <p className="text-xs text-gray-500">{data.date !== "-" ? `${data.date} ${data.time}` : "未設定"}</p>
              </div>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-900 leading-relaxed">{data.content}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">エンゲージメント</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-pink-50 p-4 text-center">
                <Heart className="h-6 w-6 text-pink-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{data.engagement.likes.toLocaleString()}</p>
                <p className="text-xs text-gray-500">いいね</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-4 text-center">
                <MessageCircle className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{data.engagement.comments.toLocaleString()}</p>
                <p className="text-xs text-gray-500">コメント</p>
              </div>
              <div className="rounded-lg bg-green-50 p-4 text-center">
                <Share2 className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{data.engagement.shares.toLocaleString()}</p>
                <p className="text-xs text-gray-500">シェア</p>
              </div>
              <div className="rounded-lg bg-purple-50 p-4 text-center">
                <Eye className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{data.engagement.impressions.toLocaleString()}</p>
                <p className="text-xs text-gray-500">インプレッション</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              {data.date !== "-" ? `${data.date} ${data.time}` : "未投稿"}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
