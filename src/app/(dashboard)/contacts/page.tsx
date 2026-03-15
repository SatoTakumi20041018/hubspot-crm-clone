"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Filter,
  Download,
  Upload,
  MoreHorizontal,
  Settings2,
  X,
  Trash2,
  Pencil,
  UserPlus,
} from "lucide-react";

const lifecycleStages = [
  "すべて",
  "サブスクライバー",
  "リード",
  "MQL",
  "SQL",
  "商談中",
  "顧客",
  "エバンジェリスト",
];
const leadStatuses = [
  "すべて",
  "新規",
  "オープン",
  "進行中",
  "未対応",
  "対応済み",
];

const savedViews = ["すべてのコンタクト", "マイコンタクト", "未割り当て"];

interface Contact {
  id: string;
  properties: {
    firstname?: string;
    lastname?: string;
    email?: string;
    phone?: string;
    company?: string;
    lifecyclestage?: string;
    hs_lead_status?: string;
    hubspot_owner_id?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ContactsResponse {
  results: Contact[];
  total?: number;
  paging?: {
    next?: {
      after: string;
    };
  };
}

const stageBadgeVariant = (stage: string) => {
  switch (stage) {
    case "顧客":
    case "エバンジェリスト":
      return "success" as const;
    case "商談中":
    case "SQL":
      return "info" as const;
    case "MQL":
      return "purple" as const;
    case "リード":
      return "warning" as const;
    default:
      return "default" as const;
  }
};

function getContactName(contact: Contact): string {
  const first = contact.properties.firstname || "";
  const last = contact.properties.lastname || "";
  const full = `${last} ${first}`.trim();
  return full || contact.properties.email || "名前なし";
}

function getContactAvatar(contact: Contact): string {
  const last = contact.properties.lastname || "";
  if (last) return last.charAt(0);
  const first = contact.properties.firstname || "";
  if (first) return first.charAt(0);
  return "?";
}

function relativeTime(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "今日";
  if (days === 1) return "昨日";
  if (days < 7) return `${days}日前`;
  if (days < 30) return `${Math.floor(days / 7)}週間前`;
  return `${Math.floor(days / 30)}ヶ月前`;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mt-2" />
        </div>
      </div>
      <Card>
        <div className="p-4">
          <div className="h-9 w-72 bg-gray-200 rounded animate-pulse" />
        </div>
      </Card>
      <Card>
        <div className="p-4 space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function RowActionsMenu({ onEdit, onAssign, onDelete }: { onEdit: () => void; onAssign: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-50 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          <button
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={(e) => { e.stopPropagation(); onEdit(); setOpen(false); }}
          >
            <Pencil className="h-3.5 w-3.5" /> 編集
          </button>
          <button
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={(e) => { e.stopPropagation(); onAssign(); setOpen(false); }}
          >
            <UserPlus className="h-3.5 w-3.5" /> 担当者を割り当て
          </button>
          <button
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            onClick={(e) => { e.stopPropagation(); onDelete(); setOpen(false); }}
          >
            <Trash2 className="h-3.5 w-3.5" /> 削除
          </button>
        </div>
      )}
    </div>
  );
}

export default function ContactsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedStage, setSelectedStage] = useState("すべて");
  const [selectedStatus, setSelectedStatus] = useState("すべて");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [afterCursor, setAfterCursor] = useState<string | undefined>(undefined);
  const [prevCursors, setPrevCursors] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [activeView, setActiveView] = useState(savedViews[0]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [localPage, setLocalPage] = useState(0);
  const itemsPerPage = 20;

  const fetchContacts = useCallback(async (cursor?: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: "50" });
      if (cursor) params.set("after", cursor);
      if (search) params.set("search", search);
      if (selectedStage !== "すべて") params.set("lifecyclestage", selectedStage);
      if (selectedStatus !== "すべて") params.set("hs_lead_status", selectedStatus);

      const res = await fetch(`/api/contacts?${params.toString()}`);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data: ContactsResponse = await res.json();
      setContacts(data.results || []);
      setAfterCursor(data.paging?.next?.after);
      setTotal(data.total ?? data.results?.length ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "データの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, [search, selectedStage, selectedStatus]);

  useEffect(() => {
    setPrevCursors([]);
    setSelectedIds(new Set());
    fetchContacts();
  }, [fetchContacts]);

  const handleNextPage = () => {
    if (afterCursor) {
      setPrevCursors((prev) => [...prev, ""]);
      fetchContacts(afterCursor);
    }
  };

  const handlePrevPage = () => {
    const newPrev = [...prevCursors];
    newPrev.pop();
    setPrevCursors(newPrev);
    fetchContacts();
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === contacts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(contacts.map((c) => c.id)));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  if (loading && contacts.length === 0) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">コンタクト</h1>
        </div>
        <Card>
          <div className="p-8 text-center">
            <p className="text-red-600 font-medium mb-2">エラーが発生しました</p>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <Button size="sm" onClick={() => fetchContacts()}>
              再試行
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">コンタクト</h1>
          <p className="text-sm text-gray-500 mt-1">
            {total.toLocaleString()}件のコンタクト
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => alert("カラム編集は準備中です")}>
            <Settings2 className="h-4 w-4 mr-1" />
            列を編集
          </Button>
          <Button variant="outline" size="sm" onClick={() => alert("エクスポート機能は準備中です")}>
            <Download className="h-4 w-4 mr-1" />
            エクスポート
          </Button>
          <Button variant="outline" size="sm" onClick={() => alert("インポート機能は準備中です")}>
            <Upload className="h-4 w-4 mr-1" />
            インポート
          </Button>
          <Button size="sm" onClick={() => alert("コンタクト作成モーダルは準備中です")}>
            <Plus className="h-4 w-4 mr-1" />
            コンタクトを作成
          </Button>
        </div>
      </div>

      {/* Saved View Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200">
        {savedViews.map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeView === view
                ? "border-[#ff4800] text-[#ff4800]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {view}
          </button>
        ))}
        <button
          className="px-2 py-2 text-gray-400 hover:text-gray-600 -mb-px border-b-2 border-transparent"
          onClick={() => alert("ビュー追加は準備中です")}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Quick Filters */}
      <Card>
        <div className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-72">
              <Input
                variant="search"
                placeholder="名前、メール、会社名で検索..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:border-[#ff4800] focus:outline-none focus:ring-1 focus:ring-[#ff4800]"
                value={selectedStage}
                onChange={(e) => {
                  setSelectedStage(e.target.value);
                }}
              >
                {lifecycleStages.map((s) => (
                  <option key={s} value={s}>
                    ライフサイクル: {s}
                  </option>
                ))}
              </select>
              <select
                className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:border-[#ff4800] focus:outline-none focus:ring-1 focus:ring-[#ff4800]"
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                }}
              >
                {leadStatuses.map((s) => (
                  <option key={s} value={s}>
                    リードステータス: {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg bg-[#1f1f1f] px-4 py-2.5 text-white">
          <span className="text-sm font-medium">{selectedIds.size}件を選択中</span>
          <div className="h-4 w-px bg-gray-600" />
          <button className="flex items-center gap-1.5 rounded px-2.5 py-1 text-sm hover:bg-white/10 transition-colors" onClick={() => alert("一括編集は準備中です")}>
            <Pencil className="h-3.5 w-3.5" /> 編集
          </button>
          <button className="flex items-center gap-1.5 rounded px-2.5 py-1 text-sm hover:bg-white/10 transition-colors" onClick={() => alert("担当者割り当ては準備中です")}>
            <UserPlus className="h-3.5 w-3.5" /> 担当者を割り当て
          </button>
          <button className="flex items-center gap-1.5 rounded px-2.5 py-1 text-sm hover:bg-white/10 transition-colors" onClick={() => alert("エクスポートは準備中です")}>
            <Download className="h-3.5 w-3.5" /> エクスポート
          </button>
          <button className="flex items-center gap-1.5 rounded px-2.5 py-1 text-sm text-red-400 hover:bg-white/10 transition-colors" onClick={() => alert("一括削除は準備中です")}>
            <Trash2 className="h-3.5 w-3.5" /> 削除
          </button>
          <div className="flex-1" />
          <button className="rounded p-1 hover:bg-white/10 transition-colors" onClick={() => setSelectedIds(new Set())}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-medium text-gray-500 w-10">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={contacts.length > 0 && selectedIds.size === contacts.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  <button className="flex items-center gap-1 hover:text-gray-700" onClick={() => handleSort("name")}>
                    名前
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  メール
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  会社
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  電話番号
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  ライフサイクル
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  担当者
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  <button className="flex items-center gap-1 hover:text-gray-700" onClick={() => handleSort("createdAt")}>
                    作成日
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  最終活動
                </th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="px-4 py-3" colSpan={9}>
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-gray-500">
                    コンタクトが見つかりません
                  </td>
                </tr>
              ) : (
                contacts.slice(localPage * itemsPerPage, (localPage + 1) * itemsPerPage).map((contact) => (
                  <tr
                    key={contact.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${selectedIds.has(contact.id) ? "bg-blue-50/50" : ""}`}
                    onClick={() => router.push(`/contacts/${contact.id}`)}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedIds.has(contact.id)}
                        onChange={() => toggleSelect(contact.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/contacts/${contact.id}`}
                        className="flex items-center gap-3 group"
                      >
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#ff4800] text-xs font-medium text-white">
                          {getContactAvatar(contact)}
                        </div>
                        <span className="font-medium text-gray-900 group-hover:text-[#ff4800]">
                          {getContactName(contact)}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {contact.properties.email || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {contact.properties.company || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {contact.properties.phone || "-"}
                    </td>
                    <td className="px-4 py-3">
                      {contact.properties.lifecyclestage ? (
                        <Badge variant={stageBadgeVariant(contact.properties.lifecyclestage)}>
                          {contact.properties.lifecyclestage}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-[#ff4800] flex items-center justify-center text-[10px] font-bold text-white">
                          {contact.properties.hubspot_owner_id ? contact.properties.hubspot_owner_id.charAt(0) : "?"}
                        </div>
                        <span className="text-sm text-gray-600">{contact.properties.hubspot_owner_id || "未割り当て"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {contact.createdAt
                        ? new Date(contact.createdAt).toLocaleDateString("ja-JP")
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {contact.updatedAt ? relativeTime(contact.updatedAt) : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <RowActionsMenu
                        onEdit={() => alert(`編集: ${getContactName(contact)}`)}
                        onAssign={() => alert(`担当者を割り当て: ${getContactName(contact)}`)}
                        onDelete={() => { if (confirm("本当に削除しますか？")) alert("削除しました"); }}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
          <p className="text-sm text-gray-500">
            {contacts.length > 0
              ? `${localPage * itemsPerPage + 1}-${Math.min((localPage + 1) * itemsPerPage, contacts.length)}件 / ${contacts.length}件表示（全${total.toLocaleString()}件）`
              : `${total.toLocaleString()}件のコンタクト`}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={localPage === 0 && prevCursors.length === 0}
              onClick={() => {
                if (localPage > 0) {
                  setLocalPage(localPage - 1);
                } else {
                  handlePrevPage();
                }
              }}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              前へ
            </Button>
            <span className="text-sm text-gray-500">
              {Math.ceil(contacts.length / itemsPerPage) > 0 ? `${localPage + 1} / ${Math.ceil(contacts.length / itemsPerPage)}` : ""}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={(localPage + 1) * itemsPerPage >= contacts.length && !afterCursor}
              onClick={() => {
                if ((localPage + 1) * itemsPerPage < contacts.length) {
                  setLocalPage(localPage + 1);
                } else {
                  handleNextPage();
                  setLocalPage(0);
                }
              }}
            >
              次へ
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
