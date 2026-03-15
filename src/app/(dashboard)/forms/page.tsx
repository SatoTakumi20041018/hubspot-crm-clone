"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import {
  Plus,
  FileText,
  Eye,
  ArrowUpDown,
  MoreHorizontal,
  MousePointerClick,
  Clock,
  BarChart3,
} from "lucide-react";

interface Form {
  id: string;
  name: string;
  type: "埋め込み" | "ポップアップ" | "バナー" | "スタンドアロン";
  submissions: number;
  views: number;
  conversionRate: number;
  lastSubmission: string;
  status: "公開中" | "下書き" | "非公開";
  createdAt: string;
}

const forms: Form[] = [
  {
    id: "f1",
    name: "お問い合わせフォーム",
    type: "埋め込み",
    submissions: 342,
    views: 5680,
    conversionRate: 6.02,
    lastSubmission: "2026-03-14",
    status: "公開中",
    createdAt: "2025-06-15",
  },
  {
    id: "f2",
    name: "資料ダウンロードフォーム",
    type: "ポップアップ",
    submissions: 189,
    views: 3240,
    conversionRate: 5.83,
    lastSubmission: "2026-03-14",
    status: "公開中",
    createdAt: "2025-08-01",
  },
  {
    id: "f3",
    name: "セミナー申込フォーム",
    type: "スタンドアロン",
    submissions: 87,
    views: 1560,
    conversionRate: 5.58,
    lastSubmission: "2026-03-13",
    status: "公開中",
    createdAt: "2026-01-10",
  },
  {
    id: "f4",
    name: "無料トライアル申込",
    type: "埋め込み",
    submissions: 156,
    views: 4200,
    conversionRate: 3.71,
    lastSubmission: "2026-03-14",
    status: "公開中",
    createdAt: "2025-09-01",
  },
  {
    id: "f5",
    name: "ニュースレター登録",
    type: "バナー",
    submissions: 534,
    views: 12400,
    conversionRate: 4.31,
    lastSubmission: "2026-03-14",
    status: "公開中",
    createdAt: "2025-07-01",
  },
  {
    id: "f6",
    name: "カスタマーフィードバック",
    type: "埋め込み",
    submissions: 67,
    views: 890,
    conversionRate: 7.53,
    lastSubmission: "2026-03-12",
    status: "公開中",
    createdAt: "2026-02-01",
  },
  {
    id: "f7",
    name: "パートナー申請フォーム",
    type: "スタンドアロン",
    submissions: 23,
    views: 456,
    conversionRate: 5.04,
    lastSubmission: "2026-03-10",
    status: "公開中",
    createdAt: "2026-01-20",
  },
  {
    id: "f8",
    name: "キャンペーン応募（4月）",
    type: "ポップアップ",
    submissions: 0,
    views: 0,
    conversionRate: 0,
    lastSubmission: "-",
    status: "下書き",
    createdAt: "2026-03-12",
  },
  {
    id: "f9",
    name: "採用エントリーフォーム",
    type: "スタンドアロン",
    submissions: 45,
    views: 1200,
    conversionRate: 3.75,
    lastSubmission: "2026-03-11",
    status: "公開中",
    createdAt: "2025-11-01",
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

const typeBadgeVariant = (type: string) => {
  switch (type) {
    case "埋め込み": return "info" as const;
    case "ポップアップ": return "purple" as const;
    case "バナー": return "warning" as const;
    case "スタンドアロン": return "default" as const;
    default: return "default" as const;
  }
};

export default function FormsPage() {
  const [search, setSearch] = useState("");

  const filtered = forms.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalSubmissions = forms.reduce((s, f) => s + f.submissions, 0);
  const totalViews = forms.reduce((s, f) => s + f.views, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="フォーム"
        description="リードキャプチャフォームの管理"
        actions={
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            フォーム作成
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalSubmissions.toLocaleString()}</p>
                <p className="text-xs text-gray-500">総送信数</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <Eye className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
                <p className="text-xs text-gray-500">総表示数</p>
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
                  {totalViews > 0 ? ((totalSubmissions / totalViews) * 100).toFixed(1) : 0}%
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
          placeholder="フォーム名で検索..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Forms Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                    フォーム名
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">タイプ</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">ステータス</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">
                  <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-gray-700">
                    送信数
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">表示数</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">CVR</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">最終送信</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((form) => (
                <tr key={form.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-orange-500 flex-shrink-0" />
                      <span className="font-medium text-gray-900 hover:text-[#FF7A59] cursor-pointer">
                        {form.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={typeBadgeVariant(form.type)}>{form.type}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusBadgeVariant(form.status)}>{form.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    {form.submissions > 0 ? form.submissions.toLocaleString() : "-"}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {form.views > 0 ? form.views.toLocaleString() : "-"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {form.conversionRate > 0 ? (
                      <div className="flex items-center justify-end gap-1">
                        <MousePointerClick className="h-3 w-3 text-gray-400" />
                        <span className="font-medium text-gray-900">{form.conversionRate}%</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {form.lastSubmission}
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
  );
}
