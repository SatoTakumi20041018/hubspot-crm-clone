import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const SRC = path.resolve(__dirname, "../..");

function read(relativePath: string): string {
  return fs.readFileSync(path.join(SRC, relativePath), "utf-8");
}

// ---------------------------------------------------------------------------
// 1. Button hover/active/disabled states
// ---------------------------------------------------------------------------
describe("Button hover/active/disabled states", () => {
  const src = read("components/ui/button.tsx");

  it("primary variant has hover state", () => {
    expect(src).toContain("hover:bg-[#c93700]");
  });

  it("primary variant has active state", () => {
    expect(src).toContain("active:bg-[#9f2800]");
  });

  it("secondary variant has hover state", () => {
    expect(src).toContain("hover:bg-[#ece6d9]");
  });

  it("outline variant has hover state", () => {
    expect(src).toContain("hover:bg-[#fcfcfa]");
  });

  it("ghost variant has hover state", () => {
    expect(src).toContain("hover:bg-[#f8f5ee]");
  });

  it("destructive variant has hover state", () => {
    expect(src).toContain("hover:bg-[#b30024]");
  });

  it("disabled state removes pointer events", () => {
    expect(src).toContain("disabled:pointer-events-none");
  });

  it("disabled state reduces opacity", () => {
    expect(src).toContain("disabled:opacity-50");
  });

  it("loading state shows spinner icon", () => {
    expect(src).toContain("Loader2");
    expect(src).toContain("animate-spin");
  });

  it("loading state disables the button", () => {
    expect(src).toContain("disabled={disabled || loading}");
  });
});

// ---------------------------------------------------------------------------
// 2. Table row hover states
// ---------------------------------------------------------------------------
describe("Table row hover states", () => {
  it("Table component rows have hover:bg-gray-50", () => {
    const src = read("components/ui/table.tsx");
    expect(src).toContain("hover:bg-gray-50");
  });

  it("contacts page rows have hover:bg-gray-50", () => {
    const src = read("app/(dashboard)/contacts/page.tsx");
    expect(src).toContain("hover:bg-gray-50");
  });

  it("companies page rows have hover:bg-gray-50", () => {
    const src = read("app/(dashboard)/companies/page.tsx");
    expect(src).toContain("hover:bg-gray-50");
  });

  it("deals page table rows have hover:bg-gray-50", () => {
    const src = read("app/(dashboard)/deals/page.tsx");
    expect(src).toContain("hover:bg-gray-50");
  });

  it("tickets page rows have hover:bg-gray-50", () => {
    const src = read("app/(dashboard)/tickets/page.tsx");
    expect(src).toContain("hover:bg-gray-50");
  });

  it("email page rows have hover:bg-gray-50", () => {
    const src = read("app/(dashboard)/email/page.tsx");
    expect(src).toContain("hover:bg-gray-50");
  });

  it("table rows have transition-colors for smooth hover", () => {
    const src = read("components/ui/table.tsx");
    expect(src).toContain("transition-colors");
  });
});

// ---------------------------------------------------------------------------
// 3. Card hover effects
// ---------------------------------------------------------------------------
describe("Card hover effects", () => {
  it("deal cards have hover:border-gray-300", () => {
    const src = read("app/(dashboard)/deals/page.tsx");
    expect(src).toContain("hover:border-gray-300");
  });

  it("deal cards have hover:shadow-md", () => {
    const src = read("app/(dashboard)/deals/page.tsx");
    expect(src).toContain("hover:shadow-md");
  });

  it("deal cards have transition-all for smooth animation", () => {
    const src = read("app/(dashboard)/deals/page.tsx");
    expect(src).toContain("transition-all");
  });

  it("workflow cards have hover:border-gray-300", () => {
    const src = read("app/(dashboard)/workflows/page.tsx");
    expect(src).toContain("hover:border-gray-300");
  });

  it("social post cards have hover:border-gray-300", () => {
    const src = read("app/(dashboard)/social/page.tsx");
    expect(src).toContain("hover:border-gray-300");
  });

  it("dashboard recent contacts have hover:bg-gray-50", () => {
    const src = read("app/(dashboard)/page.tsx");
    expect(src).toContain("hover:bg-gray-50");
  });

  it("dashboard tasks have hover:bg-gray-50", () => {
    const src = read("app/(dashboard)/page.tsx");
    expect(src).toContain("hover:bg-gray-50");
  });
});

// ---------------------------------------------------------------------------
// 4. Tab active underline
// ---------------------------------------------------------------------------
describe("Tab active underline", () => {
  it("TabsTrigger has after pseudo-element underline when active", () => {
    const src = read("components/ui/tabs.tsx");
    expect(src).toContain("after:absolute");
    expect(src).toContain("after:bottom-0");
    expect(src).toContain("after:h-0.5");
    expect(src).toContain("after:bg-[#ff4800]");
  });

  it("tasks page filter tabs have border-b-2 underline when active", () => {
    const src = read("app/(dashboard)/tasks/page.tsx");
    expect(src).toContain("border-b-2");
    expect(src).toContain("border-[#ff4800] text-[#ff4800]");
  });

  it("inactive tabs have transparent border", () => {
    const src = read("app/(dashboard)/tasks/page.tsx");
    expect(src).toContain("border-transparent");
  });

  it("page-header tabs active state uses border-[#ff4800]", () => {
    const src = read("components/layout/page-header.tsx");
    expect(src).toContain("border-[#ff4800]");
  });

  it("page-header inactive tabs have hover:border-gray-300", () => {
    const src = read("components/layout/page-header.tsx");
    expect(src).toContain("hover:border-gray-300");
  });
});

// ---------------------------------------------------------------------------
// 5. Sidebar items active highlight
// ---------------------------------------------------------------------------
describe("Sidebar items active highlight", () => {
  const src = read("components/layout/sidebar.tsx");

  it("active items have left border indicator", () => {
    expect(src).toContain("border-l-[3px]");
  });

  it("active items use orange accent border", () => {
    expect(src).toContain("border-[#ff4800]");
  });

  it("active items have background highlight", () => {
    expect(src).toContain("bg-white/10");
  });

  it("active items have brighter text", () => {
    expect(src).toContain("text-[#f8f5ee]");
  });

  it("inactive items have muted text", () => {
    expect(src).toContain("text-[#f8f5ee]/60");
  });

  it("inactive items have hover background", () => {
    expect(src).toContain("hover:bg-white/10");
  });

  it("inactive items have hover text brightness", () => {
    expect(src).toContain("hover:text-[#f8f5ee]");
  });
});

// ---------------------------------------------------------------------------
// 6. Badge color by status
// ---------------------------------------------------------------------------
describe("Badge color by status", () => {
  it("contacts page: customer (顧客) uses success badge", () => {
    const src = read("app/(dashboard)/contacts/page.tsx");
    expect(src).toContain('"success"');
  });

  it("contacts page: lead (リード) uses warning badge", () => {
    const src = read("app/(dashboard)/contacts/page.tsx");
    expect(src).toContain('"warning"');
  });

  it("contacts page: SQL uses info badge", () => {
    const src = read("app/(dashboard)/contacts/page.tsx");
    expect(src).toContain('"info"');
  });

  it("contacts page: MQL uses purple badge", () => {
    const src = read("app/(dashboard)/contacts/page.tsx");
    expect(src).toContain('"purple"');
  });

  it("tickets page: new (新規) uses info badge", () => {
    const src = read("app/(dashboard)/tickets/page.tsx");
    expect(src).toContain('"info"');
  });

  it("tickets page: resolved (解決済み) uses success badge", () => {
    const src = read("app/(dashboard)/tickets/page.tsx");
    expect(src).toContain('"success"');
  });

  it("tickets page: urgent (緊急) priority uses danger badge", () => {
    const src = read("app/(dashboard)/tickets/page.tsx");
    expect(src).toContain('"danger"');
  });

  it("deals page: contract closed (契約締結) uses success badge", () => {
    const src = read("app/(dashboard)/deals/page.tsx");
    expect(src).toContain('"success"');
  });

  it("deals page: lost (失注) uses danger badge", () => {
    const src = read("app/(dashboard)/deals/page.tsx");
    expect(src).toContain('"danger"');
  });

  it("workflows page: active (有効) uses success badge", () => {
    const src = read("app/(dashboard)/workflows/page.tsx");
    expect(src).toContain('wf.active ? "success" : "default"');
  });
});

// ---------------------------------------------------------------------------
// 7. Form validation error states
// ---------------------------------------------------------------------------
describe("Form validation error states", () => {
  it("login page shows error when email is empty", () => {
    const src = read("app/(auth)/login/page.tsx");
    expect(src).toContain('"メールアドレスを入力してください"');
  });

  it("login page shows error when password is empty", () => {
    const src = read("app/(auth)/login/page.tsx");
    expect(src).toContain('"パスワードを入力してください"');
  });

  it("login page shows error on failed auth", () => {
    const src = read("app/(auth)/login/page.tsx");
    expect(src).toContain('"ログインに失敗しました"');
  });

  it("login error displays in red background", () => {
    const src = read("app/(auth)/login/page.tsx");
    expect(src).toContain("bg-red-50");
    expect(src).toContain("text-red-600");
  });

  it("register page validates name is required", () => {
    const src = read("app/(auth)/register/page.tsx");
    expect(src).toContain('"名前を入力してください"');
  });

  it("register page validates password length >= 8", () => {
    const src = read("app/(auth)/register/page.tsx");
    expect(src).toContain("password.length < 8");
    expect(src).toContain('"パスワードは8文字以上で入力してください"');
  });

  it("register page validates password confirmation", () => {
    const src = read("app/(auth)/register/page.tsx");
    expect(src).toContain("password !== confirmPassword");
    expect(src).toContain('"パスワードが一致しません"');
  });

  it("Input component has error variant with red border", () => {
    const src = read("components/ui/input.tsx");
    expect(src).toContain("border-[#d9002b]");
  });

  it("Select component has error state with red border", () => {
    const src = read("components/ui/select.tsx");
    expect(src).toContain("border-red-500");
  });

  it("Textarea component has error state with red border", () => {
    const src = read("components/ui/textarea.tsx");
    expect(src).toContain("border-red-500");
  });
});

// ---------------------------------------------------------------------------
// 8. Inbox conversation selection state
// ---------------------------------------------------------------------------
describe("Inbox conversation selection state", () => {
  const src = read("app/(dashboard)/inbox/page.tsx");

  it("selected conversation has distinct background", () => {
    expect(src).toContain("bg-[#FFF1ED]");
  });

  it("selected conversation has left border accent", () => {
    expect(src).toContain("border-l-2 border-l-[#FF7A59]");
  });

  it("unread conversations have blue tint", () => {
    expect(src).toContain("bg-blue-50/50");
  });

  it("unread conversations have bold text", () => {
    expect(src).toContain("font-semibold text-gray-900");
  });

  it("unread indicator dot is visible", () => {
    expect(src).toContain("h-2 w-2 rounded-full bg-[#FF7A59]");
  });
});
