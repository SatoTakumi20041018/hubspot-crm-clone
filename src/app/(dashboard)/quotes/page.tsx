"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import {
  Plus,
  FileText,
  ArrowUpDown,
  MoreHorizontal,
  Filter,
  Clock,
  DollarSign,
  CheckCircle2,
  XCircle,
  PenTool,
} from "lucide-react";

interface Quote {
  id: string;
  quoteNumber: string;
  dealName: string;
  amount: number;
  status: "下書き" | "送信済み" | "署名済み" | "辞退" | "期限切れ";
  expiryDate: string;
  contact: string;
  company: string;
  createdAt: string;
  items: { name: string; quantity: number; unitPrice: number }[];
}

const quotes: Quote[] = [
  {
    id: "q1",
    quoteNumber: "QT-2026-001",
    dealName: "ECサイト構築案件",
    amount: 4500000,
    status: "送信済み",
    expiryDate: "2026-04-14",
    contact: "田中 太郎",
    company: "田中商事株式会社",
    createdAt: "2026-03-01",
    items: [
      { name: "ECサイト設計・開発", quantity: 1, unitPrice: 3500000 },
      { name: "UI/UXデザイン", quantity: 1, unitPrice: 800000 },
      { name: "テスト・QA", quantity: 1, unitPrice: 200000 },
    ],
  },
  {
    id: "q2",
    quoteNumber: "QT-2026-002",
    dealName: "クラウド移行プロジェクト",
    amount: 8500000,
    status: "下書き",
    expiryDate: "2026-04-30",
    contact: "鈴木 花子",
    company: "鈴木テクノロジー",
    createdAt: "2026-03-10",
    items: [
      { name: "クラウドアーキテクチャ設計", quantity: 1, unitPrice: 2000000 },
      { name: "データ移行", quantity: 1, unitPrice: 3500000 },
      { name: "インフラ構築", quantity: 1, unitPrice: 3000000 },
    ],
  },
  {
    id: "q3",
    quoteNumber: "QT-2026-003",
    dealName: "CRM導入支援",
    amount: 3200000,
    status: "署名済み",
    expiryDate: "2026-03-31",
    contact: "山田 一郎",
    company: "ABC株式会社",
    createdAt: "2026-02-15",
    items: [
      { name: "CRM設定・カスタマイズ", quantity: 1, unitPrice: 2000000 },
      { name: "データインポート", quantity: 1, unitPrice: 500000 },
      { name: "トレーニング", quantity: 1, unitPrice: 700000 },
    ],
  },
  {
    id: "q4",
    quoteNumber: "QT-2026-004",
    dealName: "基幹システムリプレイス",
    amount: 15000000,
    status: "送信済み",
    expiryDate: "2026-04-30",
    contact: "渡辺 大輔",
    company: "グローバルシステム",
    createdAt: "2026-03-05",
    items: [
      { name: "要件定義", quantity: 1, unitPrice: 3000000 },
      { name: "システム開発", quantity: 1, unitPrice: 8000000 },
      { name: "テスト・品質保証", quantity: 1, unitPrice: 2000000 },
      { name: "運用移行支援", quantity: 1, unitPrice: 2000000 },
    ],
  },
  {
    id: "q5",
    quoteNumber: "QT-2026-005",
    dealName: "Webアプリ開発",
    amount: 5500000,
    status: "署名済み",
    expiryDate: "2026-03-20",
    contact: "小林 誠",
    company: "フューチャーテック",
    createdAt: "2026-02-01",
    items: [
      { name: "フロントエンド開発", quantity: 1, unitPrice: 2500000 },
      { name: "バックエンド開発", quantity: 1, unitPrice: 2500000 },
      { name: "サーバー初期設定", quantity: 1, unitPrice: 500000 },
    ],
  },
  {
    id: "q6",
    quoteNumber: "QT-2026-006",
    dealName: "Webマーケティング支援",
    amount: 1800000,
    status: "辞退",
    expiryDate: "2026-02-28",
    contact: "加藤 由美",
    company: "サンライズメディア",
    createdAt: "2026-01-20",
    items: [
      { name: "SEO対策", quantity: 1, unitPrice: 600000 },
      { name: "広告運用（3ヶ月）", quantity: 1, unitPrice: 900000 },
      { name: "レポーティング", quantity: 1, unitPrice: 300000 },
    ],
  },
  {
    id: "q7",
    quoteNumber: "QT-2026-007",
    dealName: "セキュリティ監査",
    amount: 2400000,
    status: "送信済み",
    expiryDate: "2026-04-15",
    contact: "伊藤 さくら",
    company: "イノベーション株式会社",
    createdAt: "2026-03-08",
    items: [
      { name: "脆弱性診断", quantity: 1, unitPrice: 1200000 },
      { name: "ペネトレーションテスト", quantity: 1, unitPrice: 800000 },
      { name: "改善提案・レポート", quantity: 1, unitPrice: 400000 },
    ],
  },
  {
    id: "q8",
    quoteNumber: "QT-2026-008",
    dealName: "ロゴ・VI制作",
    amount: 800000,
    status: "期限切れ",
    expiryDate: "2026-03-01",
    contact: "中村 真理",
    company: "さくらデザイン",
    createdAt: "2026-02-01",
    items: [
      { name: "ロゴデザイン", quantity: 1, unitPrice: 500000 },
      { name: "ブランドガイドライン", quantity: 1, unitPrice: 300000 },
    ],
  },
  {
    id: "q9",
    quoteNumber: "QT-2026-009",
    dealName: "データ分析基盤構築",
    amount: 6800000,
    status: "下書き",
    expiryDate: "2026-05-15",
    contact: "佐々木 美咲",
    company: "デジタルソリューションズ",
    createdAt: "2026-03-12",
    items: [
      { name: "データウェアハウス構築", quantity: 1, unitPrice: 3000000 },
      { name: "BIツール導入", quantity: 1, unitPrice: 2000000 },
      { name: "ダッシュボード開発", quantity: 1, unitPrice: 1800000 },
    ],
  },
];

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case "署名済み": return "success" as const;
    case "送信済み": return "info" as const;
    case "下書き": return "default" as const;
    case "辞退": return "danger" as const;
    case "期限切れ": return "warning" as const;
    default: return "default" as const;
  }
};

const statusIcon = (status: string) => {
  switch (status) {
    case "署名済み": return <CheckCircle2 className="h-3 w-3" />;
    case "辞退": return <XCircle className="h-3 w-3" />;
    case "下書き": return <PenTool className="h-3 w-3" />;
    default: return null;
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

export default function QuotesPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("すべて");


  const filtered = quotes.filter((q) => {
    const matchSearch =
      q.quoteNumber.toLowerCase().includes(search.toLowerCase()) ||
      q.dealName.toLowerCase().includes(search.toLowerCase()) ||
      q.contact.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "すべて" || q.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalAmount = quotes.reduce((s, q) => s + q.amount, 0);
  const signedAmount = quotes.filter((q) => q.status === "署名済み").reduce((s, q) => s + q.amount, 0);


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
        title="見積書"
        description={`${quotes.length}件の見積書 - 合計 ¥${totalAmount.toLocaleString()}`}
        actions={
          <Button size="sm" onClick={() => alert("見積書作成は準備中です")}>
            <Plus className="h-4 w-4 mr-1" />
            見積書作成
          </Button>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{quotes.length}</p>
                <p className="text-xs text-gray-500">見積書合計</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {quotes.filter((q) => q.status === "署名済み").length}
                </p>
                <p className="text-xs text-gray-500">署名済み</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {quotes.filter((q) => q.status === "送信済み").length}
                </p>
                <p className="text-xs text-gray-500">承認待ち</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">¥{(signedAmount / 10000).toLocaleString()}万</p>
                <p className="text-xs text-gray-500">署名済み金額</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-72">
              <Input
                variant="search"
                placeholder="見積番号、取引名で検索..."
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
                <option>送信済み</option>
                <option>署名済み</option>
                <option>辞退</option>
                <option>期限切れ</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Quotes Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">見積番号</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                    取引名
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">
                  <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-gray-700">
                    金額
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">ステータス</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">有効期限</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">コンタクト</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">作成日</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((quote) => (
                <tr key={quote.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <input type="checkbox" className="rounded border-gray-300" onClick={(e) => e.stopPropagation()} />
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{quote.quoteNumber}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900">
                      {quote.dealName}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    ¥{quote.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusBadgeVariant(quote.status)}>
                      {statusIcon(quote.status)}
                      {quote.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{quote.expiryDate}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-gray-900 text-xs">{quote.contact}</p>
                      <p className="text-xs text-gray-500">{quote.company}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{quote.createdAt}</td>
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
                <p className="text-sm text-gray-500">{filtered.length}件中 {(currentPage-1)*itemsPerPage+1}〜{Math.min(currentPage*itemsPerPage, filtered.length)}件</p>
                <div className="flex gap-1">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage===1} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">前へ</button>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage===totalPages} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">次へ</button>
                </div>
              </div>
            )}
      </Card>
    </div>
  );
}
