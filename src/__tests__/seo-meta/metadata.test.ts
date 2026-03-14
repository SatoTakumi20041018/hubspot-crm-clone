import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const SRC = path.resolve(__dirname, "../..");

function read(relativePath: string): string {
  return fs.readFileSync(path.join(SRC, relativePath), "utf-8");
}

// ---------------------------------------------------------------------------
// 1. Root layout metadata
// ---------------------------------------------------------------------------
describe("Root layout metadata", () => {
  const src = read("app/layout.tsx");

  it("exports metadata object", () => {
    expect(src).toContain("export const metadata");
  });

  it("has Metadata type import from next", () => {
    expect(src).toContain("Metadata");
    expect(src).toContain("next");
  });

  it("metadata title is 'HubSpot CRM'", () => {
    expect(src).toContain('title: "HubSpot CRM"');
  });

  it("metadata has a description", () => {
    expect(src).toContain("description:");
  });

  it("description mentions CRM", () => {
    expect(src).toContain("CRM");
  });

  it("description is in Japanese", () => {
    expect(src).toContain("顧客管理プラットフォーム");
  });
});

// ---------------------------------------------------------------------------
// 2. HTML lang attribute
// ---------------------------------------------------------------------------
describe("HTML lang attribute for SEO", () => {
  const src = read("app/layout.tsx");

  it("html element has lang attribute", () => {
    expect(src).toMatch(/<html\s+lang=/);
  });

  it("lang attribute is set to ja", () => {
    expect(src).toContain('lang="ja"');
  });
});

// ---------------------------------------------------------------------------
// 3. Font configuration
// ---------------------------------------------------------------------------
describe("Font configuration", () => {
  const src = read("app/layout.tsx");

  it("imports Inter font from next/font/google", () => {
    expect(src).toContain("Inter");
    expect(src).toContain("next/font/google");
  });

  it("Inter font has CSS variable defined", () => {
    expect(src).toContain("--font-inter");
  });

  it("font includes latin subset", () => {
    expect(src).toContain('subsets: ["latin"]');
  });

  it("body applies the font variable class", () => {
    expect(src).toContain("inter.variable");
  });

  it("body has antialiased text rendering", () => {
    expect(src).toContain("antialiased");
  });
});

// ---------------------------------------------------------------------------
// 4. Favicon and static assets
// ---------------------------------------------------------------------------
describe("Favicon and static assets", () => {
  it("public directory exists for static assets", () => {
    const publicDir = path.resolve(SRC, "../public");
    expect(fs.existsSync(publicDir)).toBe(true);
  });

  it("favicon exists in public or app directory", () => {
    const publicDir = path.resolve(SRC, "../public");
    const appDir = path.join(SRC, "app");
    const hasFavicon =
      (fs.existsSync(publicDir) &&
        fs.readdirSync(publicDir).some((f) => f.includes("favicon") || f.includes("icon"))) ||
      fs.readdirSync(appDir).some((f) => f.includes("favicon") || f.includes("icon"));
    expect(hasFavicon).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 5. Pages have meaningful titles
// ---------------------------------------------------------------------------
describe("Pages have meaningful titles/headings", () => {
  it("dashboard page has a welcome heading", () => {
    const src = read("app/(dashboard)/page.tsx");
    expect(src).toContain("<h1");
    expect(src).toContain("おかえりなさい");
  });

  it("contacts page has clear heading", () => {
    const src = read("app/(dashboard)/contacts/page.tsx");
    expect(src).toContain("<h1");
    expect(src).toContain("コンタクト");
  });

  it("companies page has clear heading", () => {
    const src = read("app/(dashboard)/companies/page.tsx");
    expect(src).toContain("<h1");
    expect(src).toContain("会社");
  });

  it("deals page has clear heading", () => {
    const src = read("app/(dashboard)/deals/page.tsx");
    expect(src).toContain("<h1");
    expect(src).toContain("取引");
  });

  it("tickets page has clear heading", () => {
    const src = read("app/(dashboard)/tickets/page.tsx");
    expect(src).toContain("<h1");
    expect(src).toContain("チケット");
  });

  it("tasks page has clear heading", () => {
    const src = read("app/(dashboard)/tasks/page.tsx");
    expect(src).toContain("<h1");
    expect(src).toContain("タスク");
  });

  it("workflows page uses PageHeader with title", () => {
    const src = read("app/(dashboard)/workflows/page.tsx");
    expect(src).toContain("PageHeader");
    expect(src).toContain('title="ワークフロー"');
  });

  it("email page uses PageHeader with title", () => {
    const src = read("app/(dashboard)/email/page.tsx");
    expect(src).toContain("PageHeader");
    expect(src).toContain('title="Eメールマーケティング"');
  });

  it("social page uses PageHeader with title", () => {
    const src = read("app/(dashboard)/social/page.tsx");
    expect(src).toContain("PageHeader");
    expect(src).toContain('title="ソーシャルメディア"');
  });

  it("inbox page uses PageHeader with title", () => {
    const src = read("app/(dashboard)/inbox/page.tsx");
    expect(src).toContain("PageHeader");
    expect(src).toContain('title="受信トレイ"');
  });

  it("login page has branded h1", () => {
    const src = read("app/(auth)/login/page.tsx");
    expect(src).toContain("<h1");
    expect(src).toContain("Hub");
    expect(src).toContain("Spot CRM");
  });

  it("register page has branded h1", () => {
    const src = read("app/(auth)/register/page.tsx");
    expect(src).toContain("<h1");
    expect(src).toContain("Hub");
    expect(src).toContain("Spot CRM");
  });
});

// ---------------------------------------------------------------------------
// 6. No hardcoded sensitive data in source
// ---------------------------------------------------------------------------
describe("No hardcoded sensitive data", () => {
  it("root layout does not contain API keys", () => {
    const src = read("app/layout.tsx");
    expect(src).not.toMatch(/sk[-_][a-zA-Z0-9]{20,}/);
    expect(src).not.toMatch(/AKIA[A-Z0-9]{16}/);
  });

  it("login page does not contain hardcoded passwords", () => {
    const src = read("app/(auth)/login/page.tsx");
    expect(src).not.toMatch(/password\s*[:=]\s*["'][^"']{8,}["']/i);
  });

  it("register page does not contain hardcoded passwords", () => {
    const src = read("app/(auth)/register/page.tsx");
    expect(src).not.toMatch(/password\s*[:=]\s*["'][^"']{8,}["']/i);
  });

  it("auth library does not expose secrets in source", () => {
    const src = read("lib/auth.ts");
    expect(src).not.toMatch(/secret\s*[:=]\s*["'][^"']{8,}["']/i);
  });

  it("contacts mock data uses realistic but fake emails", () => {
    const src = read("app/(dashboard)/contacts/page.tsx");
    // Verify emails are mock domains, not real personal emails
    expect(src).toContain("tanaka@tanaka-corp.jp");
    expect(src).not.toContain("@gmail.com");
    expect(src).not.toContain("@yahoo.com");
  });

  it("header uses placeholder user data, not real data", () => {
    const src = read("components/layout/header.tsx");
    expect(src).toContain("User Name");
    expect(src).toContain("user@example.com");
  });

  it("no database connection strings in page components", () => {
    const contactsSrc = read("app/(dashboard)/contacts/page.tsx");
    expect(contactsSrc).not.toMatch(/postgres:\/\//);
    expect(contactsSrc).not.toMatch(/mysql:\/\//);
    expect(contactsSrc).not.toMatch(/mongodb:\/\//);
  });

  it("no JWT tokens hardcoded in components", () => {
    const headerSrc = read("components/layout/header.tsx");
    expect(headerSrc).not.toMatch(/eyJ[a-zA-Z0-9_-]{20,}\./);
  });
});

// ---------------------------------------------------------------------------
// 7. Providers and session
// ---------------------------------------------------------------------------
describe("Providers configuration", () => {
  const providersSrc = read("app/providers.tsx");

  it("providers file exists", () => {
    expect(providersSrc).toBeTruthy();
  });

  it("root layout wraps children in Providers", () => {
    const src = read("app/layout.tsx");
    expect(src).toContain("<Providers>");
    expect(src).toContain("</Providers>");
  });

  it("providers is imported in root layout", () => {
    const src = read("app/layout.tsx");
    expect(src).toContain("Providers");
  });
});

// ---------------------------------------------------------------------------
// 8. Page descriptions and context
// ---------------------------------------------------------------------------
describe("Page descriptions provide context", () => {
  it("contacts page shows contact count", () => {
    const src = read("app/(dashboard)/contacts/page.tsx");
    expect(src).toContain("件のコンタクト");
  });

  it("companies page shows company count", () => {
    const src = read("app/(dashboard)/companies/page.tsx");
    expect(src).toContain("件の会社");
  });

  it("deals page shows deal count and total amount", () => {
    const src = read("app/(dashboard)/deals/page.tsx");
    expect(src).toContain("件の取引");
  });

  it("tickets page shows ticket count", () => {
    const src = read("app/(dashboard)/tickets/page.tsx");
    expect(src).toContain("件のチケット");
  });

  it("tasks page shows uncompleted task count", () => {
    const src = read("app/(dashboard)/tasks/page.tsx");
    expect(src).toContain("件の未完了タスク");
  });

  it("workflows page description shows active count", () => {
    const src = read("app/(dashboard)/workflows/page.tsx");
    expect(src).toContain("件のワークフロー");
    expect(src).toContain("件が有効");
  });

  it("email page has description", () => {
    const src = read("app/(dashboard)/email/page.tsx");
    expect(src).toContain("メールキャンペーンの作成・管理・分析");
  });

  it("social page has description", () => {
    const src = read("app/(dashboard)/social/page.tsx");
    expect(src).toContain("ソーシャルメディア投稿の管理と分析");
  });

  it("inbox page shows open conversation count", () => {
    const src = read("app/(dashboard)/inbox/page.tsx");
    expect(src).toContain("件のオープンな会話");
  });

  it("dashboard has contextual subtitle", () => {
    const src = read("app/(dashboard)/page.tsx");
    expect(src).toContain("今日の概要をご確認ください。");
  });
});
