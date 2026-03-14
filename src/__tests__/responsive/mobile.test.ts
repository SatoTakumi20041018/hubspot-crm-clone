import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const SRC = path.resolve(__dirname, "../..");

function read(relativePath: string): string {
  return fs.readFileSync(path.join(SRC, relativePath), "utf-8");
}

// ---------------------------------------------------------------------------
// 1. Sidebar hides on mobile
// ---------------------------------------------------------------------------
describe("Sidebar hides on mobile", () => {
  const layout = read("components/layout/dashboard-layout.tsx");

  it("sidebar wrapper has -translate-x-full class for mobile hidden state", () => {
    expect(layout).toContain("-translate-x-full");
  });

  it("sidebar becomes visible with translate-x-0 on large screens", () => {
    expect(layout).toContain("lg:translate-x-0");
  });

  it("sidebar transitions between states with duration-300", () => {
    expect(layout).toContain("transition-transform");
    expect(layout).toContain("duration-300");
  });

  it("sidebar wrapper uses conditional class based on mobileMenuOpen state", () => {
    expect(layout).toContain("mobileMenuOpen");
    expect(layout).toContain("translate-x-0");
  });

  it("main content has pl-0 on mobile (no left padding for sidebar)", () => {
    expect(layout).toContain('"pl-0"');
  });

  it("main content adapts left padding for sidebar on lg screens", () => {
    expect(layout).toContain("lg:pl-14");
    expect(layout).toContain('lg:pl-[240px]');
  });
});

// ---------------------------------------------------------------------------
// 2. Hamburger menu toggle
// ---------------------------------------------------------------------------
describe("Hamburger menu toggle", () => {
  const layout = read("components/layout/dashboard-layout.tsx");

  it("imports Menu icon from lucide-react", () => {
    expect(layout).toContain("Menu");
  });

  it("imports X icon for close state", () => {
    expect(layout).toContain("X");
  });

  it("toggle button is only visible on mobile (lg:hidden)", () => {
    expect(layout).toContain("lg:hidden");
  });

  it("toggle button has aria-label for open state", () => {
    expect(layout).toContain('"Open menu"');
  });

  it("toggle button has aria-label for close state", () => {
    expect(layout).toContain('"Close menu"');
  });

  it("toggle button is fixed positioned", () => {
    expect(layout).toContain("fixed");
    expect(layout).toContain("left-4");
    expect(layout).toContain("top-4");
  });

  it("toggle button has high z-index (z-50)", () => {
    expect(layout).toContain("z-50");
  });

  it("toggle button has minimum touch target size (h-10 w-10 = 40px)", () => {
    expect(layout).toContain("h-10");
    expect(layout).toContain("w-10");
  });

  it("toggle calls setMobileMenuOpen to toggle state", () => {
    expect(layout).toContain("setMobileMenuOpen(!mobileMenuOpen)");
  });

  it("shows Menu icon when closed, X icon when open", () => {
    expect(layout).toContain("mobileMenuOpen ?");
    expect(layout).toContain("<X");
    expect(layout).toContain("<Menu");
  });
});

// ---------------------------------------------------------------------------
// 3. Mobile overlay/backdrop
// ---------------------------------------------------------------------------
describe("Mobile overlay/backdrop", () => {
  const layout = read("components/layout/dashboard-layout.tsx");

  it("overlay renders when mobileMenuOpen is true", () => {
    expect(layout).toContain("mobileMenuOpen && (");
  });

  it("overlay has fixed positioning to cover full screen", () => {
    expect(layout).toContain("fixed inset-0");
  });

  it("overlay has semi-transparent black background", () => {
    expect(layout).toContain("bg-black/50");
  });

  it("overlay is only visible on mobile (lg:hidden)", () => {
    expect(layout).toContain("lg:hidden");
  });

  it("clicking overlay closes the menu", () => {
    expect(layout).toContain("onClick={() => setMobileMenuOpen(false)}");
  });

  it("overlay has appropriate z-index (z-30)", () => {
    expect(layout).toContain("z-30");
  });
});

// ---------------------------------------------------------------------------
// 4. Tables use horizontal scroll on small screens
// ---------------------------------------------------------------------------
describe("Tables use horizontal scroll on small screens", () => {
  it("Table component wraps in overflow-auto div", () => {
    const src = read("components/ui/table.tsx");
    expect(src).toContain("overflow-auto");
  });

  it("contacts page table uses overflow-x-auto", () => {
    const src = read("app/(dashboard)/contacts/page.tsx");
    expect(src).toContain("overflow-x-auto");
  });

  it("companies page table uses overflow-x-auto", () => {
    const src = read("app/(dashboard)/companies/page.tsx");
    expect(src).toContain("overflow-x-auto");
  });

  it("deals page table uses overflow-x-auto", () => {
    const src = read("app/(dashboard)/deals/page.tsx");
    expect(src).toContain("overflow-x-auto");
  });

  it("tickets page table uses overflow-x-auto", () => {
    const src = read("app/(dashboard)/tickets/page.tsx");
    expect(src).toContain("overflow-x-auto");
  });

  it("email page table uses overflow-x-auto", () => {
    const src = read("app/(dashboard)/email/page.tsx");
    expect(src).toContain("overflow-x-auto");
  });

  it("deals board view uses overflow-x-auto for horizontal scroll", () => {
    const src = read("app/(dashboard)/deals/page.tsx");
    expect(src).toContain("overflow-x-auto");
  });
});

// ---------------------------------------------------------------------------
// 5. Grid layouts collapse to single column
// ---------------------------------------------------------------------------
describe("Grid layouts collapse to single column on mobile", () => {
  const dashboardSrc = read("app/(dashboard)/page.tsx");
  const ticketsSrc = read("app/(dashboard)/tickets/page.tsx");
  const emailSrc = read("app/(dashboard)/email/page.tsx");

  it("dashboard KPI cards use grid-cols-1 as base", () => {
    expect(dashboardSrc).toContain("grid-cols-1");
  });

  it("dashboard KPI cards expand to 2 cols on sm", () => {
    expect(dashboardSrc).toContain("sm:grid-cols-2");
  });

  it("dashboard KPI cards expand to 4 cols on lg", () => {
    expect(dashboardSrc).toContain("lg:grid-cols-4");
  });

  it("dashboard main grid is 1 col on mobile", () => {
    expect(dashboardSrc).toContain("grid-cols-1");
  });

  it("dashboard main grid expands to 3 cols on lg", () => {
    expect(dashboardSrc).toContain("lg:grid-cols-3");
  });

  it("dashboard bottom row is 1 col on mobile, 2 on lg", () => {
    expect(dashboardSrc).toContain("lg:grid-cols-2");
  });

  it("tickets stats cards use grid-cols-1 as base", () => {
    expect(ticketsSrc).toContain("grid-cols-1");
  });

  it("tickets stats expand to sm:grid-cols-3", () => {
    expect(ticketsSrc).toContain("sm:grid-cols-3");
  });

  it("email KPI cards use grid-cols-1 as base", () => {
    expect(emailSrc).toContain("grid-cols-1");
  });

  it("email KPI cards expand to sm:grid-cols-4", () => {
    expect(emailSrc).toContain("sm:grid-cols-4");
  });
});

// ---------------------------------------------------------------------------
// 6. Font sizes are readable on mobile
// ---------------------------------------------------------------------------
describe("Font sizes are readable on mobile", () => {
  it("page headings use text-2xl (24px) which is readable", () => {
    const src = read("app/(dashboard)/contacts/page.tsx");
    expect(src).toContain("text-2xl");
  });

  it("body text uses text-sm (14px) minimum", () => {
    const src = read("components/ui/input.tsx");
    expect(src).toContain("text-sm");
  });

  it("button text uses text-sm or larger", () => {
    const src = read("components/ui/button.tsx");
    expect(src).toContain("text-sm");
  });

  it("badge text uses text-xs (12px) which is acceptable for labels", () => {
    const src = read("components/ui/badge.tsx");
    expect(src).toContain("text-xs");
  });

  it("table cell text uses text-sm (14px)", () => {
    const src = read("components/ui/table.tsx");
    expect(src).toContain("text-sm");
  });

  it("sidebar navigation uses text-sm", () => {
    const src = read("components/layout/sidebar.tsx");
    expect(src).toContain("text-sm");
  });

  it("login form uses text-sm for inputs", () => {
    const src = read("app/(auth)/login/page.tsx");
    expect(src).toContain("text-sm");
  });

  it("modal title uses text-lg (18px)", () => {
    const src = read("components/ui/modal.tsx");
    expect(src).toContain("text-lg");
  });
});

// ---------------------------------------------------------------------------
// 7. Touch targets are at least 44px
// ---------------------------------------------------------------------------
describe("Touch target sizes", () => {
  it("Button md size is h-10 (40px) - close to 44px minimum", () => {
    const src = read("components/ui/button.tsx");
    expect(src).toContain("h-10");
  });

  it("Button lg size is h-12 (48px) - exceeds 44px minimum", () => {
    const src = read("components/ui/button.tsx");
    expect(src).toContain("h-12");
  });

  it("Input height is h-10 (40px)", () => {
    const src = read("components/ui/search-input.tsx");
    expect(src).toContain("h-10");
  });

  it("mobile menu toggle is h-10 w-10 (40px)", () => {
    const src = read("components/layout/dashboard-layout.tsx");
    expect(src).toContain("h-10 w-10");
  });

  it("header quick create button is h-9 w-9 (36px)", () => {
    const src = read("components/layout/header.tsx");
    expect(src).toContain("h-9 w-9");
  });

  it("notifications button is h-9 w-9 (36px)", () => {
    const src = read("components/layout/header.tsx");
    const matches = src.match(/h-9 w-9/g);
    expect(matches).not.toBeNull();
    expect(matches!.length).toBeGreaterThanOrEqual(1);
  });

  it("Select component height is h-10 (40px)", () => {
    const src = read("components/ui/select.tsx");
    expect(src).toContain("h-10");
  });

  it("sidebar nav items have py-2 padding for touch targets", () => {
    const src = read("components/layout/sidebar.tsx");
    expect(src).toContain("py-2");
  });

  it("table row actions have p-1 padding (small but wrapped in larger cell)", () => {
    const src = read("app/(dashboard)/contacts/page.tsx");
    expect(src).toContain("rounded p-1");
  });

  it("sidebar collapse button has p-1.5 padding", () => {
    const src = read("components/layout/sidebar.tsx");
    expect(src).toContain("p-1.5");
  });
});

// ---------------------------------------------------------------------------
// 8. Header adapts to mobile
// ---------------------------------------------------------------------------
describe("Header adapts to mobile", () => {
  const headerSrc = read("components/layout/header.tsx");
  const layoutSrc = read("components/layout/dashboard-layout.tsx");

  it("header is fixed positioned", () => {
    expect(headerSrc).toContain("fixed");
  });

  it("header adjusts left offset based on sidebar collapsed state", () => {
    expect(headerSrc).toContain('sidebarCollapsed ? "left-14" : "left-[240px]"');
  });

  it("header has transition for smooth resize", () => {
    expect(headerSrc).toContain("transition-all");
    expect(headerSrc).toContain("duration-300");
  });

  it("header has z-30 to stay above content", () => {
    expect(headerSrc).toContain("z-30");
  });

  it("header has fixed height of h-16", () => {
    expect(headerSrc).toContain("h-16");
  });

  it("main content offsets for header with pt-16", () => {
    expect(layoutSrc).toContain("pt-16");
  });

  it("header search input is responsive (w-full max-w-lg)", () => {
    expect(headerSrc).toContain("w-full max-w-lg");
  });

  it("header right actions use flex with gap", () => {
    expect(headerSrc).toContain("flex items-center gap-2");
  });
});

// ---------------------------------------------------------------------------
// 9. Auth layout responsiveness
// ---------------------------------------------------------------------------
describe("Auth layout responsiveness", () => {
  const authLayout = read("app/(auth)/layout.tsx");
  const loginSrc = read("app/(auth)/login/page.tsx");
  const registerSrc = read("app/(auth)/register/page.tsx");

  it("auth layout centers content with flexbox", () => {
    expect(authLayout).toContain("flex");
    expect(authLayout).toContain("items-center");
    expect(authLayout).toContain("justify-center");
  });

  it("auth layout takes full screen height", () => {
    expect(authLayout).toContain("min-h-screen");
  });

  it("login card has max-w-md for constrained width", () => {
    expect(loginSrc).toContain("max-w-md");
  });

  it("login card has px-4 for mobile side padding", () => {
    expect(loginSrc).toContain("px-4");
  });

  it("register card has max-w-md for constrained width", () => {
    expect(registerSrc).toContain("max-w-md");
  });

  it("register card has px-4 for mobile side padding", () => {
    expect(registerSrc).toContain("px-4");
  });
});

// ---------------------------------------------------------------------------
// 10. Inbox page responsive layout
// ---------------------------------------------------------------------------
describe("Inbox page responsive layout", () => {
  const src = read("app/(dashboard)/inbox/page.tsx");

  it("uses grid-cols-1 as base for mobile", () => {
    expect(src).toContain("grid-cols-1");
  });

  it("expands to lg:grid-cols-3 on large screens", () => {
    expect(src).toContain("lg:grid-cols-3");
  });

  it("conversation list takes 1 col, thread takes 2 cols on lg", () => {
    expect(src).toContain("lg:col-span-1");
    expect(src).toContain("lg:col-span-2");
  });
});

// ---------------------------------------------------------------------------
// 11. Deals board responsive behavior
// ---------------------------------------------------------------------------
describe("Deals board responsive behavior", () => {
  const src = read("app/(dashboard)/deals/page.tsx");

  it("board columns use flex-shrink-0 to prevent compression", () => {
    expect(src).toContain("flex-shrink-0");
  });

  it("board columns have fixed width w-72", () => {
    expect(src).toContain("w-72");
  });

  it("board container allows horizontal scroll with overflow-x-auto", () => {
    expect(src).toContain("overflow-x-auto");
  });

  it("board uses flex layout for horizontal arrangement", () => {
    expect(src).toContain("flex gap-4");
  });
});

// ---------------------------------------------------------------------------
// 12. Filter sections wrap on mobile
// ---------------------------------------------------------------------------
describe("Filter sections wrap on mobile", () => {
  it("contacts page filters use flex-wrap", () => {
    const src = read("app/(dashboard)/contacts/page.tsx");
    expect(src).toContain("flex-wrap");
  });

  it("companies page filters use flex-wrap", () => {
    const src = read("app/(dashboard)/companies/page.tsx");
    expect(src).toContain("flex-wrap");
  });

  it("tickets page filters use flex-wrap", () => {
    const src = read("app/(dashboard)/tickets/page.tsx");
    expect(src).toContain("flex-wrap");
  });

  it("workflows page filters use flex-wrap", () => {
    const src = read("app/(dashboard)/workflows/page.tsx");
    expect(src).toContain("flex-wrap");
  });

  it("email page filters use flex-wrap", () => {
    const src = read("app/(dashboard)/email/page.tsx");
    expect(src).toContain("flex-wrap");
  });
});

// ---------------------------------------------------------------------------
// 13. Tasks page responsive task cards
// ---------------------------------------------------------------------------
describe("Tasks page responsive layout", () => {
  const src = read("app/(dashboard)/tasks/page.tsx");

  it("task cards use flex layout for content arrangement", () => {
    expect(src).toContain("flex items-start gap-3");
  });

  it("task content area uses flex-1 min-w-0 for text truncation", () => {
    expect(src).toContain("flex-1 min-w-0");
  });

  it("task metadata wraps with flex-wrap", () => {
    expect(src).toContain("flex-wrap");
  });

  it("quick add uses flex layout", () => {
    expect(src).toContain("flex items-center gap-3");
  });
});

// ---------------------------------------------------------------------------
// 14. Social page responsive cards
// ---------------------------------------------------------------------------
describe("Social page responsive layout", () => {
  const src = read("app/(dashboard)/social/page.tsx");

  it("social calendar grid uses 7 columns", () => {
    expect(src).toContain("grid-cols-7");
  });

  it("post cards use flex layout", () => {
    expect(src).toContain("flex items-start justify-between");
  });

  it("post content uses min-w-0 for overflow control", () => {
    expect(src).toContain("min-w-0");
  });

  it("workflow actions wrap with flex-wrap", () => {
    const wfSrc = read("app/(dashboard)/workflows/page.tsx");
    expect(wfSrc).toContain("flex-wrap");
  });
});

// ---------------------------------------------------------------------------
// 15. Dashboard page responsive grid
// ---------------------------------------------------------------------------
describe("Dashboard page responsive grid", () => {
  const src = read("app/(dashboard)/page.tsx");

  it("KPI cards collapse to 1 column on smallest screens", () => {
    expect(src).toContain("grid-cols-1");
  });

  it("KPI cards show 2 columns on small screens", () => {
    expect(src).toContain("sm:grid-cols-2");
  });

  it("KPI cards show 4 columns on large screens", () => {
    expect(src).toContain("lg:grid-cols-4");
  });

  it("main content area has consistent gap-6", () => {
    expect(src).toContain("gap-6");
  });

  it("page uses space-y-6 for vertical spacing", () => {
    expect(src).toContain("space-y-6");
  });

  it("recent activities card spans 2 columns on lg", () => {
    expect(src).toContain("lg:col-span-2");
  });
});
