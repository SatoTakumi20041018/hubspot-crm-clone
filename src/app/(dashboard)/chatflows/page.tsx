"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import {
  Plus,
  Bot,
  MessageCircle,
  Users,
  Clock,
  MoreHorizontal,
  ArrowRight,
  Zap,
  ArrowUpDown,
  Trash2,
  Download,
  Archive,
} from "lucide-react";

interface Chatflow {
  id: string;
  name: string;
  type: "ライブチャット" | "ボット";
  status: "有効" | "無効";
  conversations: number;
  createdAt: string;
  lastActive: string;
  description: string;
  steps?: string[];
}

const chatflows: Chatflow[] = [
  { id: "cf1", name: "Webサイト ウェルカムボット", type: "ボット", status: "有効", conversations: 1234, createdAt: "2025-10-01", lastActive: "2026-03-14", description: "初回訪問者への自動挨拶と資料請求への誘導", steps: ["挨拶メッセージ", "目的の確認", "資料送付 or 担当者接続", "情報収集"] },
  { id: "cf2", name: "カスタマーサポート ライブチャット", type: "ライブチャット", status: "有効", conversations: 856, createdAt: "2025-09-15", lastActive: "2026-03-14", description: "既存顧客向けのリアルタイムサポートチャット" },
  { id: "cf3", name: "リードクオリフィケーションボット", type: "ボット", status: "有効", conversations: 567, createdAt: "2025-12-01", lastActive: "2026-03-13", description: "リードの適格性を自動で判定し、適切な担当者にルーティング", steps: ["会社情報収集", "ニーズヒアリング", "予算確認", "スコアリング", "担当者アサイン"] },
  { id: "cf4", name: "ミーティング予約ボット", type: "ボット", status: "有効", conversations: 342, createdAt: "2026-01-15", lastActive: "2026-03-12", description: "カレンダー連携によるミーティング自動予約", steps: ["目的確認", "日程候補表示", "予約確定", "確認メール送信"] },
  { id: "cf5", name: "FAQ 自動応答ボット", type: "ボット", status: "無効", conversations: 189, createdAt: "2025-11-01", lastActive: "2026-02-28", description: "よくある質問への自動回答（ナレッジベース連携）", steps: ["質問受付", "キーワード分析", "記事検索", "回答提示", "解決確認"] },
  { id: "cf6", name: "営業時間外対応ボット", type: "ボット", status: "有効", conversations: 423, createdAt: "2026-02-01", lastActive: "2026-03-14", description: "営業時間外の問い合わせを受け付け、翌営業日にフォロー", steps: ["時間外メッセージ", "問い合わせ内容記録", "連絡先取得", "翌営業日通知"] },
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

export default function ChatflowsPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);

  const [activeView, setActiveView] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const views = [
    { key: "all", label: "すべて" },
    { key: "live", label: "ライブチャット" },
    { key: "bot", label: "ボット" },
  ];

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const filtered = chatflows.filter((cf) => {
    const matchSearch = cf.name.toLowerCase().includes(search.toLowerCase()) || cf.description.toLowerCase().includes(search.toLowerCase());
    const matchView = activeView === "all" || (activeView === "live" && cf.type === "ライブチャット") || (activeView === "bot" && cf.type === "ボット");
    return matchSearch && matchView;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortField) return 0;
    let cmp = 0;
    if (sortField === "name") cmp = a.name.localeCompare(b.name);
    else if (sortField === "conversations") cmp = a.conversations - b.conversations;
    else if (sortField === "lastActive") cmp = a.lastActive.localeCompare(b.lastActive);
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
      <PageHeader title="チャットフロー" description="ライブチャットとチャットボットの管理" actions={<Button size="sm" onClick={() => alert("チャットフロー作成は準備中です")}><Plus className="h-4 w-4 mr-1" />チャットフロー作成</Button>} />

      <p className="text-sm text-gray-500">{chatflows.length}件のチャットフロー</p>


      <div className="flex items-center gap-1 border-b border-gray-200 px-1 mb-4">
        {views.map((v) => (
          <button key={v.key} onClick={() => { setActiveView(v.key); setCurrentPage(1); }} className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${activeView === v.key ? "border-[#ff4800] text-[#1f1f1f]" : "border-transparent text-gray-500 hover:text-gray-700"}`}>{v.label}</button>
        ))}
        <button className="ml-1 p-1.5 text-gray-400 hover:text-gray-600 rounded"><Plus className="h-4 w-4" /></button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50"><Bot className="h-5 w-5 text-blue-600" /></div><div><p className="text-2xl font-bold text-gray-900">{chatflows.filter((cf) => cf.type === "ボット").length}</p><p className="text-xs text-gray-500">ボット</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50"><MessageCircle className="h-5 w-5 text-green-600" /></div><div><p className="text-2xl font-bold text-gray-900">{chatflows.filter((cf) => cf.type === "ライブチャット").length}</p><p className="text-xs text-gray-500">ライブチャット</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50"><Users className="h-5 w-5 text-purple-600" /></div><div><p className="text-2xl font-bold text-gray-900">{chatflows.reduce((s, cf) => s + cf.conversations, 0).toLocaleString()}</p><p className="text-xs text-gray-500">総会話数</p></div></div></CardContent></Card>
      </div>

      {/* Search */}
      <div className="w-72"><Input variant="search" placeholder="チャットフロー名で検索..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} /></div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-medium text-gray-500"><input type="checkbox" className="rounded border-gray-300" checked={paginatedItems.length > 0 && selectedIds.size === paginatedItems.length} onChange={toggleAll} /></th>
                <th className="px-4 py-3 text-left font-medium text-gray-500"><div className="flex items-center gap-1 cursor-pointer hover:text-gray-700" onClick={() => handleSort("name")}>名前<ArrowUpDown className="h-3 w-3" /></div></th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">タイプ</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">ステータス</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500"><div className="flex items-center justify-end gap-1 cursor-pointer hover:text-gray-700" onClick={() => handleSort("conversations")}>会話数<ArrowUpDown className="h-3 w-3" /></div></th>
                <th className="px-4 py-3 text-left font-medium text-gray-500"><div className="flex items-center gap-1 cursor-pointer hover:text-gray-700" onClick={() => handleSort("lastActive")}>最終アクティブ<ArrowUpDown className="h-3 w-3" /></div></th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">作成日</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((cf) => (
                <tr key={cf.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${selectedIds.has(cf.id) ? "bg-blue-50" : ""}`}>
                  <td className="px-4 py-3"><input type="checkbox" className="rounded border-gray-300" checked={selectedIds.has(cf.id)} onChange={() => toggleSelect(cf.id)} onClick={(e) => e.stopPropagation()} /></td>
                  <td className="px-4 py-3"><div><p className="font-medium text-gray-900">{cf.name}</p><p className="text-xs text-gray-500 mt-0.5">{cf.description}</p></div></td>
                  <td className="px-4 py-3"><Badge variant={cf.type === "ボット" ? "info" : "success"}>{cf.type}</Badge></td>
                  <td className="px-4 py-3"><Badge variant={cf.status === "有効" ? "success" : "default"}>{cf.status}</Badge></td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">{cf.conversations.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs"><div className="flex items-center gap-1"><Clock className="h-3 w-3" />{cf.lastActive}</div></td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{cf.createdAt}</td>
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
    </div>
  );
}
