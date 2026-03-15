"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowLeft, PhoneIncoming, PhoneOutgoing, PhoneMissed, Clock, Play } from "lucide-react";

interface CallItem {
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

export default function CallDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<CallItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/calls`)
      .then((r) => r.json())
      .then((d) => {
        const items = d.results || d.data || d;
        const found = Array.isArray(items) ? items.find((item: CallItem) => item.id === params.id) : null;
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

  const DirectionIcon = data.direction === "inbound" ? PhoneIncoming :
    (data.outcome === "不在" || data.outcome === "話し中") ? PhoneMissed : PhoneOutgoing;
  const directionColor = data.direction === "inbound" ? "text-green-500" :
    (data.outcome === "不在" || data.outcome === "話し中") ? "text-red-400" : "text-blue-500";
  const directionLabel = data.direction === "inbound" ? "着信" : "発信";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/calls" className="hover:text-gray-700">コールログ</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900">{data.contact}</span>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <DirectionIcon className={`h-6 w-6 ${directionColor}`} />
        <div>
          <h1 className="text-2xl font-bold">{data.contact}</h1>
          <p className="text-sm text-gray-500">{data.company}</p>
        </div>
        <Badge variant={data.direction === "inbound" ? "info" : "purple"}>
          {directionLabel}
        </Badge>
        <Badge variant={data.outcome === "接続済み" ? "success" : data.outcome === "不在" ? "warning" : "default"}>
          {data.outcome}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{data.duration === "0:00" ? "-" : data.duration}</p>
                <p className="text-xs text-gray-500">通話時間</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm font-bold text-gray-900">{data.date} {data.time}</p>
              <p className="text-xs text-gray-500 mt-1">日時</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            {data.recording ? (
              <button className="flex items-center gap-2 rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-600 hover:bg-gray-200" onClick={() => alert("再生は準備中です")}>
                <Play className="h-4 w-4" />
                録音を再生
              </button>
            ) : (
              <p className="text-sm text-gray-400">録音なし</p>
            )}
            <p className="text-xs text-gray-500 mt-2">録音</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>詳細情報</CardTitle></CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">コンタクト</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.contact}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">会社名</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.company}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">方向</dt>
              <dd className="mt-1">
                <Badge variant={data.direction === "inbound" ? "info" : "purple"}>{directionLabel}</Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">通話時間</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.duration === "0:00" ? "-" : data.duration}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">結果</dt>
              <dd className="mt-1">
                <Badge variant={data.outcome === "接続済み" ? "success" : data.outcome === "不在" ? "warning" : "default"}>
                  {data.outcome}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">日時</dt>
              <dd className="mt-1 text-sm text-gray-900">{data.date} {data.time}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {data.notes && (
        <Card>
          <CardHeader><CardTitle>メモ</CardTitle></CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-4">
              {data.notes}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
