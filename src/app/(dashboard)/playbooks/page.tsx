"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  {
    id: "pb1",
    name: "ディスカバリーコール",
    category: "初回商談",
    usageCount: 145,
    lastUsed: "2026-03-14",
    createdBy: "佐藤 匠",
    description: "初回のディスカバリーコールで使用する質問リストと進行ガイド",
    steps: ["自己紹介・アイスブレイク", "現在の課題ヒアリング", "ゴール・KPIの確認", "予算・タイムライン確認", "次のステップ合意"],
  },
  {
    id: "pb2",
    name: "デモンストレーション",
    category: "提案",
    usageCount: 89,
    lastUsed: "2026-03-13",
    createdBy: "佐藤 匠",
    description: "製品デモの進め方と重要なポイントをまとめたガイド",
    steps: ["アジェンダ確認", "ペインポイントの再確認", "製品デモ実施", "Q&A対応", "ROI説明", "フォローアップ合意"],
  },
  {
    id: "pb3",
    name: "競合対策ガイド",
    category: "交渉",
    usageCount: 67,
    lastUsed: "2026-03-12",
    createdBy: "田村 愛",
    description: "主要競合との比較ポイントと差別化トーク",
    steps: ["競合状況の確認", "当社の差別化ポイント提示", "顧客事例の紹介", "価格比較の説明", "決定要因の確認"],
  },
  {
    id: "pb4",
    name: "オブジェクション対応",
    category: "交渉",
    usageCount: 112,
    lastUsed: "2026-03-14",
    createdBy: "佐藤 匠",
    description: "よくある反対意見とその対処法のガイド",
    steps: ["反対意見の傾聴", "共感の表現", "具体的な回答", "事例での裏付け", "次のアクション提案"],
  },
  {
    id: "pb5",
    name: "クロージング手順",
    category: "クロージング",
    usageCount: 56,
    lastUsed: "2026-03-10",
    createdBy: "佐藤 匠",
    description: "契約締結に向けた最終確認プロセス",
    steps: ["条件の最終確認", "契約書のレビュー", "決裁者の確認", "導入スケジュール合意", "契約書送付"],
  },
  {
    id: "pb6",
    name: "オンボーディングキックオフ",
    category: "導入",
    usageCount: 34,
    lastUsed: "2026-03-08",
    createdBy: "田村 愛",
    description: "新規顧客のオンボーディング開始時のキックオフミーティングガイド",
    steps: ["チーム紹介", "プロジェクト概要説明", "マイルストーン設定", "コミュニケーション方法合意", "初回タスク割り当て"],
  },
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

export default function PlaybooksPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="プレイブック"
        description="営業プロセスのベストプラクティスを標準化"
        actions={
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            プレイブック作成
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{playbooks.length}</p>
                <p className="text-xs text-gray-500">プレイブック数</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {playbooks.reduce((s, p) => s + p.usageCount, 0)}
                </p>
                <p className="text-xs text-gray-500">総使用回数</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                <Lightbulb className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(playbooks.reduce((s, p) => s + p.usageCount, 0) / playbooks.length)}
                </p>
                <p className="text-xs text-gray-500">平均使用回数</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Playbook Cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {playbooks.map((pb) => (
          <Card key={pb.id} className="hover:border-gray-300 transition-all cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFF1ED]">
                    <BookOpen className="h-5 w-5 text-[#FF7A59]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{pb.name}</h3>
                    <Badge variant={categoryBadgeVariant(pb.category)}>{pb.category}</Badge>
                  </div>
                </div>
                <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>

              <p className="text-xs text-gray-500 mb-3">{pb.description}</p>

              {/* Steps */}
              <div className="space-y-1.5 mb-3">
                {pb.steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-[10px] font-medium text-gray-600 flex-shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-gray-600">{step}</span>
                  </div>
                ))}
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-100">
                <span className="flex items-center gap-1">
                  <CheckSquare className="h-3 w-3" />
                  使用: {pb.usageCount}回
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  最終: {pb.lastUsed}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {pb.createdBy}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
