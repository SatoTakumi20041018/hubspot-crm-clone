"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowLeft, Mail, Send, Eye, MousePointerClick } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  subject: string;
  status: string;
  openRate: number;
  clickRate: number;
  sentCount: number;
  sentDate: string | null;
}

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case "SENT": case "送信済み": return "success" as const;
    case "SCHEDULED": case "予約済み": return "info" as const;
    case "DRAFT": case "下書き": return "default" as const;
    default: return "default" as const;
  }
};

const statusLabel = (status: string) => {
  switch (status) {
    case "SENT": return "送信済み";
    case "SCHEDULED": return "予約済み";
    case "DRAFT": return "下書き";
    default: return status;
  }
};

export default function EmailDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/email-campaigns`)
      .then((r) => r.json())
      .then((d) => {
        const items = d.results || d.data || d;
        const found = Array.isArray(items) ? items.find((item: Campaign) => item.id === params.id) : null;
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
        <Button variant="outline" onClick={() => router.back()}>
          戻る
        </Button>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/email" className="hover:text-gray-700">
          Eメール
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900">{data.name}</span>
      </div>

      {/* Back + Title */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{data.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{data.subject}</p>
        </div>
        <Badge variant={statusBadgeVariant(data.status)} className="ml-2">
          {statusLabel(data.status)}
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Send className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {data.sentCount > 0 ? data.sentCount.toLocaleString() : "-"}
                </p>
                <p className="text-xs text-gray-500">送信数</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <Eye className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {data.openRate > 0 ? `${data.openRate}%` : "-"}
                </p>
                <p className="text-xs text-gray-500">開封率</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                <MousePointerClick className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {data.clickRate > 0 ? `${data.clickRate}%` : "-"}
                </p>
                <p className="text-xs text-gray-500">クリック率</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                <Mail className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {data.sentDate || "-"}
                </p>
                <p className="text-xs text-gray-500">送信日</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>詳細情報</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">キャンペーン名</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">件名</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.subject}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">ステータス</dt>
              <dd className="mt-1">
                <Badge variant={statusBadgeVariant(data.status)}>
                  {statusLabel(data.status)}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">送信数</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {data.sentCount > 0 ? data.sentCount.toLocaleString() : "-"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">開封率</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {data.openRate > 0 ? `${data.openRate}%` : "-"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">クリック率</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {data.clickRate > 0 ? `${data.clickRate}%` : "-"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">送信日</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.sentDate || "-"}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
