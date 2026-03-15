"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import {
  Plus,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  MoreHorizontal,
  Calendar,
  Filter,
  Clock,
  ArrowUpDown,
  Trash2,
  Download,
  Archive,
} from "lucide-react";

type Platform = "Twitter" | "Facebook" | "Instagram" | "LinkedIn";

interface Post {
  id: string;
  platform: Platform;
  content: string;
  status: "公開済み" | "予約済み" | "下書き";
  engagement: { likes: number; comments: number; shares: number; impressions: number };
  date: string;
  time: string;
}

const platformConfig: Record<Platform, { color: string; bg: string; label: string }> = {
  Twitter: { color: "text-sky-500", bg: "bg-sky-50", label: "X" },
  Facebook: { color: "text-blue-600", bg: "bg-blue-50", label: "FB" },
  Instagram: { color: "text-pink-500", bg: "bg-pink-50", label: "IG" },
  LinkedIn: { color: "text-blue-700", bg: "bg-blue-50", label: "LI" },
};

const posts: Post[] = [
  { id: "sp1", platform: "Twitter", content: "新機能リリースのお知らせ！CRMダッシュボードが大幅にアップデートされました。", status: "公開済み", engagement: { likes: 45, comments: 12, shares: 8, impressions: 2340 }, date: "2026-03-14", time: "09:00" },
  { id: "sp2", platform: "LinkedIn", content: "業界トレンドレポート2026を公開しました。デジタルトランスフォーメーションの最新動向をまとめています。", status: "公開済み", engagement: { likes: 128, comments: 34, shares: 42, impressions: 8900 }, date: "2026-03-13", time: "10:00" },
  { id: "sp3", platform: "Instagram", content: "チームメンバーの紹介シリーズ第3弾！今回は開発チームの裏側をお見せします。", status: "公開済み", engagement: { likes: 234, comments: 18, shares: 5, impressions: 4560 }, date: "2026-03-13", time: "12:00" },
  { id: "sp4", platform: "Facebook", content: "4月開催の無料ウェビナー「CRM活用術」の参加者を募集中！詳しくはリンクをチェック。", status: "公開済み", engagement: { likes: 67, comments: 23, shares: 15, impressions: 3200 }, date: "2026-03-12", time: "14:00" },
  { id: "sp5", platform: "Twitter", content: "お客様導入事例を公開！「売上30%アップを実現した太陽コーポレーション様」の成功の秘訣とは？", status: "公開済み", engagement: { likes: 32, comments: 8, shares: 12, impressions: 1890 }, date: "2026-03-11", time: "11:00" },
  { id: "sp6", platform: "LinkedIn", content: "採用情報：プロダクトマネージャーを募集しています。CRM業界の未来を一緒に創りませんか？", status: "予約済み", engagement: { likes: 0, comments: 0, shares: 0, impressions: 0 }, date: "2026-03-15", time: "09:00" },
  { id: "sp7", platform: "Instagram", content: "オフィスの新しいリラックススペースを紹介！社員の創造性を高める環境づくりに力を入れています。", status: "予約済み", engagement: { likes: 0, comments: 0, shares: 0, impressions: 0 }, date: "2026-03-16", time: "12:00" },
  { id: "sp8", platform: "Facebook", content: "セミナーレポート：「2026年のマーケティング戦略」セミナーの内容をまとめました。", status: "公開済み", engagement: { likes: 89, comments: 15, shares: 22, impressions: 5600 }, date: "2026-03-10", time: "15:00" },
  { id: "sp9", platform: "Twitter", content: "今週のTips: ワークフロー自動化の3つのベストプラクティスをご紹介します。", status: "下書き", engagement: { likes: 0, comments: 0, shares: 0, impressions: 0 }, date: "-", time: "-" },
  { id: "sp10", platform: "LinkedIn", content: "パートナーシップのお知らせ：新たにABC社との提携が始まりました。", status: "公開済み", engagement: { likes: 156, comments: 28, shares: 35, impressions: 12000 }, date: "2026-03-08", time: "10:00" },
  { id: "sp11", platform: "Instagram", content: "ユーザーカンファレンス2026の写真をアップしました！ご参加いただいた皆様、ありがとうございました。", status: "公開済み", engagement: { likes: 312, comments: 45, shares: 18, impressions: 7800 }, date: "2026-03-07", time: "18:00" },
];

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case "公開済み": return "success" as const;
    case "予約済み": return "info" as const;
    case "下書き": return "default" as const;
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

export default function SocialPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);

  const [filterPlatform, setFilterPlatform] = useState<string>("すべて");
  const [activeView, setActiveView] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const views = [
    { key: "all", label: "すべての投稿" },
    { key: "published", label: "公開済み" },
    { key: "scheduled", label: "予約済み" },
  ];
  const platforms: (Platform | "すべて")[] = ["すべて", "Twitter", "Facebook", "Instagram", "LinkedIn"];

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const filtered = posts.filter((p) => {
    const matchPlatform = filterPlatform === "すべて" || p.platform === filterPlatform;
    const matchSearch = p.content.toLowerCase().includes(search.toLowerCase());
    const matchView = activeView === "all" ||
      (activeView === "published" && p.status === "公開済み") ||
      (activeView === "scheduled" && p.status === "予約済み");
    return matchPlatform && matchSearch && matchView;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortField) return 0;
    let cmp = 0;
    if (sortField === "date") cmp = a.date.localeCompare(b.date);
    else if (sortField === "impressions") cmp = a.engagement.impressions - b.engagement.impressions;
    else if (sortField === "likes") cmp = a.engagement.likes - b.engagement.likes;
    return sortDir === "asc" ? cmp : -cmp;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginatedItems = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSelect = (id: string) => { setSelectedIds(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; }); };
  const toggleAll = () => { if (selectedIds.size === paginatedItems.length) setSelectedIds(new Set()); else setSelectedIds(new Set(paginatedItems.map(i => i.id))); };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[...Array(4)].map((_, i) => (<div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />))}
        </div>
        <div className="h-64 bg-gray-100 rounded-lg animate-pulse mt-4" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="ソーシャルメディア" description="ソーシャルメディア投稿の管理と分析" actions={<Button size="sm" onClick={() => alert("投稿作成は準備中です")}><Plus className="h-4 w-4 mr-1" />投稿作成</Button>} />

      <div className="flex items-center gap-1 border-b border-gray-200 px-1 mb-4">
        {views.map((v) => (
          <button key={v.key} onClick={() => { setActiveView(v.key); setCurrentPage(1); }} className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${activeView === v.key ? "border-[#ff4800] text-[#1f1f1f]" : "border-transparent text-gray-500 hover:text-gray-700"}`}>{v.label}</button>
        ))}
        <button className="ml-1 p-1.5 text-gray-400 hover:text-gray-600 rounded"><Plus className="h-4 w-4" /></button>
      </div>

      {/* Search and Platform Filter */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-72"><Input variant="search" placeholder="投稿内容で検索..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} /></div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          {platforms.map((platform) => (
            <button key={platform} onClick={() => { setFilterPlatform(platform); setCurrentPage(1); }} className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${filterPlatform === platform ? "bg-[#ff4800] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {platform === "すべて" ? "すべて" : (<span className="flex items-center gap-1">{platformConfig[platform].label} {platform}</span>)}
            </button>
          ))}
        </div>
      </div>

      {/* Table View */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-medium text-gray-500"><input type="checkbox" className="rounded border-gray-300" checked={paginatedItems.length > 0 && selectedIds.size === paginatedItems.length} onChange={toggleAll} /></th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">プラットフォーム</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">コンテンツ</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">ステータス</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500"><div className="flex items-center justify-end gap-1 cursor-pointer hover:text-gray-700" onClick={() => handleSort("impressions")}>インプレッション<ArrowUpDown className="h-3 w-3" /></div></th>
                <th className="px-4 py-3 text-right font-medium text-gray-500"><div className="flex items-center justify-end gap-1 cursor-pointer hover:text-gray-700" onClick={() => handleSort("likes")}>いいね<ArrowUpDown className="h-3 w-3" /></div></th>
                <th className="px-4 py-3 text-left font-medium text-gray-500"><div className="flex items-center gap-1 cursor-pointer hover:text-gray-700" onClick={() => handleSort("date")}>日時<ArrowUpDown className="h-3 w-3" /></div></th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((post) => {
                const config = platformConfig[post.platform];
                return (
                  <tr key={post.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${selectedIds.has(post.id) ? "bg-blue-50" : ""}`}>
                    <td className="px-4 py-3"><input type="checkbox" className="rounded border-gray-300" checked={selectedIds.has(post.id)} onChange={() => toggleSelect(post.id)} onClick={(e) => e.stopPropagation()} /></td>
                    <td className="px-4 py-3"><div className={`flex h-8 w-8 items-center justify-center rounded-lg ${config.bg}`}><span className={`text-xs font-bold ${config.color}`}>{config.label}</span></div></td>
                    <td className="px-4 py-3 max-w-xs"><p className="text-gray-900 text-sm truncate">{post.content}</p></td>
                    <td className="px-4 py-3"><Badge variant={statusBadgeVariant(post.status)}>{post.status}</Badge></td>
                    <td className="px-4 py-3 text-right text-gray-600">{post.engagement.impressions > 0 ? post.engagement.impressions.toLocaleString() : "-"}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{post.engagement.likes > 0 ? post.engagement.likes : "-"}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{post.date !== "-" ? `${post.date} ${post.time}` : "-"}</td>
                    <td className="px-4 py-3"><RowActions onEdit={() => alert("編集は準備中です")} onDelete={() => alert("削除は準備中です")} /></td>
                  </tr>
                );
              })}
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

      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-lg border bg-white px-5 py-3 shadow-lg">
          <span className="text-sm font-medium text-gray-700">{selectedIds.size}件選択中</span>
          <div className="h-4 w-px bg-gray-200" />
          <Button size="sm" variant="outline" onClick={() => alert("アーカイブは準備中です")}><Archive className="h-4 w-4 mr-1" />アーカイブ</Button>
          <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => alert("削除は準備中です")}><Trash2 className="h-4 w-4 mr-1" />削除</Button>
          <button onClick={() => setSelectedIds(new Set())} className="ml-2 text-xs text-gray-500 hover:text-gray-700">選択解除</button>
        </div>
      )}
    </div>
  );
}
