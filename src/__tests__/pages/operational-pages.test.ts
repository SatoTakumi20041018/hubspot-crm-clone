import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const readPage = (filePath: string): string => {
  return fs.readFileSync(
    path.resolve(__dirname, "../../app/(dashboard)", filePath),
    "utf-8"
  );
};

describe("Workflows Page", () => {
  const content = readPage("workflows/page.tsx");

  it("has page title", () => {
    expect(content).toContain("ワークフロー");
  });
  it("has workflow list data", () => {
    expect(content).toContain("const workflows:");
  });
  it("shows workflow name", () => {
    expect(content).toContain("wf.name");
  });
  it("shows workflow name: 新規リード自動フォローアップ", () => {
    expect(content).toContain("新規リード自動フォローアップ");
  });
  it("has workflow type: contact", () => {
    expect(content).toContain("\"contact\"");
  });
  it("has workflow type: deal", () => {
    expect(content).toContain("\"deal\"");
  });
  it("has workflow type: ticket", () => {
    expect(content).toContain("\"ticket\"");
  });
  it("has workflow type: company", () => {
    expect(content).toContain("\"company\"");
  });
  it("has type label: コンタクト", () => {
    expect(content).toContain("コンタクト");
  });
  it("has type label: 取引", () => {
    expect(content).toContain("取引");
  });
  it("has type label: チケット", () => {
    expect(content).toContain("チケット");
  });
  it("has type label: 会社", () => {
    expect(content).toContain("会社");
  });
  it("has active status", () => {
    expect(content).toContain("有効");
  });
  it("has inactive status", () => {
    expect(content).toContain("無効");
  });
  it("shows enrolled count", () => {
    expect(content).toContain("登録数:");
  });
  it("shows enrollment data", () => {
    expect(content).toContain("wf.enrolledCount");
  });
  it("has visual flow preview with trigger", () => {
    expect(content).toContain("wf.trigger");
  });
  it("has visual flow preview with actions", () => {
    expect(content).toContain("wf.actions.map");
  });
  it("has ArrowRight connector between steps", () => {
    expect(content).toContain("ArrowRight");
  });
  it("has create button", () => {
    expect(content).toContain("ワークフロー作成");
  });
  it("has search input", () => {
    expect(content).toContain("ワークフロー名で検索");
  });
  it("has type filter", () => {
    expect(content).toContain("filterType");
  });
  it("has status filter", () => {
    expect(content).toContain("filterStatus");
  });
  it("has toggle switch for active/inactive", () => {
    expect(content).toContain("translate-x-6");
  });
  it("shows last modified date", () => {
    expect(content).toContain("最終更新:");
  });
  it("has Zap icon", () => {
    expect(content).toContain("Zap");
  });
  it("has at least 8 workflows", () => {
    const matches = content.match(/id: "wf\d+"/g);
    expect(matches!.length).toBeGreaterThanOrEqual(8);
  });
  it("has Play icon for trigger", () => {
    expect(content).toContain("Play");
  });
  it("shows workflow count in description", () => {
    expect(content).toContain("件のワークフロー");
  });
  it("shows active count in description", () => {
    expect(content).toContain("件が有効");
  });
});

describe("Dashboards Page", () => {
  const content = readPage("dashboards/page.tsx");

  it("has page title", () => {
    expect(content).toContain("ダッシュボード");
  });
  it("has dashboard data", () => {
    expect(content).toContain("const dashboards:");
  });
  it("has widget grid preview", () => {
    expect(content).toContain("dashboard.widgets");
  });
  it("has widget type: chart", () => {
    expect(content).toContain('"chart"');
  });
  it("has widget type: number", () => {
    expect(content).toContain('"number"');
  });
  it("has widget type: table", () => {
    expect(content).toContain('"table"');
  });
  it("has widget type: funnel", () => {
    expect(content).toContain('"funnel"');
  });
  it("has widget type config", () => {
    expect(content).toContain("const widgetTypeConfig");
  });
  it("has create button", () => {
    expect(content).toContain("ダッシュボード作成");
  });
  it("has favorites filter", () => {
    expect(content).toContain("お気に入り");
  });
  it("has shared filter", () => {
    expect(content).toContain("共有");
  });
  it("has Star icon for favorites", () => {
    expect(content).toContain("Star");
  });
  it("shows widget count", () => {
    expect(content).toContain("ウィジェット");
  });
  it("shows last viewed date", () => {
    expect(content).toContain("dashboard.lastViewed");
  });
  it("shows created by", () => {
    expect(content).toContain("dashboard.createdBy");
  });
  it("has LayoutDashboard icon", () => {
    expect(content).toContain("LayoutDashboard");
  });
  it("has at least 4 dashboards", () => {
    const matches = content.match(/id: "db\d+"/g);
    expect(matches!.length).toBeGreaterThanOrEqual(4);
  });
  it("shows widget values", () => {
    expect(content).toContain("widget.value");
  });
  it("has BarChart3 icon for chart widgets", () => {
    expect(content).toContain("BarChart3");
  });
  it("has Hash icon for number widgets", () => {
    expect(content).toContain("Hash");
  });
  it("has Table2 icon for table widgets", () => {
    expect(content).toContain("Table2");
  });
});

describe("Data Quality Page", () => {
  const content = readPage("data-quality/page.tsx");

  it("has page title", () => {
    expect(content).toContain("データクオリティ");
  });
  it("has quality score", () => {
    expect(content).toContain("データ品質スコア");
  });
  it("has overall score value", () => {
    expect(content).toContain("const overallScore = 82");
  });
  it("has issues list", () => {
    expect(content).toContain("データ品質の問題");
  });
  it("has issues data", () => {
    expect(content).toContain("const issues:");
  });
  it("has issue type: 重複", () => {
    expect(content).toContain('"重複"');
  });
  it("has issue type: 欠損", () => {
    expect(content).toContain('"欠損"');
  });
  it("has issue type: フォーマット", () => {
    expect(content).toContain('"フォーマット"');
  });
  it("has issue type: 不整合", () => {
    expect(content).toContain('"不整合"');
  });
  it("has issue object: コンタクト", () => {
    expect(content).toContain('"コンタクト"');
  });
  it("has issue object: 会社", () => {
    expect(content).toContain('"会社"');
  });
  it("has issue object: 取引", () => {
    expect(content).toContain('"取引"');
  });
  it("shows issue count", () => {
    expect(content).toContain("issue.count");
  });
  it("shows issue priority", () => {
    expect(content).toContain("issue.priority");
  });
  it("shows issue description", () => {
    expect(content).toContain("issue.description");
  });
  it("has auto-fixable indicator", () => {
    expect(content).toContain("autoFixable");
  });
  it("has automation rules", () => {
    expect(content).toContain("自動化ルール");
  });
  it("has automation rules data", () => {
    expect(content).toContain("const automationRules");
  });
  it("shows rule name", () => {
    expect(content).toContain("rule.name");
  });
  it("shows rule status", () => {
    expect(content).toContain("rule.status");
  });
  it("shows rule last run", () => {
    expect(content).toContain("rule.lastRun");
  });
  it("shows rule fixed count", () => {
    expect(content).toContain("rule.fixed");
  });
  it("has object health data", () => {
    expect(content).toContain("const objectHealth");
  });
  it("shows object health score", () => {
    expect(content).toContain("obj.score");
  });
  it("has auto-fix button", () => {
    expect(content).toContain("自動修正を実行");
  });
  it("has at least 7 issues", () => {
    const matches = content.match(/id: "dq\d+"/g);
    expect(matches!.length).toBeGreaterThanOrEqual(7);
  });
});

describe("Goals Page", () => {
  const content = readPage("goals/page.tsx");

  it("has page title", () => {
    expect(content).toContain("ゴール");
  });
  it("has goal data", () => {
    expect(content).toContain("const goals:");
  });
  it("has goal type: revenue", () => {
    expect(content).toContain('"revenue"');
  });
  it("has goal type: deals", () => {
    expect(content).toContain('"deals"');
  });
  it("has goal type: calls", () => {
    expect(content).toContain('"calls"');
  });
  it("has goal type: meetings", () => {
    expect(content).toContain('"meetings"');
  });
  it("has goal type: tasks", () => {
    expect(content).toContain('"tasks"');
  });
  it("shows goal target", () => {
    expect(content).toContain("目標:");
  });
  it("shows goal current progress", () => {
    expect(content).toContain("現在:");
  });
  it("shows progress percentage", () => {
    expect(content).toContain("% 達成");
  });
  it("shows remaining amount", () => {
    expect(content).toContain("残り:");
  });
  it("shows goal owner", () => {
    expect(content).toContain("goal.owner");
  });
  it("shows goal period", () => {
    expect(content).toContain("goal.period");
  });
  it("has progress bar", () => {
    expect(content).toContain("progress");
  });
  it("has on-track badge", () => {
    expect(content).toContain("順調");
  });
  it("has attention-needed badge", () => {
    expect(content).toContain("要注意");
  });
  it("has achieved badge", () => {
    expect(content).toContain("達成");
  });
  it("has create button", () => {
    expect(content).toContain("ゴール作成");
  });
  it("has type config mapping", () => {
    expect(content).toContain("const typeConfig");
  });
  it("has formatValue function", () => {
    expect(content).toContain("const formatValue");
  });
  it("has at least 6 goals", () => {
    const matches = content.match(/id: "g\d+"/g);
    expect(matches!.length).toBeGreaterThanOrEqual(6);
  });
  it("has type label for each goal", () => {
    expect(content).toContain("config.label");
  });
});

describe("Inbox Page", () => {
  const content = readPage("inbox/page.tsx");

  it("has page title", () => {
    expect(content).toContain("受信トレイ");
  });
  it("has split panel layout", () => {
    expect(content).toContain("lg:grid-cols-3");
  });
  it("has conversation list (left panel)", () => {
    expect(content).toContain("Conversation List");
  });
  it("has conversation thread (right panel)", () => {
    expect(content).toContain("Conversation Thread");
  });
  it("has conversation data", () => {
    expect(content).toContain("const conversations:");
  });
  it("has channel filter", () => {
    expect(content).toContain("filterChannel");
  });
  it("has status filter", () => {
    expect(content).toContain("filterStatus");
  });
  it("has email channel", () => {
    expect(content).toContain('"email"');
  });
  it("has chat channel", () => {
    expect(content).toContain('"chat"');
  });
  it("has form channel", () => {
    expect(content).toContain('"form"');
  });
  it("shows Mail icon for email", () => {
    expect(content).toContain("Mail");
  });
  it("shows MessageCircle icon for chat", () => {
    expect(content).toContain("MessageCircle");
  });
  it("shows FileText icon for form", () => {
    expect(content).toContain("FileText");
  });
  it("has channel label function", () => {
    expect(content).toContain("const channelLabel");
  });
  it("shows channel label: メール", () => {
    expect(content).toContain('"メール"');
  });
  it("shows channel label: チャット", () => {
    expect(content).toContain('"チャット"');
  });
  it("shows channel label: フォーム", () => {
    expect(content).toContain('"フォーム"');
  });
  it("has open status", () => {
    expect(content).toContain("オープン");
  });
  it("has closed status", () => {
    expect(content).toContain("クローズ");
  });
  it("has unread indicator", () => {
    expect(content).toContain("conv.unread");
  });
  it("has reply box with textarea", () => {
    expect(content).toContain("メッセージを入力");
  });
  it("has send button", () => {
    expect(content).toContain("Send");
  });
  it("has attachment button", () => {
    expect(content).toContain("Paperclip");
  });
  it("shows contact name", () => {
    expect(content).toContain("selected.contact");
  });
  it("shows company name in thread", () => {
    expect(content).toContain("selected.company");
  });
  it("has message sender display", () => {
    expect(content).toContain("msg.sender");
  });
  it("has message time display", () => {
    expect(content).toContain("msg.time");
  });
  it("has agent vs customer message styling", () => {
    expect(content).toContain("msg.isAgent");
  });
  it("has selected conversation state", () => {
    expect(content).toContain("const [selectedId, setSelectedId]");
  });
  it("has open count in description", () => {
    expect(content).toContain("件のオープンな会話");
  });
  it("has at least 7 conversations", () => {
    const matches = content.match(/id: "cv\d+"/g);
    expect(matches!.length).toBeGreaterThanOrEqual(7);
  });
});
