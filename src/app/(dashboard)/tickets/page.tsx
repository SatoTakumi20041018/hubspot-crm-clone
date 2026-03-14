"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertCircle,
} from "lucide-react";

const statuses = ["すべて", "新規", "対応中", "待機中", "解決済み", "クローズ"];
const priorities = ["すべて", "緊急", "高", "中", "低"];

const tickets = [
  {
    id: "TK-001",
    subject: "ログイン不具合の報告",
    status: "対応中",
    priority: "高",
    contact: "田中 太郎",
    contactId: "1",
    company: "田中商事株式会社",
    owner: "佐藤 匠",
    createdAt: "2026-03-13",
    sla: "4時間",
    slaStatus: "warning",
  },
  {
    id: "TK-002",
    subject: "データエクスポート機能のリクエスト",
    status: "新規",
    priority: "中",
    contact: "鈴木 花子",
    contactId: "2",
    company: "鈴木テクノロジー",
    owner: "田村 愛",
    createdAt: "2026-03-13",
    sla: "24時間",
    slaStatus: "ok",
  },
  {
    id: "TK-003",
    subject: "請求書のPDF出力でレイアウト崩れ",
    status: "対応中",
    priority: "高",
    contact: "山田 一郎",
    contactId: "3",
    company: "ABC株式会社",
    owner: "佐藤 匠",
    createdAt: "2026-03-12",
    sla: "2時間",
    slaStatus: "danger",
  },
  {
    id: "TK-004",
    subject: "パスワードリセットができない",
    status: "解決済み",
    priority: "高",
    contact: "佐々木 美咲",
    contactId: "4",
    company: "デジタルソリューションズ",
    owner: "佐藤 匠",
    createdAt: "2026-03-11",
    sla: "完了",
    slaStatus: "ok",
  },
  {
    id: "TK-005",
    subject: "APIレート制限の緩和リクエスト",
    status: "待機中",
    priority: "中",
    contact: "高橋 健一",
    contactId: "5",
    company: "東京マーケティング",
    owner: "田村 愛",
    createdAt: "2026-03-11",
    sla: "48時間",
    slaStatus: "ok",
  },
  {
    id: "TK-006",
    subject: "通知メールが届かない",
    status: "新規",
    priority: "緊急",
    contact: "伊藤 さくら",
    contactId: "6",
    company: "イノベーション株式会社",
    owner: "佐藤 匠",
    createdAt: "2026-03-14",
    sla: "1時間",
    slaStatus: "danger",
  },
  {
    id: "TK-007",
    subject: "ダッシュボードの表示速度改善",
    status: "対応中",
    priority: "中",
    contact: "渡辺 大輔",
    contactId: "7",
    company: "グローバルシステム",
    owner: "田村 愛",
    createdAt: "2026-03-10",
    sla: "8時間",
    slaStatus: "warning",
  },
  {
    id: "TK-008",
    subject: "カスタムフィールドの追加依頼",
    status: "待機中",
    priority: "低",
    contact: "中村 真理",
    contactId: "8",
    company: "さくらデザイン",
    owner: "佐藤 匠",
    createdAt: "2026-03-09",
    sla: "72時間",
    slaStatus: "ok",
  },
  {
    id: "TK-009",
    subject: "インポート時のデータ重複問題",
    status: "対応中",
    priority: "高",
    contact: "小林 誠",
    contactId: "9",
    company: "フューチャーテック",
    owner: "佐藤 匠",
    createdAt: "2026-03-08",
    sla: "6時間",
    slaStatus: "danger",
  },
  {
    id: "TK-010",
    subject: "レポート機能の改善提案",
    status: "新規",
    priority: "低",
    contact: "加藤 由美",
    contactId: "10",
    company: "サンライズメディア",
    owner: "田村 愛",
    createdAt: "2026-03-14",
    sla: "72時間",
    slaStatus: "ok",
  },
  {
    id: "TK-011",
    subject: "SSO設定でエラーが発生",
    status: "新規",
    priority: "緊急",
    contact: "松本 隆",
    contactId: "11",
    company: "太陽コーポレーション",
    owner: "佐藤 匠",
    createdAt: "2026-03-14",
    sla: "1時間",
    slaStatus: "warning",
  },
  {
    id: "TK-012",
    subject: "モバイル表示の不具合",
    status: "解決済み",
    priority: "中",
    contact: "井上 千春",
    contactId: "12",
    company: "ハーモニー株式会社",
    owner: "田村 愛",
    createdAt: "2026-03-07",
    sla: "完了",
    slaStatus: "ok",
  },
];

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case "新規":
      return "info" as const;
    case "対応中":
      return "warning" as const;
    case "待機中":
      return "default" as const;
    case "解決済み":
      return "success" as const;
    case "クローズ":
      return "default" as const;
    default:
      return "default" as const;
  }
};

const priorityBadgeVariant = (priority: string) => {
  switch (priority) {
    case "緊急":
      return "danger" as const;
    case "高":
      return "danger" as const;
    case "中":
      return "warning" as const;
    case "低":
      return "default" as const;
    default:
      return "default" as const;
  }
};

export default function TicketsPage() {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("すべて");
  const [selectedPriority, setSelectedPriority] = useState("すべて");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const filtered = tickets.filter((t) => {
    const matchSearch =
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.contact.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      selectedStatus === "すべて" || t.status === selectedStatus;
    const matchPriority =
      selectedPriority === "すべて" || t.priority === selectedPriority;
    return matchSearch && matchStatus && matchPriority;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  // Stats
  const openCount = tickets.filter(
    (t) => t.status === "新規" || t.status === "対応中"
  ).length;
  const urgentCount = tickets.filter((t) => t.priority === "緊急").length;
  const resolvedToday = tickets.filter(
    (t) => t.status === "解決済み" && t.createdAt >= "2026-03-14"
  ).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">チケット</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length}件のチケット
          </p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          チケットを作成
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <div className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
              <AlertCircle className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{openCount}</p>
              <p className="text-xs text-gray-500">未解決チケット</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{urgentCount}</p>
              <p className="text-xs text-gray-500">緊急チケット</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">4.2h</p>
              <p className="text-xs text-gray-500">平均解決時間</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-72">
              <Input
                variant="search"
                placeholder="件名、コンタクトで検索..."
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
                className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:border-[#ff4800] focus:outline-none focus:ring-1 focus:ring-[#ff4800]"
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    ステータス: {s}
                  </option>
                ))}
              </select>
              <select
                className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:border-[#ff4800] focus:outline-none focus:ring-1 focus:ring-[#ff4800]"
                value={selectedPriority}
                onChange={(e) => {
                  setSelectedPriority(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {priorities.map((s) => (
                  <option key={s} value={s}>
                    優先度: {s}
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
                  ID
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                    件名
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  ステータス
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  優先度
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  コンタクト
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
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  SLA
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                    {ticket.id}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900 hover:text-[#ff4800]">
                      {ticket.subject}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusBadgeVariant(ticket.status)}>
                      {ticket.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={priorityBadgeVariant(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-gray-900">{ticket.contact}</p>
                      <p className="text-xs text-gray-500">{ticket.company}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ff4800] text-[10px] text-white">
                        {ticket.owner.charAt(0)}
                      </div>
                      <span className="text-gray-600">{ticket.owner}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {ticket.createdAt}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium ${
                        ticket.slaStatus === "danger"
                          ? "text-red-600"
                          : ticket.slaStatus === "warning"
                            ? "text-yellow-600"
                            : "text-green-600"
                      }`}
                    >
                      {ticket.sla}
                    </span>
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
