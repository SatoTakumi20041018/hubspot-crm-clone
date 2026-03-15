"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Mail,
  Phone,
  Building2,
  Globe,
  Edit3,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
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
  Search,
  ChevronsUpDown,
  PhoneCall,
  Eye,
  History,
  GitMerge,
  Copy,
  Trash2,
  Bell,
  Paperclip,
  BarChart3,
  Users,
} from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

const activityFilterOptions = [
  { value: "ALL", label: "すべて" },
  { value: "NOTE", label: "メモ" },
  { value: "EMAIL", label: "メール" },
  { value: "CALL", label: "通話" },
  { value: "TASK", label: "タスク" },
  { value: "MEETING", label: "ミーティング" },
];

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
  const [middleTab, setMiddleTab] = useState<"overview" | "activities">("overview");
  const [activityFilter, setActivityFilter] = useState("ALL");
  const [activitySearch, setActivitySearch] = useState("");
  const [allCollapsed, setAllCollapsed] = useState(false);
  const [collapsedCards, setCollapsedCards] = useState<Record<string, boolean>>({
    about: false,
    subscriptions: true,
    website: true,
  });
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    domain: "",
    phone: "",
    industry: "",
    description: "",
    annualRevenue: "",
    employeeCount: "",
    city: "",
  });
  const [saving, setSaving] = useState(false);

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

  // Filter activities based on filter + search
  const filteredActivities = allActivities.filter((a: any) => {
    const type = a.type || a.properties?.hs_activity_type;
    if (activityFilter !== "ALL" && type !== activityFilter) return false;
    if (activitySearch) {
      const subject = (a.subject || a.properties?.hs_body_preview || "").toLowerCase();
      const body = (a.body || "").toLowerCase();
      const q = activitySearch.toLowerCase();
      if (!subject.includes(q) && !body.includes(q)) return false;
    }
    return true;
  });

  // Recent 3 activities for overview
  const recentActivities = allActivities.slice(0, 3);

  // Upcoming activities (tasks/meetings in the future)
  const now = new Date();
  const upcomingActivities = allActivities.filter((a: any) => {
    const type = a.type || a.properties?.hs_activity_type;
    if (type !== "TASK" && type !== "MEETING") return false;
    const date = a.dueDate || a.startDate || a.createdAt;
    if (!date) return false;
    return new Date(date) > now;
  }).slice(0, 3);

  const toggleCard = (key: string) => {
    setCollapsedCards((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const startEditing = () => {
    setEditForm({
      name: name,
      domain: domain,
      phone: phone,
      industry: industry,
      description: description,
      annualRevenue: annualRevenue != null ? String(annualRevenue) : "",
      employeeCount: employeeCount != null ? String(employeeCount) : "",
      city: city,
    });
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
  };

  const saveEditing = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/companies/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          properties: {
            name: editForm.name,
            domain: editForm.domain,
            phone: editForm.phone,
            industry: editForm.industry,
            description: editForm.description,
            annualrevenue: editForm.annualRevenue || undefined,
            numberofemployees: editForm.employeeCount || undefined,
            city: editForm.city,
          },
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setCompany(updated);
        setEditing(false);
      }
    } catch (err) {
      console.error("Failed to save company:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="-m-6 flex flex-col" style={{ height: "calc(100vh - 4rem)" }}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 px-6 pt-3 pb-1 bg-white flex-shrink-0">
        <Link href="/companies" className="hover:text-gray-700">会社</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900">{name}</span>
      </div>
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/companies")}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>会社</span>
          </button>
          <div className="h-5 w-px bg-gray-200" />
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
          {/* Activity quick-action buttons */}
          <div className="flex items-center gap-1 mr-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => alert("メモを作成")}
              title="メモ"
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              メモ
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => alert("メールを送信")}
              title="メール"
            >
              <Mail className="h-4 w-4 mr-1" />
              メール
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => alert("通話を記録")}
              title="通話"
            >
              <PhoneCall className="h-4 w-4 mr-1" />
              通話
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => alert("タスクを作成")}
              title="タスク"
            >
              <CheckSquare className="h-4 w-4 mr-1" />
              タスク
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => alert("ミーティングを作成")}
              title="ミーティング"
            >
              <Calendar className="h-4 w-4 mr-1" />
              MTG
            </Button>
          </div>

          {/* Actions dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              アクション
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="right">
              <DropdownMenuItem onClick={() => alert("フォロー")}>
                <Bell className="h-4 w-4 mr-2" />
                フォロー
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert("すべてのプロパティを表示")}>
                <Eye className="h-4 w-4 mr-2" />
                すべてのプロパティを表示
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert("プロパティ履歴")}>
                <History className="h-4 w-4 mr-2" />
                プロパティ履歴
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => alert("マージ")}>
                <GitMerge className="h-4 w-4 mr-2" />
                マージ
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert("クローン")}>
                <Copy className="h-4 w-4 mr-2" />
                クローン
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem destructive onClick={() => alert("削除")}>
                <Trash2 className="h-4 w-4 mr-2" />
                削除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR */}
        <div className="w-72 flex-shrink-0 overflow-y-auto border-r border-gray-200 bg-white p-4 space-y-1">
          {/* About this company card */}
          <div className="mb-2">
            <button
              onClick={() => toggleCard("about")}
              className="flex w-full items-center justify-between py-2"
            >
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                この会社について
              </h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); startEditing(); }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                {collapsedCards.about ? (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </button>

            {!collapsedCards.about && (
              <div className="space-y-4 mt-2">
                {editing ? (
                  <>
                    <div>
                      <label className="text-xs font-medium text-gray-500">会社名</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-[#ff4800] focus:outline-none focus:ring-1 focus:ring-[#ff4800]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">ドメイン</label>
                      <input
                        type="text"
                        value={editForm.domain}
                        onChange={(e) => setEditForm({ ...editForm, domain: e.target.value })}
                        className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-[#ff4800] focus:outline-none focus:ring-1 focus:ring-[#ff4800]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">電話番号</label>
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-[#ff4800] focus:outline-none focus:ring-1 focus:ring-[#ff4800]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">業界</label>
                      <input
                        type="text"
                        value={editForm.industry}
                        onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })}
                        className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-[#ff4800] focus:outline-none focus:ring-1 focus:ring-[#ff4800]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">説明</label>
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        rows={3}
                        className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-[#ff4800] focus:outline-none focus:ring-1 focus:ring-[#ff4800]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">年間売上</label>
                      <input
                        type="number"
                        value={editForm.annualRevenue}
                        onChange={(e) => setEditForm({ ...editForm, annualRevenue: e.target.value })}
                        className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-[#ff4800] focus:outline-none focus:ring-1 focus:ring-[#ff4800]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">従業員数</label>
                      <input
                        type="number"
                        value={editForm.employeeCount}
                        onChange={(e) => setEditForm({ ...editForm, employeeCount: e.target.value })}
                        className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-[#ff4800] focus:outline-none focus:ring-1 focus:ring-[#ff4800]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">都市</label>
                      <input
                        type="text"
                        value={editForm.city}
                        onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                        className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-[#ff4800] focus:outline-none focus:ring-1 focus:ring-[#ff4800]"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <Button size="sm" onClick={saveEditing} disabled={saving}>
                        {saving ? "保存中..." : "保存"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={cancelEditing} disabled={saving}>
                        キャンセル
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            )}
          </div>

          <hr className="border-gray-200" />

          {/* Communication Subscriptions card */}
          <div>
            <button
              onClick={() => toggleCard("subscriptions")}
              className="flex w-full items-center justify-between py-2"
            >
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                コミュニケーション購読
              </h2>
              {collapsedCards.subscriptions ? (
                <ChevronRight className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </button>
            {!collapsedCards.subscriptions && (
              <div className="mt-2 space-y-3 pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">マーケティングメール</span>
                  <Badge variant="success">購読中</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">ニュースレター</span>
                  <Badge variant="default">未設定</Badge>
                </div>
                <p className="text-xs text-gray-400">
                  購読設定はHubSpot設定から管理できます。
                </p>
              </div>
            )}
          </div>

          <hr className="border-gray-200" />

          {/* Website Activity card */}
          <div>
            <button
              onClick={() => toggleCard("website")}
              className="flex w-full items-center justify-between py-2"
            >
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Webサイトアクティビティ
              </h2>
              {collapsedCards.website ? (
                <ChevronRight className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </button>
            {!collapsedCards.website && (
              <div className="mt-2 space-y-3 pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">ページビュー</span>
                  <span className="text-xs font-medium text-gray-900">-</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">最終訪問</span>
                  <span className="text-xs font-medium text-gray-900">-</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">フォーム送信</span>
                  <span className="text-xs font-medium text-gray-900">-</span>
                </div>
                <p className="text-xs text-gray-400">
                  トラッキングコードが設置されると、サイト上の行動が記録されます。
                </p>
              </div>
            )}
          </div>
        </div>

        {/* MIDDLE - Tabs: Overview / Activities */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {/* Tab bar */}
          <div className="mb-4 flex gap-1 border-b border-gray-200">
            <button
              onClick={() => setMiddleTab("overview")}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                middleTab === "overview"
                  ? "border-[#ff4800] text-[#ff4800]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              概要
            </button>
            <button
              onClick={() => setMiddleTab("activities")}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                middleTab === "activities"
                  ? "border-[#ff4800] text-[#ff4800]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              アクティビティ
            </button>
          </div>

          {/* Overview Tab */}
          {middleTab === "overview" && (
            <div className="space-y-6">
              {/* Data Highlights */}
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="h-4 w-4 text-gray-500" />
                    <h3 className="text-sm font-semibold text-gray-900">データハイライト</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-500 mb-1">業界</p>
                      <p className="text-sm font-medium text-gray-900">{industry || "-"}</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-500 mb-1">年間売上</p>
                      <p className="text-sm font-medium text-gray-900">{formatRevenue(annualRevenue)}</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-500 mb-1">従業員数</p>
                      <p className="text-sm font-medium text-gray-900">{employeeCount != null ? `${employeeCount}名` : "-"}</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-500 mb-1">担当者</p>
                      <p className="text-sm font-medium text-gray-900">{ownerName}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Communications */}
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-gray-500" />
                      <h3 className="text-sm font-semibold text-gray-900">最近のコミュニケーション</h3>
                    </div>
                    <button
                      onClick={() => setMiddleTab("activities")}
                      className="text-xs text-[#ff4800] hover:underline"
                    >
                      すべて表示
                    </button>
                  </div>
                  {recentActivities.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">まだアクティビティはありません</p>
                  ) : (
                    <div className="space-y-3">
                      {recentActivities.map((activity: any) => {
                        const type = activity.type || activity.properties?.hs_activity_type || "NOTE";
                        const config = activityTypeConfig[type] || activityTypeConfig.NOTE;
                        const Icon = config.icon;
                        const subject = activity.subject || activity.properties?.hs_body_preview || config.label;
                        const createdAt = activity.createdAt || "";
                        return (
                          <div key={activity.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                            <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 ${config.color}`}>
                              <Icon className="h-3.5 w-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900 truncate">{subject}</p>
                            </div>
                            <span className="text-xs text-gray-400 flex-shrink-0">{formatDateTime(createdAt)}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Associations summary */}
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="h-4 w-4 text-gray-500" />
                    <h3 className="text-sm font-semibold text-gray-900">関連レコード</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg bg-gray-50 p-3 text-center">
                      <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
                      <p className="text-xs text-gray-500 mt-1">コンタクト</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3 text-center">
                      <p className="text-2xl font-bold text-gray-900">{deals.length}</p>
                      <p className="text-xs text-gray-500 mt-1">取引</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3 text-center">
                      <p className="text-2xl font-bold text-gray-900">{tickets.length}</p>
                      <p className="text-xs text-gray-500 mt-1">チケット</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Activities */}
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <h3 className="text-sm font-semibold text-gray-900">予定されているアクティビティ</h3>
                  </div>
                  {upcomingActivities.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">予定されているアクティビティはありません</p>
                  ) : (
                    <div className="space-y-3">
                      {upcomingActivities.map((activity: any) => {
                        const type = activity.type || activity.properties?.hs_activity_type || "TASK";
                        const config = activityTypeConfig[type] || activityTypeConfig.TASK;
                        const Icon = config.icon;
                        const subject = activity.subject || config.label;
                        const dueDate = activity.dueDate || activity.startDate || "";
                        return (
                          <div key={activity.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                            <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 ${config.color}`}>
                              <Icon className="h-3.5 w-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900 truncate">{subject}</p>
                            </div>
                            <span className="text-xs text-gray-400 flex-shrink-0">{formatDateTime(dueDate)}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Activities Tab */}
          {middleTab === "activities" && (
            <div>
              {/* Activity toolbar: filter, search, collapse/expand */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <select
                    value={activityFilter}
                    onChange={(e) => setActivityFilter(e.target.value)}
                    className="h-9 appearance-none rounded-md border border-gray-200 bg-white pl-3 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2f7579]"
                  >
                    {activityFilterOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <ChevronsUpDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                </div>
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="アクティビティを検索..."
                    value={activitySearch}
                    onChange={(e) => setActivitySearch(e.target.value)}
                    className="h-9 w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2f7579]"
                  />
                </div>
                <button
                  onClick={() => setAllCollapsed(!allCollapsed)}
                  className="text-xs text-gray-500 hover:text-gray-700 whitespace-nowrap"
                >
                  {allCollapsed ? "すべて展開" : "すべて折りたたむ"}
                </button>
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
                              {!allCollapsed && body && (
                                <p className="mt-1 text-sm text-gray-600">
                                  {body}
                                </p>
                              )}
                              <div className="mt-2 flex items-center gap-2">
                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-[9px] text-gray-600">
                                  {userName.charAt(0)}
                                </div>
                                <p className="text-xs text-gray-400">
                                  {userName}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}

                {activityFilter === "NOTE" && notes.length > 0 && filteredActivities.length === 0 && (
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
                            {!allCollapsed && (
                              <p className="mt-1 text-sm text-gray-600">
                                {note.body}
                              </p>
                            )}
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
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-72 flex-shrink-0 overflow-y-auto border-l border-gray-200 bg-white p-4">
          {/* Contacts */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                関連コンタクト
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
                関連取引
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
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                関連チケット
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

          {/* Attachments */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                添付ファイル
              </h2>
              <button className="text-xs text-[#ff4800] hover:underline flex items-center gap-1">
                <Plus className="h-3 w-3" />
                追加
              </button>
            </div>
            <div className="flex items-center gap-2 py-4 text-center">
              <Paperclip className="h-4 w-4 text-gray-300 mx-auto" />
            </div>
            <p className="text-xs text-gray-400 text-center">添付ファイルはありません</p>
          </div>
        </div>
      </div>
    </div>
  );
}
