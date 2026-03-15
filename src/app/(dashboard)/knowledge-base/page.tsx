"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import {
  Plus,
  BookOpen,
  Eye,
  ThumbsUp,
  Clock,
  ArrowUpDown,
  MoreHorizontal,
  FolderOpen,
  Trash2,
  Download,
  Archive,
} from "lucide-react";

interface Article {
  id: string;
  title: string;
  category: string;
  status: "公開中" | "下書き" | "レビュー中";
  views: number;
  helpfulRate: number;
  lastUpdated: string;
  author: string;
}

const categories = [
  { name: "はじめに", count: 8 },
  { name: "アカウント管理", count: 12 },
  { name: "CRM", count: 18 },
  { name: "マーケティング", count: 15 },
  { name: "セールス", count: 10 },
  { name: "サービス", count: 14 },
  { name: "レポート", count: 6 },
  { name: "インテグレーション", count: 9 },
  { name: "トラブルシューティング", count: 20 },
  { name: "API", count: 11 },
];

const articles: Article[] = [
  { id: "kb1", title: "CRM初期設定ガイド", category: "はじめに", status: "公開中", views: 2340, helpfulRate: 92, lastUpdated: "2026-03-10", author: "佐藤 匠" },
  { id: "kb2", title: "コンタクトのインポート方法", category: "CRM", status: "公開中", views: 1856, helpfulRate: 88, lastUpdated: "2026-03-08", author: "田村 愛" },
  { id: "kb3", title: "パイプラインの設定と管理", category: "セールス", status: "公開中", views: 1234, helpfulRate: 95, lastUpdated: "2026-03-05", author: "佐藤 匠" },
  { id: "kb4", title: "メールテンプレートの作成方法", category: "マーケティング", status: "公開中", views: 987, helpfulRate: 90, lastUpdated: "2026-02-28", author: "田村 愛" },
  { id: "kb5", title: "ワークフローの自動化入門", category: "マーケティング", status: "公開中", views: 1567, helpfulRate: 85, lastUpdated: "2026-03-01", author: "佐藤 匠" },
  { id: "kb6", title: "チケットの作成とSLA設定", category: "サービス", status: "公開中", views: 876, helpfulRate: 91, lastUpdated: "2026-02-25", author: "田村 愛" },
  { id: "kb7", title: "カスタムレポートの作成方法", category: "レポート", status: "レビュー中", views: 0, helpfulRate: 0, lastUpdated: "2026-03-12", author: "佐藤 匠" },
  { id: "kb8", title: "APIキーの取得と認証方法", category: "API", status: "公開中", views: 654, helpfulRate: 87, lastUpdated: "2026-02-20", author: "佐藤 匠" },
  { id: "kb9", title: "Slack連携の設定手順", category: "インテグレーション", status: "公開中", views: 1123, helpfulRate: 93, lastUpdated: "2026-03-03", author: "田村 愛" },
  { id: "kb10", title: "ログインできない場合の対処法", category: "トラブルシューティング", status: "公開中", views: 3456, helpfulRate: 78, lastUpdated: "2026-03-11", author: "佐藤 匠" },
  { id: "kb11", title: "二要素認証の設定方法", category: "アカウント管理", status: "下書き", views: 0, helpfulRate: 0, lastUpdated: "2026-03-13", author: "田村 愛" },
  { id: "kb12", title: "データエクスポートのトラブルシューティング", category: "トラブルシューティング", status: "公開中", views: 789, helpfulRate: 82, lastUpdated: "2026-02-18", author: "佐藤 匠" },
];

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case "公開中": return "success" as const;
    case "下書き": return "default" as const;
    case "レビュー中": return "warning" as const;
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

export default function KnowledgeBasePage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);

  const [search, setSearch] = useState("");
  const [activeView, setActiveView] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("すべて");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const views = [
    { key: "all", label: "すべての記事" },
    { key: "published", label: "公開中" },
    { key: "draft", label: "下書き" },
  ];

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const filtered = articles.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === "すべて" || a.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortField) return 0;
    let cmp = 0;
    if (sortField === "title") cmp = a.title.localeCompare(b.title);
    else if (sortField === "category") cmp = a.category.localeCompare(b.category);
    else if (sortField === "views") cmp = a.views - b.views;
    return sortDir === "asc" ? cmp : -cmp;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginatedItems = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };
  const toggleAll = () => {
    if (selectedIds.size === paginatedItems.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(paginatedItems.map(i => i.id)));
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
        title="ナレッジベース"
        description="ヘルプ記事とドキュメントの管理"
        actions={
          <Button size="sm" onClick={() => alert("記事作成は準備中です")}>
            <Plus className="h-4 w-4 mr-1" />
            記事作成
          </Button>
        }
      />

      <div className="flex items-center gap-1 border-b border-gray-200 px-1 mb-4">
        {views.map((v) => (
          <button key={v.key} onClick={() => setActiveView(v.key)}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeView === v.key ? "border-[#ff4800] text-[#1f1f1f]" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>{v.label}</button>
        ))}
        <button className="ml-1 p-1.5 text-gray-400 hover:text-gray-600 rounded"><Plus className="h-4 w-4" /></button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Category Sidebar */}
        <Card className="lg:col-span-1">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">カテゴリ</h3>
            <div className="space-y-1">
              <button
                onClick={() => { setSelectedCategory("すべて"); setCurrentPage(1); }}
                className={`flex items-center justify-between w-full rounded-md px-3 py-2 text-sm transition-colors ${
                  selectedCategory === "すべて" ? "bg-[#FFF1ED] text-[#ff4800] font-medium" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2"><BookOpen className="h-4 w-4" />すべて</div>
                <span className="text-xs">{articles.length}</span>
              </button>
              {categories.map((cat) => (
                <button key={cat.name} onClick={() => { setSelectedCategory(cat.name); setCurrentPage(1); }}
                  className={`flex items-center justify-between w-full rounded-md px-3 py-2 text-sm transition-colors ${
                    selectedCategory === cat.name ? "bg-[#FFF1ED] text-[#ff4800] font-medium" : "text-gray-600 hover:bg-gray-50"
                  }`}>
                  <div className="flex items-center gap-2"><FolderOpen className="h-4 w-4" />{cat.name}</div>
                  <span className="text-xs">{cat.count}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Articles List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="w-full max-w-md">
            <Input variant="search" placeholder="記事を検索..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} />
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left font-medium text-gray-500">
                      <input type="checkbox" className="rounded border-gray-300" checked={paginatedItems.length > 0 && selectedIds.size === paginatedItems.length} onChange={toggleAll} />
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">
                      <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700" onClick={() => handleSort("title")}>タイトル<ArrowUpDown className="h-3 w-3" /></div>
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">
                      <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700" onClick={() => handleSort("category")}>カテゴリ<ArrowUpDown className="h-3 w-3" /></div>
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">ステータス</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">
                      <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-gray-700" onClick={() => handleSort("views")}>閲覧数<ArrowUpDown className="h-3 w-3" /></div>
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">役立ち度</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">最終更新</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map((article) => (
                    <tr key={article.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${selectedIds.has(article.id) ? "bg-blue-50" : ""}`}>
                      <td className="px-4 py-3"><input type="checkbox" className="rounded border-gray-300" checked={selectedIds.has(article.id)} onChange={() => toggleSelect(article.id)} onClick={(e) => e.stopPropagation()} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="font-medium text-gray-900">{article.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><Badge variant="default">{article.category}</Badge></td>
                      <td className="px-4 py-3"><Badge variant={statusBadgeVariant(article.status)}>{article.status}</Badge></td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1 text-gray-600"><Eye className="h-3 w-3" />{article.views > 0 ? article.views.toLocaleString() : "-"}</div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {article.helpfulRate > 0 ? (
                          <div className="flex items-center justify-end gap-1 text-gray-600"><ThumbsUp className="h-3 w-3" />{article.helpfulRate}%</div>
                        ) : (<span className="text-gray-400">-</span>)}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        <div className="flex items-center gap-1"><Clock className="h-3 w-3" />{article.lastUpdated}</div>
                      </td>
                      <td className="px-4 py-3"><RowActions onEdit={() => alert("編集は準備中です")} onDelete={() => alert("削除は準備中です")} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 mt-2">
                <p className="text-sm text-gray-500">{sorted.length}件中 {(currentPage-1)*itemsPerPage+1}〜{Math.min(currentPage*itemsPerPage, sorted.length)}件</p>
                <div className="flex gap-1">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage===1} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">前へ</button>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage===totalPages} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">次へ</button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-lg border bg-white px-5 py-3 shadow-lg">
          <span className="text-sm font-medium text-gray-700">{selectedIds.size}件選択中</span>
          <div className="h-4 w-px bg-gray-200" />
          <Button size="sm" variant="outline" onClick={() => alert("アーカイブは準備中です")}><Archive className="h-4 w-4 mr-1" />アーカイブ</Button>
          <Button size="sm" variant="outline" onClick={() => alert("エクスポートは準備中です")}><Download className="h-4 w-4 mr-1" />エクスポート</Button>
          <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => alert("削除は準備中です")}><Trash2 className="h-4 w-4 mr-1" />削除</Button>
          <button onClick={() => setSelectedIds(new Set())} className="ml-2 text-xs text-gray-500 hover:text-gray-700">選択解除</button>
        </div>
      )}
    </div>
  );
}
