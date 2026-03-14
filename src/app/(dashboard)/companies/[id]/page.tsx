"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  Building2,
  Globe,
  Edit3,
  MoreHorizontal,
  ChevronLeft,
  FileText,
  CheckSquare,
  MessageSquare,
  DollarSign,
  Ticket,
  Users,
  MapPin,
  Plus,
  Calendar,
} from "lucide-react";

const companiesData: Record<
  string,
  {
    name: string;
    domain: string;
    phone: string;
    industry: string;
    description: string;
    annualRevenue: string;
    employees: number;
    city: string;
    address: string;
    owner: string;
    createdAt: string;
    lastActivity: string;
  }
> = {
  "1": {
    name: "田中商事株式会社",
    domain: "tanaka-corp.jp",
    phone: "03-1234-5678",
    industry: "小売・EC",
    description:
      "EC事業を中心とした総合商社。日用品からアパレルまで幅広い商品を取り扱う。",
    annualRevenue: "¥2.5億",
    employees: 150,
    city: "東京都",
    address: "東京都港区六本木1-2-3",
    owner: "佐藤 匠",
    createdAt: "2025-10-01",
    lastActivity: "2026-03-14",
  },
  "2": {
    name: "鈴木テクノロジー",
    domain: "suzuki-tech.co.jp",
    phone: "06-2345-6789",
    industry: "IT・ソフトウェア",
    description:
      "クラウドソリューションとAI開発を手がけるテクノロジー企業。",
    annualRevenue: "¥5億",
    employees: 280,
    city: "大阪府",
    address: "大阪府大阪市北区梅田4-5-6",
    owner: "佐藤 匠",
    createdAt: "2025-09-15",
    lastActivity: "2026-03-12",
  },
};

const defaultCompany = {
  name: "サンプル会社",
  domain: "example.jp",
  phone: "03-0000-0000",
  industry: "IT・ソフトウェア",
  description: "サンプルの会社情報です。",
  annualRevenue: "¥1億",
  employees: 50,
  city: "東京都",
  address: "東京都渋谷区1-1-1",
  owner: "佐藤 匠",
  createdAt: "2026-01-01",
  lastActivity: "2026-03-14",
};

const activityTabs = ["アクティビティ", "メモ", "メール", "通話", "タスク"];

const activities = [
  {
    id: 1,
    type: "email",
    icon: Mail,
    color: "text-blue-500",
    title: "田中 太郎 にメール送信",
    description: "新サービスの提案書を送付しました。",
    user: "佐藤 匠",
    date: "2026-03-14 10:30",
  },
  {
    id: 2,
    type: "call",
    icon: Phone,
    color: "text-green-500",
    title: "田中 太郎 と通話",
    description:
      "ECサイトリニューアルについて打ち合わせ。現在のシステムの課題をヒアリング。",
    user: "佐藤 匠",
    date: "2026-03-12 15:00",
  },
  {
    id: 3,
    type: "note",
    icon: MessageSquare,
    color: "text-gray-500",
    title: "メモ追加",
    description:
      "来期のIT投資計画で大型予算が確保される見込み。4月の新年度にあわせて提案を進める。",
    user: "佐藤 匠",
    date: "2026-03-10 09:15",
  },
  {
    id: 4,
    type: "meeting",
    icon: Calendar,
    color: "text-purple-500",
    title: "定例ミーティング",
    description: "月次レビュー。次回は4月15日を予定。",
    user: "佐藤 匠",
    date: "2026-03-05 14:00",
  },
];

const associatedContacts = [
  {
    id: "1",
    name: "田中 太郎",
    jobTitle: "代表取締役",
    email: "tanaka@tanaka-corp.jp",
  },
  {
    id: "4",
    name: "田中 美穂",
    jobTitle: "経営企画部長",
    email: "m-tanaka@tanaka-corp.jp",
  },
  {
    id: "7",
    name: "鈴木 一郎",
    jobTitle: "システム部 マネージャー",
    email: "i-suzuki@tanaka-corp.jp",
  },
];

const associatedDeals = [
  {
    id: "d1",
    name: "ECサイト構築案件",
    amount: "¥4,500,000",
    stage: "見積提出",
    closeDate: "2026-04-30",
  },
  {
    id: "d2",
    name: "MAツール導入",
    amount: "¥1,200,000",
    stage: "初回商談",
    closeDate: "2026-06-15",
  },
];

const associatedTickets = [
  {
    id: "t1",
    subject: "ログイン不具合の報告",
    status: "対応中",
    priority: "高",
  },
  {
    id: "t2",
    subject: "データエクスポート機能のリクエスト",
    status: "新規",
    priority: "中",
  },
];

export default function CompanyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const company = companiesData[id] || defaultCompany;
  const [activeTab, setActiveTab] = useState("アクティビティ");

  return (
    <div className="-m-6 flex flex-col" style={{ height: "calc(100vh - 4rem)" }}>
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/companies"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-100 text-blue-600">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                {company.name}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Globe className="h-3.5 w-3.5" />
                {company.domain}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Mail className="h-4 w-4 mr-1" />
            メール
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-1" />
            メモ
          </Button>
          <Button variant="outline" size="sm">
            <CheckSquare className="h-4 w-4 mr-1" />
            タスク
          </Button>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR */}
        <div className="w-72 flex-shrink-0 overflow-y-auto border-r border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              概要
            </h2>
            <button className="text-gray-400 hover:text-gray-600">
              <Edit3 className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-500">
                ドメイン
              </label>
              <div className="flex items-center gap-1 mt-0.5">
                <Globe className="h-3.5 w-3.5 text-gray-400" />
                <p className="text-sm text-[#FF7A59]">{company.domain}</p>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">
                電話番号
              </label>
              <p className="text-sm text-gray-900 mt-0.5">{company.phone}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">業界</label>
              <div className="mt-1">
                <Badge>{company.industry}</Badge>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">説明</label>
              <p className="text-sm text-gray-900 mt-0.5">
                {company.description}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">
                年間売上
              </label>
              <p className="text-sm font-medium text-gray-900 mt-0.5">
                {company.annualRevenue}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">
                従業員数
              </label>
              <p className="text-sm text-gray-900 mt-0.5">
                {company.employees}名
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">住所</label>
              <div className="flex items-start gap-1 mt-0.5">
                <MapPin className="h-3.5 w-3.5 text-gray-400 mt-0.5" />
                <p className="text-sm text-gray-900">{company.address}</p>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <label className="text-xs font-medium text-gray-500">
                担当者
              </label>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white">
                  {company.owner.charAt(0)}
                </div>
                <p className="text-sm text-gray-900">{company.owner}</p>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">
                作成日
              </label>
              <p className="text-sm text-gray-900 mt-0.5">
                {company.createdAt}
              </p>
            </div>
          </div>
        </div>

        {/* MIDDLE - Activity Timeline */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="mb-4 flex gap-1 border-b border-gray-200">
            {activityTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? "border-[#FF7A59] text-[#FF7A59]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = activity.icon;
              return (
                <Card key={activity.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div
                        className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 ${activity.color}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900">
                            {activity.title}
                          </h3>
                          <span className="text-xs text-gray-400">
                            {activity.date}
                          </span>
                        </div>
                        {activity.description && (
                          <p className="mt-1 text-sm text-gray-600">
                            {activity.description}
                          </p>
                        )}
                        <p className="mt-2 text-xs text-gray-400">
                          {activity.user}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-72 flex-shrink-0 overflow-y-auto border-l border-gray-200 bg-white p-4">
          {/* Contacts */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                コンタクト
              </h2>
              <button className="text-xs text-[#FF7A59] hover:underline flex items-center gap-1">
                <Plus className="h-3 w-3" />
                追加
              </button>
            </div>
            <div className="space-y-2">
              {associatedContacts.map((contact) => (
                <Card
                  key={contact.id}
                  className="hover:border-gray-300 transition-colors"
                >
                  <CardContent className="p-3">
                    <Link
                      href={`/contacts/${contact.id}`}
                      className="flex items-center gap-2"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF7A59] text-xs font-medium text-white">
                        {contact.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {contact.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {contact.jobTitle}
                        </p>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Deals */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                取引
              </h2>
              <button className="text-xs text-[#FF7A59] hover:underline flex items-center gap-1">
                <Plus className="h-3 w-3" />
                追加
              </button>
            </div>
            <div className="space-y-2">
              {associatedDeals.map((deal) => (
                <Card
                  key={deal.id}
                  className="hover:border-gray-300 transition-colors"
                >
                  <CardContent className="p-3">
                    <Link href="/deals" className="block">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <p className="text-sm font-medium text-gray-900">
                          {deal.name}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{deal.amount}</span>
                        <Badge variant="info">{deal.stage}</Badge>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Tickets */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                チケット
              </h2>
              <button className="text-xs text-[#FF7A59] hover:underline flex items-center gap-1">
                <Plus className="h-3 w-3" />
                追加
              </button>
            </div>
            <div className="space-y-2">
              {associatedTickets.map((ticket) => (
                <Card
                  key={ticket.id}
                  className="hover:border-gray-300 transition-colors"
                >
                  <CardContent className="p-3">
                    <Link href="/tickets" className="block">
                      <div className="flex items-center gap-2 mb-1">
                        <Ticket className="h-4 w-4 text-orange-500" />
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {ticket.subject}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Badge variant="warning">{ticket.status}</Badge>
                        <Badge
                          variant={
                            ticket.priority === "高" ? "danger" : "default"
                          }
                        >
                          {ticket.priority}
                        </Badge>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
