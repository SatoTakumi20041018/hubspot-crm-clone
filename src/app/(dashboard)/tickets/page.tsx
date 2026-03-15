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
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertCircle,
  Upload,
  Download,
  Settings2,
  X,
  Trash2,
  Pencil,
  UserPlus,
  Ticket,
  Eye,
  List,
  LayoutGrid,
  ChevronDown,
  MoreVertical,
} from "lucide-react";

const statuses = ["すべて", "新規", "対応中", "待機中", "解決済み", "クローズ"];
const priorities = ["すべて", "緊急", "高", "中", "低"];

const savedViews = ["すべてのチケット", "マイチケット", "未割り当て"];

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
  const [activeView, setActiveView] = useState(savedViews[0]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [localPage, setLocalPage] = useState(0);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [columnMenuOpen, setColumnMenuOpen] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);
  const columnMenuRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 20;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) setActionsOpen(false);
      if (columnMenuRef.current && !columnMenuRef.current.contains(event.target as Node)) setColumnMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    setSelectedIds(new Set());
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

  const toggleSelectAll = () => {
    if (selectedIds.size === tickets.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(tickets.map((t) => t.id)));
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
            {total.toLocaleString()}件のチケット
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 border rounded-md p-0.5">
            <button className="p-1.5 rounded bg-gray-100 text-gray-700"><List className="h-4 w-4" /></button>
            <button className="p-1.5 rounded text-gray-400 hover:text-gray-600"><LayoutGrid className="h-4 w-4" /></button>
          </div>
          <Button variant="outline" size="sm" onClick={() => alert("カラム編集は準備中です")}>
            <Settings2 className="h-4 w-4 mr-1" />
            列を編集
          </Button>
          <div className="relative" ref={actionsRef}>
            <Button variant="outline" size="sm" onClick={() => setActionsOpen(!actionsOpen)}>
              アクション
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
            {actionsOpen && (
              <div className="absolute right-0 top-9 z-50 w-52 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => { alert("インポート機能は準備中です"); setActionsOpen(false); }}>
                  <Upload className="h-3.5 w-3.5" /> インポート
                </button>
                <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => { alert("エクスポート機能は準備中です"); setActionsOpen(false); }}>
                  <Download className="h-3.5 w-3.5" /> エクスポート
                </button>
                <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => { alert("プロパティ編集は準備中です"); setActionsOpen(false); }}>
                  <Settings2 className="h-3.5 w-3.5" /> プロパティを編集
                </button>
                <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => { alert("レコード復元は準備中です"); setActionsOpen(false); }}>
                  <Trash2 className="h-3.5 w-3.5" /> レコードを復元
                </button>
              </div>
            )}
          </div>
          <Button size="sm" onClick={() => alert("チケット作成モーダルは準備中です")}>
            <Plus className="h-4 w-4 mr-1" />
            チケットを作成
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

      {/* Quick Filter Pills */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-gray-500">クイックフィルター:</span>
        {["ステータス", "優先度", "担当者"].map(f => (
          <button key={f} className="px-2.5 py-1 text-xs rounded-full border border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-50" onClick={() => alert(`${f}フィルターは準備中です`)}>{f} ▾</button>
        ))}
        <button className="px-2 py-1 text-xs text-[#ff4800] hover:underline" onClick={() => alert("フィルター追加は準備中です")}>+ フィルターを追加</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div title="現在未解決（新規・対応中）のチケット数">
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
        </div>
        <div title="優先度が緊急に設定されているチケット数">
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
        </div>
        <div title="チケット作成から解決までの平均所要時間">
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
                    checked={tickets.length > 0 && selectedIds.size === tickets.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  ID
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  <div className="flex items-center gap-1 group">
                    <button className="flex items-center gap-1 hover:text-gray-700" onClick={() => handleSort("subject")}>
                      件名
                      <ArrowUpDown className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                    </button>
                    <div className="relative" ref={columnMenuRef}>
                      <button className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-200" onClick={() => setColumnMenuOpen(!columnMenuOpen)}>
                        <MoreVertical className="h-3 w-3" />
                      </button>
                      {columnMenuOpen && (
                        <div className="absolute left-0 top-6 z-50 w-44 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                          <button className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50" onClick={() => { handleSort("subject"); setColumnMenuOpen(false); }}>昇順でソート</button>
                          <button className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50" onClick={() => { setSortField("subject"); setSortDir("desc"); setColumnMenuOpen(false); }}>降順でソート</button>
                          <div className="border-t border-gray-100 my-1" />
                          <button className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50" onClick={() => { alert("列の固定は準備中です"); setColumnMenuOpen(false); }}>列を固定</button>
                          <button className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50" onClick={() => { alert("列の削除は準備中です"); setColumnMenuOpen(false); }}>列を削除</button>
                        </div>
                      )}
                    </div>
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
                  <button className="flex items-center gap-1 hover:text-gray-700" onClick={() => handleSort("createdAt")}>
                    作成日
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-2 py-3 w-10"></th>
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
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-gray-500">
                    チケットが見つかりません
                  </td>
                </tr>
              ) : (
                tickets.slice(localPage * itemsPerPage, (localPage + 1) * itemsPerPage).map((ticket) => (
                  <tr
                    key={ticket.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group ${selectedIds.has(ticket.id) ? "bg-blue-50/50" : ""}`}
                    onClick={() => router.push(`/tickets/${ticket.id}`)}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedIds.has(ticket.id)}
                        onChange={() => toggleSelect(ticket.id)}
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
                    <td className="px-2 py-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); alert("プレビューは準備中です"); }} className="p-1 rounded hover:bg-gray-100" title="プレビュー">
                        <Eye className="h-4 w-4 text-gray-400" />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <RowActionsMenu
                        onEdit={() => alert(`編集: ${ticket.properties.subject || "件名なし"}`)}
                        onAssign={() => alert(`担当者を割り当て: ${ticket.properties.subject || "件名なし"}`)}
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
            {tickets.length > 0
              ? `${localPage * itemsPerPage + 1}-${Math.min((localPage + 1) * itemsPerPage, tickets.length)} / ${total.toLocaleString()}件`
              : `${total.toLocaleString()}件のチケット`}
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
              {Math.ceil(tickets.length / itemsPerPage) > 0 ? `${localPage + 1} / ${Math.ceil(tickets.length / itemsPerPage)}` : ""}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={(localPage + 1) * itemsPerPage >= tickets.length && !afterCursor}
              onClick={() => {
                if ((localPage + 1) * itemsPerPage < tickets.length) {
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

      {tickets.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Ticket className="h-8 w-8 text-gray-300" />
          </div>
          <h3 className="text-base font-medium text-gray-900 mb-1">データがありません</h3>
          <p className="text-sm text-gray-500">新しいチケットを作成して始めましょう</p>
        </div>
      )}
    </div>
  );
}
