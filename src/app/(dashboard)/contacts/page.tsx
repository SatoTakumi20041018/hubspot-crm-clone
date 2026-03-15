"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
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
  MoreHorizontal,
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

export default function ContactsPage() {
  const [search, setSearch] = useState("");
  const [selectedStage, setSelectedStage] = useState("すべて");
  const [selectedStatus, setSelectedStatus] = useState("すべて");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [afterCursor, setAfterCursor] = useState<string | undefined>(undefined);
  const [prevCursors, setPrevCursors] = useState<string[]>([]);
  const [total, setTotal] = useState(0);

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
    fetchContacts();
  }, [fetchContacts]);

  const handleNextPage = () => {
    if (afterCursor) {
      setPrevCursors((prev) => [...prev, ""]); // store current state marker
      fetchContacts(afterCursor);
    }
  };

  const handlePrevPage = () => {
    const newPrev = [...prevCursors];
    newPrev.pop();
    setPrevCursors(newPrev);
    // Re-fetch from beginning for simplicity (cursor-based pagination doesn't easily go back)
    fetchContacts();
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
            {total}件のコンタクト
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            エクスポート
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            コンタクトを作成
          </Button>
        </div>
      </div>

      {/* Filters */}
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

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                    名前
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
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
                  <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                    作成日
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3"></th>
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
                contacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
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
                    <td className="px-4 py-3 text-gray-600">
                      {contact.properties.hubspot_owner_id || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {contact.createdAt
                        ? new Date(contact.createdAt).toLocaleDateString("ja-JP")
                        : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
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
            {total}件のコンタクト
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={prevCursors.length === 0}
              onClick={handlePrevPage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!afterCursor}
              onClick={handleNextPage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
