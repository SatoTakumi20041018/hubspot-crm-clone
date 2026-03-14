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
const statsCard = read("components/ui/stats-card.tsx");
const modal = read("components/ui/modal.tsx");
const tabs = read("components/ui/tabs.tsx");
const dropdown = read("components/ui/dropdown-menu.tsx");
const select = read("components/ui/select.tsx");
const textarea = read("components/ui/textarea.tsx");
const tooltip = read("components/ui/tooltip.tsx");
const searchInput = read("components/ui/search-input.tsx");
const emptyState = read("components/ui/empty-state.tsx");
const sidebar = read("components/layout/sidebar.tsx");
const header = read("components/layout/header.tsx");
const pageHeader = read("components/layout/page-header.tsx");
const dashboardLayout = read("components/layout/dashboard-layout.tsx");
const table = read("components/ui/table.tsx");
const loginPage = read("app/(auth)/login/page.tsx");
const dashboardPage = read("app/(dashboard)/page.tsx");
const contactsPage = read("app/(dashboard)/contacts/page.tsx");

// ---------------------------------------------------------------------------
// 1. Button Sizes (padding)
// ---------------------------------------------------------------------------
describe("Button - Size Spacing", () => {
  it("small button height is h-8 (32px)", () => {
    expect(button).toContain("h-8");
  });

  it("small button horizontal padding is px-3 (12px)", () => {
    expect(button).toMatch(/sm:.*h-8 px-3/s);
  });

  it("medium button height is h-10 (40px)", () => {
    expect(button).toContain("h-10");
  });

  it("medium button horizontal padding is px-4 (16px)", () => {
    expect(button).toMatch(/md:.*h-10 px-4/s);
  });

  it("large button height is h-12 (48px)", () => {
    expect(button).toContain("h-12");
  });

  it("large button horizontal padding is px-6 (24px)", () => {
    expect(button).toMatch(/lg:.*h-12 px-6/s);
  });

  it("button base has gap-2 (8px) for icon spacing", () => {
    expect(button).toContain("gap-2");
  });
});

// ---------------------------------------------------------------------------
// 2. Badge Spacing
// ---------------------------------------------------------------------------
describe("Badge - Spacing", () => {
  it("badge has px-2.5 (10px) horizontal padding", () => {
    expect(badge).toContain("px-2.5");
  });

  it("badge has py-0.5 (2px) vertical padding", () => {
    expect(badge).toContain("py-0.5");
  });
});

// ---------------------------------------------------------------------------
// 3. Card Spacing
// ---------------------------------------------------------------------------
describe("Card - Spacing", () => {
  it("card header has p-6 (24px) padding", () => {
    expect(card).toMatch(/CardHeader[\s\S]*p-6/);
  });

  it("card header has space-y-1.5 (6px) internal spacing", () => {
    expect(card).toContain("space-y-1.5");
  });

  it("card content has p-6 pt-0 padding", () => {
    expect(card).toMatch(/CardContent[\s\S]*p-6 pt-0/);
  });

  it("card footer has p-6 pt-0 padding", () => {
    expect(card).toMatch(/CardFooter[\s\S]*p-6 pt-0/);
  });
});

// ---------------------------------------------------------------------------
// 4. Input Spacing
// ---------------------------------------------------------------------------
describe("Input - Spacing", () => {
  it("input has px-3 (12px) horizontal padding", () => {
    expect(input).toContain("px-3");
  });

  it("input has py-2 (8px) vertical padding", () => {
    expect(input).toContain("py-2");
  });

  it("input label has mb-1.5 (6px) bottom margin", () => {
    expect(input).toContain("mb-1.5");
  });

  it("input error message has mt-1 (4px) top margin", () => {
    expect(input).toContain("mt-1");
  });

  it("search input icon is left-3 (12px)", () => {
    expect(input).toContain("left-3");
  });

  it("search variant has pl-10 (40px) left padding for icon", () => {
    expect(input).toContain("pl-10");
  });
});

// ---------------------------------------------------------------------------
// 5. StatsCard Spacing
// ---------------------------------------------------------------------------
describe("StatsCard - Spacing", () => {
  it("stats card has p-6 (24px) padding", () => {
    expect(statsCard).toContain("p-6");
  });

  it("stats card value has mt-1 (4px) top margin", () => {
    expect(statsCard).toContain("mt-1");
  });

  it("stats card change section has mt-3 (12px) top margin", () => {
    expect(statsCard).toContain("mt-3");
  });

  it("stats card change items gap is gap-1.5 (6px)", () => {
    expect(statsCard).toContain("gap-1.5");
  });

  it("stats card icon wrapper has p-2.5 (10px) padding", () => {
    expect(statsCard).toContain("p-2.5");
  });
});

// ---------------------------------------------------------------------------
// 6. Modal Spacing
// ---------------------------------------------------------------------------
describe("Modal - Spacing", () => {
  it("modal header has p-6 pb-0 padding", () => {
    expect(modal).toContain("p-6 pb-0");
  });

  it("modal body has p-6 padding", () => {
    expect(modal).toMatch(/ModalBody[\s\S]*p-6/);
  });

  it("modal footer has px-6 py-4 padding", () => {
    expect(modal).toContain("px-6 py-4");
  });

  it("modal footer has gap-3 (12px) between actions", () => {
    expect(modal).toContain("gap-3");
  });

  it("modal close button is right-4 top-4", () => {
    expect(modal).toContain("right-4 top-4");
  });
});

// ---------------------------------------------------------------------------
// 7. Tabs Spacing
// ---------------------------------------------------------------------------
describe("Tabs - Spacing", () => {
  it("tab trigger has px-4 (16px) horizontal padding", () => {
    expect(tabs).toContain("px-4");
  });

  it("tab trigger has py-2.5 (10px) vertical padding", () => {
    expect(tabs).toContain("py-2.5");
  });

  it("tab content has mt-4 (16px) top margin", () => {
    expect(tabs).toContain("mt-4");
  });
});

// ---------------------------------------------------------------------------
// 8. Dropdown Spacing
// ---------------------------------------------------------------------------
describe("Dropdown - Spacing", () => {
  it("dropdown content has mt-1 (4px) top margin", () => {
    expect(dropdown).toContain("mt-1");
  });

  it("dropdown content has py-1 (4px) vertical padding", () => {
    expect(dropdown).toContain("py-1");
  });

  it("dropdown content min-width is 180px", () => {
    expect(dropdown).toContain("min-w-[180px]");
  });

  it("dropdown item has px-3 py-2 padding", () => {
    expect(dropdown).toContain("px-3 py-2");
  });

  it("dropdown separator has my-1 margin", () => {
    expect(dropdown).toContain("my-1");
  });
});

// ---------------------------------------------------------------------------
// 9. Select Spacing
// ---------------------------------------------------------------------------
describe("Select - Spacing", () => {
  it("select has h-10 (40px) height", () => {
    expect(select).toContain("h-10");
  });

  it("select has px-3 py-2 padding", () => {
    expect(select).toContain("px-3");
  });

  it("select has pr-10 right padding for chevron", () => {
    expect(select).toContain("pr-10");
  });

  it("select chevron is right-3 (12px) positioned", () => {
    expect(select).toContain("right-3");
  });

  it("select label has mb-1.5 bottom margin", () => {
    expect(select).toContain("mb-1.5");
  });

  it("select error has mt-1 top margin", () => {
    expect(select).toContain("mt-1");
  });
});

// ---------------------------------------------------------------------------
// 10. Textarea Spacing
// ---------------------------------------------------------------------------
describe("Textarea - Spacing", () => {
  it("textarea has min-h-[80px] minimum height", () => {
    expect(textarea).toContain("min-h-[80px]");
  });

  it("textarea has px-3 py-2 padding", () => {
    expect(textarea).toContain("px-3 py-2");
  });

  it("textarea label has mb-1.5 bottom margin", () => {
    expect(textarea).toContain("mb-1.5");
  });

  it("textarea footer has mt-1 top margin", () => {
    expect(textarea).toContain("mt-1");
  });
});

// ---------------------------------------------------------------------------
// 11. Tooltip Spacing
// ---------------------------------------------------------------------------
describe("Tooltip - Spacing", () => {
  it("tooltip has px-2.5 py-1.5 padding", () => {
    expect(tooltip).toContain("px-2.5 py-1.5");
  });

  it("tooltip top position has mb-2 (8px) margin", () => {
    expect(tooltip).toContain("mb-2");
  });

  it("tooltip bottom position has mt-2 (8px) margin", () => {
    expect(tooltip).toContain("mt-2");
  });

  it("tooltip left position has mr-2 (8px) margin", () => {
    expect(tooltip).toContain("mr-2");
  });

  it("tooltip right position has ml-2 (8px) margin", () => {
    expect(tooltip).toContain("ml-2");
  });
});

// ---------------------------------------------------------------------------
// 12. SearchInput Spacing
// ---------------------------------------------------------------------------
describe("SearchInput - Spacing", () => {
  it("search input has h-10 (40px) height", () => {
    expect(searchInput).toContain("h-10");
  });

  it("search input has pl-10 left padding for icon", () => {
    expect(searchInput).toContain("pl-10");
  });

  it("search input has pr-20 right padding for kbd", () => {
    expect(searchInput).toContain("pr-20");
  });

  it("search icon is left-3 positioned", () => {
    expect(searchInput).toContain("left-3");
  });

  it("search kbd is right-3 positioned", () => {
    expect(searchInput).toContain("right-3");
  });

  it("search kbd has px-1.5 py-0.5 padding", () => {
    expect(searchInput).toContain("px-1.5 py-0.5");
  });
});

// ---------------------------------------------------------------------------
// 13. EmptyState Spacing
// ---------------------------------------------------------------------------
describe("EmptyState - Spacing", () => {
  it("empty state has px-6 py-16 padding", () => {
    expect(emptyState).toContain("px-6 py-16");
  });

  it("empty state icon wrapper has mb-4 (16px) bottom margin", () => {
    expect(emptyState).toContain("mb-4");
  });

  it("empty state icon wrapper has p-4 (16px) padding", () => {
    expect(emptyState).toContain("p-4");
  });

  it("empty state description has mt-1 top margin", () => {
    expect(emptyState).toContain("mt-1");
  });

  it("empty state action button has mt-6 (24px) top margin", () => {
    expect(emptyState).toContain("mt-6");
  });
});

// ---------------------------------------------------------------------------
// 14. Sidebar Spacing
// ---------------------------------------------------------------------------
describe("Sidebar - Spacing", () => {
  it("sidebar width is w-[240px] expanded", () => {
    expect(sidebar).toContain("w-[240px]");
  });

  it("sidebar collapsed width is w-14 (56px)", () => {
    expect(sidebar).toContain("w-14");
  });

  it("sidebar header height is h-16 (64px)", () => {
    expect(sidebar).toContain("h-16");
  });

  it("sidebar header has px-4 padding", () => {
    expect(sidebar).toContain("px-4");
  });

  it("sidebar nav has px-2 py-3 padding", () => {
    expect(sidebar).toContain("px-2 py-3");
  });

  it("sidebar nav item has px-3 py-2 padding", () => {
    expect(sidebar).toContain("px-3 py-2");
  });

  it("sidebar nav item has gap-3 (12px) icon-text gap", () => {
    expect(sidebar).toContain("gap-3");
  });

  it("sidebar section has mt-3 (12px) top margin", () => {
    expect(sidebar).toContain("mt-3");
  });

  it("sidebar section label has px-3 py-1.5 padding", () => {
    expect(sidebar).toContain("px-3 py-1.5");
  });

  it("sidebar bottom settings has p-2 padding", () => {
    expect(sidebar).toContain("p-2");
  });
});

// ---------------------------------------------------------------------------
// 15. Header Spacing
// ---------------------------------------------------------------------------
describe("Header - Spacing", () => {
  it("header height is h-16 (64px)", () => {
    expect(header).toContain("h-16");
  });

  it("header has px-6 (24px) horizontal padding", () => {
    expect(header).toContain("px-6");
  });

  it("header right actions have gap-2 (8px)", () => {
    expect(header).toContain("gap-2");
  });

  it("header search input max-width is max-w-lg", () => {
    expect(header).toContain("max-w-lg");
  });

  it("header quick-create button is h-9 w-9", () => {
    expect(header).toContain("h-9 w-9");
  });

  it("header dropdown has mt-2 offset", () => {
    expect(header).toContain("mt-2");
  });

  it("header dropdown items have gap-2.5 icon-text spacing", () => {
    expect(header).toContain("gap-2.5");
  });

  it("header user info section has px-4 py-3 padding", () => {
    expect(header).toContain("px-4 py-3");
  });
});

// ---------------------------------------------------------------------------
// 16. PageHeader Spacing
// ---------------------------------------------------------------------------
describe("PageHeader - Spacing", () => {
  it("page header has mb-6 (24px) bottom margin", () => {
    expect(pageHeader).toContain("mb-6");
  });

  it("page header breadcrumbs have mb-3 (12px) margin", () => {
    expect(pageHeader).toContain("mb-3");
  });

  it("page header breadcrumb items have gap-1 (4px)", () => {
    expect(pageHeader).toContain("gap-1");
  });

  it("page header title row has gap-4 (16px)", () => {
    expect(pageHeader).toContain("gap-4");
  });

  it("page header tabs have mt-4 (16px) top margin", () => {
    expect(pageHeader).toContain("mt-4");
  });

  it("page header tabs have gap-6 (24px) between tabs", () => {
    expect(pageHeader).toContain("gap-6");
  });

  it("page header action buttons have gap-2 (8px)", () => {
    expect(pageHeader).toContain("gap-2");
  });
});

// ---------------------------------------------------------------------------
// 17. DashboardLayout Main Content Spacing
// ---------------------------------------------------------------------------
describe("DashboardLayout - Spacing", () => {
  it("main content has pt-16 (64px) for header", () => {
    expect(dashboardLayout).toContain("pt-16");
  });

  it("main content has p-6 (24px) inner padding", () => {
    expect(dashboardLayout).toContain("p-6");
  });

  it("sidebar collapsed offset is lg:pl-14 (56px)", () => {
    expect(dashboardLayout).toContain("lg:pl-14");
  });

  it("sidebar expanded offset is lg:pl-[240px]", () => {
    expect(dashboardLayout).toContain('lg:pl-[240px]');
  });
});

// ---------------------------------------------------------------------------
// 18. Table Spacing
// ---------------------------------------------------------------------------
describe("Table - Spacing", () => {
  it("table head has h-10 (40px) height", () => {
    expect(table).toContain("h-10");
  });

  it("table head has px-4 (16px) horizontal padding", () => {
    expect(table).toContain("px-4");
  });

  it("table cell has px-4 py-3 padding", () => {
    expect(table).toContain("px-4 py-3");
  });

  it("table sort icon gap is gap-1 (4px)", () => {
    expect(table).toContain("gap-1");
  });
});

// ---------------------------------------------------------------------------
// 19. Grid Gap Patterns
// ---------------------------------------------------------------------------
describe("Dashboard Page - Grid Gap Patterns", () => {
  it("KPI cards grid uses gap-4 (16px)", () => {
    expect(dashboardPage).toContain("gap-4");
  });

  it("main content grid uses gap-6 (24px)", () => {
    expect(dashboardPage).toContain("gap-6");
  });

  it("page sections use space-y-6 (24px)", () => {
    expect(dashboardPage).toContain("space-y-6");
  });
});

describe("Contacts Page - Grid Gap Patterns", () => {
  it("contacts page uses space-y-4 (16px) between sections", () => {
    expect(contactsPage).toContain("space-y-4");
  });

  it("contacts filters use gap-3 (12px)", () => {
    expect(contactsPage).toContain("gap-3");
  });
});

// ---------------------------------------------------------------------------
// 20. Login Page Spacing
// ---------------------------------------------------------------------------
describe("Login Page - Spacing", () => {
  it("login form uses space-y-5 (20px)", () => {
    expect(loginPage).toContain("space-y-5");
  });

  it("login card has p-8 (32px) padding", () => {
    expect(loginPage).toContain("p-8");
  });

  it("login header section has mb-8 (32px) margin", () => {
    expect(loginPage).toContain("mb-8");
  });

  it("login error has mb-4 margin", () => {
    expect(loginPage).toContain("mb-4");
  });

  it("login register link section has mt-6 margin", () => {
    expect(loginPage).toContain("mt-6");
  });

  it("login container max width is max-w-md", () => {
    expect(loginPage).toContain("max-w-md");
  });
});
