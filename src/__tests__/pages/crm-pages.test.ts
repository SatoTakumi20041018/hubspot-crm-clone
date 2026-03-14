import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const readPage = (filePath: string): string => {
  return fs.readFileSync(
    path.resolve(__dirname, "../../app/(dashboard)", filePath),
    "utf-8"
  );
};

describe("Contacts Page", () => {
  const content = readPage("contacts/page.tsx");

  // --- Search ---
  it("has a search input", () => {
    expect(content).toContain("variant=\"search\"");
  });
  it("search placeholder mentions name, email, company", () => {
    expect(content).toContain("名前、メール、会社名で検索");
  });
  it("has search state variable", () => {
    expect(content).toContain("const [search, setSearch] = useState");
  });

  // --- Lifecycle Stage Filter ---
  it("has lifecycle stage filter array", () => {
    expect(content).toContain("const lifecycleStages");
  });
  it("includes subscriber stage", () => {
    expect(content).toContain("サブスクライバー");
  });
  it("includes lead stage", () => {
    expect(content).toContain("リード");
  });
  it("includes MQL stage", () => {
    expect(content).toContain("MQL");
  });
  it("includes SQL stage", () => {
    expect(content).toContain("SQL");
  });
  it("includes opportunity stage", () => {
    expect(content).toContain("商談中");
  });
  it("includes customer stage", () => {
    expect(content).toContain("顧客");
  });
  it("includes evangelist stage", () => {
    expect(content).toContain("エバンジェリスト");
  });
  it("renders lifecycle filter as select", () => {
    expect(content).toContain("ライフサイクル:");
  });

  // --- Lead Status Filter ---
  it("has lead status filter array", () => {
    expect(content).toContain("const leadStatuses");
  });
  it("includes new lead status", () => {
    expect(content).toContain("新規");
  });
  it("includes open lead status", () => {
    expect(content).toContain("オープン");
  });
  it("includes in-progress lead status", () => {
    expect(content).toContain("進行中");
  });
  it("includes unresponsive lead status", () => {
    expect(content).toContain("未対応");
  });
  it("includes responded lead status", () => {
    expect(content).toContain("対応済み");
  });
  it("renders lead status filter as select", () => {
    expect(content).toContain("リードステータス:");
  });

  // --- Table columns ---
  it("has Name column header", () => {
    expect(content).toMatch(/名前/);
  });
  it("has Email column header", () => {
    expect(content).toContain("メール");
  });
  it("has Company column header", () => {
    expect(content).toContain("会社");
  });
  it("has Phone column header", () => {
    expect(content).toContain("電話番号");
  });
  it("has Lifecycle column header", () => {
    expect(content).toContain("ライフサイクル");
  });
  it("has Owner column header", () => {
    expect(content).toContain("担当者");
  });
  it("has Created Date column header", () => {
    expect(content).toContain("作成日");
  });
  it("renders a table element", () => {
    expect(content).toContain("<table");
  });
  it("renders thead", () => {
    expect(content).toContain("<thead>");
  });
  it("renders tbody", () => {
    expect(content).toContain("<tbody>");
  });

  // --- Pagination ---
  it("has pagination with ChevronLeft", () => {
    expect(content).toContain("ChevronLeft");
  });
  it("has pagination with ChevronRight", () => {
    expect(content).toContain("ChevronRight");
  });
  it("displays current page range text", () => {
    expect(content).toContain("件を表示");
  });
  it("has currentPage state", () => {
    expect(content).toContain("const [currentPage, setCurrentPage]");
  });
  it("calculates totalPages", () => {
    expect(content).toContain("totalPages");
  });
  it("has perPage constant of 10", () => {
    expect(content).toContain("const perPage = 10");
  });

  // --- Create Button ---
  it("has create contact button", () => {
    expect(content).toContain("コンタクトを作成");
  });
  it("has Plus icon for create button", () => {
    expect(content).toContain("Plus");
  });

  // --- Export ---
  it("has export button", () => {
    expect(content).toContain("エクスポート");
  });

  // --- Header ---
  it("has page title", () => {
    expect(content).toContain("コンタクト");
  });
  it("shows filtered count", () => {
    expect(content).toContain("件のコンタクト");
  });

  // --- Data ---
  it("has contact data array", () => {
    expect(content).toContain("const contacts = [");
  });
  it("includes Tanaka Taro contact", () => {
    expect(content).toContain("田中 太郎");
  });
  it("includes Suzuki Hanako contact", () => {
    expect(content).toContain("鈴木 花子");
  });
  it("includes email data", () => {
    expect(content).toContain("tanaka@tanaka-corp.jp");
  });
  it("includes phone data", () => {
    expect(content).toContain("03-1234-5678");
  });
  it("includes company data", () => {
    expect(content).toContain("田中商事株式会社");
  });
  it("includes owner data", () => {
    expect(content).toContain("佐藤 匠");
  });
  it("has sort icon ArrowUpDown", () => {
    expect(content).toContain("ArrowUpDown");
  });
  it("has filter icon", () => {
    expect(content).toContain("Filter");
  });
  it("has more actions icon", () => {
    expect(content).toContain("MoreHorizontal");
  });
  it("has checkbox for bulk selection", () => {
    expect(content).toContain("type=\"checkbox\"");
  });
  it("has link to contact detail", () => {
    expect(content).toContain("/contacts/${contact.id}");
  });
  it("has avatar rendering", () => {
    expect(content).toContain("contact.avatar");
  });
  it("has Badge component for lifecycle stage", () => {
    expect(content).toContain("Badge");
  });
  it("has stageBadgeVariant function", () => {
    expect(content).toContain("const stageBadgeVariant");
  });
  it("uses 'use client' directive", () => {
    expect(content).toContain('"use client"');
  });
  it("has at least 10 contacts", () => {
    const matches = content.match(/id: "/g);
    expect(matches).not.toBeNull();
    expect(matches!.length).toBeGreaterThanOrEqual(10);
  });
});

describe("Contact Detail Page", () => {
  const content = readPage("contacts/[id]/page.tsx");

  // --- 3-Column Layout ---
  it("has 3-column layout", () => {
    expect(content).toContain("3-Column Layout");
  });
  it("has left sidebar with w-72", () => {
    expect(content).toMatch(/w-72.*border-r/s);
  });
  it("has right sidebar with w-72", () => {
    expect(content).toMatch(/w-72.*border-l/s);
  });
  it("has middle activity section with flex-1", () => {
    expect(content).toContain("flex-1 overflow-y-auto bg-gray-50");
  });

  // --- About Section ---
  it("has About section header", () => {
    expect(content).toContain("概要");
  });
  it("shows email address label", () => {
    expect(content).toContain("メールアドレス");
  });
  it("shows phone number label", () => {
    expect(content).toContain("電話番号");
  });
  it("shows job title label", () => {
    expect(content).toContain("役職");
  });
  it("shows lifecycle stage label", () => {
    expect(content).toContain("ライフサイクルステージ");
  });
  it("shows lead status label", () => {
    expect(content).toContain("リードステータス");
  });
  it("shows owner label", () => {
    expect(content).toContain("担当者");
  });
  it("shows company link", () => {
    expect(content).toContain("会社");
  });
  it("shows created date", () => {
    expect(content).toContain("作成日");
  });
  it("shows last activity", () => {
    expect(content).toContain("最終アクティビティ");
  });
  it("has edit button icon", () => {
    expect(content).toContain("Edit3");
  });

  // --- Activity Timeline ---
  it("has activity timeline", () => {
    expect(content).toContain("const activities");
  });
  it("includes email activity", () => {
    expect(content).toContain("メール送信: 提案書のご確認について");
  });
  it("includes call activity", () => {
    expect(content).toContain("通話: 要件ヒアリング");
  });
  it("includes note activity", () => {
    expect(content).toContain("メモ追加");
  });
  it("includes task activity", () => {
    expect(content).toContain("タスク完了:");
  });
  it("shows activity user", () => {
    expect(content).toContain("activity.user");
  });
  it("shows activity date", () => {
    expect(content).toContain("activity.date");
  });

  // --- Tabs ---
  it("has Activity tab", () => {
    expect(content).toContain("アクティビティ");
  });
  it("has Notes tab", () => {
    expect(content).toContain("メモ");
  });
  it("has Emails tab", () => {
    expect(content).toContain("メール");
  });
  it("has Calls tab", () => {
    expect(content).toContain("通話");
  });
  it("has Tasks tab", () => {
    expect(content).toContain("タスク");
  });
  it("has activityTabs array", () => {
    expect(content).toContain("const activityTabs");
  });
  it("has activeTab state", () => {
    expect(content).toContain("const [activeTab, setActiveTab]");
  });

  // --- Associated Deals ---
  it("has associated deals section header", () => {
    expect(content).toContain("取引");
  });
  it("has associated deals data", () => {
    expect(content).toContain("const associatedDeals");
  });
  it("shows deal name", () => {
    expect(content).toContain("ECサイト構築案件");
  });
  it("shows deal amount", () => {
    expect(content).toContain("¥4,500,000");
  });
  it("shows deal stage", () => {
    expect(content).toContain("見積提出");
  });
  it("shows deal close date", () => {
    expect(content).toContain("クローズ予定:");
  });

  // --- Associated Tickets ---
  it("has associated tickets section header", () => {
    expect(content).toContain("チケット");
  });
  it("has associated tickets data", () => {
    expect(content).toContain("const associatedTickets");
  });
  it("shows ticket subject", () => {
    expect(content).toContain("ログイン不具合の報告");
  });
  it("shows ticket status", () => {
    expect(content).toContain("対応中");
  });
  it("shows ticket priority", () => {
    expect(content).toMatch(/priority.*高/s);
  });

  // --- Associated Companies ---
  it("has company link in right sidebar", () => {
    expect(content).toContain("会社");
  });
  it("links to company detail page", () => {
    expect(content).toContain("/companies/${contact.companyId}");
  });

  // --- Action buttons ---
  it("has email action button", () => {
    expect(content).toMatch(/Mail.*メール/s);
  });
  it("has call action button", () => {
    expect(content).toContain("PhoneCall");
  });
  it("has note action button", () => {
    expect(content).toMatch(/FileText.*メモ/s);
  });
  it("has task action button", () => {
    expect(content).toMatch(/CheckSquare.*タスク/s);
  });
  it("has back link to contacts", () => {
    expect(content).toContain("href=\"/contacts\"");
  });
  it("has add deal button", () => {
    expect(content).toContain("追加");
  });
  it("uses useParams hook", () => {
    expect(content).toContain("useParams");
  });
  it("has default contact fallback", () => {
    expect(content).toContain("const defaultContact");
  });
  it("has contactsData record", () => {
    expect(content).toContain("const contactsData");
  });
});

describe("Companies Page", () => {
  const content = readPage("companies/page.tsx");

  it("has search input", () => {
    expect(content).toContain("variant=\"search\"");
  });
  it("search placeholder mentions company and domain", () => {
    expect(content).toContain("会社名、ドメインで検索");
  });
  it("has industry filter array", () => {
    expect(content).toContain("const industries");
  });
  it("includes IT industry", () => {
    expect(content).toContain("IT・ソフトウェア");
  });
  it("includes manufacturing industry", () => {
    expect(content).toContain("製造業");
  });
  it("includes retail industry", () => {
    expect(content).toContain("小売・EC");
  });
  it("has Name column header", () => {
    expect(content).toContain("会社名");
  });
  it("has Domain column header", () => {
    expect(content).toContain("ドメイン");
  });
  it("has Industry column header", () => {
    expect(content).toContain("業界");
  });
  it("has Contacts column header", () => {
    expect(content).toContain("コンタクト数");
  });
  it("has Deals column header", () => {
    expect(content).toContain("取引数");
  });
  it("has Revenue column header", () => {
    expect(content).toContain("年間売上");
  });
  it("has City column header", () => {
    expect(content).toContain("都市");
  });
  it("has pagination", () => {
    expect(content).toContain("件を表示");
  });
  it("has create button", () => {
    expect(content).toContain("会社を作成");
  });
  it("has companies data", () => {
    expect(content).toContain("const companies = [");
  });
  it("has formatRevenue function", () => {
    expect(content).toContain("const formatRevenue");
  });
  it("has at least 10 companies", () => {
    const matches = content.match(/id: "/g);
    expect(matches!.length).toBeGreaterThanOrEqual(10);
  });
  it("has export button", () => {
    expect(content).toContain("エクスポート");
  });
  it("has Globe icon for domain", () => {
    expect(content).toContain("Globe");
  });
  it("has Building2 icon", () => {
    expect(content).toContain("Building2");
  });
});

describe("Company Detail Page", () => {
  const content = readPage("companies/[id]/page.tsx");

  it("has 3-column layout", () => {
    expect(content).toContain("3-Column Layout");
  });
  it("has About section", () => {
    expect(content).toContain("概要");
  });
  it("shows domain property", () => {
    expect(content).toContain("ドメイン");
  });
  it("shows phone property", () => {
    expect(content).toContain("電話番号");
  });
  it("shows industry property", () => {
    expect(content).toContain("業界");
  });
  it("shows description property", () => {
    expect(content).toContain("説明");
  });
  it("shows annual revenue property", () => {
    expect(content).toContain("年間売上");
  });
  it("shows employee count property", () => {
    expect(content).toContain("従業員数");
  });
  it("shows address property", () => {
    expect(content).toContain("住所");
  });
  it("has activity timeline tabs", () => {
    expect(content).toContain("const activityTabs");
  });
  it("has associated contacts section", () => {
    expect(content).toContain("コンタクト");
  });
  it("has associated deals section", () => {
    expect(content).toContain("取引");
  });
  it("has associated tickets section", () => {
    expect(content).toContain("チケット");
  });
  it("has back link to companies", () => {
    expect(content).toContain("href=\"/companies\"");
  });
  it("has activity data", () => {
    expect(content).toContain("const activities");
  });
  it("has associated contacts data", () => {
    expect(content).toContain("const associatedContacts");
  });
});

describe("Deals Page", () => {
  const content = readPage("deals/page.tsx");

  it("has board/table view toggle", () => {
    expect(content).toContain("viewMode");
  });
  it("has board view option", () => {
    expect(content).toContain("ボード");
  });
  it("has table view option", () => {
    expect(content).toContain("テーブル");
  });
  it("has LayoutGrid icon for board", () => {
    expect(content).toContain("LayoutGrid");
  });
  it("has List icon for table", () => {
    expect(content).toContain("List");
  });
  it("has Kanban columns with pipeline stages", () => {
    expect(content).toContain("const pipelineStages");
  });
  it("includes stage: 初回商談", () => {
    expect(content).toContain("初回商談");
  });
  it("includes stage: 提案中", () => {
    expect(content).toContain("提案中");
  });
  it("includes stage: 見積提出", () => {
    expect(content).toContain("見積提出");
  });
  it("includes stage: 交渉中", () => {
    expect(content).toContain("交渉中");
  });
  it("includes stage: 契約締結", () => {
    expect(content).toContain("契約締結");
  });
  it("includes stage: 失注", () => {
    expect(content).toContain("失注");
  });
  it("deal cards show deal name", () => {
    expect(content).toContain("deal.name");
  });
  it("deal cards show amount", () => {
    expect(content).toContain("formatAmount(deal.amount)");
  });
  it("deal cards show company", () => {
    expect(content).toContain("deal.company");
  });
  it("deal cards show close date", () => {
    expect(content).toContain("deal.closeDate");
  });
  it("deal cards show owner", () => {
    expect(content).toContain("deal.owner");
  });
  it("has pipeline selector", () => {
    expect(content).toContain("デフォルトパイプライン");
  });
  it("has enterprise pipeline option", () => {
    expect(content).toContain("エンタープライズ");
  });
  it("shows stage totals", () => {
    expect(content).toContain("stageGroup.total");
  });
  it("has formatAmount function", () => {
    expect(content).toContain("const formatAmount");
  });
  it("has deal probability", () => {
    expect(content).toContain("deal.probability");
  });
  it("has create deal button", () => {
    expect(content).toContain("取引を作成");
  });
  it("has stage colors mapping", () => {
    expect(content).toContain("const stageColors");
  });
  it("groups deals by stage", () => {
    expect(content).toContain("const dealsByStage");
  });
  it("has at least 10 deals", () => {
    const matches = content.match(/id: "d\d+"/g);
    expect(matches!.length).toBeGreaterThanOrEqual(10);
  });
});

describe("Tickets Page", () => {
  const content = readPage("tickets/page.tsx");

  it("has status filter", () => {
    expect(content).toContain("const statuses");
  });
  it("has priority filter", () => {
    expect(content).toContain("const priorities");
  });
  it("includes urgent priority", () => {
    expect(content).toContain("緊急");
  });
  it("includes high priority", () => {
    expect(content).toContain('"高"');
  });
  it("includes medium priority", () => {
    expect(content).toContain('"中"');
  });
  it("includes low priority", () => {
    expect(content).toContain('"低"');
  });
  it("has Subject column (件名)", () => {
    expect(content).toContain("件名");
  });
  it("has Status column", () => {
    expect(content).toContain("ステータス");
  });
  it("has Priority column", () => {
    expect(content).toContain("優先度");
  });
  it("has Contact column", () => {
    expect(content).toContain("コンタクト");
  });
  it("has Owner column", () => {
    expect(content).toContain("担当者");
  });
  it("has Date column", () => {
    expect(content).toContain("作成日");
  });
  it("has SLA column", () => {
    expect(content).toContain("SLA");
  });
  it("has stats card for open tickets", () => {
    expect(content).toContain("未解決チケット");
  });
  it("has stats card for urgent tickets", () => {
    expect(content).toContain("緊急チケット");
  });
  it("has stats card for resolution time", () => {
    expect(content).toContain("平均解決時間");
  });
  it("has ticket ID column", () => {
    expect(content).toContain("ID");
  });
  it("has pagination", () => {
    expect(content).toContain("件を表示");
  });
  it("has create button", () => {
    expect(content).toContain("チケットを作成");
  });
  it("has SLA status colors", () => {
    expect(content).toContain("slaStatus");
  });
  it("has at least 10 tickets", () => {
    const matches = content.match(/id: "TK-/g);
    expect(matches!.length).toBeGreaterThanOrEqual(10);
  });
});

describe("Tasks Page", () => {
  const content = readPage("tasks/page.tsx");

  it("has All filter tab", () => {
    expect(content).toContain("すべて");
  });
  it("has Today filter tab", () => {
    expect(content).toContain("今日");
  });
  it("has Overdue filter tab", () => {
    expect(content).toContain("期限超過");
  });
  it("has Upcoming filter tab", () => {
    expect(content).toContain("今後");
  });
  it("has filter tabs array", () => {
    expect(content).toContain("const filterTabs");
  });
  it("has quick add form input", () => {
    expect(content).toContain("新しいタスクを追加");
  });
  it("has add button", () => {
    expect(content).toContain("追加");
  });
  it("has addTask function", () => {
    expect(content).toContain("const addTask");
  });
  it("task list has checkbox toggle", () => {
    expect(content).toContain("toggleTask");
  });
  it("shows CheckCircle2 for completed", () => {
    expect(content).toContain("CheckCircle2");
  });
  it("shows Circle for incomplete", () => {
    expect(content).toContain("Circle");
  });
  it("task has title field", () => {
    expect(content).toContain("task.title");
  });
  it("task has type field (call)", () => {
    expect(content).toContain("\"call\"");
  });
  it("task has type field (email)", () => {
    expect(content).toContain("\"email\"");
  });
  it("task has type field (todo)", () => {
    expect(content).toContain("\"todo\"");
  });
  it("task has type field (follow_up)", () => {
    expect(content).toContain("\"follow_up\"");
  });
  it("task has due date", () => {
    expect(content).toContain("task.dueDateLabel");
  });
  it("task has priority badge", () => {
    expect(content).toContain("priorityBadgeVariant");
  });
  it("task has contact info", () => {
    expect(content).toContain("task.contact");
  });
  it("task has owner avatar", () => {
    expect(content).toContain("task.owner");
  });
  it("has overdue indicator", () => {
    expect(content).toContain("AlertTriangle");
  });
  it("has empty state message", () => {
    expect(content).toContain("タスクはありません");
  });
  it("has at least 10 tasks", () => {
    const matches = content.match(/id: "\d+"/g);
    expect(matches!.length).toBeGreaterThanOrEqual(10);
  });
  it("shows uncompleted task count", () => {
    expect(content).toContain("件の未完了タスク");
  });
});

describe("Lists Page", () => {
  const content = readPage("lists/page.tsx");

  it("has list table", () => {
    expect(content).toContain("<table");
  });
  it("has static type", () => {
    expect(content).toContain("静的");
  });
  it("has active (dynamic) type", () => {
    expect(content).toContain("動的");
  });
  it("has create button", () => {
    expect(content).toContain("リスト作成");
  });
  it("has list name column", () => {
    expect(content).toContain("リスト名");
  });
  it("has type column", () => {
    expect(content).toContain("タイプ");
  });
  it("has count column", () => {
    expect(content).toContain("件数");
  });
  it("has last updated column", () => {
    expect(content).toContain("最終更新");
  });
  it("has created by column", () => {
    expect(content).toContain("作成者");
  });
  it("has search input", () => {
    expect(content).toContain("リスト名で検索");
  });
  it("has filter type buttons", () => {
    expect(content).toContain("filterType");
  });
  it("has list description", () => {
    expect(content).toContain("list.description");
  });
  it("has at least 10 lists", () => {
    const matches = content.match(/id: "l\d+"/g);
    expect(matches!.length).toBeGreaterThanOrEqual(10);
  });
  it("shows Zap icon for dynamic lists", () => {
    expect(content).toContain("Zap");
  });
  it("has list data array", () => {
    expect(content).toContain("const lists:");
  });
});
