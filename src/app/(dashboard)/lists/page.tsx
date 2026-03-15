"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import {
  Plus,
  Users,
  ArrowUpDown,
  MoreHorizontal,
  ListFilter,
  Zap,
  Clock,
} from "lucide-react";

interface ContactList {
  id: string;
  name: string;
  type: "静的" | "動的";
  count: number;
  lastUpdated: string;
  createdBy: string;
  createdAt: string;
  description: string;
}

const lists: ContactList[] = [
  {
    id: "l1",
    name: "全顧客リスト",
    type: "動的",
    count: 2345,
    lastUpdated: "2026-03-14",
    createdBy: "佐藤 匠",
    createdAt: "2025-06-01",
    description: "ライフサイクル = 顧客 のコンタクト",
  },
  {
    id: "l2",
    name: "MQL（マーケティング適格リード）",
    type: "動的",
    count: 186,
    lastUpdated: "2026-03-14",
    createdBy: "佐藤 匠",
    createdAt: "2025-07-15",
    description: "リードスコア >= 30 かつ ライフサイクル = MQL",
  },
  {
    id: "l3",
    name: "3月セミナー参加者",
    type: "静的",
    count: 87,
    lastUpdated: "2026-03-10",
    createdBy: "田村 愛",
    createdAt: "2026-03-01",
    description: "2026年3月開催セミナーの参加者リスト",
  },
  {
    id: "l4",
    name: "ニュースレター購読者",
    type: "動的",
    count: 4567,
    lastUpdated: "2026-03-14",
    createdBy: "田村 愛",
    createdAt: "2025-06-01",
    description: "ニュースレターオプトイン = true",
  },
  {
    id: "l5",
    name: "90日以上未アクティブ",
    type: "動的",
    count: 342,
    lastUpdated: "2026-03-14",
    createdBy: "佐藤 匠",
    createdAt: "2025-09-01",
    description: "最終アクティビティから90日以上経過",
  },
  {
    id: "l6",
    name: "展示会2026 リード",
    type: "静的",
    count: 156,
    lastUpdated: "2026-02-28",
    createdBy: "佐藤 匠",
    createdAt: "2026-02-25",
    description: "Tech Expo 2026で獲得したリード",
  },
  {
    id: "l7",
    name: "エンタープライズ顧客",
    type: "動的",
    count: 45,
    lastUpdated: "2026-03-13",
    createdBy: "佐藤 匠",
    createdAt: "2025-08-01",
    description: "従業員数 >= 500 かつ ライフサイクル = 顧客",
  },
  {
    id: "l8",
    name: "東京エリアのコンタクト",
    type: "動的",
    count: 892,
    lastUpdated: "2026-03-14",
    createdBy: "田村 愛",
    createdAt: "2025-10-01",
    description: "住所に「東京」を含むコンタクト",
  },
  {
    id: "l9",
    name: "ウェビナー未参加リスト",
    type: "静的",
    count: 234,
    lastUpdated: "2026-03-05",
    createdBy: "田村 愛",
    createdAt: "2026-03-01",
    description: "登録したが未参加のコンタクト",
  },
  {
    id: "l10",
    name: "高エンゲージメントリード",
    type: "動的",
    count: 128,
    lastUpdated: "2026-03-14",
    createdBy: "佐藤 匠",
    createdAt: "2026-01-15",
    description: "メール開封率 > 50% かつ サイト訪問 >= 5回/月",
  },
  {
    id: "l11",
    name: "無料トライアルユーザー",
    type: "動的",
    count: 567,
    lastUpdated: "2026-03-14",
    createdBy: "佐藤 匠",
    createdAt: "2025-09-15",
    description: "トライアルステータス = アクティブ",
  },
];

export default function ListsPage() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("すべて");

  const filtered = lists.filter((l) => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "すべて" || l.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="リスト"
        description="コンタクトリストの作成・管理"
        actions={
          <Button size="sm" onClick={() => alert("リスト作成は準備中です")}>
            <Plus className="h-4 w-4 mr-1" />
            リスト作成
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-72">
          <Input
            variant="search"
            placeholder="リスト名で検索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1">
          {["すべて", "静的", "動的"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                filterType === type
                  ? "bg-[#FF7A59] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {type === "動的" && <Zap className="h-3 w-3 inline mr-0.5" />}
              {type === "静的" && <ListFilter className="h-3 w-3 inline mr-0.5" />}
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Lists Table */}
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
                    リスト名
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">タイプ</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">
                  <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-gray-700">
                    件数
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">最終更新</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">作成者</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((list) => (
                <tr key={list.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {list.name}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 ml-6">{list.description}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={list.type === "動的" ? "info" : "default"}>
                      {list.type === "動的" && <Zap className="h-3 w-3 mr-0.5" />}
                      {list.type}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    {list.count.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {list.lastUpdated}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FF7A59] text-[10px] text-white">
                        {list.createdBy.charAt(0)}
                      </div>
                      <span className="text-gray-600 text-xs">{list.createdBy}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
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
