"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import {
  Plus,
  Target,
  DollarSign,
  Handshake,
  Phone,
  TrendingUp,
  MoreHorizontal,
  ArrowUpDown,
  Trash2,
  Download,
} from "lucide-react";

interface Goal {
  id: string;
  name: string;
  type: "revenue" | "deals" | "calls" | "meetings" | "tasks";
  target: number;
  current: number;
  unit: string;
  owner: string;
  period: string;
  startDate: string;
  endDate: string;
}

const goals: Goal[] = [
  { id: "g1", name: "Q1 売上目標", type: "revenue", target: 45000000, current: 32500000, unit: "¥", owner: "佐藤 匠", period: "Q1 2026", startDate: "2026-01-01", endDate: "2026-03-31" },
  { id: "g2", name: "月間成約件数", type: "deals", target: 15, current: 12, unit: "件", owner: "佐藤 匠", period: "2026年3月", startDate: "2026-03-01", endDate: "2026-03-31" },
  { id: "g3", name: "週間コール数", type: "calls", target: 50, current: 38, unit: "件", owner: "田村 愛", period: "2026年3月 W3", startDate: "2026-03-10", endDate: "2026-03-16" },
  { id: "g4", name: "チーム売上目標", type: "revenue", target: 80000000, current: 62100000, unit: "¥", owner: "チーム全体", period: "Q1 2026", startDate: "2026-01-01", endDate: "2026-03-31" },
  { id: "g5", name: "新規リード獲得数", type: "deals", target: 200, current: 186, unit: "件", owner: "田村 愛", period: "2026年3月", startDate: "2026-03-01", endDate: "2026-03-31" },
  { id: "g6", name: "ミーティング数目標", type: "meetings", target: 30, current: 22, unit: "件", owner: "佐藤 匠", period: "2026年3月", startDate: "2026-03-01", endDate: "2026-03-31" },
  { id: "g7", name: "タスク完了率", type: "tasks", target: 90, current: 79, unit: "%", owner: "チーム全体", period: "2026年3月", startDate: "2026-03-01", endDate: "2026-03-31" },
];

const typeConfig: Record<string, { icon: typeof Target; color: string; bg: string; label: string }> = {
  revenue: { icon: DollarSign, label: "売上", color: "text-green-600", bg: "bg-green-50" },
  deals: { icon: Handshake, label: "取引", color: "text-blue-600", bg: "bg-blue-50" },
  calls: { icon: Phone, label: "コール", color: "text-purple-600", bg: "bg-purple-50" },
  meetings: { icon: Target, label: "ミーティング", color: "text-orange-600", bg: "bg-orange-50" },
  tasks: { icon: TrendingUp, label: "タスク", color: "text-cyan-600", bg: "bg-cyan-50" },
};

const formatValue = (value: number, unit: string) => {
  if (unit === "¥") return `¥${(value / 10000).toLocaleString()}万`;
  return `${value.toLocaleString()}${unit}`;
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

export default function GoalsPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);

  const [activeView, setActiveView] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const views = [
    { key: "all", label: "すべてのゴール" },
    { key: "mine", label: "マイゴール" },
  ];

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const filtered = goals.filter((g) => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase()) || g.owner.toLowerCase().includes(search.toLowerCase());
    const matchView = activeView === "all" || (activeView === "mine" && g.owner === "佐藤 匠");
    return matchSearch && matchView;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortField) return 0;
    let cmp = 0;
    if (sortField === "name") cmp = a.name.localeCompare(b.name);
    else if (sortField === "progress") cmp = (a.current / a.target) - (b.current / b.target);
    else if (sortField === "owner") cmp = a.owner.localeCompare(b.owner);
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
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[...Array(4)].map((_, i) => (<div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />))}
        </div>
        <div className="h-64 bg-gray-100 rounded-lg animate-pulse mt-4" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="ゴール" description="個人・チームの目標設定と進捗管理" actions={<Button size="sm" onClick={() => alert("ゴール作成は準備中です")}><Plus className="h-4 w-4 mr-1" />ゴール作成</Button>} />

      <div className="flex items-center gap-1 border-b border-gray-200 px-1 mb-4">
        {views.map((v) => (
          <button key={v.key} onClick={() => { setActiveView(v.key); setCurrentPage(1); }} className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${activeView === v.key ? "border-[#ff4800] text-[#1f1f1f]" : "border-transparent text-gray-500 hover:text-gray-700"}`}>{v.label}</button>
        ))}
        <button className="ml-1 p-1.5 text-gray-400 hover:text-gray-600 rounded"><Plus className="h-4 w-4" /></button>
      </div>

      {/* Search */}
      <div className="w-72"><Input variant="search" placeholder="ゴール名、担当者で検索..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} /></div>

      {/* Goals Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-medium text-gray-500"><input type="checkbox" className="rounded border-gray-300" checked={paginatedItems.length > 0 && selectedIds.size === paginatedItems.length} onChange={toggleAll} /></th>
                <th className="px-4 py-3 text-left font-medium text-gray-500"><div className="flex items-center gap-1 cursor-pointer hover:text-gray-700" onClick={() => handleSort("name")}>ゴール名<ArrowUpDown className="h-3 w-3" /></div></th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">タイプ</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500"><div className="flex items-center gap-1 cursor-pointer hover:text-gray-700" onClick={() => handleSort("progress")}>進捗<ArrowUpDown className="h-3 w-3" /></div></th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">現在 / 目標</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500"><div className="flex items-center gap-1 cursor-pointer hover:text-gray-700" onClick={() => handleSort("owner")}>担当<ArrowUpDown className="h-3 w-3" /></div></th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">期間</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((goal) => {
                const config = typeConfig[goal.type];
                const Icon = config.icon;
                const progress = Math.round((goal.current / goal.target) * 100);
                const isOnTrack = progress >= 70;
                const isComplete = progress >= 100;
                return (
                  <tr key={goal.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${selectedIds.has(goal.id) ? "bg-blue-50" : ""}`}>
                    <td className="px-4 py-3"><input type="checkbox" className="rounded border-gray-300" checked={selectedIds.has(goal.id)} onChange={() => toggleSelect(goal.id)} onClick={(e) => e.stopPropagation()} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${config.bg}`}><Icon className={`h-4 w-4 ${config.color}`} /></div>
                        <span className="font-medium text-gray-900">{goal.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge variant="default">{config.label}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <div className="h-2 flex-1 rounded-full bg-gray-100">
                          <div className={`h-2 rounded-full ${isComplete ? "bg-green-400" : isOnTrack ? "bg-blue-400" : "bg-yellow-400"}`} style={{ width: `${Math.min(progress, 100)}%` }} />
                        </div>
                        <span className={`text-xs font-medium ${isComplete ? "text-green-600" : isOnTrack ? "text-blue-600" : "text-yellow-600"}`}>{progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{formatValue(goal.current, goal.unit)} / {formatValue(goal.target, goal.unit)}</td>
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ff4800] text-[10px] text-white">{goal.owner.charAt(0)}</div><span className="text-gray-600 text-xs">{goal.owner}</span></div></td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{goal.period}</td>
                    <td className="px-4 py-3"><RowActions onEdit={() => alert("編集は準備中です")} onDelete={() => alert("削除は準備中です")} /></td>
                  </tr>
                );
              })}
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
    </div>
  );
}
