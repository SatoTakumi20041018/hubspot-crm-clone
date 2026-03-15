"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  Building2,
  Edit3,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  FileText,
  CheckSquare,
  MessageSquare,
  DollarSign,
  Ticket,
  Calendar,
  Loader2,
  AlertCircle,
  Clock,
} from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

const activityTabs = ["すべて", "メモ", "メール", "通話"];

const activityTypeConfig: Record<
  string,
  { label: string; color: string; icon: typeof Mail }
> = {
  EMAIL: { label: "メール", color: "text-blue-500", icon: Mail },
  CALL: { label: "通話", color: "text-green-500", icon: Phone },
  MEETING: { label: "ミーティング", color: "text-purple-500", icon: Calendar },
  NOTE: { label: "メモ", color: "text-gray-500", icon: MessageSquare },
  TASK: { label: "タスク", color: "text-orange-500", icon: CheckSquare },
  DEAL_CREATED: {
    label: "取引作成",
    color: "text-green-600",
    icon: DollarSign,
  },
  DEAL_STAGE_CHANGED: {
    label: "ステージ変更",
    color: "text-purple-600",
    icon: DollarSign,
  },
  TICKET_CREATED: {
    label: "チケット作成",
    color: "text-orange-600",
    icon: Ticket,
  },
  FORM_SUBMISSION: {
    label: "フォーム送信",
    color: "text-cyan-500",
    icon: FileText,
  },
  PAGE_VIEW: {
    label: "ページビュー",
    color: "text-gray-400",
    icon: FileText,
  },
  LIFECYCLE_CHANGE: {
    label: "ステージ変更",
    color: "text-indigo-500",
    icon: MessageSquare,
  },
};

const statusLabels: Record<string, string> = {
  OPEN: "新規",
  IN_PROGRESS: "対応中",
  WAITING: "待機中",
  CLOSED: "完了",
};

const statusVariant: Record<string, "info" | "warning" | "purple" | "success"> = {
  OPEN: "info",
  IN_PROGRESS: "warning",
  WAITING: "purple",
  CLOSED: "success",
};

const priorityLabels: Record<string, string> = {
  LOW: "低",
  MEDIUM: "中",
  HIGH: "高",
  URGENT: "緊急",
};

const priorityVariant: Record<string, "default" | "info" | "orange" | "danger"> = {
  LOW: "default",
  MEDIUM: "info",
  HIGH: "orange",
  URGENT: "danger",
};

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "-";
  try {
    return new Date(dateStr).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "-";
  try {
    return new Date(dateStr).toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [ticket, setTicket] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("すべて");

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [ticketRes, activitiesRes] = await Promise.all([
          fetch(`/api/tickets/${id}`),
          fetch(`/api/activities?ticketId=${id}&limit=50`),
        ]);

        if (!ticketRes.ok) {
          if (ticketRes.status === 404) {
            setError("チケットが見つかりませんでした。");
          } else {
            setError("チケットの取得に失敗しました。");
          }
          setLoading(false);
          return;
        }

        const ticketData = await ticketRes.json();
        setTicket(ticketData);

        if (activitiesRes.ok) {
          const activitiesData = await activitiesRes.json();
          setActivities(activitiesData.results || []);
        }
      } catch (err) {
        console.error("Failed to fetch ticket:", err);
        setError("データの取得中にエラーが発生しました。");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="-m-6 flex flex-col items-center justify-center" style={{ height: "calc(100vh - 4rem)" }}>
        <Loader2 className="h-8 w-8 animate-spin text-[#ff4800]" />
        <p className="mt-3 text-sm text-gray-500">読み込み中...</p>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="-m-6 flex flex-col items-center justify-center" style={{ height: "calc(100vh - 4rem)" }}>
        <AlertCircle className="h-12 w-12 text-red-400" />
        <p className="mt-3 text-base font-medium text-gray-900">
          {error || "チケットが見つかりません"}
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          戻る
        </Button>
      </div>
    );
  }

  const subject = ticket.subject || "件名なし";
  const description = ticket.description || "";
  const status = ticket.status || "OPEN";
  const priority = ticket.priority || "MEDIUM";
  const category = ticket.category || "";
  const slaDeadline = ticket.slaDeadline;
  const closedAt = ticket.closedAt;
  const ownerName = ticket.owner?.name || "-";
  const contactName = ticket.contact
    ? `${ticket.contact.lastName || ""} ${ticket.contact.firstName || ""}`.trim() || "名前なし"
    : "";
  const contactId = ticket.contactId || ticket.contact?.id || "";
  const companyName = ticket.company?.name || "";
  const companyId = ticket.companyId || ticket.company?.id || "";
  const companyDomain = ticket.company?.domain || "";
  const pipelineName = ticket.pipeline?.name || "";
  const stageName = ticket.stage?.name || "";

  const notes: any[] = ticket.notes || [];
  const allActivities = activities.length > 0 ? activities : ticket.activities || [];

  const filteredActivities = allActivities.filter((a: any) => {
    const type = a.type || a.properties?.hs_activity_type;
    if (activeTab === "すべて") return true;
    if (activeTab === "メモ") return type === "NOTE";
    if (activeTab === "メール") return type === "EMAIL";
    if (activeTab === "通話") return type === "CALL";
    return true;
  });

  // Check if SLA is overdue
  const isOverdue = slaDeadline && new Date(slaDeadline) < new Date() && status !== "CLOSED";

  return (
    <div className="-m-6 flex flex-col" style={{ height: "calc(100vh - 4rem)" }}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 px-6 pt-3 pb-1 bg-white flex-shrink-0">
        <Link href="/tickets" className="hover:text-gray-700">チケット</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900">{subject}</span>
      </div>
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-orange-100 text-orange-600">
              <Ticket className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">{subject}</h1>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant={statusVariant[status] || "default"}>
                  {statusLabels[status] || status}
                </Badge>
                <Badge variant={priorityVariant[priority] || "default"}>
                  {priorityLabels[priority] || priority}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit3 className="h-4 w-4 mr-1" />
            編集
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-1" />
            メモ
          </Button>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR */}
        <div className="w-72 flex-shrink-0 overflow-y-auto border-r border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              概要
            </h2>
            <button className="text-gray-400 hover:text-gray-600">
              <Edit3 className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-500">件名</label>
              <p className="text-sm text-gray-900 mt-0.5">{subject}</p>
            </div>
            {description && (
              <div>
                <label className="text-xs font-medium text-gray-500">説明</label>
                <p className="text-sm text-gray-900 mt-0.5 whitespace-pre-wrap">
                  {description}
                </p>
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-gray-500">ステータス</label>
              <div className="mt-1">
                <Badge variant={statusVariant[status] || "default"}>
                  {statusLabels[status] || status}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">優先度</label>
              <div className="mt-1">
                <Badge variant={priorityVariant[priority] || "default"}>
                  {priorityLabels[priority] || priority}
                </Badge>
              </div>
            </div>
            {category && (
              <div>
                <label className="text-xs font-medium text-gray-500">カテゴリ</label>
                <div className="mt-1">
                  <Badge>{category}</Badge>
                </div>
              </div>
            )}
            {pipelineName && (
              <div>
                <label className="text-xs font-medium text-gray-500">パイプライン</label>
                <p className="text-sm text-gray-900 mt-0.5">{pipelineName}</p>
              </div>
            )}
            {stageName && (
              <div>
                <label className="text-xs font-medium text-gray-500">ステージ</label>
                <div className="mt-1">
                  <Badge
                    style={
                      ticket.stage?.color
                        ? { backgroundColor: `${ticket.stage.color}20`, color: ticket.stage.color }
                        : undefined
                    }
                  >
                    {stageName}
                  </Badge>
                </div>
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-gray-500">SLA期限</label>
              <div className="flex items-center gap-1 mt-0.5">
                {isOverdue && <Clock className="h-3.5 w-3.5 text-red-500" />}
                <p className={`text-sm ${isOverdue ? "text-red-600 font-medium" : "text-gray-900"}`}>
                  {formatDateTime(slaDeadline)}
                </p>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <label className="text-xs font-medium text-gray-500">担当者</label>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white">
                  {ownerName.charAt(0)}
                </div>
                <p className="text-sm text-gray-900">{ownerName}</p>
              </div>
            </div>

            {contactId && (
              <div>
                <label className="text-xs font-medium text-gray-500">コンタクト</label>
                <Link
                  href={`/contacts/${contactId}`}
                  className="flex items-center gap-2 mt-1 text-sm text-[#ff4800] hover:underline"
                >
                  {contactName}
                </Link>
              </div>
            )}

            {companyId && (
              <div>
                <label className="text-xs font-medium text-gray-500">会社</label>
                <Link
                  href={`/companies/${companyId}`}
                  className="flex items-center gap-2 mt-1 text-sm text-[#ff4800] hover:underline"
                >
                  <Building2 className="h-4 w-4" />
                  {companyName || "会社詳細"}
                </Link>
              </div>
            )}

            <hr className="border-gray-200" />

            <div>
              <label className="text-xs font-medium text-gray-500">作成日</label>
              <p className="text-sm text-gray-900 mt-0.5">
                {formatDate(ticket.createdAt)}
              </p>
            </div>
            {closedAt && (
              <div>
                <label className="text-xs font-medium text-gray-500">クローズ日</label>
                <p className="text-sm text-gray-900 mt-0.5">
                  {formatDate(closedAt)}
                </p>
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-gray-500">最終更新</label>
              <p className="text-sm text-gray-900 mt-0.5">
                {formatDate(ticket.updatedAt)}
              </p>
            </div>
          </div>
        </div>

        {/* MIDDLE - Activity Timeline */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {/* Tabs */}
          <div className="mb-4 flex gap-1 border-b border-gray-200">
            {activityTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? "border-[#ff4800] text-[#ff4800]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Activity Timeline */}
          <div className="space-y-4">
            {filteredActivities.length === 0 ? (
              <div className="text-center py-12 text-sm text-gray-400">
                アクティビティはまだありません
              </div>
            ) : (
              filteredActivities.map((activity: any) => {
                const type = activity.type || activity.properties?.hs_activity_type || "NOTE";
                const config = activityTypeConfig[type] || activityTypeConfig.NOTE;
                const Icon = config.icon;
                const userName = activity.user?.name || "-";
                const activitySubject = activity.subject || activity.properties?.hs_body_preview || "";
                const body = activity.body || "";
                const createdAt = activity.createdAt || "";

                return (
                  <Card key={activity.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <div
                          className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 ${config.color}`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900">
                              {activitySubject || config.label}
                            </h3>
                            <span className="text-xs text-gray-400">
                              {formatDateTime(createdAt)}
                            </span>
                          </div>
                          {body && (
                            <p className="mt-1 text-sm text-gray-600">
                              {body}
                            </p>
                          )}
                          <p className="mt-2 text-xs text-gray-400">
                            {userName}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}

            {activeTab === "メモ" && notes.length > 0 && filteredActivities.length === 0 && (
              notes.map((note: any) => (
                <Card key={note.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                        <MessageSquare className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900">
                            メモ
                          </h3>
                          <span className="text-xs text-gray-400">
                            {formatDateTime(note.createdAt)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                          {note.body}
                        </p>
                        <p className="mt-2 text-xs text-gray-400">
                          {note.user?.name || "-"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-72 flex-shrink-0 overflow-y-auto border-l border-gray-200 bg-white p-4">
          {/* Contact */}
          {contactId && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                コンタクト
              </h2>
              <Card className="hover:border-gray-300 transition-colors">
                <CardContent className="p-3">
                  <Link
                    href={`/contacts/${contactId}`}
                    className="flex items-center gap-2"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff4800] text-xs font-medium text-white">
                      {contactName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {contactName}
                      </p>
                      {ticket.contact?.email && (
                        <p className="text-xs text-gray-500 truncate">
                          {ticket.contact.email}
                        </p>
                      )}
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Company */}
          {companyId && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                会社
              </h2>
              <Card className="hover:border-gray-300 transition-colors">
                <CardContent className="p-3">
                  <Link
                    href={`/companies/${companyId}`}
                    className="flex items-center gap-2"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-100 text-blue-600">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {companyName}
                      </p>
                      {companyDomain && (
                        <p className="text-xs text-gray-500">{companyDomain}</p>
                      )}
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </div>
          )}

          {/* No associations message */}
          {!contactId && !companyId && (
            <div className="text-center py-8">
              <p className="text-xs text-gray-400">関連レコードはありません</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
