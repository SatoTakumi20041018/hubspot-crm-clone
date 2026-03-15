"use client";

import { useState, useEffect, useRef } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import {
  Search,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Plus,
  ArrowUpDown,
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
  Download,
  X,
} from "lucide-react";

const auditScore = 78;

const recommendations = [
  {
    id: "seo1",
    page: "/products",
    issue: "メタディスクリプションが長すぎる",
    priority: "高",
    status: "未対応",
    impact: "クリック率に影響",
  },
  {
    id: "seo2",
    page: "/blog/crm-guide",
    issue: "H1タグが複数存在する",
    priority: "高",
    status: "未対応",
    impact: "検索順位に影響",
  },
  {
    id: "seo3",
    page: "/pricing",
    issue: "画像のalt属性が未設定（5件）",
    priority: "中",
    status: "対応中",
    impact: "アクセシビリティとSEO",
  },
  {
    id: "seo4",
    page: "/about",
    issue: "ページ読み込み速度が低い（3.2s）",
    priority: "高",
    status: "未対応",
    impact: "ユーザー体験とランキング",
  },
  {
    id: "seo5",
    page: "/blog/marketing-tips",
    issue: "内部リンクが不足",
    priority: "中",
    status: "未対応",
    impact: "クローラビリティ",
  },
  {
    id: "seo6",
    page: "/case-studies",
    issue: "構造化データが未実装",
    priority: "中",
    status: "対応中",
    impact: "リッチスニペット表示",
  },
  {
    id: "seo7",
    page: "/contact",
    issue: "canonicalタグが重複",
    priority: "低",
    status: "対応済み",
    impact: "インデックス重複防止",
  },
  {
    id: "seo8",
    page: "/features",
    issue: "モバイルフレンドリーでない要素あり",
    priority: "高",
    status: "未対応",
    impact: "モバイル検索順位",
  },
];

const topicClusters = [
  {
    pillar: "CRM導入ガイド",
    subtopics: ["CRM選び方", "CRM比較", "CRM導入手順", "CRM活用事例"],
    authority: 82,
    ranking: 3,
    traffic: 12400,
  },
  {
    pillar: "マーケティングオートメーション",
    subtopics: ["MA入門", "MA比較", "リードスコアリング", "メール自動化"],
    authority: 75,
    ranking: 5,
    traffic: 8900,
  },
  {
    pillar: "営業効率化",
    subtopics: ["営業DX", "SFA活用", "商談管理", "売上予測"],
    authority: 68,
    ranking: 8,
    traffic: 6500,
  },
  {
    pillar: "カスタマーサクセス",
    subtopics: ["CS入門", "NPS改善", "チャーン防止", "オンボーディング"],
    authority: 71,
    ranking: 6,
    traffic: 5200,
  },
];

const organicMetrics = [
  { label: "オーガニック流入", value: "34,560", change: 15.2 },
  { label: "平均順位", value: "12.4", change: -2.8 },
  { label: "インデックスページ", value: "1,245", change: 8.5 },
  { label: "バックリンク数", value: "2,890", change: 12.1 },
];

const priorityBadgeVariant = (priority: string) => {
  switch (priority) {
    case "高": return "danger" as const;
    case "中": return "warning" as const;
    case "低": return "default" as const;
    default: return "default" as const;
  }
};

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case "対応済み": return "success" as const;
    case "対応中": return "info" as const;
    case "未対応": return "default" as const;
    default: return "default" as const;
  }
};

function RowActions() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
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
        <div className="absolute right-0 top-8 z-50 w-44 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={(e) => { e.stopPropagation(); alert("編集"); setOpen(false); }}>
            <Pencil className="h-3.5 w-3.5" /> 編集
          </button>
          <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={(e) => { e.stopPropagation(); alert("複製"); setOpen(false); }}>
            <Copy className="h-3.5 w-3.5" /> 複製
          </button>
          <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); alert("削除"); setOpen(false); }}>
            <Trash2 className="h-3.5 w-3.5" /> 削除
          </button>
        </div>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mt-2" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
      <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
    </div>
  );
}

export default function SeoPage() {
  const [activeView, setActiveView] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };
  const sortedRecs = [...recommendations].filter(item => {
    if (searchQuery && !JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (!sortField) return 0;
    const aVal = String((a as unknown as Record<string,unknown>)[sortField] ?? "");
    const bVal = String((b as unknown as Record<string,unknown>)[sortField] ?? "");
    return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedRecs.length / itemsPerPage);
  const paginatedItems = sortedRecs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const views = [
    { key: "all", label: "すべて" },
    { key: "action", label: "対応必要" },
    { key: "done", label: "完了" },
  ];

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedItems.map((r) => r.id)));
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

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="SEO ツール"
        description="サイトのSEOパフォーマンスを分析・最適化"
      />

      <p className="text-sm text-gray-500">{recommendations.length}件の推奨事項</p>


      <div className="flex items-center gap-1 border-b border-gray-200 px-1 mb-4">
        {views.map((v) => (
          <button key={v.key} onClick={() => setActiveView(v.key)}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeView === v.key ? "border-[#ff4800] text-[#1f1f1f]" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>{v.label}</button>
        ))}
        <button className="ml-1 p-1.5 text-gray-400 hover:text-gray-600 rounded" onClick={() => alert("ビューの追加は準備中です")}><Plus className="h-4 w-4" /></button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {organicMetrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50">
                  <Search className="h-5 w-5 text-green-600" />
                </div>
                <div className={`flex items-center gap-0.5 ${metric.change > 0 ? "text-green-600" : "text-red-600"}`}>
                  {metric.change > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  <span className="text-xs font-medium">{Math.abs(metric.change)}%</span>
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900">{metric.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{metric.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Site Audit Score */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">サイト監査スコア</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-4">
              <div className="relative flex h-32 w-32 items-center justify-center">
                <svg className="h-32 w-32 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke={auditScore >= 80 ? "#22c55e" : auditScore >= 60 ? "#eab308" : "#ef4444"}
                    strokeWidth="8"
                    strokeDasharray={`${auditScore * 2.51} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <p className="text-3xl font-bold text-gray-900">{auditScore}</p>
                  <p className="text-xs text-gray-500">/100</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded bg-red-50 p-2">
                <p className="font-bold text-red-600">4</p>
                <p className="text-gray-500">エラー</p>
              </div>
              <div className="rounded bg-yellow-50 p-2">
                <p className="font-bold text-yellow-600">8</p>
                <p className="text-gray-500">警告</p>
              </div>
              <div className="rounded bg-green-50 p-2">
                <p className="font-bold text-green-600">52</p>
                <p className="text-gray-500">合格</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Topic Clusters */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="h-4 w-4 text-gray-400" />
              トピッククラスター
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topicClusters.map((cluster) => (
                <div key={cluster.pillar} className="rounded-lg border border-gray-100 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{cluster.pillar}</h4>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-gray-500">順位: <span className="font-medium text-gray-900">#{cluster.ranking}</span></span>
                      <span className="text-gray-500">流入: <span className="font-medium text-gray-900">{cluster.traffic.toLocaleString()}</span></span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {cluster.subtopics.map((topic) => (
                      <span key={topic} className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                        {topic}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">権威性:</span>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div
                        className={`h-2 rounded-full ${cluster.authority >= 80 ? "bg-green-400" : cluster.authority >= 60 ? "bg-yellow-400" : "bg-red-400"}`}
                        style={{ width: `${cluster.authority}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-900">{cluster.authority}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg bg-[#1f1f1f] px-4 py-2.5 text-white">
          <span className="text-sm font-medium">{selectedIds.size}件を選択中</span>
          <div className="h-4 w-px bg-gray-600" />
          <button className="flex items-center gap-1.5 rounded px-2.5 py-1 text-sm hover:bg-white/10 transition-colors" onClick={() => alert("一括対応は準備中です")}>
            <Pencil className="h-3.5 w-3.5" /> 対応開始
          </button>
          <button className="flex items-center gap-1.5 rounded px-2.5 py-1 text-sm hover:bg-white/10 transition-colors" onClick={() => alert("エクスポートは準備中です")}>
            <Download className="h-3.5 w-3.5" /> エクスポート
          </button>
          <button className="flex items-center gap-1.5 rounded px-2.5 py-1 text-sm text-red-400 hover:bg-white/10 transition-colors" onClick={() => alert("一括無視は準備中です")}>
            <Trash2 className="h-3.5 w-3.5" /> 無視
          </button>
          <div className="flex-1" />
          <button className="rounded p-1 hover:bg-white/10 transition-colors" onClick={() => setSelectedIds(new Set())}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Recommendations */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>改善推奨事項</CardTitle>
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
                  <th className="px-4 py-3 text-left font-medium text-gray-500 w-10">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={paginatedItems.length > 0 && selectedIds.size === paginatedItems.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("page")}><div className="flex items-center gap-1">ページ <ArrowUpDown className="h-3 w-3" /></div></th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("issue")}><div className="flex items-center gap-1">問題 <ArrowUpDown className="h-3 w-3" /></div></th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("priority")}><div className="flex items-center gap-1">優先度 <ArrowUpDown className="h-3 w-3" /></div></th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">ステータス</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">影響</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.map((rec) => (
                  <tr key={rec.id} className={`border-b border-gray-100 hover:bg-gray-50 ${selectedIds.has(rec.id) ? "bg-blue-50/50" : ""}`}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedIds.has(rec.id)}
                        onChange={() => toggleSelect(rec.id)}
                      />
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-1 text-gray-900 font-mono text-xs">
                        <ExternalLink className="h-3 w-3 text-gray-400" />
                        {rec.page}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {rec.priority === "高" ? (
                          <AlertTriangle className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5 text-yellow-500 flex-shrink-0" />
                        )}
                        <span className="text-gray-900">{rec.issue}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={priorityBadgeVariant(rec.priority)}>{rec.priority}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusBadgeVariant(rec.status)}>{rec.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{rec.impact}</td>
                    <td className="px-4 py-3"><RowActions /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 mt-2">
                <p className="text-sm text-gray-500">{sortedRecs.length}件中 {(currentPage-1)*itemsPerPage+1}〜{Math.min(currentPage*itemsPerPage, sortedRecs.length)}件</p>
                <div className="flex gap-1">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage===1} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">前へ</button>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage===totalPages} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">次へ</button>
                </div>
              </div>
            )}
        </CardContent>
      </Card>

      {recommendations.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-gray-300" />
          </div>
          <h3 className="text-base font-medium text-gray-900 mb-1">データがありません</h3>
          <p className="text-sm text-gray-500">新しいSEO推奨事項を作成して始めましょう</p>
        </div>
      )}
    </div>
  );
}
