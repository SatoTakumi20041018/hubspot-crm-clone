"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Users,
  Database,
  GitBranch,
  Puzzle,
  Shield,
  Mail,
  Building2,
  MoreHorizontal,
  Check,
} from "lucide-react";

const tabs = [
  { key: "general", label: "一般", icon: Settings },
  { key: "users", label: "ユーザー", icon: Users },
  { key: "properties", label: "プロパティ", icon: Database },
  { key: "pipelines", label: "パイプライン", icon: GitBranch },
  { key: "integrations", label: "連携", icon: Puzzle },
];

const users = [
  {
    id: "1",
    name: "佐藤 匠",
    email: "sato@example.com",
    role: "管理者",
    status: "アクティブ",
    lastLogin: "2026-03-14 09:30",
    avatar: "佐",
  },
  {
    id: "2",
    name: "田村 愛",
    email: "tamura@example.com",
    role: "営業",
    status: "アクティブ",
    lastLogin: "2026-03-14 08:15",
    avatar: "田",
  },
  {
    id: "3",
    name: "山本 健太",
    email: "yamamoto@example.com",
    role: "営業",
    status: "アクティブ",
    lastLogin: "2026-03-13 17:45",
    avatar: "山",
  },
  {
    id: "4",
    name: "中田 美穂",
    email: "nakata@example.com",
    role: "マーケティング",
    status: "アクティブ",
    lastLogin: "2026-03-14 10:00",
    avatar: "中",
  },
  {
    id: "5",
    name: "木下 拓也",
    email: "kinoshita@example.com",
    role: "サポート",
    status: "招待中",
    lastLogin: "-",
    avatar: "木",
  },
];

const properties = [
  { name: "名前", type: "テキスト", group: "コンタクト情報", required: true },
  {
    name: "メールアドレス",
    type: "メール",
    group: "コンタクト情報",
    required: true,
  },
  {
    name: "電話番号",
    type: "電話",
    group: "コンタクト情報",
    required: false,
  },
  { name: "会社名", type: "テキスト", group: "会社情報", required: false },
  { name: "役職", type: "テキスト", group: "コンタクト情報", required: false },
  {
    name: "ライフサイクルステージ",
    type: "ドロップダウン",
    group: "分類",
    required: true,
  },
  {
    name: "リードステータス",
    type: "ドロップダウン",
    group: "分類",
    required: false,
  },
  {
    name: "年間売上",
    type: "通貨",
    group: "会社情報",
    required: false,
  },
];

const pipelines = [
  {
    name: "デフォルトパイプライン",
    stages: ["初回商談", "提案中", "見積提出", "交渉中", "契約締結", "失注"],
    deals: 47,
    active: true,
  },
  {
    name: "エンタープライズ",
    stages: ["初回接触", "ニーズ分析", "提案", "評価", "交渉", "成約", "失注"],
    deals: 12,
    active: true,
  },
];

const integrations = [
  {
    name: "Slack",
    description: "通知とアクティビティをSlackに送信",
    status: "接続済み",
    icon: "S",
    color: "bg-purple-500",
  },
  {
    name: "Google Workspace",
    description: "メール、カレンダー、ドライブと連携",
    status: "接続済み",
    icon: "G",
    color: "bg-blue-500",
  },
  {
    name: "Zoom",
    description: "ミーティングの自動記録と同期",
    status: "未接続",
    icon: "Z",
    color: "bg-sky-500",
  },
  {
    name: "Salesforce",
    description: "データの双方向同期",
    status: "未接続",
    icon: "SF",
    color: "bg-blue-700",
  },
  {
    name: "Stripe",
    description: "決済情報の自動連携",
    status: "未接続",
    icon: "St",
    color: "bg-indigo-500",
  },
  {
    name: "LINE",
    description: "LINE公式アカウントとの連携",
    status: "接続済み",
    icon: "L",
    color: "bg-green-500",
  },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">設定</h1>
        <p className="text-sm text-gray-500 mt-1">
          アカウント設定とカスタマイズ
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.key
                  ? "border-[#FF7A59] text-[#FF7A59]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* General Tab */}
      {activeTab === "general" && (
        <div className="max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>アカウント情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="会社名" defaultValue="サンプル株式会社" />
                <Input label="ドメイン" defaultValue="sample-corp.jp" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="電話番号" defaultValue="03-1234-5678" />
                <Input label="業界" defaultValue="IT・ソフトウェア" />
              </div>
              <Input
                label="住所"
                defaultValue="東京都渋谷区神宮前1-2-3"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input label="タイムゾーン" defaultValue="Asia/Tokyo (UTC+9)" />
                <Input label="通貨" defaultValue="JPY (日本円)" />
              </div>
              <div className="flex justify-end">
                <Button>保存</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>メール設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="送信元メールアドレス"
                defaultValue="info@sample-corp.jp"
              />
              <Input
                label="送信者名"
                defaultValue="サンプル株式会社"
              />
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="email-tracking"
                  defaultChecked
                  className="rounded border-gray-300 text-[#FF7A59] focus:ring-[#FF7A59]"
                />
                <label
                  htmlFor="email-tracking"
                  className="text-sm text-gray-700"
                >
                  メール開封・クリックのトラッキングを有効にする
                </label>
              </div>
              <div className="flex justify-end">
                <Button>保存</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {users.length}名のユーザー
            </p>
            <Button size="sm">
              <Users className="h-4 w-4 mr-1" />
              ユーザーを招待
            </Button>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-left font-medium text-gray-500">
                      ユーザー
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">
                      メール
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">
                      ロール
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">
                      ステータス
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">
                      最終ログイン
                    </th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF7A59] text-xs font-medium text-white">
                            {user.avatar}
                          </div>
                          <span className="font-medium text-gray-900">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{user.email}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            user.role === "管理者" ? "purple" : "default"
                          }
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            user.status === "アクティブ"
                              ? "success"
                              : "warning"
                          }
                        >
                          {user.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {user.lastLogin}
                      </td>
                      <td className="px-4 py-3">
                        <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Properties Tab */}
      {activeTab === "properties" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {properties.length}件のプロパティ
            </p>
            <Button size="sm">
              <Database className="h-4 w-4 mr-1" />
              プロパティを追加
            </Button>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-left font-medium text-gray-500">
                      プロパティ名
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">
                      タイプ
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">
                      グループ
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500">
                      必須
                    </th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((prop) => (
                    <tr
                      key={prop.name}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-6 py-3 font-medium text-gray-900">
                        {prop.name}
                      </td>
                      <td className="px-4 py-3">
                        <Badge>{prop.type}</Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{prop.group}</td>
                      <td className="px-4 py-3 text-center">
                        {prop.required && (
                          <Check className="h-4 w-4 text-green-500 mx-auto" />
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Pipelines Tab */}
      {activeTab === "pipelines" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {pipelines.length}件のパイプライン
            </p>
            <Button size="sm">
              <GitBranch className="h-4 w-4 mr-1" />
              パイプラインを追加
            </Button>
          </div>

          {pipelines.map((pipeline) => (
            <Card key={pipeline.name}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle>{pipeline.name}</CardTitle>
                    <Badge variant="info">{pipeline.deals}件の取引</Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    編集
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {pipeline.stages.map((stage, i) => (
                    <div key={stage} className="flex items-center gap-2">
                      <div
                        className={`flex-shrink-0 rounded-lg px-4 py-2 text-sm font-medium ${
                          stage === "失注" || stage === "成約" || stage === "契約締結"
                            ? stage === "失注"
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : "bg-green-50 text-green-700 border border-green-200"
                            : "bg-gray-50 text-gray-700 border border-gray-200"
                        }`}
                      >
                        {stage}
                      </div>
                      {i < pipeline.stages.length - 1 && (
                        <div className="text-gray-300 flex-shrink-0">
                          &rarr;
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Integrations Tab */}
      {activeTab === "integrations" && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            外部サービスとの連携を管理
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {integrations.map((integration) => (
              <Card
                key={integration.name}
                className="hover:border-gray-300 transition-colors"
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${integration.color} text-white text-xs font-bold`}
                    >
                      {integration.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900">
                          {integration.name}
                        </h3>
                        <Badge
                          variant={
                            integration.status === "接続済み"
                              ? "success"
                              : "default"
                          }
                        >
                          {integration.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {integration.description}
                      </p>
                      <div className="mt-3">
                        <Button
                          variant={
                            integration.status === "接続済み"
                              ? "outline"
                              : "primary"
                          }
                          size="sm"
                          className="w-full"
                        >
                          {integration.status === "接続済み"
                            ? "設定"
                            : "接続する"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
