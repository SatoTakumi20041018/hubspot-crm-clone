"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowLeft, Eye, MousePointerClick, BarChart3 } from "lucide-react";

interface LandingPageItem {
  id: string;
  title: string;
  slug: string;
  status: string;
  views: number;
  conversions: number;
  cvr: number;
  createdAt: string;
}

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case "PUBLISHED": case "公開中": return "success" as const;
    case "DRAFT": case "下書き": return "default" as const;
    case "ARCHIVED": case "非公開": return "warning" as const;
    default: return "default" as const;
  }
};

export default function LandingPageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<LandingPageItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/landing-pages`)
      .then((r) => r.json())
      .then((d) => {
        const items = d.results || d.data || d;
        const found = Array.isArray(items) ? items.find((item: LandingPageItem) => item.id === params.id) : null;
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
        <Link href="/landing-pages" className="hover:text-gray-700">ランディングページ</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900">{data.title}</span>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{data.title}</h1>
        <Badge variant={statusBadgeVariant(data.status)}>{data.status}</Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{data.views > 0 ? data.views.toLocaleString() : "-"}</p>
                <p className="text-xs text-gray-500">閲覧数</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <MousePointerClick className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{data.conversions > 0 ? data.conversions.toLocaleString() : "-"}</p>
                <p className="text-xs text-gray-500">コンバージョン</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{data.cvr > 0 ? `${data.cvr}%` : "-"}</p>
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
              <dt className="text-sm font-medium text-gray-500">タイトル</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.title}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">スラッグ</dt>
              <dd className="mt-1 text-sm text-gray-900 font-mono">{data.slug}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">ステータス</dt>
              <dd className="mt-1"><Badge variant={statusBadgeVariant(data.status)}>{data.status}</Badge></dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">閲覧数</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.views > 0 ? data.views.toLocaleString() : "-"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">コンバージョン数</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.conversions > 0 ? data.conversions.toLocaleString() : "-"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">CVR</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.cvr > 0 ? `${data.cvr}%` : "-"}</dd>
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
