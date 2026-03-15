"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowLeft, FileText, DollarSign, Clock, CheckCircle2, XCircle, PenTool } from "lucide-react";

interface QuoteItem {
  id: string;
  quoteNumber: string;
  dealName: string;
  amount: number;
  status: string;
  expiryDate: string;
  contact: string;
  company: string;
  createdAt: string;
  items: { name: string; quantity: number; unitPrice: number }[];
}

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case "APPROVED": case "署名済み": return "success" as const;
    case "PENDING": case "送信済み": return "info" as const;
    case "DRAFT": case "下書き": return "default" as const;
    case "DECLINED": case "辞退": return "danger" as const;
    case "EXPIRED": case "期限切れ": return "warning" as const;
    default: return "default" as const;
  }
};

const statusIcon = (status: string) => {
  switch (status) {
    case "署名済み": case "APPROVED": return <CheckCircle2 className="h-3 w-3" />;
    case "辞退": case "DECLINED": return <XCircle className="h-3 w-3" />;
    case "下書き": case "DRAFT": return <PenTool className="h-3 w-3" />;
    default: return null;
  }
};

export default function QuoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<QuoteItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/quotes`)
      .then((r) => r.json())
      .then((d) => {
        const items = d.results || d.data || d;
        const found = Array.isArray(items) ? items.find((item: QuoteItem) => item.id === params.id) : null;
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/quotes" className="hover:text-gray-700">見積書</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900">{data.quoteNumber}</span>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{data.dealName}</h1>
          <p className="text-sm text-gray-500 font-mono">{data.quoteNumber}</p>
        </div>
        <Badge variant={statusBadgeVariant(data.status)}>
          {statusIcon(data.status)}{data.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">¥{data.amount.toLocaleString()}</p>
                <p className="text-xs text-gray-500">金額</p>
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
                <p className="text-sm font-bold text-gray-900">{data.expiryDate}</p>
                <p className="text-xs text-gray-500">有効期限</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{data.contact}</p>
                <p className="text-xs text-gray-500">コンタクト</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{data.company}</p>
                <p className="text-xs text-gray-500">会社名</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>詳細情報</CardTitle></CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">見積番号</dt>
              <dd className="mt-1 text-sm text-gray-900 font-mono">{data.quoteNumber}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">取引名</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.dealName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">金額</dt>
              <dd className="mt-1 text-sm font-bold text-gray-900">¥{data.amount.toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">ステータス</dt>
              <dd className="mt-1"><Badge variant={statusBadgeVariant(data.status)}>{statusIcon(data.status)}{data.status}</Badge></dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">有効期限</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.expiryDate}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">コンタクト</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.contact}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">会社名</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.company}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">作成日</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.createdAt}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Line Items */}
      {data.items && data.items.length > 0 && (
        <Card>
          <CardHeader><CardTitle>見積明細</CardTitle></CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-2 text-left font-medium text-gray-500">項目</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-500">数量</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-500">単価</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-500">小計</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="px-4 py-2 text-gray-900">{item.name}</td>
                    <td className="px-4 py-2 text-right text-gray-600">{item.quantity}</td>
                    <td className="px-4 py-2 text-right text-gray-600">¥{item.unitPrice.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right font-medium text-gray-900">¥{(item.quantity * item.unitPrice).toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td colSpan={3} className="px-4 py-2 text-right font-bold text-gray-900">合計</td>
                  <td className="px-4 py-2 text-right font-bold text-gray-900">¥{data.amount.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
