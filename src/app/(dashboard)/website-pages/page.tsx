"use client";

import { useState } from "react";
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

export default function WebsitePagesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showTemplates, setShowTemplates] = useState(false);

  const filtered = pages.filter((p) => {
    const matchSearch = p.title.includes(search) || p.url.includes(search);
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalViews = pages.reduce((sum, p) => sum + p.views, 0);

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
            ページ作成
          </Button>
        }
      />

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
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-medium text-gray-500">ページ名</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">URL</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">テンプレート</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">ステータス</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">最終更新</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">PV</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((page) => (
                <tr key={page.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900 hover:text-[#ff4800] cursor-pointer">
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
                    <div className="flex items-center gap-1">
                      <button className="rounded p-1 text-gray-400 hover:bg-gray-100" title="編集">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button className="rounded p-1 text-gray-400 hover:bg-gray-100" title="複製">
                        <Copy className="h-4 w-4" />
                      </button>
                      <button className="rounded p-1 text-gray-400 hover:bg-gray-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-gray-200 px-4 py-3">
          <p className="text-sm text-gray-500">{filtered.length}件のページを表示</p>
        </div>
      </Card>
    </div>
  );
}
