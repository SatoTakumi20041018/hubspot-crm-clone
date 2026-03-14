"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatsCard } from "@/components/ui/stats-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
} from "lucide-react";

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

export default function VideoPage() {
  const [search, setSearch] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(videos[0]);

  const filtered = videos.filter((v) =>
    v.title.includes(search)
  );

  const totalViews = videos.reduce((sum, v) => sum + v.views, 0);
  const avgEngagement = Math.round(videos.reduce((sum, v) => sum + v.engagement, 0) / videos.length);
  const avgWatch = Math.round(videos.reduce((sum, v) => sum + v.watchPercent, 0) / videos.length);

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

      {/* KPI */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatsCard label="総視聴回数" value={totalViews.toLocaleString()} change={18} changeLabel="前月比" icon={Eye} />
        <StatsCard label="動画数" value={videos.length} icon={Video} />
        <StatsCard label="平均エンゲージメント" value={`${avgEngagement}%`} change={5} changeLabel="前月比" icon={TrendingUp} />
        <StatsCard label="平均視聴率" value={`${avgWatch}%`} change={3} changeLabel="前月比" icon={Clock} />
      </div>

      <Tabs defaultValue="library">
        <TabsList>
          <TabsTrigger value="library">ライブラリ</TabsTrigger>
          <TabsTrigger value="record">録画</TabsTrigger>
          <TabsTrigger value="editor">エディター</TabsTrigger>
          <TabsTrigger value="analytics">アナリティクス</TabsTrigger>
          <TabsTrigger value="ai-search">AI ビジュアル検索</TabsTrigger>
        </TabsList>

        {/* Library Tab */}
        <TabsContent value="library">
          <div className="space-y-4">
            <div className="w-80">
              <Input
                variant="search"
                placeholder="動画を検索..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {filtered.map((video) => (
                <Card
                  key={video.id}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    selectedVideo.id === video.id ? "ring-2 ring-[#ff4800]" : ""
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
                    <div className="absolute left-2 top-2">
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
          </div>
        </TabsContent>

        {/* Record Tab */}
        <TabsContent value="record">
          <Card>
            <CardHeader>
              <CardTitle>録画オプション</CardTitle>
              <CardDescription>ウェブカメラ、画面共有、またはその両方を選択して録画を開始</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <button className="rounded-xl border-2 border-gray-200 p-8 text-center transition-all hover:border-[#ff4800] hover:bg-orange-50">
                  <Camera className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-3 text-lg font-medium text-gray-900">ウェブカメラ</p>
                  <p className="mt-1 text-sm text-gray-500">カメラのみで録画</p>
                </button>
                <button className="rounded-xl border-2 border-gray-200 p-8 text-center transition-all hover:border-[#ff4800] hover:bg-orange-50">
                  <Monitor className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-3 text-lg font-medium text-gray-900">画面共有</p>
                  <p className="mt-1 text-sm text-gray-500">画面のみを録画</p>
                </button>
                <button className="rounded-xl border-2 border-[#ff4800] bg-orange-50 p-8 text-center transition-all">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center">
                    <Camera className="h-8 w-8 text-[#ff4800]" />
                    <Monitor className="h-8 w-8 -ml-3 text-[#ff4800]" />
                  </div>
                  <p className="mt-3 text-lg font-medium text-gray-900">両方</p>
                  <p className="mt-1 text-sm text-gray-500">カメラ + 画面共有</p>
                  <Badge variant="orange" className="mt-2">おすすめ</Badge>
                </button>
              </div>
              <div className="mt-6 flex justify-center">
                <Button size="lg">
                  <Play className="h-5 w-5 mr-2" />
                  録画を開始
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Editor Tab */}
        <TabsContent value="editor">
          <Card>
            <CardHeader>
              <CardTitle>ビデオエディター: {selectedVideo.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Editor Preview */}
              <div className="rounded-lg bg-gray-900 p-4">
                <div className="flex h-64 items-center justify-center rounded bg-gray-800 text-white/50">
                  <div className="text-center">
                    <Play className="mx-auto h-16 w-16" />
                    <p className="mt-2 text-sm">プレビュー: {selectedVideo.title}</p>
                    <p className="text-xs text-white/30">{selectedVideo.duration}</p>
                  </div>
                </div>
                {/* Timeline */}
                <div className="mt-3 rounded bg-gray-800 p-2">
                  <div className="h-8 rounded bg-gradient-to-r from-[#ff4800]/60 via-[#ff4800]/40 to-[#ff4800]/20" />
                </div>
              </div>
              {/* Editor Tools */}
              <div className="mt-4 flex flex-wrap gap-3">
                <Button variant="outline" size="sm">
                  <Scissors className="h-4 w-4 mr-1" />
                  トリミング
                </Button>
                <Button variant="outline" size="sm">
                  <Type className="h-4 w-4 mr-1" />
                  字幕追加
                </Button>
                <Button variant="outline" size="sm">
                  <Palette className="h-4 w-4 mr-1" />
                  ブランディング
                </Button>
                <Button variant="outline" size="sm">
                  <Sparkles className="h-4 w-4 mr-1" />
                  AI字幕生成
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {videos.filter(v => v.status === "published").slice(0, 6).map((video) => (
                <Card key={video.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded bg-gray-200 text-sm font-bold text-gray-500">
                        {video.thumbnail}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{video.title}</p>
                        <div className="mt-2 grid grid-cols-3 gap-2">
                          <div>
                            <p className="text-xs text-gray-500">視聴回数</p>
                            <p className="text-sm font-semibold">{video.views.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">エンゲージメント</p>
                            <p className="text-sm font-semibold">{video.engagement}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">視聴率</p>
                            <p className="text-sm font-semibold">{video.watchPercent}%</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="h-1.5 w-full rounded-full bg-gray-200">
                            <div
                              className="h-1.5 rounded-full bg-[#ff4800]"
                              style={{ width: `${video.watchPercent}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* AI Visual Search Tab */}
        <TabsContent value="ai-search">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#ff4800]" />
                <CardTitle>AIビジュアル検索</CardTitle>
              </div>
              <CardDescription>
                自然言語やキーワードで動画内の特定のシーンやコンテンツを検索
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  variant="search"
                  placeholder="例: 「価格プランを説明しているシーン」「ダッシュボードのデモ画面」..."
                />
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                  <div className="text-center">
                    <Search className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-3 text-sm text-gray-500">
                      検索キーワードを入力すると、AIが動画内の該当シーンを自動検出します
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      音声認識、画像認識、テキスト検出を組み合わせた高精度検索
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">検索例:</p>
                  <div className="flex flex-wrap gap-2">
                    {["CRMダッシュボード", "価格プラン", "API連携のデモ", "顧客インタビュー", "ROI説明"].map((example) => (
                      <button
                        key={example}
                        className="rounded-full border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
