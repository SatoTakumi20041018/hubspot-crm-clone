"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Filter,
  Download,
  MoreHorizontal,
} from "lucide-react";

const lifecycleStages = [
  "すべて",
  "サブスクライバー",
  "リード",
  "MQL",
  "SQL",
  "商談中",
  "顧客",
  "エバンジェリスト",
];
const leadStatuses = [
  "すべて",
  "新規",
  "オープン",
  "進行中",
  "未対応",
  "対応済み",
];

const contacts = [
  {
    id: "1",
    name: "田中 太郎",
    email: "tanaka@tanaka-corp.jp",
    company: "田中商事株式会社",
    phone: "03-1234-5678",
    lifecycleStage: "商談中",
    leadStatus: "進行中",
    owner: "佐藤 匠",
    createdAt: "2025-12-15",
    avatar: "田",
  },
  {
    id: "2",
    name: "鈴木 花子",
    email: "suzuki@suzuki-tech.co.jp",
    company: "鈴木テクノロジー",
    phone: "06-2345-6789",
    lifecycleStage: "顧客",
    leadStatus: "対応済み",
    owner: "佐藤 匠",
    createdAt: "2025-11-20",
    avatar: "鈴",
  },
  {
    id: "3",
    name: "山田 一郎",
    email: "yamada@abc-corp.jp",
    company: "ABC株式会社",
    phone: "03-3456-7890",
    lifecycleStage: "リード",
    leadStatus: "新規",
    owner: "佐藤 匠",
    createdAt: "2026-01-05",
    avatar: "山",
  },
  {
    id: "4",
    name: "佐々木 美咲",
    email: "sasaki@digital-sol.jp",
    company: "デジタルソリューションズ",
    phone: "03-4567-8901",
    lifecycleStage: "商談中",
    leadStatus: "進行中",
    owner: "田村 愛",
    createdAt: "2026-01-10",
    avatar: "佐",
  },
  {
    id: "5",
    name: "高橋 健一",
    email: "takahashi@tokyo-mktg.jp",
    company: "東京マーケティング",
    phone: "03-5678-9012",
    lifecycleStage: "MQL",
    leadStatus: "オープン",
    owner: "佐藤 匠",
    createdAt: "2026-01-18",
    avatar: "高",
  },
  {
    id: "6",
    name: "伊藤 さくら",
    email: "ito@innovation.jp",
    company: "イノベーション株式会社",
    phone: "045-6789-0123",
    lifecycleStage: "顧客",
    leadStatus: "対応済み",
    owner: "田村 愛",
    createdAt: "2025-10-08",
    avatar: "伊",
  },
  {
    id: "7",
    name: "渡辺 大輔",
    email: "watanabe@global-sys.jp",
    company: "グローバルシステム",
    phone: "03-7890-1234",
    lifecycleStage: "SQL",
    leadStatus: "進行中",
    owner: "佐藤 匠",
    createdAt: "2026-02-01",
    avatar: "渡",
  },
  {
    id: "8",
    name: "中村 真理",
    email: "nakamura@sakura-design.jp",
    company: "さくらデザイン",
    phone: "06-8901-2345",
    lifecycleStage: "リード",
    leadStatus: "新規",
    owner: "田村 愛",
    createdAt: "2026-02-10",
    avatar: "中",
  },
  {
    id: "9",
    name: "小林 誠",
    email: "kobayashi@future-tech.co.jp",
    company: "フューチャーテック",
    phone: "03-9012-3456",
    lifecycleStage: "MQL",
    leadStatus: "オープン",
    owner: "佐藤 匠",
    createdAt: "2026-02-15",
    avatar: "小",
  },
  {
    id: "10",
    name: "加藤 由美",
    email: "kato@sunrise-media.jp",
    company: "サンライズメディア",
    phone: "03-0123-4567",
    lifecycleStage: "サブスクライバー",
    leadStatus: "新規",
    owner: "田村 愛",
    createdAt: "2026-02-20",
    avatar: "加",
  },
  {
    id: "11",
    name: "松本 隆",
    email: "matsumoto@taiyo-corp.jp",
    company: "太陽コーポレーション",
    phone: "052-1234-5678",
    lifecycleStage: "商談中",
    leadStatus: "進行中",
    owner: "佐藤 匠",
    createdAt: "2026-02-25",
    avatar: "松",
  },
  {
    id: "12",
    name: "井上 千春",
    email: "inoue@harmony-inc.jp",
    company: "ハーモニー株式会社",
    phone: "03-2345-6789",
    lifecycleStage: "SQL",
    leadStatus: "オープン",
    owner: "佐藤 匠",
    createdAt: "2026-03-01",
    avatar: "井",
  },
  {
    id: "13",
    name: "木村 翔太",
    email: "kimura@cross-bridge.jp",
    company: "クロスブリッジ",
    phone: "06-3456-7890",
    lifecycleStage: "リード",
    leadStatus: "未対応",
    owner: "田村 愛",
    createdAt: "2026-03-05",
    avatar: "木",
  },
  {
    id: "14",
    name: "林 美穂",
    email: "hayashi@prime-data.jp",
    company: "プライムデータ",
    phone: "03-4567-8901",
    lifecycleStage: "MQL",
    leadStatus: "進行中",
    owner: "佐藤 匠",
    createdAt: "2026-03-08",
    avatar: "林",
  },
  {
    id: "15",
    name: "清水 拓也",
    email: "shimizu@nexus-corp.jp",
    company: "ネクサス株式会社",
    phone: "03-5678-9012",
    lifecycleStage: "エバンジェリスト",
    leadStatus: "対応済み",
    owner: "佐藤 匠",
    createdAt: "2025-08-15",
    avatar: "清",
  },
  {
    id: "16",
    name: "森田 結衣",
    email: "morita@pixel-lab.jp",
    company: "ピクセルラボ",
    phone: "045-6789-0123",
    lifecycleStage: "顧客",
    leadStatus: "対応済み",
    owner: "田村 愛",
    createdAt: "2025-09-20",
    avatar: "森",
  },
];

const stageBadgeVariant = (stage: string) => {
  switch (stage) {
    case "顧客":
    case "エバンジェリスト":
      return "success" as const;
    case "商談中":
    case "SQL":
      return "info" as const;
    case "MQL":
      return "purple" as const;
    case "リード":
      return "warning" as const;
    default:
      return "default" as const;
  }
};

export default function ContactsPage() {
  const [search, setSearch] = useState("");
  const [selectedStage, setSelectedStage] = useState("すべて");
  const [selectedStatus, setSelectedStatus] = useState("すべて");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const filtered = contacts.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase());
    const matchStage =
      selectedStage === "すべて" || c.lifecycleStage === selectedStage;
    const matchStatus =
      selectedStatus === "すべて" || c.leadStatus === selectedStatus;
    return matchSearch && matchStage && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">コンタクト</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length}件のコンタクト
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            エクスポート
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            コンタクトを作成
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-72">
              <Input
                variant="search"
                placeholder="名前、メール、会社名で検索..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:border-[#FF7A59] focus:outline-none focus:ring-1 focus:ring-[#FF7A59]"
                value={selectedStage}
                onChange={(e) => {
                  setSelectedStage(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {lifecycleStages.map((s) => (
                  <option key={s} value={s}>
                    ライフサイクル: {s}
                  </option>
                ))}
              </select>
              <select
                className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:border-[#FF7A59] focus:outline-none focus:ring-1 focus:ring-[#FF7A59]"
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {leadStatuses.map((s) => (
                  <option key={s} value={s}>
                    リードステータス: {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Table */}
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
                    名前
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  メール
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  会社
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  電話番号
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  ライフサイクル
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  担当者
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                    作成日
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((contact) => (
                <tr
                  key={contact.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/contacts/${contact.id}`}
                      className="flex items-center gap-3 group"
                    >
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#FF7A59] text-xs font-medium text-white">
                        {contact.avatar}
                      </div>
                      <span className="font-medium text-gray-900 group-hover:text-[#FF7A59]">
                        {contact.name}
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{contact.email}</td>
                  <td className="px-4 py-3 text-gray-600">{contact.company}</td>
                  <td className="px-4 py-3 text-gray-600">{contact.phone}</td>
                  <td className="px-4 py-3">
                    <Badge variant={stageBadgeVariant(contact.lifecycleStage)}>
                      {contact.lifecycleStage}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{contact.owner}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {contact.createdAt}
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

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
          <p className="text-sm text-gray-500">
            {filtered.length}件中 {(currentPage - 1) * perPage + 1}-
            {Math.min(currentPage * perPage, filtered.length)}件を表示
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === currentPage ? "primary" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
