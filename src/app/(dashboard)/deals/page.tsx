"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  LayoutGrid,
  List,
  ArrowUpDown,
  MoreHorizontal,
  Calendar,
  Upload,
  Download,
  Settings2,
  X,
  Trash2,
  Pencil,
  UserPlus,
  ChevronDown,
  ChevronRight as ChevronRightIcon,
  Search,
} from "lucide-react";

interface Deal {
  id: string;
  properties: {
    dealname?: string;
    amount?: string;
    dealstage?: string;
    pipeline?: string;
    closedate?: string;
    hubspot_owner_id?: string;
    hs_deal_stage_probability?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface PipelineStage {
  id: string;
  label: string;
  displayOrder: number;
}

interface Pipeline {
  id: string;
  label: string;
  stages: PipelineStage[];
}

interface DealsResponse {
  results: Deal[];
  total?: number;
  paging?: {
    next?: {
      after: string;
    };
  };
}

interface PipelinesResponse {
  results: Pipeline[];
}

const defaultStageColors: Record<string, string> = {
  "appointmentscheduled": "bg-blue-500",
  "qualifiedtobuy": "bg-cyan-500",
  "presentationscheduled": "bg-yellow-500",
  "decisionmakerboughtin": "bg-orange-500",
  "contractsent": "bg-orange-500",
  "closedwon": "bg-green-500",
  "closedlost": "bg-red-500",
};

const fallbackStageColors = [
  "bg-blue-500",
  "bg-cyan-500",
  "bg-yellow-500",
  "bg-orange-500",
  "bg-green-500",
  "bg-red-500",
  "bg-purple-500",
  "bg-pink-500",
];

const stageBadgeVariantByIndex = (index: number, total: number): "default" | "info" | "warning" | "success" | "danger" | "purple" => {
  if (index === total - 1) return "danger"; // last = lost
  if (index === total - 2) return "success"; // second to last = won
  if (index < total / 2) return "info";
  return "warning";
};

const formatAmount = (amount: number) => {
  return `¥${amount.toLocaleString()}`;
};

const savedViews = ["すべての取引", "マイ取引"];

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mt-2" />
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-72 space-y-3">
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            {Array.from({ length: 3 }).map((_, j) => (
              <Card key={j}>
                <CardContent className="p-3">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
      </div>
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

export default function DealsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"board" | "table">("board");
  const [deals, setDeals] = useState<Deal[]>([]);
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState(savedViews[0]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [collapsedStages, setCollapsedStages] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [localPage, setLocalPage] = useState(0);
  const itemsPerPage = 20;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dealsRes, pipelinesRes] = await Promise.all([
        fetch("/api/deals?limit=50"),
        fetch("/api/pipelines"),
      ]);

      if (!dealsRes.ok) throw new Error(`Deals API error: ${dealsRes.status}`);
      if (!pipelinesRes.ok) throw new Error(`Pipelines API error: ${pipelinesRes.status}`);

      const dealsData: DealsResponse = await dealsRes.json();
      const pipelinesData: PipelinesResponse = await pipelinesRes.json();

      setDeals(dealsData.results || []);
      setPipelines(pipelinesData.results || []);
      if (pipelinesData.results?.length > 0 && !selectedPipelineId) {
        setSelectedPipelineId(pipelinesData.results[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "データの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, [selectedPipelineId]);

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedPipeline = pipelines.find((p) => p.id === selectedPipelineId);
  const stages = selectedPipeline?.stages
    ? [...selectedPipeline.stages].sort((a, b) => a.displayOrder - b.displayOrder)
    : [];

  const filteredDeals = deals.filter(item => {
    if (searchQuery && !JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const dealsByStage = stages.map((stage) => {
    const stageDeals = filteredDeals.filter((d) => d.properties.dealstage === stage.id);
    const stageTotal = stageDeals.reduce((sum, d) => sum + (Number(d.properties.amount) || 0), 0);
    const weightedTotal = stageDeals.reduce((sum, d) => {
      const amount = Number(d.properties.amount) || 0;
      const prob = Number(d.properties.hs_deal_stage_probability) || 0;
      return sum + (amount * prob / 100);
    }, 0);
    return {
      stage,
      deals: stageDeals,
      total: stageTotal,
      weightedTotal,
    };
  });

  const totalAmount = deals.reduce(
    (sum, d) => sum + (Number(d.properties.amount) || 0),
    0
  );

  const getStageName = (stageId: string) => {
    const stage = stages.find((s) => s.id === stageId);
    return stage?.label || stageId;
  };

  const getStageColor = (stageId: string, index: number) => {
    return defaultStageColors[stageId] || fallbackStageColors[index % fallbackStageColors.length];
  };

  const toggleStageCollapse = (stageId: string) => {
    setCollapsedStages((prev) => {
      const next = new Set(prev);
      if (next.has(stageId)) next.delete(stageId);
      else next.add(stageId);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === deals.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(deals.map((d) => d.id)));
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

  if (loading && deals.length === 0) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">取引</h1>
        </div>
        <Card>
          <div className="p-8 text-center">
            <p className="text-red-600 font-medium mb-2">エラーが発生しました</p>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <Button size="sm" onClick={() => fetchData()}>
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
          <h1 className="text-2xl font-bold text-gray-900">取引</h1>
          <p className="text-sm text-gray-500 mt-1">
            {deals.length}件の取引 - 合計 {formatAmount(totalAmount)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="検索..." className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-[#ff4800]/20 focus:border-[#ff4800]" />
          </div>

          {/* Pipeline Selector */}
          <select
            className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:border-[#ff4800] focus:outline-none focus:ring-1 focus:ring-[#ff4800]"
            value={selectedPipelineId}
            onChange={(e) => setSelectedPipelineId(e.target.value)}
          >
            {pipelines.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>

          {/* View Toggle */}
          <div className="flex rounded-md border border-gray-300">
            <button
              onClick={() => setViewMode("board")}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm ${
                viewMode === "board"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              ボード
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm border-l border-gray-300 ${
                viewMode === "table"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <List className="h-4 w-4" />
              テーブル
            </button>
          </div>

          {viewMode === "table" && (
            <Button variant="outline" size="sm" onClick={() => alert("カラム編集は準備中です")}>
              <Settings2 className="h-4 w-4 mr-1" />
              列を編集
            </Button>
          )}

          <Button variant="outline" size="sm" onClick={() => alert("インポート機能は準備中です")}>
            <Upload className="h-4 w-4 mr-1" />
            インポート
          </Button>
          <Button size="sm" onClick={() => alert("取引作成モーダルは準備中です")}>
            <Plus className="h-4 w-4 mr-1" />
            取引を作成
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

      {/* Board View */}
      {viewMode === "board" && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {dealsByStage.map((stageGroup, stageIndex) => {
            const isCollapsed = collapsedStages.has(stageGroup.stage.id);
            return (
              <div
                key={stageGroup.stage.id}
                className="flex-shrink-0 w-72"
              >
                {/* Column Header */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <button
                      className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                      onClick={() => toggleStageCollapse(stageGroup.stage.id)}
                    >
                      {isCollapsed ? (
                        <ChevronRightIcon className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${getStageColor(stageGroup.stage.id, stageIndex)}`}
                    />
                    <h3 className="text-sm font-semibold text-gray-900">
                      {stageGroup.stage.label}
                    </h3>
                    <span className="inline-flex items-center justify-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                      {stageGroup.deals.length}件
                    </span>
                  </div>
                  <div className="flex items-center gap-2 ml-6">
                    <p className="text-xs text-gray-500">
                      合計: {formatAmount(stageGroup.total)}
                    </p>
                    {stageGroup.weightedTotal > 0 && (
                      <p className="text-xs text-gray-400">
                        (加重: {formatAmount(Math.round(stageGroup.weightedTotal))})
                      </p>
                    )}
                  </div>
                </div>

                {/* Deal Cards */}
                {!isCollapsed && (
                  <div className="space-y-2">
                    {stageGroup.deals.map((deal) => (
                      <Link key={deal.id} href={`/deals/${deal.id}`}>
                        <Card className="cursor-grab active:cursor-grabbing hover:border-gray-300 hover:shadow-md transition-all">
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="text-sm font-medium text-gray-900 leading-tight">
                                {deal.properties.dealname || "名前なし"}
                              </h4>
                              <button className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </button>
                            </div>
                            <p className="text-lg font-bold text-gray-900 mb-2">
                              {deal.properties.amount
                                ? formatAmount(Number(deal.properties.amount))
                                : "¥0"}
                            </p>
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <Calendar className="h-3.5 w-3.5" />
                                クローズ:{" "}
                                {deal.properties.closedate
                                  ? new Date(deal.properties.closedate).toLocaleDateString("ja-JP")
                                  : "-"}
                              </div>
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ff4800] text-[10px] text-white">
                                {(deal.properties.hubspot_owner_id || "?").charAt(0)}
                              </div>
                              {deal.properties.hs_deal_stage_probability && (
                                <span className="text-xs text-gray-400">
                                  {deal.properties.hs_deal_stage_probability}%
                                </span>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}

                    {/* Add Deal Button */}
                    <button className="w-full rounded-lg border-2 border-dashed border-gray-200 p-3 text-sm text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-colors">
                      <Plus className="h-4 w-4 mx-auto" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left font-medium text-gray-500 w-10">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={deals.length > 0 && selectedIds.size === deals.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">
                    <button className="flex items-center gap-1 hover:text-gray-700" onClick={() => handleSort("dealname")}>
                      取引名
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">
                    <button className="flex items-center justify-end gap-1 hover:text-gray-700 ml-auto" onClick={() => handleSort("amount")}>
                      金額
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">
                    ステージ
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">
                    担当者
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">
                    <button className="flex items-center gap-1 hover:text-gray-700" onClick={() => handleSort("closedate")}>
                      クローズ予定
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">
                    確度
                  </th>
                  <th className="px-4 py-3 w-10"></th>
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
                ) : filteredDeals.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                      取引が見つかりません
                    </td>
                  </tr>
                ) : (
                  filteredDeals.slice(localPage * itemsPerPage, (localPage + 1) * itemsPerPage).map((deal) => (
                    <tr
                      key={deal.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${selectedIds.has(deal.id) ? "bg-blue-50/50" : ""}`}
                      onClick={() => router.push(`/deals/${deal.id}`)}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={selectedIds.has(deal.id)}
                          onChange={() => toggleSelect(deal.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/deals/${deal.id}`}
                          className="font-medium text-gray-900 hover:text-[#ff4800]"
                        >
                          {deal.properties.dealname || "名前なし"}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        {deal.properties.amount
                          ? formatAmount(Number(deal.properties.amount))
                          : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            deal.properties.dealstage
                              ? stageBadgeVariantByIndex(
                                  stages.findIndex((s) => s.id === deal.properties.dealstage),
                                  stages.length
                                )
                              : "default"
                          }
                        >
                          {deal.properties.dealstage
                            ? getStageName(deal.properties.dealstage)
                            : "-"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ff4800] text-[10px] text-white">
                            {(deal.properties.hubspot_owner_id || "?").charAt(0)}
                          </div>
                          <span className="text-gray-600">
                            {deal.properties.hubspot_owner_id || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {deal.properties.closedate
                          ? new Date(deal.properties.closedate).toLocaleDateString("ja-JP")
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">
                        {deal.properties.hs_deal_stage_probability
                          ? `${deal.properties.hs_deal_stage_probability}%`
                          : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <RowActionsMenu
                          onEdit={() => alert(`編集: ${deal.properties.dealname || "名前なし"}`)}
                          onAssign={() => alert(`担当者を割り当て: ${deal.properties.dealname || "名前なし"}`)}
                          onDelete={() => { if (confirm("本当に削除しますか？")) alert("削除しました"); }}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Table Pagination */}
          {filteredDeals.length > itemsPerPage && (
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
              <p className="text-sm text-gray-500">
                {`${localPage * itemsPerPage + 1}-${Math.min((localPage + 1) * itemsPerPage, filteredDeals.length)}件 / ${filteredDeals.length}件`}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={localPage === 0}
                  onClick={() => setLocalPage(localPage - 1)}
                >
                  <ChevronRightIcon className="h-4 w-4 rotate-180 mr-1" />
                  前へ
                </Button>
                <span className="text-sm text-gray-500">
                  {`${localPage + 1} / ${Math.ceil(filteredDeals.length / itemsPerPage)}`}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={(localPage + 1) * itemsPerPage >= filteredDeals.length}
                  onClick={() => setLocalPage(localPage + 1)}
                >
                  次へ
                  <ChevronRightIcon className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
