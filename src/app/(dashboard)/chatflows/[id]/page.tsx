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
  Bot,
  MessageCircle,
  Users,
  Clock,
  ArrowRight,
} from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

const chatflows = [
  { id: "cf1", name: "Webサイト ウェルカムボット", type: "ボット", status: "有効", conversations: 1234, createdAt: "2025-10-01", lastActive: "2026-03-14", description: "初回訪問者への自動挨拶と資料請求への誘導", steps: ["挨拶メッセージ", "目的の確認", "資料送付 or 担当者接続", "情報収集"] },
  { id: "cf2", name: "カスタマーサポート ライブチャット", type: "ライブチャット", status: "有効", conversations: 856, createdAt: "2025-09-15", lastActive: "2026-03-14", description: "既存顧客向けのリアルタイムサポートチャット", steps: [] },
  { id: "cf3", name: "リードクオリフィケーションボット", type: "ボット", status: "有効", conversations: 567, createdAt: "2025-12-01", lastActive: "2026-03-13", description: "リードの適格性を自動で判定し、適切な担当者にルーティング", steps: ["会社情報収集", "ニーズヒアリング", "予算確認", "スコアリング", "担当者アサイン"] },
  { id: "cf4", name: "ミーティング予約ボット", type: "ボット", status: "有効", conversations: 342, createdAt: "2026-01-15", lastActive: "2026-03-12", description: "カレンダー連携によるミーティング自動予約", steps: ["目的確認", "日程候補表示", "予約確定", "確認メール送信"] },
  { id: "cf5", name: "FAQ 自動応答ボット", type: "ボット", status: "無効", conversations: 189, createdAt: "2025-11-01", lastActive: "2026-02-28", description: "よくある質問への自動回答（ナレッジベース連携）", steps: ["質問受付", "キーワード分析", "記事検索", "回答提示", "解決確認"] },
  { id: "cf6", name: "営業時間外対応ボット", type: "ボット", status: "有効", conversations: 423, createdAt: "2026-02-01", lastActive: "2026-03-14", description: "営業時間外の問い合わせを受け付け、翌営業日にフォロー", steps: ["時間外メッセージ", "問い合わせ内容記録", "連絡先取得", "翌営業日通知"] },
];

export default function ChatflowDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const item = chatflows.find((c) => c.id === params.id);
      if (item) {
        setData(item);
      } else {
        setError("チャットフローが見つかりません");
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
        <Link href="/chatflows" className="hover:text-gray-700">チャットフロー</Link>
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
              <Badge variant={data.type === "ボット" ? "info" : "success"}>{data.type}</Badge>
              <Badge variant={data.status === "有効" ? "success" : "default"}>{data.status}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-4 text-center"><MessageCircle className="h-5 w-5 text-blue-600 mx-auto mb-2" /><p className="text-xl font-bold text-gray-900">{data.conversations.toLocaleString()}</p><p className="text-xs text-gray-500">会話数</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><Clock className="h-5 w-5 text-green-600 mx-auto mb-2" /><p className="text-xl font-bold text-gray-900">{data.lastActive}</p><p className="text-xs text-gray-500">最終アクティブ</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><Users className="h-5 w-5 text-purple-600 mx-auto mb-2" /><p className="text-xl font-bold text-gray-900">{data.createdAt}</p><p className="text-xs text-gray-500">作成日</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bot className="h-5 w-5 text-[#ff4800]" />
              チャットフロー情報
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">名前</span>
              <span className="text-sm font-medium text-gray-900">{data.name}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">タイプ</span>
              <Badge variant={data.type === "ボット" ? "info" : "success"}>{data.type}</Badge>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">ステータス</span>
              <Badge variant={data.status === "有効" ? "success" : "default"}>{data.status}</Badge>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-gray-500">説明</span>
              <span className="text-sm text-gray-900 text-right max-w-xs">{data.description}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">ステップ一覧</CardTitle>
          </CardHeader>
          <CardContent>
            {data.steps && data.steps.length > 0 ? (
              <div className="space-y-2">
                {data.steps.map((step: string, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    {i > 0 && <ArrowRight className="h-3 w-3 text-gray-300 flex-shrink-0" />}
                    <div className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-600 flex-1">
                      <span className="text-xs font-medium text-gray-400 mr-2">#{i + 1}</span>
                      {step}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">ステップが設定されていません</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
