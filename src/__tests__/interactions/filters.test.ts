import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const SRC = path.resolve(__dirname, "../..");

function read(relativePath: string): string {
  return fs.readFileSync(path.join(SRC, relativePath), "utf-8");
}

// ---------------------------------------------------------------------------
// 1. Contacts page filters
// ---------------------------------------------------------------------------
describe("Contacts page filters", () => {
  const src = read("app/(dashboard)/contacts/page.tsx");

  it("has lifecycle stage filter options", () => {
    expect(src).toContain("lifecycleStages");
    expect(src).toContain("selectedStage");
  });

  it("lifecycle stages include MQL", () => {
    expect(src).toContain('"MQL"');
  });

  it("lifecycle stages include SQL", () => {
    expect(src).toContain('"SQL"');
  });

  it("lifecycle stages include customer (顧客)", () => {
    expect(src).toContain('"顧客"');
  });

  it("has lead status filter options", () => {
    expect(src).toContain("leadStatuses");
    expect(src).toContain("selectedStatus");
  });

  it("lead statuses include new (新規)", () => {
    expect(src).toContain('"新規"');
  });

  it("lead statuses include in-progress (進行中)", () => {
    expect(src).toContain('"進行中"');
  });

  it("has search input for contacts", () => {
    expect(src).toContain("search");
    expect(src).toContain("setSearch");
  });

  it("search filters by name, email, and company", () => {
    expect(src).toContain("c.name.toLowerCase()");
    expect(src).toContain("c.email.toLowerCase()");
    expect(src).toContain("c.company.toLowerCase()");
  });

  it("resets to page 1 when filter changes", () => {
    expect(src).toContain("setCurrentPage(1)");
  });
});

// ---------------------------------------------------------------------------
// 2. Companies page filters
// ---------------------------------------------------------------------------
describe("Companies page filters", () => {
  const src = read("app/(dashboard)/companies/page.tsx");

  it("has industry filter", () => {
    expect(src).toContain("industries");
    expect(src).toContain("selectedIndustry");
  });

  it("industries include IT/Software", () => {
    expect(src).toContain('"IT・ソフトウェア"');
  });

  it("industries include manufacturing (製造業)", () => {
    expect(src).toContain('"製造業"');
  });

  it("industries include consulting", () => {
    expect(src).toContain('"コンサルティング"');
  });

  it("has search input for companies", () => {
    expect(src).toContain("search");
    expect(src).toContain("setSearch");
  });

  it("search filters by company name and domain", () => {
    expect(src).toContain("c.name.toLowerCase()");
    expect(src).toContain("c.domain.toLowerCase()");
  });

  it("all option is available in industry filter", () => {
    expect(src).toContain('"すべて"');
  });

  it("resets page on filter change", () => {
    expect(src).toContain("setCurrentPage(1)");
  });
});

// ---------------------------------------------------------------------------
// 3. Deals page functionality
// ---------------------------------------------------------------------------
describe("Deals page functionality", () => {
  const src = read("app/(dashboard)/deals/page.tsx");

  it("has pipeline selector dropdown", () => {
    expect(src).toContain("デフォルトパイプライン");
    expect(src).toContain("エンタープライズ");
  });

  it("has board/table view toggle", () => {
    expect(src).toContain('viewMode');
    expect(src).toContain('"board"');
    expect(src).toContain('"table"');
  });

  it("board view button text is ボード", () => {
    expect(src).toContain("ボード");
  });

  it("table view button text is テーブル", () => {
    expect(src).toContain("テーブル");
  });

  it("active view mode has bg-gray-100 highlight", () => {
    expect(src).toContain("bg-gray-100 text-gray-900");
  });

  it("deals are grouped by pipeline stages", () => {
    expect(src).toContain("dealsByStage");
    expect(src).toContain("pipelineStages");
  });

  it("pipeline stages include initial meeting (初回商談)", () => {
    expect(src).toContain('"初回商談"');
  });

  it("pipeline stages include contract closed (契約締結)", () => {
    expect(src).toContain('"契約締結"');
  });

  it("pipeline stages include lost (失注)", () => {
    expect(src).toContain('"失注"');
  });
});

// ---------------------------------------------------------------------------
// 4. Tickets page filters
// ---------------------------------------------------------------------------
describe("Tickets page filters", () => {
  const src = read("app/(dashboard)/tickets/page.tsx");

  it("has status filter", () => {
    expect(src).toContain("statuses");
    expect(src).toContain("selectedStatus");
  });

  it("statuses include new (新規)", () => {
    expect(src).toContain('"新規"');
  });

  it("statuses include in-progress (対応中)", () => {
    expect(src).toContain('"対応中"');
  });

  it("statuses include resolved (解決済み)", () => {
    expect(src).toContain('"解決済み"');
  });

  it("has priority filter", () => {
    expect(src).toContain("priorities");
    expect(src).toContain("selectedPriority");
  });

  it("priorities include urgent (緊急)", () => {
    expect(src).toContain('"緊急"');
  });

  it("priorities include high (高)", () => {
    expect(src).toContain('"高"');
  });

  it("has search input for tickets", () => {
    expect(src).toContain("search");
    expect(src).toContain("setSearch");
  });

  it("search filters by subject and contact name", () => {
    expect(src).toContain("t.subject.toLowerCase()");
    expect(src).toContain("t.contact.toLowerCase()");
  });
});

// ---------------------------------------------------------------------------
// 5. Tasks page filter tabs
// ---------------------------------------------------------------------------
describe("Tasks page filter tabs", () => {
  const src = read("app/(dashboard)/tasks/page.tsx");

  it("has filter state with TaskFilter type", () => {
    expect(src).toContain("TaskFilter");
    expect(src).toContain("filter");
    expect(src).toContain("setFilter");
  });

  it("has All filter tab", () => {
    expect(src).toContain('"all"');
    expect(src).toContain('"すべて"');
  });

  it("has Today filter tab", () => {
    expect(src).toContain('"today"');
    expect(src).toContain('"今日"');
  });

  it("has Overdue filter tab", () => {
    expect(src).toContain('"overdue"');
    expect(src).toContain('"期限超過"');
  });

  it("has Upcoming filter tab", () => {
    expect(src).toContain('"upcoming"');
    expect(src).toContain('"今後"');
  });

  it("each tab shows a count badge", () => {
    expect(src).toContain("tab.count");
  });

  it("active tab has orange border and text", () => {
    expect(src).toContain("border-[#ff4800] text-[#ff4800]");
  });

  it("filter tabs are rendered with map", () => {
    expect(src).toContain("filterTabs.map");
  });
});

// ---------------------------------------------------------------------------
// 6. Workflows page filters
// ---------------------------------------------------------------------------
describe("Workflows page filters", () => {
  const src = read("app/(dashboard)/workflows/page.tsx");

  it("has type filter (contact, deal, ticket, company)", () => {
    expect(src).toContain("filterType");
    expect(src).toContain("setFilterType");
  });

  it("type filter includes コンタクト", () => {
    expect(src).toContain("<option>コンタクト</option>");
  });

  it("type filter includes 取引", () => {
    expect(src).toContain("<option>取引</option>");
  });

  it("type filter includes チケット", () => {
    expect(src).toContain("<option>チケット</option>");
  });

  it("type filter includes 会社", () => {
    expect(src).toContain("<option>会社</option>");
  });

  it("has status filter (active/inactive)", () => {
    expect(src).toContain("filterStatus");
    expect(src).toContain("setFilterStatus");
  });

  it("status filter includes 有効", () => {
    expect(src).toContain("<option>有効</option>");
  });

  it("status filter includes 無効", () => {
    expect(src).toContain("<option>無効</option>");
  });

  it("has search input for workflows", () => {
    expect(src).toContain("search");
    expect(src).toContain("setSearch");
  });
});

// ---------------------------------------------------------------------------
// 7. Email page filters
// ---------------------------------------------------------------------------
describe("Email page filters", () => {
  const src = read("app/(dashboard)/email/page.tsx");

  it("has status filter", () => {
    expect(src).toContain("filterStatus");
    expect(src).toContain("setFilterStatus");
  });

  it("status filter includes 下書き", () => {
    expect(src).toContain("<option>下書き</option>");
  });

  it("status filter includes 予約済み", () => {
    expect(src).toContain("<option>予約済み</option>");
  });

  it("status filter includes 送信済み", () => {
    expect(src).toContain("<option>送信済み</option>");
  });

  it("has search input for campaigns", () => {
    expect(src).toContain("search");
    expect(src).toContain("setSearch");
  });

  it("filters campaigns by name", () => {
    expect(src).toContain("c.name.toLowerCase().includes(search.toLowerCase())");
  });
});

// ---------------------------------------------------------------------------
// 8. Social page platform filter
// ---------------------------------------------------------------------------
describe("Social page platform filter", () => {
  const src = read("app/(dashboard)/social/page.tsx");

  it("has platform filter state", () => {
    expect(src).toContain("filterPlatform");
    expect(src).toContain("setFilterPlatform");
  });

  it("includes Twitter filter option", () => {
    expect(src).toContain('"Twitter"');
  });

  it("includes Facebook filter option", () => {
    expect(src).toContain('"Facebook"');
  });

  it("includes Instagram filter option", () => {
    expect(src).toContain('"Instagram"');
  });

  it("includes LinkedIn filter option", () => {
    expect(src).toContain('"LinkedIn"');
  });

  it("includes All (すべて) option", () => {
    expect(src).toContain('"すべて"');
  });

  it("active platform filter has distinct styling", () => {
    expect(src).toContain("bg-[#ff4800] text-white");
  });
});

// ---------------------------------------------------------------------------
// 9. Inbox page channel filter
// ---------------------------------------------------------------------------
describe("Inbox page channel filter", () => {
  const src = read("app/(dashboard)/inbox/page.tsx");

  it("has channel filter state", () => {
    expect(src).toContain("filterChannel");
    expect(src).toContain("setFilterChannel");
  });

  it("channel filter includes メール", () => {
    expect(src).toContain("<option>メール</option>");
  });

  it("channel filter includes チャット", () => {
    expect(src).toContain("<option>チャット</option>");
  });

  it("channel filter includes フォーム", () => {
    expect(src).toContain("<option>フォーム</option>");
  });

  it("has status filter (open/closed)", () => {
    expect(src).toContain("filterStatus");
  });

  it("status filter includes オープン", () => {
    expect(src).toContain("<option>オープン</option>");
  });

  it("status filter includes クローズ", () => {
    expect(src).toContain("<option>クローズ</option>");
  });

  it("filters conversations based on channel and status", () => {
    expect(src).toContain("matchChannel");
    expect(src).toContain("matchStatus");
  });
});
