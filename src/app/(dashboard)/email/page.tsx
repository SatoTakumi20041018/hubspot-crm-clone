"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import {
  Plus,
  Mail,
  Send,
  Eye,
  MousePointerClick,
  ArrowUpDown,
  MoreHorizontal,
  TrendingUp,
  ArrowUpRight,
  Filter,
  FlaskConical,
  Trash2,
  Download,
  Archive,
} from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  status: "下書き" | "予約済み" | "送信済み" | "送信中";
  openRate: number;
  clickRate: number;
  sentCount: number;
  date: string;
  subject: string;
  abTest?: { variantA: number; variantB: number; winner: string };
}

const campaigns: Campaign[] = [
  {
    id: "em1",
    name: "3月ニュースレター",
    status: "送信済み",
    openRate: 28.5,
    clickRate: 5.2,
    sentCount: 2450,
    date: "2026-03-10",
    subject: "3月の最新アップデート情報",
  },
  {
    id: "em2",
    name: "新製品リリース案内",
    status: "送信済み",
    openRate: 32.1,
    clickRate: 8.4,
    sentCount: 3200,
    date: "2026-03-05",
    subject: "新機能リリースのお知らせ",
    abTest: { variantA: 30.2, variantB: 34.0, winner: "B" },
  },
  {
    id: "em3",
    name: "セミナー招待メール",
    status: "送信済み",
    openRate: 22.3,
    clickRate: 4.6,
    sentCount: 1800,
    date: "2026-02-28",
    subject: "無料ウェビナーへのご招待",
  },
  {
    id: "em4",
    name: "4月キャンペーン予告",
    status: "下書き",
    openRate: 0,
    clickRate: 0,
    sentCount: 0,
    date: "-",
    subject: "春の特別キャンペーン開催！",
  },
  {
    id: "em5",
    name: "リード育成メール #5",
    status: "予約済み",
    openRate: 0,
    clickRate: 0,
    sentCount: 1200,
    date: "2026-03-20",
    subject: "導入事例のご紹介",
  },
  {
    id: "em6",
    name: "2月ニュースレター",
    status: "送信済み",
    openRate: 25.8,
    clickRate: 3.9,
    sentCount: 2300,
    date: "2026-02-10",
    subject: "2月のハイライト",
  },
  {
    id: "em7",
    name: "ホワイトペーパー案内",
    status: "送信済み",
    openRate: 29.4,
    clickRate: 12.3,
    sentCount: 1500,
    date: "2026-02-20",
    subject: "最新ホワイトペーパーのご案内",
    abTest: { variantA: 27.8, variantB: 31.0, winner: "B" },
  },
  {
    id: "em8",
    name: "リード育成メール #4",
    status: "送信済み",
    openRate: 26.7,
    clickRate: 6.1,
    sentCount: 1350,
    date: "2026-02-15",
    subject: "製品活用のベストプラクティス",
  },
  {
    id: "em9",
    name: "年末感謝メール",
    status: "送信済み",
    openRate: 35.2,
    clickRate: 2.8,
    sentCount: 4500,
    date: "2025-12-25",
    subject: "今年もありがとうございました",
  },
  {
    id: "em10",
    name: "リードナーチャリング開始メール",
    status: "送信済み",
    openRate: 42.1,
    clickRate: 15.6,
    sentCount: 890,
    date: "2026-01-05",
    subject: "あなたに最適なソリューションをご提案",
    abTest: { variantA: 38.5, variantB: 45.7, winner: "B" },
  },
  {
    id: "em11",
    name: "イベントリマインダー",
    status: "予約済み",
    openRate: 0,
    clickRate: 0,
    sentCount: 650,
    date: "2026-03-25",
    subject: "明日開催！お忘れなく",
  },
];

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case "送信済み": return "success" as const;
    case "予約済み": return "info" as const;
    case "下書き": return "default" as const;
    case "送信中": return "warning" as const;
    default: return "default" as const;
  }
};


function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button onClick={(e) => { e.stopPropagation(); setOpen(!open); }} className="p-1 rounded hover:bg-gray-100">
        <MoreHorizontal className="h-4 w-4 text-gray-400" />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-10 w-40 rounded-lg border bg-white py-1 shadow-lg">
          <button onClick={() => { onEdit(); setOpen(false); }} className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50">編集</button>
          <button onClick={() => { onEdit(); setOpen(false); }} className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50">複製</button>
          <button onClick={() => { onDelete(); setOpen(false); }} className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">削除</button>
        </div>
      )}
    </div>
  );
}

export default function EmailPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("すべて");
  const [activeView, setActiveView] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const savedViews = [
    { key: "all", label: "すべて" },
    { key: "sent", label: "送信済み" },
    { key: "draft", label: "下書き" },
  ];

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filtered = campaigns.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "すべて" || c.status === filterStatus;
    const matchView = activeView === "all" ||
      (activeView === "sent" && c.status === "送信済み") ||
      (activeView === "draft" && c.status === "下書き");
    return matchSearch && matchStatus && matchView;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortField) return 0;
    let cmp = 0;
    if (sortField === "name") cmp = a.name.localeCompare(b.name);
    else if (sortField === "status") cmp = a.status.localeCompare(b.status);
    else if (sortField === "date") cmp = a.date.localeCompare(b.date);
    return sortDir === "asc" ? cmp : -cmp;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginatedItems = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === paginatedItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedItems.map(i => i.id)));
    }
  };

  const sentCampaigns = campaigns.filter((c) => c.status === "送信済み");
  const avgOpenRate = sentCampaigns.length > 0
    ? (sentCampaigns.reduce((s, c) => s + c.openRate, 0) / sentCampaigns.length).toFixed(1)
    : "0";
  const avgClickRate = sentCampaigns.length > 0
    ? (sentCampaigns.reduce((s, c) => s + c.clickRate, 0) / sentCampaigns.length).toFixed(1)
    : "0";


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
        title="Eメールマーケティング"
        description="メールキャンペーンの作成・管理・分析"
        actions={
          <Button size="sm" onClick={() => alert("メール作成は準備中です")}>
            <Plus className="h-4 w-4 mr-1" />

      <p className="text-sm text-gray-500">{campaigns.length}件のキャンペーン</p>

            メール作成
          </Button>
        }
      />

      {/* Saved View Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 px-1">
        {savedViews.map((v) => (
          <button key={v.key} onClick={() => { setActiveView(v.key); setCurrentPage(1); }}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeView === v.key ? "border-[#ff4800] text-[#1f1f1f]" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>{v.label}</button>
        ))}
        <button className="ml-1 p-1.5 text-gray-400 hover:text-gray-600 rounded" onClick={() => alert("ビューの追加は準備中です")}><Plus className="h-4 w-4" /></button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div title="送信済みキャンペーンの合計送信メール数">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                <Send className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex items-center gap-0.5 text-green-600">
                <ArrowUpRight className="h-3 w-3" />
                <span className="text-xs font-medium">+18.2%</span>
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900">
              {campaigns.filter((c) => c.status === "送信済み").reduce((s, c) => s + c.sentCount, 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">送信数</p>
          </CardContent>
        </Card>
        </div>
        <div title="送信済みメールのうち開封された割合の平均">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50">
                <Eye className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex items-center gap-0.5 text-green-600">
                <ArrowUpRight className="h-3 w-3" />
                <span className="text-xs font-medium">+3.2%</span>
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900">{avgOpenRate}%</p>
            <p className="text-xs text-gray-500 mt-0.5">平均開封率</p>
          </CardContent>
        </Card>
        </div>
        <div title="開封されたメールのうちリンクがクリックされた割合の平均">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50">
                <MousePointerClick className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex items-center gap-0.5 text-green-600">
                <ArrowUpRight className="h-3 w-3" />
                <span className="text-xs font-medium">+0.8%</span>
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900">{avgClickRate}%</p>
            <p className="text-xs text-gray-500 mt-0.5">平均クリック率</p>
          </CardContent>
        </Card>
        </div>
        <div title="作成されたメールキャンペーンの総数">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50">
                <Mail className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900">{campaigns.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">キャンペーン数</p>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-72">
              <Input
                variant="search"
                placeholder="キャンペーン名で検索..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:border-[#ff4800] focus:outline-none focus:ring-1 focus:ring-[#ff4800]"
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
              >
                <option>すべて</option>
                <option>下書き</option>
                <option>予約済み</option>
                <option>送信済み</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Campaign Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  <input type="checkbox" className="rounded border-gray-300" checked={paginatedItems.length > 0 && selectedIds.size === paginatedItems.length} onChange={toggleAll} />
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700" onClick={() => handleSort("name")}>
                    キャンペーン名
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700" onClick={() => handleSort("status")}>
                    ステータス
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">送信数</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">開封率</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">クリック率</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700" onClick={() => handleSort("date")}>
                    送信日
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">A/Bテスト</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((campaign) => (
                <tr key={campaign.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${selectedIds.has(campaign.id) ? "bg-blue-50" : ""}`} onClick={() => router.push(`/email/${campaign.id}`)}>
                  <td className="px-4 py-3">
                    <input type="checkbox" className="rounded border-gray-300" checked={selectedIds.has(campaign.id)} onChange={() => toggleSelect(campaign.id)} onClick={(e) => e.stopPropagation()} />
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">
                        {campaign.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{campaign.subject}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusBadgeVariant(campaign.status)}>{campaign.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {campaign.sentCount > 0 ? campaign.sentCount.toLocaleString() : "-"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {campaign.openRate > 0 ? (
                      <span className="font-medium text-gray-900">{campaign.openRate}%</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {campaign.clickRate > 0 ? (
                      <span className="font-medium text-gray-900">{campaign.clickRate}%</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{campaign.date}</td>
                  <td className="px-4 py-3">
                    {campaign.abTest ? (
                      <div className="flex items-center gap-1">
                        <FlaskConical className="h-3 w-3 text-purple-500" />
                        <span className="text-xs text-purple-600 font-medium">
                          勝者: {campaign.abTest.winner}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <RowActions onEdit={() => alert("編集は準備中です")} onDelete={() => alert("削除は準備中です")} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 mt-2">
                <p className="text-sm text-gray-500">{sorted.length}件中 {(currentPage-1)*itemsPerPage+1}〜{Math.min(currentPage*itemsPerPage, sorted.length)}件</p>
                <div className="flex gap-1">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage===1} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">前へ</button>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage===totalPages} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">次へ</button>
                </div>
              </div>
            )}
      </Card>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-lg border bg-white px-5 py-3 shadow-lg">
          <span className="text-sm font-medium text-gray-700">{selectedIds.size}件選択中</span>
          <div className="h-4 w-px bg-gray-200" />
          <Button size="sm" variant="outline" onClick={() => alert("アーカイブは準備中です")}>
            <Archive className="h-4 w-4 mr-1" />
            アーカイブ
          </Button>
          <Button size="sm" variant="outline" onClick={() => alert("エクスポートは準備中です")}>
            <Download className="h-4 w-4 mr-1" />
            エクスポート
          </Button>
          <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => alert("削除は準備中です")}>
            <Trash2 className="h-4 w-4 mr-1" />
            削除
          </Button>
          <button onClick={() => setSelectedIds(new Set())} className="ml-2 text-xs text-gray-500 hover:text-gray-700">選択解除</button>
        </div>
      )}

      {sorted.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-gray-300" />
          </div>
          <h3 className="text-base font-medium text-gray-900 mb-1">データがありません</h3>
          <p className="text-sm text-gray-500">新しいメールキャンペーンを作成して始めましょう</p>
        </div>
      )}
    </div>
  );
}
