"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowLeft, Users, Zap, Clock } from "lucide-react";

interface ListItem {
  id: string;
  name: string;
  type: string;
  count: number;
  lastUpdated: string;
  createdBy: string;
  description?: string;
  createdAt?: string;
}

export default function ListDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<ListItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/contacts`)
      .then((r) => r.json())
      .then(() => {
        // Lists don't have a dedicated API, use mock lookup
        setData(null);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Simulate fetching from list data
    const mockLists: ListItem[] = [
      { id: "l1", name: "全顧客リスト", type: "動的", count: 2345, lastUpdated: "2026-03-14", createdBy: "佐藤 匠", createdAt: "2025-06-01", description: "ライフサイクル = 顧客 のコンタクト" },
      { id: "l2", name: "MQL（マーケティング適格リード）", type: "動的", count: 186, lastUpdated: "2026-03-14", createdBy: "佐藤 匠", createdAt: "2025-07-15", description: "リードスコア >= 30 かつ ライフサイクル = MQL" },
      { id: "l3", name: "3月セミナー参加者", type: "静的", count: 87, lastUpdated: "2026-03-10", createdBy: "田村 愛", createdAt: "2026-03-01", description: "2026年3月開催セミナーの参加者リスト" },
      { id: "l4", name: "ニュースレター購読者", type: "動的", count: 4567, lastUpdated: "2026-03-14", createdBy: "田村 愛", createdAt: "2025-06-01", description: "ニュースレターオプトイン = true" },
      { id: "l5", name: "90日以上未アクティブ", type: "動的", count: 342, lastUpdated: "2026-03-14", createdBy: "佐藤 匠", createdAt: "2025-09-01", description: "最終アクティビティから90日以上経過" },
      { id: "l6", name: "展示会2026 リード", type: "静的", count: 156, lastUpdated: "2026-02-28", createdBy: "佐藤 匠", createdAt: "2026-02-25", description: "Tech Expo 2026で獲得したリード" },
      { id: "l7", name: "エンタープライズ顧客", type: "動的", count: 45, lastUpdated: "2026-03-13", createdBy: "佐藤 匠", createdAt: "2025-08-01", description: "従業員数 >= 500 かつ ライフサイクル = 顧客" },
      { id: "l8", name: "東京エリアのコンタクト", type: "動的", count: 892, lastUpdated: "2026-03-14", createdBy: "田村 愛", createdAt: "2025-10-01", description: "住所に「東京」を含むコンタクト" },
      { id: "l9", name: "ウェビナー未参加リスト", type: "静的", count: 234, lastUpdated: "2026-03-05", createdBy: "田村 愛", createdAt: "2026-03-01", description: "登録したが未参加のコンタクト" },
      { id: "l10", name: "高エンゲージメントリード", type: "動的", count: 128, lastUpdated: "2026-03-14", createdBy: "佐藤 匠", createdAt: "2026-01-15", description: "メール開封率 > 50% かつ サイト訪問 >= 5回/月" },
      { id: "l11", name: "無料トライアルユーザー", type: "動的", count: 567, lastUpdated: "2026-03-14", createdBy: "佐藤 匠", createdAt: "2025-09-15", description: "トライアルステータス = アクティブ" },
    ];
    const found = mockLists.find((item) => item.id === params.id);
    setData(found || null);
    setLoading(false);
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
        <Link href="/lists" className="hover:text-gray-700">リスト</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900">{data.name}</span>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{data.name}</h1>
        <Badge variant={data.type === "動的" ? "info" : "default"}>
          {data.type === "動的" && <Zap className="h-3 w-3 mr-0.5" />}
          {data.type}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{data.count.toLocaleString()}</p>
                <p className="text-xs text-gray-500">コンタクト数</p>
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
                <p className="text-2xl font-bold text-gray-900">{data.lastUpdated}</p>
                <p className="text-xs text-gray-500">最終更新</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff4800] text-white text-sm">
                {data.createdBy.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{data.createdBy}</p>
                <p className="text-xs text-gray-500">作成者</p>
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
              <dt className="text-sm font-medium text-gray-500">リスト名</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">タイプ</dt>
              <dd className="mt-1">
                <Badge variant={data.type === "動的" ? "info" : "default"}>
                  {data.type === "動的" && <Zap className="h-3 w-3 mr-0.5" />}
                  {data.type}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">コンタクト数</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.count.toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">最終更新</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.lastUpdated}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">作成者</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.createdBy}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">作成日</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.createdAt || "-"}</dd>
            </div>
            {data.description && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">説明</dt>
                <dd className="mt-1 text-sm text-gray-900">{data.description}</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
