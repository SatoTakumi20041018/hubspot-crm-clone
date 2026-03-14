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
  Edit3,
  MoreHorizontal,
  ChevronLeft,
  PhoneCall,
  FileText,
  CheckSquare,
  MessageSquare,
  DollarSign,
  Ticket,
  Plus,
} from "lucide-react";

const contactsData: Record<
  string,
  {
    name: string;
    email: string;
    phone: string;
    jobTitle: string;
    company: string;
    companyId: string;
    lifecycleStage: string;
    leadStatus: string;
    owner: string;
    createdAt: string;
    lastActivity: string;
  }
> = {
  "1": {
    name: "田中 太郎",
    email: "tanaka@tanaka-corp.jp",
    phone: "03-1234-5678",
    jobTitle: "代表取締役",
    company: "田中商事株式会社",
    companyId: "1",
    lifecycleStage: "商談中",
    leadStatus: "進行中",
    owner: "佐藤 匠",
    createdAt: "2025-12-15",
    lastActivity: "2026-03-14",
  },
  "2": {
    name: "鈴木 花子",
    email: "suzuki@suzuki-tech.co.jp",
    phone: "06-2345-6789",
    jobTitle: "マーケティング部長",
    company: "鈴木テクノロジー",
    companyId: "2",
    lifecycleStage: "顧客",
    leadStatus: "対応済み",
    owner: "佐藤 匠",
    createdAt: "2025-11-20",
    lastActivity: "2026-03-12",
  },
  "3": {
    name: "山田 一郎",
    email: "yamada@abc-corp.jp",
    phone: "03-3456-7890",
    jobTitle: "営業部 マネージャー",
    company: "ABC株式会社",
    companyId: "3",
    lifecycleStage: "リード",
    leadStatus: "新規",
    owner: "佐藤 匠",
    createdAt: "2026-01-05",
    lastActivity: "2026-03-10",
  },
};

const defaultContact = {
  name: "コンタクト",
  email: "contact@example.jp",
  phone: "03-0000-0000",
  jobTitle: "担当者",
  company: "サンプル株式会社",
  companyId: "1",
  lifecycleStage: "リード",
  leadStatus: "新規",
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
    title: "メール送信: 提案書のご確認について",
    description:
      "添付の提案書をご確認いただけますでしょうか。ご不明な点がございましたらお気軽にお問い合わせください。",
    user: "佐藤 匠",
    date: "2026-03-14 10:30",
  },
  {
    id: 2,
    type: "call",
    icon: Phone,
    color: "text-green-500",
    title: "通話: 要件ヒアリング",
    description:
      "ECサイト構築の要件についてヒアリング。予算感は300-500万円。4月中のローンチを希望。",
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
      "展示会でのブース訪問がきっかけ。既存のECシステムに不満があり、リプレイスを検討中。決裁者は社長本人。",
    user: "佐藤 匠",
    date: "2026-03-10 09:15",
  },
  {
    id: 4,
    type: "email",
    icon: Mail,
    color: "text-blue-500",
    title: "メール受信: Re: お問い合わせありがとうございます",
    description:
      "ご連絡ありがとうございます。来週のお打ち合わせの件、承知しました。よろしくお願いいたします。",
    user: "田中 太郎",
    date: "2026-03-08 14:22",
  },
  {
    id: 5,
    type: "task",
    icon: CheckSquare,
    color: "text-orange-500",
    title: "タスク完了: 初回コンタクトメール送信",
    description: "",
    user: "佐藤 匠",
    date: "2026-03-07 11:00",
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
];

export default function ContactDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const contact = contactsData[id] || defaultContact;
  const [activeTab, setActiveTab] = useState("アクティビティ");

  return (
    <div className="-m-6 flex flex-col" style={{ height: "calc(100vh - 4rem)" }}>
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/contacts"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff4800] text-lg font-medium text-white">
              {contact.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                {contact.name}
              </h1>
              <p className="text-sm text-gray-500">
                {contact.jobTitle} @ {contact.company}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Mail className="h-4 w-4 mr-1" />
            メール
          </Button>
          <Button variant="outline" size="sm">
            <PhoneCall className="h-4 w-4 mr-1" />
            通話
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
                メールアドレス
              </label>
              <p className="text-sm text-gray-900 mt-0.5">{contact.email}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">
                電話番号
              </label>
              <p className="text-sm text-gray-900 mt-0.5">{contact.phone}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">役職</label>
              <p className="text-sm text-gray-900 mt-0.5">
                {contact.jobTitle}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">
                ライフサイクルステージ
              </label>
              <div className="mt-1">
                <Badge
                  variant={
                    contact.lifecycleStage === "顧客"
                      ? "success"
                      : contact.lifecycleStage === "商談中"
                        ? "info"
                        : "default"
                  }
                >
                  {contact.lifecycleStage}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">
                リードステータス
              </label>
              <div className="mt-1">
                <Badge
                  variant={
                    contact.leadStatus === "対応済み"
                      ? "success"
                      : contact.leadStatus === "進行中"
                        ? "info"
                        : "warning"
                  }
                >
                  {contact.leadStatus}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">
                担当者
              </label>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white">
                  {contact.owner.charAt(0)}
                </div>
                <p className="text-sm text-gray-900">{contact.owner}</p>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <label className="text-xs font-medium text-gray-500">会社</label>
              <Link
                href={`/companies/${contact.companyId}`}
                className="flex items-center gap-2 mt-1 text-sm text-[#ff4800] hover:underline"
              >
                <Building2 className="h-4 w-4" />
                {contact.company}
              </Link>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">
                作成日
              </label>
              <p className="text-sm text-gray-900 mt-0.5">
                {contact.createdAt}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">
                最終アクティビティ
              </label>
              <p className="text-sm text-gray-900 mt-0.5">
                {contact.lastActivity}
              </p>
            </div>
          </div>
        </div>

        {/* MIDDLE - Activity Timeline */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {/* Tabs */}
          <div className="mb-4 flex gap-1 border-b border-gray-200">
            {activityTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? "border-[#ff4800] text-[#ff4800]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Activity Timeline */}
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
          {/* Companies */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              会社
            </h2>
            <Card className="hover:border-gray-300 transition-colors">
              <CardContent className="p-3">
                <Link
                  href={`/companies/${contact.companyId}`}
                  className="flex items-center gap-2"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-100 text-blue-600">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {contact.company}
                    </p>
                    <p className="text-xs text-gray-500">tanaka-corp.jp</p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Deals */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                取引
              </h2>
              <button className="text-xs text-[#ff4800] hover:underline flex items-center gap-1">
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
                      <p className="text-xs text-gray-400 mt-1">
                        クローズ予定: {deal.closeDate}
                      </p>
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
              <button className="text-xs text-[#ff4800] hover:underline flex items-center gap-1">
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
                        <p className="text-sm font-medium text-gray-900">
                          {ticket.subject}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Badge variant="warning">{ticket.status}</Badge>
                        <Badge variant="danger">{ticket.priority}</Badge>
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
