"use client";

import { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatsCard } from "@/components/ui/stats-card";
import {
  PenTool,
  Plus,
  Eye,
  MessageSquare,
  Search,
  MoreHorizontal,
  TrendingUp,
  FileText,
  ArrowUpDown,
} from "lucide-react";

const blogPosts = [
  { id: 1, title: "2026年のBtoBマーケティング最新トレンド", author: "佐藤 匠", status: "published" as const, date: "2026-03-10", views: 3420, comments: 12, seoScore: 92 },
  { id: 2, title: "AIを活用した営業プロセスの自動化ガイド", author: "佐藤 匠", status: "published" as const, date: "2026-03-05", views: 2180, comments: 8, seoScore: 88 },
  { id: 3, title: "カスタマーサクセスの測定方法と主要KPI", author: "田村 愛", status: "draft" as const, date: "2026-03-14", views: 0, comments: 0, seoScore: 75 },
  { id: 4, title: "効果的なリードナーチャリング戦略5選", author: "佐藤 匠", status: "scheduled" as const, date: "2026-03-18", views: 0, comments: 0, seoScore: 85 },
  { id: 5, title: "SaaSプライシング戦略の完全ガイド", author: "田村 愛", status: "published" as const, date: "2026-02-28", views: 4510, comments: 15, seoScore: 95 },
  { id: 6, title: "HubSpot CRM導入の成功事例集", author: "佐藤 匠", status: "published" as const, date: "2026-02-20", views: 5230, comments: 23, seoScore: 90 },
  { id: 7, title: "メールマーケティングの開封率を上げる7つの方法", author: "田村 愛", status: "published" as const, date: "2026-02-15", views: 3890, comments: 11, seoScore: 87 },
  { id: 8, title: "コンテンツマーケティングのROI測定方法", author: "佐藤 匠", status: "published" as const, date: "2026-02-10", views: 2760, comments: 7, seoScore: 82 },
  { id: 9, title: "ABMアカウントベースドマーケティング入門", author: "田村 愛", status: "draft" as const, date: "2026-03-13", views: 0, comments: 0, seoScore: 68 },
  { id: 10, title: "ウェビナー集客を成功させるための完全マニュアル", author: "佐藤 匠", status: "scheduled" as const, date: "2026-03-20", views: 0, comments: 0, seoScore: 79 },
  { id: 11, title: "データドリブンな意思決定の実践方法", author: "田村 愛", status: "published" as const, date: "2026-02-05", views: 1890, comments: 5, seoScore: 84 },
];

const statusConfig = {
  published: { label: "公開中", variant: "success" as const },
  draft: { label: "下書き", variant: "default" as const },
  scheduled: { label: "予約済み", variant: "info" as const },
};

const seoScoreColor = (score: number) => {
  if (score >= 90) return "text-[#00823a] bg-[#b9cdbe]";
  if (score >= 80) return "text-[#2f7579] bg-[#b2e9eb]";
  if (score >= 70) return "text-[#8a6d00] bg-[#ece6d9]";
  return "text-[#d9002b] bg-[#fcc6b1]";
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

export default function BlogPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);

  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = blogPosts.filter((p) => {
    const matchSearch = p.title.includes(search) || p.author.includes(search);
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const toggleAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((item) => String(item.id))));
    }
  };

  const toggle = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const totalViews = blogPosts.reduce((sum, p) => sum + p.views, 0);
  const publishedCount = blogPosts.filter((p) => p.status === "published").length;


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
        title="ブログ"
        description="ブログ記事の作成・管理・パフォーマンス追跡"
        breadcrumbs={[
          { label: "ホーム", href: "/" },
          { label: "コンテンツ", href: "/content" },
          { label: "ブログ" },
        ]}
        actions={
          <Button size="sm" onClick={() => alert("記事作成は準備中です")}>
            <Plus className="h-4 w-4 mr-1" />
            記事作成
          </Button>
        }
      />

      {/* KPI */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatsCard label="総PV" value={totalViews.toLocaleString()} change={22} changeLabel="前月比" icon={Eye} />
        <StatsCard label="公開記事数" value={publishedCount} icon={FileText} />
        <StatsCard label="平均SEOスコア" value="84" change={3} changeLabel="前月比" icon={Search} />
        <StatsCard label="コメント合計" value={blogPosts.reduce((s, p) => s + p.comments, 0)} change={15} changeLabel="前月比" icon={MessageSquare} />
      </div>

      {/* Blog Posts Table */}
      <Card>
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-72">
              <Input
                variant="search"
                placeholder="タイトル、著者で検索..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">すべてのステータス</option>
              <option value="published">公開中</option>
              <option value="draft">下書き</option>
              <option value="scheduled">予約済み</option>
            </select>
          </div>
        </div>
        
      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <PenTool className="h-8 w-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">データがありません</h3>
          <p className="text-sm text-gray-500 mb-4">新しいブログ記事を作成して始めましょう</p>
          <Button size="sm" onClick={() => alert("作成は準備中です")}>
            <Plus className="h-4 w-4 mr-1" /> ブログ記事を作成
          </Button>
        </div>
      )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="w-10 px-3"><input type="checkbox" className="rounded border-gray-300" onChange={toggleAll} checked={filtered.length > 0 && selectedIds.size === filtered.length} /></th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">タイトル</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">著者</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">ステータス</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                    日付 <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">
                  <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-gray-700">
                    PV <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">コメント</th>
                <th className="px-4 py-3 text-center font-medium text-gray-500">SEOスコア</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => (
                <tr key={post.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="w-10 px-3"><input type="checkbox" className="rounded border-gray-300" checked={selectedIds.has(String(post.id))} onChange={() => toggle(String(post.id))} onClick={(e) => e.stopPropagation()} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <PenTool className="h-4 w-4 shrink-0 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {post.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{post.author}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusConfig[post.status].variant}>
                      {statusConfig[post.status].label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{post.date}</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    {post.views > 0 ? post.views.toLocaleString() : "-"}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {post.comments > 0 ? post.comments : "-"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${seoScoreColor(post.seoScore)}`}>
                      {post.seoScore}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <RowActions onEdit={() => alert("編集は準備中です")} onDelete={() => alert("削除は準備中です")} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-gray-200 px-4 py-3">
          <p className="text-sm text-gray-500">{filtered.length}件の記事を表示</p>
        </div>
      </Card>
    </div>
  );
}
