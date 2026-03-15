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
  Mail,
  Clock,
  CheckSquare,
  MessageSquare,
  ArrowRight,
  Users,
  TrendingUp,
  Calendar,
} from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

const stepTypeConfig: Record<string, { icon: typeof Mail; color: string; bg: string }> = {
  email: { icon: Mail, color: "text-blue-600", bg: "bg-blue-50" },
  wait: { icon: Clock, color: "text-gray-500", bg: "bg-gray-50" },
  task: { icon: CheckSquare, color: "text-orange-600", bg: "bg-orange-50" },
  call: { icon: MessageSquare, color: "text-green-600", bg: "bg-green-50" },
};

const sequences = [
  { id: "seq1", name: "新規リードアプローチ", steps: [{ type: "email", label: "自己紹介メール" }, { type: "wait", label: "3日待機" }, { type: "email", label: "事例紹介メール" }, { type: "wait", label: "2日待機" }, { type: "task", label: "電話フォロー" }, { type: "email", label: "最終フォローアップ" }], stepsCount: 6, enrolled: 234, replyRate: 18.5, meetingRate: 8.2, active: true, createdAt: "2026-01-15", owner: "佐藤 匠" },
  { id: "seq2", name: "展示会リードフォロー", steps: [{ type: "email", label: "お礼メール" }, { type: "wait", label: "1日待機" }, { type: "email", label: "資料送付" }, { type: "wait", label: "3日待機" }, { type: "call", label: "フォローコール" }, { type: "email", label: "ミーティング提案" }], stepsCount: 6, enrolled: 156, replyRate: 24.3, meetingRate: 12.1, active: true, createdAt: "2026-02-01", owner: "佐藤 匠" },
  { id: "seq3", name: "休眠顧客復活", steps: [{ type: "email", label: "近況伺い" }, { type: "wait", label: "5日待機" }, { type: "email", label: "新機能案内" }, { type: "wait", label: "3日待機" }, { type: "task", label: "個別フォロー検討" }], stepsCount: 5, enrolled: 89, replyRate: 12.4, meetingRate: 4.5, active: true, createdAt: "2026-02-10", owner: "田村 愛" },
  { id: "seq4", name: "デモ後フォローアップ", steps: [{ type: "email", label: "デモお礼＋資料" }, { type: "wait", label: "2日待機" }, { type: "email", label: "Q&Aフォロー" }, { type: "wait", label: "3日待機" }, { type: "call", label: "意思決定確認コール" }, { type: "email", label: "見積提案" }, { type: "wait", label: "5日待機" }, { type: "email", label: "最終確認" }], stepsCount: 8, enrolled: 78, replyRate: 32.1, meetingRate: 18.6, active: true, createdAt: "2026-01-20", owner: "佐藤 匠" },
  { id: "seq5", name: "ウェビナー参加者フォロー", steps: [{ type: "email", label: "録画・資料共有" }, { type: "wait", label: "2日待機" }, { type: "email", label: "関連コンテンツ" }, { type: "task", label: "スコア確認・アプローチ判断" }], stepsCount: 4, enrolled: 312, replyRate: 15.8, meetingRate: 6.3, active: false, createdAt: "2026-02-15", owner: "田村 愛" },
  { id: "seq6", name: "アップセル提案", steps: [{ type: "email", label: "利用状況レビュー" }, { type: "wait", label: "3日待機" }, { type: "email", label: "上位プラン紹介" }, { type: "wait", label: "4日待機" }, { type: "call", label: "個別ヒアリング" }, { type: "email", label: "カスタム提案書" }], stepsCount: 6, enrolled: 45, replyRate: 22.2, meetingRate: 15.6, active: true, createdAt: "2026-03-01", owner: "佐藤 匠" },
];

export default function SequenceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const item = sequences.find((s) => s.id === params.id);
      if (item) {
        setData(item);
      } else {
        setError("シーケンスが見つかりません");
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
        <Link href="/sequences" className="hover:text-gray-700">シーケンス</Link>
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
              <Badge variant={data.active ? "success" : "default"}>{data.active ? "有効" : "停止中"}</Badge>
              <span className="text-sm text-gray-500">{data.stepsCount} ステップ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card><CardContent className="p-4 text-center"><Users className="h-5 w-5 text-blue-600 mx-auto mb-2" /><p className="text-xl font-bold text-gray-900">{data.enrolled.toLocaleString()}</p><p className="text-xs text-gray-500">登録数</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><Mail className="h-5 w-5 text-green-600 mx-auto mb-2" /><p className="text-xl font-bold text-gray-900">{data.replyRate}%</p><p className="text-xs text-gray-500">返信率</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><Calendar className="h-5 w-5 text-orange-600 mx-auto mb-2" /><p className="text-xl font-bold text-gray-900">{data.meetingRate}%</p><p className="text-xs text-gray-500">ミーティング率</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><TrendingUp className="h-5 w-5 text-purple-600 mx-auto mb-2" /><p className="text-xl font-bold text-gray-900">{data.stepsCount}</p><p className="text-xs text-gray-500">ステップ数</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="h-5 w-5 text-[#ff4800]" />
              シーケンス情報
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">名前</span>
              <span className="text-sm font-medium text-gray-900">{data.name}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">ステータス</span>
              <Badge variant={data.active ? "success" : "default"}>{data.active ? "有効" : "停止中"}</Badge>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">担当者</span>
              <span className="text-sm font-medium text-gray-900">{data.owner}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-gray-500">作成日</span>
              <span className="text-sm font-medium text-gray-900">{data.createdAt}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">ステップ一覧</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.steps.map((step: any, i: number) => {
                const sConfig = stepTypeConfig[step.type] || stepTypeConfig.email;
                const StepIcon = sConfig.icon;
                return (
                  <div key={i} className="flex items-center gap-2">
                    {i > 0 && <ArrowRight className="h-3 w-3 text-gray-300 flex-shrink-0" />}
                    <div className={`flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs ${sConfig.bg} ${sConfig.color} flex-1`}>
                      <StepIcon className="h-3.5 w-3.5" />{step.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
