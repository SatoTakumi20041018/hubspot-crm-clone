import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const readPage = (filePath: string): string => {
  return fs.readFileSync(
    path.resolve(__dirname, "../../app/(dashboard)", filePath),
    "utf-8"
  );
};

describe("Service Overview Page", () => {
  const content = readPage("service/page.tsx");

  // --- KPI Cards ---
  it("has open tickets KPI", () => {
    expect(content).toContain("未解決チケット");
  });
  it("has open tickets value", () => {
    expect(content).toContain('"28"');
  });
  it("has resolution time KPI", () => {
    expect(content).toContain("平均解決時間");
  });
  it("has resolution time value", () => {
    expect(content).toContain('"4.2h"');
  });
  it("has CSAT KPI", () => {
    expect(content).toContain("CSAT スコア");
  });
  it("has CSAT value", () => {
    expect(content).toContain('"92.3%"');
  });
  it("has NPS KPI", () => {
    expect(content).toContain("NPS スコア");
  });
  it("has NPS value", () => {
    expect(content).toContain('"+48"');
  });
  it("has KPI data array", () => {
    expect(content).toContain("const kpis");
  });
  it("shows positive trend with ArrowUpRight", () => {
    expect(content).toContain("ArrowUpRight");
  });
  it("shows negative trend with ArrowDownRight", () => {
    expect(content).toContain("ArrowDownRight");
  });
  it("has change percentage for each KPI", () => {
    expect(content).toContain("kpi.change");
  });

  // --- Ticket Status Distribution ---
  it("has ticket status distribution section", () => {
    expect(content).toContain("チケットステータス分布");
  });
  it("has ticket status data", () => {
    expect(content).toContain("const ticketStatusDistribution");
  });
  it("includes new status", () => {
    expect(content).toMatch(/status:.*"新規"/s);
  });
  it("includes in-progress status", () => {
    expect(content).toContain("対応中");
  });
  it("includes waiting status", () => {
    expect(content).toContain("待機中");
  });
  it("includes escalation status", () => {
    expect(content).toContain("エスカレーション");
  });
  it("includes resolved status", () => {
    expect(content).toContain("解決済み");
  });
  it("shows percentage per status", () => {
    expect(content).toContain("totalTickets");
  });

  // --- Knowledge Base Stats ---
  it("has knowledge base section", () => {
    expect(content).toContain("ナレッジベース");
  });
  it("has knowledge base stats data", () => {
    expect(content).toContain("const knowledgeBaseStats");
  });
  it("shows published article count", () => {
    expect(content).toContain('"156"');
  });
  it("shows monthly views", () => {
    expect(content).toContain('"12,450"');
  });
  it("shows average rating", () => {
    expect(content).toContain('"4.6/5.0"');
  });
  it("shows self-resolution rate", () => {
    expect(content).toContain('"34.2%"');
  });

  // --- SLA Compliance ---
  it("has SLA compliance section", () => {
    expect(content).toContain("SLA コンプライアンス");
  });
  it("has SLA data", () => {
    expect(content).toContain("const slaCompliance");
  });
  it("shows urgent SLA tier", () => {
    expect(content).toContain("緊急 (1h)");
  });
  it("shows high SLA tier", () => {
    expect(content).toContain("高 (4h)");
  });
  it("shows medium SLA tier", () => {
    expect(content).toContain("中 (24h)");
  });
  it("shows low SLA tier", () => {
    expect(content).toContain("低 (72h)");
  });
  it("shows SLA target vs actual", () => {
    expect(content).toContain("sla.target");
  });
  it("has SLA progress bar", () => {
    expect(content).toContain("sla.actual");
  });

  // --- Recent Tickets ---
  it("has recent tickets table", () => {
    expect(content).toContain("最近のチケット");
  });
  it("has recent tickets data", () => {
    expect(content).toContain("const recentTickets");
  });
  it("shows ticket ID", () => {
    expect(content).toContain("ticket.id");
  });
  it("shows ticket subject", () => {
    expect(content).toContain("ticket.subject");
  });
  it("shows ticket priority", () => {
    expect(content).toContain("ticket.priority");
  });
  it("shows ticket status", () => {
    expect(content).toContain("ticket.status");
  });
  it("shows ticket contact", () => {
    expect(content).toContain("ticket.contact");
  });
  it("shows ticket time", () => {
    expect(content).toContain("ticket.time");
  });
  it("has page title", () => {
    expect(content).toContain("サービスハブ");
  });
  it("has page description", () => {
    expect(content).toContain("カスタマーサポートの概要とパフォーマンス");
  });
});

describe("Knowledge Base Page", () => {
  const content = readPage("knowledge-base/page.tsx");

  it("has page title", () => {
    expect(content).toContain("ナレッジベース");
  });
  it("has article list table", () => {
    expect(content).toContain("<table");
  });
  it("has article data", () => {
    expect(content).toContain("const articles:");
  });
  it("has categories list", () => {
    expect(content).toContain("const categories");
  });
  it("includes CRM category", () => {
    expect(content).toContain('"CRM"');
  });
  it("includes Marketing category", () => {
    expect(content).toContain('"マーケティング"');
  });
  it("includes Troubleshooting category", () => {
    expect(content).toContain("トラブルシューティング");
  });
  it("has published status", () => {
    expect(content).toContain("公開中");
  });
  it("has draft status", () => {
    expect(content).toContain("下書き");
  });
  it("has review status", () => {
    expect(content).toContain("レビュー中");
  });
  it("has title column", () => {
    expect(content).toContain("タイトル");
  });
  it("has category column", () => {
    expect(content).toContain("カテゴリ");
  });
  it("has status column", () => {
    expect(content).toContain("ステータス");
  });
  it("has views column", () => {
    expect(content).toContain("閲覧数");
  });
  it("has helpful rating column", () => {
    expect(content).toContain("役立ち度");
  });
  it("has last updated column", () => {
    expect(content).toContain("最終更新");
  });
  it("has ThumbsUp icon for rating", () => {
    expect(content).toContain("ThumbsUp");
  });
  it("has create button", () => {
    expect(content).toContain("記事作成");
  });
  it("has search input", () => {
    expect(content).toContain("記事を検索");
  });
  it("has category sidebar", () => {
    expect(content).toContain("selectedCategory");
  });
  it("shows helpful rate percentage", () => {
    expect(content).toContain("helpfulRate");
  });
  it("has at least 10 articles", () => {
    const matches = content.match(/id: "kb\d+"/g);
    expect(matches!.length).toBeGreaterThanOrEqual(10);
  });
  it("has FolderOpen icon for categories", () => {
    expect(content).toContain("FolderOpen");
  });
});

describe("Feedback Page", () => {
  const content = readPage("feedback/page.tsx");

  it("has page title", () => {
    expect(content).toContain("フィードバック");
  });
  it("has survey list table", () => {
    expect(content).toContain("アンケート一覧");
  });
  it("has survey data", () => {
    expect(content).toContain("const surveys:");
  });
  it("has NPS type", () => {
    expect(content).toContain('"NPS"');
  });
  it("has CSAT type", () => {
    expect(content).toContain('"CSAT"');
  });
  it("has CES type", () => {
    expect(content).toContain('"CES"');
  });
  it("has NPS gauge", () => {
    expect(content).toContain("NPS 分布");
  });
  it("has NPS score display", () => {
    expect(content).toContain("+48");
  });
  it("has NPS breakdown data", () => {
    expect(content).toContain("const npsBreakdown");
  });
  it("shows promoters percentage", () => {
    expect(content).toContain("推奨者");
  });
  it("shows passives percentage", () => {
    expect(content).toContain("中立者");
  });
  it("shows detractors percentage", () => {
    expect(content).toContain("批判者");
  });
  it("has CSAT trend chart", () => {
    expect(content).toContain("CSAT トレンド");
  });
  it("has CSAT trend data", () => {
    expect(content).toContain("const csatTrend");
  });
  it("has CSAT score KPI", () => {
    expect(content).toContain("CSAT スコア");
  });
  it("has NPS score KPI", () => {
    expect(content).toContain("NPS スコア");
  });
  it("has total responses KPI", () => {
    expect(content).toContain("総回答数");
  });
  it("has response rate KPI", () => {
    expect(content).toContain("回答率");
  });
  it("has create survey button", () => {
    expect(content).toContain("アンケート作成");
  });
  it("has survey name column", () => {
    expect(content).toContain("アンケート名");
  });
  it("has type column", () => {
    expect(content).toContain("タイプ");
  });
  it("has responses column", () => {
    expect(content).toContain("回答数");
  });
  it("has score column", () => {
    expect(content).toContain("スコア");
  });
  it("has active status", () => {
    expect(content).toContain("有効");
  });
  it("has stopped status", () => {
    expect(content).toContain("停止中");
  });
  it("has at least 5 surveys", () => {
    const matches = content.match(/id: "s\d+"/g);
    expect(matches!.length).toBeGreaterThanOrEqual(5);
  });
  it("has SVG gauge element", () => {
    expect(content).toContain("<svg");
  });
});

describe("Chatflows Page", () => {
  const content = readPage("chatflows/page.tsx");

  it("has page title", () => {
    expect(content).toContain("チャットフロー");
  });
  it("has chatflow list data", () => {
    expect(content).toContain("const chatflows:");
  });
  it("has live chat type", () => {
    expect(content).toContain("ライブチャット");
  });
  it("has bot type", () => {
    expect(content).toContain("ボット");
  });
  it("has Bot icon", () => {
    expect(content).toContain("Bot");
  });
  it("has MessageCircle icon for live chat", () => {
    expect(content).toContain("MessageCircle");
  });
  it("shows conversation count", () => {
    expect(content).toContain("会話数:");
  });
  it("has enabled status", () => {
    expect(content).toContain("有効");
  });
  it("has disabled status", () => {
    expect(content).toContain("無効");
  });
  it("has bot steps preview", () => {
    expect(content).toContain("cf.steps");
  });
  it("has Zap icon for steps", () => {
    expect(content).toContain("Zap");
  });
  it("has create button", () => {
    expect(content).toContain("チャットフロー作成");
  });
  it("has bot count stat", () => {
    expect(content).toContain("ボット");
  });
  it("has live chat count stat", () => {
    expect(content).toContain("ライブチャット");
  });
  it("has total conversations stat", () => {
    expect(content).toContain("総会話数");
  });
  it("shows last active date", () => {
    expect(content).toContain("最終アクティブ:");
  });
  it("has description for each chatflow", () => {
    expect(content).toContain("cf.description");
  });
  it("has chatflow name", () => {
    expect(content).toContain("Webサイト ウェルカムボット");
  });
  it("has at least 5 chatflows", () => {
    const matches = content.match(/id: "cf\d+"/g);
    expect(matches!.length).toBeGreaterThanOrEqual(5);
  });
  it("has ArrowRight for step flow", () => {
    expect(content).toContain("ArrowRight");
  });
});
