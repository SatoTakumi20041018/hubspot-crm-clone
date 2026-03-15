"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import {
  Plus,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  MoreHorizontal,
  Calendar,
  Filter,
  Clock,
} from "lucide-react";

type Platform = "Twitter" | "Facebook" | "Instagram" | "LinkedIn";

interface Post {
  id: string;
  platform: Platform;
  content: string;
  status: "公開済み" | "予約済み" | "下書き";
  engagement: { likes: number; comments: number; shares: number; impressions: number };
  date: string;
  time: string;
}

const platformConfig: Record<Platform, { color: string; bg: string; label: string }> = {
  Twitter: { color: "text-sky-500", bg: "bg-sky-50", label: "X" },
  Facebook: { color: "text-blue-600", bg: "bg-blue-50", label: "FB" },
  Instagram: { color: "text-pink-500", bg: "bg-pink-50", label: "IG" },
  LinkedIn: { color: "text-blue-700", bg: "bg-blue-50", label: "LI" },
};

const posts: Post[] = [
  {
    id: "sp1",
    platform: "Twitter",
    content: "新機能リリースのお知らせ！CRMダッシュボードが大幅にアップデートされました。",
    status: "公開済み",
    engagement: { likes: 45, comments: 12, shares: 8, impressions: 2340 },
    date: "2026-03-14",
    time: "09:00",
  },
  {
    id: "sp2",
    platform: "LinkedIn",
    content: "業界トレンドレポート2026を公開しました。デジタルトランスフォーメーションの最新動向をまとめています。",
    status: "公開済み",
    engagement: { likes: 128, comments: 34, shares: 42, impressions: 8900 },
    date: "2026-03-13",
    time: "10:00",
  },
  {
    id: "sp3",
    platform: "Instagram",
    content: "チームメンバーの紹介シリーズ第3弾！今回は開発チームの裏側をお見せします。",
    status: "公開済み",
    engagement: { likes: 234, comments: 18, shares: 5, impressions: 4560 },
    date: "2026-03-13",
    time: "12:00",
  },
  {
    id: "sp4",
    platform: "Facebook",
    content: "4月開催の無料ウェビナー「CRM活用術」の参加者を募集中！詳しくはリンクをチェック。",
    status: "公開済み",
    engagement: { likes: 67, comments: 23, shares: 15, impressions: 3200 },
    date: "2026-03-12",
    time: "14:00",
  },
  {
    id: "sp5",
    platform: "Twitter",
    content: "お客様導入事例を公開！「売上30%アップを実現した太陽コーポレーション様」の成功の秘訣とは？",
    status: "公開済み",
    engagement: { likes: 32, comments: 8, shares: 12, impressions: 1890 },
    date: "2026-03-11",
    time: "11:00",
  },
  {
    id: "sp6",
    platform: "LinkedIn",
    content: "採用情報：プロダクトマネージャーを募集しています。CRM業界の未来を一緒に創りませんか？",
    status: "予約済み",
    engagement: { likes: 0, comments: 0, shares: 0, impressions: 0 },
    date: "2026-03-15",
    time: "09:00",
  },
  {
    id: "sp7",
    platform: "Instagram",
    content: "オフィスの新しいリラックススペースを紹介！社員の創造性を高める環境づくりに力を入れています。",
    status: "予約済み",
    engagement: { likes: 0, comments: 0, shares: 0, impressions: 0 },
    date: "2026-03-16",
    time: "12:00",
  },
  {
    id: "sp8",
    platform: "Facebook",
    content: "セミナーレポート：「2026年のマーケティング戦略」セミナーの内容をまとめました。",
    status: "公開済み",
    engagement: { likes: 89, comments: 15, shares: 22, impressions: 5600 },
    date: "2026-03-10",
    time: "15:00",
  },
  {
    id: "sp9",
    platform: "Twitter",
    content: "今週のTips: ワークフロー自動化の3つのベストプラクティスをご紹介します。",
    status: "下書き",
    engagement: { likes: 0, comments: 0, shares: 0, impressions: 0 },
    date: "-",
    time: "-",
  },
  {
    id: "sp10",
    platform: "LinkedIn",
    content: "パートナーシップのお知らせ：新たにABC社との提携が始まりました。",
    status: "公開済み",
    engagement: { likes: 156, comments: 28, shares: 35, impressions: 12000 },
    date: "2026-03-08",
    time: "10:00",
  },
  {
    id: "sp11",
    platform: "Instagram",
    content: "ユーザーカンファレンス2026の写真をアップしました！ご参加いただいた皆様、ありがとうございました。",
    status: "公開済み",
    engagement: { likes: 312, comments: 45, shares: 18, impressions: 7800 },
    date: "2026-03-07",
    time: "18:00",
  },
];

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case "公開済み": return "success" as const;
    case "予約済み": return "info" as const;
    case "下書き": return "default" as const;
    default: return "default" as const;
  }
};

export default function SocialPage() {
  const [filterPlatform, setFilterPlatform] = useState<string>("すべて");
  const [activeView, setActiveView] = useState("all");

  const views = [
    { key: "all", label: "すべての投稿" },
    { key: "published", label: "公開済み" },
    { key: "scheduled", label: "予約済み" },
  ];
  const platforms: (Platform | "すべて")[] = ["すべて", "Twitter", "Facebook", "Instagram", "LinkedIn"];

  const filtered = posts.filter((p) =>
    filterPlatform === "すべて" || p.platform === filterPlatform
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="ソーシャルメディア"
        description="ソーシャルメディア投稿の管理と分析"
        actions={
          <Button size="sm" onClick={() => alert("投稿作成は準備中です")}>
            <Plus className="h-4 w-4 mr-1" />
            投稿作成
          </Button>
        }
      />

      <div className="flex items-center gap-1 border-b border-gray-200 px-1 mb-4">
        {views.map((v) => (
          <button key={v.key} onClick={() => setActiveView(v.key)}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeView === v.key ? "border-[#ff4800] text-[#1f1f1f]" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>{v.label}</button>
        ))}
        <button className="ml-1 p-1.5 text-gray-400 hover:text-gray-600 rounded"><Plus className="h-4 w-4" /></button>
      </div>

      {/* Platform Filter */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-400" />
        {platforms.map((platform) => (
          <button
            key={platform}
            onClick={() => setFilterPlatform(platform)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              filterPlatform === platform
                ? "bg-[#ff4800] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {platform === "すべて" ? "すべて" : (
              <span className="flex items-center gap-1">
                {platformConfig[platform].label} {platform}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Monthly Calendar (simplified) */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-4 w-4 text-gray-400" />
            ソーシャルカレンダー - 2026年3月
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {["日", "月", "火", "水", "木", "金", "土"].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">{day}</div>
            ))}
            {/* Generate calendar days */}
            {Array.from({ length: 35 }, (_, i) => {
              const dayNum = i - 6 + 1; // March 1 is Sunday (adjust offset)
              const isValidDay = dayNum >= 1 && dayNum <= 31;
              const dateStr = isValidDay ? `2026-03-${String(dayNum).padStart(2, "0")}` : "";
              const dayPosts = posts.filter((p) => p.date === dateStr);
              const isToday = dayNum === 14;

              return (
                <div
                  key={i}
                  className={`min-h-[60px] rounded p-1 text-xs ${
                    isValidDay ? "bg-gray-50" : ""
                  } ${isToday ? "ring-2 ring-[#ff4800] bg-[#FFF1ED]" : ""}`}
                >
                  {isValidDay && (
                    <>
                      <span className={`text-xs ${isToday ? "font-bold text-[#ff4800]" : "text-gray-600"}`}>
                        {dayNum}
                      </span>
                      <div className="mt-0.5 space-y-0.5">
                        {dayPosts.slice(0, 2).map((p) => {
                          const config = platformConfig[p.platform];
                          return (
                            <div
                              key={p.id}
                              className={`rounded px-1 py-0.5 text-[9px] truncate ${config.bg} ${config.color}`}
                            >
                              {config.label}
                            </div>
                          );
                        })}
                        {dayPosts.length > 2 && (
                          <div className="text-[9px] text-gray-400">+{dayPosts.length - 2}</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      <div className="space-y-3">
        {filtered.map((post) => {
          const config = platformConfig[post.platform];
          return (
            <Card key={post.id} className="hover:border-gray-300 transition-all">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${config.bg} flex-shrink-0`}>
                      <span className={`text-sm font-bold ${config.color}`}>{config.label}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={statusBadgeVariant(post.status)}>{post.status}</Badge>
                        {post.date !== "-" && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.date} {post.time}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-900 mb-2">{post.content}</p>
                      {post.status === "公開済み" && (
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" /> {post.engagement.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" /> {post.engagement.comments}
                          </span>
                          <span className="flex items-center gap-1">
                            <Share2 className="h-3 w-3" /> {post.engagement.shares}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" /> {post.engagement.impressions.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
