"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowLeft, Calendar, Clock, MapPin, Users, Video, ExternalLink } from "lucide-react";

interface MeetingItem {
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

export default function MeetingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<MeetingItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/meetings`)
      .then((r) => r.json())
      .then((d) => {
        const items = d.results || d.data || d;
        const found = Array.isArray(items) ? items.find((item: MeetingItem) => item.id === params.id) : null;
        setData(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff4800]" />
      </div>
    );

  if (!data)
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500 mb-4">データが見つかりません</p>
        <Button variant="outline" onClick={() => router.back()}>戻る</Button>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/meetings" className="hover:text-gray-700">ミーティング</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900">{data.title}</span>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
          data.type === "external" ? "bg-blue-50" : "bg-green-50"
        }`}>
          {data.type === "external" ? (
            <Video className="h-5 w-5 text-blue-600" />
          ) : (
            <Users className="h-5 w-5 text-green-600" />
          )}
        </div>
        <h1 className="text-2xl font-bold">{data.title}</h1>
        <Badge variant={data.type === "external" ? "info" : "success"}>
          {data.type === "external" ? "外部" : "社内"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{data.date}</p>
                <p className="text-xs text-gray-500">日付</p>
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
                <p className="text-sm font-bold text-gray-900">{data.time} ({data.duration})</p>
                <p className="text-xs text-gray-500">時間</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                <MapPin className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{data.location}</p>
                <p className="text-xs text-gray-500">場所</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                <Users className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{data.attendees.length}名</p>
                <p className="text-xs text-gray-500">参加者</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>詳細情報</CardTitle></CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">タイトル</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.title}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">タイプ</dt>
              <dd className="mt-1">
                <Badge variant={data.type === "external" ? "info" : "success"}>
                  {data.type === "external" ? "外部" : "社内"}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">日付</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.date}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">時間</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.time} ({data.duration})</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">場所</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.location}</dd>
            </div>
            {data.link && (
              <div>
                <dt className="text-sm font-medium text-gray-500">ミーティングリンク</dt>
                <dd className="mt-1">
                  <a href={data.link} target="_blank" rel="noopener noreferrer" className="text-sm text-[#ff4800] hover:underline flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    参加する
                  </a>
                </dd>
              </div>
            )}
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">参加者</dt>
              <dd className="mt-1 flex flex-wrap gap-2">
                {data.attendees.map((attendee, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ff4800] text-[10px] text-white">
                      {attendee.charAt(0)}
                    </div>
                    <span className="text-sm text-gray-700">{attendee}</span>
                  </div>
                ))}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
