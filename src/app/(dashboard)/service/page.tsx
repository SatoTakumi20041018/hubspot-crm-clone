"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import {
  Ticket,
  Clock,
  ThumbsUp,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  MessageSquare,
} from "lucide-react";

const kpis = [
  {
    label: "未解決チケット",
    value: "28",
    change: -12.5,
    icon: Ticket,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    label: "平均解決時間",
    value: "4.2h",
    change: -18.3,
    icon: Clock,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "CSAT スコア",
    value: "92.3%",
    change: 3.5,
    icon: ThumbsUp,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    label: "NPS スコア",
    value: "+48",
    change: 5.2,
    icon: TrendingUp,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

const ticketStatusDistribution = [
  { status: "新規", count: 8, color: "bg-blue-400" },
  { status: "対応中", count: 12, color: "bg-yellow-400" },
  { status: "待機中", count: 5, color: "bg-gray-400" },
  { status: "エスカレーション", count: 3, color: "bg-red-400" },
  { status: "解決済み", count: 45, color: "bg-green-400" },
];

const totalTickets = ticketStatusDistribution.reduce((s, t) => s + t.count, 0);

const recentTickets = [
  { id: "TK-011", subject: "SSO設定でエラーが発生", priority: "緊急", status: "新規", contact: "松本 隆", time: "30分前" },
  { id: "TK-006", subject: "通知メールが届かない", priority: "緊急", status: "新規", contact: "伊藤 さくら", time: "2時間前" },
  { id: "TK-001", subject: "ログイン不具合の報告", priority: "高", status: "対応中", contact: "田中 太郎", time: "5時間前" },
  { id: "TK-003", subject: "請求書のPDF出力でレイアウト崩れ", priority: "高", status: "対応中", contact: "山田 一郎", time: "昨日" },
  { id: "TK-009", subject: "インポート時のデータ重複問題", priority: "高", status: "対応中", contact: "小林 誠", time: "2日前" },
  { id: "TK-007", subject: "ダッシュボードの表示速度改善", priority: "中", status: "対応中", contact: "渡辺 大輔", time: "3日前" },
];

const knowledgeBaseStats = [
  { label: "公開記事数", value: "156" },
  { label: "今月の閲覧数", value: "12,450" },
  { label: "平均評価", value: "4.6/5.0" },
  { label: "自己解決率", value: "34.2%" },
];

const slaCompliance = [
  { tier: "緊急 (1h)", target: 95, actual: 88 },
  { tier: "高 (4h)", target: 90, actual: 92 },
  { tier: "中 (24h)", target: 85, actual: 96 },
  { tier: "低 (72h)", target: 80, actual: 98 },
];

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case "新規": return "info" as const;
    case "対応中": return "warning" as const;
    case "解決済み": return "success" as const;
    default: return "default" as const;
  }
};

const priorityBadgeVariant = (priority: string) => {
  switch (priority) {
    case "緊急": return "danger" as const;
    case "高": return "danger" as const;
    case "中": return "warning" as const;
    default: return "default" as const;
  }
};

export default function ServicePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="サービスハブ"
        description="カスタマーサポートの概要とパフォーマンス"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          const isPositive = kpi.label === "未解決チケット" || kpi.label === "平均解決時間"
            ? kpi.change < 0
            : kpi.change > 0;
          return (
            <Card key={kpi.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${kpi.bg}`}>
                    <Icon className={`h-5 w-5 ${kpi.color}`} />
                  </div>
                  <div className={`flex items-center gap-0.5 ${isPositive ? "text-green-600" : "text-red-600"}`}>
                    {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    <span className="text-xs font-medium">{Math.abs(kpi.change)}%</span>
                  </div>
                </div>
                <p className="text-xl font-bold text-gray-900">{kpi.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Ticket Status Distribution */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">チケットステータス分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-6 rounded-full overflow-hidden mb-4">
              {ticketStatusDistribution.map((item) => (
                <div
                  key={item.status}
                  className={`${item.color} transition-all`}
                  style={{ width: `${(item.count / totalTickets) * 100}%` }}
                  title={`${item.status}: ${item.count}件`}
                />
              ))}
            </div>
            <div className="space-y-2">
              {ticketStatusDistribution.map((item) => (
                <div key={item.status} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${item.color}`} />
                    <span className="text-gray-600">{item.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{item.count}</span>
                    <span className="text-gray-400 text-xs">
                      ({((item.count / totalTickets) * 100).toFixed(0)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Knowledge Base Stats */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-gray-400" />
              ナレッジベース
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {knowledgeBaseStats.map((stat) => (
                <div key={stat.label} className="rounded-lg bg-gray-50 p-3 text-center">
                  <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SLA Compliance */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">SLA コンプライアンス</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {slaCompliance.map((sla) => (
                <div key={sla.tier} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{sla.tier}</span>
                    <span className={`font-medium ${sla.actual >= sla.target ? "text-green-600" : "text-red-600"}`}>
                      {sla.actual}%
                      <span className="text-gray-400 text-xs ml-1">/ {sla.target}%</span>
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div
                      className={`h-2 rounded-full ${sla.actual >= sla.target ? "bg-green-400" : "bg-red-400"}`}
                      style={{ width: `${Math.min(sla.actual, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tickets */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>最近のチケット</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left font-medium text-gray-500">ID</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">件名</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">優先度</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">ステータス</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">コンタクト</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">経過</th>
                </tr>
              </thead>
              <tbody>
                {recentTickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-500 font-mono text-xs">{ticket.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-900 hover:text-[#ff4800] cursor-pointer">
                      {ticket.subject}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={priorityBadgeVariant(ticket.priority)}>{ticket.priority}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusBadgeVariant(ticket.status)}>{ticket.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{ticket.contact}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{ticket.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
