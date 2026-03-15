"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import {
  Mail,
  MessageCircle,
  FileText,
  Clock,
  User,
  Send,
  Paperclip,
  Filter,
  Plus,
} from "lucide-react";

type Channel = "email" | "chat" | "form";

interface Conversation {
  id: string;
  contact: string;
  company: string;
  channel: Channel;
  lastMessage: string;
  status: "open" | "closed";
  unread: boolean;
  time: string;
  assignee: string;
  messages: { sender: string; text: string; time: string; isAgent: boolean }[];
}

const conversations: Conversation[] = [
  { id: "cv1", contact: "田中 太郎", company: "田中商事株式会社", channel: "email", lastMessage: "見積書の件、確認いたしました。いくつか質問がございます。", status: "open", unread: true, time: "10分前", assignee: "佐藤 匠", messages: [{ sender: "田中 太郎", text: "お世話になっております。先日の打ち合わせの件でご連絡いたします。", time: "09:30", isAgent: false }, { sender: "佐藤 匠", text: "ご連絡ありがとうございます。見積書をお送りいたします。", time: "10:15", isAgent: true }, { sender: "田中 太郎", text: "見積書の件、確認いたしました。いくつか質問がございます。", time: "11:30", isAgent: false }] },
  { id: "cv2", contact: "鈴木 花子", company: "鈴木テクノロジー", channel: "chat", lastMessage: "クラウド移行について詳しく教えていただけますか？", status: "open", unread: true, time: "30分前", assignee: "佐藤 匠", messages: [{ sender: "鈴木 花子", text: "こんにちは。クラウド移行について詳しく教えていただけますか？", time: "10:45", isAgent: false }] },
  { id: "cv3", contact: "山田 一郎", company: "ABC株式会社", channel: "form", lastMessage: "お問い合わせフォームから送信: CRM導入について相談したい", status: "open", unread: false, time: "1時間前", assignee: "佐藤 匠", messages: [{ sender: "山田 一郎", text: "CRM導入について相談したいです。現在のシステムからの移行を検討しています。", time: "09:00", isAgent: false }, { sender: "佐藤 匠", text: "お問い合わせありがとうございます。詳しいヒアリングのため、お電話のお時間をいただけますでしょうか。", time: "09:30", isAgent: true }] },
  { id: "cv4", contact: "佐々木 美咲", company: "デジタルソリューションズ", channel: "email", lastMessage: "データ分析基盤のデモ日程を調整させてください。", status: "open", unread: false, time: "2時間前", assignee: "田村 愛", messages: [{ sender: "佐々木 美咲", text: "データ分析基盤のデモ日程を調整させてください。来週の火曜日は可能でしょうか？", time: "08:15", isAgent: false }, { sender: "佐藤 匠", text: "来週火曜日10:00で調整可能です。Teamsでのデモでよろしいでしょうか？", time: "08:45", isAgent: true }] },
  { id: "cv5", contact: "高橋 健一", company: "東京マーケティング", channel: "chat", lastMessage: "料金プランについて教えてください。", status: "closed", unread: false, time: "3時間前", assignee: "田村 愛", messages: [{ sender: "高橋 健一", text: "料金プランについて教えてください。", time: "07:00", isAgent: false }, { sender: "田村 愛", text: "こちらが料金プランの比較表です。ご質問があればお気軽にどうぞ。", time: "07:15", isAgent: true }, { sender: "高橋 健一", text: "ありがとうございます。検討して改めてご連絡します。", time: "07:30", isAgent: false }] },
  { id: "cv6", contact: "伊藤 さくら", company: "イノベーション株式会社", channel: "email", lastMessage: "セキュリティ監査の報告書を送付いたします。", status: "open", unread: true, time: "4時間前", assignee: "佐藤 匠", messages: [{ sender: "佐藤 匠", text: "セキュリティ監査の報告書を送付いたします。ご確認ください。", time: "06:30", isAgent: true }] },
  { id: "cv7", contact: "渡辺 大輔", company: "グローバルシステム", channel: "email", lastMessage: "基幹システムの要件定義書のレビューをお願いします。", status: "open", unread: false, time: "昨日", assignee: "佐藤 匠", messages: [{ sender: "渡辺 大輔", text: "基幹システムの要件定義書のレビューをお願いします。添付ファイルをご確認ください。", time: "昨日 16:00", isAgent: false }] },
  { id: "cv8", contact: "小林 誠", company: "フューチャーテック", channel: "form", lastMessage: "サポートリクエスト: UAT環境でのバグ報告", status: "closed", unread: false, time: "昨日", assignee: "田村 愛", messages: [{ sender: "小林 誠", text: "UAT環境でバグを見つけました。画面のスクリーンショットを添付します。", time: "昨日 14:00", isAgent: false }, { sender: "佐藤 匠", text: "ご報告ありがとうございます。開発チームで確認し、本日中に修正いたします。", time: "昨日 14:30", isAgent: true }, { sender: "佐藤 匠", text: "修正が完了しました。ご確認をお願いいたします。", time: "昨日 17:00", isAgent: true }] },
];

const channelIcon = (channel: Channel) => {
  switch (channel) {
    case "email": return <Mail className="h-4 w-4 text-blue-500" />;
    case "chat": return <MessageCircle className="h-4 w-4 text-green-500" />;
    case "form": return <FileText className="h-4 w-4 text-orange-500" />;
  }
};

const channelLabel = (channel: Channel) => {
  switch (channel) {
    case "email": return "メール";
    case "chat": return "チャット";
    case "form": return "フォーム";
  }
};

export default function InboxPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, []);

  const [selectedId, setSelectedId] = useState(conversations[0].id);
  const [filterChannel, setFilterChannel] = useState<string>("すべて");
  const [filterStatus, setFilterStatus] = useState<string>("すべて");
  const [search, setSearch] = useState("");
  const [activeView, setActiveView] = useState("all");

  const savedViews = [
    { key: "all", label: "すべて" },
    { key: "unread", label: "未読" },
    { key: "assigned", label: "割り当て済み" },
  ];

  const filtered = conversations.filter((c) => {
    const matchChannel = filterChannel === "すべて" || channelLabel(c.channel) === filterChannel;
    const matchStatus = filterStatus === "すべて" || (filterStatus === "オープン" && c.status === "open") || (filterStatus === "クローズ" && c.status === "closed");
    const matchSearch = search === "" || c.contact.includes(search) || c.company.includes(search) || c.lastMessage.includes(search);
    const matchView = activeView === "all" || (activeView === "unread" && c.unread) || (activeView === "assigned" && c.assignee === "佐藤 匠");
    return matchChannel && matchStatus && matchSearch && matchView;
  });

  const selected = conversations.find((c) => c.id === selectedId) || conversations[0];

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
        <div className="grid grid-cols-3 gap-4 mt-6" style={{ height: "400px" }}>
          <div className="bg-gray-100 rounded-lg animate-pulse" />
          <div className="col-span-2 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="受信トレイ"
        description={`${conversations.filter((c) => c.status === "open").length}件のオープンな会話`}
      />

      {/* Saved View Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 px-1">
        {savedViews.map((v) => (
          <button key={v.key} onClick={() => setActiveView(v.key)} className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${activeView === v.key ? "border-[#ff4800] text-[#1f1f1f]" : "border-transparent text-gray-500 hover:text-gray-700"}`}>{v.label}</button>
        ))}
        <button className="ml-1 p-1.5 text-gray-400 hover:text-gray-600 rounded"><Plus className="h-4 w-4" /></button>
      </div>

      <div className="grid grid-cols-1 gap-0 lg:grid-cols-3" style={{ height: "calc(100vh - 260px)" }}>
        {/* Left: Conversation List */}
        <Card className="lg:col-span-1 rounded-r-none overflow-hidden flex flex-col">
          {/* Search and Filters */}
          <div className="p-3 border-b border-gray-200 space-y-2">
            <Input variant="search" placeholder="名前、会社、メッセージで検索..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select className="h-8 rounded border border-gray-300 bg-white px-2 text-xs text-gray-700" value={filterChannel} onChange={(e) => setFilterChannel(e.target.value)}>
                <option>すべて</option>
                <option>メール</option>
                <option>チャット</option>
                <option>フォーム</option>
              </select>
              <select className="h-8 rounded border border-gray-300 bg-white px-2 text-xs text-gray-700" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option>すべて</option>
                <option>オープン</option>
                <option>クローズ</option>
              </select>
            </div>
          </div>

          {/* Conversation Items */}
          <div className="overflow-y-auto flex-1">
            {filtered.map((conv) => (
              <button key={conv.id} onClick={() => setSelectedId(conv.id)} className={`w-full text-left p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${selectedId === conv.id ? "bg-[#FFF1ED] border-l-2 border-l-[#ff4800]" : ""} ${conv.unread ? "bg-blue-50/50" : ""}`}>
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#ff4800] text-xs font-medium text-white">{conv.contact.charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-sm ${conv.unread ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>{conv.contact}</span>
                      <span className="text-[10px] text-gray-400">{conv.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {channelIcon(conv.channel)}
                      <span className="text-xs text-gray-500">{conv.company}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unread && (<div className="h-2 w-2 rounded-full bg-[#ff4800] flex-shrink-0 mt-2" />)}
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Right: Conversation Thread */}
        <Card className="lg:col-span-2 rounded-l-none border-l-0 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff4800] text-sm font-medium text-white">{selected.contact.charAt(0)}</div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{selected.contact}</h3>
                  <p className="text-xs text-gray-500">{selected.company}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {channelIcon(selected.channel)}
                <Badge variant={selected.status === "open" ? "success" : "default"}>{selected.status === "open" ? "オープン" : "クローズ"}</Badge>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {selected.messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.isAgent ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] rounded-lg p-3 ${msg.isAgent ? "bg-[#ff4800] text-white" : "bg-gray-100 text-gray-900"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium ${msg.isAgent ? "text-white/80" : "text-gray-500"}`}>{msg.sender}</span>
                    <span className={`text-[10px] ${msg.isAgent ? "text-white/60" : "text-gray-400"}`}>{msg.time}</span>
                  </div>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <textarea className="w-full rounded-md border border-gray-300 p-3 text-sm resize-none focus:border-[#ff4800] focus:outline-none focus:ring-1 focus:ring-[#ff4800]" rows={2} placeholder="メッセージを入力..." />
              </div>
              <div className="flex items-center gap-1">
                <button className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"><Paperclip className="h-4 w-4" /></button>
                <button className="rounded-md bg-[#ff4800] p-2 text-white hover:bg-[#e64200]"><Send className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
