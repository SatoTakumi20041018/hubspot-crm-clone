"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Clock,
  Play,
  MoreHorizontal,
  ArrowUpDown,
  Filter,
} from "lucide-react";

interface Call {
  id: string;
  contact: string;
  company: string;
  direction: "inbound" | "outbound";
  duration: string;
  durationSec: number;
  outcome: string;
  notes: string;
  date: string;
  time: string;
  recording: boolean;
}

const calls: Call[] = [
  {
    id: "c1",
    contact: "田中 太郎",
    company: "田中商事株式会社",
    direction: "outbound",
    duration: "15:32",
    durationSec: 932,
    outcome: "接続済み",
    notes: "ECサイト構築案件の見積もりについて確認。来週中にフィードバック予定。",
    date: "2026-03-14",
    time: "10:30",
    recording: true,
  },
  {
    id: "c2",
    contact: "鈴木 花子",
    company: "鈴木テクノロジー",
    direction: "inbound",
    duration: "28:45",
    durationSec: 1725,
    outcome: "接続済み",
    notes: "クラウド移行の技術的な質問。セキュリティ要件の詳細をメールで送付予定。",
    date: "2026-03-14",
    time: "09:15",
    recording: true,
  },
  {
    id: "c3",
    contact: "山田 一郎",
    company: "ABC株式会社",
    direction: "outbound",
    duration: "0:00",
    durationSec: 0,
    outcome: "不在",
    notes: "留守番電話にメッセージを残した。",
    date: "2026-03-14",
    time: "08:45",
    recording: false,
  },
  {
    id: "c4",
    contact: "佐々木 美咲",
    company: "デジタルソリューションズ",
    direction: "outbound",
    duration: "22:10",
    durationSec: 1330,
    outcome: "接続済み",
    notes: "データ分析基盤の要件ヒアリング。次回デモの日程調整完了。",
    date: "2026-03-13",
    time: "16:00",
    recording: true,
  },
  {
    id: "c5",
    contact: "高橋 健一",
    company: "東京マーケティング",
    direction: "inbound",
    duration: "8:20",
    durationSec: 500,
    outcome: "接続済み",
    notes: "ブランディングサイト制作の問い合わせ。提案資料を送付。",
    date: "2026-03-13",
    time: "14:30",
    recording: true,
  },
  {
    id: "c6",
    contact: "伊藤 さくら",
    company: "イノベーション株式会社",
    direction: "outbound",
    duration: "5:15",
    durationSec: 315,
    outcome: "接続済み",
    notes: "セキュリティ監査のスケジュール確認。",
    date: "2026-03-13",
    time: "11:00",
    recording: false,
  },
  {
    id: "c7",
    contact: "渡辺 大輔",
    company: "グローバルシステム",
    direction: "outbound",
    duration: "42:30",
    durationSec: 2550,
    outcome: "接続済み",
    notes: "基幹システムリプレイスの詳細打ち合わせ。見積書の修正点を確認。",
    date: "2026-03-12",
    time: "15:00",
    recording: true,
  },
  {
    id: "c8",
    contact: "小林 誠",
    company: "フューチャーテック",
    direction: "inbound",
    duration: "12:45",
    durationSec: 765,
    outcome: "接続済み",
    notes: "Webアプリ開発の進捗報告。テスト環境の準備状況を確認。",
    date: "2026-03-12",
    time: "10:30",
    recording: true,
  },
  {
    id: "c9",
    contact: "松本 隆",
    company: "太陽コーポレーション",
    direction: "outbound",
    duration: "0:00",
    durationSec: 0,
    outcome: "不在",
    notes: "折り返し依頼のメールを送信。",
    date: "2026-03-12",
    time: "09:00",
    recording: false,
  },
  {
    id: "c10",
    contact: "中村 真理",
    company: "さくらデザイン",
    direction: "outbound",
    duration: "18:20",
    durationSec: 1100,
    outcome: "接続済み",
    notes: "ロゴ・VI制作の方向性について議論。次回プレゼン資料の準備指示。",
    date: "2026-03-11",
    time: "14:00",
    recording: true,
  },
  {
    id: "c11",
    contact: "加藤 由美",
    company: "サンライズメディア",
    direction: "inbound",
    duration: "3:10",
    durationSec: 190,
    outcome: "接続済み",
    notes: "料金プランの問い合わせ。資料を送付した。",
    date: "2026-03-11",
    time: "11:30",
    recording: false,
  },
  {
    id: "c12",
    contact: "井上 千春",
    company: "ハーモニー株式会社",
    direction: "outbound",
    duration: "0:00",
    durationSec: 0,
    outcome: "話し中",
    notes: "後ほど再度架電予定。",
    date: "2026-03-11",
    time: "09:45",
    recording: false,
  },
];

const totalCalls = calls.length;
const connectedCalls = calls.filter((c) => c.outcome === "接続済み");
const avgDuration = Math.round(connectedCalls.reduce((s, c) => s + c.durationSec, 0) / connectedCalls.length);
const todayCalls = calls.filter((c) => c.date === "2026-03-14").length;

export default function CallsPage() {
  const [search, setSearch] = useState("");
  const [filterDirection, setFilterDirection] = useState("すべて");

  const filtered = calls.filter((c) => {
    const matchSearch =
      c.contact.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase());
    const matchDirection =
      filterDirection === "すべて" ||
      (filterDirection === "発信" && c.direction === "outbound") ||
      (filterDirection === "着信" && c.direction === "inbound");
    return matchSearch && matchDirection;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="コールログ"
        description="通話履歴と通話記録の管理"
        actions={
          <Button size="sm">
            <Phone className="h-4 w-4 mr-1" />
            発信する
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalCalls}</p>
                <p className="text-xs text-gray-500">通話合計</p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {Math.floor(avgDuration / 60)}:{String(avgDuration % 60).padStart(2, "0")}
                </p>
                <p className="text-xs text-gray-500">平均通話時間</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                <PhoneOutgoing className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{todayCalls}</p>
                <p className="text-xs text-gray-500">今日の通話</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-72">
              <Input
                variant="search"
                placeholder="コンタクト名、会社名で検索..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:border-[#ff4800] focus:outline-none focus:ring-1 focus:ring-[#ff4800]"
                value={filterDirection}
                onChange={(e) => setFilterDirection(e.target.value)}
              >
                <option>すべて</option>
                <option>発信</option>
                <option>着信</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Calls Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-medium text-gray-500">方向</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                    コンタクト
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">会社</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">通話時間</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">結果</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">メモ</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                    日時
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">録音</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((call) => (
                <tr key={call.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    {call.direction === "inbound" ? (
                      <PhoneIncoming className="h-4 w-4 text-green-500" />
                    ) : call.outcome === "不在" || call.outcome === "話し中" ? (
                      <PhoneMissed className="h-4 w-4 text-red-400" />
                    ) : (
                      <PhoneOutgoing className="h-4 w-4 text-blue-500" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900">
                      {call.contact}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{call.company}</td>
                  <td className="px-4 py-3 text-gray-600">{call.duration === "0:00" ? "-" : call.duration}</td>
                  <td className="px-4 py-3">
                    <Badge variant={
                      call.outcome === "接続済み" ? "success" :
                      call.outcome === "不在" ? "warning" : "default"
                    }>
                      {call.outcome}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-600 text-xs max-w-xs truncate">{call.notes}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {call.date} {call.time}
                  </td>
                  <td className="px-4 py-3">
                    {call.recording && (
                      <button className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200">
                        <Play className="h-3 w-3" />
                        再生
                      </button>
                    )}
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
