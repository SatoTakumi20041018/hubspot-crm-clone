"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Bot,
  Users,
  Search,
  FileText,
  Share2,
  Database,
  Sparkles,
  MessageSquare,
  TrendingUp,
  Zap,
  ArrowRight,
  Brain,
  Eye,
  FormInput,
  Lightbulb,
} from "lucide-react";

const agents = [
  {
    id: "customer",
    name: "Customer Agent",
    nameJa: "カスタマーエージェント",
    description: "顧客からの問い合わせに24時間自動対応。ナレッジベースを活用して正確な回答を提供します。",
    status: "active" as const,
    conversations: 1847,
    resolution: 89,
    icon: Users,
  },
  {
    id: "prospecting",
    name: "Prospecting Agent",
    nameJa: "プロスペクティングエージェント",
    description: "理想的な見込み客を自動で調査・特定。パーソナライズされたアウトリーチメッセージを生成します。",
    status: "active" as const,
    conversations: 523,
    resolution: 76,
    icon: Search,
  },
  {
    id: "content",
    name: "Content Agent",
    nameJa: "コンテンツエージェント",
    description: "ブログ記事、SNS投稿、メールコピーをAIが自動生成。ブランドボイスに合わせたコンテンツを作成します。",
    status: "active" as const,
    conversations: 312,
    resolution: 94,
    icon: FileText,
  },
  {
    id: "social",
    name: "Social Agent",
    nameJa: "ソーシャルエージェント",
    description: "SNSの投稿スケジューリング、エンゲージメント分析、トレンド検出を自動化します。",
    status: "setup" as const,
    conversations: 0,
    resolution: 0,
    icon: Share2,
  },
  {
    id: "data",
    name: "Data Agent",
    nameJa: "データエージェント",
    description: "CRMデータの品質管理、重複排除、エンリッチメントを自動で実行。常にクリーンなデータを維持します。",
    status: "active" as const,
    conversations: 2156,
    resolution: 97,
    icon: Database,
  },
];

const intelligenceFeatures = [
  {
    name: "データエンリッチメント",
    description: "企業・連絡先情報を自動で補完・更新",
    enriched: 4523,
    icon: Database,
  },
  {
    name: "バイヤーインテント",
    description: "購買意欲の高い見込み客をリアルタイム検出",
    detected: 127,
    icon: Eye,
  },
  {
    name: "フォーム短縮",
    description: "既知データを活用してフォーム入力項目を自動削減",
    shortened: 68,
    icon: FormInput,
  },
];

const insights = [
  {
    id: 1,
    title: "商談クロージング率の低下傾向を検出",
    description: "過去30日間で商談クロージング率が12%低下しています。主な原因は「価格」に関する反論が増加していることが分析されました。",
    type: "warning" as const,
    time: "2時間前",
  },
  {
    id: 2,
    title: "田中商事のエンゲージメントが急上昇",
    description: "田中商事の複数の担当者が価格ページとケーススタディを閲覧しています。購買シグナルが強まっています。",
    type: "opportunity" as const,
    time: "4時間前",
  },
  {
    id: 3,
    title: "メールキャンペーン最適化の提案",
    description: "火曜日10時台の配信が最も開封率が高いことが判明しました。次回キャンペーンの配信時間を調整することを推奨します。",
    type: "suggestion" as const,
    time: "6時間前",
  },
  {
    id: 4,
    title: "チャーンリスク顧客3社を検出",
    description: "過去2週間でサポートチケット数が3倍に増加した顧客があります。CSMへのエスカレーションを推奨します。",
    type: "warning" as const,
    time: "8時間前",
  },
];

const promptLibrary = [
  "商談メールのドラフトを作成",
  "ブログ記事のアウトラインを生成",
  "顧客フィードバックを要約",
  "競合分析レポートを作成",
  "SNS投稿を一括生成",
  "営業トークスクリプトを最適化",
  "カスタマーヘルススコアを分析",
  "ABテストの結果を解釈",
];

export default function BreezePage() {
  const [promptSearch, setPromptSearch] = useState("");
  const [chatMessage, setChatMessage] = useState("");

  const filteredPrompts = promptLibrary.filter((p) =>
    p.includes(promptSearch)
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Breeze AI Hub"
        description="HubSpot全体のAI機能を一元管理。エージェント、インテリジェンス、インサイトを活用してビジネスを加速させましょう。"
        breadcrumbs={[
          { label: "ホーム", href: "/" },
          { label: "Breeze" },
        ]}
        actions={
          <Button size="sm">
            <Sparkles className="h-4 w-4 mr-1" />
            Breeze Studio
          </Button>
        }
      />

      <Tabs defaultValue="agents">
        <TabsList>
          <TabsTrigger value="agents">エージェント</TabsTrigger>
          <TabsTrigger value="intelligence">インテリジェンス</TabsTrigger>
          <TabsTrigger value="insights">インサイト</TabsTrigger>
          <TabsTrigger value="prompts">プロンプトライブラリ</TabsTrigger>
        </TabsList>

        {/* Agents Tab */}
        <TabsContent value="agents">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => {
              const Icon = agent.icon;
              return (
                <Card key={agent.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="rounded-[8px] bg-[#fcc6b1] p-2.5">
                        <Icon className="h-5 w-5 text-[#ff4800]" />
                      </div>
                      <Badge
                        variant={agent.status === "active" ? "success" : "warning"}
                      >
                        {agent.status === "active" ? "アクティブ" : "設定が必要"}
                      </Badge>
                    </div>
                    <CardTitle className="mt-3">{agent.nameJa}</CardTitle>
                    <CardDescription>{agent.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {agent.status === "active" ? (
                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">会話数</span>
                          <p className="font-semibold text-gray-900">{agent.conversations.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">解決率</span>
                          <p className="font-semibold text-gray-900">{agent.resolution}%</p>
                        </div>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm" className="w-full">
                        セットアップを開始
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Intelligence Tab */}
        <TabsContent value="intelligence">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {intelligenceFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.name}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-[8px] bg-[#b2e9eb] p-2.5">
                        <Icon className="h-5 w-5 text-[#2f7579]" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{feature.name}</CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                      <span className="text-sm text-gray-600">今月の処理件数</span>
                      <span className="text-lg font-bold text-gray-900">
                        {"enriched" in feature
                          ? (feature as { enriched: number }).enriched.toLocaleString()
                          : "detected" in feature
                          ? (feature as { detected: number }).detected.toLocaleString()
                          : (feature as { shortened: number }).shortened.toLocaleString()}
                      </span>
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      詳細を見る
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights">
          <div className="space-y-3">
            {insights.map((insight) => (
              <Card key={insight.id} className="hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 p-5">
                  <div
                    className={`rounded-full p-2 ${
                      insight.type === "warning"
                        ? "bg-[#fcc6b1]"
                        : insight.type === "opportunity"
                        ? "bg-[#b9cdbe]"
                        : "bg-[#b2e9eb]"
                    }`}
                  >
                    {insight.type === "warning" ? (
                      <TrendingUp className="h-4 w-4 text-[#d9002b]" />
                    ) : insight.type === "opportunity" ? (
                      <Zap className="h-4 w-4 text-[#00823a]" />
                    ) : (
                      <Lightbulb className="h-4 w-4 text-[#2f7579]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                      <Badge
                        variant={
                          insight.type === "warning"
                            ? "danger"
                            : insight.type === "opportunity"
                            ? "success"
                            : "info"
                        }
                      >
                        {insight.type === "warning"
                          ? "警告"
                          : insight.type === "opportunity"
                          ? "機会"
                          : "提案"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{insight.description}</p>
                    <span className="mt-2 block text-xs text-gray-400">{insight.time}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Prompts Tab */}
        <TabsContent value="prompts">
          <div className="space-y-4">
            <div className="w-80">
              <Input
                variant="search"
                placeholder="プロンプトを検索..."
                value={promptSearch}
                onChange={(e) => setPromptSearch(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {filteredPrompts.map((prompt) => (
                <Card
                  key={prompt}
                  className="hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 p-4">
                    <Brain className="h-5 w-5 text-[#ff4800]" />
                    <span className="text-sm font-medium text-gray-900">{prompt}</span>
                    <ArrowRight className="ml-auto h-4 w-4 text-gray-400" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Floating Breeze Assistant Panel */}
      <Card className="fixed bottom-6 right-6 z-50 w-80 shadow-xl">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-[#ff4800] p-1.5">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-sm">Breeze Assistant</CardTitle>
            </div>
            <Badge variant="success">オンライン</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-3 space-y-2">
            <div className="rounded-lg bg-gray-100 p-3 text-sm text-gray-700">
              こんにちは！HubSpotのAIアシスタント「Breeze」です。何かお手伝いできることはありますか？
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="メッセージを入力..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
            />
            <Button size="sm">
              送信
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
