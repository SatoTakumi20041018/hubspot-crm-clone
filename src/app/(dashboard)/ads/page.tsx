"use client";

import { useState, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import {
  Plus,
  Megaphone,
  DollarSign,
  MousePointerClick,
  TrendingUp,
  ArrowUpRight,
  MoreHorizontal,
  BarChart3,
  ArrowUpDown,
  Search,
} from "lucide-react";

interface AdCampaign {
  id: string;
  name: string;
  platform: "Google Ads" | "Facebook Ads" | "LinkedIn Ads" | "Instagram Ads";
  status: "有効" | "停止中" | "完了";
  budget: number;
  spent: number;
  clicks: number;
  impressions: number;
  conversions: number;
  roi: number;
  cpc: number;
}

const campaigns: AdCampaign[] = [
  {
    id: "ad1",
    name: "CRM プロダクト認知キャンペーン",
    platform: "Google Ads",
    status: "有効",
    budget: 500000,
    spent: 342000,
    clicks: 4560,
    impressions: 125000,
    conversions: 89,
    roi: 245,
    cpc: 75,
  },
  {
    id: "ad2",
    name: "リード獲得キャンペーン - IT業界",
    platform: "LinkedIn Ads",
    status: "有効",
    budget: 300000,
    spent: 218000,
    clicks: 1890,
    impressions: 45000,
    conversions: 56,
    roi: 312,
    cpc: 115,
  },
  {
    id: "ad3",
    name: "リターゲティング - サイト訪問者",
    platform: "Facebook Ads",
    status: "有効",
    budget: 200000,
    spent: 167000,
    clicks: 3200,
    impressions: 89000,
    conversions: 42,
    roi: 198,
    cpc: 52,
  },
  {
    id: "ad4",
    name: "ウェビナー集客キャンペーン",
    platform: "Google Ads",
    status: "完了",
    budget: 150000,
    spent: 148000,
    clicks: 2100,
    impressions: 67000,
    conversions: 34,
    roi: 178,
    cpc: 70,
  },
  {
    id: "ad5",
    name: "ブランド認知 - Instagram",
    platform: "Instagram Ads",
    status: "有効",
    budget: 180000,
    spent: 95000,
    clicks: 2800,
    impressions: 156000,
    conversions: 28,
    roi: 156,
    cpc: 34,
  },
  {
    id: "ad6",
    name: "導入事例プロモーション",
    platform: "LinkedIn Ads",
    status: "停止中",
    budget: 250000,
    spent: 123000,
    clicks: 1100,
    impressions: 32000,
    conversions: 18,
    roi: 134,
    cpc: 112,
  },
];

const totalSpent = campaigns.reduce((s, c) => s + c.spent, 0);
const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0);
const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);
const avgRoi = Math.round(campaigns.reduce((s, c) => s + c.roi, 0) / campaigns.length);

const platformColors: Record<string, { color: string; bg: string }> = {
  "Google Ads": { color: "text-blue-600", bg: "bg-blue-50" },
  "Facebook Ads": { color: "text-blue-700", bg: "bg-blue-50" },
  "LinkedIn Ads": { color: "text-sky-700", bg: "bg-sky-50" },
  "Instagram Ads": { color: "text-pink-600", bg: "bg-pink-50" },
};

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case "有効": return "success" as const;
    case "停止中": return "default" as const;
    case "完了": return "info" as const;
    default: return "default" as const;
  }
};

// Performance chart data
const performanceData = [
  { week: "W1", clicks: 2800, conversions: 38 },
  { week: "W2", clicks: 3200, conversions: 45 },
  { week: "W3", clicks: 3600, conversions: 52 },
  { week: "W4", clicks: 4100, conversions: 58 },
  { week: "W5", clicks: 3800, conversions: 48 },
  { week: "W6", clicks: 4200, conversions: 62 },
];
const maxClicks = Math.max(...performanceData.map((d) => d.clicks));

export default function AdsPage() {
  const [activeView, setActiveView] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };
  const sortedCampaigns = [...campaigns].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = String((a as unknown as Record<string,unknown>)[sortField] ?? "");
    const bVal = String((b as unknown as Record<string,unknown>)[sortField] ?? "");
    return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  const views = [
    { key: "all", label: "すべてのキャンペーン" },
    { key: "active", label: "アクティブ" },
  ];
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const filteredCampaigns = sortedCampaigns.filter(item => {
    if (searchQuery && !JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });
  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  const paginatedItems = filteredCampaigns.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


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
        title="広告管理"
        description="広告キャンペーンのパフォーマンスを一元管理"
        actions={
          <Button size="sm" onClick={() => alert("キャンペーン作成は準備中です")}>
            <Plus className="h-4 w-4 mr-1" />
            キャンペーン作成
          </Button>
        }
      />

      <div className="flex items-center gap-1 border-b border-gray-200 px-1 mb-4">
        {views.map((v) => (
          <button key={v.key} onClick={() => setActiveView(v.key)}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeView === v.key ? "border-[#ff4800] text-[#1f1f1f]" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>{v.label}</button>
        ))}
        <button className="ml-1 p-1.5 text-gray-400 hover:text-gray-600 rounded"><Plus className="h-4 w-4" /></button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex items-center gap-0.5 text-green-600">
                <ArrowUpRight className="h-3 w-3" />
                <span className="text-xs font-medium">+12.3%</span>
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900">¥{(totalSpent / 10000).toLocaleString()}万</p>
            <p className="text-xs text-gray-500 mt-0.5">総消化額</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50">
                <MousePointerClick className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900">{totalClicks.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-0.5">総クリック数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900">{totalConversions}</p>
            <p className="text-xs text-gray-500 mt-0.5">総コンバージョン</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50">
                <Megaphone className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900">{avgRoi}%</p>
            <p className="text-xs text-gray-500 mt-0.5">平均ROI</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-gray-400" />
            週間パフォーマンス推移
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4 h-40">
            {performanceData.map((d) => (
              <div key={d.week} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-gray-500">{d.clicks}</span>
                <div className="w-full flex items-end" style={{ height: "120px" }}>
                  <div
                    className="w-full rounded-t bg-[#ff4800] hover:bg-[#e64200] transition-colors"
                    style={{ height: `${(d.clicks / maxClicks) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">{d.week}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Campaign Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>キャンペーン一覧</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="検索..." className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-[#ff4800]/20 focus:border-[#ff4800]" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("name")}><div className="flex items-center gap-1">キャンペーン名 <ArrowUpDown className="h-3 w-3" /></div></th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("platform")}><div className="flex items-center gap-1">プラットフォーム <ArrowUpDown className="h-3 w-3" /></div></th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("status")}><div className="flex items-center gap-1">ステータス <ArrowUpDown className="h-3 w-3" /></div></th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">予算</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">消化額</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">クリック</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">CV</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">ROI</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.map((campaign) => {
                  const pConfig = platformColors[campaign.platform];
                  const spentPercent = Math.round((campaign.spent / campaign.budget) * 100);
                  return (
                    <tr key={campaign.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-3 font-medium text-gray-900">{campaign.name}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium ${pConfig.color} ${pConfig.bg} rounded px-2 py-1`}>
                          {campaign.platform}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusBadgeVariant(campaign.status)}>{campaign.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">
                        ¥{campaign.budget.toLocaleString()}
                        <div className="h-1.5 w-16 rounded-full bg-gray-100 mt-1 ml-auto">
                          <div
                            className={`h-1.5 rounded-full ${spentPercent > 90 ? "bg-red-400" : spentPercent > 70 ? "bg-yellow-400" : "bg-green-400"}`}
                            style={{ width: `${Math.min(spentPercent, 100)}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        ¥{campaign.spent.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">{campaign.clicks.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{campaign.conversions}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-medium ${campaign.roi >= 200 ? "text-green-600" : campaign.roi >= 150 ? "text-yellow-600" : "text-gray-600"}`}>
                          {campaign.roi}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 mt-2">
                <p className="text-sm text-gray-500">{sortedCampaigns.length}件中 {(currentPage-1)*itemsPerPage+1}〜{Math.min(currentPage*itemsPerPage, sortedCampaigns.length)}件</p>
                <div className="flex gap-1">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage===1} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">前へ</button>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage===totalPages} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">次へ</button>
                </div>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
