"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  LayoutGrid,
  List,
  ChevronDown,
  ArrowUpDown,
  MoreHorizontal,
  Calendar,
  Building2,
  GripVertical,
} from "lucide-react";

const pipelineStages = [
  "初回商談",
  "提案中",
  "見積提出",
  "交渉中",
  "契約締結",
  "失注",
];

const stageColors: Record<string, string> = {
  初回商談: "bg-blue-500",
  提案中: "bg-cyan-500",
  見積提出: "bg-yellow-500",
  交渉中: "bg-orange-500",
  契約締結: "bg-green-500",
  失注: "bg-red-500",
};

const stageBadgeVariant: Record<string, "default" | "info" | "warning" | "success" | "danger" | "purple"> = {
  初回商談: "info",
  提案中: "info",
  見積提出: "warning",
  交渉中: "warning",
  契約締結: "success",
  失注: "danger",
};

const deals = [
  {
    id: "d1",
    name: "ECサイト構築案件",
    amount: 4500000,
    stage: "見積提出",
    company: "田中商事株式会社",
    companyId: "1",
    contact: "田中 太郎",
    contactId: "1",
    closeDate: "2026-04-30",
    owner: "佐藤 匠",
    probability: 60,
    createdAt: "2026-01-15",
  },
  {
    id: "d2",
    name: "MAツール導入",
    amount: 1200000,
    stage: "初回商談",
    company: "田中商事株式会社",
    companyId: "1",
    contact: "田中 太郎",
    contactId: "1",
    closeDate: "2026-06-15",
    owner: "佐藤 匠",
    probability: 20,
    createdAt: "2026-03-01",
  },
  {
    id: "d3",
    name: "クラウド移行プロジェクト",
    amount: 8500000,
    stage: "提案中",
    company: "鈴木テクノロジー",
    companyId: "2",
    contact: "鈴木 花子",
    contactId: "2",
    closeDate: "2026-05-15",
    owner: "佐藤 匠",
    probability: 40,
    createdAt: "2026-02-10",
  },
  {
    id: "d4",
    name: "CRM導入支援",
    amount: 3200000,
    stage: "交渉中",
    company: "ABC株式会社",
    companyId: "3",
    contact: "山田 一郎",
    contactId: "3",
    closeDate: "2026-04-10",
    owner: "田村 愛",
    probability: 75,
    createdAt: "2025-12-20",
  },
  {
    id: "d5",
    name: "データ分析基盤構築",
    amount: 6800000,
    stage: "提案中",
    company: "デジタルソリューションズ",
    companyId: "4",
    contact: "佐々木 美咲",
    contactId: "4",
    closeDate: "2026-06-30",
    owner: "佐藤 匠",
    probability: 30,
    createdAt: "2026-02-25",
  },
  {
    id: "d6",
    name: "ブランディングサイト制作",
    amount: 2800000,
    stage: "初回商談",
    company: "東京マーケティング",
    companyId: "5",
    contact: "高橋 健一",
    contactId: "5",
    closeDate: "2026-07-01",
    owner: "田村 愛",
    probability: 15,
    createdAt: "2026-03-05",
  },
  {
    id: "d7",
    name: "基幹システムリプレイス",
    amount: 15000000,
    stage: "見積提出",
    company: "グローバルシステム",
    companyId: "7",
    contact: "渡辺 大輔",
    contactId: "7",
    closeDate: "2026-08-31",
    owner: "佐藤 匠",
    probability: 50,
    createdAt: "2026-01-20",
  },
  {
    id: "d8",
    name: "Webアプリ開発",
    amount: 5500000,
    stage: "交渉中",
    company: "フューチャーテック",
    companyId: "9",
    contact: "小林 誠",
    contactId: "9",
    closeDate: "2026-04-20",
    owner: "佐藤 匠",
    probability: 80,
    createdAt: "2025-11-15",
  },
  {
    id: "d9",
    name: "コーポレートサイトリニューアル",
    amount: 3500000,
    stage: "契約締結",
    company: "ネクサス株式会社",
    companyId: "10",
    contact: "清水 拓也",
    contactId: "15",
    closeDate: "2026-03-31",
    owner: "佐藤 匠",
    probability: 100,
    createdAt: "2025-10-01",
  },
  {
    id: "d10",
    name: "ECプラットフォーム導入",
    amount: 7200000,
    stage: "契約締結",
    company: "太陽コーポレーション",
    companyId: "11",
    contact: "松本 隆",
    contactId: "11",
    closeDate: "2026-02-28",
    owner: "佐藤 匠",
    probability: 100,
    createdAt: "2025-09-01",
  },
  {
    id: "d11",
    name: "AI チャットボット開発",
    amount: 4000000,
    stage: "初回商談",
    company: "ハーモニー株式会社",
    companyId: "12",
    contact: "井上 千春",
    contactId: "12",
    closeDate: "2026-08-15",
    owner: "田村 愛",
    probability: 10,
    createdAt: "2026-03-10",
  },
  {
    id: "d12",
    name: "Webマーケティング支援",
    amount: 1800000,
    stage: "失注",
    company: "サンライズメディア",
    companyId: "10",
    contact: "加藤 由美",
    contactId: "10",
    closeDate: "2026-02-15",
    owner: "田村 愛",
    probability: 0,
    createdAt: "2025-12-01",
  },
  {
    id: "d13",
    name: "セキュリティ監査",
    amount: 2400000,
    stage: "提案中",
    company: "イノベーション株式会社",
    companyId: "6",
    contact: "伊藤 さくら",
    contactId: "6",
    closeDate: "2026-05-30",
    owner: "佐藤 匠",
    probability: 35,
    createdAt: "2026-02-18",
  },
  {
    id: "d14",
    name: "ロゴ・VI制作",
    amount: 800000,
    stage: "見積提出",
    company: "さくらデザイン",
    companyId: "8",
    contact: "中村 真理",
    contactId: "8",
    closeDate: "2026-04-15",
    owner: "田村 愛",
    probability: 55,
    createdAt: "2026-02-05",
  },
];

const formatAmount = (amount: number) => {
  return `¥${amount.toLocaleString()}`;
};

export default function DealsPage() {
  const [viewMode, setViewMode] = useState<"board" | "table">("board");

  const dealsByStage = pipelineStages.map((stage) => ({
    stage,
    deals: deals.filter((d) => d.stage === stage),
    total: deals
      .filter((d) => d.stage === stage)
      .reduce((sum, d) => sum + d.amount, 0),
  }));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">取引</h1>
          <p className="text-sm text-gray-500 mt-1">
            {deals.length}件の取引 - 合計{" "}
            {formatAmount(deals.reduce((s, d) => s + d.amount, 0))}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Pipeline Selector */}
          <select className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:border-[#ff4800] focus:outline-none focus:ring-1 focus:ring-[#ff4800]">
            <option>デフォルトパイプライン</option>
            <option>エンタープライズ</option>
          </select>

          {/* View Toggle */}
          <div className="flex rounded-md border border-gray-300">
            <button
              onClick={() => setViewMode("board")}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm ${
                viewMode === "board"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              ボード
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm border-l border-gray-300 ${
                viewMode === "table"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <List className="h-4 w-4" />
              テーブル
            </button>
          </div>

          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            取引を作成
          </Button>
        </div>
      </div>

      {/* Board View */}
      {viewMode === "board" && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {dealsByStage.map((stageGroup) => (
            <div
              key={stageGroup.stage}
              className="flex-shrink-0 w-72"
            >
              {/* Column Header */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${stageColors[stageGroup.stage]}`}
                  />
                  <h3 className="text-sm font-semibold text-gray-900">
                    {stageGroup.stage}
                  </h3>
                  <span className="text-xs text-gray-400">
                    {stageGroup.deals.length}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  合計: {formatAmount(stageGroup.total)}
                </p>
              </div>

              {/* Deal Cards */}
              <div className="space-y-2">
                {stageGroup.deals.map((deal) => (
                  <Card
                    key={deal.id}
                    className="cursor-pointer hover:border-gray-300 hover:shadow-md transition-all"
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-900 leading-tight">
                          {deal.name}
                        </h4>
                        <button className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-lg font-bold text-gray-900 mb-2">
                        {formatAmount(deal.amount)}
                      </p>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Building2 className="h-3.5 w-3.5" />
                          {deal.company}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Calendar className="h-3.5 w-3.5" />
                          クローズ: {deal.closeDate}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ff4800] text-[10px] text-white">
                          {deal.owner.charAt(0)}
                        </div>
                        <span className="text-xs text-gray-400">
                          {deal.probability}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Add Deal Button */}
                <button className="w-full rounded-lg border-2 border-dashed border-gray-200 p-3 text-sm text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-colors">
                  <Plus className="h-4 w-4 mx-auto" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left font-medium text-gray-500">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                      取引名
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">
                    <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-gray-700">
                      金額
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">
                    ステージ
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">
                    会社
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">
                    担当者
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                      クローズ予定
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">
                    確度
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {deals.map((deal) => (
                  <tr
                    key={deal.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-900 hover:text-[#ff4800] cursor-pointer">
                        {deal.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      {formatAmount(deal.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={stageBadgeVariant[deal.stage]}>
                        {deal.stage}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{deal.company}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ff4800] text-[10px] text-white">
                          {deal.owner.charAt(0)}
                        </div>
                        <span className="text-gray-600">{deal.owner}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {deal.closeDate}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {deal.probability}%
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
      )}
    </div>
  );
}
