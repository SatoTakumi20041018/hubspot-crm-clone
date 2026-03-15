"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  Loader2,
  AlertCircle,
  Target,
  DollarSign,
  Handshake,
  Phone,
  TrendingUp,
  User,
  Calendar,
} from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

const typeConfig: Record<string, { icon: typeof Target; label: string; color: string; bg: string }> = {
  revenue: { icon: DollarSign, label: "売上", color: "text-green-600", bg: "bg-green-50" },
  deals: { icon: Handshake, label: "取引", color: "text-blue-600", bg: "bg-blue-50" },
  calls: { icon: Phone, label: "コール", color: "text-purple-600", bg: "bg-purple-50" },
  meetings: { icon: Target, label: "ミーティング", color: "text-orange-600", bg: "bg-orange-50" },
  tasks: { icon: TrendingUp, label: "タスク", color: "text-cyan-600", bg: "bg-cyan-50" },
};

const formatValue = (value: number, unit: string) => {
  if (unit === "¥") return `¥${(value / 10000).toLocaleString()}万`;
  return `${value.toLocaleString()}${unit}`;
};

const goals = [
  { id: "g1", name: "Q1 売上目標", type: "revenue", target: 45000000, current: 32500000, unit: "¥", owner: "佐藤 匠", period: "Q1 2026", startDate: "2026-01-01", endDate: "2026-03-31" },
  { id: "g2", name: "月間成約件数", type: "deals", target: 15, current: 12, unit: "件", owner: "佐藤 匠", period: "2026年3月", startDate: "2026-03-01", endDate: "2026-03-31" },
  { id: "g3", name: "週間コール数", type: "calls", target: 50, current: 38, unit: "件", owner: "田村 愛", period: "2026年3月 W3", startDate: "2026-03-10", endDate: "2026-03-16" },
  { id: "g4", name: "チーム売上目標", type: "revenue", target: 80000000, current: 62100000, unit: "¥", owner: "チーム全体", period: "Q1 2026", startDate: "2026-01-01", endDate: "2026-03-31" },
  { id: "g5", name: "新規リード獲得数", type: "deals", target: 200, current: 186, unit: "件", owner: "田村 愛", period: "2026年3月", startDate: "2026-03-01", endDate: "2026-03-31" },
  { id: "g6", name: "ミーティング数目標", type: "meetings", target: 30, current: 22, unit: "件", owner: "佐藤 匠", period: "2026年3月", startDate: "2026-03-01", endDate: "2026-03-31" },
  { id: "g7", name: "タスク完了率", type: "tasks", target: 90, current: 79, unit: "%", owner: "チーム全体", period: "2026年3月", startDate: "2026-03-01", endDate: "2026-03-31" },
];

export default function GoalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const item = goals.find((g) => g.id === params.id);
      if (item) {
        setData(item);
      } else {
        setError("ゴールが見つかりません");
      }
    } catch {
      setError("データの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          戻る
        </Button>
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-600 font-medium mb-2">エラー</p>
            <p className="text-sm text-gray-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const config = typeConfig[data.type] || typeConfig.revenue;
  const Icon = config.icon;
  const progress = Math.round((data.current / data.target) * 100);
  const isOnTrack = progress >= 70;
  const isComplete = progress >= 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-700">ホーム</Link>
        <span>/</span>
        <Link href="/goals" className="hover:text-gray-700">ゴール</Link>
        <span>/</span>
        <span className="text-gray-900">{data.name}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            戻る
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{data.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="default">{config.label}</Badge>
              <span className="text-sm text-gray-500">{data.period}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${config.bg}`}>
                <Icon className={`h-6 w-6 ${config.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">進捗</p>
                <p className={`text-3xl font-bold ${isComplete ? "text-green-600" : isOnTrack ? "text-blue-600" : "text-yellow-600"}`}>{progress}%</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">現在 / 目標</p>
              <p className="text-lg font-bold text-gray-900">{formatValue(data.current, data.unit)} / {formatValue(data.target, data.unit)}</p>
            </div>
          </div>
          <div className="h-4 w-full rounded-full bg-gray-100">
            <div className={`h-4 rounded-full transition-all ${isComplete ? "bg-green-400" : isOnTrack ? "bg-blue-400" : "bg-yellow-400"}`} style={{ width: `${Math.min(progress, 100)}%` }} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-5 w-5 text-[#ff4800]" />
              ゴール情報
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">名前</span>
              <span className="text-sm font-medium text-gray-900">{data.name}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">タイプ</span>
              <Badge variant="default">{config.label}</Badge>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">目標値</span>
              <span className="text-sm font-bold text-gray-900">{formatValue(data.target, data.unit)}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">現在値</span>
              <span className="text-sm font-bold text-gray-900">{formatValue(data.current, data.unit)}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <User className="h-4 w-4" />
                担当者
              </div>
              <span className="text-sm font-medium text-gray-900">{data.owner}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                期間
              </div>
              <span className="text-sm font-medium text-gray-900">{data.period}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">期間</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative flex h-32 w-32 items-center justify-center">
                <svg className="h-32 w-32 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke={isComplete ? "#22c55e" : isOnTrack ? "#3b82f6" : "#eab308"} strokeWidth="8" strokeDasharray={`${progress * 2.51} 251`} strokeLinecap="round" />
                </svg>
                <div className="absolute text-center">
                  <p className="text-3xl font-bold text-gray-900">{progress}%</p>
                  <p className="text-xs text-gray-500">達成率</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">{data.startDate} ~ {data.endDate}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
