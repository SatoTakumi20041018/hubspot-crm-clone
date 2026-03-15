"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatsCard } from "@/components/ui/stats-card";
import {
  Headphones,
  Clock,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  User,
  Send,
  Bot,
  ArrowRight,
  Timer,
  MoreHorizontal,
  Inbox,
  ArrowUpDown,
  Plus,
  Pencil,
  Download,
  Trash2,
  X,
} from "lucide-react";

const tickets = [
  { id: "TK-2401", title: "ログイン時にエラーが発生する", customer: "田中商事株式会社", contact: "田中 太郎", priority: "high" as const, status: "open" as const, assignee: "佐藤 匠", slaRemaining: 45, createdAt: "2026-03-14 09:30", category: "技術サポート", aiRouting: "技術的な問題のため、テクニカルチームに自動ルーティング" },
  { id: "TK-2400", title: "請求書の金額が正しくない", customer: "鈴木テクノロジー", contact: "鈴木 花子", priority: "high" as const, status: "open" as const, assignee: "田村 愛", slaRemaining: 30, createdAt: "2026-03-14 08:45", category: "請求", aiRouting: "請求関連のため、経理チームに自動ルーティング" },
  { id: "TK-2399", title: "レポート機能のデータが遅延する", customer: "グローバルシステム", contact: "渡辺 大輔", priority: "medium" as const, status: "in_progress" as const, assignee: "佐藤 匠", slaRemaining: 120, createdAt: "2026-03-14 07:15", category: "技術サポート", aiRouting: "パフォーマンス問題のため、インフラチームに自動ルーティング" },
  { id: "TK-2398", title: "新機能のオンボーディング支援", customer: "イノベーション株式会社", contact: "伊藤 さくら", priority: "low" as const, status: "in_progress" as const, assignee: "田村 愛", slaRemaining: 240, createdAt: "2026-03-13 16:00", category: "オンボーディング", aiRouting: "新機能に関する質問のため、CSMチームに自動ルーティング" },
  { id: "TK-2397", title: "API連携でタイムアウトが発生", customer: "テクノフューチャー株式会社", contact: "山本 健太", priority: "critical" as const, status: "open" as const, assignee: "佐藤 匠", slaRemaining: 15, createdAt: "2026-03-14 10:00", category: "API", aiRouting: "API障害のため、最優先でエンジニアリングチームに自動ルーティング" },
  { id: "TK-2396", title: "ダッシュボードのカスタマイズ方法", customer: "東京マーケティング", contact: "高橋 健一", priority: "low" as const, status: "waiting" as const, assignee: "田村 愛", slaRemaining: 480, createdAt: "2026-03-13 14:30", category: "使い方", aiRouting: "FAQ対応可能。Customer Agentが初期対応済み" },
  { id: "TK-2395", title: "データのエクスポートができない", customer: "さくらデザイン", contact: "中村 真理", priority: "medium" as const, status: "in_progress" as const, assignee: "佐藤 匠", slaRemaining: 90, createdAt: "2026-03-13 11:00", category: "技術サポート", aiRouting: "データエクスポートのバグの可能性。QAチームにエスカレーション推奨" },
  { id: "TK-2394", title: "シーケンスメールが送信されない", customer: "フューチャーテック", contact: "小林 誠", priority: "high" as const, status: "open" as const, assignee: "田村 愛", slaRemaining: 60, createdAt: "2026-03-13 09:45", category: "メール", aiRouting: "メール配信障害のため、メールインフラチームに自動ルーティング" },
  { id: "TK-2393", title: "モバイルアプリの同期エラー", customer: "サンライズメディア", contact: "加藤 由美", priority: "medium" as const, status: "resolved" as const, assignee: "佐藤 匠", slaRemaining: 0, createdAt: "2026-03-12 15:20", category: "モバイル", aiRouting: "モバイルチーム対応完了" },
  { id: "TK-2392", title: "契約プランの変更方法", customer: "太陽コーポレーション", contact: "松本 隆", priority: "low" as const, status: "resolved" as const, assignee: "田村 愛", slaRemaining: 0, createdAt: "2026-03-12 10:00", category: "契約", aiRouting: "Customer Agentが自動回答で解決" },
  { id: "TK-2391", title: "ワークフローが動作しない", customer: "ハーモニー株式会社", contact: "井上 千春", priority: "high" as const, status: "resolved" as const, assignee: "佐藤 匠", slaRemaining: 0, createdAt: "2026-03-11 13:00", category: "ワークフロー", aiRouting: "ワークフローエンジンの既知の不具合。パッチ適用済み" },
];

const priorityConfig = {
  critical: { label: "緊急", variant: "danger" as const },
  high: { label: "高", variant: "warning" as const },
  medium: { label: "中", variant: "info" as const },
  low: { label: "低", variant: "default" as const },
};

const statusConfig = {
  open: { label: "未対応", variant: "danger" as const },
  in_progress: { label: "対応中", variant: "info" as const },
  waiting: { label: "待機中", variant: "warning" as const },
  resolved: { label: "解決済み", variant: "success" as const },
};

const savedViews = ["すべて", "マイチケット", "未割り当て"];

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mt-2" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
      <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
    </div>
  );
}

export default function HelpDeskPage() {
  const [selectedTicket, setSelectedTicket] = useState(tickets[0]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [quickReply, setQuickReply] = useState("");
  const [activeView, setActiveView] = useState(savedViews[0]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const filteredBase = tickets.filter((t) => {
    const matchSearch = t.title.includes(search) || t.customer.includes(search) || t.id.includes(search);
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const filtered = [...filteredBase].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = String((a as unknown as Record<string,unknown>)[sortField] ?? "");
    const bVal = String((b as unknown as Record<string,unknown>)[sortField] ?? "");
    return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const openCount = tickets.filter((t) => t.status === "open").length;
  const inProgressCount = tickets.filter((t) => t.status === "in_progress").length;
  const resolvedToday = tickets.filter((t) => t.status === "resolved").length;
  const avgSla = Math.round(
    tickets.filter((t) => t.status !== "resolved").reduce((sum, t) => sum + t.slaRemaining, 0) /
    tickets.filter((t) => t.status !== "resolved").length
  );

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedItems.map((t) => t.id)));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="ヘルプデスク"
        description="チケット管理とカスタマーサポートのワークスペース"
        breadcrumbs={[
          { label: "ホーム", href: "/" },
          { label: "サービス" },
          { label: "ヘルプデスク" },
        ]}
      />

      {/* Saved View Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200">
        {savedViews.map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeView === view
                ? "border-[#ff4800] text-[#ff4800]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {view}
          </button>
        ))}
        <button
          className="px-2 py-2 text-gray-400 hover:text-gray-600 -mb-px border-b-2 border-transparent"
          onClick={() => alert("ビュー追加は準備中です")}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <p className="text-sm text-gray-500">{tickets.length}件のチケット</p>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatsCard label="未対応チケット" value={openCount} change={-15} changeLabel="昨日比" icon={Inbox} />
        <StatsCard label="対応中" value={inProgressCount} icon={Clock} />
        <StatsCard label="本日解決" value={resolvedToday} change={25} changeLabel="昨日比" icon={CheckCircle} />
        <StatsCard label="平均SLA残り" value={`${avgSla}分`} icon={Timer} />
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg bg-[#1f1f1f] px-4 py-2.5 text-white">
          <span className="text-sm font-medium">{selectedIds.size}件を選択中</span>
          <div className="h-4 w-px bg-gray-600" />
          <button className="flex items-center gap-1.5 rounded px-2.5 py-1 text-sm hover:bg-white/10 transition-colors" onClick={() => alert("一括編集は準備中です")}>
            <Pencil className="h-3.5 w-3.5" /> 編集
          </button>
          <button className="flex items-center gap-1.5 rounded px-2.5 py-1 text-sm hover:bg-white/10 transition-colors" onClick={() => alert("エクスポートは準備中です")}>
            <Download className="h-3.5 w-3.5" /> エクスポート
          </button>
          <button className="flex items-center gap-1.5 rounded px-2.5 py-1 text-sm text-red-400 hover:bg-white/10 transition-colors" onClick={() => alert("一括削除は準備中です")}>
            <Trash2 className="h-3.5 w-3.5" /> 削除
          </button>
          <div className="flex-1" />
          <button className="rounded p-1 hover:bg-white/10 transition-colors" onClick={() => setSelectedIds(new Set())}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex gap-4">
        {/* Ticket Queue */}
        <div className="flex-1">
          <Card>
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-72">
                  <Input
                    variant="search"
                    placeholder="チケットID、タイトル、顧客名..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  />
                </div>
                <select
                  className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm"
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                >
                  <option value="all">すべてのステータス</option>
                  <option value="open">未対応</option>
                  <option value="in_progress">対応中</option>
                  <option value="waiting">待機中</option>
                  <option value="resolved">解決済み</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left font-medium text-gray-500 w-10">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={paginatedItems.length > 0 && selectedIds.size === paginatedItems.length}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("id")}><div className="flex items-center gap-1">ID <ArrowUpDown className="h-3 w-3" /></div></th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("title")}><div className="flex items-center gap-1">タイトル <ArrowUpDown className="h-3 w-3" /></div></th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("customer")}><div className="flex items-center gap-1">顧客 <ArrowUpDown className="h-3 w-3" /></div></th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">優先度</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">ステータス</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">SLA</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">担当</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className={`border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedIds.has(ticket.id) ? "bg-blue-50/50" : selectedTicket.id === ticket.id ? "bg-orange-50" : ""
                      }`}
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={selectedIds.has(ticket.id)}
                          onChange={() => toggleSelect(ticket.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{ticket.id}</td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-900">{ticket.title}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{ticket.customer}</td>
                      <td className="px-4 py-3">
                        <Badge variant={priorityConfig[ticket.priority].variant}>
                          {priorityConfig[ticket.priority].label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusConfig[ticket.status].variant}>
                          {statusConfig[ticket.status].label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {ticket.status !== "resolved" ? (
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-20 rounded-full bg-gray-200">
                              <div
                                className={`h-2 rounded-full ${
                                  ticket.slaRemaining <= 30 ? "bg-[#d9002b]" :
                                  ticket.slaRemaining <= 60 ? "bg-[#8a6d00]" : "bg-[#00823a]"
                                }`}
                                style={{ width: `${Math.min(100, (ticket.slaRemaining / 480) * 100)}%` }}
                              />
                            </div>
                            <span className={`text-xs font-medium ${
                              ticket.slaRemaining <= 30 ? "text-[#d9002b]" : "text-gray-500"
                            }`}>
                              {ticket.slaRemaining}分
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">完了</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{ticket.assignee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 mt-2">
                <p className="text-sm text-gray-500">{filtered.length}件中 {(currentPage-1)*itemsPerPage+1}〜{Math.min(currentPage*itemsPerPage, filtered.length)}件</p>
                <div className="flex gap-1">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage===1} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">前へ</button>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage===totalPages} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">次へ</button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 shrink-0 space-y-4">
          {/* Ticket Detail */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-gray-500">{selectedTicket.id}</span>
                <Badge variant={statusConfig[selectedTicket.status].variant}>
                  {statusConfig[selectedTicket.status].label}
                </Badge>
              </div>
              <CardTitle className="text-base">{selectedTicket.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{selectedTicket.contact} ({selectedTicket.customer})</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{selectedTicket.createdAt}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Headphones className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{selectedTicket.category}</span>
              </div>
            </CardContent>
          </Card>

          {/* AI Routing */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-[#ff4800]" />
                <CardTitle className="text-base">AIルーティング判定</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-orange-50 p-3">
                <p className="text-sm text-gray-700">{selectedTicket.aiRouting}</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Reply */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-[#ff4800]" />
                <CardTitle className="text-base">クイック返信</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full rounded-md border border-gray-300 p-3 text-sm focus:border-[#ff4800] focus:outline-none focus:ring-1 focus:ring-[#ff4800]"
                rows={4}
                placeholder="返信を入力..."
                value={quickReply}
                onChange={(e) => setQuickReply(e.target.value)}
              />
              <div className="mt-2 flex gap-2">
                <Button size="sm" className="flex-1" onClick={() => alert("メッセージを送信しました")}>
                  <Send className="h-4 w-4 mr-1" />
                  送信
                </Button>
                <Button variant="outline" size="sm" onClick={() => alert("AI生成は準備中です")}>
                  <Bot className="h-4 w-4 mr-1" />
                  AI生成
                </Button>
              </div>
              <div className="mt-3 space-y-1.5">
                <p className="text-xs font-medium text-gray-500">クイックテンプレート:</p>
                {["ご連絡ありがとうございます。確認中です。", "本件、解決いたしました。", "追加情報をお送りいただけますか？"].map((template) => (
                  <button
                    key={template}
                    className="block w-full rounded border border-gray-200 px-2 py-1.5 text-left text-xs text-gray-600 hover:bg-gray-50"
                    onClick={() => setQuickReply(template)}
                  >
                    {template}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Customer Context */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">顧客コンテキスト</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">プラン</span>
                <span className="font-medium">Enterprise</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">過去30日のチケット</span>
                <span className="font-medium">3件</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">CSAT</span>
                <span className="font-medium">4.2 / 5.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ヘルススコア</span>
                <Badge variant="success">92</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {filtered.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Headphones className="h-8 w-8 text-gray-300" />
          </div>
          <h3 className="text-base font-medium text-gray-900 mb-1">データがありません</h3>
          <p className="text-sm text-gray-500">新しいチケットを作成して始めましょう</p>
        </div>
      )}
    </div>
  );
}
