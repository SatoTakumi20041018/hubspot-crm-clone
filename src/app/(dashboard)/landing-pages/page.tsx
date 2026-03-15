"use client";

import { useState } from "react";
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
  {
    id: "lp1",
    title: "製品紹介ページ",
    url: "/lp/products",
    status: "公開中",
    views: 12450,
    conversions: 461,
    cvr: 3.7,
    createdAt: "2025-08-01",
    lastUpdated: "2026-03-10",
  },
  {
    id: "lp2",
    title: "無料トライアル申込ページ",
    url: "/lp/free-trial",
    status: "公開中",
    views: 8900,
    conversions: 445,
    cvr: 5.0,
    createdAt: "2025-09-15",
    lastUpdated: "2026-03-05",
  },
  {
    id: "lp3",
    title: "ウェビナー申込ページ",
    url: "/lp/webinar-march",
    status: "公開中",
    views: 3450,
    conversions: 173,
    cvr: 5.01,
    createdAt: "2026-02-20",
    lastUpdated: "2026-03-01",
  },
  {
    id: "lp4",
    title: "ホワイトペーパーダウンロード",
    url: "/lp/whitepaper-2026",
    status: "公開中",
    views: 5600,
    conversions: 392,
    cvr: 7.0,
    createdAt: "2026-01-10",
    lastUpdated: "2026-02-25",
  },
  {
    id: "lp5",
    title: "導入事例集ダウンロード",
    url: "/lp/case-studies",
    status: "公開中",
    views: 4200,
    conversions: 252,
    cvr: 6.0,
    createdAt: "2025-11-01",
    lastUpdated: "2026-03-08",
  },
  {
    id: "lp6",
    title: "春のキャンペーンLP",
    url: "/lp/spring-campaign",
    status: "下書き",
    views: 0,
    conversions: 0,
    cvr: 0,
    createdAt: "2026-03-12",
    lastUpdated: "2026-03-14",
  },
  {
    id: "lp7",
    title: "料金プラン比較ページ",
    url: "/lp/pricing",
    status: "公開中",
    views: 15600,
    conversions: 468,
    cvr: 3.0,
    createdAt: "2025-07-01",
    lastUpdated: "2026-02-15",
  },
  {
    id: "lp8",
    title: "パートナー募集ページ",
    url: "/lp/partner",
    status: "公開中",
    views: 2100,
    conversions: 63,
    cvr: 3.0,
    createdAt: "2026-01-20",
    lastUpdated: "2026-02-20",
  },
  {
    id: "lp9",
    title: "年末キャンペーンLP（2025）",
    url: "/lp/year-end-2025",
    status: "非公開",
    views: 8400,
    conversions: 504,
    cvr: 6.0,
    createdAt: "2025-11-15",
    lastUpdated: "2025-12-31",
  },
];

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case "公開中": return "success" as const;
    case "下書き": return "default" as const;
    case "非公開": return "warning" as const;
    default: return "default" as const;
  }
};

export default function LandingPagesPage() {
  const [search, setSearch] = useState("");

  const filtered = pages.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.url.toLowerCase().includes(search.toLowerCase())
  );

  const totalViews = pages.filter((p) => p.status === "公開中").reduce((s, p) => s + p.views, 0);
  const totalConversions = pages.filter((p) => p.status === "公開中").reduce((s, p) => s + p.conversions, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="ランディングページ"
        description="ランディングページの作成・管理"
        actions={
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            ランディングページ作成
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
                <p className="text-xs text-gray-500">総閲覧数</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <MousePointerClick className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalConversions.toLocaleString()}</p>
                <p className="text-xs text-gray-500">総コンバージョン</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {totalViews > 0 ? ((totalConversions / totalViews) * 100).toFixed(1) : 0}%
                </p>
                <p className="text-xs text-gray-500">平均CVR</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="w-72">
        <Input
          variant="search"
          placeholder="ページ名、URLで検索..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Pages Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                    タイトル
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">ステータス</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">
                  <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-gray-700">
                    閲覧数
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">CV数</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">
                  <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-gray-700">
                    CVR
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">最終更新</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((page) => (
                <tr key={page.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                  <td className="px-4 py-3">
                    <input type="checkbox" className="rounded border-gray-300" onClick={(e) => e.stopPropagation()} />
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900 hover:text-[#FF7A59] cursor-pointer">{page.title}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <ExternalLink className="h-3 w-3" />
                        {page.url}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusBadgeVariant(page.status)}>{page.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {page.views > 0 ? page.views.toLocaleString() : "-"}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {page.conversions > 0 ? page.conversions.toLocaleString() : "-"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {page.cvr > 0 ? (
                      <span className="font-medium text-gray-900">{page.cvr}%</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{page.lastUpdated}</td>
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
  );
}
