import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const SRC = path.resolve(__dirname, "../..");
const read = (rel: string) => fs.readFileSync(path.join(SRC, rel), "utf-8");

const globals = read("app/globals.css");
const button = read("components/ui/button.tsx");
const badge = read("components/ui/badge.tsx");
const card = read("components/ui/card.tsx");
const input = read("components/ui/input.tsx");
const avatar = read("components/ui/avatar.tsx");
const table = read("components/ui/table.tsx");
const tabs = read("components/ui/tabs.tsx");
const modal = read("components/ui/modal.tsx");
const dropdown = read("components/ui/dropdown-menu.tsx");
const select = read("components/ui/select.tsx");
const textarea = read("components/ui/textarea.tsx");
const tooltip = read("components/ui/tooltip.tsx");
const statsCard = read("components/ui/stats-card.tsx");
const searchInput = read("components/ui/search-input.tsx");
const emptyState = read("components/ui/empty-state.tsx");
const sidebar = read("components/layout/sidebar.tsx");
const header = read("components/layout/header.tsx");
const pageHeader = read("components/layout/page-header.tsx");
const dashboardLayout = read("components/layout/dashboard-layout.tsx");
const rootLayout = read("app/layout.tsx");
const loginPage = read("app/(auth)/login/page.tsx");
const dashboardPage = read("app/(dashboard)/page.tsx");
const contactsPage = read("app/(dashboard)/contacts/page.tsx");
const dealsPage = read("app/(dashboard)/deals/page.tsx");

// Collect all non-generated source files for legacy color scanning
const allComponentFiles = [
  button, badge, card, input, avatar, table, tabs, modal,
  dropdown, select, textarea, tooltip, statsCard, searchInput,
  emptyState, sidebar, header, pageHeader, dashboardLayout,
  globals, loginPage, dashboardPage, contactsPage, dealsPage,
];

// ---------------------------------------------------------------------------
// 1. Primary colors in globals.css
// ---------------------------------------------------------------------------
describe("CSS Variables - Primary Brand Colors", () => {
  it("defines --hs-primary as #ff4800", () => {
    expect(globals).toContain("--hs-primary: #ff4800");
  });

  it("defines --hs-primary-hover as #c93700", () => {
    expect(globals).toContain("--hs-primary-hover: #c93700");
  });

  it("defines --hs-primary-pressed as #9f2800", () => {
    expect(globals).toContain("--hs-primary-pressed: #9f2800");
  });

  it("maps --color-hs-primary to var(--hs-primary)", () => {
    expect(globals).toContain("--color-hs-primary: var(--hs-primary)");
  });

  it("maps --color-hs-primary-hover to var(--hs-primary-hover)", () => {
    expect(globals).toContain("--color-hs-primary-hover: var(--hs-primary-hover)");
  });

  it("maps --color-hs-primary-pressed to var(--hs-primary-pressed)", () => {
    expect(globals).toContain("--color-hs-primary-pressed: var(--hs-primary-pressed)");
  });
});

// ---------------------------------------------------------------------------
// 2. Text colors in globals.css
// ---------------------------------------------------------------------------
describe("CSS Variables - Text Colors", () => {
  it("defines --hs-text-primary as #1f1f1f", () => {
    expect(globals).toContain("--hs-text-primary: #1f1f1f");
  });

  it("defines --hs-text-secondary as rgba(0, 0, 0, 0.62)", () => {
    expect(globals).toContain("--hs-text-secondary: rgba(0, 0, 0, 0.62)");
  });

  it("maps --color-hs-text-primary correctly", () => {
    expect(globals).toContain("--color-hs-text-primary: var(--hs-text-primary)");
  });

  it("maps --color-hs-text-secondary correctly", () => {
    expect(globals).toContain("--color-hs-text-secondary: var(--hs-text-secondary)");
  });

  it("sets body color to var(--foreground)", () => {
    expect(globals).toContain("color: var(--foreground)");
  });

  it("maps --foreground to --hs-text-primary", () => {
    expect(globals).toContain("--foreground: var(--hs-text-primary)");
  });
});

// ---------------------------------------------------------------------------
// 3. Background colors in globals.css
// ---------------------------------------------------------------------------
describe("CSS Variables - Background Colors", () => {
  it("defines --hs-bg-01 as #fcfcfa", () => {
    expect(globals).toContain("--hs-bg-01: #fcfcfa");
  });

  it("defines --hs-bg-02 as #f8f5ee", () => {
    expect(globals).toContain("--hs-bg-02: #f8f5ee");
  });

  it("defines --hs-container as #ffffff", () => {
    expect(globals).toContain("--hs-container: #ffffff");
  });

  it("maps --color-hs-bg-01 correctly", () => {
    expect(globals).toContain("--color-hs-bg-01: var(--hs-bg-01)");
  });

  it("maps --color-hs-bg-02 correctly", () => {
    expect(globals).toContain("--color-hs-bg-02: var(--hs-bg-02)");
  });

  it("maps --color-hs-container correctly", () => {
    expect(globals).toContain("--color-hs-container: var(--hs-container)");
  });

  it("maps --background to --hs-bg-01", () => {
    expect(globals).toContain("--background: var(--hs-bg-01)");
  });

  it("sets body background to var(--background)", () => {
    expect(globals).toContain("background: var(--background)");
  });
});

// ---------------------------------------------------------------------------
// 4. Border color in globals.css
// ---------------------------------------------------------------------------
describe("CSS Variables - Border Color", () => {
  it("defines --hs-border as rgba(0, 0, 0, 0.11)", () => {
    expect(globals).toContain("--hs-border: rgba(0, 0, 0, 0.11)");
  });

  it("maps --color-hs-border correctly", () => {
    expect(globals).toContain("--color-hs-border: var(--hs-border)");
  });
});

// ---------------------------------------------------------------------------
// 5. Focus color
// ---------------------------------------------------------------------------
describe("CSS Variables - Focus Color", () => {
  it("defines --hs-focus as #2f7579", () => {
    expect(globals).toContain("--hs-focus: #2f7579");
  });

  it("maps --color-hs-focus correctly", () => {
    expect(globals).toContain("--color-hs-focus: var(--hs-focus)");
  });
});

// ---------------------------------------------------------------------------
// 6. Functional colors
// ---------------------------------------------------------------------------
describe("CSS Variables - Functional Colors", () => {
  it("defines --hs-success as #00823a", () => {
    expect(globals).toContain("--hs-success: #00823a");
  });

  it("defines --hs-error as #d9002b", () => {
    expect(globals).toContain("--hs-error: #d9002b");
  });

  it("defines --hs-warning as #eeb117", () => {
    expect(globals).toContain("--hs-warning: #eeb117");
  });

  it("maps --color-hs-success correctly", () => {
    expect(globals).toContain("--color-hs-success: var(--hs-success)");
  });

  it("maps --color-hs-error correctly", () => {
    expect(globals).toContain("--color-hs-error: var(--hs-error)");
  });

  it("maps --color-hs-warning correctly", () => {
    expect(globals).toContain("--color-hs-warning: var(--hs-warning)");
  });
});

// ---------------------------------------------------------------------------
// 7. Sidebar colors
// ---------------------------------------------------------------------------
describe("CSS Variables - Sidebar Colors", () => {
  it("defines --hs-sidebar as #1f1f1f", () => {
    expect(globals).toContain("--hs-sidebar: #1f1f1f");
  });

  it("defines --hs-sidebar-text as #f8f5ee", () => {
    expect(globals).toContain("--hs-sidebar-text: #f8f5ee");
  });

  it("maps --color-hs-sidebar correctly", () => {
    expect(globals).toContain("--color-hs-sidebar: var(--hs-sidebar)");
  });

  it("maps --color-hs-sidebar-text correctly", () => {
    expect(globals).toContain("--color-hs-sidebar-text: var(--hs-sidebar-text)");
  });
});

// ---------------------------------------------------------------------------
// 8. Accent fills in globals.css
// ---------------------------------------------------------------------------
describe("CSS Variables - Accent Fill Colors", () => {
  it("defines --hs-accent-gray as #cfcccb", () => {
    expect(globals).toContain("--hs-accent-gray: #cfcccb");
  });

  it("defines --hs-accent-orange as #fcc6b1", () => {
    expect(globals).toContain("--hs-accent-orange: #fcc6b1");
  });

  it("defines --hs-accent-green as #b9cdbe", () => {
    expect(globals).toContain("--hs-accent-green: #b9cdbe");
  });

  it("defines --hs-accent-cream as #ece6d9", () => {
    expect(globals).toContain("--hs-accent-cream: #ece6d9");
  });

  it("defines --hs-accent-purple as #d7cdfc", () => {
    expect(globals).toContain("--hs-accent-purple: #d7cdfc");
  });

  it("defines --hs-accent-teal as #b2e9eb", () => {
    expect(globals).toContain("--hs-accent-teal: #b2e9eb");
  });

  it("defines --hs-accent-pink as #fbdbe9", () => {
    expect(globals).toContain("--hs-accent-pink: #fbdbe9");
  });

  it("maps --color-hs-accent-gray correctly", () => {
    expect(globals).toContain("--color-hs-accent-gray: var(--hs-accent-gray)");
  });

  it("maps --color-hs-accent-orange correctly", () => {
    expect(globals).toContain("--color-hs-accent-orange: var(--hs-accent-orange)");
  });

  it("maps --color-hs-accent-green correctly", () => {
    expect(globals).toContain("--color-hs-accent-green: var(--hs-accent-green)");
  });

  it("maps --color-hs-accent-cream correctly", () => {
    expect(globals).toContain("--color-hs-accent-cream: var(--hs-accent-cream)");
  });

  it("maps --color-hs-accent-purple correctly", () => {
    expect(globals).toContain("--color-hs-accent-purple: var(--hs-accent-purple)");
  });

  it("maps --color-hs-accent-teal correctly", () => {
    expect(globals).toContain("--color-hs-accent-teal: var(--hs-accent-teal)");
  });

  it("maps --color-hs-accent-pink correctly", () => {
    expect(globals).toContain("--color-hs-accent-pink: var(--hs-accent-pink)");
  });
});

// ---------------------------------------------------------------------------
// 9. Button component colors
// ---------------------------------------------------------------------------
describe("Button - Primary Color Usage", () => {
  it("primary variant uses bg-[#ff4800]", () => {
    expect(button).toContain("bg-[#ff4800]");
  });

  it("primary variant hover uses bg-[#c93700]", () => {
    expect(button).toContain("hover:bg-[#c93700]");
  });

  it("primary variant active uses bg-[#9f2800]", () => {
    expect(button).toContain("active:bg-[#9f2800]");
  });

  it("primary variant text is white", () => {
    expect(button).toContain("text-white");
  });

  it("primary variant focus ring is #2f7579", () => {
    expect(button).toContain("focus-visible:ring-[#2f7579]");
  });
});

describe("Button - Secondary Color Usage", () => {
  it("secondary variant uses bg-[#f8f5ee]", () => {
    expect(button).toContain("bg-[#f8f5ee]");
  });

  it("secondary variant text is #1f1f1f", () => {
    expect(button).toContain("text-[#1f1f1f]");
  });

  it("secondary variant hover uses bg-[#ece6d9]", () => {
    expect(button).toContain("hover:bg-[#ece6d9]");
  });
});

describe("Button - Outline Color Usage", () => {
  it("outline variant uses border-[rgba(0,0,0,0.11)]", () => {
    expect(button).toContain("border-[rgba(0,0,0,0.11)]");
  });

  it("outline variant bg is white", () => {
    expect(button).toContain("bg-white");
  });

  it("outline variant text is #1f1f1f", () => {
    expect(button).toMatch(/outline:[\s\S]*text-\[#1f1f1f\]/);
  });

  it("outline variant hover uses bg-[#fcfcfa]", () => {
    expect(button).toContain("hover:bg-[#fcfcfa]");
  });
});

describe("Button - Ghost Color Usage", () => {
  it("ghost variant text is #1f1f1f", () => {
    expect(button).toMatch(/ghost:[\s\S]*text-\[#1f1f1f\]/);
  });

  it("ghost variant hover uses bg-[#f8f5ee]", () => {
    expect(button).toContain("hover:bg-[#f8f5ee]");
  });
});

describe("Button - Destructive Color Usage", () => {
  it("destructive variant uses bg-[#d9002b]", () => {
    expect(button).toContain("bg-[#d9002b]");
  });

  it("destructive variant text is white", () => {
    const destructiveLine = button.split("destructive:")[1];
    expect(destructiveLine).toContain("text-white");
  });

  it("destructive variant focus ring is #d9002b", () => {
    expect(button).toContain("focus-visible:ring-[#d9002b]");
  });
});

// ---------------------------------------------------------------------------
// 10. Badge component colors
// ---------------------------------------------------------------------------
describe("Badge - Color Variants", () => {
  it("default badge uses bg-[#cfcccb]", () => {
    expect(badge).toContain("bg-[#cfcccb]");
  });

  it("default badge text is #1f1f1f", () => {
    expect(badge).toContain("text-[#1f1f1f]");
  });

  it("success badge uses bg-[#b9cdbe]", () => {
    expect(badge).toContain("bg-[#b9cdbe]");
  });

  it("success badge text is #00823a", () => {
    expect(badge).toContain("text-[#00823a]");
  });

  it("warning badge uses bg-[#ece6d9]", () => {
    expect(badge).toContain("bg-[#ece6d9]");
  });

  it("danger badge uses bg-[#fcc6b1]", () => {
    expect(badge).toContain("bg-[#fcc6b1]");
  });

  it("danger badge text is #d9002b", () => {
    expect(badge).toContain("text-[#d9002b]");
  });

  it("info badge uses bg-[#b2e9eb]", () => {
    expect(badge).toContain("bg-[#b2e9eb]");
  });

  it("info badge text is #2f7579", () => {
    expect(badge).toContain("text-[#2f7579]");
  });

  it("purple badge uses bg-[#d7cdfc]", () => {
    expect(badge).toContain("bg-[#d7cdfc]");
  });

  it("orange badge uses bg-[#fcc6b1] with text-[#ff4800]", () => {
    expect(badge).toContain("text-[#ff4800]");
  });

  it("pink badge uses bg-[#fbdbe9]", () => {
    expect(badge).toContain("bg-[#fbdbe9]");
  });
});

// ---------------------------------------------------------------------------
// 11. Card component colors
// ---------------------------------------------------------------------------
describe("Card - Color Usage", () => {
  it("card uses bg-white", () => {
    expect(card).toContain("bg-white");
  });

  it("card border uses rgba(0,0,0,0.11)", () => {
    expect(card).toContain("border-[rgba(0,0,0,0.11)]");
  });

  it("card title text is #1f1f1f", () => {
    expect(card).toContain("text-[#1f1f1f]");
  });

  it("card description text uses rgba(0,0,0,0.62)", () => {
    expect(card).toContain("text-[rgba(0,0,0,0.62)]");
  });
});

// ---------------------------------------------------------------------------
// 12. Input component colors
// ---------------------------------------------------------------------------
describe("Input - Color Usage", () => {
  it("input border is rgba(0,0,0,0.11)", () => {
    expect(input).toContain("border-[rgba(0,0,0,0.11)]");
  });

  it("input focus ring is #2f7579", () => {
    expect(input).toContain("focus-visible:ring-[#2f7579]");
  });

  it("input focus border is #2f7579", () => {
    expect(input).toContain("focus-visible:border-[#2f7579]");
  });

  it("input error state uses #d9002b border", () => {
    expect(input).toContain("border-[#d9002b]");
  });

  it("input error message text is #d9002b", () => {
    expect(input).toContain("text-[#d9002b]");
  });

  it("input placeholder uses rgba(0,0,0,0.38)", () => {
    expect(input).toContain("placeholder:text-[rgba(0,0,0,0.38)]");
  });

  it("input label text is #1f1f1f", () => {
    expect(input).toContain("text-[#1f1f1f]");
  });

  it("input helper text uses rgba(0,0,0,0.62)", () => {
    expect(input).toContain("text-[rgba(0,0,0,0.62)]");
  });

  it("input bg is white", () => {
    expect(input).toContain("bg-white");
  });
});

// ---------------------------------------------------------------------------
// 13. Sidebar component colors
// ---------------------------------------------------------------------------
describe("Sidebar - Color Usage", () => {
  it("sidebar background is #1f1f1f", () => {
    expect(sidebar).toContain("bg-[#1f1f1f]");
  });

  it("sidebar text is #f8f5ee", () => {
    expect(sidebar).toContain("text-[#f8f5ee]");
  });

  it("sidebar active item uses border-[#ff4800]", () => {
    expect(sidebar).toContain("border-[#ff4800]");
  });

  it("sidebar active item has bg-white/10", () => {
    expect(sidebar).toContain("bg-white/10");
  });

  it("sidebar inactive text uses #f8f5ee opacity 60%", () => {
    expect(sidebar).toContain("text-[#f8f5ee]/60");
  });

  it("sidebar hover uses bg-white/10", () => {
    expect(sidebar).toContain("hover:bg-white/10");
  });

  it("sidebar logo text is #f8f5ee", () => {
    expect(sidebar).toContain("text-[#f8f5ee]");
  });

  it("sidebar section label uses #f8f5ee opacity 40%", () => {
    expect(sidebar).toContain("text-[#f8f5ee]/40");
  });

  it("sidebar border uses white/10", () => {
    expect(sidebar).toContain("border-white/10");
  });
});

// ---------------------------------------------------------------------------
// 14. Header component colors
// ---------------------------------------------------------------------------
describe("Header - Color Usage", () => {
  it("header background is bg-white", () => {
    expect(header).toContain("bg-white");
  });

  it("header border uses rgba(0,0,0,0.11)", () => {
    expect(header).toContain("border-[rgba(0,0,0,0.11)]");
  });

  it("header search input bg is #fcfcfa", () => {
    expect(header).toContain("bg-[#fcfcfa]");
  });

  it("header search focus border is #2f7579", () => {
    expect(header).toContain("focus:border-[#2f7579]");
  });

  it("header quick-create button uses #ff4800", () => {
    expect(header).toContain("bg-[#ff4800]");
  });

  it("header quick-create hover uses #c93700", () => {
    expect(header).toContain("hover:bg-[#c93700]");
  });

  it("header quick-create active uses #9f2800", () => {
    expect(header).toContain("active:bg-[#9f2800]");
  });

  it("header dropdown shadow uses correct value", () => {
    expect(header).toContain("shadow-[0_4px_16px_rgba(0,0,0,0.12)]");
  });

  it("header notification badge uses #d9002b", () => {
    expect(header).toContain("bg-[#d9002b]");
  });

  it("header user avatar bg is #1f1f1f", () => {
    expect(header).toContain("bg-[#1f1f1f]");
  });

  it("header user avatar text is #f8f5ee", () => {
    expect(header).toContain("text-[#f8f5ee]");
  });

  it("header dropdown menu items hover uses #f8f5ee", () => {
    expect(header).toContain("hover:bg-[#f8f5ee]");
  });

  it("header text primary uses #1f1f1f", () => {
    expect(header).toContain("text-[#1f1f1f]");
  });

  it("header text secondary uses rgba(0,0,0,0.62)", () => {
    expect(header).toContain("text-[rgba(0,0,0,0.62)]");
  });

  it("header placeholder uses rgba(0,0,0,0.38)", () => {
    expect(header).toContain("placeholder:text-[rgba(0,0,0,0.38)]");
  });

  it("header logout text uses #d9002b", () => {
    expect(header).toContain("text-[#d9002b]");
  });

  it("header kbd bg uses #f8f5ee", () => {
    expect(header).toContain("bg-[#f8f5ee]");
  });
});

// ---------------------------------------------------------------------------
// 15. StatsCard component colors
// ---------------------------------------------------------------------------
describe("StatsCard - Color Usage", () => {
  it("stats card icon uses text-[#ff4800]", () => {
    expect(statsCard).toContain("text-[#ff4800]");
  });

  it("stats card icon bg uses #fcc6b1", () => {
    expect(statsCard).toContain("bg-[#fcc6b1]");
  });

  it("stats card label text uses rgba(0,0,0,0.62)", () => {
    expect(statsCard).toContain("text-[rgba(0,0,0,0.62)]");
  });

  it("stats card value text is #1f1f1f", () => {
    expect(statsCard).toContain("text-[#1f1f1f]");
  });

  it("stats card positive change uses #00823a", () => {
    expect(statsCard).toContain("text-[#00823a]");
  });

  it("stats card negative change uses #d9002b", () => {
    expect(statsCard).toContain("text-[#d9002b]");
  });

  it("stats card border uses rgba(0,0,0,0.11)", () => {
    expect(statsCard).toContain("border-[rgba(0,0,0,0.11)]");
  });

  it("stats card bg is white", () => {
    expect(statsCard).toContain("bg-white");
  });
});

// ---------------------------------------------------------------------------
// 16. Tabs component colors
// ---------------------------------------------------------------------------
describe("Tabs - Color Usage", () => {
  it("active tab text is #ff4800", () => {
    expect(tabs).toContain("text-[#ff4800]");
  });

  it("active tab underline uses bg-[#ff4800]", () => {
    expect(tabs).toContain("after:bg-[#ff4800]");
  });

  it("tab focus ring uses #2f7579", () => {
    expect(tabs).toContain("focus-visible:ring-[#2f7579]");
  });
});

// ---------------------------------------------------------------------------
// 17. SearchInput component colors
// ---------------------------------------------------------------------------
describe("SearchInput - Color Usage", () => {
  it("search input border uses rgba(0,0,0,0.11)", () => {
    expect(searchInput).toContain("border-[rgba(0,0,0,0.11)]");
  });

  it("search input focus ring uses #2f7579", () => {
    expect(searchInput).toContain("focus-visible:ring-[#2f7579]");
  });

  it("search input focus border uses #2f7579", () => {
    expect(searchInput).toContain("focus-visible:border-[#2f7579]");
  });

  it("search input placeholder uses rgba(0,0,0,0.38)", () => {
    expect(searchInput).toContain("placeholder:text-[rgba(0,0,0,0.38)]");
  });

  it("search input bg is white", () => {
    expect(searchInput).toContain("bg-white");
  });
});

// ---------------------------------------------------------------------------
// 18. Select component colors
// ---------------------------------------------------------------------------
describe("Select - Color Usage", () => {
  it("select border uses rgba(0,0,0,0.11)", () => {
    expect(select).toContain("border-[rgba(0,0,0,0.11)]");
  });

  it("select focus ring uses #2f7579", () => {
    expect(select).toContain("focus-visible:ring-[#2f7579]");
  });

  it("select focus border uses #2f7579", () => {
    expect(select).toContain("focus-visible:border-[#2f7579]");
  });

  it("select bg is white", () => {
    expect(select).toContain("bg-white");
  });
});

// ---------------------------------------------------------------------------
// 19. Textarea component colors
// ---------------------------------------------------------------------------
describe("Textarea - Color Usage", () => {
  it("textarea border uses rgba(0,0,0,0.11)", () => {
    expect(textarea).toContain("border-[rgba(0,0,0,0.11)]");
  });

  it("textarea focus ring uses #2f7579", () => {
    expect(textarea).toContain("focus-visible:ring-[#2f7579]");
  });

  it("textarea focus border uses #2f7579", () => {
    expect(textarea).toContain("focus-visible:border-[#2f7579]");
  });

  it("textarea bg is white", () => {
    expect(textarea).toContain("bg-white");
  });
});

// ---------------------------------------------------------------------------
// 20. Login page colors
// ---------------------------------------------------------------------------
describe("Login Page - Color Usage", () => {
  it("login heading uses #1f1f1f", () => {
    expect(loginPage).toContain("text-[#1f1f1f]");
  });

  it("login Hub text uses #ff4800", () => {
    expect(loginPage).toContain("text-[#ff4800]");
  });

  it("login button uses bg-[#ff4800]", () => {
    expect(loginPage).toContain("bg-[#ff4800]");
  });

  it("login button hover uses bg-[#c93700]", () => {
    expect(loginPage).toContain("hover:bg-[#c93700]");
  });

  it("login button active uses bg-[#9f2800]", () => {
    expect(loginPage).toContain("active:bg-[#9f2800]");
  });

  it("login input border uses rgba(0,0,0,0.11)", () => {
    expect(loginPage).toContain("border-[rgba(0,0,0,0.11)]");
  });

  it("login input focus uses #2f7579", () => {
    expect(loginPage).toContain("focus:border-[#2f7579]");
  });

  it("login register link uses #ff4800", () => {
    expect(loginPage).toContain("text-[#ff4800]");
  });
});

// ---------------------------------------------------------------------------
// 21. PageHeader colors
// ---------------------------------------------------------------------------
describe("PageHeader - Color Usage", () => {
  it("page header active tab uses border-[#ff4800]", () => {
    expect(pageHeader).toContain("border-[#ff4800]");
  });

  it("page header active tab text uses text-[#ff4800]", () => {
    expect(pageHeader).toContain("text-[#ff4800]");
  });

  it("page header active tab count bg uses #ff4800", () => {
    expect(pageHeader).toContain("bg-[#ff4800]/10");
  });
});

// ---------------------------------------------------------------------------
// 22. Dashboard page colors
// ---------------------------------------------------------------------------
describe("Dashboard Page - Color Usage", () => {
  it("dashboard link text uses #ff4800", () => {
    expect(dashboardPage).toContain("text-[#ff4800]");
  });

  it("dashboard contact avatar uses bg-[#ff4800]", () => {
    expect(dashboardPage).toContain("bg-[#ff4800]");
  });
});

// ---------------------------------------------------------------------------
// 23. Contacts page colors
// ---------------------------------------------------------------------------
describe("Contacts Page - Color Usage", () => {
  it("contacts avatar uses bg-[#ff4800]", () => {
    expect(contactsPage).toContain("bg-[#ff4800]");
  });

  it("contacts hover link uses text-[#ff4800]", () => {
    expect(contactsPage).toContain("group-hover:text-[#ff4800]");
  });

  it("contacts filter focus uses #ff4800", () => {
    expect(contactsPage).toContain("focus:border-[#ff4800]");
  });
});

// ---------------------------------------------------------------------------
// 24. Deals page colors
// ---------------------------------------------------------------------------
describe("Deals Page - Color Usage", () => {
  it("deals owner avatar uses bg-[#ff4800]", () => {
    expect(dealsPage).toContain("bg-[#ff4800]");
  });

  it("deals table hover link uses text-[#ff4800]", () => {
    expect(dealsPage).toContain("hover:text-[#ff4800]");
  });

  it("deals filter focus uses #ff4800", () => {
    expect(dealsPage).toContain("focus:border-[#ff4800]");
  });
});

// ---------------------------------------------------------------------------
// 25. Table row hover uses bg-02 color
// ---------------------------------------------------------------------------
describe("Table Row Hover - globals.css", () => {
  it("table-row-hover class uses var(--hs-bg-02)", () => {
    expect(globals).toContain("background-color: var(--hs-bg-02)");
  });
});

// ---------------------------------------------------------------------------
// 26. DashboardLayout colors
// ---------------------------------------------------------------------------
describe("DashboardLayout - Color Usage", () => {
  it("mobile menu button bg is #1f1f1f", () => {
    expect(dashboardLayout).toContain("bg-[#1f1f1f]");
  });

  it("mobile overlay is bg-black/50", () => {
    expect(dashboardLayout).toContain("bg-black/50");
  });
});

// ---------------------------------------------------------------------------
// 27. Legacy colors must NOT exist
// ---------------------------------------------------------------------------
describe("No Legacy HubSpot Colors - #FF7A59", () => {
  allComponentFiles.forEach((content, index) => {
    it(`file index ${index} does not contain old primary #FF7A59`, () => {
      expect(content.toLowerCase()).not.toContain("#ff7a59");
    });
  });
});

describe("No Legacy HubSpot Colors - #FF5C35", () => {
  allComponentFiles.forEach((content, index) => {
    it(`file index ${index} does not contain old primary #FF5C35`, () => {
      expect(content.toLowerCase()).not.toContain("#ff5c35");
    });
  });
});

describe("No Legacy HubSpot Colors - #2D3E50", () => {
  allComponentFiles.forEach((content, index) => {
    it(`file index ${index} does not contain old dark #2D3E50`, () => {
      expect(content.toLowerCase()).not.toContain("#2d3e50");
    });
  });
});

describe("No Legacy HubSpot Colors - #33475b", () => {
  allComponentFiles.forEach((content, index) => {
    it(`file index ${index} does not contain old text #33475b`, () => {
      expect(content.toLowerCase()).not.toContain("#33475b");
    });
  });
});

describe("No Legacy HubSpot Colors - #516F90", () => {
  allComponentFiles.forEach((content, index) => {
    it(`file index ${index} does not contain old muted #516F90`, () => {
      expect(content.toLowerCase()).not.toContain("#516f90");
    });
  });
});

describe("No Legacy HubSpot Colors - #CBD6E2", () => {
  allComponentFiles.forEach((content, index) => {
    it(`file index ${index} does not contain old border #CBD6E2`, () => {
      expect(content.toLowerCase()).not.toContain("#cbd6e2");
    });
  });
});

describe("No Legacy HubSpot Colors - #0091AE", () => {
  allComponentFiles.forEach((content, index) => {
    it(`file index ${index} does not contain old teal #0091AE`, () => {
      expect(content.toLowerCase()).not.toContain("#0091ae");
    });
  });
});

describe("No Legacy HubSpot Colors - #00BDA5", () => {
  allComponentFiles.forEach((content, index) => {
    it(`file index ${index} does not contain old green #00BDA5`, () => {
      expect(content.toLowerCase()).not.toContain("#00bda5");
    });
  });
});

// ---------------------------------------------------------------------------
// 28. Deal card hover shadow in globals.css
// ---------------------------------------------------------------------------
describe("Deal Card Hover Shadow", () => {
  it("deal-card hover uses dropdown shadow", () => {
    expect(globals).toContain("box-shadow: var(--hs-shadow-dropdown)");
  });
});

// ---------------------------------------------------------------------------
// 29. Tooltip component colors
// ---------------------------------------------------------------------------
describe("Tooltip - Color Usage", () => {
  it("tooltip bg is gray-900", () => {
    expect(tooltip).toContain("bg-gray-900");
  });

  it("tooltip text is white", () => {
    expect(tooltip).toContain("text-white");
  });
});

// ---------------------------------------------------------------------------
// 30. Modal overlay color
// ---------------------------------------------------------------------------
describe("Modal - Color Usage", () => {
  it("modal overlay uses bg-black/50", () => {
    expect(modal).toContain("bg-black/50");
  });

  it("modal content bg is white", () => {
    expect(modal).toContain("bg-white");
  });
});
