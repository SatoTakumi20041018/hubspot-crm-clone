"use client";

import { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatsCard } from "@/components/ui/stats-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Brain,
  Eye,
  TrendingUp,
  Search,
  MessageSquare,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Plus,
  ArrowUpDown,
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
  Lightbulb,
  X,
  Download,
} from "lucide-react";

const promptTrackings = [
  { id: 1, prompt: "BtoBマーケティングツール おすすめ", visibility: 85, mentions: 12, sentiment: "positive" as const, trend: "up" as const, lastChecked: "2026-03-14" },
  { id: 2, prompt: "CRM 比較 2026", visibility: 72, mentions: 8, sentiment: "positive" as const, trend: "up" as const, lastChecked: "2026-03-14" },
  { id: 3, prompt: "営業支援ツール ランキング", visibility: 45, mentions: 3, sentiment: "neutral" as const, trend: "down" as const, lastChecked: "2026-03-14" },
  { id: 4, prompt: "マーケティングオートメーション 導入方法", visibility: 68, mentions: 6, sentiment: "positive" as const, trend: "stable" as const, lastChecked: "2026-03-14" },
  { id: 5, prompt: "カスタマーサクセス プラットフォーム", visibility: 55, mentions: 4, sentiment: "neutral" as const, trend: "up" as const, lastChecked: "2026-03-13" },
  { id: 6, prompt: "インバウンドマーケティング ツール", visibility: 90, mentions: 15, sentiment: "positive" as const, trend: "stable" as const, lastChecked: "2026-03-14" },
  { id: 7, prompt: "SaaS 顧客管理 おすすめ", visibility: 38, mentions: 2, sentiment: "negative" as const, trend: "down" as const, lastChecked: "2026-03-13" },
  { id: 8, prompt: "メール配信 自動化 ツール", visibility: 62, mentions: 5, sentiment: "positive" as const, trend: "up" as const, lastChecked: "2026-03-14" },
];

const aiVisibilityData = [
  { platform: "ChatGPT", score: 78, mentions: 45, change: 12 },
  { platform: "Gemini", score: 65, mentions: 28, change: 8 },
  { platform: "Claude", score: 72, mentions: 32, change: 15 },
  { platform: "Perplexity", score: 82, mentions: 56, change: 5 },
  { platform: "Copilot", score: 58, mentions: 18, change: -3 },
];

const recommendations = [
  { id: 1, title: "「CRM 比較」関連コンテンツの強化", description: "AI回答で競合他社が優先的に言及されています。比較表と独自の強みを明確にしたコンテンツを作成することで、AI回答でのポジションを改善できます。", priority: "high" as const, impact: "高" },
  { id: 2, title: "FAQ構造化データの追加", description: "よくある質問をJSON-LD構造化データとして追加することで、AI検索エンジンがコンテンツを理解しやすくなります。", priority: "high" as const, impact: "高" },
  { id: 3, title: "統計データ・数値の充実", description: "AIは具体的な数値やデータを好みます。業界レポートや自社データを含むコンテンツを増やしましょう。", priority: "medium" as const, impact: "中" },
  { id: 4, title: "ケーススタディの拡充", description: "日本企業の具体的な成功事例がAI回答で引用される傾向があります。導入事例を10件以上公開することを推奨します。", priority: "medium" as const, impact: "中" },
  { id: 5, title: "ブランド名のコンテキスト強化", description: "自社ブランド名がAI回答で正しく関連付けられるよう、製品カテゴリとの明確な結びつきをコンテンツ内で強化しましょう。", priority: "low" as const, impact: "低" },
];

const visibilityColor = (score: number) => {
  if (score >= 80) return "text-[#00823a] bg-[#b9cdbe]";
  if (score >= 60) return "text-[#2f7579] bg-[#b2e9eb]";
  if (score >= 40) return "text-[#8a6d00] bg-[#ece6d9]";
  return "text-[#d9002b] bg-[#fcc6b1]";
};

function RowActions() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600" onClick={(e) => { e.stopPropagation(); setOpen(!open); }}>
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-50 w-44 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={(e) => { e.stopPropagation(); alert("編集"); setOpen(false); }}><Pencil className="h-3.5 w-3.5" /> 編集</button>
          <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={(e) => { e.stopPropagation(); alert("複製"); setOpen(false); }}><Copy className="h-3.5 w-3.5" /> 複製</button>
          <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); alert("削除"); setOpen(false); }}><Trash2 className="h-3.5 w-3.5" /> 削除</button>
        </div>
      )}
    </div>
  );
}

export default function AEOPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);

  const [promptSearch, setPromptSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [activeView, setActiveView] = useState("tracking");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const filteredPrompts = [...promptTrackings.filter((p) =>
    p.prompt.includes(promptSearch)
  )].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = String((a as unknown as Record<string, unknown>)[sortField] ?? "");
    const bVal = String((b as unknown as Record<string, unknown>)[sortField] ?? "");
    return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredPrompts.length / itemsPerPage);
  const paginatedItems = filteredPrompts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const avgVisibility = Math.round(
    promptTrackings.reduce((sum, p) => sum + p.visibility, 0) / promptTrackings.length
  );

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  };
  const toggleSelectAll = () => {
    if (selectedIds.size === promptTrackings.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(promptTrackings.map(p => p.id)));
  };

  const savedViews = [
    { key: "tracking", label: "プロンプト追跡" },
    { key: "visibility", label: "AI可視性" },
    { key: "recommendations", label: "最適化提案" },
  ];

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
        title="AEO - Answer Engine Optimization"
        description="AI検索エンジンでのブランド可視性を最適化"
        breadcrumbs={[{ label: "ホーム", href: "/" }, { label: "マーケティング" }, { label: "AEO" }]}
        actions={<Button size="sm" onClick={() => alert("プロンプト追跡追加は準備中です")}><Plus className="h-4 w-4 mr-1" />プロンプト追跡を追加</Button>}
      />

      <p className="text-sm text-gray-500">{promptTrackings.length}件のプロンプト追跡</p>

      {/* Saved View Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 px-1">
        {savedViews.map((v) => (
          <button key={v.key} onClick={() => setActiveView(v.key)} className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${activeView === v.key ? "border-[#ff4800] text-[#1f1f1f]" : "border-transparent text-gray-500 hover:text-gray-700"}`}>{v.label}</button>
        ))}
        <button className="ml-1 p-1.5 text-gray-400 hover:text-gray-600 rounded" onClick={() => alert("ビュー追加は準備中です")}><Plus className="h-4 w-4" /></button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatsCard label="平均AI可視性スコア" value={`${avgVisibility}%`} change={8} changeLabel="前月比" icon={Eye} />
        <StatsCard label="追跡プロンプト数" value={promptTrackings.length} icon={MessageSquare} />
        <StatsCard label="AI言及回数（今月）" value="161" change={23} changeLabel="前月比" icon={Brain} />
        <StatsCard label="ポジティブセンチメント" value="75%" change={5} changeLabel="前月比" icon={TrendingUp} />
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg bg-[#1f1f1f] px-4 py-2.5 text-white">
          <span className="text-sm font-medium">{selectedIds.size}件を選択中</span>
          <div className="h-4 w-px bg-gray-600" />
          <button className="flex items-center gap-1.5 rounded px-2.5 py-1 text-sm hover:bg-white/10 transition-colors" onClick={() => alert("エクスポートは準備中です")}><Download className="h-3.5 w-3.5" /> エクスポート</button>
          <button className="flex items-center gap-1.5 rounded px-2.5 py-1 text-sm text-red-400 hover:bg-white/10 transition-colors" onClick={() => alert("一括削除は準備中です")}><Trash2 className="h-3.5 w-3.5" /> 削除</button>
          <div className="flex-1" />
          <button className="rounded p-1 hover:bg-white/10 transition-colors" onClick={() => setSelectedIds(new Set())}><X className="h-4 w-4" /></button>
        </div>
      )}

      {/* Prompt Tracking */}
      {activeView === "tracking" && (
        <Card>
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-80">
                <Input variant="search" placeholder="プロンプトを検索..." value={promptSearch} onChange={(e) => { setPromptSearch(e.target.value); setCurrentPage(1); }} />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left w-10"><input type="checkbox" className="rounded border-gray-300" checked={promptTrackings.length > 0 && selectedIds.size === promptTrackings.length} onChange={toggleSelectAll} /></th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("prompt")}><div className="flex items-center gap-1">追跡プロンプト <ArrowUpDown className="h-3 w-3" /></div></th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("visibility")}><div className="flex items-center justify-center gap-1">可視性スコア <ArrowUpDown className="h-3 w-3" /></div></th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => handleSort("mentions")}><div className="flex items-center justify-center gap-1">言及回数 <ArrowUpDown className="h-3 w-3" /></div></th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500">センチメント</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500">トレンド</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">最終確認</th>
                  <th className="px-4 py-3"></th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.map((tracking) => (
                  <tr key={tracking.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${selectedIds.has(tracking.id) ? "bg-blue-50/50" : ""}`}>
                    <td className="px-4 py-3"><input type="checkbox" className="rounded border-gray-300" checked={selectedIds.has(tracking.id)} onChange={() => toggleSelect(tracking.id)} onClick={(e) => e.stopPropagation()} /></td>
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><Search className="h-4 w-4 text-gray-400" /><span className="font-medium text-gray-900">{tracking.prompt}</span></div></td>
                    <td className="px-4 py-3 text-center"><span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${visibilityColor(tracking.visibility)}`}>{tracking.visibility}%</span></td>
                    <td className="px-4 py-3 text-center font-medium text-gray-900">{tracking.mentions}</td>
                    <td className="px-4 py-3 text-center"><Badge variant={tracking.sentiment === "positive" ? "success" : tracking.sentiment === "neutral" ? "default" : "danger"}>{tracking.sentiment === "positive" ? "ポジティブ" : tracking.sentiment === "neutral" ? "ニュートラル" : "ネガティブ"}</Badge></td>
                    <td className="px-4 py-3 text-center">{tracking.trend === "up" ? (<span className="text-[#00823a]">&#9650; 上昇</span>) : tracking.trend === "down" ? (<span className="text-[#d9002b]">&#9660; 下降</span>) : (<span className="text-gray-500">&#8212; 安定</span>)}</td>
                    <td className="px-4 py-3 text-gray-600">{tracking.lastChecked}</td>
                    <td className="px-4 py-3"><RowActions /></td>
                    <td className="px-4 py-3"><Button variant="ghost" size="sm" onClick={() => alert("詳細は準備中です")}>詳細 <ArrowRight className="ml-1 h-3 w-3" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
            <p className="text-sm text-gray-500">{filteredPrompts.length}件中 {(currentPage - 1) * itemsPerPage + 1}〜{Math.min(currentPage * itemsPerPage, filteredPrompts.length)}件</p>
            <div className="flex gap-1">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">前へ</button>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-gray-50">次へ</button>
            </div>
          </div>
        </Card>
      )}

      {/* AI Visibility */}
      {activeView === "visibility" && (
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>AIプラットフォーム別可視性</CardTitle><CardDescription>各AIプラットフォームでの自社ブランドの表示頻度と評価</CardDescription></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiVisibilityData.map((platform) => (
                  <div key={platform.platform} className="rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold text-gray-600">{platform.platform.charAt(0)}</div>
                        <div><p className="font-medium text-gray-900">{platform.platform}</p><p className="text-xs text-gray-500">{platform.mentions}回言及（今月）</p></div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-48">
                          <div className="flex items-center justify-between mb-1"><span className="text-xs text-gray-500">可視性スコア</span><span className="text-sm font-semibold">{platform.score}%</span></div>
                          <div className="h-2 w-full rounded-full bg-gray-200"><div className={`h-2 rounded-full ${platform.score >= 70 ? "bg-[#00823a]" : platform.score >= 50 ? "bg-[#8a6d00]" : "bg-[#d9002b]"}`} style={{ width: `${platform.score}%` }} /></div>
                        </div>
                        <Badge variant={platform.change >= 0 ? "success" : "danger"}>{platform.change >= 0 ? "+" : ""}{platform.change}%</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="relative mx-auto h-32 w-32">
                    <svg className="h-32 w-32 -rotate-90" viewBox="0 0 128 128">
                      <circle cx="64" cy="64" r="56" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                      <circle cx="64" cy="64" r="56" fill="none" stroke="#ff4800" strokeWidth="12" strokeDasharray={`${(avgVisibility / 100) * 352} 352`} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center"><span className="text-3xl font-bold text-gray-900">{avgVisibility}</span></div>
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-600">総合AI可視性スコア</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-[#00823a]" /><span className="text-sm text-gray-700">上位プロンプト: 「インバウンドマーケティング ツール」(90%)</span></div>
                  <div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-[#8a6d00]" /><span className="text-sm text-gray-700">改善推奨: 「SaaS 顧客管理 おすすめ」(38%)</span></div>
                  <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-[#2f7579]" /><span className="text-sm text-gray-700">前月比: +8ポイント改善</span></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recommendations */}
      {activeView === "recommendations" && (
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <Card key={rec.id} className="transition-shadow">
              <div className="flex items-start gap-4 p-5">
                <div className={`rounded-full p-2 ${rec.priority === "high" ? "bg-[#fcc6b1]" : rec.priority === "medium" ? "bg-[#ece6d9]" : "bg-gray-100"}`}>
                  <Lightbulb className={`h-5 w-5 ${rec.priority === "high" ? "text-[#ff4800]" : rec.priority === "medium" ? "text-[#8a6d00]" : "text-gray-500"}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                    <Badge variant={rec.priority === "high" ? "danger" : rec.priority === "medium" ? "warning" : "default"}>影響度: {rec.impact}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{rec.description}</p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={() => alert("AIで最適化を実行は準備中です")}><Sparkles className="h-4 w-4 mr-1" />AIで最適化を実行</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {filteredPrompts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Brain className="h-8 w-8 text-gray-300" />
          </div>
          <h3 className="text-base font-medium text-gray-900 mb-1">データがありません</h3>
          <p className="text-sm text-gray-500">新しいプロンプト追跡を作成して始めましょう</p>
        </div>
      )}
    </div>
  );
}
