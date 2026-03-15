"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatsCard } from "@/components/ui/stats-card";
import {
  Users,
  Mail,
  CalendarCheck,
  Zap,
  Star,
  Building2,
  Clock,
  Eye,
  FileText,
  Globe,
  Sparkles,
  Send,
  ChevronRight,
  TrendingUp,
  Activity,
  Plus,
  ArrowUpDown,
} from "lucide-react";

const prospects = [
  { id: 1, name: "山本 健太", company: "テクノフューチャー株式会社", title: "CTO", email: "yamamoto@technofuture.jp", score: 92, lastActivity: "2026-03-14", companySize: "250名", status: "hot" as const, signals: ["価格ページ閲覧", "資料DL"] },
  { id: 2, name: "石川 麻衣", company: "グローバルコマース株式会社", title: "マーケティング部長", email: "ishikawa@globalcommerce.jp", score: 87, lastActivity: "2026-03-13", companySize: "500名", status: "hot" as const, signals: ["デモ申込", "事例閲覧"] },
  { id: 3, name: "藤田 翔", company: "イノベートラボ", title: "代表取締役", email: "fujita@innovatelab.jp", score: 81, lastActivity: "2026-03-13", companySize: "30名", status: "warm" as const, signals: ["メール開封3回"] },
  { id: 4, name: "岡田 美咲", company: "サンライトメディア", title: "営業マネージャー", email: "okada@sunlightmedia.jp", score: 78, lastActivity: "2026-03-12", companySize: "120名", status: "warm" as const, signals: ["ブログ閲覧"] },
  { id: 5, name: "中島 大地", company: "スマートクラウド株式会社", title: "IT部門長", email: "nakajima@smartcloud.jp", score: 74, lastActivity: "2026-03-12", companySize: "800名", status: "warm" as const, signals: ["ウェビナー参加"] },
  { id: 6, name: "西村 亮太", company: "デジタルブリッジ", title: "事業開発部長", email: "nishimura@digitalbridge.jp", score: 69, lastActivity: "2026-03-11", companySize: "180名", status: "cold" as const, signals: ["LP閲覧"] },
  { id: 7, name: "松井 彩香", company: "クリエイトビジョン", title: "マーケティングリーダー", email: "matsui@createvision.jp", score: 65, lastActivity: "2026-03-11", companySize: "60名", status: "cold" as const, signals: ["フォーム送信"] },
  { id: 8, name: "三浦 拓也", company: "ネクストジェン株式会社", title: "CIO", email: "miura@nextgen.co.jp", score: 61, lastActivity: "2026-03-10", companySize: "1200名", status: "cold" as const, signals: ["広告クリック"] },
  { id: 9, name: "吉田 真理子", company: "フロンティアソフト", title: "プロダクトマネージャー", email: "yoshida@frontiersoft.jp", score: 58, lastActivity: "2026-03-10", companySize: "90名", status: "cold" as const, signals: ["メール開封"] },
  { id: 10, name: "加藤 慎一", company: "パシフィックソリューション", title: "営業統括", email: "kato@pacificsol.jp", score: 55, lastActivity: "2026-03-09", companySize: "350名", status: "cold" as const, signals: ["SNS反応"] },
  { id: 11, name: "清水 裕子", company: "エクセルテクノ", title: "経営企画室長", email: "shimizu@exceltechno.jp", score: 50, lastActivity: "2026-03-08", companySize: "200名", status: "cold" as const, signals: ["LP閲覧"] },
  { id: 12, name: "原田 翼", company: "アドバンスシステムズ", title: "開発部長", email: "harada@advancesys.jp", score: 45, lastActivity: "2026-03-07", companySize: "150名", status: "cold" as const, signals: ["広告表示"] },
];

const aiResearch = {
  companyOverview: "テクノフューチャー株式会社は、2015年設立のSaaS企業。主にエンタープライズ向けのクラウドインフラ管理ツールを提供。従業員250名、年商約35億円。最近シリーズCで20億円の資金調達を完了。",
  recentNews: ["2026年2月 - 新プロダクト「CloudOps Pro」をリリース", "2026年1月 - シリーズC資金調達20億円を完了", "2025年12月 - アジア太平洋地域への展開を発表"],
  techStack: ["AWS", "Kubernetes", "React", "PostgreSQL", "Terraform", "Datadog"],
  competitors: ["CloudWatch", "NewRelic", "Splunk"],
};

export default function ProspectingPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);

  const [selectedProspect, setSelectedProspect] = useState(prospects[0]);
  const [scoreFilter, setScoreFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [activeView, setActiveView] = useState("all");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const savedViews = [
    { key: "all", label: "すべて" },
    { key: "hot", label: "ホット" },
    { key: "cold", label: "コールド" },
  ];

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  const filtered = prospects.filter((p) => {
    const matchSearch = p.name.includes(search) || p.company.includes(search);
    const matchScore = scoreFilter === "all" || (scoreFilter === "hot" && p.score >= 80) || (scoreFilter === "warm" && p.score >= 60 && p.score < 80) || (scoreFilter === "cold" && p.score < 60);
    const matchView = activeView === "all" || (activeView === "hot" && p.score >= 80) || (activeView === "cold" && p.score < 60);
    return matchSearch && matchScore && matchView;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortField) return 0;
    let cmp = 0;
    if (sortField === "score") cmp = a.score - b.score;
    else if (sortField === "lastActivity") cmp = a.lastActivity.localeCompare(b.lastActivity);
    else if (sortField === "name") cmp = a.name.localeCompare(b.name);
    return sortDir === "asc" ? cmp : -cmp;
  });

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[...Array(4)].map((_, i) => (<div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />))}
        </div>
        <div className="flex gap-4 mt-4">
          <div className="w-96 h-96 bg-gray-100 rounded-lg animate-pulse" />
          <div className="flex-1 h-96 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="プロスペクティングワークスペース" description="AIを活用した見込み客の調査・分析・アウトリーチを一元管理" breadcrumbs={[{ label: "ホーム", href: "/" }, { label: "セールス", href: "/sales/workspace" }, { label: "プロスペクティング" }]} />

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 px-1">
        {savedViews.map((v) => (
          <button key={v.key} onClick={() => setActiveView(v.key)} className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${activeView === v.key ? "border-[#ff4800] text-[#1f1f1f]" : "border-transparent text-gray-500 hover:text-gray-700"}`}>{v.label}</button>
        ))}
        <button className="ml-1 p-1.5 text-gray-400 hover:text-gray-600 rounded"><Plus className="h-4 w-4" /></button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatsCard label="担当プロスペクト" value="48" change={12} changeLabel="先月比" icon={Users} />
        <StatsCard label="本日送信メール" value="18" change={5} changeLabel="昨日比" icon={Mail} />
        <StatsCard label="今週のミーティング" value="7" change={23} changeLabel="先週比" icon={CalendarCheck} />
        <StatsCard label="アクティブシーケンス" value="5" change={-2} changeLabel="先月比" icon={Zap} />
      </div>

      <div className="flex gap-4">
        <Card className="w-96 shrink-0">
          <div className="border-b border-gray-200 p-4">
            <Input variant="search" placeholder="名前、会社名で検索..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <div className="mt-3 flex gap-2">
              <select className="h-8 rounded-md border border-gray-300 bg-white px-2 text-xs text-gray-700 focus:border-[#ff4800] focus:outline-none" value={scoreFilter} onChange={(e) => setScoreFilter(e.target.value)}>
                <option value="all">スコア: すべて</option>
                <option value="hot">ホット (80+)</option>
                <option value="warm">ウォーム (60-79)</option>
                <option value="cold">コールド (&lt;60)</option>
              </select>
              <button onClick={() => handleSort("score")} className="h-8 rounded-md border border-gray-300 bg-white px-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-1">
                スコア順<ArrowUpDown className="h-3 w-3" />
              </button>
            </div>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {sorted.map((prospect) => (
              <button key={prospect.id} onClick={() => setSelectedProspect(prospect)} className={`w-full border-b border-gray-100 p-4 text-left transition-colors hover:bg-gray-50 ${selectedProspect.id === prospect.id ? "bg-orange-50 border-l-2 border-l-[#ff4800]" : ""}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{prospect.name}</p>
                    <p className="text-xs text-gray-500">{prospect.title}</p>
                    <p className="text-xs text-gray-400">{prospect.company}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${prospect.score >= 80 ? "bg-[#b9cdbe] text-[#00823a]" : prospect.score >= 60 ? "bg-[#ece6d9] text-[#8a6d00]" : "bg-gray-100 text-gray-600"}`}>
                      <Star className="h-3 w-3" />{prospect.score}
                    </div>
                    <span className="text-xs text-gray-400">{prospect.lastActivity}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <div className="flex-1 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div><CardTitle>{selectedProspect.name}</CardTitle><p className="mt-1 text-sm text-gray-500">{selectedProspect.title} @ {selectedProspect.company}</p><p className="text-sm text-gray-400">{selectedProspect.email}</p></div>
                <div className="flex gap-2"><Button variant="outline" size="sm"><Mail className="h-4 w-4 mr-1" />メール</Button><Button size="sm"><Send className="h-4 w-4 mr-1" />シーケンスに追加</Button></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 rounded-lg bg-gray-50 p-4">
                <div><span className="text-xs text-gray-500">リードスコア</span><p className="text-xl font-bold text-gray-900">{selectedProspect.score}</p></div>
                <div><span className="text-xs text-gray-500">会社規模</span><p className="text-xl font-bold text-gray-900">{selectedProspect.companySize}</p></div>
                <div><span className="text-xs text-gray-500">最終アクティビティ</span><p className="text-xl font-bold text-gray-900">{selectedProspect.lastActivity}</p></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-[#ff4800]" /><CardTitle>AI リサーチサマリー</CardTitle></div></CardHeader>
            <CardContent className="space-y-4">
              <div><h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2"><Globe className="h-4 w-4" /> 企業概要</h4><p className="mt-1 text-sm text-gray-600">{aiResearch.companyOverview}</p></div>
              <div><h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2"><FileText className="h-4 w-4" /> 最近のニュース</h4><ul className="mt-1 space-y-1">{aiResearch.recentNews.map((news, i) => (<li key={i} className="flex items-start gap-2 text-sm text-gray-600"><ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-gray-400" />{news}</li>))}</ul></div>
              <div><h4 className="text-sm font-semibold text-gray-700">テックスタック</h4><div className="mt-1 flex flex-wrap gap-1.5">{aiResearch.techStack.map((tech) => (<Badge key={tech} variant="info">{tech}</Badge>))}</div></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><div className="flex items-center gap-2"><Activity className="h-5 w-5 text-[#ff4800]" /><CardTitle>エンゲージメントシグナル</CardTitle></div></CardHeader>
            <CardContent><div className="space-y-3">{selectedProspect.signals.map((signal, i) => (<div key={i} className="flex items-center gap-3 rounded-lg border border-gray-100 p-3"><div className="rounded-full bg-[#b2e9eb] p-1.5"><Eye className="h-3.5 w-3.5 text-[#2f7579]" /></div><div><p className="text-sm font-medium text-gray-900">{signal}</p><p className="text-xs text-gray-400">{selectedProspect.lastActivity}</p></div></div>))}</div></CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
