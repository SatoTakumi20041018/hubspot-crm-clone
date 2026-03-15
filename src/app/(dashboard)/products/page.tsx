"use client";

import { useState } from "react";
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
  {
    id: "p1",
    name: "CRM プロフェッショナル",
    sku: "CRM-PRO-001",
    unitPrice: 180000,
    description: "プロフェッショナル向けCRMライセンス（年間）",
    category: "ソフトウェア",
    createdAt: "2025-06-01",
    recurring: true,
    billingCycle: "年間",
  },
  {
    id: "p2",
    name: "CRM エンタープライズ",
    sku: "CRM-ENT-001",
    unitPrice: 480000,
    description: "エンタープライズ向けCRMライセンス（年間）",
    category: "ソフトウェア",
    createdAt: "2025-06-01",
    recurring: true,
    billingCycle: "年間",
  },
  {
    id: "p3",
    name: "MA スタンダード",
    sku: "MA-STD-001",
    unitPrice: 120000,
    description: "マーケティングオートメーション スタンダードプラン",
    category: "ソフトウェア",
    createdAt: "2025-08-15",
    recurring: true,
    billingCycle: "月額",
  },
  {
    id: "p4",
    name: "導入コンサルティング",
    sku: "SVC-CONS-001",
    unitPrice: 500000,
    description: "CRM/MA導入時のコンサルティングサービス",
    category: "サービス",
    createdAt: "2025-07-01",
    recurring: false,
  },
  {
    id: "p5",
    name: "カスタム開発（1人月）",
    sku: "SVC-DEV-001",
    unitPrice: 1200000,
    description: "カスタム開発・インテグレーション作業",
    category: "サービス",
    createdAt: "2025-07-01",
    recurring: false,
  },
  {
    id: "p6",
    name: "トレーニングプログラム",
    sku: "SVC-TRN-001",
    unitPrice: 300000,
    description: "管理者・ユーザー向けトレーニング（半日）",
    category: "サービス",
    createdAt: "2025-09-01",
    recurring: false,
  },
  {
    id: "p7",
    name: "データ移行サービス",
    sku: "SVC-MIG-001",
    unitPrice: 400000,
    description: "既存システムからのデータ移行作業",
    category: "サービス",
    createdAt: "2025-10-01",
    recurring: false,
  },
  {
    id: "p8",
    name: "プレミアムサポート",
    sku: "SUP-PRM-001",
    unitPrice: 60000,
    description: "24時間365日対応のプレミアムサポート",
    category: "サポート",
    createdAt: "2025-11-01",
    recurring: true,
    billingCycle: "月額",
  },
  {
    id: "p9",
    name: "API連携パッケージ",
    sku: "ADD-API-001",
    unitPrice: 200000,
    description: "外部システムとのAPI連携設定パッケージ",
    category: "アドオン",
    createdAt: "2026-01-15",
    recurring: false,
  },
  {
    id: "p10",
    name: "セキュリティ監査パッケージ",
    sku: "SVC-SEC-001",
    unitPrice: 800000,
    description: "セキュリティ監査・脆弱性診断サービス",
    category: "サービス",
    createdAt: "2026-02-01",
    recurring: false,
  },
  {
    id: "p11",
    name: "BIダッシュボード追加",
    sku: "ADD-BI-001",
    unitPrice: 150000,
    description: "カスタムBIダッシュボードの追加",
    category: "アドオン",
    createdAt: "2026-02-15",
    recurring: true,
    billingCycle: "月額",
  },
];

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("すべて");

  const categories = ["すべて", "ソフトウェア", "サービス", "サポート", "アドオン"];

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === "すべて" || p.category === filterCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="商品カタログ"
        description={`${products.length}件の商品を管理`}
        actions={
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            商品追加
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-72">
          <Input
            variant="search"
            placeholder="商品名、SKUで検索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                filterCategory === cat
                  ? "bg-[#FF7A59] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
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
                    商品名
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">SKU</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">カテゴリ</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">
                  <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-gray-700">
                    単価
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">課金タイプ</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">説明</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                    作成日
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100">
                        <Package className="h-4 w-4 text-gray-500" />
                      </div>
                      <span className="font-medium text-gray-900">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{product.sku}</td>
                  <td className="px-4 py-3">
                    <Badge variant={
                      product.category === "ソフトウェア" ? "info" :
                      product.category === "サービス" ? "purple" :
                      product.category === "サポート" ? "success" : "warning"
                    }>
                      {product.category}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    ¥{product.unitPrice.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {product.recurring ? (
                      <Badge variant="info">{product.billingCycle}</Badge>
                    ) : (
                      <Badge variant="default">一回</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs max-w-xs truncate">
                    {product.description}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{product.createdAt}</td>
                  <td className="px-4 py-3">
                    <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
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
