"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Video,
  Share2,
  BarChart3,
  Plus,
} from "lucide-react";
import Link from "next/link";

const contentRemixItems = [
  { id: 1, original: "2026年のマーケティングトレンド予測", type: "ブログ記事", remixes: ["SNS投稿 x5", "メールコピー", "動画スクリプト", "インフォグラフィック"] },
  { id: 2, original: "顧客成功事例：田中商事", type: "ケーススタディ", remixes: ["LP用テキスト", "営業資料", "SNS投稿 x3"] },
  { id: 3, original: "SaaS導入ガイド", type: "ホワイトペーパー", remixes: ["ブログシリーズ x4", "ウェビナースクリプト", "メールシーケンス"] },
];

const blogPosts = [
  { title: "2026年のBtoB マーケティング最新トレンド", status: "published" as const, views: 3420, date: "2026-03-10" },
  { title: "AIを活用した営業プロセスの自動化ガイド", status: "published" as const, views: 2180, date: "2026-03-05" },
  { title: "カスタマーサクセスの測定方法", status: "draft" as const, views: 0, date: "2026-03-14" },
  { title: "効果的なリードナーチャリング戦略", status: "scheduled" as const, views: 0, date: "2026-03-18" },
];

const websitePages = [
  { title: "製品ページ", url: "/products", views: 8920, lastUpdated: "2026-03-12" },
  { title: "価格ページ", url: "/pricing", views: 5430, lastUpdated: "2026-03-08" },
  { title: "事例紹介", url: "/case-studies", views: 3210, lastUpdated: "2026-03-01" },
  { title: "お問い合わせ", url: "/contact", views: 2890, lastUpdated: "2026-02-28" },
];

const podcasts = [
  { title: "SaaSビジネスの未来 - エピソード 45", duration: "32:15", plays: 1250, date: "2026-03-12" },
  { title: "AIと営業 - エピソード 44", duration: "28:40", plays: 980, date: "2026-03-05" },
  { title: "スタートアップの成長戦略 - エピソード 43", duration: "35:20", plays: 1420, date: "2026-02-26" },
];

const statusConfig = {
  published: { label: "公開中", variant: "success" as const },
  draft: { label: "下書き", variant: "default" as const },
  scheduled: { label: "予約済み", variant: "info" as const },
};

export default function ContentPage() {
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("all");
  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);

  const savedViews = [
    { key: "all", label: "すべて" },
    { key: "blog", label: "ブログ" },
    { key: "pages", label: "ページ" },
  ];

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
      <PageHeader title="コンテンツHub" description="コンテンツの作成、管理、最適化を一元管理" breadcrumbs={[{ label: "ホーム", href: "/" }, { label: "コンテンツ" }]} actions={<Button size="sm"><PenTool className="h-4 w-4 mr-1" />コンテンツ作成</Button>} />

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 px-1">
        {savedViews.map((v) => (
          <button key={v.key} onClick={() => setActiveView(v.key)} className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${activeView === v.key ? "border-[#ff4800] text-[#1f1f1f]" : "border-transparent text-gray-500 hover:text-gray-700"}`}>{v.label}</button>
        ))}
        <button className="ml-1 p-1.5 text-gray-400 hover:text-gray-600 rounded"><Plus className="h-4 w-4" /></button>
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><div className="flex items-center justify-between"><div className="flex items-center gap-2"><PenTool className="h-5 w-5 text-[#ff4800]" /><CardTitle>ブログ記事</CardTitle></div><Link href="/blog"><Button variant="ghost" size="sm">すべて見る <ArrowRight className="ml-1 h-4 w-4" /></Button></Link></div></CardHeader>
          <CardContent><div className="space-y-3">{blogPosts.map((post, i) => (<div key={i} className="flex items-center justify-between rounded-lg border border-gray-100 p-3"><div><p className="text-sm font-medium text-gray-900">{post.title}</p><div className="mt-1 flex items-center gap-2"><Badge variant={statusConfig[post.status].variant}>{statusConfig[post.status].label}</Badge><span className="text-xs text-gray-500">{post.date}</span></div></div>{post.views > 0 && (<div className="text-right"><p className="text-sm font-semibold text-gray-900">{post.views.toLocaleString()}</p><p className="text-xs text-gray-500">views</p></div>)}</div>))}</div></CardContent>
        </Card>

        <Card>
          <CardHeader><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Globe className="h-5 w-5 text-[#ff4800]" /><CardTitle>ウェブサイトページ</CardTitle></div><Link href="/website-pages"><Button variant="ghost" size="sm">すべて見る <ArrowRight className="ml-1 h-4 w-4" /></Button></Link></div></CardHeader>
          <CardContent><div className="space-y-3">{websitePages.map((page, i) => (<div key={i} className="flex items-center justify-between rounded-lg border border-gray-100 p-3"><div><p className="text-sm font-medium text-gray-900">{page.title}</p><p className="text-xs text-gray-500">{page.url} - 最終更新: {page.lastUpdated}</p></div><div className="text-right"><p className="text-sm font-semibold text-gray-900">{page.views.toLocaleString()}</p><p className="text-xs text-gray-500">views</p></div></div>))}</div></CardContent>
        </Card>

        <Card>
          <CardHeader><div className="flex items-center gap-2"><Headphones className="h-5 w-5 text-[#ff4800]" /><CardTitle>ポッドキャスト</CardTitle></div></CardHeader>
          <CardContent><div className="space-y-3">{podcasts.map((podcast, i) => (<div key={i} className="flex items-center justify-between rounded-lg border border-gray-100 p-3"><div><p className="text-sm font-medium text-gray-900">{podcast.title}</p><p className="text-xs text-gray-500">{podcast.date} - {podcast.duration}</p></div><div className="text-right"><p className="text-sm font-semibold text-gray-900">{podcast.plays.toLocaleString()}</p><p className="text-xs text-gray-500">再生</p></div></div>))}</div></CardContent>
        </Card>

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
    </div>
  );
}
