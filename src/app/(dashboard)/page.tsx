"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  DollarSign,
  TrendingUp,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  MessageSquare,
  Loader2,
  CheckSquare,
  FileText,
  Ticket,
  ArrowRight,
  Video,
  CircleDot,
} from "lucide-react";
import Link from "next/link";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ─── Helpers ───────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "おはようございます";
  if (hour < 18) return "こんにちは";
  return "こんばんは";
}

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
      return null;
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

function isDueToday(dateStr: string | null): boolean {
  if (!dateStr) return false;
  try {
    const date = new Date(dateStr);
    const now = new Date();
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    );
  } catch {
    return false;
  }
}

function isOverdue(dateStr: string | null): boolean {
  if (!dateStr) return false;
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dueDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return dueDay < today;
  } catch {
    return false;
  }
}

// ─── Component ─────────────────────────────────────────────

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const greeting = useMemo(() => getGreeting(), []);

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      try {
        const [dashRes, tasksRes] = await Promise.all([
          fetch("/api/dashboard"),
          fetch("/api/tasks?limit=20"),
        ]);

        if (dashRes.ok) {
          const data = await dashRes.json();
          setDashboardData(data);
        }

        if (tasksRes.ok) {
          const data = await tasksRes.json();
          setTasks(data.results || []);
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
          <p className="mt-3 text-sm text-gray-500">読み込み中...</p>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const recentActivities: any[] = dashboardData?.recentActivities || [];
  const dealsByStage: any[] = dashboardData?.dealsByStage || [];

  // Filter tasks
  const incompleteTasks = tasks.filter((t: any) => t.status !== "COMPLETED");
  const todayTasks = incompleteTasks.filter((t: any) => {
    const dueDate = t.dueDate || t.properties?.hs_timestamp;
    return isDueToday(dueDate) || isOverdue(dueDate);
  });
  const upcomingTasks = incompleteTasks
    .filter((t: any) => {
      const dueDate = t.dueDate || t.properties?.hs_timestamp;
      return !isDueToday(dueDate) && !isOverdue(dueDate);
    })
    .slice(0, 3);

  const maxPipelineValue =
    dealsByStage.length > 0
      ? Math.max(...dealsByStage.map((s: any) => s.totalAmount || 0))
      : 1;

  // Today's date for display
  const todayStr = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <div className="space-y-6 max-w-[1200px]">
      {/* ── Personalized Greeting ── */}
      <div className="pt-2">
        <h1 className="text-2xl font-bold text-gray-900">
          {greeting}、匠さん
        </h1>
        <p className="text-sm text-gray-500 mt-1">{todayStr}</p>
      </div>

      {/* ── Main 2-column layout ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left Column - wider (3/5) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Today's Tasks */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">今日のタスク</CardTitle>
                  {todayTasks.length > 0 && (
                    <Badge variant="danger">{todayTasks.length}件</Badge>
                  )}
                </div>
                <Link
                  href="/tasks"
                  className="flex items-center gap-1 text-sm text-[#0091ae] hover:underline"
                >
                  すべて表示
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {todayTasks.length === 0 && upcomingTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="h-10 w-10 text-green-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      今日のタスクはすべて完了しています
                    </p>
                  </div>
                ) : (
                  <>
                    {todayTasks.map((task: any) => {
                      const dueDate = task.dueDate || task.properties?.hs_timestamp;
                      const title = task.title || task.properties?.hs_task_subject || "";
                      const priority = task.priority || task.properties?.hs_task_priority || "MEDIUM";
                      const overdue = isOverdue(dueDate);

                      return (
                        <div
                          key={task.id}
                          className="flex items-start gap-3 rounded-lg p-2.5 hover:bg-gray-50 transition-colors"
                        >
                          <div className="mt-0.5">
                            <div className={`h-[18px] w-[18px] rounded-full border-2 ${overdue ? "border-red-400" : "border-gray-300"}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900">{title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`inline-flex items-center gap-1 text-xs ${overdue ? "text-red-500 font-medium" : "text-gray-500"}`}>
                                <Clock className="h-3 w-3" />
                                {formatTaskDueDate(dueDate)}
                              </span>
                              {priorityBadge(priority)}
                              {task.status && task.status !== "NOT_STARTED" && (
                                <span className="text-xs text-gray-400">
                                  {taskStatusLabel[task.status] || task.status}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {upcomingTasks.length > 0 && todayTasks.length > 0 && (
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide px-2.5 mb-1">
                          近日中
                        </p>
                      </div>
                    )}

                    {upcomingTasks.map((task: any) => {
                      const dueDate = task.dueDate || task.properties?.hs_timestamp;
                      const title = task.title || task.properties?.hs_task_subject || "";

                      return (
                        <div
                          key={task.id}
                          className="flex items-start gap-3 rounded-lg p-2.5 hover:bg-gray-50 transition-colors"
                        >
                          <div className="mt-0.5">
                            <div className="h-[18px] w-[18px] rounded-full border-2 border-gray-200" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-700">{title}</p>
                            <span className="inline-flex items-center gap-1 text-xs text-gray-400 mt-1">
                              <Clock className="h-3 w-3" />
                              {formatTaskDueDate(dueDate)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Meetings */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#0091ae]" />
                  <CardTitle className="text-base">今日のミーティング</CardTitle>
                </div>
                <Link
                  href="/meetings"
                  className="flex items-center gap-1 text-sm text-[#0091ae] hover:underline"
                >
                  カレンダーを見る
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {/* We show meetings from activities, or placeholder */}
              {(() => {
                const meetings = recentActivities.filter(
                  (a: any) => a.type === "MEETING"
                );
                if (meetings.length === 0) {
                  return (
                    <div className="text-center py-6">
                      <Video className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">
                        今日のミーティングはありません
                      </p>
                    </div>
                  );
                }
                return (
                  <div className="space-y-3">
                    {meetings.slice(0, 3).map((meeting: any) => {
                      const contactName = meeting.contact
                        ? `${meeting.contact.lastName || ""} ${meeting.contact.firstName || ""}`.trim()
                        : null;
                      return (
                        <div
                          key={meeting.id}
                          className="flex items-start gap-3 rounded-lg border border-gray-100 p-3"
                        >
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
                            <Video className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {meeting.subject || "ミーティング"}
                            </p>
                            {contactName && (
                              <p className="text-xs text-gray-500 mt-0.5">
                                {contactName}
                              </p>
                            )}
                            <p className="text-xs text-gray-400 mt-0.5">
                              {formatRelativeTime(meeting.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          {/* Recent Activity Feed */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">最近のアクティビティ</CardTitle>
                <Link
                  href="/contacts"
                  className="flex items-center gap-1 text-sm text-[#0091ae] hover:underline"
                >
                  すべて表示
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">
                    アクティビティはまだありません
                  </p>
                ) : (
                  recentActivities.slice(0, 8).map((activity: any) => {
                    const typeConfig =
                      activityTypeIcons[activity.type] || activityTypeIcons.NOTE;
                    const Icon = typeConfig.icon;
                    return (
                      <div key={activity.id} className="flex gap-3">
                        <div
                          className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-50 ${typeConfig.color}`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">
                            {formatActivityDescription(activity)}
                          </p>
                          {(activity.subject || activity.body) && (
                            <p className="text-xs text-gray-500 truncate mt-0.5">
                              {activity.subject || activity.body}
                            </p>
                          )}
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
        </div>

        {/* Right Column - narrower (2/5) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sales Performance */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#00a4bd]" />
                <CardTitle className="text-base">営業パフォーマンス</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                  <div>
                    <p className="text-xs text-green-700 font-medium">進行中の取引</p>
                    <p className="text-xl font-bold text-green-900 mt-0.5">
                      {(stats.activeDeals || 0).toLocaleString()}
                      <span className="text-sm font-normal text-green-600 ml-1">件</span>
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50">
                  <div>
                    <p className="text-xs text-purple-700 font-medium">合計売上</p>
                    <p className="text-xl font-bold text-purple-900 mt-0.5">
                      {stats.totalRevenue
                        ? `¥${Math.round(stats.totalRevenue).toLocaleString()}`
                        : "¥0"}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-blue-50">
                    <p className="text-xs text-blue-700 font-medium">コンタクト</p>
                    <p className="text-lg font-bold text-blue-900 mt-0.5">
                      {(stats.totalContacts || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-orange-50">
                    <p className="text-xs text-orange-700 font-medium">未対応チケット</p>
                    <p className="text-lg font-bold text-orange-900 mt-0.5">
                      {(stats.openTickets || 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                <Link
                  href="/deals"
                  className="flex items-center justify-center gap-1 text-sm text-[#0091ae] hover:underline pt-1"
                >
                  取引を見る
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Pipeline Summary */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CircleDot className="h-4 w-4 text-[#0091ae]" />
                  <CardTitle className="text-base">パイプライン</CardTitle>
                </div>
                <Link
                  href="/deals"
                  className="flex items-center gap-1 text-sm text-[#0091ae] hover:underline"
                >
                  詳細
                  <ArrowRight className="h-3.5 w-3.5" />
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
                    <div key={stage.stage.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700 font-medium text-xs">
                          {stage.stage.name}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {stage.count}件 / ¥
                          {((stage.totalAmount || 0) / 10000).toLocaleString()}万
                        </span>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-gray-100">
                        <div
                          className="h-2.5 rounded-full transition-all"
                          style={{
                            width: `${Math.max(((stage.totalAmount || 0) / maxPipelineValue) * 100, 4)}%`,
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
        </div>
      </div>
    </div>
  );
}
