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
  Globe,
  Edit3,
  MoreHorizontal,
  ChevronLeft,
  FileText,
  CheckSquare,
  MessageSquare,
  DollarSign,
  Ticket,
  MapPin,
  Plus,
  Calendar,
  Loader2,
  AlertCircle,
} from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

const activityTabs = ["アクティビティ", "メモ", "メール", "通話", "タスク"];

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

function formatRevenue(amount: number | null | undefined): string {
  if (amount == null) return "-";
  if (amount >= 100000000) {
    return `¥${(amount / 100000000).toFixed(1)}億`;
  }
  if (amount >= 10000) {
    return `¥${(amount / 10000).toLocaleString("ja-JP")}万`;
  }
  return `¥${amount.toLocaleString("ja-JP")}`;
}

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [company, setCompany] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("アクティビティ");

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [companyRes, activitiesRes] = await Promise.all([
          fetch(`/api/companies/${id}`),
          fetch(`/api/activities?companyId=${id}&limit=50`),
        ]);

        if (!companyRes.ok) {
          if (companyRes.status === 404) {
            setError("会社が見つかりませんでした。");
          } else {
            setError("会社の取得に失敗しました。");
          }
          setLoading(false);
          return;
        }

        const companyData = await companyRes.json();
        setCompany(companyData);

        if (activitiesRes.ok) {
          const activitiesData = await activitiesRes.json();
          setActivities(activitiesData.results || []);
        }
      } catch (err) {
        console.error("Failed to fetch company:", err);
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

  if (error || !company) {
    return (
      <div className="-m-6 flex flex-col items-center justify-center" style={{ height: "calc(100vh - 4rem)" }}>
        <AlertCircle className="h-12 w-12 text-red-400" />
        <p className="mt-3 text-base font-medium text-gray-900">
          {error || "会社が見つかりません"}
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

  const name = company.name || company.properties?.name || "名前なし";
  const domain = company.domain || company.properties?.domain || "";
  const phone = company.phone || company.properties?.phone || "";
  const industry = company.industry || company.properties?.industry || "";
  const description = company.description || company.properties?.description || "";
  const annualRevenue = company.annualRevenue ?? company.properties?.annualrevenue ?? null;
  const employeeCount = company.employeeCount ?? company.properties?.numberofemployees ?? null;
  const city = company.city || company.properties?.city || "";
  const state = company.state || company.properties?.state || "";
  const country = company.country || company.properties?.country || "";
  const ownerName = company.owner?.name || "-";

  const addressParts = [city, state, country].filter(Boolean);
  const address = addressParts.join("、");

  // Associated records
  const contacts: any[] = company.contacts || [];
  const deals: any[] = company.deals || [];
  const tickets: any[] = company.tickets || [];
  const notes: any[] = company.notes || [];

  const allActivities = activities.length > 0 ? activities : company.activities || [];

  const filteredActivities = allActivities.filter((a: any) => {
    const type = a.type || a.properties?.hs_activity_type;
    if (activeTab === "アクティビティ") return true;
    if (activeTab === "メモ") return type === "NOTE";
    if (activeTab === "メール") return type === "EMAIL";
    if (activeTab === "通話") return type === "CALL";
    if (activeTab === "タスク") return type === "TASK";
    return true;
  });

  return (
    <div className="-m-6 flex flex-col" style={{ height: "calc(100vh - 4rem)" }}>
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
            <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-100 text-blue-600">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">{name}</h1>
              {domain && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Globe className="h-3.5 w-3.5" />
                  {domain}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Mail className="h-4 w-4 mr-1" />
            メール
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-1" />
            メモ
          </Button>
          <Button variant="outline" size="sm">
            <CheckSquare className="h-4 w-4 mr-1" />
            タスク
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
            {domain && (
              <div>
                <label className="text-xs font-medium text-gray-500">
                  ドメイン
                </label>
                <div className="flex items-center gap-1 mt-0.5">
                  <Globe className="h-3.5 w-3.5 text-gray-400" />
                  <p className="text-sm text-[#ff4800]">{domain}</p>
                </div>
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-gray-500">
                電話番号
              </label>
              <p className="text-sm text-gray-900 mt-0.5">{phone || "-"}</p>
            </div>
            {industry && (
              <div>
                <label className="text-xs font-medium text-gray-500">業界</label>
                <div className="mt-1">
                  <Badge>{industry}</Badge>
                </div>
              </div>
            )}
            {description && (
              <div>
                <label className="text-xs font-medium text-gray-500">説明</label>
                <p className="text-sm text-gray-900 mt-0.5">{description}</p>
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-gray-500">
                年間売上
              </label>
              <p className="text-sm font-medium text-gray-900 mt-0.5">
                {formatRevenue(annualRevenue)}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">
                従業員数
              </label>
              <p className="text-sm text-gray-900 mt-0.5">
                {employeeCount != null ? `${employeeCount}名` : "-"}
              </p>
            </div>
            {address && (
              <div>
                <label className="text-xs font-medium text-gray-500">住所</label>
                <div className="flex items-start gap-1 mt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-gray-400 mt-0.5" />
                  <p className="text-sm text-gray-900">{address}</p>
                </div>
              </div>
            )}

            <hr className="border-gray-200" />

            <div>
              <label className="text-xs font-medium text-gray-500">
                担当者
              </label>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white">
                  {ownerName.charAt(0)}
                </div>
                <p className="text-sm text-gray-900">{ownerName}</p>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">
                作成日
              </label>
              <p className="text-sm text-gray-900 mt-0.5">
                {formatDate(company.createdAt)}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">
                最終更新
              </label>
              <p className="text-sm text-gray-900 mt-0.5">
                {formatDate(company.updatedAt)}
              </p>
            </div>
          </div>
        </div>

        {/* MIDDLE - Activity Timeline */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
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
                              {contact.jobTitle || ""}
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

          {/* Deals */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                取引
              </h2>
              <button className="text-xs text-[#ff4800] hover:underline flex items-center gap-1">
                <Plus className="h-3 w-3" />
                追加
              </button>
            </div>
            <div className="space-y-2">
              {deals.length === 0 ? (
                <p className="text-xs text-gray-400 py-2">取引はありません</p>
              ) : (
                deals.map((deal: any) => (
                  <Card
                    key={deal.id}
                    className="hover:border-gray-300 transition-colors"
                  >
                    <CardContent className="p-3">
                      <Link href="/deals" className="block">
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="h-4 w-4 text-green-500" />
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {deal.name}
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{formatCurrency(deal.amount)}</span>
                          {deal.stage && (
                            <Badge variant="info">{deal.stage.name}</Badge>
                          )}
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Tickets */}
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
            <div className="space-y-2">
              {tickets.length === 0 ? (
                <p className="text-xs text-gray-400 py-2">チケットはありません</p>
              ) : (
                tickets.map((ticket: any) => {
                  const priorityLabels: Record<string, string> = {
                    LOW: "低",
                    MEDIUM: "中",
                    HIGH: "高",
                    URGENT: "緊急",
                  };
                  const statusLabels: Record<string, string> = {
                    OPEN: "新規",
                    IN_PROGRESS: "対応中",
                    WAITING: "待機中",
                    CLOSED: "完了",
                  };
                  return (
                    <Card
                      key={ticket.id}
                      className="hover:border-gray-300 transition-colors"
                    >
                      <CardContent className="p-3">
                        <Link href="/tickets" className="block">
                          <div className="flex items-center gap-2 mb-1">
                            <Ticket className="h-4 w-4 text-orange-500" />
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {ticket.subject}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <Badge variant="warning">
                              {statusLabels[ticket.status] || ticket.status}
                            </Badge>
                            <Badge
                              variant={
                                ticket.priority === "HIGH" || ticket.priority === "URGENT"
                                  ? "danger"
                                  : "default"
                              }
                            >
                              {priorityLabels[ticket.priority] || ticket.priority}
                            </Badge>
                          </div>
                        </Link>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
