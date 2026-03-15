"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import {
  Plus,
  Package,
  ArrowUpDown,
  MoreHorizontal,
  Trash2,
  Download,
  Archive,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku: string;
  unitPrice: number;
  description: string;
  category: string;
  createdAt: string;
  recurring: boolean;
  billingCycle?: string;
}

const products: Product[] = [
  { id: "p1", name: "CRM プロフェッショナル", sku: "CRM-PRO-001", unitPrice: 180000, description: "プロフェッショナル向けCRMライセンス（年間）", category: "ソフトウェア", createdAt: "2025-06-01", recurring: true, billingCycle: "年間" },
  { id: "p2", name: "CRM エンタープライズ", sku: "CRM-ENT-001", unitPrice: 480000, description: "エンタープライズ向けCRMライセンス（年間）", category: "ソフトウェア", createdAt: "2025-06-01", recurring: true, billingCycle: "年間" },
  { id: "p3", name: "MA スタンダード", sku: "MA-STD-001", unitPrice: 120000, description: "マーケティングオートメーション スタンダードプラン", category: "ソフトウェア", createdAt: "2025-08-15", recurring: true, billingCycle: "月額" },
  { id: "p4", name: "導入コンサルティング", sku: "SVC-CONS-001", unitPrice: 500000, description: "CRM/MA導入時のコンサルティングサービス", category: "サービス", createdAt: "2025-07-01", recurring: false },
  { id: "p5", name: "カスタム開発（1人月）", sku: "SVC-DEV-001", unitPrice: 1200000, description: "カスタム開発・インテグレーション作業", category: "サービス", createdAt: "2025-07-01", recurring: false },
  { id: "p6", name: "トレーニングプログラム", sku: "SVC-TRN-001", unitPrice: 300000, description: "管理者・ユーザー向けトレーニング（半日）", category: "サービス", createdAt: "2025-09-01", recurring: false },
  { id: "p7", name: "データ移行サービス", sku: "SVC-MIG-001", unitPrice: 400000, description: "既存システムからのデータ移行作業", category: "サービス", createdAt: "2025-10-01", recurring: false },
  { id: "p8", name: "プレミアムサポート", sku: "SUP-PRM-001", unitPrice: 60000, description: "24時間365日対応のプレミアムサポート", category: "サポート", createdAt: "2025-11-01", recurring: true, billingCycle: "月額" },
  { id: "p9", name: "API連携パッケージ", sku: "ADD-API-001", unitPrice: 200000, description: "外部システムとのAPI連携設定パッケージ", category: "アドオン", createdAt: "2026-01-15", recurring: false },
  { id: "p10", name: "セキュリティ監査パッケージ", sku: "SVC-SEC-001", unitPrice: 800000, description: "セキュリティ監査・脆弱性診断サービス", category: "サービス", createdAt: "2026-02-01", recurring: false },
  { id: "p11", name: "BIダッシュボード追加", sku: "ADD-BI-001", unitPrice: 150000, description: "カスタムBIダッシュボードの追加", category: "アドオン", createdAt: "2026-02-15", recurring: true, billingCycle: "月額" },
];


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

export default function ProductsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);

  const [search, setSearch] = useState("");
  const [activeView, setActiveView] = useState("all");
  const [filterCategory, setFilterCategory] = useState("すべて");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const views = [
    { key: "all", label: "すべての商品" },
    { key: "active", label: "アクティブ" },
  ];
  const categoriesList = ["すべて", "ソフトウェア", "サービス", "サポート", "アドオン"];

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === "すべて" || p.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortField) return 0;
    let cmp = 0;
    if (sortField === "name") cmp = a.name.localeCompare(b.name);
    else if (sortField === "sku") cmp = a.sku.localeCompare(b.sku);
    else if (sortField === "price") cmp = a.unitPrice - b.unitPrice;
    else if (sortField === "createdAt") cmp = a.createdAt.localeCompare(b.createdAt);
    return sortDir === "asc" ? cmp : -cmp;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginatedItems = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSelect = (id: string) => { setSelectedIds(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; }); };
  const toggleAll = () => { if (selectedIds.size === paginatedItems.length) setSelectedIds(new Set()); else setSelectedIds(new Set(paginatedItems.map(i => i.id))); };


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
      <PageHeader title="商品カタログ" description={`${products.length}件の商品を管理`} actions={<Button size="sm" onClick={() => alert("商品追加は準備中です")}><Plus className="h-4 w-4 mr-1" />商品追加</Button>} />

      <div className="flex items-center gap-1 border-b border-gray-200 px-1 mb-4">
        {views.map((v) => (
          <button key={v.key} onClick={() => setActiveView(v.key)} className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${activeView === v.key ? "border-[#ff4800] text-[#1f1f1f]" : "border-transparent text-gray-500 hover:text-gray-700"}`}>{v.label}</button>
        ))}
        <button className="ml-1 p-1.5 text-gray-400 hover:text-gray-600 rounded" onClick={() => alert("ビューの追加は準備中です")}><Plus className="h-4 w-4" /></button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-72"><Input variant="search" placeholder="商品名、SKUで検索..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} /></div>
        <div className="flex gap-1">
          {categoriesList.map((cat) => (
            <button key={cat} onClick={() => { setFilterCategory(cat); setCurrentPage(1); }} className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${filterCategory === cat ? "bg-[#ff4800] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{cat}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4"><Package className="h-8 w-8 text-gray-300" /></div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">データがありません</h3>
          <p className="text-sm text-gray-500 mb-4">新しい商品を作成して始めましょう</p>
          <Button size="sm" onClick={() => alert("作成は準備中です")}><Plus className="h-4 w-4 mr-1" /> 商品を作成</Button>
        </div>
      )}

      {/* Products Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-medium text-gray-500"><input type="checkbox" className="rounded border-gray-300" checked={paginatedItems.length > 0 && selectedIds.size === paginatedItems.length} onChange={toggleAll} /></th>
                <th className="px-4 py-3 text-left font-medium text-gray-500"><div className="flex items-center gap-1 cursor-pointer hover:text-gray-700" onClick={() => handleSort("name")}>商品名<ArrowUpDown className="h-3 w-3" /></div></th>
                <th className="px-4 py-3 text-left font-medium text-gray-500"><div className="flex items-center gap-1 cursor-pointer hover:text-gray-700" onClick={() => handleSort("sku")}>SKU<ArrowUpDown className="h-3 w-3" /></div></th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">カテゴリ</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500"><div className="flex items-center justify-end gap-1 cursor-pointer hover:text-gray-700" onClick={() => handleSort("price")}>単価<ArrowUpDown className="h-3 w-3" /></div></th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">課金タイプ</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">説明</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500"><div className="flex items-center gap-1 cursor-pointer hover:text-gray-700" onClick={() => handleSort("createdAt")}>作成日<ArrowUpDown className="h-3 w-3" /></div></th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((product) => (
                <tr key={product.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${selectedIds.has(product.id) ? "bg-blue-50" : ""}`} onClick={() => router.push(`/products/${product.id}`)}>
                  <td className="px-4 py-3"><input type="checkbox" className="rounded border-gray-300" checked={selectedIds.has(product.id)} onChange={() => toggleSelect(product.id)} onClick={(e) => e.stopPropagation()} /></td>
                  <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100"><Package className="h-4 w-4 text-gray-500" /></div><span className="font-medium text-gray-900">{product.name}</span></div></td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{product.sku}</td>
                  <td className="px-4 py-3"><Badge variant={product.category === "ソフトウェア" ? "info" : product.category === "サービス" ? "purple" : product.category === "サポート" ? "success" : "warning"}>{product.category}</Badge></td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">¥{product.unitPrice.toLocaleString()}</td>
                  <td className="px-4 py-3">{product.recurring ? <Badge variant="info">{product.billingCycle}</Badge> : <Badge variant="default">一回</Badge>}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs max-w-xs truncate">{product.description}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{product.createdAt}</td>
                  <td className="px-4 py-3"><RowActions onEdit={() => alert("編集は準備中です")} onDelete={() => alert("削除は準備中です")} /></td>
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
          <Button size="sm" variant="outline" onClick={() => alert("エクスポートは準備中です")}><Download className="h-4 w-4 mr-1" />エクスポート</Button>
          <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => alert("削除は準備中です")}><Trash2 className="h-4 w-4 mr-1" />削除</Button>
          <button onClick={() => setSelectedIds(new Set())} className="ml-2 text-xs text-gray-500 hover:text-gray-700">選択解除</button>
        </div>
      )}
    </div>
  );
}
