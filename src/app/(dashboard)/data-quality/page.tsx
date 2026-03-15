"use client";

import { useState, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import {
  ShieldCheck,
  AlertTriangle,
  Copy,
  FileQuestion,
  Type,
  Users,
  Building2,
  Handshake,
  Zap,
  MoreHorizontal,
  CheckCircle2,
  TrendingUp,
  Plus,
  ArrowUpDown,
  Search,
  Pencil,
  Download,
  Trash2,
  X,
} from "lucide-react";

const overallScore = 82;

interface DataIssue {
  id: string;
  type: "重複" | "欠損" | "フォーマット" | "不整合";
  object: "コンタクト" | "会社" | "取引";
  count: number;
  priority: "高" | "中" | "低";
  description: string;
  autoFixable: boolean;
}

const issues: DataIssue[] = [
  {
    id: "dq1",
    type: "重複",
    object: "コンタクト",
    count: 23,
    priority: "高",
    description: "メールアドレスが重複しているコンタクトレコード",
    autoFixable: true,
  },
  {
    id: "dq2",
    type: "欠損",
    object: "コンタクト",
    count: 156,
    priority: "中",
    description: "電話番号が未入力のコンタクト",
    autoFixable: false,
  },
  {
    id: "dq3",
    type: "フォーマット",
    object: "コンタクト",
    count: 89,
    priority: "中",
    description: "電話番号のフォーマットが統一されていない",
    autoFixable: true,
  },
  {
    id: "dq4",
    type: "重複",
    object: "会社",
    count: 8,
    priority: "高",
    description: "同一の会社名で複数のレコードが存在",
    autoFixable: true,
  },
  {
    id: "dq5",
    type: "欠損",
    object: "取引",
    count: 12,
    priority: "高",
    description: "クローズ予定日が未設定の取引",
    autoFixable: false,
  },
  {
    id: "dq6",
    type: "欠損",
    object: "会社",
    count: 34,
    priority: "低",
    description: "業界・従業員数が未入力の会社",
    autoFixable: false,
  },
  {
    id: "dq7",
    type: "フォーマット",
    object: "コンタクト",
    count: 45,
    priority: "低",
    description: "姓名の全角・半角が混在",
    autoFixable: true,
  },
  {
    id: "dq8",
    type: "不整合",
    object: "取引",
    count: 5,
    priority: "中",
    description: "取引金額が0円のアクティブな取引",
    autoFixable: false,
  },
];

const automationRules = [
  { name: "メール重複検出", status: "有効", lastRun: "2026-03-14", fixed: 12 },
  { name: "電話番号フォーマット統一", status: "有効", lastRun: "2026-03-14", fixed: 34 },
  { name: "姓名全角統一", status: "有効", lastRun: "2026-03-13", fixed: 18 },
  { name: "空白フィールドアラート", status: "有効", lastRun: "2026-03-14", fixed: 0 },
  { name: "会社名重複マージ", status: "停止中", lastRun: "2026-03-10", fixed: 5 },
];

const objectHealth = [
  { object: "コンタクト", icon: Users, total: 2345, issues: 313, score: 87 },
  { object: "会社", icon: Building2, total: 456, issues: 42, score: 91 },
  { object: "取引", icon: Handshake, total: 189, issues: 17, score: 91 },
];

const typeConfig: Record<string, { icon: typeof Copy; color: string; bg: string }> = {
  "重複": { icon: Copy, color: "text-red-600", bg: "bg-red-50" },
  "欠損": { icon: FileQuestion, color: "text-yellow-600", bg: "bg-yellow-50" },
  "フォーマット": { icon: Type, color: "text-blue-600", bg: "bg-blue-50" },
  "不整合": { icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-50" },
};

const priorityBadgeVariant = (priority: string) => {
  switch (priority) {
    case "高": return "danger" as const;
    case "中": return "warning" as const;
    case "低": return "default" as const;
    default: return "default" as const;
  }
};

export default function DataQualityPage() {
  const [activeView, setActiveView] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };
  const sortedIssues = [...issues].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = String((a as unknown as Record<string,unknown>)[sortField] ?? "");
    const bVal = String((b as unknown as Record<string,unknown>)[sortField] ?? "");
    return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  const views = [
    { key: "all", label: "すべて" },
    { key: "action", label: "対応必要" },
  ];
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const filteredIssues = sortedIssues.filter(item => {
    if (searchQuery && !JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });
  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);
  const paginatedItems = filteredIssues.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedItems.map((i) => i.id)));
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
        title="データクオリティ"
        description="CRMデータの品質管理と自動クリーンアップ"
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

      {/* Top Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Overall Score */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-center mb-3">
              <div className="relative flex h-24 w-24 items-center justify-center">
                <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke={overallScore >= 80 ? "#22c55e" : overallScore >= 60 ? "#eab308" : "#ef4444"}
                    strokeWidth="8"
                    strokeDasharray={`${overallScore * 2.51} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <p className="text-2xl font-bold text-gray-900">{overallScore}</p>
                  <p className="text-[10px] text-gray-500">スコア</p>
                </div>
              </div>
            </div>
            <p className="text-center text-sm font-medium text-gray-900">データ品質スコア</p>
            <p className="text-center text-xs text-gray-500 mt-1">前月比 +3ポイント</p>
          </CardContent>
        </Card>

        {/* Object Health */}
        {objectHealth.map((obj) => {
          const Icon = obj.icon;
          return (
            <Card key={obj.object}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                    <Icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{obj.object}</p>
                    <p className="text-xs text-gray-500">{obj.total.toLocaleString()}件</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">品質スコア</span>
                    <span className={`font-medium ${obj.score >= 90 ? "text-green-600" : "text-yellow-600"}`}>
                      {obj.score}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div
                      className={`h-2 rounded-full ${obj.score >= 90 ? "bg-green-400" : "bg-yellow-400"}`}
                      style={{ width: `${obj.score}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">{obj.issues}件の問題</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg bg-[#1f1f1f] px-4 py-2.5 text-white">
          <span className="text-sm font-medium">{selectedIds.size}件を選択中</span>
          <div className="h-4 w-px bg-gray-600" />
          <button className="flex items-center gap-1.5 rounded px-2.5 py-1 text-sm hover:bg-white/10 transition-colors" onClick={() => alert("一括修正は準備中です")}>
            <Zap className="h-3.5 w-3.5" /> 一括修正
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

      {/* Issues List */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>データ品質の問題</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  placeholder="検索..." className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-[#ff4800]/20 focus:border-[#ff4800]" />
              </div>
              <Button variant="outline" size="sm" onClick={() => alert("自動修正を実行は準備中です")}>
                <Zap className="h-4 w-4 mr-1" />
                自動修正を実行
              </Button>
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
                  <th className="px-6 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("type")}><div className="flex items-center gap-1">問題の種類 <ArrowUpDown className="h-3 w-3" /></div></th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("object")}><div className="flex items-center gap-1">オブジェクト <ArrowUpDown className="h-3 w-3" /></div></th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("description")}><div className="flex items-center gap-1">説明 <ArrowUpDown className="h-3 w-3" /></div></th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">件数</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">優先度</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">自動修正</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.map((issue) => {
                  const config = typeConfig[issue.type];
                  const TypeIcon = config.icon;
                  return (
                    <tr key={issue.id} className={`border-b border-gray-100 hover:bg-gray-50 ${selectedIds.has(issue.id) ? "bg-blue-50/50" : ""}`}>
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={selectedIds.has(issue.id)}
                          onChange={() => toggleSelect(issue.id)}
                        />
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`flex h-7 w-7 items-center justify-center rounded ${config.bg}`}>
                            <TypeIcon className={`h-4 w-4 ${config.color}`} />
                          </div>
                          <span className="font-medium text-gray-900">{issue.type}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="default">{issue.object}</Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs max-w-xs">{issue.description}</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">{issue.count}</td>
                      <td className="px-4 py-3">
                        <Badge variant={priorityBadgeVariant(issue.priority)}>{issue.priority}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        {issue.autoFixable ? (
                          <Badge variant="success">
                            <Zap className="h-3 w-3 mr-0.5" />
                            可能
                          </Badge>
                        ) : (
                          <Badge variant="default">手動</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="outline" size="sm" onClick={() => alert(issue.autoFixable ? "修正は準備中です" : "確認は準備中です")}>
                          {issue.autoFixable ? "修正" : "確認"}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 mt-2">
                <p className="text-sm text-gray-500">{sortedIssues.length}件中 {(currentPage-1)*itemsPerPage+1}〜{Math.min(currentPage*itemsPerPage, sortedIssues.length)}件</p>
                <div className="flex gap-1">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage===1} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">前へ</button>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage===totalPages} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">次へ</button>
                </div>
              </div>
            )}
        </CardContent>
      </Card>

      {/* Automation Rules */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            自動化ルール
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {automationRules.map((rule) => (
              <div key={rule.name} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded ${
                    rule.status === "有効" ? "bg-green-50" : "bg-gray-100"
                  }`}>
                    {rule.status === "有効" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{rule.name}</p>
                    <p className="text-xs text-gray-500">
                      最終実行: {rule.lastRun} / 修正件数: {rule.fixed}件
                    </p>
                  </div>
                </div>
                <Badge variant={rule.status === "有効" ? "success" : "default"}>{rule.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {filteredIssues.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <ShieldCheck className="h-8 w-8 text-gray-300" />
          </div>
          <h3 className="text-base font-medium text-gray-900 mb-1">データがありません</h3>
          <p className="text-sm text-gray-500">新しいデータ品質の問題を作成して始めましょう</p>
        </div>
      )}
    </div>
  );
}
