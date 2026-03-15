"use client";

import { useState, useEffect, useCallback } from "react";
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
  Building2,
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

export default function DealsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"board" | "table">("board");
  const [deals, setDeals] = useState<Deal[]>([]);
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const dealsByStage = stages.map((stage) => ({
    stage,
    deals: deals.filter((d) => d.properties.dealstage === stage.id),
    total: deals
      .filter((d) => d.properties.dealstage === stage.id)
      .reduce((sum, d) => sum + (Number(d.properties.amount) || 0), 0),
  }));

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

          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            取引を作成
          </Button>
        </div>
      </div>

      {/* Board View */}
      {viewMode === "board" && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {dealsByStage.map((stageGroup, stageIndex) => (
            <div
              key={stageGroup.stage.id}
              className="flex-shrink-0 w-72"
            >
              {/* Column Header */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${getStageColor(stageGroup.stage.id, stageIndex)}`}
                  />
                  <h3 className="text-sm font-semibold text-gray-900">
                    {stageGroup.stage.label}
                  </h3>
                  <span className="text-xs text-gray-400">
                    {stageGroup.deals.length}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  合計: {formatAmount(stageGroup.total)}
                </p>
              </div>

              {/* Deal Cards */}
              <div className="space-y-2">
                {stageGroup.deals.map((deal) => (
                  <Link key={deal.id} href={`/deals/${deal.id}`}>
                    <Card className="cursor-pointer hover:border-gray-300 hover:shadow-md transition-all">
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
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left font-medium text-gray-500">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                      取引名
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">
                    <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-gray-700">
                      金額
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">
                    ステージ
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">
                    担当者
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                      クローズ予定
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">
                    確度
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
                ) : deals.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                      取引が見つかりません
                    </td>
                  </tr>
                ) : (
                  deals.map((deal, i) => (
                    <tr
                      key={deal.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/deals/${deal.id}`)}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
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
        </Card>
      )}
    </div>
  );
}
