"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  DollarSign,
  TrendingUp,
  Ticket,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

const kpiData = [
  {
    label: "コンタクト合計",
    value: "1,284",
    change: "+12.5%",
    trend: "up" as const,
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "進行中の取引",
    value: "47",
    change: "+8.3%",
    trend: "up" as const,
    icon: DollarSign,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    label: "月間売上",
    value: "¥12,450,000",
    change: "+23.1%",
    trend: "up" as const,
    icon: TrendingUp,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    label: "未対応チケット",
    value: "12",
    change: "-5.2%",
    trend: "down" as const,
    icon: Ticket,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
];

const recentActivities = [
  {
    id: 1,
    type: "email",
    icon: Mail,
    color: "text-blue-500",
    description: "田中 太郎にメールを送信しました",
    detail: "提案書のご確認について",
    time: "10分前",
  },
  {
    id: 2,
    type: "call",
    icon: Phone,
    color: "text-green-500",
    description: "鈴木 花子と通話しました",
    detail: "契約内容の確認 - 15分",
    time: "1時間前",
  },
  {
    id: 3,
    type: "deal",
    icon: DollarSign,
    color: "text-purple-500",
    description: "取引「ECサイト構築案件」のステージを更新",
    detail: "提案中 → 見積提出",
    time: "2時間前",
  },
  {
    id: 4,
    type: "meeting",
    icon: Calendar,
    color: "text-orange-500",
    description: "山田 一郎との会議を予約しました",
    detail: "2026/03/15 14:00 - 15:00",
    time: "3時間前",
  },
  {
    id: 5,
    type: "note",
    icon: MessageSquare,
    color: "text-gray-500",
    description: "佐々木 美咲のコンタクトにメモを追加",
    detail: "次回フォローアップ: 来週月曜日",
    time: "5時間前",
  },
];

const upcomingTasks = [
  {
    id: 1,
    title: "田中様へフォローアップメール",
    dueDate: "今日",
    priority: "high" as const,
    contact: "田中 太郎",
    completed: false,
  },
  {
    id: 2,
    title: "鈴木商事 提案書の修正",
    dueDate: "今日",
    priority: "high" as const,
    contact: "鈴木 花子",
    completed: false,
  },
  {
    id: 3,
    title: "ABC株式会社 契約書の送付",
    dueDate: "明日",
    priority: "medium" as const,
    contact: "山田 一郎",
    completed: false,
  },
  {
    id: 4,
    title: "展示会リードのインポート",
    dueDate: "3月16日",
    priority: "low" as const,
    contact: "",
    completed: false,
  },
  {
    id: 5,
    title: "四半期レポート作成",
    dueDate: "3月17日",
    priority: "medium" as const,
    contact: "",
    completed: true,
  },
];

const pipelineStages = [
  { name: "初回商談", count: 8, value: 4200000, color: "bg-blue-400" },
  { name: "提案中", count: 12, value: 8500000, color: "bg-cyan-400" },
  { name: "見積提出", count: 7, value: 6300000, color: "bg-yellow-400" },
  { name: "交渉中", count: 5, value: 5100000, color: "bg-orange-400" },
  { name: "契約締結", count: 15, value: 12400000, color: "bg-green-400" },
  { name: "失注", count: 3, value: 1800000, color: "bg-red-400" },
];

const maxPipelineValue = Math.max(...pipelineStages.map((s) => s.value));

const recentContacts = [
  { id: "1", name: "田中 太郎", company: "田中商事株式会社", email: "tanaka@tanaka-corp.jp", stage: "商談中" },
  { id: "2", name: "鈴木 花子", company: "鈴木テクノロジー", email: "suzuki@suzuki-tech.co.jp", stage: "顧客" },
  { id: "3", name: "山田 一郎", company: "ABC株式会社", email: "yamada@abc-corp.jp", stage: "リード" },
  { id: "4", name: "佐々木 美咲", company: "デジタルソリューションズ", email: "sasaki@digital-sol.jp", stage: "商談中" },
  { id: "5", name: "高橋 健一", company: "東京マーケティング", email: "takahashi@tokyo-mktg.jp", stage: "MQL" },
  { id: "6", name: "伊藤 さくら", company: "イノベーション株式会社", email: "ito@innovation.jp", stage: "顧客" },
];

const priorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return <Badge variant="danger">高</Badge>;
    case "medium":
      return <Badge variant="warning">中</Badge>;
    case "low":
      return <Badge variant="info">低</Badge>;
    default:
      return <Badge>-</Badge>;
  }
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          おかえりなさい、佐藤さん
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          今日の概要をご確認ください。
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {kpi.label}
                    </p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {kpi.value}
                    </p>
                    <div className="mt-1 flex items-center gap-1">
                      {kpi.trend === "up" ? (
                        <ArrowUpRight className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-3.5 w-3.5 text-green-500" />
                      )}
                      <span className="text-xs font-medium text-green-600">
                        {kpi.change}
                      </span>
                      <span className="text-xs text-gray-400">先月比</span>
                    </div>
                  </div>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg ${kpi.bg}`}
                  >
                    <Icon className={`h-6 w-6 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>最近のアクティビティ</CardTitle>
              <Link
                href="/contacts"
                className="text-sm text-[#ff4800] hover:underline"
              >
                すべて表示
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex gap-3">
                    <div
                      className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 ${activity.color}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500">{activity.detail}</p>
                    </div>
                    <span className="flex-shrink-0 text-xs text-gray-400 mt-0.5">
                      {activity.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>タスク</CardTitle>
              <Link
                href="/tasks"
                className="text-sm text-[#ff4800] hover:underline"
              >
                すべて表示
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 rounded-md p-2 hover:bg-gray-50"
                >
                  <div className="mt-0.5">
                    {task.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm ${task.completed ? "text-gray-400 line-through" : "text-gray-900"}`}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {task.dueDate}
                      </div>
                      {priorityBadge(task.priority)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Deal Pipeline */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>取引パイプライン</CardTitle>
              <Link
                href="/deals"
                className="text-sm text-[#ff4800] hover:underline"
              >
                詳細を見る
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pipelineStages.map((stage) => (
                <div key={stage.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{stage.name}</span>
                    <span className="text-gray-500">
                      {stage.count}件 / ¥
                      {(stage.value / 10000).toLocaleString()}万
                    </span>
                  </div>
                  <div className="h-4 w-full rounded-full bg-gray-100">
                    <div
                      className={`h-4 rounded-full ${stage.color} transition-all`}
                      style={{
                        width: `${(stage.value / maxPipelineValue) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Contacts */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>最近のコンタクト</CardTitle>
              <Link
                href="/contacts"
                className="text-sm text-[#ff4800] hover:underline"
              >
                すべて表示
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentContacts.map((contact) => (
                <Link
                  key={contact.id}
                  href={`/contacts/${contact.id}`}
                  className="flex items-center gap-3 rounded-md p-2 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ff4800] text-sm font-medium text-white">
                    {contact.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {contact.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {contact.company}
                    </p>
                  </div>
                  <Badge
                    variant={
                      contact.stage === "顧客"
                        ? "success"
                        : contact.stage === "商談中"
                          ? "info"
                          : "default"
                    }
                  >
                    {contact.stage}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
