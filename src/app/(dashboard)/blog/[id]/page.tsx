"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowLeft, Eye, MessageSquare, Search } from "lucide-react";

interface BlogPost {
  id: string | number;
  title: string;
  author: string;
  status: string;
  date: string;
  views: number;
  comments?: number;
  seoScore: number;
  content?: string;
  body?: string;
}

const statusConfig: Record<string, { label: string; variant: "success" | "default" | "info" }> = {
  published: { label: "公開中", variant: "success" },
  draft: { label: "下書き", variant: "default" },
  scheduled: { label: "予約済み", variant: "info" },
  PUBLISHED: { label: "公開中", variant: "success" },
  DRAFT: { label: "下書き", variant: "default" },
  SCHEDULED: { label: "予約済み", variant: "info" },
};

const seoScoreColor = (score: number) => {
  if (score >= 90) return "text-[#00823a] bg-[#b9cdbe]";
  if (score >= 80) return "text-[#2f7579] bg-[#b2e9eb]";
  if (score >= 70) return "text-[#8a6d00] bg-[#ece6d9]";
  return "text-[#d9002b] bg-[#fcc6b1]";
};

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blog`)
      .then((r) => r.json())
      .then((d) => {
        const items = d.results || d.data || d;
        const found = Array.isArray(items)
          ? items.find((item: BlogPost) => String(item.id) === String(params.id))
          : null;
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
        <Link href="/blog" className="hover:text-gray-700">ブログ</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900">{data.title}</span>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{data.title}</h1>
        <Badge variant={config.variant}>{config.label}</Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{data.views > 0 ? data.views.toLocaleString() : "-"}</p>
                <p className="text-xs text-gray-500">PV</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <MessageSquare className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{data.comments && data.comments > 0 ? data.comments : "-"}</p>
                <p className="text-xs text-gray-500">コメント</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                <Search className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-lg font-semibold ${seoScoreColor(data.seoScore)}`}>
                  {data.seoScore}
                </span>
                <p className="text-xs text-gray-500">SEOスコア</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm font-bold text-gray-900">{data.author}</p>
              <p className="text-xs text-gray-500 mt-1">著者</p>
              <p className="text-sm text-gray-600 mt-2">{data.date}</p>
              <p className="text-xs text-gray-500">公開日</p>
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
              <dt className="text-sm font-medium text-gray-500">著者</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.author}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">ステータス</dt>
              <dd className="mt-1"><Badge variant={config.variant}>{config.label}</Badge></dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">公開日</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.date}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">PV数</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.views > 0 ? data.views.toLocaleString() : "-"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">SEOスコア</dt>
              <dd className="mt-1">
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${seoScoreColor(data.seoScore)}`}>
                  {data.seoScore}
                </span>
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {(data.content || data.body) && (
        <Card>
          <CardHeader><CardTitle>コンテンツ</CardTitle></CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
              {data.content || data.body}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
