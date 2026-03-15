"use client";

import { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatsCard } from "@/components/ui/stats-card";
import {
  Globe,
  Plus,
  Eye,
  Edit3,
  MoreHorizontal,
  Layout,
  ExternalLink,
  Copy,
  Trash2,
  ArrowUpDown,
  Pencil,
  Download,
  X,
} from "lucide-react";

const pages = [
  { id: 1, title: "トップページ", url: "/", status: "published" as const, lastUpdated: "2026-03-12", views: 12450, template: "ホームページ" },
  { id: 2, title: "製品紹介", url: "/products", status: "published" as const, lastUpdated: "2026-03-10", views: 8920, template: "プロダクト" },
  { id: 3, title: "価格プラン", url: "/pricing", status: "published" as const, lastUpdated: "2026-03-08", views: 5430, template: "プライシング" },
  { id: 4, title: "導入事例", url: "/case-studies", status: "published" as const, lastUpdated: "2026-03-01", views: 3210, template: "ケーススタディ" },
  { id: 5, title: "お問い合わせ", url: "/contact", status: "published" as const, lastUpdated: "2026-02-28", views: 2890, template: "コンタクト" },
  { id: 6, title: "会社概要", url: "/about", status: "published" as const, lastUpdated: "2026-02-20", views: 1560, template: "企業情報" },
  { id: 7, title: "採用情報（リニューアル）", url: "/careers", status: "draft" as const, lastUpdated: "2026-03-14", views: 0, template: "採用" },
  { id: 8, title: "パートナープログラム", url: "/partners", status: "published" as const, lastUpdated: "2026-02-15", views: 890, template: "パートナー" },
  { id: 9, title: "セキュリティ", url: "/security", status: "published" as const, lastUpdated: "2026-01-20", views: 670, template: "情報ページ" },
];

const templates = [
  { name: "ブランクページ", description: "白紙から作成", icon: "+" },
  { name: "ランディングページ", description: "コンバージョン最適化", icon: "LP" },
  { name: "プロダクトページ", description: "製品・サービス紹介", icon: "P" },
  { name: "ケーススタディ", description: "導入事例テンプレート", icon: "CS" },
];

const statusConfig = {
  published: { label: "公開中", variant: "success" as const },
  draft: { label: "下書き", variant: "default" as const },
  review: { label: "レビュー中", variant: "warning" as const },
};

const savedViews = ["すべて", "公開中", "下書き"];

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mt-2" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
      <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
    </div>
  );
}

function RowActionsMenu({ onEdit, onCopy, onDelete }: { onEdit: () => void; onCopy: () => void; onDelete: () => void }) {
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
            onClick={(e) => { e.stopPropagation(); onCopy(); setOpen(false); }}
          >
            <Copy className="h-3.5 w-3.5" /> 複製
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

export default function WebsitePagesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showTemplates, setShowTemplates] = useState(false);
  const [activeView, setActiveView] = useState(savedViews[0]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
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

  const filteredBase = pages.filter((p) => {
    const matchSearch = p.title.includes(search) || p.url.includes(search);
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const filtered = [...filteredBase].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = String((a as unknown as Record<string,unknown>)[sortField] ?? "");
    const bVal = String((b as unknown as Record<string,unknown>)[sortField] ?? "");
    return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalViews = pages.reduce((sum, p) => sum + p.views, 0);

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedItems.map((p) => p.id)));
    }
  };

  const toggleSelect = (id: number) => {
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
        title="ウェブサイトページ"
        description="ウェブサイトページの作成・管理・パフォーマンス追跡"
        breadcrumbs={[
          { label: "ホーム", href: "/" },
          { label: "コンテンツ", href: "/content" },
          { label: "ウェブサイトページ" },
        ]}
        actions={
          <Button size="sm" onClick={() => setShowTemplates(!showTemplates)}>
            <Plus className="h-4 w-4 mr-1" />

      <p className="text-sm text-gray-500">{pages.length}件のページ</p>

            ページ作成
          </Button>
        }
      />

      {/* Saved View Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200">
        {savedViews.map((view) => (
          <button
            key={view}
            onClick={() => {
              setActiveView(view);
              if (view === "公開中") setStatusFilter("published");
              else if (view === "下書き") setStatusFilter("draft");
              else setStatusFilter("all");
              setCurrentPage(1);
            }}
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

      {/* KPI */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatsCard label="総ページビュー" value={totalViews.toLocaleString()} change={14} changeLabel="前月比" icon={Eye} />
        <StatsCard label="公開ページ数" value={pages.filter(p => p.status === "published").length} icon={Globe} />
        <StatsCard label="平均直帰率" value="42.3%" change={-5} changeLabel="前月比" icon={Layout} />
        <StatsCard label="平均表示速度" value="1.8秒" change={-12} changeLabel="前月比" icon={Globe} />
      </div>

      {/* Template Selector */}
      {showTemplates && (
        <Card>
          <CardHeader>
            <CardTitle>テンプレートを選択</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {templates.map((template) => (
                <button
                  key={template.name}
                  className="rounded-lg border-2 border-gray-200 p-4 text-center transition-colors hover:border-[#ff4800] hover:bg-orange-50"
                >
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-lg font-bold text-gray-600">
                    {template.icon}
                  </div>
                  <p className="text-sm font-medium text-gray-900">{template.name}</p>
                  <p className="text-xs text-gray-500">{template.description}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Drag and Drop Editor Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-[#ff4800]" />
              <CardTitle>ドラッグ&ドロップエディター</CardTitle>
            </div>
            <Badge variant="info">プレビュー</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8">
            <div className="space-y-4">
              <div className="h-16 rounded bg-gray-200 flex items-center justify-center text-sm text-gray-500">ヘッダーセクション</div>
              <div className="grid grid-cols-3 gap-3">
                <div className="h-24 rounded bg-gray-200 flex items-center justify-center text-sm text-gray-500">ヒーロー</div>
                <div className="h-24 rounded bg-gray-200 flex items-center justify-center text-sm text-gray-500">CTA</div>
                <div className="h-24 rounded bg-gray-200 flex items-center justify-center text-sm text-gray-500">画像</div>
              </div>
              <div className="h-20 rounded bg-gray-200 flex items-center justify-center text-sm text-gray-500">コンテンツブロック</div>
              <div className="h-12 rounded bg-gray-200 flex items-center justify-center text-sm text-gray-500">フッター</div>
            </div>
            <p className="mt-4 text-center text-sm text-gray-400">ページを選択してエディターを開始</p>
          </div>
        </CardContent>
      </Card>

      {/* Pages Table */}
      <Card>
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-72">
              <Input
                variant="search"
                placeholder="ページ名、URLで検索..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <select
              className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="all">すべてのステータス</option>
              <option value="published">公開中</option>
              <option value="draft">下書き</option>
            </select>
          </div>
        </div>
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
                <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("title")}><div className="flex items-center gap-1">ページ名 <ArrowUpDown className="h-3 w-3" /></div></th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("url")}><div className="flex items-center gap-1">URL <ArrowUpDown className="h-3 w-3" /></div></th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("template")}><div className="flex items-center gap-1">テンプレート <ArrowUpDown className="h-3 w-3" /></div></th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">ステータス</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">最終更新</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">PV</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((page) => (
                <tr key={page.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${selectedIds.has(page.id) ? "bg-blue-50/50" : ""}`}>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedIds.has(page.id)}
                      onChange={() => toggleSelect(page.id)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900">
                      {page.title}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-gray-500">
                      <span className="font-mono text-xs">{page.url}</span>
                      <ExternalLink className="h-3 w-3" />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{page.template}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusConfig[page.status].variant}>
                      {statusConfig[page.status].label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{page.lastUpdated}</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    {page.views > 0 ? page.views.toLocaleString() : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <RowActionsMenu
                      onEdit={() => alert(`編集: ${page.title}`)}
                      onCopy={() => alert(`複製: ${page.title}`)}
                      onDelete={() => { if (confirm("本当に削除しますか？")) alert("削除しました"); }}
                    />
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
            <Globe className="h-8 w-8 text-gray-300" />
          </div>
          <h3 className="text-base font-medium text-gray-900 mb-1">データがありません</h3>
          <p className="text-sm text-gray-500">新しいウェブサイトページを作成して始めましょう</p>
        </div>
      )}
    </div>
  );
}
