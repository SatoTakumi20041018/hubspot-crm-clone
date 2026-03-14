"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import {
  Plus,
  Target,
  DollarSign,
  Handshake,
  Phone,
  TrendingUp,
  MoreHorizontal,
} from "lucide-react";

interface Goal {
  id: string;
  name: string;
  type: "revenue" | "deals" | "calls" | "meetings" | "tasks";
  target: number;
  current: number;
  unit: string;
  owner: string;
  period: string;
  startDate: string;
  endDate: string;
}

const goals: Goal[] = [
  {
    id: "g1",
    name: "Q1 売上目標",
    type: "revenue",
    target: 45000000,
    current: 32500000,
    unit: "¥",
    owner: "佐藤 匠",
    period: "Q1 2026",
    startDate: "2026-01-01",
    endDate: "2026-03-31",
  },
  {
    id: "g2",
    name: "月間成約件数",
    type: "deals",
    target: 15,
    current: 12,
    unit: "件",
    owner: "佐藤 匠",
    period: "2026年3月",
    startDate: "2026-03-01",
    endDate: "2026-03-31",
  },
  {
    id: "g3",
    name: "週間コール数",
    type: "calls",
    target: 50,
    current: 38,
    unit: "件",
    owner: "田村 愛",
    period: "2026年3月 W3",
    startDate: "2026-03-10",
    endDate: "2026-03-16",
  },
  {
    id: "g4",
    name: "チーム売上目標",
    type: "revenue",
    target: 80000000,
    current: 62100000,
    unit: "¥",
    owner: "チーム全体",
    period: "Q1 2026",
    startDate: "2026-01-01",
    endDate: "2026-03-31",
  },
  {
    id: "g5",
    name: "新規リード獲得数",
    type: "deals",
    target: 200,
    current: 186,
    unit: "件",
    owner: "田村 愛",
    period: "2026年3月",
    startDate: "2026-03-01",
    endDate: "2026-03-31",
  },
  {
    id: "g6",
    name: "ミーティング数目標",
    type: "meetings",
    target: 30,
    current: 22,
    unit: "件",
    owner: "佐藤 匠",
    period: "2026年3月",
    startDate: "2026-03-01",
    endDate: "2026-03-31",
  },
  {
    id: "g7",
    name: "タスク完了率",
    type: "tasks",
    target: 90,
    current: 79,
    unit: "%",
    owner: "チーム全体",
    period: "2026年3月",
    startDate: "2026-03-01",
    endDate: "2026-03-31",
  },
];

const typeConfig: Record<string, { icon: typeof Target; color: string; bg: string; label: string }> = {
  revenue: { icon: DollarSign, label: "売上", color: "text-green-600", bg: "bg-green-50" },
  deals: { icon: Handshake, label: "取引", color: "text-blue-600", bg: "bg-blue-50" },
  calls: { icon: Phone, label: "コール", color: "text-purple-600", bg: "bg-purple-50" },
  meetings: { icon: Target, label: "ミーティング", color: "text-orange-600", bg: "bg-orange-50" },
  tasks: { icon: TrendingUp, label: "タスク", color: "text-cyan-600", bg: "bg-cyan-50" },
};

const formatValue = (value: number, unit: string) => {
  if (unit === "¥") {
    return `¥${(value / 10000).toLocaleString()}万`;
  }
  return `${value.toLocaleString()}${unit}`;
};

export default function GoalsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="ゴール"
        description="個人・チームの目標設定と進捗管理"
        actions={
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            ゴール作成
          </Button>
        }
      />

      {/* Goals Grid */}
      <div className="space-y-4">
        {goals.map((goal) => {
          const config = typeConfig[goal.type];
          const Icon = config.icon;
          const progress = Math.round((goal.current / goal.target) * 100);
          const isOnTrack = progress >= 70;
          const isComplete = progress >= 100;

          return (
            <Card key={goal.id} className="hover:border-gray-300 transition-all">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${config.bg}`}>
                      <Icon className={`h-5 w-5 ${config.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-gray-900">{goal.name}</h3>
                        <Badge variant={
                          isComplete ? "success" :
                          isOnTrack ? "info" : "warning"
                        }>
                          {isComplete ? "達成" : isOnTrack ? "順調" : "要注意"}
                        </Badge>
                        <Badge variant="default">{config.label}</Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span>{goal.owner}</span>
                        <span>{goal.period}</span>
                      </div>
                    </div>
                  </div>
                  <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      現在: <span className="font-medium text-gray-900">{formatValue(goal.current, goal.unit)}</span>
                    </span>
                    <span className="text-gray-600">
                      目標: <span className="font-medium text-gray-900">{formatValue(goal.target, goal.unit)}</span>
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-gray-100">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        isComplete ? "bg-green-400" :
                        isOnTrack ? "bg-blue-400" : "bg-yellow-400"
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-medium ${
                      isComplete ? "text-green-600" :
                      isOnTrack ? "text-blue-600" : "text-yellow-600"
                    }`}>
                      {progress}% 達成
                    </span>
                    <span className="text-gray-500">
                      残り: {formatValue(Math.max(goal.target - goal.current, 0), goal.unit)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
