"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import {
  Plus,
  MessageSquare,
  ThumbsUp,
  TrendingUp,
  BarChart3,
  Users,
  ArrowUpRight,
  Clock,
  MoreHorizontal,
  ArrowUpDown,
  Search,
  Download,
} from "lucide-react";

interface Survey {
  id: string;
  name: string;
  type: "NPS" | "CSAT" | "CES";
  responses: number;
  score: number;
  status: "有効" | "停止中" | "下書き";
  createdAt: string;
  lastResponse: string;
}

const surveys: Survey[] = [
  {
    id: "s1",
    name: "全体顧客満足度調査（Q1 2026）",
    type: "CSAT",
    responses: 342,
    score: 92.3,
    status: "有効",
    createdAt: "2026-01-01",
    lastResponse: "2026-03-14",
  },
  {
    id: "s2",
    name: "NPS 定期調査",
    type: "NPS",
    responses: 256,
    score: 48,
    status: "有効",
    createdAt: "2026-01-15",
    lastResponse: "2026-03-13",
  },
  {
    id: "s3",
    name: "サポート後満足度",
    type: "CSAT",
    responses: 189,
    score: 88.5,
    status: "有効",
    createdAt: "2025-12-01",
    lastResponse: "2026-03-14",
  },
  {
    id: "s4",
    name: "オンボーディング体験調査",
    type: "CES",
    responses: 67,
    score: 4.2,
    status: "有効",
    createdAt: "2026-02-01",
    lastResponse: "2026-03-12",
  },
  {
    id: "s5",
    name: "製品フィードバック調査",
    type: "CSAT",
    responses: 123,
    score: 85.2,
    status: "停止中",
    createdAt: "2025-10-01",
    lastResponse: "2026-01-15",
  },
  {
    id: "s6",
    name: "Q2 NPS 準備中",
    type: "NPS",
    responses: 0,
    score: 0,
    status: "下書き",
    createdAt: "2026-03-10",
    lastResponse: "-",
  },
];

const npsBreakdown = {
  promoters: 58,
  passives: 32,
  detractors: 10,
};

const csatTrend = [
  { month: "10月", score: 86 },
  { month: "11月", score: 88 },
  { month: "12月", score: 85 },
  { month: "1月", score: 90 },
  { month: "2月", score: 91 },
  { month: "3月", score: 92 },
];
const maxCsat = 100;

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case "有効": return "success" as const;
    case "停止中": return "default" as const;
    case "下書き": return "warning" as const;
    default: return "default" as const;
  }
};

const typeBadgeVariant = (type: string) => {
  switch (type) {
    case "NPS": return "purple" as const;
    case "CSAT": return "info" as const;
    case "CES": return "warning" as const;
    default: return "default" as const;
  }
};

export default function FeedbackPage() {
  const router = useRouter();
  const [activeView, setActiveView] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };
  const sortedSurveys = [...surveys].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = String((a as unknown as Record<string,unknown>)[sortField] ?? "");
    const bVal = String((b as unknown as Record<string,unknown>)[sortField] ?? "");
    return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const filteredSurveys = sortedSurveys.filter(item => {
    if (searchQuery && !JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });
  const totalPages = Math.ceil(filteredSurveys.length / itemsPerPage);
  const paginatedItems = filteredSurveys.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleAll = () => {
    if (selectedIds.size === filteredSurveys.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filteredSurveys.map((s) => s.id)));
  };
  const toggle = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const views = [
    { key: "all", label: "すべて" },
    { key: "nps", label: "NPS" },
    { key: "csat", label: "CSAT" },
  ];
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);


  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-gray-100 rounded-lg animate-pulse mt-4" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="フィードバック"
        description="顧客満足度調査とフィードバックの管理"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => alert("エクスポート機能は準備中です")}>
              <Download className="h-4 w-4 mr-1" />
              エクスポート
            </Button>
            <Button size="sm" onClick={() => alert("アンケート作成は準備中です")}>
            <Plus className="h-4 w-4 mr-1" />

      <p className="text-sm text-gray-500">{surveys.length}件のアンケート</p>

            アンケート作成
          </Button>
          </div>
        }
      />

      <div className="flex items-center gap-1 border-b border-gray-200 px-1 mb-4">
        {views.map((v) => (
          <button key={v.key} onClick={() => setActiveView(v.key)}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeView === v.key ? "border-[#ff4800] text-[#1f1f1f]" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>{v.label}</button>
        ))}
        <button className="ml-1 p-1.5 text-gray-400 hover:text-gray-600 rounded" onClick={() => alert("ビューの追加は準備中です")}><Plus className="h-4 w-4" /></button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex items-center gap-0.5 text-green-600">
                <ArrowUpRight className="h-3 w-3" />
                <span className="text-xs font-medium">+5.2</span>
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900">+48</p>
            <p className="text-xs text-gray-500 mt-0.5">NPS スコア</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50">
                <ThumbsUp className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex items-center gap-0.5 text-green-600">
                <ArrowUpRight className="h-3 w-3" />
                <span className="text-xs font-medium">+3.5%</span>
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900">92.3%</p>
            <p className="text-xs text-gray-500 mt-0.5">CSAT スコア</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900">977</p>
            <p className="text-xs text-gray-500 mt-0.5">総回答数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50">
                <Users className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900">34.2%</p>
            <p className="text-xs text-gray-500 mt-0.5">回答率</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* NPS Gauge */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">NPS 分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-6">
              <div className="relative flex h-32 w-32 items-center justify-center">
                <svg className="h-32 w-32 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="40" fill="none" stroke="#22c55e" strokeWidth="8"
                    strokeDasharray={`${npsBreakdown.promoters * 2.51} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <p className="text-3xl font-bold text-gray-900">+48</p>
                  <p className="text-xs text-gray-500">NPS</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                  <span className="text-xs text-gray-600">推奨者</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{npsBreakdown.promoters}%</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <span className="text-xs text-gray-600">中立者</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{npsBreakdown.passives}%</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="text-xs text-gray-600">批判者</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{npsBreakdown.detractors}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CSAT Trend */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4 text-gray-400" />
              CSAT トレンド
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 h-48">
              {csatTrend.map((m) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-medium text-gray-900">{m.score}%</span>
                  <div className="w-full flex items-end" style={{ height: "160px" }}>
                    <div
                      className="w-full rounded-t bg-green-400 hover:bg-green-500 transition-colors"
                      style={{ height: `${(m.score / maxCsat) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{m.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      
      {/* Empty State */}
      {surveys.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <MessageSquare className="h-8 w-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">データがありません</h3>
          <p className="text-sm text-gray-500 mb-4">新しいアンケートを作成して始めましょう</p>
          <Button size="sm" onClick={() => alert("作成は準備中です")}>
            <Plus className="h-4 w-4 mr-1" /> アンケートを作成
          </Button>
        </div>
      )}

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-[#ff4800]/20 bg-[#FFF1ED] px-4 py-2">
          <span className="text-sm font-medium text-[#ff4800]">{selectedIds.size}件選択中</span>
          <Button variant="outline" size="sm" onClick={() => alert("一括編集は準備中です")}>一括編集</Button>
          <Button variant="outline" size="sm" onClick={() => alert("エクスポートは準備中です")}>エクスポート</Button>
          <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => alert("一括削除は準備中です")}>削除</Button>
          <button className="ml-auto text-sm text-gray-500 hover:text-gray-700" onClick={() => setSelectedIds(new Set())}>選択解除</button>
        </div>
      )}

      {/* Survey List */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>アンケート一覧</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="検索..." className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-[#ff4800]/20 focus:border-[#ff4800]" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="w-10 px-3"><input type="checkbox" className="rounded border-gray-300" onChange={toggleAll} checked={filteredSurveys.length > 0 && selectedIds.size === filteredSurveys.length} /></th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("name")}><div className="flex items-center gap-1">アンケート名 <ArrowUpDown className="h-3 w-3" /></div></th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("type")}><div className="flex items-center gap-1">タイプ <ArrowUpDown className="h-3 w-3" /></div></th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("responses")}><div className="flex items-center justify-end gap-1">回答数 <ArrowUpDown className="h-3 w-3" /></div></th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">スコア</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">ステータス</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">作成日</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.map((survey) => (
                  <tr key={survey.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/feedback/${survey.id}`)}>
                    <td className="w-10 px-3"><input type="checkbox" className="rounded border-gray-300" checked={selectedIds.has(survey.id)} onChange={() => toggle(survey.id)} onClick={(e) => e.stopPropagation()} /></td>
                    <td className="px-6 py-3 font-medium text-gray-900">{survey.name}</td>
                    <td className="px-4 py-3">
                      <Badge variant={typeBadgeVariant(survey.type)}>{survey.type}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {survey.responses > 0 ? survey.responses.toLocaleString() : "-"}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      {survey.score > 0 ? (
                        survey.type === "NPS" ? `+${survey.score}` :
                        survey.type === "CES" ? `${survey.score}/5.0` :
                        `${survey.score}%`
                      ) : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusBadgeVariant(survey.status)}>{survey.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{survey.createdAt}</td>
                    <td className="px-4 py-3">
                      <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600" onClick={() => alert("準備中です")}>
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 mt-2">
                <p className="text-sm text-gray-500">{sortedSurveys.length}件中 {(currentPage-1)*itemsPerPage+1}〜{Math.min(currentPage*itemsPerPage, sortedSurveys.length)}件</p>
                <div className="flex gap-1">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage===1} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">前へ</button>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage===totalPages} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">次へ</button>
                </div>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
