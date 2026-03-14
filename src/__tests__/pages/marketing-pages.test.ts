import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const readPage = (filePath: string): string => {
  return fs.readFileSync(
    path.resolve(__dirname, "../../app/(dashboard)", filePath),
    "utf-8"
  );
};

describe("Marketing Overview Page", () => {
  const content = readPage("marketing/page.tsx");

  // --- KPI Cards ---
  it("has email sends KPI", () => {
    expect(content).toContain("メール送信数");
  });
  it("has sends value", () => {
    expect(content).toContain("12,450");
  });
  it("has open rate KPI", () => {
    expect(content).toContain("開封率");
  });
  it("has open rate value", () => {
    expect(content).toContain("24.8%");
  });
  it("has click rate KPI", () => {
    expect(content).toContain("クリック率");
  });
  it("has click rate value", () => {
    expect(content).toContain("4.2%");
  });
  it("has form submissions KPI", () => {
    expect(content).toContain("フォーム送信");
  });
  it("has submissions value", () => {
    expect(content).toContain("328");
  });
  it("has page views KPI", () => {
    expect(content).toContain("ランディングページ閲覧");
  });
  it("has page views value", () => {
    expect(content).toContain("8,920");
  });
  it("has KPI data array", () => {
    expect(content).toContain("const kpis");
  });
  it("has change percentages", () => {
    expect(content).toContain("+18.2%");
  });
  it("has ArrowUpRight trend icon", () => {
    expect(content).toContain("ArrowUpRight");
  });

  // --- Email Campaigns Section ---
  it("has email campaigns section", () => {
    expect(content).toContain("メールキャンペーン");
  });
  it("has campaign data", () => {
    expect(content).toContain("const emailCampaigns");
  });
  it("has campaign name column", () => {
    expect(content).toContain("キャンペーン名");
  });
  it("has status column", () => {
    expect(content).toContain("ステータス");
  });
  it("has sent date column", () => {
    expect(content).toContain("送信日");
  });
  it("has recipients column", () => {
    expect(content).toContain("送信数");
  });
  it("has open rate column", () => {
    expect(content).toContain("開封率");
  });
  it("has click rate column", () => {
    expect(content).toContain("クリック率");
  });
  it("has bounce rate column", () => {
    expect(content).toContain("バウンス率");
  });
  it("has sent status", () => {
    expect(content).toContain("送信済み");
  });
  it("has draft status", () => {
    expect(content).toContain("下書き");
  });
  it("has scheduled status", () => {
    expect(content).toContain("予約済み");
  });

  // --- Forms Section ---
  it("has forms section", () => {
    expect(content).toContain("フォーム");
  });
  it("has forms data", () => {
    expect(content).toContain("const forms");
  });
  it("shows form submissions count", () => {
    expect(content).toContain("件送信");
  });
  it("shows form views count", () => {
    expect(content).toContain("回表示");
  });
  it("shows form CVR", () => {
    expect(content).toContain("CVR");
  });

  // --- Landing Pages Section ---
  it("has landing pages section", () => {
    expect(content).toContain("ランディングページ");
  });
  it("has landing pages data", () => {
    expect(content).toContain("const landingPages");
  });
  it("shows landing page views", () => {
    expect(content).toContain("回閲覧");
  });
  it("shows landing page submissions", () => {
    expect(content).toContain("件送信");
  });
  it("shows landing page CVR", () => {
    expect(content).toContain("conversionRate");
  });
  it("has page title", () => {
    expect(content).toContain("マーケティング");
  });
  it("has view all link for campaigns", () => {
    expect(content).toContain("すべて表示");
  });
});

describe("Email Marketing Page", () => {
  const content = readPage("email/page.tsx");

  it("has page title", () => {
    expect(content).toContain("Eメールマーケティング");
  });
  it("has campaign list table", () => {
    expect(content).toContain("<table");
  });
  it("has campaign name column", () => {
    expect(content).toContain("キャンペーン名");
  });
  it("has status column", () => {
    expect(content).toContain("ステータス");
  });
  it("has open rate column", () => {
    expect(content).toContain("開封率");
  });
  it("has click rate column", () => {
    expect(content).toContain("クリック率");
  });
  it("has sent count column", () => {
    expect(content).toContain("送信数");
  });
  it("has sent date column", () => {
    expect(content).toContain("送信日");
  });
  it("has A/B test column", () => {
    expect(content).toContain("A/Bテスト");
  });
  it("has A/B test support with winner", () => {
    expect(content).toContain("campaign.abTest");
  });
  it("shows A/B test winner label", () => {
    expect(content).toContain("勝者:");
  });
  it("has FlaskConical icon for A/B test", () => {
    expect(content).toContain("FlaskConical");
  });
  it("has sent status", () => {
    expect(content).toContain("送信済み");
  });
  it("has draft status", () => {
    expect(content).toContain("下書き");
  });
  it("has scheduled status", () => {
    expect(content).toContain("予約済み");
  });
  it("has KPI - total sent", () => {
    expect(content).toContain("送信数");
  });
  it("has KPI - average open rate", () => {
    expect(content).toContain("平均開封率");
  });
  it("has KPI - average click rate", () => {
    expect(content).toContain("平均クリック率");
  });
  it("has KPI - campaign count", () => {
    expect(content).toContain("キャンペーン数");
  });
  it("has create button", () => {
    expect(content).toContain("メール作成");
  });
  it("has status filter", () => {
    expect(content).toContain("filterStatus");
  });
  it("has search input", () => {
    expect(content).toContain("キャンペーン名で検索");
  });
  it("has campaign subject line", () => {
    expect(content).toContain("campaign.subject");
  });
  it("has at least 10 campaigns", () => {
    const matches = content.match(/id: "em\d+"/g);
    expect(matches!.length).toBeGreaterThanOrEqual(10);
  });
  it("has 3 campaigns with A/B test", () => {
    const matches = content.match(/abTest:/g);
    expect(matches!.length).toBeGreaterThanOrEqual(3);
  });
});

describe("Forms Page", () => {
  const content = readPage("forms/page.tsx");

  it("has page title", () => {
    expect(content).toContain("フォーム");
  });
  it("has form list table", () => {
    expect(content).toContain("<table");
  });
  it("has form name column", () => {
    expect(content).toContain("フォーム名");
  });
  it("has type column", () => {
    expect(content).toContain("タイプ");
  });
  it("has submissions column", () => {
    expect(content).toContain("送信数");
  });
  it("has views column", () => {
    expect(content).toContain("表示数");
  });
  it("has CVR column", () => {
    expect(content).toContain("CVR");
  });
  it("has status column", () => {
    expect(content).toContain("ステータス");
  });
  it("has type: embedded", () => {
    expect(content).toContain("埋め込み");
  });
  it("has type: popup", () => {
    expect(content).toContain("ポップアップ");
  });
  it("has type: banner", () => {
    expect(content).toContain("バナー");
  });
  it("has type: standalone", () => {
    expect(content).toContain("スタンドアロン");
  });
  it("has create button", () => {
    expect(content).toContain("フォーム作成");
  });
  it("has total submissions stat", () => {
    expect(content).toContain("総送信数");
  });
  it("has total views stat", () => {
    expect(content).toContain("総表示数");
  });
  it("has average CVR stat", () => {
    expect(content).toContain("平均CVR");
  });
  it("has search input", () => {
    expect(content).toContain("フォーム名で検索");
  });
  it("has last submission column", () => {
    expect(content).toContain("最終送信");
  });
  it("has form data array", () => {
    expect(content).toContain("const forms:");
  });
  it("has at least 8 forms", () => {
    const matches = content.match(/id: "f\d+"/g);
    expect(matches!.length).toBeGreaterThanOrEqual(8);
  });
  it("has published status", () => {
    expect(content).toContain("公開中");
  });
  it("has draft status", () => {
    expect(content).toContain("下書き");
  });
  it("has MousePointerClick icon for CVR", () => {
    expect(content).toContain("MousePointerClick");
  });
});

describe("Landing Pages Page", () => {
  const content = readPage("landing-pages/page.tsx");

  it("has page title", () => {
    expect(content).toContain("ランディングページ");
  });
  it("has page list table", () => {
    expect(content).toContain("<table");
  });
  it("has title column", () => {
    expect(content).toContain("タイトル");
  });
  it("has URL display", () => {
    expect(content).toContain("page.url");
  });
  it("has status column", () => {
    expect(content).toContain("ステータス");
  });
  it("has views column", () => {
    expect(content).toContain("閲覧数");
  });
  it("has conversions column (CV数)", () => {
    expect(content).toContain("CV数");
  });
  it("has CVR column", () => {
    expect(content).toContain("CVR");
  });
  it("has last updated column", () => {
    expect(content).toContain("最終更新");
  });
  it("has published status", () => {
    expect(content).toContain("公開中");
  });
  it("has draft status", () => {
    expect(content).toContain("下書き");
  });
  it("has unpublished status", () => {
    expect(content).toContain("非公開");
  });
  it("has create button", () => {
    expect(content).toContain("ランディングページ作成");
  });
  it("has total views stat", () => {
    expect(content).toContain("総閲覧数");
  });
  it("has total conversions stat", () => {
    expect(content).toContain("総コンバージョン");
  });
  it("has average CVR stat", () => {
    expect(content).toContain("平均CVR");
  });
  it("has search input", () => {
    expect(content).toContain("ページ名、URLで検索");
  });
  it("has page data array", () => {
    expect(content).toContain("const pages:");
  });
  it("has at least 8 pages", () => {
    const matches = content.match(/id: "lp\d+"/g);
    expect(matches!.length).toBeGreaterThanOrEqual(8);
  });
  it("has ExternalLink icon for URL", () => {
    expect(content).toContain("ExternalLink");
  });
});

describe("Social Media Page", () => {
  const content = readPage("social/page.tsx");

  it("has page title", () => {
    expect(content).toContain("ソーシャルメディア");
  });
  it("has calendar view", () => {
    expect(content).toContain("ソーシャルカレンダー");
  });
  it("has post list", () => {
    expect(content).toContain("const posts:");
  });
  it("has platform filter", () => {
    expect(content).toContain("filterPlatform");
  });
  it("includes Twitter platform", () => {
    expect(content).toContain("Twitter");
  });
  it("includes Facebook platform", () => {
    expect(content).toContain("Facebook");
  });
  it("includes Instagram platform", () => {
    expect(content).toContain("Instagram");
  });
  it("includes LinkedIn platform", () => {
    expect(content).toContain("LinkedIn");
  });
  it("has published status", () => {
    expect(content).toContain("公開済み");
  });
  it("has scheduled status", () => {
    expect(content).toContain("予約済み");
  });
  it("has draft status", () => {
    expect(content).toContain("下書き");
  });
  it("has likes engagement", () => {
    expect(content).toContain("Heart");
  });
  it("has comments engagement", () => {
    expect(content).toContain("MessageCircle");
  });
  it("has shares engagement", () => {
    expect(content).toContain("Share2");
  });
  it("has impressions engagement", () => {
    expect(content).toContain("impressions");
  });
  it("has create post button", () => {
    expect(content).toContain("投稿作成");
  });
  it("has platform config", () => {
    expect(content).toContain("const platformConfig");
  });
  it("has calendar day headers", () => {
    expect(content).toContain("[\"日\", \"月\", \"火\", \"水\", \"木\", \"金\", \"土\"]");
  });
  it("has at least 10 posts", () => {
    const matches = content.match(/id: "sp\d+"/g);
    expect(matches!.length).toBeGreaterThanOrEqual(10);
  });
});

describe("Ads Page", () => {
  const content = readPage("ads/page.tsx");

  it("has page title", () => {
    expect(content).toContain("広告管理");
  });
  it("has campaign list table", () => {
    expect(content).toContain("<table");
  });
  it("has campaign name column", () => {
    expect(content).toContain("キャンペーン名");
  });
  it("has platform column", () => {
    expect(content).toContain("プラットフォーム");
  });
  it("has budget column", () => {
    expect(content).toContain("予算");
  });
  it("has spent column", () => {
    expect(content).toContain("消化額");
  });
  it("has clicks column", () => {
    expect(content).toContain("クリック");
  });
  it("has conversions column (CV)", () => {
    expect(content).toContain("CV");
  });
  it("has ROI column", () => {
    expect(content).toContain("ROI");
  });
  it("includes Google Ads platform", () => {
    expect(content).toContain("Google Ads");
  });
  it("includes Facebook Ads platform", () => {
    expect(content).toContain("Facebook Ads");
  });
  it("includes LinkedIn Ads platform", () => {
    expect(content).toContain("LinkedIn Ads");
  });
  it("includes Instagram Ads platform", () => {
    expect(content).toContain("Instagram Ads");
  });
  it("has total spent KPI", () => {
    expect(content).toContain("総消化額");
  });
  it("has total clicks KPI", () => {
    expect(content).toContain("総クリック数");
  });
  it("has total conversions KPI", () => {
    expect(content).toContain("総コンバージョン");
  });
  it("has average ROI KPI", () => {
    expect(content).toContain("平均ROI");
  });
  it("has create button", () => {
    expect(content).toContain("キャンペーン作成");
  });
  it("has performance chart", () => {
    expect(content).toContain("週間パフォーマンス推移");
  });
  it("has campaign data", () => {
    expect(content).toContain("const campaigns:");
  });
  it("has budget progress bar", () => {
    expect(content).toContain("spentPercent");
  });
  it("has at least 5 campaigns", () => {
    const matches = content.match(/id: "ad\d+"/g);
    expect(matches!.length).toBeGreaterThanOrEqual(5);
  });
  it("has active status", () => {
    expect(content).toContain("有効");
  });
  it("has stopped status", () => {
    expect(content).toContain("停止中");
  });
  it("has completed status", () => {
    expect(content).toContain("完了");
  });
});

describe("SEO Page", () => {
  const content = readPage("seo/page.tsx");

  it("has page title", () => {
    expect(content).toContain("SEO ツール");
  });
  it("has topic clusters", () => {
    expect(content).toContain("トピッククラスター");
  });
  it("has topic cluster data", () => {
    expect(content).toContain("const topicClusters");
  });
  it("includes CRM pillar topic", () => {
    expect(content).toContain("CRM導入ガイド");
  });
  it("includes MA pillar topic", () => {
    expect(content).toContain("マーケティングオートメーション");
  });
  it("shows subtopics", () => {
    expect(content).toContain("cluster.subtopics");
  });
  it("shows authority score", () => {
    expect(content).toContain("権威性");
  });
  it("shows ranking", () => {
    expect(content).toContain("順位:");
  });
  it("shows traffic", () => {
    expect(content).toContain("流入:");
  });
  it("has recommendations list", () => {
    expect(content).toContain("改善推奨事項");
  });
  it("has recommendations data", () => {
    expect(content).toContain("const recommendations");
  });
  it("shows recommendation page", () => {
    expect(content).toContain("rec.page");
  });
  it("shows recommendation issue", () => {
    expect(content).toContain("rec.issue");
  });
  it("shows recommendation priority", () => {
    expect(content).toContain("rec.priority");
  });
  it("shows recommendation status", () => {
    expect(content).toContain("rec.status");
  });
  it("shows recommendation impact", () => {
    expect(content).toContain("rec.impact");
  });
  it("has audit score", () => {
    expect(content).toContain("サイト監査スコア");
  });
  it("has audit score value", () => {
    expect(content).toContain("const auditScore = 78");
  });
  it("has organic metrics", () => {
    expect(content).toContain("const organicMetrics");
  });
  it("shows organic traffic metric", () => {
    expect(content).toContain("オーガニック流入");
  });
  it("shows average rank metric", () => {
    expect(content).toContain("平均順位");
  });
  it("shows indexed pages metric", () => {
    expect(content).toContain("インデックスページ");
  });
  it("shows backlinks metric", () => {
    expect(content).toContain("バックリンク数");
  });
  it("has error/warning/pass counts", () => {
    expect(content).toContain("エラー");
  });
  it("has warning count", () => {
    expect(content).toContain("警告");
  });
  it("has pass count", () => {
    expect(content).toContain("合格");
  });
  it("has at least 7 recommendations", () => {
    const matches = content.match(/id: "seo\d+"/g);
    expect(matches!.length).toBeGreaterThanOrEqual(7);
  });
});
