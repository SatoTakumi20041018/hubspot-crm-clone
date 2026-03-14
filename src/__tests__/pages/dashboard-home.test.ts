import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const readPage = (filePath: string): string => {
  return fs.readFileSync(
    path.resolve(__dirname, "../../app/(dashboard)", filePath),
    "utf-8"
  );
};

describe("Dashboard Home Page", () => {
  const content = readPage("page.tsx");

  // --- Welcome Message ---
  it("has welcome message", () => {
    expect(content).toContain("おかえりなさい、佐藤さん");
  });
  it("has subtitle description", () => {
    expect(content).toContain("今日の概要をご確認ください");
  });

  // --- KPI Row ---
  it("has contacts KPI", () => {
    expect(content).toContain("コンタクト合計");
  });
  it("has contacts value", () => {
    expect(content).toContain("1,284");
  });
  it("has contacts change", () => {
    expect(content).toContain("+12.5%");
  });
  it("has deals KPI", () => {
    expect(content).toContain("進行中の取引");
  });
  it("has deals value", () => {
    expect(content).toContain('"47"');
  });
  it("has deals change", () => {
    expect(content).toContain("+8.3%");
  });
  it("has revenue KPI", () => {
    expect(content).toContain("月間売上");
  });
  it("has revenue value", () => {
    expect(content).toContain("¥12,450,000");
  });
  it("has revenue change", () => {
    expect(content).toContain("+23.1%");
  });
  it("has tickets KPI", () => {
    expect(content).toContain("未対応チケット");
  });
  it("has tickets value", () => {
    expect(content).toContain('"12"');
  });
  it("has tickets change", () => {
    expect(content).toContain("-5.2%");
  });
  it("has KPI data array", () => {
    expect(content).toContain("const kpiData");
  });
  it("has 4 KPI cards in a grid", () => {
    expect(content).toContain("lg:grid-cols-4");
  });
  it("has up trend icon", () => {
    expect(content).toContain("ArrowUpRight");
  });
  it("has down trend icon", () => {
    expect(content).toContain("ArrowDownRight");
  });
  it("shows comparison label", () => {
    expect(content).toContain("先月比");
  });

  // --- Recent Activities Timeline ---
  it("has recent activities section", () => {
    expect(content).toContain("最近のアクティビティ");
  });
  it("has recent activities data", () => {
    expect(content).toContain("const recentActivities");
  });
  it("includes email activity", () => {
    expect(content).toContain("田中 太郎にメールを送信しました");
  });
  it("includes call activity", () => {
    expect(content).toContain("鈴木 花子と通話しました");
  });
  it("includes deal activity", () => {
    expect(content).toContain("ECサイト構築案件");
  });
  it("includes meeting activity", () => {
    expect(content).toContain("山田 一郎との会議を予約しました");
  });
  it("includes note activity", () => {
    expect(content).toContain("佐々木 美咲のコンタクトにメモを追加");
  });
  it("shows activity time", () => {
    expect(content).toContain("activity.time");
  });
  it("shows activity description", () => {
    expect(content).toContain("activity.description");
  });
  it("shows activity detail", () => {
    expect(content).toContain("activity.detail");
  });
  it("has view all link for activities", () => {
    expect(content).toContain("すべて表示");
  });

  // --- Upcoming Tasks ---
  it("has upcoming tasks section", () => {
    expect(content).toContain("タスク");
  });
  it("has upcoming tasks data", () => {
    expect(content).toContain("const upcomingTasks");
  });
  it("includes follow-up task", () => {
    expect(content).toContain("田中様へフォローアップメール");
  });
  it("includes proposal task", () => {
    expect(content).toContain("鈴木商事 提案書の修正");
  });
  it("includes contract task", () => {
    expect(content).toContain("ABC株式会社 契約書の送付");
  });
  it("shows task due date", () => {
    expect(content).toContain("task.dueDate");
  });
  it("shows task priority badge", () => {
    expect(content).toContain("priorityBadge");
  });
  it("has completed task checkmark", () => {
    expect(content).toContain("CheckCircle2");
  });
  it("has incomplete task circle", () => {
    expect(content).toContain("border-2 border-gray-300");
  });
  it("has link to tasks page", () => {
    expect(content).toContain("href=\"/tasks\"");
  });

  // --- Deal Pipeline Summary ---
  it("has deal pipeline section", () => {
    expect(content).toContain("取引パイプライン");
  });
  it("has pipeline stages data", () => {
    expect(content).toContain("const pipelineStages");
  });
  it("includes initial meeting stage", () => {
    expect(content).toContain("初回商談");
  });
  it("includes proposal stage", () => {
    expect(content).toContain("提案中");
  });
  it("includes quote stage", () => {
    expect(content).toContain("見積提出");
  });
  it("includes negotiation stage", () => {
    expect(content).toContain("交渉中");
  });
  it("includes closed won stage", () => {
    expect(content).toContain("契約締結");
  });
  it("includes lost stage", () => {
    expect(content).toContain("失注");
  });
  it("shows stage count and value", () => {
    expect(content).toContain("stage.count");
  });
  it("has pipeline bar chart", () => {
    expect(content).toContain("stage.value");
  });
  it("has link to deals page", () => {
    expect(content).toContain("href=\"/deals\"");
  });

  // --- Recent Contacts ---
  it("has recent contacts section", () => {
    expect(content).toContain("最近のコンタクト");
  });
  it("has recent contacts data", () => {
    expect(content).toContain("const recentContacts");
  });
  it("includes Tanaka contact", () => {
    expect(content).toContain("田中 太郎");
  });
  it("includes Suzuki contact", () => {
    expect(content).toContain("鈴木 花子");
  });
  it("includes Yamada contact", () => {
    expect(content).toContain("山田 一郎");
  });
  it("shows contact company", () => {
    expect(content).toContain("contact.company");
  });
  it("shows contact lifecycle stage badge", () => {
    expect(content).toContain("contact.stage");
  });
  it("has avatar for each contact", () => {
    expect(content).toContain("contact.name.charAt(0)");
  });
  it("links to contact detail", () => {
    expect(content).toContain("/contacts/${contact.id}");
  });
  it("has link to contacts page", () => {
    expect(content).toContain("href=\"/contacts\"");
  });
});
