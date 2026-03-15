"use client";

import { useState, useEffect } from "react";
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
  MessageSquare,
  Loader2,
  CheckSquare,
  FileText,
} from "lucide-react";
import Link from "next/link";

/* eslint-disable @typescript-eslint/no-explicit-any */

const activityTypeIcons: Record<string, { icon: typeof Mail; color: string }> = {
  EMAIL: { icon: Mail, color: "text-blue-500" },
  CALL: { icon: Phone, color: "text-green-500" },
  MEETING: { icon: Calendar, color: "text-orange-500" },
  NOTE: { icon: MessageSquare, color: "text-gray-500" },
  TASK: { icon: CheckSquare, color: "text-yellow-500" },
  DEAL_CREATED: { icon: DollarSign, color: "text-purple-500" },
  DEAL_STAGE_CHANGED: { icon: DollarSign, color: "text-purple-500" },
  TICKET_CREATED: { icon: Ticket, color: "text-orange-500" },
  FORM_SUBMISSION: { icon: FileText, color: "text-cyan-500" },
  PAGE_VIEW: { icon: FileText, color: "text-gray-400" },
  LIFECYCLE_CHANGE: { icon: Users, color: "text-indigo-500" },
};

function formatRelativeTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / (1000 * 60));
    const diffHour = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDay = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMin < 1) return "たった今";
    if (diffMin < 60) return `${diffMin}分前`;
    if (diffHour < 24) return `${diffHour}時間前`;
    if (diffDay < 7) return `${diffDay}日前`;
    return date.toLocaleDateString("ja-JP", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatActivityDescription(activity: any): string {
  const type = activity.type;
  const contactName =
    activity.contact
      ? `${activity.contact.lastName || ""} ${activity.contact.firstName || ""}`.trim()
      : null;
  const dealName = activity.deal?.name || null;
  const ticketSubject = activity.ticket?.subject || null;

  switch (type) {
    case "EMAIL":
      return contactName
        ? `${contactName}にメールを送信しました`
        : "メールを送信しました";
    case "CALL":
      return contactName
        ? `${contactName}と通話しました`
        : "通話を記録しました";
    case "MEETING":
      return contactName
        ? `${contactName}との会議を記録しました`
        : "会議を記録しました";
    case "NOTE":
      return contactName
        ? `${contactName}のコンタクトにメモを追加`
        : "メモを追加しました";
    case "DEAL_CREATED":
      return dealName
        ? `取引「${dealName}」を作成しました`
        : "新しい取引を作成しました";
    case "DEAL_STAGE_CHANGED":
      return dealName
        ? `取引「${dealName}」のステージを更新`
        : "取引のステージを更新しました";
    case "TICKET_CREATED":
      return ticketSubject
        ? `チケット「${ticketSubject}」を作成しました`
        : "新しいチケットを作成しました";
    case "TASK":
      return "タスクを更新しました";
    default:
      return activity.subject || "アクティビティを記録しました";
  }
}

const priorityBadge = (priority: string) => {
  switch (priority) {
    case "HIGH":
    case "URGENT":
      return <Badge variant="danger">{priority === "HIGH" ? "高" : "緊急"}</Badge>;
    case "MEDIUM":
      return <Badge variant="warning">中</Badge>;
    case "LOW":
      return <Badge variant="info">低</Badge>;
    default:
      return <Badge>-</Badge>;
  }
};

const taskStatusLabel: Record<string, string> = {
  NOT_STARTED: "未着手",
  IN_PROGRESS: "進行中",
  COMPLETED: "完了",
  DEFERRED: "延期",
};

function formatTaskDueDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 86400000);
    const dueDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (dueDay.getTime() === today.getTime()) return "今日";
    if (dueDay.getTime() === tomorrow.getTime()) return "明日";
    if (dueDay < today) return "期限切れ";

    return date.toLocaleDateString("ja-JP", { month: "long", day: "numeric" });
  } catch {
    return dateStr;
  }
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [recentContacts, setRecentContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      try {
        const [dashRes, tasksRes, contactsRes] = await Promise.all([
          fetch("/api/dashboard"),
          fetch("/api/tasks?limit=5"),
          fetch("/api/contacts?limit=6&associations=company"),
        ]);

        if (dashRes.ok) {
          const data = await dashRes.json();
          setDashboardData(data);
        }

        if (tasksRes.ok) {
          const data = await tasksRes.json();
          setTasks(data.results || []);
        }

        if (contactsRes.ok) {
          const data = await contactsRes.json();
          setRecentContacts(data.results || []);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#ff4800] mx-auto" />
          <p className="mt-3 text-sm text-gray-500">ダッシュボードを読み込み中...</p>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const recentActivities: any[] = dashboardData?.recentActivities || [];
  const dealsByStage: any[] = dashboardData?.dealsByStage || [];

  const kpiData = [
    {
      label: "コンタクト合計",
      value: (stats.totalContacts || 0).toLocaleString(),
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "進行中の取引",
      value: (stats.activeDeals || 0).toLocaleString(),
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "合計売上",
      value: stats.totalRevenue
        ? `¥${Math.round(stats.totalRevenue).toLocaleString()}`
        : "¥0",
      icon: TrendingUp,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "未対応チケット",
      value: (stats.openTickets || 0).toLocaleString(),
      icon: Ticket,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  const maxPipelineValue =
    dealsByStage.length > 0
      ? Math.max(...dealsByStage.map((s: any) => s.totalAmount || 0))
      : 1;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          ダッシュボード
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
              {recentActivities.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">
                  アクティビティはまだありません
                </p>
              ) : (
                recentActivities.map((activity: any) => {
                  const typeConfig = activityTypeIcons[activity.type] || activityTypeIcons.NOTE;
                  const Icon = typeConfig.icon;
                  return (
                    <div key={activity.id} className="flex gap-3">
                      <div
                        className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 ${typeConfig.color}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          {formatActivityDescription(activity)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.subject || activity.body || ""}
                        </p>
                      </div>
                      <span className="flex-shrink-0 text-xs text-gray-400 mt-0.5">
                        {formatRelativeTime(activity.createdAt)}
                      </span>
                    </div>
                  );
                })
              )}
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
              {tasks.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">
                  タスクはありません
                </p>
              ) : (
                tasks.map((task: any) => {
                  const isCompleted = task.status === "COMPLETED";
                  const dueDate = task.dueDate || task.properties?.hs_timestamp;
                  const title = task.title || task.properties?.hs_task_subject || "";
                  const priority = task.priority || task.properties?.hs_task_priority || "MEDIUM";

                  return (
                    <div
                      key={task.id}
                      className="flex items-start gap-3 rounded-md p-2 hover:bg-gray-50"
                    >
                      <div className="mt-0.5">
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm ${isCompleted ? "text-gray-400 line-through" : "text-gray-900"}`}
                        >
                          {title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {formatTaskDueDate(dueDate)}
                          </div>
                          {priorityBadge(priority)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
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
              {dealsByStage.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">
                  取引データはまだありません
                </p>
              ) : (
                dealsByStage.map((stage: any) => (
                  <div key={stage.stage.id} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{stage.stage.name}</span>
                      <span className="text-gray-500">
                        {stage.count}件 / ¥
                        {((stage.totalAmount || 0) / 10000).toLocaleString()}万
                      </span>
                    </div>
                    <div className="h-4 w-full rounded-full bg-gray-100">
                      <div
                        className="h-4 rounded-full transition-all"
                        style={{
                          width: `${((stage.totalAmount || 0) / maxPipelineValue) * 100}%`,
                          backgroundColor: stage.stage.color || "#3B82F6",
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
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
              {recentContacts.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">
                  コンタクトはまだありません
                </p>
              ) : (
                recentContacts.map((contact: any) => {
                  const firstName = contact.properties?.firstname || "";
                  const lastName = contact.properties?.lastname || "";
                  const displayName = `${lastName} ${firstName}`.trim() || "名前なし";
                  const companyName = contact.company?.name || "";
                  const lifecycleStage = contact.properties?.lifecyclestage || "";

                  const stageLabels: Record<string, string> = {
                    SUBSCRIBER: "登録者",
                    LEAD: "リード",
                    MQL: "MQL",
                    SQL: "SQL",
                    OPPORTUNITY: "商談中",
                    CUSTOMER: "顧客",
                    EVANGELIST: "推奨者",
                    OTHER: "その他",
                  };

                  return (
                    <Link
                      key={contact.id}
                      href={`/contacts/${contact.id}`}
                      className="flex items-center gap-3 rounded-md p-2 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ff4800] text-sm font-medium text-white">
                        {displayName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {displayName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {companyName}
                        </p>
                      </div>
                      <Badge
                        variant={
                          lifecycleStage === "CUSTOMER"
                            ? "success"
                            : lifecycleStage === "OPPORTUNITY" || lifecycleStage === "SQL"
                              ? "info"
                              : "default"
                        }
                      >
                        {stageLabels[lifecycleStage] || lifecycleStage || "-"}
                      </Badge>
                    </Link>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
