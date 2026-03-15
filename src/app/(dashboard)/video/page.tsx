"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatsCard } from "@/components/ui/stats-card";
import {
  Video,
  Upload,
  Camera,
  Monitor,
  Scissors,
  Type,
  Palette,
  Eye,
  Clock,
  TrendingUp,
  Play,
  MoreHorizontal,
  Search,
  BarChart3,
  Sparkles,
  Plus,
  ArrowUpDown,
  Pencil,
  Download,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const savedViews = ["すべて", "マイ動画"];

const videos = [
  { id: 1, title: "製品デモ: CRM基本操作ガイド", duration: "8:24", views: 3420, engagement: 78, watchPercent: 65, date: "2026-03-10", status: "published" as const, thumbnail: "CRM" },
  { id: 2, title: "顧客成功事例: 田中商事のDX推進", duration: "12:35", views: 2180, engagement: 85, watchPercent: 72, date: "2026-03-05", status: "published" as const, thumbnail: "事例" },
  { id: 3, title: "ウェビナー: 2026年マーケティングトレンド", duration: "45:20", views: 5670, engagement: 62, watchPercent: 48, date: "2026-02-28", status: "published" as const, thumbnail: "WEB" },
  { id: 4, title: "チュートリアル: ワークフロー自動化設定", duration: "15:10", views: 1890, engagement: 91, watchPercent: 80, date: "2026-03-01", status: "published" as const, thumbnail: "How" },
  { id: 5, title: "セールスピッチ: Enterprise プラン紹介", duration: "5:45", views: 980, engagement: 73, watchPercent: 68, date: "2026-03-08", status: "published" as const, thumbnail: "Sales" },
  { id: 6, title: "社内トレーニング: 新機能アップデート", duration: "22:15", views: 450, engagement: 88, watchPercent: 75, date: "2026-03-12", status: "draft" as const, thumbnail: "Train" },
  { id: 7, title: "カスタマーサクセス: オンボーディングガイド", duration: "18:30", views: 1240, engagement: 82, watchPercent: 70, date: "2026-02-20", status: "published" as const, thumbnail: "CS" },
  { id: 8, title: "プロダクトアップデート: 2026 Q1新機能", duration: "10:05", views: 3100, engagement: 76, watchPercent: 60, date: "2026-03-14", status: "processing" as const, thumbnail: "NEW" },
];

const statusConfig = {
  published: { label: "公開中", variant: "success" as const },
  draft: { label: "下書き", variant: "default" as const },
  processing: { label: "処理中", variant: "warning" as const },
};

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mt-2" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <div className="h-36 bg-gray-200 rounded-t-[16px] animate-pulse" />
            <div className="p-3 space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function VideoPage() {
  const [search, setSearch] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(videos[0]);
  const [activeView, setActiveView] = useState(savedViews[0]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [sortField, setSortField] = useState<"views" | "date" | "engagement" | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 8;

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const handleSort = (field: "views" | "date" | "engagement") => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  const filtered = videos
    .filter((v) => v.title.includes(search))
    .sort((a, b) => {
      if (!sortField) return 0;
      if (sortField === "views") return sortDir === "asc" ? a.views - b.views : b.views - a.views;
      if (sortField === "engagement") return sortDir === "asc" ? a.engagement - b.engagement : b.engagement - a.engagement;
      if (sortField === "date") return sortDir === "asc" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalViews = videos.reduce((sum, v) => sum + v.views, 0);
  const avgEngagement = Math.round(videos.reduce((sum, v) => sum + v.engagement, 0) / videos.length);
  const avgWatch = Math.round(videos.reduce((sum, v) => sum + v.watchPercent, 0) / videos.length);

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedItems.map((v) => v.id)));
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
        title="ビデオHub"
        description="動画の録画、編集、分析を一元管理"
        breadcrumbs={[
          { label: "ホーム", href: "/" },
          { label: "コンテンツ", href: "/content" },
          { label: "ビデオ" },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-1" />
              アップロード
            </Button>
            <Button size="sm">
              <Camera className="h-4 w-4 mr-1" />
              録画開始
            </Button>
          </div>
        }
      />

      {/* Saved View Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200">
        {savedViews.map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
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

      {/* KPI */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatsCard label="総視聴回数" value={totalViews.toLocaleString()} change={18} changeLabel="前月比" icon={Eye} />
        <StatsCard label="動画数" value={videos.length} icon={Video} />
        <StatsCard label="平均エンゲージメント" value={`${avgEngagement}%`} change={5} changeLabel="前月比" icon={TrendingUp} />
        <StatsCard label="平均視聴率" value={`${avgWatch}%`} change={3} changeLabel="前月比" icon={Clock} />
      </div>

      {/* Search & Sort Controls */}
      <div className="flex items-center gap-3">
        <div className="w-80">
          <Input
            variant="search"
            placeholder="動画を検索..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => handleSort("views")} className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border ${sortField === "views" ? "border-[#ff4800] text-[#ff4800] bg-orange-50" : "border-gray-200 text-gray-500 hover:text-gray-700"}`}>
            視聴数 <ArrowUpDown className="h-3 w-3" />
          </button>
          <button onClick={() => handleSort("engagement")} className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border ${sortField === "engagement" ? "border-[#ff4800] text-[#ff4800] bg-orange-50" : "border-gray-200 text-gray-500 hover:text-gray-700"}`}>
            エンゲージメント <ArrowUpDown className="h-3 w-3" />
          </button>
          <button onClick={() => handleSort("date")} className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border ${sortField === "date" ? "border-[#ff4800] text-[#ff4800] bg-orange-50" : "border-gray-200 text-gray-500 hover:text-gray-700"}`}>
            日付 <ArrowUpDown className="h-3 w-3" />
          </button>
        </div>
        <label className="flex items-center gap-1.5 text-sm text-gray-500 ml-auto">
          <input
            type="checkbox"
            className="rounded border-gray-300"
            checked={paginatedItems.length > 0 && selectedIds.size === paginatedItems.length}
            onChange={toggleSelectAll}
          />
          すべて選択
        </label>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg bg-[#1f1f1f] px-4 py-2.5 text-white">
          <span className="text-sm font-medium">{selectedIds.size}件を選択中</span>
          <div className="h-4 w-px bg-gray-600" />
          <button className="flex items-center gap-1.5 rounded px-2.5 py-1 text-sm hover:bg-white/10 transition-colors" onClick={() => alert("一括編集は準備中です")}>
            <Pencil className="h-3.5 w-3.5" /> 編集
          </button>
          <button className="flex items-center gap-1.5 rounded px-2.5 py-1 text-sm hover:bg-white/10 transition-colors" onClick={() => alert("ダウンロードは準備中です")}>
            <Download className="h-3.5 w-3.5" /> ダウンロード
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

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {paginatedItems.map((video) => (
          <Card
            key={video.id}
            className={`cursor-pointer hover:shadow-md transition-shadow ${
              selectedIds.has(video.id) ? "ring-2 ring-[#ff4800]/30" : selectedVideo.id === video.id ? "ring-2 ring-[#ff4800]" : ""
            }`}
            onClick={() => setSelectedVideo(video)}
          >
            <div className="relative">
              <div className="flex h-36 items-center justify-center rounded-t-[16px] bg-gradient-to-br from-gray-700 to-gray-900 text-2xl font-bold text-white/50">
                {video.thumbnail}
              </div>
              <div className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
                {video.duration}
              </div>
              <div className="absolute left-2 top-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 bg-white/90"
                  checked={selectedIds.has(video.id)}
                  onChange={() => toggleSelect(video.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                <Badge variant={statusConfig[video.status].variant}>
                  {statusConfig[video.status].label}
                </Badge>
              </div>
            </div>
            <CardContent className="p-3">
              <p className="text-sm font-medium text-gray-900 line-clamp-2">{video.title}</p>
              <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{video.views.toLocaleString()}</span>
                <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" />{video.engagement}%</span>
                <span>{video.date}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-3">
          <p className="text-sm text-gray-500">{filtered.length}件中 {(currentPage-1)*itemsPerPage+1}〜{Math.min(currentPage*itemsPerPage, filtered.length)}件</p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-600">{currentPage} / {totalPages}</span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Video Detail Card */}
      <Card>
        <CardHeader>
          <CardTitle>ビデオ詳細: {selectedVideo.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Preview */}
            <div className="rounded-lg bg-gray-900 p-4">
              <div className="flex h-48 items-center justify-center rounded bg-gray-800 text-white/50">
                <div className="text-center">
                  <Play className="mx-auto h-12 w-12" />
                  <p className="mt-2 text-sm">プレビュー: {selectedVideo.title}</p>
                  <p className="text-xs text-white/30">{selectedVideo.duration}</p>
                </div>
              </div>
            </div>
            {/* Stats */}
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <p className="text-lg font-bold text-gray-900">{selectedVideo.views.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">視聴回数</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <p className="text-lg font-bold text-gray-900">{selectedVideo.engagement}%</p>
                  <p className="text-xs text-gray-500">エンゲージメント</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <p className="text-lg font-bold text-gray-900">{selectedVideo.watchPercent}%</p>
                  <p className="text-xs text-gray-500">視聴率</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">視聴進捗</p>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-[#ff4800]"
                    style={{ width: `${selectedVideo.watchPercent}%` }}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <Scissors className="h-4 w-4 mr-1" />
                  トリミング
                </Button>
                <Button variant="outline" size="sm">
                  <Type className="h-4 w-4 mr-1" />
                  字幕追加
                </Button>
                <Button variant="outline" size="sm">
                  <Sparkles className="h-4 w-4 mr-1" />
                  AI字幕生成
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
