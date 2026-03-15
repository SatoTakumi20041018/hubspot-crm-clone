"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Users,
  Database,
  GitBranch,
  Puzzle,
  MoreHorizontal,
  Check,
  Search,
  ArrowUpDown,
  Plus,
  X,
  Pencil,
  Trash2,
  Download,
  Upload,
  Bell,
  Box,
  Globe,
  Shield,
} from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

// B1: Updated sidebar nav to match real HubSpot
const tabs = [
  { key: "account", label: "アカウントのデフォルト", icon: Settings },
  { key: "users", label: "ユーザーとチーム", icon: Users },
  { key: "properties", label: "プロパティ", icon: Database },
  { key: "objects", label: "オブジェクト", icon: Box },
  { key: "pipelines", label: "パイプライン", icon: GitBranch },
  { key: "notifications", label: "通知", icon: Bell },
  { key: "integrations", label: "連携", icon: Puzzle },
  { key: "data", label: "データ管理", icon: Globe },
];

const users = [
  { id: "1", name: "佐藤 匠", email: "sato@example.com", role: "管理者", status: "アクティブ", lastLogin: "2026-03-14 09:30", avatar: "佐" },
  { id: "2", name: "田村 愛", email: "tamura@example.com", role: "営業", status: "アクティブ", lastLogin: "2026-03-14 08:15", avatar: "田" },
  { id: "3", name: "山本 健太", email: "yamamoto@example.com", role: "営業", status: "アクティブ", lastLogin: "2026-03-13 17:45", avatar: "山" },
  { id: "4", name: "中田 美穂", email: "nakata@example.com", role: "マーケティング", status: "アクティブ", lastLogin: "2026-03-14 10:00", avatar: "中" },
  { id: "5", name: "木下 拓也", email: "kinoshita@example.com", role: "サポート", status: "招待中", lastLogin: "-", avatar: "木" },
];

const properties = [
  { name: "名前", type: "テキスト", group: "コンタクト情報", required: true },
  { name: "メールアドレス", type: "メール", group: "コンタクト情報", required: true },
  { name: "電話番号", type: "電話", group: "コンタクト情報", required: false },
  { name: "会社名", type: "テキスト", group: "会社情報", required: false },
  { name: "役職", type: "テキスト", group: "コンタクト情報", required: false },
  { name: "ライフサイクルステージ", type: "ドロップダウン", group: "分類", required: true },
  { name: "リードステータス", type: "ドロップダウン", group: "分類", required: false },
  { name: "年間売上", type: "通貨", group: "会社情報", required: false },
];

const pipelines = [
  { name: "デフォルトパイプライン", stages: ["初回商談", "提案中", "見積提出", "交渉中", "契約締結", "失注"], deals: 47, active: true },
  { name: "エンタープライズ", stages: ["初回接触", "ニーズ分析", "提案", "評価", "交渉", "成約", "失注"], deals: 12, active: true },
];

// B4: Renamed to match real HubSpot categories
const integrationCategories = [
  { key: "connected", label: "Connected Apps" },
  { key: "private", label: "Private Apps" },
  { key: "email", label: "Email Service Provider" },
];

const integrations = [
  { name: "Slack", description: "通知とアクティビティをSlackに送信", status: "接続済み", icon: "S", color: "bg-purple-500", category: "connected" },
  { name: "Google Workspace", description: "メール、カレンダー、ドライブと連携", status: "接続済み", icon: "G", color: "bg-blue-500", category: "connected" },
  { name: "Zoom", description: "ミーティングの自動記録と同期", status: "未接続", icon: "Z", color: "bg-sky-500", category: "connected" },
  { name: "Salesforce", description: "データの双方向同期", status: "未接続", icon: "SF", color: "bg-blue-700", category: "connected" },
  { name: "Stripe", description: "決済情報の自動連携", status: "未接続", icon: "St", color: "bg-indigo-500", category: "private" },
  { name: "LINE", description: "LINE公式アカウントとの連携", status: "接続済み", icon: "L", color: "bg-green-500", category: "email" },
];

// B3: Notification settings
const notificationSettings = [
  { key: "deal_assigned", label: "取引が割り当てられたとき", description: "新しい取引があなたに割り当てられた場合に通知", enabled: true },
  { key: "ticket_assigned", label: "チケットが割り当てられたとき", description: "新しいチケットがあなたに割り当てられた場合に通知", enabled: true },
  { key: "task_due", label: "タスクの期限が近づいたとき", description: "タスクの期限が24時間以内に迫った場合に通知", enabled: true },
  { key: "contact_activity", label: "コンタクトのアクティビティ", description: "フォローしているコンタクトがアクティビティを記録した場合に通知", enabled: false },
  { key: "deal_stage_change", label: "取引のステージ変更", description: "担当取引のステージが変更された場合に通知", enabled: true },
  { key: "email_open", label: "メール開封", description: "送信したメールが開封された場合に通知", enabled: false },
  { key: "form_submission", label: "フォーム送信", description: "新しいフォーム送信があった場合に通知", enabled: true },
  { key: "weekly_report", label: "週次レポート", description: "毎週月曜日にパフォーマンスレポートをメールで受信", enabled: true },
];

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);

  const [activeTab, setActiveTab] = useState("account");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [notifications, setNotifications] = useState(notificationSettings);
  const [integrationCategory, setIntegrationCategory] = useState("connected");
  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };
  const sortedUsers = [...users].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = String((a as unknown as Record<string, unknown>)[sortField] ?? "");
    const bVal = String((b as unknown as Record<string, unknown>)[sortField] ?? "");
    return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const paginatedItems = sortedUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleUserSelect = (id: string) => {
    setSelectedUserIds(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  };
  const toggleUserSelectAll = () => {
    if (selectedUserIds.size === users.length) setSelectedUserIds(new Set());
    else setSelectedUserIds(new Set(users.map(u => u.id)));
  };

  const toggleNotification = (key: string) => {
    setNotifications(prev => prev.map(n => n.key === key ? { ...n, enabled: !n.enabled } : n));
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 rounded animate-shimmer" />
        <div className="h-4 w-32 rounded animate-shimmer" />
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[...Array(4)].map((_, i) => (<div key={i} className="h-24 rounded-lg animate-shimmer" />))}
        </div>
        <div className="h-64 rounded-lg animate-shimmer mt-4" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">設定</h1>
          <p className="text-sm text-gray-500 mt-1">アカウント設定とカスタマイズ</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="検索..." className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-[#ff4800]/20 focus:border-[#ff4800]" />
        </div>
      </div>

      {/* B1: Updated tabs to match real HubSpot */}
      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${activeTab === tab.key ? "border-[#ff4800] text-[#ff4800]" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
              <Icon className="h-4 w-4" />{tab.label}
            </button>
          );
        })}
      </div>

      {/* Bulk Action Bar (users) */}
      {activeTab === "users" && selectedUserIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg bg-[#1f1f1f] px-4 py-2.5 text-white">
          <span className="text-sm font-medium">{selectedUserIds.size}件を選択中</span>
          <div className="h-4 w-px bg-gray-600" />
          <button className="flex items-center gap-1.5 rounded px-2.5 py-1 text-sm hover:bg-white/10 transition-colors" onClick={() => alert("一括編集は準備中です")}><Pencil className="h-3.5 w-3.5" /> 編集</button>
          <button className="flex items-center gap-1.5 rounded px-2.5 py-1 text-sm text-red-400 hover:bg-white/10 transition-colors" onClick={() => alert("一括削除は準備中です")}><Trash2 className="h-3.5 w-3.5" /> 削除</button>
          <div className="flex-1" />
          <button className="rounded p-1 hover:bg-white/10 transition-colors" onClick={() => setSelectedUserIds(new Set())}><X className="h-4 w-4" /></button>
        </div>
      )}

      {/* B2: Account Defaults Tab */}
      {activeTab === "account" && (
        <div className="max-w-2xl space-y-6">
          <Card>
            <CardHeader><CardTitle>アカウントのデフォルト</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="会社名" defaultValue="サンプル株式会社" />
                <Input label="ドメイン" defaultValue="sample-corp.jp" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">タイムゾーン</label>
                  <select className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-[#ff4800] focus:outline-none focus:ring-1 focus:ring-[#ff4800]/20" defaultValue="Asia/Tokyo">
                    <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
                    <option value="America/New_York">America/New_York (UTC-5)</option>
                    <option value="Europe/London">Europe/London (UTC+0)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">通貨</label>
                  <select className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-[#ff4800] focus:outline-none focus:ring-1 focus:ring-[#ff4800]/20" defaultValue="JPY">
                    <option value="JPY">JPY (日本円 ¥)</option>
                    <option value="USD">USD (米ドル $)</option>
                    <option value="EUR">EUR (ユーロ)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">言語</label>
                <select className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-[#ff4800] focus:outline-none focus:ring-1 focus:ring-[#ff4800]/20" defaultValue="ja">
                  <option value="ja">日本語</option>
                  <option value="en">English</option>
                  <option value="zh">中文</option>
                </select>
              </div>
              <div className="flex justify-end"><Button onClick={() => { if (typeof window !== "undefined" && (window as any).__hubspotToast) (window as any).__hubspotToast("設定を保存しました"); }}>保存</Button></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>メール設定</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Input label="送信元メールアドレス" defaultValue="info@sample-corp.jp" />
              <Input label="送信者名" defaultValue="サンプル株式会社" />
              <div className="flex items-center gap-3">
                <input type="checkbox" id="email-tracking" defaultChecked className="rounded border-gray-300 text-[#ff4800] focus:ring-[#ff4800]" />
                <label htmlFor="email-tracking" className="text-sm text-gray-700">メール開封・クリックのトラッキングを有効にする</label>
              </div>
              <div className="flex justify-end"><Button onClick={() => { if (typeof window !== "undefined" && (window as any).__hubspotToast) (window as any).__hubspotToast("設定を保存しました"); }}>保存</Button></div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{users.length}名のユーザー</p>
            <Button size="sm" onClick={() => alert("ユーザー招待は準備中です")}><Users className="h-4 w-4 mr-1" />ユーザーを招待</Button>
          </div>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="sticky-thead">
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left w-10"><input type="checkbox" className="rounded border-gray-300" checked={users.length > 0 && selectedUserIds.size === users.length} onChange={toggleUserSelectAll} /></th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("name")}><div className="flex items-center gap-1">ユーザー <ArrowUpDown className="h-3 w-3" /></div></th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("email")}><div className="flex items-center gap-1">メール <ArrowUpDown className="h-3 w-3" /></div></th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("role")}><div className="flex items-center gap-1">ロール <ArrowUpDown className="h-3 w-3" /></div></th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">ステータス</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">最終ログイン</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.filter(item => {
                    if (searchQuery && !JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase())) return false;
                    return true;
                  }).map((user) => (
                    <tr key={user.id} className={`border-b border-gray-100 hover:bg-gray-50 ${selectedUserIds.has(user.id) ? "bg-blue-50/50" : ""}`}>
                      <td className="px-4 py-3"><input type="checkbox" className="rounded border-gray-300" checked={selectedUserIds.has(user.id)} onChange={() => toggleUserSelect(user.id)} onClick={(e) => e.stopPropagation()} /></td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff4800] text-xs font-medium text-white">{user.avatar}</div>
                          <span className="font-medium text-gray-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{user.email}</td>
                      <td className="px-4 py-3"><Badge variant={user.role === "管理者" ? "purple" : "default"}>{user.role}</Badge></td>
                      <td className="px-4 py-3"><Badge variant={user.status === "アクティブ" ? "success" : "warning"}>{user.status}</Badge></td>
                      <td className="px-4 py-3 text-gray-600">{user.lastLogin}</td>
                      <td className="px-4 py-3"><button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600" onClick={(e) => { e.stopPropagation(); alert(`ユーザー「${user.name}」のオプション`); }}><MoreHorizontal className="h-4 w-4" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
                <p className="text-sm text-gray-500">{sortedUsers.length}件中 {(currentPage - 1) * itemsPerPage + 1}〜{Math.min(currentPage * itemsPerPage, sortedUsers.length)}件</p>
                <div className="flex gap-1">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">前へ</button>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">次へ</button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Properties Tab */}
      {activeTab === "properties" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{properties.length}件のプロパティ</p>
            <Button size="sm" onClick={() => alert("プロパティ追加は準備中です")}><Database className="h-4 w-4 mr-1" />プロパティを追加</Button>
          </div>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="sticky-thead">
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-left font-medium text-gray-500">プロパティ名</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">タイプ</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">グループ</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500">必須</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {properties.filter(item => {
                    if (searchQuery && !JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase())) return false;
                    return true;
                  }).map((prop) => (
                    <tr key={prop.name} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-3 font-medium text-gray-900">{prop.name}</td>
                      <td className="px-4 py-3"><Badge>{prop.type}</Badge></td>
                      <td className="px-4 py-3 text-gray-600">{prop.group}</td>
                      <td className="px-4 py-3 text-center">{prop.required && (<Check className="h-4 w-4 text-green-500 mx-auto" />)}</td>
                      <td className="px-4 py-3"><button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600" onClick={(e) => { e.stopPropagation(); alert(`プロパティ「${prop.name}」のオプション`); }}><MoreHorizontal className="h-4 w-4" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Objects Tab (B1) */}
      {activeTab === "objects" && (
        <div className="max-w-2xl space-y-4">
          <p className="text-sm text-gray-500">CRMオブジェクトの設定を管理します</p>
          {[
            { name: "コンタクト", description: "個人のコンタクト情報を管理", count: 245 },
            { name: "会社", description: "会社・組織の情報を管理", count: 67 },
            { name: "取引", description: "商談・取引の進捗を管理", count: 89 },
            { name: "チケット", description: "カスタマーサポートのチケットを管理", count: 34 },
          ].map((obj) => (
            <Card key={obj.name} className="hover:border-gray-300 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{obj.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{obj.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="info">{obj.count}件</Badge>
                    <Button variant="outline" size="sm" onClick={() => alert("オブジェクト設定は準備中です")}>設定</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pipelines Tab */}
      {activeTab === "pipelines" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{pipelines.length}件のパイプライン</p>
            <Button size="sm" onClick={() => alert("パイプライン追加は準備中です")}><GitBranch className="h-4 w-4 mr-1" />パイプラインを追加</Button>
          </div>
          {pipelines.map((pipeline) => (
            <Card key={pipeline.name}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3"><CardTitle>{pipeline.name}</CardTitle><Badge variant="info">{pipeline.deals}件の取引</Badge></div>
                  <Button variant="outline" size="sm" onClick={() => alert("編集は準備中です")}>編集</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {pipeline.stages.map((stage, i) => (
                    <div key={stage} className="flex items-center gap-2">
                      <div className={`flex-shrink-0 rounded-lg px-4 py-2 text-sm font-medium ${stage === "失注" || stage === "成約" || stage === "契約締結" ? stage === "失注" ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200" : "bg-gray-50 text-gray-700 border border-gray-200"}`}>{stage}</div>
                      {i < pipeline.stages.length - 1 && (<div className="text-gray-300 flex-shrink-0">&rarr;</div>)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* B3: Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="max-w-2xl space-y-6">
          <Card>
            <CardHeader><CardTitle>メール通知</CardTitle></CardHeader>
            <CardContent className="space-y-1">
              {notifications.map((n) => (
                <div key={n.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{n.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{n.description}</p>
                  </div>
                  <button
                    onClick={() => toggleNotification(n.key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${n.enabled ? "bg-[#ff4800]" : "bg-gray-300"}`}
                  >
                    <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${n.enabled ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* B4/B5: Integrations Tab */}
      {activeTab === "integrations" && (
        <div className="space-y-4">
          <div className="flex gap-2 mb-4">
            {integrationCategories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setIntegrationCategory(cat.key)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${integrationCategory === cat.key ? "bg-[#ff4800] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500">外部サービスとの連携を管理</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {integrations.filter(i => i.category === integrationCategory).map((integration) => (
              <Card key={integration.name} className="hover:border-gray-300 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${integration.color} text-white text-xs font-bold`}>{integration.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900">{integration.name}</h3>
                        {/* B5: Status indicator with green dot */}
                        <div className="flex items-center gap-1.5">
                          {integration.status === "接続済み" && (
                            <span className="h-2 w-2 rounded-full bg-green-500" />
                          )}
                          <Badge variant={integration.status === "接続済み" ? "success" : "default"}>{integration.status}</Badge>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{integration.description}</p>
                      <div className="mt-3">
                        <Button variant={integration.status === "接続済み" ? "outline" : "primary"} size="sm" className="w-full" onClick={() => { if (typeof window !== "undefined" && (window as any).__hubspotToast) (window as any).__hubspotToast(integration.status === "接続済み" ? "設定画面は準備中です" : "接続処理は準備中です"); }}>{integration.status === "接続済み" ? "設定" : "接続する"}</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {integrations.filter(i => i.category === integrationCategory).length === 0 && (
              <div className="col-span-full text-center py-12 text-sm text-gray-400">
                この カテゴリにはまだ連携がありません
              </div>
            )}
          </div>
        </div>
      )}

      {/* Data Management Tab (B1) */}
      {activeTab === "data" && (
        <div className="max-w-2xl space-y-4">
          <p className="text-sm text-gray-500">データのインポート、エクスポート、クリーンアップを管理します</p>
          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Upload className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">データインポート</p>
                    <p className="text-xs text-gray-500">CSV/XLSXファイルからデータをインポート</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">インポート</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Download className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">データエクスポート</p>
                    <p className="text-xs text-gray-500">CRMデータをCSV形式でエクスポート</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">エクスポート</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">データクリーンアップ</p>
                    <p className="text-xs text-gray-500">重複レコードの検出と統合</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">実行</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
