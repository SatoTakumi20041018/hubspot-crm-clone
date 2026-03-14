import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const SRC = path.resolve(__dirname, "../..");

function read(relativePath: string): string {
  return fs.readFileSync(path.join(SRC, relativePath), "utf-8");
}

// ---------------------------------------------------------------------------
// 1. sm breakpoint usage across pages
// ---------------------------------------------------------------------------
describe("sm breakpoint usage", () => {
  it("dashboard page uses sm: breakpoint for grid columns", () => {
    const src = read("app/(dashboard)/page.tsx");
    expect(src).toContain("sm:grid-cols-2");
  });

  it("tickets page uses sm: breakpoint for stats grid", () => {
    const src = read("app/(dashboard)/tickets/page.tsx");
    expect(src).toContain("sm:grid-cols-3");
  });

  it("email page uses sm: breakpoint for KPI cards", () => {
    const src = read("app/(dashboard)/email/page.tsx");
    expect(src).toContain("sm:grid-cols-4");
  });
});

// ---------------------------------------------------------------------------
// 2. lg breakpoint usage across pages
// ---------------------------------------------------------------------------
describe("lg breakpoint usage", () => {
  it("dashboard layout sidebar visible at lg", () => {
    const src = read("components/layout/dashboard-layout.tsx");
    expect(src).toContain("lg:translate-x-0");
  });

  it("dashboard layout hides mobile toggle at lg", () => {
    const src = read("components/layout/dashboard-layout.tsx");
    expect(src).toContain("lg:hidden");
  });

  it("dashboard layout adjusts main padding at lg", () => {
    const src = read("components/layout/dashboard-layout.tsx");
    expect(src).toContain("lg:pl-14");
    expect(src).toContain("lg:pl-[240px]");
  });

  it("dashboard page uses lg: for 4-column grid", () => {
    const src = read("app/(dashboard)/page.tsx");
    expect(src).toContain("lg:grid-cols-4");
  });

  it("dashboard page uses lg: for 3-column grid", () => {
    const src = read("app/(dashboard)/page.tsx");
    expect(src).toContain("lg:grid-cols-3");
  });

  it("dashboard page uses lg: for 2-column grid", () => {
    const src = read("app/(dashboard)/page.tsx");
    expect(src).toContain("lg:grid-cols-2");
  });

  it("inbox page uses lg: for 3-column grid", () => {
    const src = read("app/(dashboard)/inbox/page.tsx");
    expect(src).toContain("lg:grid-cols-3");
  });

  it("inbox conversation list uses lg:col-span-1", () => {
    const src = read("app/(dashboard)/inbox/page.tsx");
    expect(src).toContain("lg:col-span-1");
  });

  it("inbox thread uses lg:col-span-2", () => {
    const src = read("app/(dashboard)/inbox/page.tsx");
    expect(src).toContain("lg:col-span-2");
  });
});

// ---------------------------------------------------------------------------
// 3. Grid column changes at breakpoints
// ---------------------------------------------------------------------------
describe("Grid column changes at breakpoints", () => {
  it("dashboard KPI cards: 1 -> 2 (sm) -> 4 (lg)", () => {
    const src = read("app/(dashboard)/page.tsx");
    expect(src).toContain("grid-cols-1");
    expect(src).toContain("sm:grid-cols-2");
    expect(src).toContain("lg:grid-cols-4");
  });

  it("dashboard main grid: 1 -> 3 (lg)", () => {
    const src = read("app/(dashboard)/page.tsx");
    expect(src).toContain("grid grid-cols-1 gap-6 lg:grid-cols-3");
  });

  it("dashboard bottom grid: 1 -> 2 (lg)", () => {
    const src = read("app/(dashboard)/page.tsx");
    expect(src).toContain("grid grid-cols-1 gap-6 lg:grid-cols-2");
  });

  it("tickets stats: 1 -> 3 (sm)", () => {
    const src = read("app/(dashboard)/tickets/page.tsx");
    expect(src).toContain("grid-cols-1 gap-4 sm:grid-cols-3");
  });

  it("email KPI: 1 -> 4 (sm)", () => {
    const src = read("app/(dashboard)/email/page.tsx");
    expect(src).toContain("grid-cols-1 gap-4 sm:grid-cols-4");
  });

  it("inbox: 1 -> 3 (lg)", () => {
    const src = read("app/(dashboard)/inbox/page.tsx");
    expect(src).toContain("grid-cols-1 gap-0 lg:grid-cols-3");
  });
});

// ---------------------------------------------------------------------------
// 4. Sidebar collapse behavior
// ---------------------------------------------------------------------------
describe("Sidebar collapse behavior", () => {
  const sidebarSrc = read("components/layout/sidebar.tsx");
  const layoutSrc = read("components/layout/dashboard-layout.tsx");

  it("sidebar has two widths: w-14 collapsed and w-[240px] expanded", () => {
    expect(sidebarSrc).toContain('collapsed ? "w-14" : "w-[240px]"');
  });

  it("sidebar transitions width with duration-300", () => {
    expect(sidebarSrc).toContain("transition-all");
    expect(sidebarSrc).toContain("duration-300");
  });

  it("collapsed sidebar hides text labels", () => {
    expect(sidebarSrc).toContain("{!collapsed &&");
  });

  it("collapsed sidebar hides section headers", () => {
    expect(sidebarSrc).toContain("{!collapsed && (");
  });

  it("collapsed sidebar centers icons with justify-center", () => {
    expect(sidebarSrc).toContain('collapsed && "justify-center');
  });

  it("collapsed sidebar shows tooltip on links via title", () => {
    expect(sidebarSrc).toContain("title={collapsed ? item.label : undefined}");
  });

  it("layout manages collapsed state", () => {
    expect(layoutSrc).toContain("sidebarCollapsed");
    expect(layoutSrc).toContain("setSidebarCollapsed");
  });

  it("main content adjusts padding based on collapsed state", () => {
    expect(layoutSrc).toContain('sidebarCollapsed ? "lg:pl-14" : "lg:pl-[240px]"');
  });

  it("header adjusts left offset based on collapsed state", () => {
    const headerSrc = read("components/layout/header.tsx");
    expect(headerSrc).toContain('sidebarCollapsed ? "left-14" : "left-[240px]"');
  });
});

// ---------------------------------------------------------------------------
// 5. Table responsive handling
// ---------------------------------------------------------------------------
describe("Table responsive handling", () => {
  it("Table component uses overflow-auto wrapper", () => {
    const src = read("components/ui/table.tsx");
    expect(src).toContain("overflow-auto");
  });

  it("contacts page wraps table in overflow-x-auto", () => {
    const src = read("app/(dashboard)/contacts/page.tsx");
    expect(src).toContain("overflow-x-auto");
  });

  it("companies page wraps table in overflow-x-auto", () => {
    const src = read("app/(dashboard)/companies/page.tsx");
    expect(src).toContain("overflow-x-auto");
  });

  it("deals table wraps in overflow-x-auto", () => {
    const src = read("app/(dashboard)/deals/page.tsx");
    expect(src).toContain("overflow-x-auto");
  });

  it("tickets table wraps in overflow-x-auto", () => {
    const src = read("app/(dashboard)/tickets/page.tsx");
    expect(src).toContain("overflow-x-auto");
  });

  it("email table wraps in overflow-x-auto", () => {
    const src = read("app/(dashboard)/email/page.tsx");
    expect(src).toContain("overflow-x-auto");
  });

  it("table uses w-full for full width", () => {
    const src = read("components/ui/table.tsx");
    expect(src).toContain("w-full");
  });

  it("contacts page table uses w-full", () => {
    const src = read("app/(dashboard)/contacts/page.tsx");
    expect(src).toContain('className="w-full text-sm"');
  });
});

// ---------------------------------------------------------------------------
// 6. Mobile overlay only appears at mobile breakpoint
// ---------------------------------------------------------------------------
describe("Mobile overlay breakpoint behavior", () => {
  const src = read("components/layout/dashboard-layout.tsx");

  it("overlay uses lg:hidden to only show on mobile", () => {
    expect(src).toContain("lg:hidden");
  });

  it("sidebar starts hidden on mobile with -translate-x-full", () => {
    expect(src).toContain("-translate-x-full");
  });

  it("sidebar is always visible on lg with lg:translate-x-0", () => {
    expect(src).toContain("lg:translate-x-0");
  });
});

// ---------------------------------------------------------------------------
// 7. Filter layout responsive behavior
// ---------------------------------------------------------------------------
describe("Filter layout responsive behavior", () => {
  it("contacts page search input has fixed width w-72 (fits mobile)", () => {
    const src = read("app/(dashboard)/contacts/page.tsx");
    expect(src).toContain("w-72");
  });

  it("companies page search input has fixed width w-72", () => {
    const src = read("app/(dashboard)/companies/page.tsx");
    expect(src).toContain("w-72");
  });

  it("tickets page search input has fixed width w-72", () => {
    const src = read("app/(dashboard)/tickets/page.tsx");
    expect(src).toContain("w-72");
  });

  it("workflows page search input has fixed width w-72", () => {
    const src = read("app/(dashboard)/workflows/page.tsx");
    expect(src).toContain("w-72");
  });

  it("email page search input has fixed width w-72", () => {
    const src = read("app/(dashboard)/email/page.tsx");
    expect(src).toContain("w-72");
  });
});
