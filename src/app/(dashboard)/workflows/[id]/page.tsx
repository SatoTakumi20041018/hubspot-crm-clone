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
  Zap,
  Users,
  Clock,
  Play,
  ArrowRight,
  Handshake,
  Ticket,
  Building2,
} from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

type WorkflowType = "contact" | "deal" | "ticket" | "company";

const typeConfig: Record<WorkflowType, { label: string; icon: typeof Users; color: string; bg: string }> = {
  contact: { label: "コンタクト", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
  deal: { label: "取引", icon: Handshake, color: "text-green-600", bg: "bg-green-50" },
  ticket: { label: "チケット", icon: Ticket, color: "text-orange-600", bg: "bg-orange-50" },
  company: { label: "会社", icon: Building2, color: "text-purple-600", bg: "bg-purple-50" },
};

const workflows = [
  { id: "wf1", name: "新規リード自動フォローアップ", type: "contact" as WorkflowType, active: true, lastModified: "2026-03-12", enrolledCount: 342, trigger: "フォーム送信時", actions: ["ウェルカムメール送信", "3日後フォローアップメール", "担当者に通知", "タスク作成"] },
  { id: "wf2", name: "取引ステージ変更通知", type: "deal" as WorkflowType, active: true, lastModified: "2026-03-10", enrolledCount: 156, trigger: "取引ステージ変更時", actions: ["マネージャーに通知", "Slack通知", "アクティビティ記録"] },
  { id: "wf3", name: "チケットSLAエスカレーション", type: "ticket" as WorkflowType, active: true, lastModified: "2026-03-08", enrolledCount: 89, trigger: "SLA期限超過時", actions: ["優先度を上げる", "マネージャーに通知", "担当者再アサイン"] },
  { id: "wf4", name: "顧客満足度調査自動送信", type: "contact" as WorkflowType, active: true, lastModified: "2026-03-05", enrolledCount: 1245, trigger: "チケット解決後3日", actions: ["CSATアンケート送信", "スコア記録", "低スコア時にアラート"] },
  { id: "wf5", name: "新規会社登録時の自動処理", type: "company" as WorkflowType, active: false, lastModified: "2026-02-28", enrolledCount: 0, trigger: "新規会社作成時", actions: ["業界分類の自動設定", "担当者アサイン", "ウェルカムメール送信"] },
  { id: "wf6", name: "失注フォローアップ", type: "deal" as WorkflowType, active: true, lastModified: "2026-03-01", enrolledCount: 67, trigger: "取引が失注に変更時", actions: ["失注理由ヒアリングメール", "30日後再アプローチメール", "担当者タスク作成"] },
  { id: "wf7", name: "MQLからSQLへの自動昇格", type: "contact" as WorkflowType, active: true, lastModified: "2026-03-11", enrolledCount: 523, trigger: "リードスコア50点以上", actions: ["ライフサイクル変更", "営業チームに通知", "ミーティングリンク送信"] },
  { id: "wf8", name: "契約更新リマインダー", type: "deal" as WorkflowType, active: false, lastModified: "2026-02-20", enrolledCount: 0, trigger: "契約終了90日前", actions: ["担当者に通知", "更新提案メール", "タスク作成", "マネージャーCC"] },
  { id: "wf9", name: "チケット自動分類", type: "ticket" as WorkflowType, active: true, lastModified: "2026-03-13", enrolledCount: 412, trigger: "新規チケット作成時", actions: ["カテゴリ自動判定", "優先度設定", "適切な担当者にアサイン"] },
];

export default function WorkflowDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const item = workflows.find((w) => w.id === params.id);
      if (item) {
        setData(item);
      } else {
        setError("ワークフローが見つかりません");
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

  const config = typeConfig[data.type as WorkflowType];
  const TypeIcon = config.icon;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-700">ホーム</Link>
        <span>/</span>
        <Link href="/workflows" className="hover:text-gray-700">ワークフロー</Link>
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
              <Badge variant={data.active ? "success" : "default"}>{data.active ? "有効" : "無効"}</Badge>
              <Badge variant={data.type === "contact" ? "info" : data.type === "deal" ? "success" : data.type === "ticket" ? "warning" : "purple"}>
                <TypeIcon className="h-3 w-3 mr-1" />{config.label}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="h-5 w-5 text-[#ff4800]" />
              ワークフロー情報
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">名前</span>
              <span className="text-sm font-medium text-gray-900">{data.name}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">タイプ</span>
              <Badge variant={data.type === "contact" ? "info" : data.type === "deal" ? "success" : data.type === "ticket" ? "warning" : "purple"}>{config.label}</Badge>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">ステータス</span>
              <Badge variant={data.active ? "success" : "default"}>{data.active ? "有効" : "無効"}</Badge>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                最終更新
              </div>
              <span className="text-sm font-medium text-gray-900">{data.lastModified}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users className="h-4 w-4" />
                登録数
              </div>
              <span className="text-sm font-medium text-gray-900">{data.enrolledCount.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">トリガー & アクション</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 mb-2">トリガー</p>
              <div className="flex items-center gap-1.5 rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700">
                <Play className="h-4 w-4" />{data.trigger}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">アクション</p>
              <div className="space-y-2">
                {data.actions.map((action: string, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    {i > 0 && <ArrowRight className="h-3 w-3 text-gray-400 flex-shrink-0" />}
                    <div className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-600 flex-1">{action}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
