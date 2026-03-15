"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import {
  Plus,
  Bot,
  MessageCircle,
  Users,
  Clock,
  MoreHorizontal,
  ArrowRight,
  Zap,
} from "lucide-react";

interface Chatflow {
  id: string;
  name: string;
  type: "ライブチャット" | "ボット";
  status: "有効" | "無効";
  conversations: number;
  createdAt: string;
  lastActive: string;
  description: string;
  steps?: string[];
}

const chatflows: Chatflow[] = [
  {
    id: "cf1",
    name: "Webサイト ウェルカムボット",
    type: "ボット",
    status: "有効",
    conversations: 1234,
    createdAt: "2025-10-01",
    lastActive: "2026-03-14",
    description: "初回訪問者への自動挨拶と資料請求への誘導",
    steps: ["挨拶メッセージ", "目的の確認", "資料送付 or 担当者接続", "情報収集"],
  },
  {
    id: "cf2",
    name: "カスタマーサポート ライブチャット",
    type: "ライブチャット",
    status: "有効",
    conversations: 856,
    createdAt: "2025-09-15",
    lastActive: "2026-03-14",
    description: "既存顧客向けのリアルタイムサポートチャット",
  },
  {
    id: "cf3",
    name: "リードクオリフィケーションボット",
    type: "ボット",
    status: "有効",
    conversations: 567,
    createdAt: "2025-12-01",
    lastActive: "2026-03-13",
    description: "リードの適格性を自動で判定し、適切な担当者にルーティング",
    steps: ["会社情報収集", "ニーズヒアリング", "予算確認", "スコアリング", "担当者アサイン"],
  },
  {
    id: "cf4",
    name: "ミーティング予約ボット",
    type: "ボット",
    status: "有効",
    conversations: 342,
    createdAt: "2026-01-15",
    lastActive: "2026-03-12",
    description: "カレンダー連携によるミーティング自動予約",
    steps: ["目的確認", "日程候補表示", "予約確定", "確認メール送信"],
  },
  {
    id: "cf5",
    name: "FAQ 自動応答ボット",
    type: "ボット",
    status: "無効",
    conversations: 189,
    createdAt: "2025-11-01",
    lastActive: "2026-02-28",
    description: "よくある質問への自動回答（ナレッジベース連携）",
    steps: ["質問受付", "キーワード分析", "記事検索", "回答提示", "解決確認"],
  },
  {
    id: "cf6",
    name: "営業時間外対応ボット",
    type: "ボット",
    status: "有効",
    conversations: 423,
    createdAt: "2026-02-01",
    lastActive: "2026-03-14",
    description: "営業時間外の問い合わせを受け付け、翌営業日にフォロー",
    steps: ["時間外メッセージ", "問い合わせ内容記録", "連絡先取得", "翌営業日通知"],
  },
];

export default function ChatflowsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="チャットフロー"
        description="ライブチャットとチャットボットの管理"
        actions={
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            チャットフロー作成
          </Button>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Bot className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {chatflows.filter((cf) => cf.type === "ボット").length}
                </p>
                <p className="text-xs text-gray-500">ボット</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <MessageCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {chatflows.filter((cf) => cf.type === "ライブチャット").length}
                </p>
                <p className="text-xs text-gray-500">ライブチャット</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {chatflows.reduce((s, cf) => s + cf.conversations, 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">総会話数</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chatflow Cards */}
      <div className="space-y-3">
        {chatflows.map((cf) => (
          <Card key={cf.id} className="hover:border-gray-300 transition-all">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    cf.type === "ボット" ? "bg-blue-50" : "bg-green-50"
                  }`}>
                    {cf.type === "ボット" ? (
                      <Bot className={`h-5 w-5 text-blue-600`} />
                    ) : (
                      <MessageCircle className={`h-5 w-5 text-green-600`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900">{cf.name}</h3>
                      <Badge variant={cf.type === "ボット" ? "info" : "success"}>{cf.type}</Badge>
                      <Badge variant={cf.status === "有効" ? "success" : "default"}>{cf.status}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{cf.description}</p>

                    {/* Bot Steps Preview */}
                    {cf.steps && (
                      <div className="flex items-center gap-1.5 flex-wrap mb-2">
                        {cf.steps.map((step, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            {i > 0 && <ArrowRight className="h-3 w-3 text-gray-300" />}
                            <div className="flex items-center gap-1 rounded bg-gray-50 px-2 py-1 text-xs text-gray-600">
                              <Zap className="h-3 w-3 text-yellow-500" />
                              {step}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        会話数: {cf.conversations.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        最終アクティブ: {cf.lastActive}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
