"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import {
  Upload,
  FileText,
  Presentation,
  File,
  Eye,
  Clock,
  Users,
  MoreHorizontal,
  ArrowUpDown,
  ExternalLink,
} from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: "PDF" | "プレゼン" | "提案書" | "契約書" | "ホワイトペーパー" | "ケーススタディ";
  views: number;
  lastViewed: string;
  sharedWith: string[];
  size: string;
  createdAt: string;
  owner: string;
}

const documents: Document[] = [
  {
    id: "doc1",
    name: "HubSpot CRM 製品概要資料",
    type: "プレゼン",
    views: 245,
    lastViewed: "2026-03-14",
    sharedWith: ["田中 太郎", "鈴木 花子", "山田 一郎"],
    size: "4.2 MB",
    createdAt: "2026-01-15",
    owner: "佐藤 匠",
  },
  {
    id: "doc2",
    name: "ECサイト構築 提案書",
    type: "提案書",
    views: 18,
    lastViewed: "2026-03-13",
    sharedWith: ["田中 太郎"],
    size: "2.8 MB",
    createdAt: "2026-02-20",
    owner: "佐藤 匠",
  },
  {
    id: "doc3",
    name: "料金プラン比較表",
    type: "PDF",
    views: 432,
    lastViewed: "2026-03-14",
    sharedWith: ["高橋 健一", "佐々木 美咲", "渡辺 大輔", "伊藤 さくら"],
    size: "1.1 MB",
    createdAt: "2026-01-08",
    owner: "田村 愛",
  },
  {
    id: "doc4",
    name: "クラウド移行サービス概要",
    type: "ホワイトペーパー",
    views: 89,
    lastViewed: "2026-03-12",
    sharedWith: ["鈴木 花子"],
    size: "3.5 MB",
    createdAt: "2026-02-01",
    owner: "佐藤 匠",
  },
  {
    id: "doc5",
    name: "太陽コーポレーション 導入事例",
    type: "ケーススタディ",
    views: 156,
    lastViewed: "2026-03-11",
    sharedWith: ["小林 誠", "渡辺 大輔"],
    size: "2.2 MB",
    createdAt: "2026-02-15",
    owner: "佐藤 匠",
  },
  {
    id: "doc6",
    name: "基幹システムリプレイス 契約書ドラフト",
    type: "契約書",
    views: 5,
    lastViewed: "2026-03-10",
    sharedWith: ["渡辺 大輔"],
    size: "890 KB",
    createdAt: "2026-03-05",
    owner: "田村 愛",
  },
  {
    id: "doc7",
    name: "データ分析基盤 技術仕様書",
    type: "PDF",
    views: 32,
    lastViewed: "2026-03-09",
    sharedWith: ["佐々木 美咲"],
    size: "5.1 MB",
    createdAt: "2026-03-01",
    owner: "佐藤 匠",
  },
];

const typeIcon = (type: string) => {
  switch (type) {
    case "PDF":
    case "ホワイトペーパー":
      return <FileText className="h-5 w-5 text-red-500" />;
    case "プレゼン":
      return <Presentation className="h-5 w-5 text-orange-500" />;
    case "提案書":
      return <File className="h-5 w-5 text-blue-500" />;
    case "契約書":
      return <FileText className="h-5 w-5 text-green-500" />;
    case "ケーススタディ":
      return <FileText className="h-5 w-5 text-purple-500" />;
    default:
      return <File className="h-5 w-5 text-gray-500" />;
  }
};

export default function DocumentsPage() {
  const [search, setSearch] = useState("");

  const filtered = documents.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="ドキュメント"
        description="営業・マーケティング資料を管理・共有"
        actions={
          <Button size="sm">
            <Upload className="h-4 w-4 mr-1" />
            アップロード
          </Button>
        }
      />

      {/* Search */}
      <div className="w-72">
        <Input
          variant="search"
          placeholder="ドキュメント名で検索..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Documents Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                    ドキュメント名
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">タイプ</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">
                  <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-gray-700">
                    閲覧数
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">最終閲覧</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">共有先</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">サイズ</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => (
                <tr key={doc.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {typeIcon(doc.type)}
                      <div>
                        <p className="font-medium text-gray-900 hover:text-[#ff4800] cursor-pointer">{doc.name}</p>
                        <p className="text-xs text-gray-500">作成: {doc.createdAt} / {doc.owner}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="default">{doc.type}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1 text-gray-600">
                      <Eye className="h-3 w-3" />
                      {doc.views}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {doc.lastViewed}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-600 text-xs">{doc.sharedWith.length}名</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{doc.size}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                      <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
