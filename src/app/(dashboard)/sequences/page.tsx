"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import {
  Plus,
  MoreHorizontal,
  Mail,
  Clock,
  CheckSquare,
  ArrowRight,
  Users,
  MessageSquare,
  TrendingUp,
  Calendar,
  ArrowUpDown,
  X,
  Pencil,
  Trash2,
  Download,
} from "lucide-react";

interface SequenceStep {
  type: "email" | "wait" | "task" | "call";
  label: string;
}

interface Sequence {
  id: string;
  name: string;
  steps: SequenceStep[];
  stepsCount: number;
  enrolled: number;
  replyRate: number;
  meetingRate: number;
  active: boolean;
  createdAt: string;
  owner: string;
}

const sequences: Sequence[] = [
  { id: "seq1", name: "新規リードアプローチ", steps: [{ type: "email", label: "自己紹介メール" }, { type: "wait", label: "3日待機" }, { type: "email", label: "事例紹介メール" }, { type: "wait", label: "2日待機" }, { type: "task", label: "電話フォロー" }, { type: "email", label: "最終フォローアップ" }], stepsCount: 6, enrolled: 234, replyRate: 18.5, meetingRate: 8.2, active: true, createdAt: "2026-01-15", owner: "佐藤 匠" },
  { id: "seq2", name: "展示会リードフォロー", steps: [{ type: "email", label: "お礼メール" }, { type: "wait", label: "1日待機" }, { type: "email", label: "資料送付" }, { type: "wait", label: "3日待機" }, { type: "call", label: "フォローコール" }, { type: "email", label: "ミーティング提案" }], stepsCount: 6, enrolled: 156, replyRate: 24.3, meetingRate: 12.1, active: true, createdAt: "2026-02-01", owner: "佐藤 匠" },
  { id: "seq3", name: "休眠顧客復活", steps: [{ type: "email", label: "近況伺い" }, { type: "wait", label: "5日待機" }, { type: "email", label: "新機能案内" }, { type: "wait", label: "3日待機" }, { type: "task", label: "個別フォロー検討" }], stepsCount: 5, enrolled: 89, replyRate: 12.4, meetingRate: 4.5, active: true, createdAt: "2026-02-10", owner: "田村 愛" },
  { id: "seq4", name: "デモ後フォローアップ", steps: [{ type: "email", label: "デモお礼＋資料" }, { type: "wait", label: "2日待機" }, { type: "email", label: "Q&Aフォロー" }, { type: "wait", label: "3日待機" }, { type: "call", label: "意思決定確認コール" }, { type: "email", label: "見積提案" }, { type: "wait", label: "5日待機" }, { type: "email", label: "最終確認" }], stepsCount: 8, enrolled: 78, replyRate: 32.1, meetingRate: 18.6, active: true, createdAt: "2026-01-20", owner: "佐藤 匠" },
  { id: "seq5", name: "ウェビナー参加者フォロー", steps: [{ type: "email", label: "録画・資料共有" }, { type: "wait", label: "2日待機" }, { type: "email", label: "関連コンテンツ" }, { type: "task", label: "スコア確認・アプローチ判断" }], stepsCount: 4, enrolled: 312, replyRate: 15.8, meetingRate: 6.3, active: false, createdAt: "2026-02-15", owner: "田村 愛" },
  { id: "seq6", name: "アップセル提案", steps: [{ type: "email", label: "利用状況レビュー" }, { type: "wait", label: "3日待機" }, { type: "email", label: "上位プラン紹介" }, { type: "wait", label: "4日待機" }, { type: "call", label: "個別ヒアリング" }, { type: "email", label: "カスタム提案書" }], stepsCount: 6, enrolled: 45, replyRate: 22.2, meetingRate: 15.6, active: true, createdAt: "2026-03-01", owner: "佐藤 匠" },
];

const stepTypeConfig = {
  email: { icon: Mail, color: "text-blue-600", bg: "bg-blue-50" },
  wait: { icon: Clock, color: "text-gray-500", bg: "bg-gray-50" },
  task: { icon: CheckSquare, color: "text-orange-600", bg: "bg-orange-50" },
  call: { icon: MessageSquare, color: "text-green-600", bg: "bg-green-50" },
};

export default function SequencesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);

  const [search, setSearch] = useState("");
  const [activeView, setActiveView] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const views = [
    { key: "all", label: "すべて" },
    { key: "mine", label: "マイシーケンス" },
    { key: "active", label: "アクティブ" },
  ];

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === sequences.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(sequences.map(s => s.id)));
  };

  const filtered = sequences
    .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    .filter((s) => activeView === "all" || (activeView === "mine" && s.owner === "佐藤 匠") || (activeView === "active" && s.active))
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
        title="シーケンス"
        description="メール・タスクの自動シーケンスでリードを育成"
        actions={
          <Button size="sm" onClick={() => alert("シーケンス作成は準備中です")}>
            <Plus className="h-4 w-4 mr-1" />
            シーケンス作成
          </Button>
        }
      />

      <p className="text-sm text-gray-500">{filtered.length}件のシーケンス</p>

      <div className="flex items-center gap-1 border-b border-gray-200 px-1 mb-4">
        {views.map((v) => (
          <button key={v.key} onClick={() => { setActiveView(v.key); setCurrentPage(1); }}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${activeView === v.key ? "border-[#ff4800] text-[#1f1f1f]" : "border-transparent text-gray-500 hover:text-gray-700"}`}>{v.label}</button>
        ))}
        <button className="ml-1 p-1.5 text-gray-400 hover:text-gray-600 rounded" onClick={() => alert("ビュー追加は準備中です")}><Plus className="h-4 w-4" /></button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50"><Mail className="h-5 w-5 text-blue-600" /></div><div><p className="text-2xl font-bold text-gray-900">{sequences.length}</p><p className="text-xs text-gray-500">シーケンス数</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50"><Users className="h-5 w-5 text-green-600" /></div><div><p className="text-2xl font-bold text-gray-900">{sequences.reduce((s, seq) => s + seq.enrolled, 0).toLocaleString()}</p><p className="text-xs text-gray-500">総登録数</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50"><TrendingUp className="h-5 w-5 text-purple-600" /></div><div><p className="text-2xl font-bold text-gray-900">{(sequences.reduce((s, seq) => s + seq.replyRate, 0) / sequences.length).toFixed(1)}%</p><p className="text-xs text-gray-500">平均返信率</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50"><Calendar className="h-5 w-5 text-orange-600" /></div><div><p className="text-2xl font-bold text-gray-900">{(sequences.reduce((s, seq) => s + seq.meetingRate, 0) / sequences.length).toFixed(1)}%</p><p className="text-xs text-gray-500">平均ミーティング率</p></div></div></CardContent></Card>
      </div>

      {/* Search + Sort */}
      <div className="flex items-center gap-3">
        <div className="w-72">
          <Input variant="search" placeholder="シーケンス名で検索..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} />
        </div>
        <button onClick={() => handleSort("name")} className="flex items-center gap-1 px-3 py-2 text-sm border rounded-md hover:bg-gray-50"><ArrowUpDown className="h-3 w-3" /> 名前順</button>
        <button onClick={() => handleSort("enrolled")} className="flex items-center gap-1 px-3 py-2 text-sm border rounded-md hover:bg-gray-50"><ArrowUpDown className="h-3 w-3" /> 登録数順</button>
        <button onClick={() => handleSort("replyRate")} className="flex items-center gap-1 px-3 py-2 text-sm border rounded-md hover:bg-gray-50"><ArrowUpDown className="h-3 w-3" /> 返信率順</button>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg bg-[#1f1f1f] px-4 py-2.5 text-white">
          <span className="text-sm font-medium">{selectedIds.size}件を選択中</span>
          <div className="h-4 w-px bg-gray-600" />
          <button className="flex items-center gap-1.5 rounded px-2.5 py-1 text-sm hover:bg-white/10 transition-colors" onClick={() => alert("一括編集は準備中です")}><Pencil className="h-3.5 w-3.5" /> 編集</button>
          <button className="flex items-center gap-1.5 rounded px-2.5 py-1 text-sm hover:bg-white/10 transition-colors" onClick={() => alert("エクスポートは準備中です")}><Download className="h-3.5 w-3.5" /> エクスポート</button>
          <button className="flex items-center gap-1.5 rounded px-2.5 py-1 text-sm text-red-400 hover:bg-white/10 transition-colors" onClick={() => alert("一括削除は準備中です")}><Trash2 className="h-3.5 w-3.5" /> 削除</button>
          <div className="flex-1" />
          <button className="rounded p-1 hover:bg-white/10 transition-colors" onClick={() => setSelectedIds(new Set())}><X className="h-4 w-4" /></button>
        </div>
      )}

      {/* Sequence List */}
      <div className="space-y-3">
        {paginatedItems.map((seq) => (
          <Card key={seq.id} className="hover:border-gray-300 transition-all cursor-pointer" onClick={() => router.push(`/sequences/${seq.id}`)}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="rounded border-gray-300" checked={selectedIds.has(seq.id)} onChange={() => toggleSelect(seq.id)} onClick={(e) => e.stopPropagation()} />
                  <h3 className="text-sm font-semibold text-gray-900">{seq.name}</h3>
                  <Badge variant={seq.active ? "success" : "default"}>{seq.active ? "有効" : "停止中"}</Badge>
                </div>
                <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600" onClick={(e) => { e.stopPropagation(); alert(`シーケンス「${seq.name}」のオプション`); }}>
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap mb-3">
                {seq.steps.map((step, i) => {
                  const config = stepTypeConfig[step.type];
                  const StepIcon = config.icon;
                  return (
                    <div key={i} className="flex items-center gap-1.5">
                      {i > 0 && <ArrowRight className="h-3 w-3 text-gray-300" />}
                      <div className={`flex items-center gap-1 rounded px-2 py-1 text-xs ${config.bg} ${config.color}`}>
                        <StepIcon className="h-3 w-3" />{step.label}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-6 text-xs text-gray-500">
                <span>{seq.stepsCount} ステップ</span>
                <span>登録: {seq.enrolled.toLocaleString()}名</span>
                <span>返信率: {seq.replyRate}%</span>
                <span>ミーティング率: {seq.meetingRate}%</span>
                <span>担当: {seq.owner}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
        <p className="text-sm text-gray-500">{filtered.length}件中 {(currentPage - 1) * itemsPerPage + 1}〜{Math.min(currentPage * itemsPerPage, filtered.length)}件</p>
        <div className="flex gap-1">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">前へ</button>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">次へ</button>
        </div>
      </div>

      {filtered.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-gray-300" />
          </div>
          <h3 className="text-base font-medium text-gray-900 mb-1">データがありません</h3>
          <p className="text-sm text-gray-500">新しいシーケンスを作成して始めましょう</p>
        </div>
      )}
    </div>
  );
}
