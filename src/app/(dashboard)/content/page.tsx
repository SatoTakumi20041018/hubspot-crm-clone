"use client";

import { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatsCard } from "@/components/ui/stats-card";
import {
  FileText,
  Globe,
  Headphones,
  Sparkles,
  PenTool,
  Eye,
  TrendingUp,
  ArrowRight,
  Palette,
  RefreshCw,
  BarChart3,
  Plus,
  ArrowUpDown,
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
  X,
  Download,
} from "lucide-react";
import Link from "next/link";

const contentRemixItems = [
  { id: 1, original: "2026年のマーケティングトレンド予測", type: "ブログ記事", remixes: ["SNS投稿 x5", "メールコピー", "動画スクリプト", "インフォグラフィック"] },
  { id: 2, original: "顧客成功事例：田中商事", type: "ケーススタディ", remixes: ["LP用テキスト", "営業資料", "SNS投稿 x3"] },
  { id: 3, original: "SaaS導入ガイド", type: "ホワイトペーパー", remixes: ["ブログシリーズ x4", "ウェビナースクリプト", "メールシーケンス"] },
];

const blogPosts = [
  { id: "bp1", title: "2026年のBtoB マーケティング最新トレンド", status: "published" as const, views: 3420, date: "2026-03-10" },
  { id: "bp2", title: "AIを活用した営業プロセスの自動化ガイド", status: "published" as const, views: 2180, date: "2026-03-05" },
  { id: "bp3", title: "カスタマーサクセスの測定方法", status: "draft" as const, views: 0, date: "2026-03-14" },
  { id: "bp4", title: "効果的なリードナーチャリング戦略", status: "scheduled" as const, views: 0, date: "2026-03-18" },
  { id: "bp5", title: "データドリブンマーケティング入門", status: "published" as const, views: 1540, date: "2026-02-28" },
  { id: "bp6", title: "コンテンツマーケティング最前線", status: "published" as const, views: 980, date: "2026-02-20" },
];

const websitePages = [
  { id: "wp1", title: "製品ページ", url: "/products", views: 8920, lastUpdated: "2026-03-12" },
  { id: "wp2", title: "価格ページ", url: "/pricing", views: 5430, lastUpdated: "2026-03-08" },
  { id: "wp3", title: "事例紹介", url: "/case-studies", views: 3210, lastUpdated: "2026-03-01" },
  { id: "wp4", title: "お問い合わせ", url: "/contact", views: 2890, lastUpdated: "2026-02-28" },
];

const podcasts = [
  { id: "pc1", title: "SaaSビジネスの未来 - エピソード 45", duration: "32:15", plays: 1250, date: "2026-03-12" },
  { id: "pc2", title: "AIと営業 - エピソード 44", duration: "28:40", plays: 980, date: "2026-03-05" },
  { id: "pc3", title: "スタートアップの成長戦略 - エピソード 43", duration: "35:20", plays: 1420, date: "2026-02-26" },
];

const statusConfig = {
  published: { label: "公開中", variant: "success" as const },
  draft: { label: "下書き", variant: "default" as const },
  scheduled: { label: "予約済み", variant: "info" as const },
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

export default function ContentPage() {
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);

  const savedViews = [
    { key: "all", label: "すべて" },
    { key: "blog", label: "ブログ" },
    { key: "pages", label: "ページ" },
    { key: "podcasts", label: "ポッドキャスト" },
  ];

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredBlogPosts = blogPosts
    .filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (!sortField) return 0;
      const aVal = String((a as unknown as Record<string, unknown>)[sortField] ?? "");
      const bVal = String((b as unknown as Record<string, unknown>)[sortField] ?? "");
      return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

  const totalPages = Math.ceil(filteredBlogPosts.length / itemsPerPage);
  const paginatedBlogPosts = filteredBlogPosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const allBlogIds = blogPosts.map(p => p.id);
  const toggleSelectAll = () => {
    if (selectedIds.size === allBlogIds.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(allBlogIds));
  };

  const allContentCount = blogPosts.length + websitePages.length + podcasts.length;

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[...Array(4)].map((_, i) => (<div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />))}
        </div>
        <div className="h-48 bg-gray-100 rounded-lg animate-pulse mt-4" />
        <div className="grid grid-cols-2 gap-4 mt-4">
          {[...Array(4)].map((_, i) => (<div key={i} className="h-48 bg-gray-100 rounded-lg animate-pulse" />))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="コンテンツHub"
        description="コンテンツの作成、管理、最適化を一元管理"
        breadcrumbs={[{ label: "ホーム", href: "/" }, { label: "コンテンツ" }]}
        actions={<Button size="sm" onClick={() => alert("コンテンツ作成は準備中です")}><PenTool className="h-4 w-4 mr-1" />コンテンツ作成</Button>}
      />

      <p className="text-sm text-gray-500">{allContentCount}件のコンテンツ</p>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 px-1">
        {savedViews.map((v) => (
          <button key={v.key} onClick={() => { setActiveView(v.key); setCurrentPage(1); }} className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${activeView === v.key ? "border-[#ff4800] text-[#1f1f1f]" : "border-transparent text-gray-500 hover:text-gray-700"}`}>{v.label}</button>
        ))}
        <button className="ml-1 p-1.5 text-gray-400 hover:text-gray-600 rounded" onClick={() => alert("ビュー追加は準備中です")}><Plus className="h-4 w-4" /></button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatsCard label="今月のPV" value="24,530" change={18} changeLabel="前月比" icon={Eye} />
        <StatsCard label="公開コンテンツ" value="156" change={8} changeLabel="前月比" icon={FileText} />
        <StatsCard label="平均滞在時間" value="3:24" change={12} changeLabel="前月比" icon={TrendingUp} />
        <StatsCard label="コンバージョン率" value="4.2%" change={0.8} changeLabel="前月比" icon={BarChart3} />
      </div>

      <Card>
        <CardHeader><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-[#ff4800]" /><CardTitle>Content Remix - AIコンテンツリパーパス</CardTitle></div><Button variant="outline" size="sm"><RefreshCw className="h-4 w-4 mr-1" />新しいリミックス</Button></div><CardDescription>既存コンテンツをAIが自動的に複数のフォーマットに変換します</CardDescription></CardHeader>
        <CardContent><div className="space-y-4">{contentRemixItems.map((item) => (<div key={item.id} className="rounded-lg border border-gray-200 p-4"><div className="flex items-start justify-between"><div><p className="font-medium text-gray-900">{item.original}</p><Badge variant="info" className="mt-1">{item.type}</Badge></div><Button variant="outline" size="sm">リミックス実行</Button></div><div className="mt-3 flex flex-wrap gap-2">{item.remixes.map((remix) => (<span key={remix} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">{remix}</span>))}</div></div>))}</div></CardContent>
      </Card>

      {/* Search */}
      <div className="w-72">
        <Input variant="search" placeholder="コンテンツを検索..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} />
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

      {/* Blog Posts Table */}
      {(activeView === "all" || activeView === "blog") && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><PenTool className="h-5 w-5 text-[#ff4800]" /><CardTitle>ブログ記事</CardTitle></div>
              <Link href="/blog"><Button variant="ghost" size="sm">すべて見る <ArrowRight className="ml-1 h-4 w-4" /></Button></Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left font-medium text-gray-500 w-10">
                      <input type="checkbox" className="rounded border-gray-300" checked={blogPosts.length > 0 && selectedIds.size === blogPosts.length} onChange={toggleSelectAll} />
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("title")}><div className="flex items-center gap-1">タイトル <ArrowUpDown className="h-3 w-3" /></div></th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("status")}><div className="flex items-center gap-1">ステータス <ArrowUpDown className="h-3 w-3" /></div></th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("views")}><div className="flex items-center justify-end gap-1">閲覧数 <ArrowUpDown className="h-3 w-3" /></div></th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("date")}><div className="flex items-center gap-1">日付 <ArrowUpDown className="h-3 w-3" /></div></th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBlogPosts.map((post) => (
                    <tr key={post.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${selectedIds.has(post.id) ? "bg-blue-50/50" : ""}`}>
                      <td className="px-4 py-3">
                        <input type="checkbox" className="rounded border-gray-300" checked={selectedIds.has(post.id)} onChange={() => toggleSelect(post.id)} onClick={(e) => e.stopPropagation()} />
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{post.title}</td>
                      <td className="px-4 py-3"><Badge variant={statusConfig[post.status].variant}>{statusConfig[post.status].label}</Badge></td>
                      <td className="px-4 py-3 text-right text-gray-600">{post.views > 0 ? post.views.toLocaleString() : "-"}</td>
                      <td className="px-4 py-3 text-gray-600">{post.date}</td>
                      <td className="px-4 py-3"><RowActions /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
              <p className="text-sm text-gray-500">{filteredBlogPosts.length}件中 {(currentPage - 1) * itemsPerPage + 1}〜{Math.min(currentPage * itemsPerPage, filteredBlogPosts.length)}件</p>
              <div className="flex gap-1">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">前へ</button>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">次へ</button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {(activeView === "all" || activeView === "pages") && (
          <Card>
            <CardHeader><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Globe className="h-5 w-5 text-[#ff4800]" /><CardTitle>ウェブサイトページ</CardTitle></div><Link href="/website-pages"><Button variant="ghost" size="sm">すべて見る <ArrowRight className="ml-1 h-4 w-4" /></Button></Link></div></CardHeader>
            <CardContent><div className="space-y-3">{websitePages.filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase())).map((page) => (<div key={page.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3"><div><p className="text-sm font-medium text-gray-900">{page.title}</p><p className="text-xs text-gray-500">{page.url} - 最終更新: {page.lastUpdated}</p></div><div className="text-right"><p className="text-sm font-semibold text-gray-900">{page.views.toLocaleString()}</p><p className="text-xs text-gray-500">views</p></div></div>))}</div></CardContent>
          </Card>
        )}

        {(activeView === "all" || activeView === "podcasts") && (
          <Card>
            <CardHeader><div className="flex items-center gap-2"><Headphones className="h-5 w-5 text-[#ff4800]" /><CardTitle>ポッドキャスト</CardTitle></div></CardHeader>
            <CardContent><div className="space-y-3">{podcasts.filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase())).map((podcast) => (<div key={podcast.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3"><div><p className="text-sm font-medium text-gray-900">{podcast.title}</p><p className="text-xs text-gray-500">{podcast.date} - {podcast.duration}</p></div><div className="text-right"><p className="text-sm font-semibold text-gray-900">{podcast.plays.toLocaleString()}</p><p className="text-xs text-gray-500">再生</p></div></div>))}</div></CardContent>
          </Card>
        )}

        <Card>
          <CardHeader><div className="flex items-center gap-2"><Palette className="h-5 w-5 text-[#ff4800]" /><CardTitle>ブランドボイス設定</CardTitle></div></CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-4"><p className="text-sm font-medium text-gray-700">トーン</p><p className="mt-1 text-sm text-gray-600">プロフェッショナルでありながら親しみやすい</p></div>
            <div className="rounded-lg bg-gray-50 p-4"><p className="text-sm font-medium text-gray-700">ペルソナ</p><p className="mt-1 text-sm text-gray-600">BtoB SaaS企業のマーケティング・営業担当者</p></div>
            <div className="rounded-lg bg-gray-50 p-4"><p className="text-sm font-medium text-gray-700">キーワード</p><div className="mt-1 flex flex-wrap gap-1.5">{["DX推進", "業務効率化", "データドリブン", "ROI最大化", "カスタマーサクセス"].map((kw) => (<Badge key={kw} variant="orange">{kw}</Badge>))}</div></div>
            <Button variant="outline" size="sm" className="w-full">設定を編集</Button>
          </CardContent>
        </Card>
      </div>

      {blogPosts.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-gray-300" />
          </div>
          <h3 className="text-base font-medium text-gray-900 mb-1">データがありません</h3>
          <p className="text-sm text-gray-500">新しいコンテンツを作成して始めましょう</p>
        </div>
      )}
    </div>
  );
}
