"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowLeft, Package } from "lucide-react";

interface ProductItem {
  id: string;
  name: string;
  sku: string;
  unitPrice: number;
  price?: number;
  description: string;
  category: string;
  status?: string;
  recurring?: boolean;
  billingCycle?: string;
  createdAt: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products`)
      .then((r) => r.json())
      .then((d) => {
        const items = d.results || d.data || d;
        const found = Array.isArray(items) ? items.find((item: ProductItem) => item.id === params.id) : null;
        setData(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff4800]" />
      </div>
    );

  if (!data)
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500 mb-4">データが見つかりません</p>
        <Button variant="outline" onClick={() => router.back()}>戻る</Button>
      </div>
    );

  const price = data.unitPrice || data.price || 0;
  const categoryVariant = data.category === "ソフトウェア" ? "info" as const : data.category === "サービス" ? "purple" as const : data.category === "サポート" ? "success" as const : "warning" as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/products" className="hover:text-gray-700">商品カタログ</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900">{data.name}</span>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100">
            <Package className="h-5 w-5 text-gray-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{data.name}</h1>
            <p className="text-sm text-gray-500 font-mono">{data.sku}</p>
          </div>
        </div>
        <Badge variant={categoryVariant}>{data.category}</Badge>
        {data.status && <Badge variant="success">{data.status}</Badge>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-gray-900">¥{price.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">単価</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Badge variant={categoryVariant} className="text-base">{data.category}</Badge>
            <p className="text-xs text-gray-500 mt-2">カテゴリ</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            {data.recurring ? (
              <Badge variant="info" className="text-base">{data.billingCycle}</Badge>
            ) : (
              <Badge variant="default" className="text-base">一回</Badge>
            )}
            <p className="text-xs text-gray-500 mt-2">課金タイプ</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>詳細情報</CardTitle></CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">商品名</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">SKU</dt>
              <dd className="mt-1 text-sm text-gray-900 font-mono">{data.sku}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">単価</dt>
              <dd className="mt-1 text-sm font-bold text-gray-900">¥{price.toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">カテゴリ</dt>
              <dd className="mt-1"><Badge variant={categoryVariant}>{data.category}</Badge></dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">説明</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.description}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">課金タイプ</dt>
              <dd className="mt-1">
                {data.recurring ? (
                  <Badge variant="info">{data.billingCycle}</Badge>
                ) : (
                  <Badge variant="default">一回</Badge>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">作成日</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.createdAt}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
