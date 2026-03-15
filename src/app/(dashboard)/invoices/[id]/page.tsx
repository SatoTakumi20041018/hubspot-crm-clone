"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowLeft, DollarSign, Clock, FileText } from "lucide-react";

interface InvoiceItem {
  id: string;
  customer: string;
  email: string;
  amount: number;
  status: string;
  issueDate: string;
  dueDate: string;
  paidDate: string | null;
  items?: { name: string; quantity: number; unitPrice: number }[];
}

const statusConfig: Record<string, { label: string; variant: "default" | "info" | "success" | "danger" }> = {
  draft: { label: "下書き", variant: "default" },
  sent: { label: "送信済み", variant: "info" },
  paid: { label: "支払済み", variant: "success" },
  overdue: { label: "期限超過", variant: "danger" },
  DRAFT: { label: "下書き", variant: "default" },
  SENT: { label: "送信済み", variant: "info" },
  PAID: { label: "支払済み", variant: "success" },
  OVERDUE: { label: "期限超過", variant: "danger" },
};

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<InvoiceItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/invoices`)
      .then((r) => r.json())
      .then((d) => {
        const items = d.results || d.data || d;
        const found = Array.isArray(items) ? items.find((item: InvoiceItem) => item.id === params.id) : null;
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

  const config = statusConfig[data.status] || { label: data.status, variant: "default" as const };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/invoices" className="hover:text-gray-700">請求書</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900">{data.id}</span>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{data.id}</h1>
          <p className="text-sm text-gray-500">{data.customer}</p>
        </div>
        <Badge variant={config.variant}>{config.label}</Badge>
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
                <p className="text-sm font-bold text-gray-900">{data.dueDate}</p>
                <p className="text-xs text-gray-500">期日</p>
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
                <p className="text-sm font-bold text-gray-900">{data.issueDate}</p>
                <p className="text-xs text-gray-500">発行日</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm font-bold text-gray-900">{data.paidDate || "-"}</p>
              <p className="text-xs text-gray-500 mt-1">支払日</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>詳細情報</CardTitle></CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">請求書番号</dt>
              <dd className="mt-1 text-sm text-gray-900 font-mono">{data.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">顧客名</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.customer}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">メール</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">金額</dt>
              <dd className="mt-1 text-sm font-bold text-gray-900">¥{data.amount.toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">ステータス</dt>
              <dd className="mt-1"><Badge variant={config.variant}>{config.label}</Badge></dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">発行日</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.issueDate}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">期日</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.dueDate}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">支払日</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.paidDate || "-"}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {data.items && data.items.length > 0 && (
        <Card>
          <CardHeader><CardTitle>明細</CardTitle></CardHeader>
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
