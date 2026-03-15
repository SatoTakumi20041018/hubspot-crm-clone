"use client";

import { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatsCard } from "@/components/ui/stats-card";
import {
  DollarSign,
  CreditCard,
  FileText,
  Link as LinkIcon,
  ArrowRight,
  MoreHorizontal,
  RefreshCw,
  ExternalLink,
  Plus,
  ArrowUpDown,
  Pencil,
  Copy,
  Trash2,
  X,
  Download,
} from "lucide-react";
import Link from "next/link";

const recentPayments = [
  { id: "PAY-001", customer: "田中商事株式会社", amount: 450000, method: "クレジットカード", date: "2026-03-14", status: "completed" as const },
  { id: "PAY-002", customer: "鈴木テクノロジー", amount: 280000, method: "銀行振込", date: "2026-03-14", status: "completed" as const },
  { id: "PAY-003", customer: "グローバルシステム", amount: 350000, method: "クレジットカード", date: "2026-03-13", status: "completed" as const },
  { id: "PAY-004", customer: "イノベーション株式会社", amount: 180000, method: "クレジットカード", date: "2026-03-13", status: "pending" as const },
  { id: "PAY-005", customer: "東京マーケティング", amount: 220000, method: "銀行振込", date: "2026-03-12", status: "completed" as const },
];

const recentInvoices = [
  { id: "INV-2401", customer: "さくらデザイン", amount: 120000, status: "overdue" as const, dueDate: "2026-03-01" },
  { id: "INV-2402", customer: "フューチャーテック", amount: 350000, status: "sent" as const, dueDate: "2026-03-20" },
  { id: "INV-2403", customer: "太陽コーポレーション", amount: 280000, status: "paid" as const, dueDate: "2026-03-15" },
  { id: "INV-2404", customer: "ハーモニー株式会社", amount: 150000, status: "draft" as const, dueDate: "2026-03-25" },
  { id: "INV-2405", customer: "サンライズメディア", amount: 190000, status: "sent" as const, dueDate: "2026-03-22" },
];

const paymentLinks = [
  { id: "pl1", name: "スタータープラン月額", price: 29800, clicks: 145, conversions: 23, active: true },
  { id: "pl2", name: "プロフェッショナルプラン月額", price: 98000, clicks: 89, conversions: 12, active: true },
  { id: "pl3", name: "エンタープライズ年額", price: 3600000, clicks: 34, conversions: 5, active: true },
  { id: "pl4", name: "オンボーディングパッケージ", price: 500000, clicks: 56, conversions: 8, active: false },
];

const subscriptions = [
  { customer: "田中商事株式会社", plan: "Enterprise", mrr: 450000, status: "active" as const },
  { customer: "鈴木テクノロジー", plan: "Professional", mrr: 280000, status: "active" as const },
  { customer: "グローバルシステム", plan: "Enterprise", mrr: 350000, status: "active" as const },
  { customer: "さくらデザイン", plan: "Starter", mrr: 120000, status: "past_due" as const },
];

const invoiceStatusConfig = {
  draft: { label: "下書き", variant: "default" as const },
  sent: { label: "送信済み", variant: "info" as const },
  paid: { label: "支払済み", variant: "success" as const },
  overdue: { label: "期限超過", variant: "danger" as const },
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

export default function CommercePage() {
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("overview");
  const [search, setSearch] = useState("");
  const [selectedPaymentIds, setSelectedPaymentIds] = useState<Set<string>>(new Set());
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);

  const savedViews = [
    { key: "overview", label: "概要" },
    { key: "payments", label: "支払い" },
    { key: "invoices", label: "請求書" },
    { key: "subscriptions", label: "サブスクリプション" },
  ];

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const togglePayment = (id: string) => {
    setSelectedPaymentIds(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  };

  const toggleInvoice = (id: string) => {
    setSelectedInvoiceIds(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  };

  const filteredPayments = recentPayments.filter(p => !search || p.customer.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()));
  const filteredInvoices = recentInvoices.filter(inv => !search || inv.customer.toLowerCase().includes(search.toLowerCase()) || inv.id.toLowerCase().includes(search.toLowerCase()));

  const totalPaymentPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalSelected = selectedPaymentIds.size + selectedInvoiceIds.size;

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[...Array(4)].map((_, i) => (<div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />))}
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {[...Array(4)].map((_, i) => (<div key={i} className="h-48 bg-gray-100 rounded-lg animate-pulse" />))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="コマースHub"
        description="支払い、請求書、サブスクリプションの一元管理"
        breadcrumbs={[{ label: "ホーム", href: "/" }, { label: "コマース" }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => alert("請求書作成は準備中です")}><FileText className="h-4 w-4 mr-1" />請求書作成</Button>
            <Button size="sm" onClick={() => alert("支払いリンク作成は準備中です")}><CreditCard className="h-4 w-4 mr-1" />支払いリンク作成</Button>
          </div>
        }
      />

      <p className="text-sm text-gray-500">{recentPayments.length + recentInvoices.length}件の取引</p>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 px-1">
        {savedViews.map((v) => (
          <button key={v.key} onClick={() => { setActiveView(v.key); setCurrentPage(1); }} className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${activeView === v.key ? "border-[#ff4800] text-[#1f1f1f]" : "border-transparent text-gray-500 hover:text-gray-700"}`}>{v.label}</button>
        ))}
        <button className="ml-1 p-1.5 text-gray-400 hover:text-gray-600 rounded" onClick={() => alert("ビュー追加は準備中です")}><Plus className="h-4 w-4" /></button>
      </div>

      {/* Search */}
      <div className="w-72">
        <Input variant="search" placeholder="顧客名、ID で検索..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatsCard label="今月の売上" value="¥2,830万" change={12} changeLabel="前月比" icon={DollarSign} />
        <StatsCard label="アクティブサブスクリプション" value="47" change={5} changeLabel="前月比" icon={RefreshCw} />
        <StatsCard label="未払い請求書" value="¥470,000" change={-8} changeLabel="前月比" icon={FileText} />
        <StatsCard label="有効な支払いリンク" value="3" icon={LinkIcon} />
      </div>

      {/* Bulk Action Bar */}
      {totalSelected > 0 && (
        <div className="flex items-center gap-3 rounded-lg bg-[#1f1f1f] px-4 py-2.5 text-white">
          <span className="text-sm font-medium">{totalSelected}件を選択中</span>
          <div className="h-4 w-px bg-gray-600" />
          <button className="flex items-center gap-1.5 rounded px-2.5 py-1 text-sm hover:bg-white/10 transition-colors" onClick={() => alert("エクスポートは準備中です")}><Download className="h-3.5 w-3.5" /> エクスポート</button>
          <button className="flex items-center gap-1.5 rounded px-2.5 py-1 text-sm text-red-400 hover:bg-white/10 transition-colors" onClick={() => alert("一括削除は準備中です")}><Trash2 className="h-3.5 w-3.5" /> 削除</button>
          <div className="flex-1" />
          <button className="rounded p-1 hover:bg-white/10 transition-colors" onClick={() => { setSelectedPaymentIds(new Set()); setSelectedInvoiceIds(new Set()); }}><X className="h-4 w-4" /></button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {(activeView === "overview" || activeView === "payments") && (
          <Card>
            <CardHeader><div className="flex items-center justify-between"><CardTitle>最近の支払い</CardTitle><Link href="/payments"><Button variant="ghost" size="sm">すべて見る <ArrowRight className="ml-1 h-4 w-4" /></Button></Link></div></CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-4 py-3 text-left w-10"><input type="checkbox" className="rounded border-gray-300" checked={filteredPayments.length > 0 && selectedPaymentIds.size === filteredPayments.length} onChange={() => { if (selectedPaymentIds.size === filteredPayments.length) setSelectedPaymentIds(new Set()); else setSelectedPaymentIds(new Set(filteredPayments.map(p => p.id))); }} /></th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("customer")}><div className="flex items-center gap-1">顧客 <ArrowUpDown className="h-3 w-3" /></div></th>
                      <th className="px-4 py-3 text-right font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("amount")}><div className="flex items-center justify-end gap-1">金額 <ArrowUpDown className="h-3 w-3" /></div></th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">ステータス</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPayments.map((payment) => (
                      <tr key={payment.id} className={`border-b border-gray-100 hover:bg-gray-50 ${selectedPaymentIds.has(payment.id) ? "bg-blue-50/50" : ""}`}>
                        <td className="px-4 py-3"><input type="checkbox" className="rounded border-gray-300" checked={selectedPaymentIds.has(payment.id)} onChange={() => togglePayment(payment.id)} /></td>
                        <td className="px-4 py-3"><p className="font-medium text-gray-900">{payment.customer}</p><p className="text-xs text-gray-500">{payment.date} - {payment.method}</p></td>
                        <td className="px-4 py-3 text-right font-medium text-gray-900">¥{payment.amount.toLocaleString()}</td>
                        <td className="px-4 py-3"><Badge variant={payment.status === "completed" ? "success" : "warning"}>{payment.status === "completed" ? "完了" : "処理中"}</Badge></td>
                        <td className="px-4 py-3"><RowActions /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPaymentPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
                  <p className="text-sm text-gray-500">{filteredPayments.length}件中 {(currentPage - 1) * itemsPerPage + 1}〜{Math.min(currentPage * itemsPerPage, filteredPayments.length)}件</p>
                  <div className="flex gap-1">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">前へ</button>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPaymentPages, p + 1))} disabled={currentPage === totalPaymentPages} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">次へ</button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {(activeView === "overview" || activeView === "invoices") && (
          <Card>
            <CardHeader><div className="flex items-center justify-between"><CardTitle>請求書</CardTitle><Link href="/invoices"><Button variant="ghost" size="sm">すべて見る <ArrowRight className="ml-1 h-4 w-4" /></Button></Link></div></CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-4 py-3 text-left w-10"><input type="checkbox" className="rounded border-gray-300" checked={filteredInvoices.length > 0 && selectedInvoiceIds.size === filteredInvoices.length} onChange={() => { if (selectedInvoiceIds.size === filteredInvoices.length) setSelectedInvoiceIds(new Set()); else setSelectedInvoiceIds(new Set(filteredInvoices.map(inv => inv.id))); }} /></th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("customer")}><div className="flex items-center gap-1">顧客 <ArrowUpDown className="h-3 w-3" /></div></th>
                      <th className="px-4 py-3 text-right font-medium text-gray-500">金額</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">ステータス</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice.id} className={`border-b border-gray-100 hover:bg-gray-50 ${selectedInvoiceIds.has(invoice.id) ? "bg-blue-50/50" : ""}`}>
                        <td className="px-4 py-3"><input type="checkbox" className="rounded border-gray-300" checked={selectedInvoiceIds.has(invoice.id)} onChange={() => toggleInvoice(invoice.id)} /></td>
                        <td className="px-4 py-3"><p className="font-medium text-gray-900">{invoice.customer}</p><p className="text-xs text-gray-500">{invoice.id} - 期限: {invoice.dueDate}</p></td>
                        <td className="px-4 py-3 text-right font-medium text-gray-900">¥{invoice.amount.toLocaleString()}</td>
                        <td className="px-4 py-3"><Badge variant={invoiceStatusConfig[invoice.status].variant}>{invoiceStatusConfig[invoice.status].label}</Badge></td>
                        <td className="px-4 py-3"><RowActions /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {(activeView === "overview" || activeView === "subscriptions") && (
          <Card>
            <CardHeader><div className="flex items-center justify-between"><CardTitle>サブスクリプション</CardTitle><Link href="/subscriptions"><Button variant="ghost" size="sm">すべて見る <ArrowRight className="ml-1 h-4 w-4" /></Button></Link></div></CardHeader>
            <CardContent><div className="space-y-3">{subscriptions.map((sub, i) => (<div key={i} className="flex items-center justify-between rounded-lg border border-gray-100 p-3"><div><p className="text-sm font-medium text-gray-900">{sub.customer}</p><p className="text-xs text-gray-500">{sub.plan}</p></div><div className="text-right"><p className="text-sm font-semibold text-gray-900">¥{sub.mrr.toLocaleString()}/月</p><Badge variant={sub.status === "active" ? "success" : "danger"}>{sub.status === "active" ? "アクティブ" : "支払い遅延"}</Badge></div></div>))}</div></CardContent>
          </Card>
        )}

        <Card>
          <CardHeader><div className="flex items-center justify-between"><CardTitle>支払いリンク</CardTitle><Button variant="outline" size="sm" onClick={() => alert("リンク作成は準備中です")}><LinkIcon className="h-4 w-4 mr-1" />リンク作成</Button></div></CardHeader>
          <CardContent><div className="space-y-3">{paymentLinks.map((link) => (<div key={link.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3"><div><div className="flex items-center gap-2"><p className="text-sm font-medium text-gray-900">{link.name}</p>{link.active && <ExternalLink className="h-3 w-3 text-gray-400" />}</div><p className="text-xs text-gray-500">¥{link.price.toLocaleString()} | {link.clicks}クリック / {link.conversions}コンバージョン</p></div><Badge variant={link.active ? "success" : "default"}>{link.active ? "有効" : "無効"}</Badge></div>))}</div></CardContent>
        </Card>
      </div>

      {recentPayments.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <CreditCard className="h-8 w-8 text-gray-300" />
          </div>
          <h3 className="text-base font-medium text-gray-900 mb-1">データがありません</h3>
          <p className="text-sm text-gray-500">新しい取引を作成して始めましょう</p>
        </div>
      )}
    </div>
  );
}
