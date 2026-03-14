"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import {
  Plus,
  Calendar,
  Clock,
  Video,
  Users,
  MapPin,
  ExternalLink,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Meeting {
  id: string;
  title: string;
  attendees: string[];
  date: string;
  time: string;
  duration: string;
  type: "internal" | "external";
  location: string;
  link?: string;
}

const meetings: Meeting[] = [
  {
    id: "m1",
    title: "ECサイト構築案件 キックオフ",
    attendees: ["田中 太郎", "佐藤 匠", "田村 愛"],
    date: "2026-03-14",
    time: "10:00",
    duration: "60分",
    type: "external",
    location: "Zoom",
    link: "https://zoom.us/j/123456789",
  },
  {
    id: "m2",
    title: "週次営業チームミーティング",
    attendees: ["佐藤 匠", "田村 愛", "山本 健太", "鈴木 直美"],
    date: "2026-03-14",
    time: "14:00",
    duration: "30分",
    type: "internal",
    location: "会議室A",
  },
  {
    id: "m3",
    title: "クラウド移行プロジェクト 進捗確認",
    attendees: ["鈴木 花子", "佐藤 匠"],
    date: "2026-03-15",
    time: "11:00",
    duration: "45分",
    type: "external",
    location: "Google Meet",
    link: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: "m4",
    title: "CRM導入支援 最終プレゼン",
    attendees: ["山田 一郎", "田村 愛", "佐藤 匠"],
    date: "2026-03-15",
    time: "15:00",
    duration: "90分",
    type: "external",
    location: "ABC株式会社 本社",
  },
  {
    id: "m5",
    title: "データ分析基盤 デモンストレーション",
    attendees: ["佐々木 美咲", "佐藤 匠"],
    date: "2026-03-16",
    time: "10:00",
    duration: "60分",
    type: "external",
    location: "Teams",
    link: "https://teams.microsoft.com/l/meetup",
  },
  {
    id: "m6",
    title: "マーケティング戦略会議",
    attendees: ["佐藤 匠", "田村 愛", "山本 健太"],
    date: "2026-03-16",
    time: "13:00",
    duration: "60分",
    type: "internal",
    location: "会議室B",
  },
  {
    id: "m7",
    title: "Webアプリ開発 UAT レビュー",
    attendees: ["小林 誠", "佐藤 匠"],
    date: "2026-03-17",
    time: "14:00",
    duration: "120分",
    type: "external",
    location: "Zoom",
    link: "https://zoom.us/j/987654321",
  },
  {
    id: "m8",
    title: "月次全体ミーティング",
    attendees: ["全メンバー"],
    date: "2026-03-18",
    time: "09:00",
    duration: "60分",
    type: "internal",
    location: "大会議室",
  },
  {
    id: "m9",
    title: "基幹システムリプレイス 要件定義",
    attendees: ["渡辺 大輔", "佐藤 匠", "田村 愛"],
    date: "2026-03-18",
    time: "13:00",
    duration: "120分",
    type: "external",
    location: "グローバルシステム 会議室",
  },
];

const weekDays = ["月", "火", "水", "木", "金", "土", "日"];
const weekDates = [
  { day: "月", date: "3/14", fullDate: "2026-03-14" },
  { day: "火", date: "3/15", fullDate: "2026-03-15" },
  { day: "水", date: "3/16", fullDate: "2026-03-16" },
  { day: "木", date: "3/17", fullDate: "2026-03-17" },
  { day: "金", date: "3/18", fullDate: "2026-03-18" },
  { day: "土", date: "3/19", fullDate: "2026-03-19" },
  { day: "日", date: "3/20", fullDate: "2026-03-20" },
];

const hours = Array.from({ length: 11 }, (_, i) => i + 8); // 8:00 - 18:00

export default function MeetingsPage() {
  const [view, setView] = useState<"calendar" | "list">("calendar");

  const getMeetingsForDate = (date: string) =>
    meetings.filter((m) => m.date === date);

  return (
    <div className="space-y-6">
      <PageHeader
        title="ミーティング"
        description="ミーティングのスケジュール管理"
        actions={
          <div className="flex items-center gap-2">
            <div className="flex rounded-md border border-gray-300">
              <button
                onClick={() => setView("calendar")}
                className={`px-3 py-1.5 text-sm ${
                  view === "calendar" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                カレンダー
              </button>
              <button
                onClick={() => setView("list")}
                className={`px-3 py-1.5 text-sm border-l border-gray-300 ${
                  view === "list" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                リスト
              </button>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              ミーティングリンク作成
            </Button>
          </div>
        }
      />

      {view === "calendar" ? (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h3 className="text-lg font-semibold text-gray-900">2026年3月 第3週</h3>
                <Button variant="outline" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm">今日</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Day Headers */}
                <div className="grid grid-cols-8 border-b border-gray-200">
                  <div className="p-3 text-xs text-gray-500 border-r border-gray-200"></div>
                  {weekDates.map((d) => (
                    <div
                      key={d.date}
                      className={`p-3 text-center border-r border-gray-100 ${
                        d.fullDate === "2026-03-14" ? "bg-[#FFF1ED]" : ""
                      }`}
                    >
                      <p className="text-xs text-gray-500">{d.day}</p>
                      <p className={`text-sm font-medium ${
                        d.fullDate === "2026-03-14" ? "text-[#ff4800]" : "text-gray-900"
                      }`}>
                        {d.date}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Time Grid */}
                {hours.map((hour) => (
                  <div key={hour} className="grid grid-cols-8 border-b border-gray-100" style={{ minHeight: "48px" }}>
                    <div className="p-2 text-xs text-gray-400 border-r border-gray-200 text-right pr-3">
                      {hour}:00
                    </div>
                    {weekDates.map((d) => {
                      const dayMeetings = getMeetingsForDate(d.fullDate).filter(
                        (m) => parseInt(m.time.split(":")[0]) === hour
                      );
                      return (
                        <div key={d.date} className="border-r border-gray-50 p-0.5 relative">
                          {dayMeetings.map((m) => (
                            <div
                              key={m.id}
                              className={`rounded px-1.5 py-1 text-[10px] leading-tight cursor-pointer mb-0.5 ${
                                m.type === "external"
                                  ? "bg-blue-100 text-blue-800 border-l-2 border-blue-500"
                                  : "bg-green-100 text-green-800 border-l-2 border-green-500"
                              }`}
                            >
                              <p className="font-medium truncate">{m.title}</p>
                              <p>{m.time} ({m.duration})</p>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* List View */
        <div className="space-y-3">
          {meetings.map((meeting) => (
            <Card key={meeting.id} className="hover:border-gray-300 transition-all">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      meeting.type === "external" ? "bg-blue-50" : "bg-green-50"
                    }`}>
                      {meeting.type === "external" ? (
                        <Video className={`h-5 w-5 text-blue-600`} />
                      ) : (
                        <Users className={`h-5 w-5 text-green-600`} />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-900">{meeting.title}</h3>
                        <Badge variant={meeting.type === "external" ? "info" : "success"}>
                          {meeting.type === "external" ? "外部" : "社内"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {meeting.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {meeting.time} ({meeting.duration})
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {meeting.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {meeting.attendees.join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {meeting.link && (
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        参加
                      </Button>
                    )}
                    <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
