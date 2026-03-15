"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import {
  Plus,
  BookOpen,
  Users,
  Clock,
  MoreHorizontal,
  CheckSquare,
  Target,
  Lightbulb,
  ArrowUpDown,
  Trash2,
  Download,
  Archive,
} from "lucide-react";

interface Playbook {
  id: string;
  name: string;
  category: string;
  usageCount: number;
  lastUsed: string;
  createdBy: string;
  description: string;
  steps: string[];
}

const playbooks: Playbook[] = [
  { id: "pb1", name: "ディスカバリーコール", category: "初回商談", usageCount: 145, lastUsed: "2026-03-14", createdBy: "佐藤 匠", description: "初回のディスカバリーコールで使用する質問リストと進行ガイド", steps: ["自己紹介・アイスブレイク", "現在の課題ヒアリング", "ゴール・KPIの確認", "予算・タイムライン確認", "次のステップ合意"] },
  { id: "pb2", name: "デモンストレーション", category: "提案", usageCount: 89, lastUsed: "2026-03-13", createdBy: "佐藤 匠", description: "製品デモの進め方と重要なポイントをまとめたガイド", steps: ["アジェンダ確認", "ペインポイントの再確認", "製品デモ実施", "Q&A対応", "ROI説明", "フォローアップ合意"] },
  { id: "pb3", name: "競合対策ガイド", category: "交渉", usageCount: 67, lastUsed: "2026-03-12", createdBy: "田村 愛", description: "主要競合との比較ポイントと差別化トーク", steps: ["競合状況の確認", "当社の差別化ポイント提示", "顧客事例の紹介", "価格比較の説明", "決定要因の確認"] },
  { id: "pb4", name: "オブジェクション対応", category: "交渉", usageCount: 112, lastUsed: "2026-03-14", createdBy: "佐藤 匠", description: "よくある反対意見とその対処法のガイド", steps: ["反対意見の傾聴", "共感の表現", "具体的な回答", "事例での裏付け", "次のアクション提案"] },
  { id: "pb5", name: "クロージング手順", category: "クロージング", usageCount: 56, lastUsed: "2026-03-10", createdBy: "佐藤 匠", description: "契約締結に向けた最終確認プロセス", steps: ["条件の最終確認", "契約書のレビュー", "決裁者の確認", "導入スケジュール合意", "契約書送付"] },
  { id: "pb6", name: "オンボーディングキックオフ", category: "導入", usageCount: 34, lastUsed: "2026-03-08", createdBy: "田村 愛", description: "新規顧客のオンボーディング開始時のキックオフミーティングガイド", steps: ["チーム紹介", "プロジェクト概要説明", "マイルストーン設定", "コミュニケーション方法合意", "初回タスク割り当て"] },
];

const categoryBadgeVariant = (category: string) => {
  switch (category) {
    case "初回商談": return "info" as const;
    case "提案": return "purple" as const;
    case "交渉": return "warning" as const;
    case "クロージング": return "success" as const;
    case "導入": return "default" as const;
    default: return "default" as const;
  }
};

function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button onClick={(e) => { e.stopPropagation(); setOpen(!open); }} className="p-1 rounded hover:bg-gray-100">
        <MoreHorizontal className="h-4 w-4 text-gray-400" />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-10 w-40 rounded-lg border bg-white py-1 shadow-lg">
          <button onClick={() => { onEdit(); setOpen(false); }} className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50">編集</button>
          <button onClick={() => { onEdit(); setOpen(false); }} className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50">複製</button>
          <button onClick={() => { onDelete(); setOpen(false); }} className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">削除</button>
        </div>
      )}
    </div>
  );
}

export default function PlaybooksPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);

  const [search, setSearch] = useState("");
  const [activeView, setActiveView] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const savedViews = [
    { key: "all", label: "すべて" },
    { key: "mine", label: "マイプレイブック" },
  ];

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const filtered = playbooks.filter((pb) => {
    const matchSearch = pb.name.toLowerCase().includes(search.toLowerCase()) || pb.description.toLowerCase().includes(search.toLowerCase());
    const matchView = activeView === "all" || (activeView === "mine" && pb.createdBy === "佐藤 匠");
    return matchSearch && matchView;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortField) return 0;
    let cmp = 0;
    if (sortField === "name") cmp = a.name.localeCompare(b.name);
    else if (sortField === "usageCount") cmp = a.usageCount - b.usageCount;
    else if (sortField === "lastUsed") cmp = a.lastUsed.localeCompare(b.lastUsed);
    return sortDir === "asc" ? cmp : -cmp;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginatedItems = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSelect = (id: string) => { setSelectedIds(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; }); };
  const toggleAll = () => { if (selectedIds.size === paginatedItems.length) setSelectedIds(new Set()); else setSelectedIds(new Set(paginatedItems.map(i => i.id))); };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[...Array(3)].map((_, i) => (<div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />))}
        </div>
        <div className="h-64 bg-gray-100 rounded-lg animate-pulse mt-4" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="プレイブック" description="営業プロセスのベストプラクティスを標準化" actions={<Button size="sm" onClick={() => alert("プレイブック作成は準備中です")}><Plus className="h-4 w-4 mr-1" />プレイブック作成</Button>} />

      {/* Saved View Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 px-1">
        {savedViews.map((v) => (
          <button key={v.key} onClick={() => { setActiveView(v.key); setCurrentPage(1); }} className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${activeView === v.key ? "border-[#ff4800] text-[#1f1f1f]" : "border-transparent text-gray-500 hover:text-gray-700"}`}>{v.label}</button>
        ))}
        <button className="ml-1 p-1.5 text-gray-400 hover:text-gray-600 rounded" onClick={() => alert("ビューの追加は準備中です")}><Plus className="h-4 w-4" /></button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50"><BookOpen className="h-5 w-5 text-blue-600" /></div><div><p className="text-2xl font-bold text-gray-900">{playbooks.length}</p><p className="text-xs text-gray-500">プレイブック数</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50"><Target className="h-5 w-5 text-green-600" /></div><div><p className="text-2xl font-bold text-gray-900">{playbooks.reduce((s, p) => s + p.usageCount, 0)}</p><p className="text-xs text-gray-500">総使用回数</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50"><Lightbulb className="h-5 w-5 text-purple-600" /></div><div><p className="text-2xl font-bold text-gray-900">{Math.round(playbooks.reduce((s, p) => s + p.usageCount, 0) / playbooks.length)}</p><p className="text-xs text-gray-500">平均使用回数</p></div></div></CardContent></Card>
      </div>

      {/* Search */}
      <div className="w-72"><Input variant="search" placeholder="プレイブック名で検索..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} /></div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-medium text-gray-500"><input type="checkbox" className="rounded border-gray-300" checked={paginatedItems.length > 0 && selectedIds.size === paginatedItems.length} onChange={toggleAll} /></th>
                <th className="px-4 py-3 text-left font-medium text-gray-500"><div className="flex items-center gap-1 cursor-pointer hover:text-gray-700" onClick={() => handleSort("name")}>プレイブック名<ArrowUpDown className="h-3 w-3" /></div></th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">カテゴリ</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500"><div className="flex items-center justify-end gap-1 cursor-pointer hover:text-gray-700" onClick={() => handleSort("usageCount")}>使用回数<ArrowUpDown className="h-3 w-3" /></div></th>
                <th className="px-4 py-3 text-left font-medium text-gray-500"><div className="flex items-center gap-1 cursor-pointer hover:text-gray-700" onClick={() => handleSort("lastUsed")}>最終使用<ArrowUpDown className="h-3 w-3" /></div></th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">作成者</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">ステップ数</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((pb) => (
                <tr key={pb.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${selectedIds.has(pb.id) ? "bg-blue-50" : ""}`}>
                  <td className="px-4 py-3"><input type="checkbox" className="rounded border-gray-300" checked={selectedIds.has(pb.id)} onChange={() => toggleSelect(pb.id)} onClick={(e) => e.stopPropagation()} /></td>
                  <td className="px-4 py-3"><div><p className="font-medium text-gray-900">{pb.name}</p><p className="text-xs text-gray-500 mt-0.5">{pb.description}</p></div></td>
                  <td className="px-4 py-3"><Badge variant={categoryBadgeVariant(pb.category)}>{pb.category}</Badge></td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">{pb.usageCount}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs"><div className="flex items-center gap-1"><Clock className="h-3 w-3" />{pb.lastUsed}</div></td>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ff4800] text-[10px] text-white">{pb.createdBy.charAt(0)}</div><span className="text-gray-600 text-xs">{pb.createdBy}</span></div></td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{pb.steps.length}ステップ</td>
                  <td className="px-4 py-3"><RowActions onEdit={() => alert("編集は準備中です")} onDelete={() => alert("削除は準備中です")} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 mt-2">
            <p className="text-sm text-gray-500">{sorted.length}件中 {(currentPage-1)*itemsPerPage+1}〜{Math.min(currentPage*itemsPerPage, sorted.length)}件</p>
            <div className="flex gap-1">
              <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage===1} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">前へ</button>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage===totalPages} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">次へ</button>
            </div>
          </div>
        )}
      </Card>

      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-lg border bg-white px-5 py-3 shadow-lg">
          <span className="text-sm font-medium text-gray-700">{selectedIds.size}件選択中</span>
          <div className="h-4 w-px bg-gray-200" />
          <Button size="sm" variant="outline" onClick={() => alert("エクスポートは準備中です")}><Download className="h-4 w-4 mr-1" />エクスポート</Button>
          <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => alert("削除は準備中です")}><Trash2 className="h-4 w-4 mr-1" />削除</Button>
          <button onClick={() => setSelectedIds(new Set())} className="ml-2 text-xs text-gray-500 hover:text-gray-700">選択解除</button>
        </div>
      )}

      {filtered.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-gray-300" />
          </div>
          <h3 className="text-base font-medium text-gray-900 mb-1">データがありません</h3>
          <p className="text-sm text-gray-500">新しいプレイブックを作成して始めましょう</p>
        </div>
      )}
    </div>
  );
}
