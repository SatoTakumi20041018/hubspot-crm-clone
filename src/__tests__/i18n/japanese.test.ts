import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const SRC = path.resolve(__dirname, "../..");

function read(relativePath: string): string {
  return fs.readFileSync(path.join(SRC, relativePath), "utf-8");
}

// ---------------------------------------------------------------------------
// 1. HTML lang="ja"
// ---------------------------------------------------------------------------
describe("HTML lang attribute", () => {
  const layoutSrc = read("app/layout.tsx");

  it("root layout sets html lang to ja", () => {
    expect(layoutSrc).toContain('lang="ja"');
  });

  it("html element is present in root layout", () => {
    expect(layoutSrc).toContain("<html");
  });
});

// ---------------------------------------------------------------------------
// 2. Button text in Japanese
// ---------------------------------------------------------------------------
describe("Button text in Japanese", () => {
  it("login page has ログイン button", () => {
    const src = read("app/(auth)/login/page.tsx");
    expect(src).toContain("ログイン");
  });

  it("login page has loading state text ログイン中...", () => {
    const src = read("app/(auth)/login/page.tsx");
    expect(src).toContain("ログイン中...");
  });

  it("register page has アカウント作成 button", () => {
    const src = read("app/(auth)/register/page.tsx");
    expect(src).toContain("アカウント作成");
  });

  it("register page has loading state text 作成中...", () => {
    const src = read("app/(auth)/register/page.tsx");
    expect(src).toContain("作成中...");
  });

  it("contacts page has コンタクトを作成 button", () => {
    const src = read("app/(dashboard)/contacts/page.tsx");
    expect(src).toContain("コンタクトを作成");
  });

  it("companies page has 会社を作成 button", () => {
    const src = read("app/(dashboard)/companies/page.tsx");
    expect(src).toContain("会社を作成");
  });

  it("deals page has 取引を作成 button", () => {
    const src = read("app/(dashboard)/deals/page.tsx");
    expect(src).toContain("取引を作成");
  });

  it("tickets page has チケットを作成 button", () => {
    const src = read("app/(dashboard)/tickets/page.tsx");
    expect(src).toContain("チケットを作成");
  });

  it("contacts page has エクスポート button", () => {
    const src = read("app/(dashboard)/contacts/page.tsx");
    expect(src).toContain("エクスポート");
  });

  it("tasks page has 追加 button", () => {
    const src = read("app/(dashboard)/tasks/page.tsx");
    expect(src).toContain("追加");
  });
});

// ---------------------------------------------------------------------------
// 3. Page titles in Japanese
// ---------------------------------------------------------------------------
describe("Page titles in Japanese", () => {
  it("contacts page title is コンタクト", () => {
    const src = read("app/(dashboard)/contacts/page.tsx");
    expect(src).toContain("コンタクト");
  });

  it("companies page title is 会社", () => {
    const src = read("app/(dashboard)/companies/page.tsx");
    expect(src).toContain("会社");
  });

  it("deals page title is 取引", () => {
    const src = read("app/(dashboard)/deals/page.tsx");
    expect(src).toContain("取引");
  });

  it("tickets page title is チケット", () => {
    const src = read("app/(dashboard)/tickets/page.tsx");
    expect(src).toContain("チケット");
  });

  it("tasks page title is タスク", () => {
    const src = read("app/(dashboard)/tasks/page.tsx");
    expect(src).toContain("タスク");
  });

  it("workflows page title is ワークフロー", () => {
    const src = read("app/(dashboard)/workflows/page.tsx");
    expect(src).toContain("ワークフロー");
  });

  it("email page title is Eメールマーケティング", () => {
    const src = read("app/(dashboard)/email/page.tsx");
    expect(src).toContain("Eメールマーケティング");
  });

  it("social page title is ソーシャルメディア", () => {
    const src = read("app/(dashboard)/social/page.tsx");
    expect(src).toContain("ソーシャルメディア");
  });

  it("inbox page title is 受信トレイ", () => {
    const src = read("app/(dashboard)/inbox/page.tsx");
    expect(src).toContain("受信トレイ");
  });
});

// ---------------------------------------------------------------------------
// 4. Mock data uses Japanese names
// ---------------------------------------------------------------------------
describe("Mock data uses Japanese names", () => {
  const contactsSrc = read("app/(dashboard)/contacts/page.tsx");

  it("contact names are in Japanese (田中 太郎)", () => {
    expect(contactsSrc).toContain("田中 太郎");
  });

  it("contact names include 鈴木 花子", () => {
    expect(contactsSrc).toContain("鈴木 花子");
  });

  it("contact names include 山田 一郎", () => {
    expect(contactsSrc).toContain("山田 一郎");
  });

  it("company names are in Japanese", () => {
    expect(contactsSrc).toContain("田中商事株式会社");
  });

  it("company names include technology companies", () => {
    expect(contactsSrc).toContain("鈴木テクノロジー");
  });

  it("owner names are in Japanese", () => {
    expect(contactsSrc).toContain("佐藤 匠");
  });
});

// ---------------------------------------------------------------------------
// 5. Currency formatted in JPY
// ---------------------------------------------------------------------------
describe("Currency formatted in JPY", () => {
  it("companies page formats revenue with yen symbol", () => {
    const src = read("app/(dashboard)/companies/page.tsx");
    expect(src).toContain("¥");
  });

  it("companies page formats large amounts in 億 (hundred million)", () => {
    const src = read("app/(dashboard)/companies/page.tsx");
    expect(src).toContain("億");
  });

  it("companies page formats amounts in 万 (ten thousand)", () => {
    const src = read("app/(dashboard)/companies/page.tsx");
    expect(src).toContain("万");
  });

  it("deals page formats amounts with yen symbol", () => {
    const src = read("app/(dashboard)/deals/page.tsx");
    expect(src).toContain("¥");
  });

  it("dashboard page shows JPY formatted revenue", () => {
    const src = read("app/(dashboard)/page.tsx");
    expect(src).toContain("¥12,450,000");
  });

  it("dashboard pipeline values use 万 unit", () => {
    const src = read("app/(dashboard)/page.tsx");
    expect(src).toContain("万");
  });
});

// ---------------------------------------------------------------------------
// 6. Date format matches Japanese conventions
// ---------------------------------------------------------------------------
describe("Date format", () => {
  it("contacts use YYYY-MM-DD date format (ISO, common in Japan)", () => {
    const src = read("app/(dashboard)/contacts/page.tsx");
    expect(src).toMatch(/\d{4}-\d{2}-\d{2}/);
  });

  it("tasks page uses Japanese relative dates (今日)", () => {
    const src = read("app/(dashboard)/tasks/page.tsx");
    expect(src).toContain('"今日"');
  });

  it("tasks page uses Japanese relative dates (明日)", () => {
    const src = read("app/(dashboard)/tasks/page.tsx");
    expect(src).toContain('"明日"');
  });

  it("tasks page uses Japanese relative dates (昨日)", () => {
    const src = read("app/(dashboard)/tasks/page.tsx");
    expect(src).toContain('"昨日"');
  });

  it("tasks page uses Japanese date format (3月16日)", () => {
    const src = read("app/(dashboard)/tasks/page.tsx");
    expect(src).toContain("3月16日");
  });

  it("dashboard page uses Japanese relative dates (今日)", () => {
    const src = read("app/(dashboard)/page.tsx");
    expect(src).toContain("今日");
  });

  it("dashboard page uses Japanese date format with slash (2026/03/15)", () => {
    const src = read("app/(dashboard)/page.tsx");
    expect(src).toContain("2026/03/15");
  });
});

// ---------------------------------------------------------------------------
// 7. Error messages in Japanese
// ---------------------------------------------------------------------------
describe("Error messages in Japanese", () => {
  const loginSrc = read("app/(auth)/login/page.tsx");
  const registerSrc = read("app/(auth)/register/page.tsx");

  it("login: email required message in Japanese", () => {
    expect(loginSrc).toContain("メールアドレスを入力してください");
  });

  it("login: password required message in Japanese", () => {
    expect(loginSrc).toContain("パスワードを入力してください");
  });

  it("login: failed login message in Japanese", () => {
    expect(loginSrc).toContain("ログインに失敗しました");
  });

  it("register: name required message in Japanese", () => {
    expect(registerSrc).toContain("名前を入力してください");
  });

  it("register: email required message in Japanese", () => {
    expect(registerSrc).toContain("メールアドレスを入力してください");
  });

  it("register: password required message in Japanese", () => {
    expect(registerSrc).toContain("パスワードを入力してください");
  });

  it("register: password length message in Japanese", () => {
    expect(registerSrc).toContain("パスワードは8文字以上で入力してください");
  });

  it("register: password mismatch message in Japanese", () => {
    expect(registerSrc).toContain("パスワードが一致しません");
  });

  it("register: account creation failed message in Japanese", () => {
    expect(registerSrc).toContain("アカウント作成に失敗しました");
  });
});

// ---------------------------------------------------------------------------
// 8. Navigation and UI labels
// ---------------------------------------------------------------------------
describe("Navigation and UI labels", () => {
  it("login page subtitle is アカウントにログイン", () => {
    const src = read("app/(auth)/login/page.tsx");
    expect(src).toContain("アカウントにログイン");
  });

  it("register page subtitle is 新しいアカウントを作成", () => {
    const src = read("app/(auth)/register/page.tsx");
    expect(src).toContain("新しいアカウントを作成");
  });

  it("login form has メールアドレス label", () => {
    const src = read("app/(auth)/login/page.tsx");
    expect(src).toContain("メールアドレス");
  });

  it("login form has パスワード label", () => {
    const src = read("app/(auth)/login/page.tsx");
    expect(src).toContain("パスワード");
  });

  it("register form has 名前 label", () => {
    const src = read("app/(auth)/register/page.tsx");
    expect(src).toContain("名前");
  });

  it("register form has パスワード（確認）label", () => {
    const src = read("app/(auth)/register/page.tsx");
    expect(src).toContain("パスワード（確認）");
  });

  it("register placeholder uses Japanese name format", () => {
    const src = read("app/(auth)/register/page.tsx");
    expect(src).toContain("山田 太郎");
  });

  it("dashboard welcome message is in Japanese", () => {
    const src = read("app/(dashboard)/page.tsx");
    expect(src).toContain("おかえりなさい、佐藤さん");
  });

  it("dashboard has Japanese section titles", () => {
    const src = read("app/(dashboard)/page.tsx");
    expect(src).toContain("最近のアクティビティ");
    expect(src).toContain("取引パイプライン");
    expect(src).toContain("最近のコンタクト");
  });

  it("root layout description is in Japanese", () => {
    const src = read("app/layout.tsx");
    expect(src).toContain("HubSpot CRM クローン - 顧客管理プラットフォーム");
  });
});
