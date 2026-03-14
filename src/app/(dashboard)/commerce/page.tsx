"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/ui/stats-card";
import {
  DollarSign,
  CreditCard,
  FileText,
  Link as LinkIcon,
  TrendingUp,
  ArrowRight,
  MoreHorizontal,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

const recentPayments = [
  { id: "PAY-001", customer: "田中商事株式会社", amount: 450000, method: "クレジットカード", date: "2026-03-14", status: "completed" as const },
  { id: "PAY-002", customer: "鈴木テクノロジー", amount: 280000, method: "銀行振込", date: "2026-03-14", status: "completed" as const },
  { id: "PAY-003", customer: "グローバルシステム", amount: 350000, method: "クレジットカード", date: "2026-03-13", status: "completed" as const },
  { id: "PAY-004", customer: "イノベーション株式会社", amount: 180000, method: "クレジットカード", date: "2026-03-13", status: "pending" as const },
  { id: "PAY-005", customer: "東京マーケティング", amount: 220000, method: "銀行振込", date: "2026-03-12", status: "completed" as const },
];

const recentInvoices = [
  { id: "INV-2401", customer: "さくらデザイン", amount: 120000, status: "overdue" as const, dueDate: "2026-03-01" },
  { id: "INV-2402", customer: "フューチャーテック", amount: 350000, status: "sent" as const, dueDate: "2026-03-20" },
  { id: "INV-2403", customer: "太陽コーポレーション", amount: 280000, status: "paid" as const, dueDate: "2026-03-15" },
  { id: "INV-2404", customer: "ハーモニー株式会社", amount: 150000, status: "draft" as const, dueDate: "2026-03-25" },
  { id: "INV-2405", customer: "サンライズメディア", amount: 190000, status: "sent" as const, dueDate: "2026-03-22" },
];

const paymentLinks = [
  { id: 1, name: "スタータープラン月額", price: 29800, clicks: 145, conversions: 23, active: true },
  { id: 2, name: "プロフェッショナルプラン月額", price: 98000, clicks: 89, conversions: 12, active: true },
  { id: 3, name: "エンタープライズ年額", price: 3600000, clicks: 34, conversions: 5, active: true },
  { id: 4, name: "オンボーディングパッケージ", price: 500000, clicks: 56, conversions: 8, active: false },
];

const subscriptions = [
  { customer: "田中商事株式会社", plan: "Enterprise", mrr: 450000, status: "active" as const },
  { customer: "鈴木テクノロジー", plan: "Professional", mrr: 280000, status: "active" as const },
  { customer: "グローバルシステム", plan: "Enterprise", mrr: 350000, status: "active" as const },
  { customer: "さくらデザイン", plan: "Starter", mrr: 120000, status: "past_due" as const },
];

const invoiceStatusConfig = {
  draft: { label: "下書き", variant: "default" as const },
  sent: { label: "送信済み", variant: "info" as const },
  paid: { label: "支払済み", variant: "success" as const },
  overdue: { label: "期限超過", variant: "danger" as const },
};

export default function CommercePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="コマースHub"
        description="支払い、請求書、サブスクリプションの一元管理"
        breadcrumbs={[
          { label: "ホーム", href: "/" },
          { label: "コマース" },
        ]}
        actions={
          <div className="flex gap-2">
            <Link href="/invoices">
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-1" />
                請求書一覧
              </Button>
            </Link>
            <Link href="/payments">
              <Button size="sm">
                <CreditCard className="h-4 w-4 mr-1" />
                支払い一覧
              </Button>
            </Link>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatsCard label="今月の売上" value="¥2,830万" change={12} changeLabel="前月比" icon={DollarSign} />
        <StatsCard label="アクティブサブスクリプション" value="47" change={5} changeLabel="前月比" icon={RefreshCw} />
        <StatsCard label="未払い請求書" value="¥470,000" change={-8} changeLabel="前月比" icon={FileText} />
        <StatsCard label="有効な支払いリンク" value="3" icon={LinkIcon} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>最近の支払い</CardTitle>
              <Link href="/payments">
                <Button variant="ghost" size="sm">
                  すべて見る <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{payment.customer}</p>
                    <p className="text-xs text-gray-500">{payment.date} - {payment.method}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">¥{payment.amount.toLocaleString()}</p>
                    <Badge variant={payment.status === "completed" ? "success" : "warning"}>
                      {payment.status === "completed" ? "完了" : "処理中"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Invoices */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>請求書</CardTitle>
              <Link href="/invoices">
                <Button variant="ghost" size="sm">
                  すべて見る <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{invoice.customer}</p>
                    <p className="text-xs text-gray-500">{invoice.id} - 期限: {invoice.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">¥{invoice.amount.toLocaleString()}</p>
                    <Badge variant={invoiceStatusConfig[invoice.status].variant}>
                      {invoiceStatusConfig[invoice.status].label}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Subscriptions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>サブスクリプション</CardTitle>
              <Link href="/subscriptions">
                <Button variant="ghost" size="sm">
                  すべて見る <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {subscriptions.map((sub, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{sub.customer}</p>
                    <p className="text-xs text-gray-500">{sub.plan}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">¥{sub.mrr.toLocaleString()}/月</p>
                    <Badge variant={sub.status === "active" ? "success" : "danger"}>
                      {sub.status === "active" ? "アクティブ" : "支払い遅延"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Links */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>支払いリンク</CardTitle>
              <Button variant="outline" size="sm">
                <LinkIcon className="h-4 w-4 mr-1" />
                リンク作成
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paymentLinks.map((link) => (
                <div key={link.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">{link.name}</p>
                      {link.active && <ExternalLink className="h-3 w-3 text-gray-400" />}
                    </div>
                    <p className="text-xs text-gray-500">¥{link.price.toLocaleString()} | {link.clicks}クリック / {link.conversions}コンバージョン</p>
                  </div>
                  <Badge variant={link.active ? "success" : "default"}>
                    {link.active ? "有効" : "無効"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
