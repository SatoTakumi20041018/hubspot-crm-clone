"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  Loader2,
  AlertCircle,
  Search,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

const recommendations = [
  { id: "seo1", page: "/products", issue: "メタディスクリプションが長すぎる", priority: "高", status: "未対応", impact: "クリック率に影響" },
  { id: "seo2", page: "/blog/crm-guide", issue: "H1タグが複数存在する", priority: "高", status: "未対応", impact: "検索順位に影響" },
  { id: "seo3", page: "/pricing", issue: "画像のalt属性が未設定（5件）", priority: "中", status: "対応中", impact: "アクセシビリティとSEO" },
  { id: "seo4", page: "/about", issue: "ページ読み込み速度が低い（3.2s）", priority: "高", status: "未対応", impact: "ユーザー体験とランキング" },
  { id: "seo5", page: "/blog/marketing-tips", issue: "内部リンクが不足", priority: "中", status: "未対応", impact: "クローラビリティ" },
  { id: "seo6", page: "/case-studies", issue: "構造化データが未実装", priority: "中", status: "対応中", impact: "リッチスニペット表示" },
  { id: "seo7", page: "/contact", issue: "canonicalタグが重複", priority: "低", status: "対応済み", impact: "インデックス重複防止" },
  { id: "seo8", page: "/features", issue: "モバイルフレンドリーでない要素あり", priority: "高", status: "未対応", impact: "モバイル検索順位" },
];

const priorityBadgeVariant = (priority: string) => {
  switch (priority) {
    case "高": return "danger" as const;
    case "中": return "warning" as const;
    case "低": return "default" as const;
    default: return "default" as const;
  }
};

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case "対応済み": return "success" as const;
    case "対応中": return "info" as const;
    case "未対応": return "default" as const;
    default: return "default" as const;
  }
};

export default function SeoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const item = recommendations.find((r) => r.id === params.id);
      if (item) {
        setData(item);
      } else {
        setError("SEO推奨事項が見つかりません");
      }
    } catch {
      setError("データの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          戻る
        </Button>
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-600 font-medium mb-2">エラー</p>
            <p className="text-sm text-gray-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-700">ホーム</Link>
        <span>/</span>
        <Link href="/seo" className="hover:text-gray-700">SEO</Link>
        <span>/</span>
        <span className="text-gray-900">{data.id}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            戻る
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">SEO 推奨事項</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={priorityBadgeVariant(data.priority)}>優先度: {data.priority}</Badge>
              <Badge variant={statusBadgeVariant(data.status)}>{data.status}</Badge>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Search className="h-5 w-5 text-[#ff4800]" />
            詳細情報
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-sm text-gray-500">ページ</span>
            <div className="flex items-center gap-1 font-mono text-sm text-gray-900">
              <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
              {data.page}
            </div>
          </div>
          <div className="flex items-start justify-between py-3 border-b border-gray-100">
            <span className="text-sm text-gray-500">問題</span>
            <div className="flex items-center gap-2 text-right">
              {data.priority === "高" ? (
                <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-yellow-500 flex-shrink-0" />
              )}
              <span className="text-sm font-medium text-gray-900">{data.issue}</span>
            </div>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-sm text-gray-500">優先度</span>
            <Badge variant={priorityBadgeVariant(data.priority)}>{data.priority}</Badge>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-sm text-gray-500">ステータス</span>
            <Badge variant={statusBadgeVariant(data.status)}>{data.status}</Badge>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-gray-500">影響</span>
            <span className="text-sm font-medium text-gray-900">{data.impact}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
