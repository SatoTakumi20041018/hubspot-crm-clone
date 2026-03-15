"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import {
  Plus,
  ExternalLink,
  Eye,
  MousePointerClick,
  ArrowUpDown,
  MoreHorizontal,
  BarChart3,
  Trash2,
  Download,
  Archive,
} from "lucide-react";

interface LandingPage {
  id: string;
  title: string;
  url: string;
  status: "公開中" | "下書き" | "非公開";
  views: number;
  conversions: number;
  cvr: number;
  createdAt: string;
  lastUpdated: string;
}

const pages: LandingPage[] = [
  { id: "lp1", title: "製品紹介ページ", url: "/lp/products", status: "公開中", views: 12450, conversions: 461, cvr: 3.7, createdAt: "2025-08-01", lastUpdated: "2026-03-10" },
  { id: "lp2", title: "無料トライアル申込ページ", url: "/lp/free-trial", status: "公開中", views: 8900, conversions: 445, cvr: 5.0, createdAt: "2025-09-15", lastUpdated: "2026-03-05" },
  { id: "lp3", title: "ウェビナー申込ページ", url: "/lp/webinar-march", status: "公開中", views: 3450, conversions: 173, cvr: 5.01, createdAt: "2026-02-20", lastUpdated: "2026-03-01" },
  { id: "lp4", title: "ホワイトペーパーダウンロード", url: "/lp/whitepaper-2026", status: "公開中", views: 5600, conversions: 392, cvr: 7.0, createdAt: "2026-01-10", lastUpdated: "2026-02-25" },
  { id: "lp5", title: "導入事例集ダウンロード", url: "/lp/case-studies", status: "公開中", views: 4200, conversions: 252, cvr: 6.0, createdAt: "2025-11-01", lastUpdated: "2026-03-08" },
  { id: "lp6", title: "春のキャンペーンLP", url: "/lp/spring-campaign", status: "下書き", views: 0, conversions: 0, cvr: 0, createdAt: "2026-03-12", lastUpdated: "2026-03-14" },
  { id: "lp7", title: "料金プラン比較ページ", url: "/lp/pricing", status: "公開中", views: 15600, conversions: 468, cvr: 3.0, createdAt: "2025-07-01", lastUpdated: "2026-02-15" },
  { id: "lp8", title: "パートナー募集ページ", url: "/lp/partner", status: "公開中", views: 2100, conversions: 63, cvr: 3.0, createdAt: "2026-01-20", lastUpdated: "2026-02-20" },
  { id: "lp9", title: "年末キャンペーンLP（2025）", url: "/lp/year-end-2025", status: "非公開", views: 8400, conversions: 504, cvr: 6.0, createdAt: "2025-11-15", lastUpdated: "2025-12-31" },
  { id: "lp10", title: "セミナー登録ページ2026春", url: "/lp/seminar-spring", status: "公開中", views: 1200, conversions: 78, cvr: 6.5, createdAt: "2026-03-01", lastUpdated: "2026-03-13" },
  { id: "lp11", title: "新卒採用ページ", url: "/lp/recruit-2026", status: "公開中", views: 3800, conversions: 120, cvr: 3.2, createdAt: "2026-01-05", lastUpdated: "2026-03-10" },
];

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case "公開中": return "success" as const;
    case "下書き": return "default" as const;
    case "非公開": return "warning" as const;
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

export default function LandingPagesPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);

  const [search, setSearch] = useState("");
  const [activeView, setActiveView] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const views = [
    { key: "all", label: "すべてのページ" },
    { key: "published", label: "公開中" },
    { key: "draft", label: "下書き" },
  ];

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filtered = pages.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.url.toLowerCase().includes(search.toLowerCase());
    const matchView = activeView === "all" ||
      (activeView === "published" && p.status === "公開中") ||
      (activeView === "draft" && p.status === "下書き");
    return matchSearch && matchView;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortField) return 0;
    let cmp = 0;
    if (sortField === "title") cmp = a.title.localeCompare(b.title);
    else if (sortField === "status") cmp = a.status.localeCompare(b.status);
    else if (sortField === "views") cmp = a.views - b.views;
    else if (sortField === "cvr") cmp = a.cvr - b.cvr;
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

  const totalViews = pages.filter((p) => p.status === "公開中").reduce((s, p) => s + p.views, 0);
  const totalConversions = pages.filter((p) => p.status === "公開中").reduce((s, p) => s + p.conversions, 0);


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
        title="ランディングページ"
        description="ランディングページの作成・管理"
        actions={
          <Button size="sm" onClick={() => alert("ランディングページ作成は準備中です")}>
            <Plus className="h-4 w-4 mr-1" />

      <p className="text-sm text-gray-500">{pages.length}件のランディングページ</p>

            ランディングページ作成
          </Button>
        }
      />

      <div className="flex items-center gap-1 border-b border-gray-200 px-1 mb-4">
        {views.map((v) => (
          <button key={v.key} onClick={() => { setActiveView(v.key); setCurrentPage(1); }}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeView === v.key ? "border-[#ff4800] text-[#1f1f1f]" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>{v.label}</button>
        ))}
        <button className="ml-1 p-1.5 text-gray-400 hover:text-gray-600 rounded"><Plus className="h-4 w-4" /></button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50"><Eye className="h-5 w-5 text-blue-600" /></div><div><p className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</p><p className="text-xs text-gray-500">総閲覧数</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50"><MousePointerClick className="h-5 w-5 text-green-600" /></div><div><p className="text-2xl font-bold text-gray-900">{totalConversions.toLocaleString()}</p><p className="text-xs text-gray-500">総コンバージョン</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50"><BarChart3 className="h-5 w-5 text-purple-600" /></div><div><p className="text-2xl font-bold text-gray-900">{totalViews > 0 ? ((totalConversions / totalViews) * 100).toFixed(1) : 0}%</p><p className="text-xs text-gray-500">平均CVR</p></div></div></CardContent></Card>
      </div>

      {/* Search */}
      <div className="w-72">
        <Input variant="search" placeholder="ページ名、URLで検索..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} />
      </div>

      {/* Pages Table */}
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
                  <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700" onClick={() => handleSort("status")}>ステータス<ArrowUpDown className="h-3 w-3" /></div>
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">
                  <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-gray-700" onClick={() => handleSort("views")}>閲覧数<ArrowUpDown className="h-3 w-3" /></div>
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">CV数</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">
                  <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-gray-700" onClick={() => handleSort("cvr")}>CVR<ArrowUpDown className="h-3 w-3" /></div>
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">最終更新</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">作成日</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((page) => (
                <tr key={page.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${selectedIds.has(page.id) ? "bg-blue-50" : ""}`}>
                  <td className="px-4 py-3"><input type="checkbox" className="rounded border-gray-300" checked={selectedIds.has(page.id)} onChange={() => toggleSelect(page.id)} onClick={(e) => e.stopPropagation()} /></td>
                  <td className="px-4 py-3"><div><p className="font-medium text-gray-900">{page.title}</p><p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><ExternalLink className="h-3 w-3" />{page.url}</p></div></td>
                  <td className="px-4 py-3"><Badge variant={statusBadgeVariant(page.status)}>{page.status}</Badge></td>
                  <td className="px-4 py-3 text-right text-gray-600">{page.views > 0 ? page.views.toLocaleString() : "-"}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{page.conversions > 0 ? page.conversions.toLocaleString() : "-"}</td>
                  <td className="px-4 py-3 text-right">{page.cvr > 0 ? <span className="font-medium text-gray-900">{page.cvr}%</span> : <span className="text-gray-400">-</span>}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{page.lastUpdated}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{page.createdAt}</td>
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

      {filtered.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <ExternalLink className="h-8 w-8 text-gray-300" />
          </div>
          <h3 className="text-base font-medium text-gray-900 mb-1">データがありません</h3>
          <p className="text-sm text-gray-500">新しいランディングページを作成して始めましょう</p>
        </div>
      )}
    </div>
  );
}
