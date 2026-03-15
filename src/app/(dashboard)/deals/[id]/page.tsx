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
  Plus,
  Calendar,
  Loader2,
  AlertCircle,
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

function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return "-";
  return `¥${amount.toLocaleString("ja-JP")}`;
}

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [deal, setDeal] = useState<any>(null);
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
        const [dealRes, activitiesRes] = await Promise.all([
          fetch(`/api/deals/${id}`),
          fetch(`/api/activities?dealId=${id}&limit=50`),
        ]);

        if (!dealRes.ok) {
          if (dealRes.status === 404) {
            setError("取引が見つかりませんでした。");
          } else {
            setError("取引の取得に失敗しました。");
          }
          setLoading(false);
          return;
        }

        const dealData = await dealRes.json();
        setDeal(dealData);

        if (activitiesRes.ok) {
          const activitiesData = await activitiesRes.json();
          setActivities(activitiesData.results || []);
        }
      } catch (err) {
        console.error("Failed to fetch deal:", err);
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

  if (error || !deal) {
    return (
      <div className="-m-6 flex flex-col items-center justify-center" style={{ height: "calc(100vh - 4rem)" }}>
        <AlertCircle className="h-12 w-12 text-red-400" />
        <p className="mt-3 text-base font-medium text-gray-900">
          {error || "取引が見つかりません"}
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

  const name = deal.name || "名前なし";
  const amount = deal.amount;
  const stageName = deal.stage?.name || "-";
  const stageColor = deal.stage?.color || "#3B82F6";
  const pipelineName = deal.pipeline?.name || "-";
  const probability = deal.probability;
  const closeDate = deal.closeDate;
  const priority = deal.priority || "MEDIUM";
  const ownerName = deal.owner?.name || "-";
  const companyName = deal.company?.name || "";
  const companyId = deal.companyId || deal.company?.id || "";
  const companyDomain = deal.company?.domain || "";

  // Associated records
  const contacts: any[] = deal.contacts || [];
  const notes: any[] = deal.notes || [];

  const allActivities = activities.length > 0 ? activities : deal.activities || [];

  const filteredActivities = allActivities.filter((a: any) => {
    const type = a.type || a.properties?.hs_activity_type;
    if (activeTab === "すべて") return true;
    if (activeTab === "メモ") return type === "NOTE";
    if (activeTab === "メール") return type === "EMAIL";
    if (activeTab === "通話") return type === "CALL";
    return true;
  });

  return (
    <div className="-m-6 flex flex-col" style={{ height: "calc(100vh - 4rem)" }}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 px-6 pt-3 pb-1 bg-white flex-shrink-0">
        <Link href="/deals" className="hover:text-gray-700">取引</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900">{name}</span>
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
            <div className="flex h-10 w-10 items-center justify-center rounded bg-green-100 text-green-600">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">{name}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{formatCurrency(amount)}</span>
                {stageName !== "-" && (
                  <>
                    <span>-</span>
                    <Badge
                      style={{ backgroundColor: `${stageColor}20`, color: stageColor }}
                    >
                      {stageName}
                    </Badge>
                  </>
                )}
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
              <label className="text-xs font-medium text-gray-500">金額</label>
              <p className="text-sm font-medium text-gray-900 mt-0.5">
                {formatCurrency(amount)}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">ステージ</label>
              <div className="mt-1">
                <Badge
                  style={{ backgroundColor: `${stageColor}20`, color: stageColor }}
                >
                  {stageName}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">パイプライン</label>
              <p className="text-sm text-gray-900 mt-0.5">{pipelineName}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">確度</label>
              <p className="text-sm text-gray-900 mt-0.5">
                {probability != null ? `${probability}%` : "-"}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">クローズ予定日</label>
              <p className="text-sm text-gray-900 mt-0.5">
                {formatDate(closeDate)}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">優先度</label>
              <div className="mt-1">
                <Badge variant={priorityVariant[priority] || "default"}>
                  {priorityLabels[priority] || priority}
                </Badge>
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
                {formatDate(deal.createdAt)}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">最終更新</label>
              <p className="text-sm text-gray-900 mt-0.5">
                {formatDate(deal.updatedAt)}
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
                const subject = activity.subject || activity.properties?.hs_body_preview || "";
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
                              {subject || config.label}
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

            {/* Show notes in activities if on メモ tab and we have notes */}
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
          {/* Contacts */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                コンタクト
              </h2>
              <button className="text-xs text-[#ff4800] hover:underline flex items-center gap-1">
                <Plus className="h-3 w-3" />
                追加
              </button>
            </div>
            <div className="space-y-2">
              {contacts.length === 0 ? (
                <p className="text-xs text-gray-400 py-2">コンタクトはありません</p>
              ) : (
                contacts.map((contact: any) => {
                  const contactName = `${contact.lastName || ""} ${contact.firstName || ""}`.trim() || "名前なし";
                  return (
                    <Card
                      key={contact.id}
                      className="hover:border-gray-300 transition-colors"
                    >
                      <CardContent className="p-3">
                        <Link
                          href={`/contacts/${contact.id}`}
                          className="flex items-center gap-2"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff4800] text-xs font-medium text-white">
                            {contactName.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {contactName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {contact.jobTitle || contact.email || ""}
                            </p>
                          </div>
                        </Link>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>

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

          {/* Tickets - placeholder */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                チケット
              </h2>
              <button className="text-xs text-[#ff4800] hover:underline flex items-center gap-1">
                <Plus className="h-3 w-3" />
                追加
              </button>
            </div>
            <p className="text-xs text-gray-400 py-2">チケットはありません</p>
          </div>
        </div>
      </div>
    </div>
  );
}
