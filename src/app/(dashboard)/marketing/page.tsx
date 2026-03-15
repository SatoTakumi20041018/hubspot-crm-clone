"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  MousePointerClick,
  Eye,
  FileText,
  BarChart3,
  ArrowUpRight,
  TrendingUp,
  Send,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

const kpis = [
  {
    label: "メール送信数",
    value: "12,450",
    change: "+18.2%",
    icon: Send,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "開封率",
    value: "24.8%",
    change: "+3.2%",
    icon: Mail,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    label: "クリック率",
    value: "4.2%",
    change: "+0.8%",
    icon: MousePointerClick,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    label: "フォーム送信",
    value: "328",
    change: "+15.4%",
    icon: FileText,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    label: "ランディングページ閲覧",
    value: "8,920",
    change: "+22.1%",
    icon: Eye,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
  },
];

const emailCampaigns = [
  {
    id: 1,
    name: "3月ニュースレター",
    status: "送信済み",
    sentDate: "2026-03-10",
    recipients: 2450,
    openRate: 28.5,
    clickRate: 5.2,
    bounceRate: 1.2,
  },
  {
    id: 2,
    name: "新製品リリース案内",
    status: "送信済み",
    sentDate: "2026-03-05",
    recipients: 3200,
    openRate: 32.1,
    clickRate: 8.4,
    bounceRate: 0.8,
  },
  {
    id: 3,
    name: "セミナー招待メール",
    status: "送信済み",
    sentDate: "2026-02-28",
    recipients: 1800,
    openRate: 22.3,
    clickRate: 4.6,
    bounceRate: 1.5,
  },
  {
    id: 4,
    name: "4月キャンペーン予告",
    status: "下書き",
    sentDate: "-",
    recipients: 0,
    openRate: 0,
    clickRate: 0,
    bounceRate: 0,
  },
  {
    id: 5,
    name: "リード育成メール #5",
    status: "予約済み",
    sentDate: "2026-03-20",
    recipients: 1200,
    openRate: 0,
    clickRate: 0,
    bounceRate: 0,
  },
  {
    id: 6,
    name: "2月ニュースレター",
    status: "送信済み",
    sentDate: "2026-02-10",
    recipients: 2300,
    openRate: 25.8,
    clickRate: 3.9,
    bounceRate: 1.1,
  },
];

const forms = [
  {
    id: 1,
    name: "お問い合わせフォーム",
    submissions: 145,
    views: 2340,
    conversionRate: 6.2,
    status: "公開中",
  },
  {
    id: 2,
    name: "資料ダウンロード",
    submissions: 89,
    views: 1560,
    conversionRate: 5.7,
    status: "公開中",
  },
  {
    id: 3,
    name: "セミナー申込",
    submissions: 52,
    views: 890,
    conversionRate: 5.8,
    status: "公開中",
  },
  {
    id: 4,
    name: "無料トライアル申込",
    submissions: 42,
    views: 1200,
    conversionRate: 3.5,
    status: "公開中",
  },
];

const landingPages = [
  {
    id: 1,
    name: "製品紹介ページ",
    views: 3450,
    submissions: 128,
    conversionRate: 3.7,
    status: "公開中",
    url: "/products",
  },
  {
    id: 2,
    name: "セミナー申込ページ",
    views: 1890,
    submissions: 52,
    conversionRate: 2.8,
    status: "公開中",
    url: "/seminar",
  },
  {
    id: 3,
    name: "ホワイトペーパーDL",
    views: 2120,
    submissions: 89,
    conversionRate: 4.2,
    status: "公開中",
    url: "/whitepaper",
  },
  {
    id: 4,
    name: "キャンペーンLP（4月）",
    views: 0,
    submissions: 0,
    conversionRate: 0,
    status: "下書き",
    url: "/campaign-apr",
  },
];

const statusBadge = (status: string) => {
  switch (status) {
    case "送信済み":
    case "公開中":
      return <Badge variant="success">{status}</Badge>;
    case "下書き":
      return <Badge variant="default">{status}</Badge>;
    case "予約済み":
      return <Badge variant="info">{status}</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export default function MarketingPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">マーケティング</h1>
        <p className="text-sm text-gray-500 mt-1">
          マーケティング活動の概要
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${kpi.bg}`}
                  >
                    <Icon className={`h-5 w-5 ${kpi.color}`} />
                  </div>
                  <div className="flex items-center gap-0.5 text-green-600">
                    <ArrowUpRight className="h-3 w-3" />
                    <span className="text-xs font-medium">{kpi.change}</span>
                  </div>
                </div>
                <p className="text-xl font-bold text-gray-900">{kpi.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Email Campaigns */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>メールキャンペーン</CardTitle>
            <Link
              href="/email"
              className="text-sm text-[#ff4800] hover:underline"
            >
              すべて表示
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left font-medium text-gray-500">
                    キャンペーン名
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">
                    ステータス
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">
                    送信日
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">
                    送信数
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">
                    開封率
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">
                    クリック率
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">
                    バウンス率
                  </th>
                </tr>
              </thead>
              <tbody>
                {emailCampaigns.map((campaign) => (
                  <tr
                    key={campaign.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-3 font-medium text-gray-900">
                      {campaign.name}
                    </td>
                    <td className="px-4 py-3">
                      {statusBadge(campaign.status)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {campaign.sentDate}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {campaign.recipients > 0
                        ? campaign.recipients.toLocaleString()
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {campaign.openRate > 0 ? `${campaign.openRate}%` : "-"}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {campaign.clickRate > 0 ? `${campaign.clickRate}%` : "-"}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {campaign.bounceRate > 0
                        ? `${campaign.bounceRate}%`
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Forms and Landing Pages */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Forms */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>フォーム</CardTitle>
              <Link
                href="/forms"
                className="text-sm text-[#ff4800] hover:underline"
              >
                すべて表示
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {forms.map((form) => (
                <div
                  key={form.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded bg-orange-50 text-orange-600">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {form.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {form.submissions}件送信 / {form.views}回表示
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {form.conversionRate}%
                    </p>
                    <p className="text-xs text-gray-500">CVR</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Landing Pages */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>ランディングページ</CardTitle>
              <Link
                href="/landing-pages"
                className="text-sm text-[#ff4800] hover:underline"
              >
                すべて表示
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {landingPages.map((page) => (
                <div
                  key={page.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded bg-cyan-50 text-cyan-600">
                      <ExternalLink className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900">
                          {page.name}
                        </p>
                        {statusBadge(page.status)}
                      </div>
                      <p className="text-xs text-gray-500">
                        {page.views > 0
                          ? `${page.views.toLocaleString()}回閲覧 / ${page.submissions}件送信`
                          : "未公開"}
                      </p>
                    </div>
                  </div>
                  {page.conversionRate > 0 && (
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {page.conversionRate}%
                      </p>
                      <p className="text-xs text-gray-500">CVR</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
