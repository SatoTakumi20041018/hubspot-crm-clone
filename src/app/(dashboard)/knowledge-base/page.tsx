"use client";

import { useState } from "react";
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
  {
    id: "kb1",
    title: "CRM初期設定ガイド",
    category: "はじめに",
    status: "公開中",
    views: 2340,
    helpfulRate: 92,
    lastUpdated: "2026-03-10",
    author: "佐藤 匠",
  },
  {
    id: "kb2",
    title: "コンタクトのインポート方法",
    category: "CRM",
    status: "公開中",
    views: 1856,
    helpfulRate: 88,
    lastUpdated: "2026-03-08",
    author: "田村 愛",
  },
  {
    id: "kb3",
    title: "パイプラインの設定と管理",
    category: "セールス",
    status: "公開中",
    views: 1234,
    helpfulRate: 95,
    lastUpdated: "2026-03-05",
    author: "佐藤 匠",
  },
  {
    id: "kb4",
    title: "メールテンプレートの作成方法",
    category: "マーケティング",
    status: "公開中",
    views: 987,
    helpfulRate: 90,
    lastUpdated: "2026-02-28",
    author: "田村 愛",
  },
  {
    id: "kb5",
    title: "ワークフローの自動化入門",
    category: "マーケティング",
    status: "公開中",
    views: 1567,
    helpfulRate: 85,
    lastUpdated: "2026-03-01",
    author: "佐藤 匠",
  },
  {
    id: "kb6",
    title: "チケットの作成とSLA設定",
    category: "サービス",
    status: "公開中",
    views: 876,
    helpfulRate: 91,
    lastUpdated: "2026-02-25",
    author: "田村 愛",
  },
  {
    id: "kb7",
    title: "カスタムレポートの作成方法",
    category: "レポート",
    status: "レビュー中",
    views: 0,
    helpfulRate: 0,
    lastUpdated: "2026-03-12",
    author: "佐藤 匠",
  },
  {
    id: "kb8",
    title: "APIキーの取得と認証方法",
    category: "API",
    status: "公開中",
    views: 654,
    helpfulRate: 87,
    lastUpdated: "2026-02-20",
    author: "佐藤 匠",
  },
  {
    id: "kb9",
    title: "Slack連携の設定手順",
    category: "インテグレーション",
    status: "公開中",
    views: 1123,
    helpfulRate: 93,
    lastUpdated: "2026-03-03",
    author: "田村 愛",
  },
  {
    id: "kb10",
    title: "ログインできない場合の対処法",
    category: "トラブルシューティング",
    status: "公開中",
    views: 3456,
    helpfulRate: 78,
    lastUpdated: "2026-03-11",
    author: "佐藤 匠",
  },
  {
    id: "kb11",
    title: "二要素認証の設定方法",
    category: "アカウント管理",
    status: "下書き",
    views: 0,
    helpfulRate: 0,
    lastUpdated: "2026-03-13",
    author: "田村 愛",
  },
  {
    id: "kb12",
    title: "データエクスポートのトラブルシューティング",
    category: "トラブルシューティング",
    status: "公開中",
    views: 789,
    helpfulRate: 82,
    lastUpdated: "2026-02-18",
    author: "佐藤 匠",
  },
];

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case "公開中": return "success" as const;
    case "下書き": return "default" as const;
    case "レビュー中": return "warning" as const;
    default: return "default" as const;
  }
};

export default function KnowledgeBasePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("すべて");

  const filtered = articles.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === "すべて" || a.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="ナレッジベース"
        description="ヘルプ記事とドキュメントの管理"
        actions={
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            記事作成
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Category Sidebar */}
        <Card className="lg:col-span-1">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">カテゴリ</h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory("すべて")}
                className={`flex items-center justify-between w-full rounded-md px-3 py-2 text-sm transition-colors ${
                  selectedCategory === "すべて"
                    ? "bg-[#FFF1ED] text-[#FF7A59] font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  すべて
                </div>
                <span className="text-xs">{articles.length}</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex items-center justify-between w-full rounded-md px-3 py-2 text-sm transition-colors ${
                    selectedCategory === cat.name
                      ? "bg-[#FFF1ED] text-[#FF7A59] font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4" />
                    {cat.name}
                  </div>
                  <span className="text-xs">{cat.count}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Articles List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="w-full max-w-md">
            <Input
              variant="search"
              placeholder="記事を検索..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left font-medium text-gray-500">
                      <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                        タイトル
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">カテゴリ</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">ステータス</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">
                      <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-gray-700">
                        閲覧数
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">役立ち度</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">最終更新</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((article) => (
                    <tr key={article.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <span className="font-medium text-gray-900 hover:text-[#FF7A59] cursor-pointer">
                            {article.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="default">{article.category}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusBadgeVariant(article.status)}>{article.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1 text-gray-600">
                          <Eye className="h-3 w-3" />
                          {article.views > 0 ? article.views.toLocaleString() : "-"}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {article.helpfulRate > 0 ? (
                          <div className="flex items-center justify-end gap-1 text-gray-600">
                            <ThumbsUp className="h-3 w-3" />
                            {article.helpfulRate}%
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {article.lastUpdated}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
