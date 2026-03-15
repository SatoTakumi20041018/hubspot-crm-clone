"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import {
  Plus,
  FileText,
  Eye,
  ArrowUpDown,
  MoreHorizontal,
  MousePointerClick,
  Clock,
  BarChart3,
  Download,
} from "lucide-react";

interface Form {
  id: string;
  name: string;
  type: "埋め込み" | "ポップアップ" | "バナー" | "スタンドアロン";
  submissions: number;
  views: number;
  conversionRate: number;
  lastSubmission: string;
  status: "公開中" | "下書き" | "非公開";
  createdAt: string;
}

const forms: Form[] = [
  {
    id: "f1",
    name: "お問い合わせフォーム",
    type: "埋め込み",
    submissions: 342,
    views: 5680,
    conversionRate: 6.02,
    lastSubmission: "2026-03-14",
    status: "公開中",
    createdAt: "2025-06-15",
  },
  {
    id: "f2",
    name: "資料ダウンロードフォーム",
    type: "ポップアップ",
    submissions: 189,
    views: 3240,
    conversionRate: 5.83,
    lastSubmission: "2026-03-14",
    status: "公開中",
    createdAt: "2025-08-01",
  },
  {
    id: "f3",
    name: "セミナー申込フォーム",
    type: "スタンドアロン",
    submissions: 87,
    views: 1560,
    conversionRate: 5.58,
    lastSubmission: "2026-03-13",
    status: "公開中",
    createdAt: "2026-01-10",
  },
  {
    id: "f4",
    name: "無料トライアル申込",
    type: "埋め込み",
    submissions: 156,
    views: 4200,
    conversionRate: 3.71,
    lastSubmission: "2026-03-14",
    status: "公開中",
    createdAt: "2025-09-01",
  },
  {
    id: "f5",
    name: "ニュースレター登録",
    type: "バナー",
    submissions: 534,
    views: 12400,
    conversionRate: 4.31,
    lastSubmission: "2026-03-14",
    status: "公開中",
    createdAt: "2025-07-01",
  },
  {
    id: "f6",
    name: "カスタマーフィードバック",
    type: "埋め込み",
    submissions: 67,
    views: 890,
    conversionRate: 7.53,
    lastSubmission: "2026-03-12",
    status: "公開中",
    createdAt: "2026-02-01",
  },
  {
    id: "f7",
    name: "パートナー申請フォーム",
    type: "スタンドアロン",
    submissions: 23,
    views: 456,
    conversionRate: 5.04,
    lastSubmission: "2026-03-10",
    status: "公開中",
    createdAt: "2026-01-20",
  },
  {
    id: "f8",
    name: "キャンペーン応募（4月）",
    type: "ポップアップ",
    submissions: 0,
    views: 0,
    conversionRate: 0,
    lastSubmission: "-",
    status: "下書き",
    createdAt: "2026-03-12",
  },
  {
    id: "f9",
    name: "採用エントリーフォーム",
    type: "スタンドアロン",
    submissions: 45,
    views: 1200,
    conversionRate: 3.75,
    lastSubmission: "2026-03-11",
    status: "公開中",
    createdAt: "2025-11-01",
  },
];

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case "公開中": return "success" as const;
    case "下書き": return "default" as const;
    case "非公開": return "warning" as const;
    default: return "default" as const;
  }
};

const typeBadgeVariant = (type: string) => {
  switch (type) {
    case "埋め込み": return "info" as const;
    case "ポップアップ": return "purple" as const;
    case "バナー": return "warning" as const;
    case "スタンドアロン": return "default" as const;
    default: return "default" as const;
  }
};


function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button onClick={(e) => { e.stopPropagation(); setOpen(!open); }} className="p-1 rounded hover:bg-gray-100">
        <MoreHorizontal className="h-4 w-4 text-gray-400" />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-10 w-40 rounded-lg border bg-white py-1 shadow-lg">
          <button onClick={() => { onEdit(); setOpen(false); }} className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50">編集</button>
          <button onClick={() => { onEdit(); setOpen(false); }} className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50">複製</button>
          <button onClick={() => { onDelete(); setOpen(false); }} className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">削除</button>
        </div>
      )}
    </div>
  );
}

export default function FormsPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);

  const [search, setSearch] = useState("");
  const [activeView, setActiveView] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const views = [
    { key: "all", label: "すべてのフォーム" },
    { key: "mine", label: "マイフォーム" },
  ];

  const toggleAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((f) => f.id)));
    }
  };

  const toggle = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const filtered = forms.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    if (!sortField) return 0;
    const aVal = String((a as unknown as Record<string,unknown>)[sortField] ?? "");
    const bVal = String((b as unknown as Record<string,unknown>)[sortField] ?? "");
    return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalSubmissions = forms.reduce((s, f) => s + f.submissions, 0);
  const totalViews = forms.reduce((s, f) => s + f.views, 0);


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
        title="フォーム"
        description="リードキャプチャフォームの管理"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => alert("エクスポート機能は準備中です")}>
              <Download className="h-4 w-4 mr-1" />
              エクスポート
            </Button>
            <Button size="sm" onClick={() => alert("フォーム作成は準備中です")}>
            <Plus className="h-4 w-4 mr-1" />

      <p className="text-sm text-gray-500">{forms.length}件のフォーム</p>

            フォーム作成
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

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalSubmissions.toLocaleString()}</p>
                <p className="text-xs text-gray-500">総送信数</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <Eye className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
                <p className="text-xs text-gray-500">総表示数</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {totalViews > 0 ? ((totalSubmissions / totalViews) * 100).toFixed(1) : 0}%
                </p>
                <p className="text-xs text-gray-500">平均CVR</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="w-72">
        <Input
          variant="search"
          placeholder="フォーム名で検索..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
        />
      </div>

      {/* Forms Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="w-10 px-3"><input type="checkbox" className="rounded border-gray-300" onChange={toggleAll} checked={filtered.length > 0 && selectedIds.size === filtered.length} /></th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("name")}>
                  <div className="flex items-center gap-1">
                    フォーム名
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("type")}>
                  <div className="flex items-center gap-1">タイプ <ArrowUpDown className="h-3 w-3" /></div>
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("status")}>
                  <div className="flex items-center gap-1">ステータス <ArrowUpDown className="h-3 w-3" /></div>
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("submissions")}>
                  <div className="flex items-center justify-end gap-1">
                    送信数
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("views")}>
                  <div className="flex items-center justify-end gap-1">表示数 <ArrowUpDown className="h-3 w-3" /></div>
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("conversionRate")}>
                  <div className="flex items-center justify-end gap-1">CVR <ArrowUpDown className="h-3 w-3" /></div>
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("lastSubmission")}>
                  <div className="flex items-center gap-1">最終送信 <ArrowUpDown className="h-3 w-3" /></div>
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("createdAt")}>
                  <div className="flex items-center gap-1">作成日 <ArrowUpDown className="h-3 w-3" /></div>
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((form) => (
                <tr key={form.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="w-10 px-3"><input type="checkbox" className="rounded border-gray-300" checked={selectedIds.has(form.id)} onChange={() => toggle(form.id)} onClick={(e) => e.stopPropagation()} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-orange-500 flex-shrink-0" />
                      <span className="font-medium text-gray-900">
                        {form.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={typeBadgeVariant(form.type)}>{form.type}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusBadgeVariant(form.status)}>{form.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    {form.submissions > 0 ? form.submissions.toLocaleString() : "-"}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {form.views > 0 ? form.views.toLocaleString() : "-"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {form.conversionRate > 0 ? (
                      <div className="flex items-center justify-end gap-1">
                        <MousePointerClick className="h-3 w-3 text-gray-400" />
                        <span className="font-medium text-gray-900">{form.conversionRate}%</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {form.lastSubmission}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{form.createdAt}</td>
                  <td className="px-4 py-3">
                    <RowActions onEdit={() => alert("編集は準備中です")} onDelete={() => alert("削除は準備中です")} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 mt-2">
                <p className="text-sm text-gray-500">{filtered.length}件中 {(currentPage-1)*itemsPerPage+1}〜{Math.min(currentPage*itemsPerPage, filtered.length)}件</p>
                <div className="flex gap-1">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage===1} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">前へ</button>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage===totalPages} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">次へ</button>
                </div>
              </div>
            )}
      </Card>

      {filtered.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-gray-300" />
          </div>
          <h3 className="text-base font-medium text-gray-900 mb-1">データがありません</h3>
          <p className="text-sm text-gray-500">新しいフォームを作成して始めましょう</p>
        </div>
      )}
    </div>
  );
}
