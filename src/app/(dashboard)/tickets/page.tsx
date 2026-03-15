"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertCircle,
} from "lucide-react";

const statuses = ["すべて", "新規", "対応中", "待機中", "解決済み", "クローズ"];
const priorities = ["すべて", "緊急", "高", "中", "低"];

interface Ticket {
  id: string;
  properties: {
    subject?: string;
    content?: string;
    hs_ticket_priority?: string;
    hs_pipeline_stage?: string;
    hs_pipeline?: string;
    hubspot_owner_id?: string;
    hs_ticket_category?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface TicketsResponse {
  results: Ticket[];
  total?: number;
  paging?: {
    next?: {
      after: string;
    };
  };
}

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case "新規":
      return "info" as const;
    case "対応中":
      return "warning" as const;
    case "待機中":
      return "default" as const;
    case "解決済み":
      return "success" as const;
    case "クローズ":
      return "default" as const;
    default:
      return "default" as const;
  }
};

const priorityBadgeVariant = (priority: string) => {
  switch (priority) {
    case "緊急":
    case "URGENT":
      return "danger" as const;
    case "高":
    case "HIGH":
      return "danger" as const;
    case "中":
    case "MEDIUM":
      return "warning" as const;
    case "低":
    case "LOW":
      return "default" as const;
    default:
      return "default" as const;
  }
};

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-28 bg-gray-200 rounded animate-pulse mt-2" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <div className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse" />
              <div>
                <div className="h-6 w-12 bg-gray-200 rounded animate-pulse mb-1" />
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Card>
        <div className="p-4 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function TicketsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("すべて");
  const [selectedPriority, setSelectedPriority] = useState("すべて");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [afterCursor, setAfterCursor] = useState<string | undefined>(undefined);
  const [prevCursors, setPrevCursors] = useState<string[]>([]);
  const [total, setTotal] = useState(0);

  const fetchTickets = useCallback(async (cursor?: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: "50" });
      if (cursor) params.set("after", cursor);
      if (search) params.set("search", search);
      if (selectedStatus !== "すべて") params.set("status", selectedStatus);
      if (selectedPriority !== "すべて") params.set("priority", selectedPriority);

      const res = await fetch(`/api/tickets?${params.toString()}`);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data: TicketsResponse = await res.json();
      setTickets(data.results || []);
      setAfterCursor(data.paging?.next?.after);
      setTotal(data.total ?? data.results?.length ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "データの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, [search, selectedStatus, selectedPriority]);

  useEffect(() => {
    setPrevCursors([]);
    fetchTickets();
  }, [fetchTickets]);

  const handleNextPage = () => {
    if (afterCursor) {
      setPrevCursors((prev) => [...prev, ""]);
      fetchTickets(afterCursor);
    }
  };

  const handlePrevPage = () => {
    const newPrev = [...prevCursors];
    newPrev.pop();
    setPrevCursors(newPrev);
    fetchTickets();
  };

  // Stats computed from current data
  const openCount = tickets.filter(
    (t) => {
      const stage = t.properties.hs_pipeline_stage || "";
      return stage === "新規" || stage === "対応中" || !["解決済み", "クローズ"].includes(stage);
    }
  ).length;
  const urgentCount = tickets.filter(
    (t) => (t.properties.hs_ticket_priority || "").toUpperCase() === "URGENT" ||
           t.properties.hs_ticket_priority === "緊急"
  ).length;

  if (loading && tickets.length === 0) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">チケット</h1>
        </div>
        <Card>
          <div className="p-8 text-center">
            <p className="text-red-600 font-medium mb-2">エラーが発生しました</p>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <Button size="sm" onClick={() => fetchTickets()}>
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
          <h1 className="text-2xl font-bold text-gray-900">チケット</h1>
          <p className="text-sm text-gray-500 mt-1">
            {total}件のチケット
          </p>
        </div>
        <Button size="sm" onClick={() => alert("チケット作成モーダルは準備中です")}>
          <Plus className="h-4 w-4 mr-1" />
          チケットを作成
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <div className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
              <AlertCircle className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{openCount}</p>
              <p className="text-xs text-gray-500">未解決チケット</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{urgentCount}</p>
              <p className="text-xs text-gray-500">緊急チケット</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">-</p>
              <p className="text-xs text-gray-500">平均解決時間</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-72">
              <Input
                variant="search"
                placeholder="件名、コンタクトで検索..."
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
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                }}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    ステータス: {s}
                  </option>
                ))}
              </select>
              <select
                className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:border-[#ff4800] focus:outline-none focus:ring-1 focus:ring-[#ff4800]"
                value={selectedPriority}
                onChange={(e) => {
                  setSelectedPriority(e.target.value);
                }}
              >
                {priorities.map((s) => (
                  <option key={s} value={s}>
                    優先度: {s}
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
                  ID
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                    件名
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  ステータス
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  優先度
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
                    <td className="px-4 py-3" colSpan={8}>
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                    チケットが見つかりません
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/tickets/${ticket.id}`)}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                      {ticket.id.substring(0, 8)}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/tickets/${ticket.id}`}
                        className="font-medium text-gray-900 hover:text-[#ff4800]"
                      >
                        {ticket.properties.subject || "件名なし"}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusBadgeVariant(ticket.properties.hs_pipeline_stage || "")}>
                        {ticket.properties.hs_pipeline_stage || "-"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={priorityBadgeVariant(ticket.properties.hs_ticket_priority || "")}>
                        {ticket.properties.hs_ticket_priority || "-"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {ticket.properties.hubspot_owner_id ? (
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ff4800] text-[10px] text-white">
                            {ticket.properties.hubspot_owner_id.charAt(0)}
                          </div>
                          <span className="text-gray-600">
                            {ticket.properties.hubspot_owner_id}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {ticket.createdAt
                        ? new Date(ticket.createdAt).toLocaleDateString("ja-JP")
                        : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        onClick={(e) => e.stopPropagation()}
                      >
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
            {total}件のチケット
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
