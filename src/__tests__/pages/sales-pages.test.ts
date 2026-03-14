import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const readPage = (filePath: string): string => {
  return fs.readFileSync(
    path.resolve(__dirname, "../../app/(dashboard)", filePath),
    "utf-8"
  );
};

describe("Sales Overview Page", () => {
  const content = readPage("sales/page.tsx");

  // --- KPI Cards ---
  it("has deals KPI", () => {
    expect(content).toContain("進行中の取引");
  });
  it("has won KPI", () => {
    expect(content).toContain("今月の成約");
  });
  it("has pipeline KPI", () => {
    expect(content).toContain("パイプライン金額");
  });
  it("has win rate KPI", () => {
    expect(content).toContain("成約率");
  });
  it("has average deal size KPI", () => {
    expect(content).toContain("平均取引サイズ");
  });
  it("shows pipeline value", () => {
    expect(content).toContain("¥68.5M");
  });
  it("shows win rate value", () => {
    expect(content).toContain("28.5%");
  });
  it("has KPI change indicators", () => {
    expect(content).toContain("kpi.change");
  });
  it("has ArrowUpRight for positive trend", () => {
    expect(content).toContain("ArrowUpRight");
  });

  // --- Activity Feed ---
  it("has activity feed section", () => {
    expect(content).toContain("最近のアクティビティ");
  });
  it("has activity feed data", () => {
    expect(content).toContain("const activityFeed");
  });
  it("includes email activity", () => {
    expect(content).toContain("田中太郎へ提案書を送信");
  });
  it("includes call activity", () => {
    expect(content).toContain("鈴木花子と30分通話");
  });
  it("includes meeting activity", () => {
    expect(content).toContain("ABC株式会社とのデモ完了");
  });
  it("includes deal activity", () => {
    expect(content).toContain("ECサイト構築案件が");
  });
  it("shows activity time", () => {
    expect(content).toContain("activity.time");
  });

  // --- Leaderboard ---
  it("has leaderboard section", () => {
    expect(content).toContain("セールスリーダーボード");
  });
  it("has leaderboard data", () => {
    expect(content).toContain("const leaderboard");
  });
  it("shows person deals count", () => {
    expect(content).toContain("件成約");
  });
  it("shows person win rate", () => {
    expect(content).toContain("成約率");
  });
  it("shows Top label for first person", () => {
    expect(content).toContain("Top");
  });
  it("includes Sato in leaderboard", () => {
    expect(content).toContain("佐藤 匠");
  });
  it("includes Tamura in leaderboard", () => {
    expect(content).toContain("田村 愛");
  });

  // --- Top Deals ---
  it("has top deals table", () => {
    expect(content).toContain("トップ取引");
  });
  it("has top deals data", () => {
    expect(content).toContain("const topDeals");
  });
  it("shows deal amount column", () => {
    expect(content).toContain("金額");
  });
  it("shows deal stage column", () => {
    expect(content).toContain("ステージ");
  });
  it("shows probability column", () => {
    expect(content).toContain("確度");
  });

  // --- Upcoming Tasks in Sales ---
  it("has upcoming tasks section", () => {
    expect(content).toContain("今後のタスク");
  });
  it("has upcoming tasks data", () => {
    expect(content).toContain("const upcomingTasks");
  });
  it("shows overdue in red", () => {
    expect(content).toContain("期限超過");
  });
});

describe("Sequences Page", () => {
  const content = readPage("sequences/page.tsx");

  it("has page title", () => {
    expect(content).toContain("シーケンス");
  });
  it("has sequence list data", () => {
    expect(content).toContain("const sequences:");
  });
  it("has step preview rendering", () => {
    expect(content).toContain("seq.steps.map");
  });
  it("shows reply rate", () => {
    expect(content).toContain("返信率");
  });
  it("shows enrollment count", () => {
    expect(content).toContain("登録:");
  });
  it("shows meeting rate", () => {
    expect(content).toContain("ミーティング率");
  });
  it("has sequence name", () => {
    expect(content).toContain("新規リードアプローチ");
  });
  it("has active/inactive status", () => {
    expect(content).toContain("有効");
  });
  it("has stopped status", () => {
    expect(content).toContain("停止中");
  });
  it("has step type config", () => {
    expect(content).toContain("const stepTypeConfig");
  });
  it("has create button", () => {
    expect(content).toContain("シーケンス作成");
  });
  it("has summary stats cards", () => {
    expect(content).toContain("シーケンス数");
  });
  it("has total enrolled stat", () => {
    expect(content).toContain("総登録数");
  });
  it("has average reply rate stat", () => {
    expect(content).toContain("平均返信率");
  });
  it("has average meeting rate stat", () => {
    expect(content).toContain("平均ミーティング率");
  });
  it("has search input", () => {
    expect(content).toContain("シーケンス名で検索");
  });
  it("has at least 5 sequences", () => {
    const matches = content.match(/id: "seq\d+"/g);
    expect(matches!.length).toBeGreaterThanOrEqual(5);
  });
  it("has step count display", () => {
    expect(content).toContain("ステップ");
  });
  it("has owner info", () => {
    expect(content).toContain("担当:");
  });
});

describe("Calls Page", () => {
  const content = readPage("calls/page.tsx");

  it("has page title", () => {
    expect(content).toContain("コールログ");
  });
  it("has call history table", () => {
    expect(content).toContain("<table");
  });
  it("has direction column", () => {
    expect(content).toContain("方向");
  });
  it("has duration column", () => {
    expect(content).toContain("通話時間");
  });
  it("has outcome column", () => {
    expect(content).toContain("結果");
  });
  it("has contact column", () => {
    expect(content).toContain("コンタクト");
  });
  it("has company column", () => {
    expect(content).toContain("会社");
  });
  it("has notes column", () => {
    expect(content).toContain("メモ");
  });
  it("has date column", () => {
    expect(content).toContain("日時");
  });
  it("has recording column", () => {
    expect(content).toContain("録音");
  });
  it("shows call stats - total", () => {
    expect(content).toContain("通話合計");
  });
  it("shows call stats - avg duration", () => {
    expect(content).toContain("平均通話時間");
  });
  it("shows call stats - today", () => {
    expect(content).toContain("今日の通話");
  });
  it("has inbound/outbound direction icons", () => {
    expect(content).toContain("PhoneIncoming");
  });
  it("has outgoing icon", () => {
    expect(content).toContain("PhoneOutgoing");
  });
  it("has missed call icon", () => {
    expect(content).toContain("PhoneMissed");
  });
  it("has outcome - connected", () => {
    expect(content).toContain("接続済み");
  });
  it("has outcome - absent", () => {
    expect(content).toContain("不在");
  });
  it("has outcome - busy", () => {
    expect(content).toContain("話し中");
  });
  it("has play button for recording", () => {
    expect(content).toContain("再生");
  });
  it("has direction filter", () => {
    expect(content).toContain("filterDirection");
  });
  it("has at least 10 calls", () => {
    const matches = content.match(/id: "c\d+"/g);
    expect(matches!.length).toBeGreaterThanOrEqual(10);
  });
});

describe("Meetings Page", () => {
  const content = readPage("meetings/page.tsx");

  it("has page title", () => {
    expect(content).toContain("ミーティング");
  });
  it("has calendar view", () => {
    expect(content).toContain("カレンダー");
  });
  it("has list view", () => {
    expect(content).toContain("リスト");
  });
  it("has view toggle state", () => {
    expect(content).toContain("const [view, setView]");
  });
  it("has meeting list data", () => {
    expect(content).toContain("const meetings:");
  });
  it("has create button", () => {
    expect(content).toContain("ミーティングリンク作成");
  });
  it("has week day headers", () => {
    expect(content).toContain("const weekDates");
  });
  it("has hours array for calendar", () => {
    expect(content).toContain("const hours");
  });
  it("shows meeting title", () => {
    expect(content).toContain("meeting.title");
  });
  it("shows meeting time and duration", () => {
    expect(content).toContain("meeting.duration");
  });
  it("shows meeting location", () => {
    expect(content).toContain("meeting.location");
  });
  it("shows meeting attendees", () => {
    expect(content).toContain("meeting.attendees");
  });
  it("has internal/external type", () => {
    expect(content).toContain("外部");
  });
  it("has internal type label", () => {
    expect(content).toContain("社内");
  });
  it("has join button for video meetings", () => {
    expect(content).toContain("参加");
  });
  it("has at least 8 meetings", () => {
    const matches = content.match(/id: "m\d+"/g);
    expect(matches!.length).toBeGreaterThanOrEqual(8);
  });
});

describe("Documents Page", () => {
  const content = readPage("documents/page.tsx");

  it("has page title", () => {
    expect(content).toContain("ドキュメント");
  });
  it("has document library table", () => {
    expect(content).toContain("<table");
  });
  it("has document name column", () => {
    expect(content).toContain("ドキュメント名");
  });
  it("has type column", () => {
    expect(content).toContain("タイプ");
  });
  it("has views tracking column", () => {
    expect(content).toContain("閲覧数");
  });
  it("has last viewed column", () => {
    expect(content).toContain("最終閲覧");
  });
  it("has sharing tracking column", () => {
    expect(content).toContain("共有先");
  });
  it("has size column", () => {
    expect(content).toContain("サイズ");
  });
  it("has document data", () => {
    expect(content).toContain("const documents:");
  });
  it("has upload button", () => {
    expect(content).toContain("アップロード");
  });
  it("has search input", () => {
    expect(content).toContain("ドキュメント名で検索");
  });
  it("has Eye icon for view count", () => {
    expect(content).toContain("Eye");
  });
  it("has shared count display", () => {
    expect(content).toContain("名");
  });
  it("has at least 5 documents", () => {
    const matches = content.match(/id: "doc\d+"/g);
    expect(matches!.length).toBeGreaterThanOrEqual(5);
  });
});

describe("Quotes Page", () => {
  const content = readPage("quotes/page.tsx");

  it("has page title", () => {
    expect(content).toContain("見積書");
  });
  it("has quote list table", () => {
    expect(content).toContain("<table");
  });
  it("has Draft status", () => {
    expect(content).toContain("下書き");
  });
  it("has Pending status (送信済み)", () => {
    expect(content).toContain("送信済み");
  });
  it("has Signed status", () => {
    expect(content).toContain("署名済み");
  });
  it("has Declined status", () => {
    expect(content).toContain("辞退");
  });
  it("has Expired status", () => {
    expect(content).toContain("期限切れ");
  });
  it("shows yen amounts", () => {
    expect(content).toContain("¥");
  });
  it("shows quote number column", () => {
    expect(content).toContain("見積番号");
  });
  it("shows deal name column", () => {
    expect(content).toContain("取引名");
  });
  it("shows amount column", () => {
    expect(content).toContain("金額");
  });
  it("shows status column", () => {
    expect(content).toContain("ステータス");
  });
  it("shows expiry date column", () => {
    expect(content).toContain("有効期限");
  });
  it("shows contact column", () => {
    expect(content).toContain("コンタクト");
  });
  it("has create button", () => {
    expect(content).toContain("見積書作成");
  });
  it("has summary stats", () => {
    expect(content).toContain("見積書合計");
  });
  it("has signed amount display", () => {
    expect(content).toContain("署名済み金額");
  });
  it("has pending count", () => {
    expect(content).toContain("承認待ち");
  });
  it("has status filter", () => {
    expect(content).toContain("filterStatus");
  });
  it("has quote items data", () => {
    expect(content).toContain("items:");
  });
  it("has at least 8 quotes", () => {
    const matches = content.match(/id: "q\d+"/g);
    expect(matches!.length).toBeGreaterThanOrEqual(8);
  });
});

describe("Products Page", () => {
  const content = readPage("products/page.tsx");

  it("has page title", () => {
    expect(content).toContain("商品カタログ");
  });
  it("has product catalog table", () => {
    expect(content).toContain("<table");
  });
  it("has product name column", () => {
    expect(content).toContain("商品名");
  });
  it("has SKU column", () => {
    expect(content).toContain("SKU");
  });
  it("has category column", () => {
    expect(content).toContain("カテゴリ");
  });
  it("has price column", () => {
    expect(content).toContain("単価");
  });
  it("has billing type column", () => {
    expect(content).toContain("課金タイプ");
  });
  it("has description column", () => {
    expect(content).toContain("説明");
  });
  it("has product data", () => {
    expect(content).toContain("const products:");
  });
  it("has SKU data", () => {
    expect(content).toContain("CRM-PRO-001");
  });
  it("has yen prices", () => {
    expect(content).toContain("unitPrice");
  });
  it("has product descriptions", () => {
    expect(content).toContain("product.description");
  });
  it("has add product button", () => {
    expect(content).toContain("商品追加");
  });
  it("has category filter", () => {
    expect(content).toContain("filterCategory");
  });
  it("includes software category", () => {
    expect(content).toContain("ソフトウェア");
  });
  it("includes service category", () => {
    expect(content).toContain("サービス");
  });
  it("includes support category", () => {
    expect(content).toContain("サポート");
  });
  it("includes addon category", () => {
    expect(content).toContain("アドオン");
  });
  it("has recurring billing info", () => {
    expect(content).toContain("billingCycle");
  });
  it("has at least 10 products", () => {
    const matches = content.match(/id: "p\d+"/g);
    expect(matches!.length).toBeGreaterThanOrEqual(10);
  });
});

describe("Forecasting Page", () => {
  const content = readPage("forecasting/page.tsx");

  it("has page title", () => {
    expect(content).toContain("売上予測");
  });
  it("has quota card", () => {
    expect(content).toContain("クォータ（目標）");
  });
  it("has forecast value card", () => {
    expect(content).toContain("予測値");
  });
  it("has closed amount card", () => {
    expect(content).toContain("確定（成約済み）");
  });
  it("has attainment rate card", () => {
    expect(content).toContain("達成率");
  });
  it("has pipeline vs forecast chart title", () => {
    expect(content).toContain("パイプライン vs 予測 vs 成約");
  });
  it("has pipeline legend", () => {
    expect(content).toContain("パイプライン");
  });
  it("has forecast legend", () => {
    expect(content).toContain("予測");
  });
  it("has closed legend", () => {
    expect(content).toContain("成約");
  });
  it("has team forecast breakdown", () => {
    expect(content).toContain("チーム別予測");
  });
  it("has team data", () => {
    expect(content).toContain("const teamForecast");
  });
  it("shows person quota", () => {
    expect(content).toContain("クォータ");
  });
  it("shows person forecast", () => {
    expect(content).toContain("予測");
  });
  it("shows person closed", () => {
    expect(content).toContain("成約済み");
  });
  it("shows person pipeline", () => {
    expect(content).toContain("パイプライン");
  });
  it("shows deal count", () => {
    expect(content).toContain("案件数");
  });
  it("has attainment progress bar", () => {
    expect(content).toContain("person.attainment");
  });
  it("has period selector", () => {
    expect(content).toContain("const forecastPeriods");
  });
  it("has monthly trend chart", () => {
    expect(content).toContain("月次売上トレンド");
  });
  it("has pipeline vs forecast data", () => {
    expect(content).toContain("const pipelineVsForecast");
  });
});

describe("Playbooks Page", () => {
  const content = readPage("playbooks/page.tsx");

  it("has page title", () => {
    expect(content).toContain("プレイブック");
  });
  it("has playbook list data", () => {
    expect(content).toContain("const playbooks:");
  });
  it("has playbook name", () => {
    expect(content).toContain("ディスカバリーコール");
  });
  it("has category badge", () => {
    expect(content).toContain("pb.category");
  });
  it("shows category: 初回商談", () => {
    expect(content).toContain("初回商談");
  });
  it("shows category: 提案", () => {
    expect(content).toContain("提案");
  });
  it("shows category: 交渉", () => {
    expect(content).toContain("交渉");
  });
  it("shows category: クロージング", () => {
    expect(content).toContain("クロージング");
  });
  it("shows usage count", () => {
    expect(content).toContain("使用:");
  });
  it("shows usage tracking data", () => {
    expect(content).toContain("usageCount");
  });
  it("has create button", () => {
    expect(content).toContain("プレイブック作成");
  });
  it("has total playbook count stat", () => {
    expect(content).toContain("プレイブック数");
  });
  it("has total usage stat", () => {
    expect(content).toContain("総使用回数");
  });
  it("has average usage stat", () => {
    expect(content).toContain("平均使用回数");
  });
  it("shows playbook steps", () => {
    expect(content).toContain("pb.steps.map");
  });
  it("has at least 5 playbooks", () => {
    const matches = content.match(/id: "pb\d+"/g);
    expect(matches!.length).toBeGreaterThanOrEqual(5);
  });
});
