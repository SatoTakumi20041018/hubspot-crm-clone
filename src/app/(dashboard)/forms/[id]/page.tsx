"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowLeft, FileText, Eye, MousePointerClick } from "lucide-react";

interface FormItem {
  id: string;
  name: string;
  type: string;
  submissions: number;
  views: number;
  conversionRate: number;
  fields?: string[];
  status: string;
  createdAt: string;
}

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case "ACTIVE": case "公開中": return "success" as const;
    case "INACTIVE": case "非公開": return "warning" as const;
    case "DRAFT": case "下書き": return "default" as const;
    default: return "default" as const;
  }
};

const typeBadgeVariant = (type: string) => {
  switch (type) {
    case "埋め込み": case "EMBEDDED": return "info" as const;
    case "ポップアップ": case "POPUP": return "purple" as const;
    case "バナー": case "BANNER": return "warning" as const;
    case "スタンドアロン": case "STANDALONE": return "default" as const;
    default: return "default" as const;
  }
};

export default function FormDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<FormItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/forms`)
      .then((r) => r.json())
      .then((d) => {
        const items = d.results || d.data || d;
        const found = Array.isArray(items) ? items.find((item: FormItem) => item.id === params.id) : null;
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
        <Link href="/forms" className="hover:text-gray-700">フォーム</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900">{data.name}</span>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{data.name}</h1>
        <Badge variant={typeBadgeVariant(data.type)}>{data.type}</Badge>
        <Badge variant={statusBadgeVariant(data.status)}>{data.status}</Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {data.submissions > 0 ? data.submissions.toLocaleString() : "-"}
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
                  {data.views > 0 ? data.views.toLocaleString() : "-"}
                </p>
                <p className="text-xs text-gray-500">表示数</p>
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
                  {data.conversionRate > 0 ? `${data.conversionRate}%` : "-"}
                </p>
                <p className="text-xs text-gray-500">CVR</p>
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
              <dt className="text-sm font-medium text-gray-500">フォーム名</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">タイプ</dt>
              <dd className="mt-1"><Badge variant={typeBadgeVariant(data.type)}>{data.type}</Badge></dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">ステータス</dt>
              <dd className="mt-1"><Badge variant={statusBadgeVariant(data.status)}>{data.status}</Badge></dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">送信数</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.submissions > 0 ? data.submissions.toLocaleString() : "-"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">表示数</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.views > 0 ? data.views.toLocaleString() : "-"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">CVR</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.conversionRate > 0 ? `${data.conversionRate}%` : "-"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">作成日</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.createdAt}</dd>
            </div>
            {data.fields && data.fields.length > 0 && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">フィールド</dt>
                <dd className="mt-1 flex flex-wrap gap-2">
                  {data.fields.map((field, i) => (
                    <Badge key={i} variant="default">{field}</Badge>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
