"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowLeft, Eye, Clock, Users, FileText, Presentation, File } from "lucide-react";

interface DocumentItem {
  id: string;
  name: string;
  type: string;
  views: number;
  lastViewed: string;
  sharedWith: string[];
  size: string;
  createdAt: string;
  owner: string;
}

const typeIcon = (type: string) => {
  switch (type) {
    case "PDF": case "ホワイトペーパー": return <FileText className="h-5 w-5 text-red-500" />;
    case "プレゼン": return <Presentation className="h-5 w-5 text-orange-500" />;
    case "提案書": return <File className="h-5 w-5 text-blue-500" />;
    case "契約書": return <FileText className="h-5 w-5 text-green-500" />;
    case "ケーススタディ": return <FileText className="h-5 w-5 text-purple-500" />;
    default: return <File className="h-5 w-5 text-gray-500" />;
  }
};

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<DocumentItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/documents`)
      .then((r) => r.json())
      .then((d) => {
        const items = d.results || d.data || d;
        const found = Array.isArray(items) ? items.find((item: DocumentItem) => item.id === params.id) : null;
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
        <Link href="/documents" className="hover:text-gray-700">ドキュメント</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900">{data.name}</span>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3">
          {typeIcon(data.type)}
          <h1 className="text-2xl font-bold">{data.name}</h1>
        </div>
        <Badge variant="default">{data.type}</Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{data.views}</p>
                <p className="text-xs text-gray-500">閲覧数</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{data.lastViewed}</p>
                <p className="text-xs text-gray-500">最終閲覧</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{data.sharedWith.length}</p>
                <p className="text-xs text-gray-500">共有先</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm font-bold text-gray-900">{data.size}</p>
              <p className="text-xs text-gray-500 mt-1">ファイルサイズ</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>詳細情報</CardTitle></CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">ドキュメント名</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">タイプ</dt>
              <dd className="mt-1"><Badge variant="default">{data.type}</Badge></dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">閲覧数</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.views}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">最終閲覧</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.lastViewed}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">オーナー</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.owner}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">作成日</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.createdAt}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">サイズ</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.size}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {data.sharedWith.length > 0 && (
        <Card>
          <CardHeader><CardTitle>共有先</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.sharedWith.map((person, i) => (
                <div key={i} className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ff4800] text-[10px] text-white">
                    {person.charAt(0)}
                  </div>
                  <span className="text-sm text-gray-700">{person}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
