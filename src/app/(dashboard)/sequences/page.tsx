"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import {
  Plus,
  MoreHorizontal,
  Mail,
  Clock,
  CheckSquare,
  ArrowRight,
  Users,
  MessageSquare,
  TrendingUp,
  Calendar,
} from "lucide-react";

interface SequenceStep {
  type: "email" | "wait" | "task" | "call";
  label: string;
}

interface Sequence {
  id: string;
  name: string;
  steps: SequenceStep[];
  stepsCount: number;
  enrolled: number;
  replyRate: number;
  meetingRate: number;
  active: boolean;
  createdAt: string;
  owner: string;
}

const sequences: Sequence[] = [
  {
    id: "seq1",
    name: "新規リードアプローチ",
    steps: [
      { type: "email", label: "自己紹介メール" },
      { type: "wait", label: "3日待機" },
      { type: "email", label: "事例紹介メール" },
      { type: "wait", label: "2日待機" },
      { type: "task", label: "電話フォロー" },
      { type: "email", label: "最終フォローアップ" },
    ],
    stepsCount: 6,
    enrolled: 234,
    replyRate: 18.5,
    meetingRate: 8.2,
    active: true,
    createdAt: "2026-01-15",
    owner: "佐藤 匠",
  },
  {
    id: "seq2",
    name: "展示会リードフォロー",
    steps: [
      { type: "email", label: "お礼メール" },
      { type: "wait", label: "1日待機" },
      { type: "email", label: "資料送付" },
      { type: "wait", label: "3日待機" },
      { type: "call", label: "フォローコール" },
      { type: "email", label: "ミーティング提案" },
    ],
    stepsCount: 6,
    enrolled: 156,
    replyRate: 24.3,
    meetingRate: 12.1,
    active: true,
    createdAt: "2026-02-01",
    owner: "佐藤 匠",
  },
  {
    id: "seq3",
    name: "休眠顧客復活",
    steps: [
      { type: "email", label: "近況伺い" },
      { type: "wait", label: "5日待機" },
      { type: "email", label: "新機能案内" },
      { type: "wait", label: "3日待機" },
      { type: "task", label: "個別フォロー検討" },
    ],
    stepsCount: 5,
    enrolled: 89,
    replyRate: 12.4,
    meetingRate: 4.5,
    active: true,
    createdAt: "2026-02-10",
    owner: "田村 愛",
  },
  {
    id: "seq4",
    name: "デモ後フォローアップ",
    steps: [
      { type: "email", label: "デモお礼＋資料" },
      { type: "wait", label: "2日待機" },
      { type: "email", label: "Q&Aフォロー" },
      { type: "wait", label: "3日待機" },
      { type: "call", label: "意思決定確認コール" },
      { type: "email", label: "見積提案" },
      { type: "wait", label: "5日待機" },
      { type: "email", label: "最終確認" },
    ],
    stepsCount: 8,
    enrolled: 78,
    replyRate: 32.1,
    meetingRate: 18.6,
    active: true,
    createdAt: "2026-01-20",
    owner: "佐藤 匠",
  },
  {
    id: "seq5",
    name: "ウェビナー参加者フォロー",
    steps: [
      { type: "email", label: "録画・資料共有" },
      { type: "wait", label: "2日待機" },
      { type: "email", label: "関連コンテンツ" },
      { type: "task", label: "スコア確認・アプローチ判断" },
    ],
    stepsCount: 4,
    enrolled: 312,
    replyRate: 15.8,
    meetingRate: 6.3,
    active: false,
    createdAt: "2026-02-15",
    owner: "田村 愛",
  },
  {
    id: "seq6",
    name: "アップセル提案",
    steps: [
      { type: "email", label: "利用状況レビュー" },
      { type: "wait", label: "3日待機" },
      { type: "email", label: "上位プラン紹介" },
      { type: "wait", label: "4日待機" },
      { type: "call", label: "個別ヒアリング" },
      { type: "email", label: "カスタム提案書" },
    ],
    stepsCount: 6,
    enrolled: 45,
    replyRate: 22.2,
    meetingRate: 15.6,
    active: true,
    createdAt: "2026-03-01",
    owner: "佐藤 匠",
  },
];

const stepTypeConfig = {
  email: { icon: Mail, color: "text-blue-600", bg: "bg-blue-50" },
  wait: { icon: Clock, color: "text-gray-500", bg: "bg-gray-50" },
  task: { icon: CheckSquare, color: "text-orange-600", bg: "bg-orange-50" },
  call: { icon: MessageSquare, color: "text-green-600", bg: "bg-green-50" },
};

export default function SequencesPage() {
  const [search, setSearch] = useState("");

  const filtered = sequences.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="シーケンス"
        description="メール・タスクの自動シーケンスでリードを育成"
        actions={
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            シーケンス作成
          </Button>
        }
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{sequences.length}</p>
                <p className="text-xs text-gray-500">シーケンス数</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {sequences.reduce((s, seq) => s + seq.enrolled, 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">総登録数</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {(sequences.reduce((s, seq) => s + seq.replyRate, 0) / sequences.length).toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500">平均返信率</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {(sequences.reduce((s, seq) => s + seq.meetingRate, 0) / sequences.length).toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500">平均ミーティング率</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="w-72">
        <Input
          variant="search"
          placeholder="シーケンス名で検索..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Sequence List */}
      <div className="space-y-3">
        {filtered.map((seq) => (
          <Card key={seq.id} className="hover:border-gray-300 transition-all">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-semibold text-gray-900">{seq.name}</h3>
                  <Badge variant={seq.active ? "success" : "default"}>
                    {seq.active ? "有効" : "停止中"}
                  </Badge>
                </div>
                <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600" onClick={(e) => e.stopPropagation()}>
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>

              {/* Step Preview */}
              <div className="flex items-center gap-1.5 flex-wrap mb-3">
                {seq.steps.map((step, i) => {
                  const config = stepTypeConfig[step.type];
                  const StepIcon = config.icon;
                  return (
                    <div key={i} className="flex items-center gap-1.5">
                      {i > 0 && <ArrowRight className="h-3 w-3 text-gray-300" />}
                      <div className={`flex items-center gap-1 rounded px-2 py-1 text-xs ${config.bg} ${config.color}`}>
                        <StepIcon className="h-3 w-3" />
                        {step.label}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-xs text-gray-500">
                <span>{seq.stepsCount} ステップ</span>
                <span>登録: {seq.enrolled.toLocaleString()}名</span>
                <span>返信率: {seq.replyRate}%</span>
                <span>ミーティング率: {seq.meetingRate}%</span>
                <span>担当: {seq.owner}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
