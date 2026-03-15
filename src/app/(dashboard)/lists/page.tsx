"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import {
  Plus,
  Users,
  ArrowUpDown,
  MoreHorizontal,
  ListFilter,
  Zap,
  Clock,
  Trash2,
  Download,
  Archive,
} from "lucide-react";

interface ContactList {
  id: string;
  name: string;
  type: "静的" | "動的";
  count: number;
  lastUpdated: string;
  createdBy: string;
  createdAt: string;
  description: string;
}

const lists: ContactList[] = [
  { id: "l1", name: "全顧客リスト", type: "動的", count: 2345, lastUpdated: "2026-03-14", createdBy: "佐藤 匠", createdAt: "2025-06-01", description: "ライフサイクル = 顧客 のコンタクト" },
  { id: "l2", name: "MQL（マーケティング適格リード）", type: "動的", count: 186, lastUpdated: "2026-03-14", createdBy: "佐藤 匠", createdAt: "2025-07-15", description: "リードスコア >= 30 かつ ライフサイクル = MQL" },
  { id: "l3", name: "3月セミナー参加者", type: "静的", count: 87, lastUpdated: "2026-03-10", createdBy: "田村 愛", createdAt: "2026-03-01", description: "2026年3月開催セミナーの参加者リスト" },
  { id: "l4", name: "ニュースレター購読者", type: "動的", count: 4567, lastUpdated: "2026-03-14", createdBy: "田村 愛", createdAt: "2025-06-01", description: "ニュースレターオプトイン = true" },
  { id: "l5", name: "90日以上未アクティブ", type: "動的", count: 342, lastUpdated: "2026-03-14", createdBy: "佐藤 匠", createdAt: "2025-09-01", description: "最終アクティビティから90日以上経過" },
  { id: "l6", name: "展示会2026 リード", type: "静的", count: 156, lastUpdated: "2026-02-28", createdBy: "佐藤 匠", createdAt: "2026-02-25", description: "Tech Expo 2026で獲得したリード" },
  { id: "l7", name: "エンタープライズ顧客", type: "動的", count: 45, lastUpdated: "2026-03-13", createdBy: "佐藤 匠", createdAt: "2025-08-01", description: "従業員数 >= 500 かつ ライフサイクル = 顧客" },
  { id: "l8", name: "東京エリアのコンタクト", type: "動的", count: 892, lastUpdated: "2026-03-14", createdBy: "田村 愛", createdAt: "2025-10-01", description: "住所に「東京」を含むコンタクト" },
  { id: "l9", name: "ウェビナー未参加リスト", type: "静的", count: 234, lastUpdated: "2026-03-05", createdBy: "田村 愛", createdAt: "2026-03-01", description: "登録したが未参加のコンタクト" },
  { id: "l10", name: "高エンゲージメントリード", type: "動的", count: 128, lastUpdated: "2026-03-14", createdBy: "佐藤 匠", createdAt: "2026-01-15", description: "メール開封率 > 50% かつ サイト訪問 >= 5回/月" },
  { id: "l11", name: "無料トライアルユーザー", type: "動的", count: 567, lastUpdated: "2026-03-14", createdBy: "佐藤 匠", createdAt: "2025-09-15", description: "トライアルステータス = アクティブ" },
];


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

export default function ListsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);

  const [search, setSearch] = useState("");
  const [activeView, setActiveView] = useState("all");
  const [filterType, setFilterType] = useState("すべて");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const views = [
    { key: "all", label: "すべてのリスト" },
    { key: "active", label: "アクティブリスト" },
    { key: "static", label: "静的リスト" },
  ];

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const filtered = lists.filter((l) => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "すべて" || l.type === filterType;
    return matchSearch && matchType;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortField) return 0;
    let cmp = 0;
    if (sortField === "name") cmp = a.name.localeCompare(b.name);
    else if (sortField === "count") cmp = a.count - b.count;
    else if (sortField === "lastUpdated") cmp = a.lastUpdated.localeCompare(b.lastUpdated);
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
      <PageHeader title="リスト" description="コンタクトリストの作成・管理" actions={<Button size="sm" onClick={() => alert("リスト作成は準備中です")}><Plus className="h-4 w-4 mr-1" />リスト作成</Button>} />

      <p className="text-sm text-gray-500">{lists.length}件のリスト</p>


      <div className="flex items-center gap-1 border-b border-gray-200 px-1 mb-4">
        {views.map((v) => (
          <button key={v.key} onClick={() => setActiveView(v.key)} className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${activeView === v.key ? "border-[#ff4800] text-[#1f1f1f]" : "border-transparent text-gray-500 hover:text-gray-700"}`}>{v.label}</button>
        ))}
        <button className="ml-1 p-1.5 text-gray-400 hover:text-gray-600 rounded" onClick={() => alert("ビューの追加は準備中です")}><Plus className="h-4 w-4" /></button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="w-72"><Input variant="search" placeholder="リスト名で検索..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} /></div>
        <div className="flex gap-1">
          {["すべて", "静的", "動的"].map((type) => (
            <button key={type} onClick={() => { setFilterType(type); setCurrentPage(1); }} className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${filterType === type ? "bg-[#ff4800] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {type === "動的" && <Zap className="h-3 w-3 inline mr-0.5" />}
              {type === "静的" && <ListFilter className="h-3 w-3 inline mr-0.5" />}
              {type}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-medium text-gray-500"><input type="checkbox" className="rounded border-gray-300" checked={paginatedItems.length > 0 && selectedIds.size === paginatedItems.length} onChange={toggleAll} /></th>
                <th className="px-4 py-3 text-left font-medium text-gray-500"><div className="flex items-center gap-1 cursor-pointer hover:text-gray-700" onClick={() => handleSort("name")}>リスト名<ArrowUpDown className="h-3 w-3" /></div></th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">タイプ</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500"><div className="flex items-center justify-end gap-1 cursor-pointer hover:text-gray-700" onClick={() => handleSort("count")}>件数<ArrowUpDown className="h-3 w-3" /></div></th>
                <th className="px-4 py-3 text-left font-medium text-gray-500"><div className="flex items-center gap-1 cursor-pointer hover:text-gray-700" onClick={() => handleSort("lastUpdated")}>最終更新<ArrowUpDown className="h-3 w-3" /></div></th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">作成者</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">作成日</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((list) => (
                <tr key={list.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${selectedIds.has(list.id) ? "bg-blue-50" : ""}`} onClick={() => router.push(`/lists/${list.id}`)}>
                  <td className="px-4 py-3"><input type="checkbox" className="rounded border-gray-300" checked={selectedIds.has(list.id)} onChange={() => toggleSelect(list.id)} onClick={(e) => e.stopPropagation()} /></td>
                  <td className="px-4 py-3"><div><div className="flex items-center gap-2"><Users className="h-4 w-4 text-gray-400" /><span className="font-medium text-gray-900">{list.name}</span></div><p className="text-xs text-gray-500 mt-0.5 ml-6">{list.description}</p></div></td>
                  <td className="px-4 py-3"><Badge variant={list.type === "動的" ? "info" : "default"}>{list.type === "動的" && <Zap className="h-3 w-3 mr-0.5" />}{list.type}</Badge></td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">{list.count.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs"><div className="flex items-center gap-1"><Clock className="h-3 w-3" />{list.lastUpdated}</div></td>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ff4800] text-[10px] text-white">{list.createdBy.charAt(0)}</div><span className="text-gray-600 text-xs">{list.createdBy}</span></div></td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{list.createdAt}</td>
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
            <ListFilter className="h-8 w-8 text-gray-300" />
          </div>
          <h3 className="text-base font-medium text-gray-900 mb-1">データがありません</h3>
          <p className="text-sm text-gray-500">新しいリストを作成して始めましょう</p>
        </div>
      )}
    </div>
  );
}
