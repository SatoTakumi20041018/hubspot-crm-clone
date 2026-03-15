"use client";

import { useState, useEffect, useRef } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Search,
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
  ArrowUpDown,
  Plus,
  X,
  Download,
} from "lucide-react";
import Link from "next/link";

const kpis = [
  { label: "メール送信数", value: "12,450", change: "+18.2%", icon: Send, color: "text-blue-600", bg: "bg-blue-50", tooltip: "過去30日間に送信したメールの合計数" },
  { label: "開封率", value: "24.8%", change: "+3.2%", icon: Mail, color: "text-green-600", bg: "bg-green-50", tooltip: "送信済みメールのうち開封された割合（過去30日間）" },
  { label: "クリック率", value: "4.2%", change: "+0.8%", icon: MousePointerClick, color: "text-purple-600", bg: "bg-purple-50", tooltip: "開封されたメールのうちリンクがクリックされた割合" },
  { label: "フォーム送信", value: "328", change: "+15.4%", icon: FileText, color: "text-orange-600", bg: "bg-orange-50", tooltip: "過去30日間のフォーム送信数の合計" },
  { label: "ランディングページ閲覧", value: "8,920", change: "+22.1%", icon: Eye, color: "text-cyan-600", bg: "bg-cyan-50", tooltip: "過去30日間のランディングページ閲覧数の合計" },
];

const emailCampaigns = [
  { id: 1, name: "3月ニュースレター", status: "送信済み", sentDate: "2026-03-10", recipients: 2450, openRate: 28.5, clickRate: 5.2, bounceRate: 1.2 },
  { id: 2, name: "新製品リリース案内", status: "送信済み", sentDate: "2026-03-05", recipients: 3200, openRate: 32.1, clickRate: 8.4, bounceRate: 0.8 },
  { id: 3, name: "セミナー招待メール", status: "送信済み", sentDate: "2026-02-28", recipients: 1800, openRate: 22.3, clickRate: 4.6, bounceRate: 1.5 },
  { id: 4, name: "4月キャンペーン予告", status: "下書き", sentDate: "-", recipients: 0, openRate: 0, clickRate: 0, bounceRate: 0 },
  { id: 5, name: "リード育成メール #5", status: "予約済み", sentDate: "2026-03-20", recipients: 1200, openRate: 0, clickRate: 0, bounceRate: 0 },
  { id: 6, name: "2月ニュースレター", status: "送信済み", sentDate: "2026-02-10", recipients: 2300, openRate: 25.8, clickRate: 3.9, bounceRate: 1.1 },
];

const forms = [
  { id: 1, name: "お問い合わせフォーム", submissions: 145, views: 2340, conversionRate: 6.2, status: "公開中" },
  { id: 2, name: "資料ダウンロード", submissions: 89, views: 1560, conversionRate: 5.7, status: "公開中" },
  { id: 3, name: "セミナー申込", submissions: 52, views: 890, conversionRate: 5.8, status: "公開中" },
  { id: 4, name: "無料トライアル申込", submissions: 42, views: 1200, conversionRate: 3.5, status: "公開中" },
];

const landingPages = [
  { id: 1, name: "製品紹介ページ", views: 3450, submissions: 128, conversionRate: 3.7, status: "公開中", url: "/products" },
  { id: 2, name: "セミナー申込ページ", views: 1890, submissions: 52, conversionRate: 2.8, status: "公開中", url: "/seminar" },
  { id: 3, name: "ホワイトペーパーDL", views: 2120, submissions: 89, conversionRate: 4.2, status: "公開中", url: "/whitepaper" },
  { id: 4, name: "キャンペーンLP（4月）", views: 0, submissions: 0, conversionRate: 0, status: "下書き", url: "/campaign-apr" },
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

function RowActions() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600" onClick={(e) => { e.stopPropagation(); setOpen(!open); }}>
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-50 w-44 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={(e) => { e.stopPropagation(); alert("編集"); setOpen(false); }}><Pencil className="h-3.5 w-3.5" /> 編集</button>
          <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={(e) => { e.stopPropagation(); alert("複製"); setOpen(false); }}><Copy className="h-3.5 w-3.5" /> 複製</button>
          <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); alert("削除"); setOpen(false); }}><Trash2 className="h-3.5 w-3.5" /> 削除</button>
        </div>
      )}
    </div>
  );
}

export default function MarketingPage() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };
  const sortedCampaigns = [...emailCampaigns].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = String((a as unknown as Record<string, unknown>)[sortField] ?? "");
    const bVal = String((b as unknown as Record<string, unknown>)[sortField] ?? "");
    return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const filteredCampaigns = sortedCampaigns.filter(item => {
    if (searchQuery && !JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });
  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  const paginatedItems = filteredCampaigns.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const savedViews = [
    { key: "all", label: "すべて" },
    { key: "email", label: "メール" },
    { key: "forms", label: "フォーム" },
    { key: "lp", label: "LP" },
  ];

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === emailCampaigns.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(emailCampaigns.map(c => c.id)));
  };

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">マーケティング</h1>
          <p className="text-sm text-gray-500 mt-1">{emailCampaigns.length}件のキャンペーン</p>
        </div>
        <Button size="sm" onClick={() => alert("キャンペーン作成は準備中です")}><Plus className="h-4 w-4 mr-1" />キャンペーン作成</Button>
      </div>

      {/* Saved View Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 px-1">
        {savedViews.map((v) => (
          <button key={v.key} onClick={() => setActiveView(v.key)} className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${activeView === v.key ? "border-[#ff4800] text-[#1f1f1f]" : "border-transparent text-gray-500 hover:text-gray-700"}`}>{v.label}</button>
        ))}
        <button className="ml-1 p-1.5 text-gray-400 hover:text-gray-600 rounded" onClick={() => alert("ビュー追加は準備中です")}><Plus className="h-4 w-4" /></button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} title={kpi.tooltip}>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${kpi.bg}`}>
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
            </div>
          );
        })}
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg bg-[#1f1f1f] px-4 py-2.5 text-white">
          <span className="text-sm font-medium">{selectedIds.size}件を選択中</span>
          <div className="h-4 w-px bg-gray-600" />
          <button className="flex items-center gap-1.5 rounded px-2.5 py-1 text-sm hover:bg-white/10 transition-colors" onClick={() => alert("一括編集は準備中です")}><Pencil className="h-3.5 w-3.5" /> 編集</button>
          <button className="flex items-center gap-1.5 rounded px-2.5 py-1 text-sm hover:bg-white/10 transition-colors" onClick={() => alert("エクスポートは準備中です")}><Download className="h-3.5 w-3.5" /> エクスポート</button>
          <button className="flex items-center gap-1.5 rounded px-2.5 py-1 text-sm text-red-400 hover:bg-white/10 transition-colors" onClick={() => alert("一括削除は準備中です")}><Trash2 className="h-3.5 w-3.5" /> 削除</button>
          <div className="flex-1" />
          <button className="rounded p-1 hover:bg-white/10 transition-colors" onClick={() => setSelectedIds(new Set())}><X className="h-4 w-4" /></button>
        </div>
      )}

      {/* Email Campaigns */}
      {(activeView === "all" || activeView === "email") && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>メールキャンペーン</CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    placeholder="検索..." className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-[#ff4800]/20 focus:border-[#ff4800]" />
                </div>
                <Link href="/email" className="text-sm text-[#ff4800] hover:underline">すべて表示</Link>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left w-10"><input type="checkbox" className="rounded border-gray-300" checked={emailCampaigns.length > 0 && selectedIds.size === emailCampaigns.length} onChange={toggleSelectAll} /></th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("name")}><div className="flex items-center gap-1">キャンペーン名 <ArrowUpDown className="h-3 w-3" /></div></th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("status")}><div className="flex items-center gap-1">ステータス <ArrowUpDown className="h-3 w-3" /></div></th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("sentDate")}><div className="flex items-center gap-1">送信日 <ArrowUpDown className="h-3 w-3" /></div></th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">送信数</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">開封率</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">クリック率</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">バウンス率</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map((campaign) => (
                    <tr key={campaign.id} className={`border-b border-gray-100 hover:bg-gray-50 ${selectedIds.has(campaign.id) ? "bg-blue-50/50" : ""}`}>
                      <td className="px-4 py-3"><input type="checkbox" className="rounded border-gray-300" checked={selectedIds.has(campaign.id)} onChange={() => toggleSelect(campaign.id)} onClick={(e) => e.stopPropagation()} /></td>
                      <td className="px-6 py-3 font-medium text-gray-900">{campaign.name}</td>
                      <td className="px-4 py-3">{statusBadge(campaign.status)}</td>
                      <td className="px-4 py-3 text-gray-600">{campaign.sentDate}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{campaign.recipients > 0 ? campaign.recipients.toLocaleString() : "-"}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{campaign.openRate > 0 ? `${campaign.openRate}%` : "-"}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{campaign.clickRate > 0 ? `${campaign.clickRate}%` : "-"}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{campaign.bounceRate > 0 ? `${campaign.bounceRate}%` : "-"}</td>
                      <td className="px-4 py-3"><RowActions /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
              <p className="text-sm text-gray-500">{filteredCampaigns.length}件中 {(currentPage - 1) * itemsPerPage + 1}〜{Math.min(currentPage * itemsPerPage, filteredCampaigns.length)}件</p>
              <div className="flex gap-1">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">前へ</button>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">次へ</button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Forms and Landing Pages */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {(activeView === "all" || activeView === "forms") && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>フォーム</CardTitle>
                <Link href="/forms" className="text-sm text-[#ff4800] hover:underline">すべて表示</Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {forms.map((form) => (
                  <div key={form.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded bg-orange-50 text-orange-600"><FileText className="h-4 w-4" /></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{form.name}</p>
                        <p className="text-xs text-gray-500">{form.submissions}件送信 / {form.views}回表示</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{form.conversionRate}%</p>
                      <p className="text-xs text-gray-500">CVR</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {(activeView === "all" || activeView === "lp") && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>ランディングページ</CardTitle>
                <Link href="/landing-pages" className="text-sm text-[#ff4800] hover:underline">すべて表示</Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {landingPages.map((page) => (
                  <div key={page.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded bg-cyan-50 text-cyan-600"><ExternalLink className="h-4 w-4" /></div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900">{page.name}</p>
                          {statusBadge(page.status)}
                        </div>
                        <p className="text-xs text-gray-500">{page.views > 0 ? `${page.views.toLocaleString()}回閲覧 / ${page.submissions}件送信` : "未公開"}</p>
                      </div>
                    </div>
                    {page.conversionRate > 0 && (
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{page.conversionRate}%</p>
                        <p className="text-xs text-gray-500">CVR</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {emailCampaigns.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-gray-300" />
          </div>
          <h3 className="text-base font-medium text-gray-900 mb-1">データがありません</h3>
          <p className="text-sm text-gray-500">新しいキャンペーンを作成して始めましょう</p>
        </div>
      )}
    </div>
  );
}
