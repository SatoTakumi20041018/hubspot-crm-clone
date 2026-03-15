"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import {
  Plus,
  Filter,
  MoreHorizontal,
  Zap,
  ArrowRight,
  Users,
  Handshake,
  Ticket,
  Building2,
  Play,
  Clock,
  ArrowUpDown,
  X,
  Pencil,
  Trash2,
  Download,
} from "lucide-react";

type WorkflowType = "contact" | "deal" | "ticket" | "company";

interface Workflow {
  id: string;
  name: string;
  type: WorkflowType;
  active: boolean;
  lastModified: string;
  enrolledCount: number;
  trigger: string;
  actions: string[];
}

const workflows: Workflow[] = [
  { id: "wf1", name: "新規リード自動フォローアップ", type: "contact", active: true, lastModified: "2026-03-12", enrolledCount: 342, trigger: "フォーム送信時", actions: ["ウェルカムメール送信", "3日後フォローアップメール", "担当者に通知", "タスク作成"] },
  { id: "wf2", name: "取引ステージ変更通知", type: "deal", active: true, lastModified: "2026-03-10", enrolledCount: 156, trigger: "取引ステージ変更時", actions: ["マネージャーに通知", "Slack通知", "アクティビティ記録"] },
  { id: "wf3", name: "チケットSLAエスカレーション", type: "ticket", active: true, lastModified: "2026-03-08", enrolledCount: 89, trigger: "SLA期限超過時", actions: ["優先度を上げる", "マネージャーに通知", "担当者再アサイン"] },
  { id: "wf4", name: "顧客満足度調査自動送信", type: "contact", active: true, lastModified: "2026-03-05", enrolledCount: 1245, trigger: "チケット解決後3日", actions: ["CSATアンケート送信", "スコア記録", "低スコア時にアラート"] },
  { id: "wf5", name: "新規会社登録時の自動処理", type: "company", active: false, lastModified: "2026-02-28", enrolledCount: 0, trigger: "新規会社作成時", actions: ["業界分類の自動設定", "担当者アサイン", "ウェルカムメール送信"] },
  { id: "wf6", name: "失注フォローアップ", type: "deal", active: true, lastModified: "2026-03-01", enrolledCount: 67, trigger: "取引が失注に変更時", actions: ["失注理由ヒアリングメール", "30日後再アプローチメール", "担当者タスク作成"] },
  { id: "wf7", name: "MQLからSQLへの自動昇格", type: "contact", active: true, lastModified: "2026-03-11", enrolledCount: 523, trigger: "リードスコア50点以上", actions: ["ライフサイクル変更", "営業チームに通知", "ミーティングリンク送信"] },
  { id: "wf8", name: "契約更新リマインダー", type: "deal", active: false, lastModified: "2026-02-20", enrolledCount: 0, trigger: "契約終了90日前", actions: ["担当者に通知", "更新提案メール", "タスク作成", "マネージャーCC"] },
  { id: "wf9", name: "チケット自動分類", type: "ticket", active: true, lastModified: "2026-03-13", enrolledCount: 412, trigger: "新規チケット作成時", actions: ["カテゴリ自動判定", "優先度設定", "適切な担当者にアサイン"] },
];

const typeConfig: Record<WorkflowType, { label: string; icon: typeof Users; color: string; bg: string }> = {
  contact: { label: "コンタクト", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
  deal: { label: "取引", icon: Handshake, color: "text-green-600", bg: "bg-green-50" },
  ticket: { label: "チケット", icon: Ticket, color: "text-orange-600", bg: "bg-orange-50" },
  company: { label: "会社", icon: Building2, color: "text-purple-600", bg: "bg-purple-50" },
};

export default function WorkflowsPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);

  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeView, setActiveView] = useState("all");
  const [filterType, setFilterType] = useState<string>("すべて");
  const [filterStatus, setFilterStatus] = useState<string>("すべて");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const savedViews = [
    { key: "all", label: "すべて" },
    { key: "active", label: "アクティブ" },
    { key: "inactive", label: "非アクティブ" },
  ];

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const toggle = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const filtered = workflows
    .filter((wf) => {
      const matchSearch = wf.name.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === "すべて" || typeConfig[wf.type].label === filterType;
      const matchStatus = filterStatus === "すべて" || (filterStatus === "有効" && wf.active) || (filterStatus === "無効" && !wf.active);
      const matchView = activeView === "all" || (activeView === "active" && wf.active) || (activeView === "inactive" && !wf.active);
      return matchSearch && matchType && matchStatus && matchView;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      const aVal = String((a as unknown as Record<string, unknown>)[sortField] ?? "");
      const bVal = String((b as unknown as Record<string, unknown>)[sortField] ?? "");
      return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[...Array(4)].map((_, i) => (<div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />))}
        </div>
        <div className="h-64 bg-gray-100 rounded-lg animate-pulse mt-4" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="ワークフロー"
        description={`${workflows.length}件のワークフロー（${workflows.filter((w) => w.active).length}件が有効）`}
        actions={<Button size="sm" onClick={() => alert("ワークフロー作成は準備中です")}><Plus className="h-4 w-4 mr-1" />ワークフロー作成</Button>}
      />

      <p className="text-sm text-gray-500">{filtered.length}件のワークフロー</p>

      {/* Saved View Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 px-1">
        {savedViews.map((v) => (
          <button key={v.key} onClick={() => { setActiveView(v.key); setCurrentPage(1); }} className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${activeView === v.key ? "border-[#ff4800] text-[#1f1f1f]" : "border-transparent text-gray-500 hover:text-gray-700"}`}>{v.label}</button>
        ))}
        <button className="ml-1 p-1.5 text-gray-400 hover:text-gray-600 rounded" onClick={() => alert("ビュー追加は準備中です")}><Plus className="h-4 w-4" /></button>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-72">
              <Input variant="search" placeholder="ワークフロー名で検索..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:border-[#ff4800] focus:outline-none focus:ring-1 focus:ring-[#ff4800]" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option>すべて</option><option>コンタクト</option><option>取引</option><option>チケット</option><option>会社</option>
              </select>
              <select className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:border-[#ff4800] focus:outline-none focus:ring-1 focus:ring-[#ff4800]" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option>すべて</option><option>有効</option><option>無効</option>
              </select>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => handleSort("name")} className="flex items-center gap-1 px-3 py-2 text-sm border rounded-md hover:bg-gray-50"><ArrowUpDown className="h-3 w-3" /> 名前</button>
              <button onClick={() => handleSort("lastModified")} className="flex items-center gap-1 px-3 py-2 text-sm border rounded-md hover:bg-gray-50"><ArrowUpDown className="h-3 w-3" /> 更新日</button>
              <button onClick={() => handleSort("enrolledCount")} className="flex items-center gap-1 px-3 py-2 text-sm border rounded-md hover:bg-gray-50"><ArrowUpDown className="h-3 w-3" /> 登録数</button>
            </div>
          </div>
        </div>
      </Card>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg bg-[#1f1f1f] px-4 py-2.5 text-white">
          <span className="text-sm font-medium">{selectedIds.size}件を選択中</span>
          <div className="h-4 w-px bg-gray-600" />
          <button onClick={() => alert("有効化は準備中です")} className="flex items-center gap-1.5 rounded px-2.5 py-1 text-sm hover:bg-white/10 transition-colors"><Play className="h-3.5 w-3.5" /> 有効化</button>
          <button onClick={() => alert("削除は準備中です")} className="flex items-center gap-1.5 rounded px-2.5 py-1 text-sm text-red-400 hover:bg-white/10 transition-colors"><Trash2 className="h-3.5 w-3.5" /> 削除</button>
          <div className="flex-1" />
          <button onClick={() => setSelectedIds(new Set())} className="rounded p-1 hover:bg-white/10 transition-colors"><X className="h-4 w-4" /></button>
        </div>
      )}

      {/* Workflow List */}
      <div className="space-y-3">
        {paginatedItems.map((wf) => {
          const config = typeConfig[wf.type];
          const TypeIcon = config.icon;
          return (
            <Card key={wf.id} className="hover:border-gray-300 transition-all">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <input type="checkbox" className="rounded border-gray-300 mt-3" checked={selectedIds.has(wf.id)} onChange={() => toggle(wf.id)} onClick={(e) => e.stopPropagation()} />
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${config.bg}`}><Zap className={`h-5 w-5 ${config.color}`} /></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-sm font-semibold text-gray-900">{wf.name}</h3>
                        <Badge variant={wf.active ? "success" : "default"}>{wf.active ? "有効" : "無効"}</Badge>
                        <Badge variant={wf.type === "contact" ? "info" : wf.type === "deal" ? "success" : wf.type === "ticket" ? "warning" : "purple"}><TypeIcon className="h-3 w-3 mr-1" />{config.label}</Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-3 flex-wrap">
                        <div className="flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1 text-xs text-blue-700"><Play className="h-3 w-3" />{wf.trigger}</div>
                        {wf.actions.map((action, i) => (
                          <div key={i} className="flex items-center gap-1.5"><ArrowRight className="h-3 w-3 text-gray-400" /><div className="rounded-md bg-gray-50 px-2.5 py-1 text-xs text-gray-600">{action}</div></div>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" />登録数: {wf.enrolledCount.toLocaleString()}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />最終更新: {wf.lastModified}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => e.stopPropagation()} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${wf.active ? "bg-green-500" : "bg-gray-300"}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${wf.active ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                    <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600" onClick={(e) => e.stopPropagation()}><MoreHorizontal className="h-4 w-4" /></button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Zap className="h-8 w-8 text-gray-300" />
          </div>
          <h3 className="text-base font-medium text-gray-900 mb-1">データがありません</h3>
          <p className="text-sm text-gray-500">新しいワークフローを作成して始めましょう</p>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
        <p className="text-sm text-gray-500">{filtered.length}件中 {(currentPage - 1) * itemsPerPage + 1}〜{Math.min(currentPage * itemsPerPage, filtered.length)}件</p>
        <div className="flex gap-1">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">前へ</button>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">次へ</button>
        </div>
      </div>
    </div>
  );
}
