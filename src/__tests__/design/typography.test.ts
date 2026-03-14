import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const SRC = path.resolve(__dirname, "../..");
const read = (rel: string) => fs.readFileSync(path.join(SRC, rel), "utf-8");

const globals = read("app/globals.css");
const rootLayout = read("app/layout.tsx");
const button = read("components/ui/button.tsx");
const badge = read("components/ui/badge.tsx");
const card = read("components/ui/card.tsx");
const input = read("components/ui/input.tsx");
const statsCard = read("components/ui/stats-card.tsx");
const modal = read("components/ui/modal.tsx");
const tabs = read("components/ui/tabs.tsx");
const sidebar = read("components/layout/sidebar.tsx");
const header = read("components/layout/header.tsx");
const pageHeader = read("components/layout/page-header.tsx");
const searchInput = read("components/ui/search-input.tsx");
const textarea = read("components/ui/textarea.tsx");
const select = read("components/ui/select.tsx");
const emptyState = read("components/ui/empty-state.tsx");
const tooltip = read("components/ui/tooltip.tsx");
const loginPage = read("app/(auth)/login/page.tsx");
const dashboardPage = read("app/(dashboard)/page.tsx");
const contactsPage = read("app/(dashboard)/contacts/page.tsx");

// ---------------------------------------------------------------------------
// 1. Font Family
// ---------------------------------------------------------------------------
describe("Font Family - Inter", () => {
  it("globals.css body font-family starts with Inter", () => {
    expect(globals).toMatch(/font-family:.*['"]Inter['"]/);
  });

  it("globals.css includes fallback Helvetica Neue", () => {
    expect(globals).toContain("Helvetica Neue");
  });

  it("globals.css includes fallback Arial", () => {
    expect(globals).toContain("Arial");
  });

  it("globals.css includes sans-serif as final fallback", () => {
    expect(globals).toContain("sans-serif");
  });

  it("root layout imports Inter from next/font/google", () => {
    expect(rootLayout).toContain('from "next/font/google"');
  });

  it("root layout creates Inter font instance", () => {
    expect(rootLayout).toMatch(/const\s+inter\s*=\s*Inter\(/);
  });

  it("root layout sets --font-inter variable", () => {
    expect(rootLayout).toContain('variable: "--font-inter"');
  });

  it("root layout applies inter.variable to body", () => {
    expect(rootLayout).toContain("inter.variable");
  });

  it("root layout includes latin subset", () => {
    expect(rootLayout).toContain('"latin"');
  });

  it("@theme inline maps --font-sans to --font-inter", () => {
    expect(globals).toContain("--font-sans: var(--font-inter)");
  });
});

// ---------------------------------------------------------------------------
// 2. Heading Sizes
// ---------------------------------------------------------------------------
describe("Heading Sizes in globals.css", () => {
  it("h1 font-size is 2rem", () => {
    expect(globals).toMatch(/h1\s*\{[^}]*font-size:\s*2rem/);
  });

  it("h2 font-size is 1.5rem", () => {
    expect(globals).toMatch(/h2\s*\{[^}]*font-size:\s*1\.5rem/);
  });

  it("h3 font-size is 1.25rem", () => {
    expect(globals).toMatch(/h3\s*\{[^}]*font-size:\s*1\.25rem/);
  });
});

// ---------------------------------------------------------------------------
// 3. Font Weights
// ---------------------------------------------------------------------------
describe("Font Weights in globals.css", () => {
  it("body font-weight is 400", () => {
    expect(globals).toMatch(/body\s*\{[^}]*font-weight:\s*400/);
  });

  it("h1 font-weight is 600", () => {
    expect(globals).toMatch(/h1\s*\{[^}]*font-weight:\s*600/);
  });

  it("h2 font-weight is 600", () => {
    expect(globals).toMatch(/h2\s*\{[^}]*font-weight:\s*600/);
  });

  it("h3 font-weight is 600", () => {
    expect(globals).toMatch(/h3\s*\{[^}]*font-weight:\s*600/);
  });
});

// ---------------------------------------------------------------------------
// 4. Line Height
// ---------------------------------------------------------------------------
describe("Line Height in globals.css", () => {
  it("body line-height is 1.5", () => {
    expect(globals).toMatch(/body\s*\{[^}]*line-height:\s*1\.5/);
  });
});

// ---------------------------------------------------------------------------
// 5. Body font-size
// ---------------------------------------------------------------------------
describe("Body Font Size", () => {
  it("body font-size is 1rem", () => {
    expect(globals).toMatch(/body\s*\{[^}]*font-size:\s*1rem/);
  });
});

// ---------------------------------------------------------------------------
// 6. Component Text Sizes
// ---------------------------------------------------------------------------
describe("Button - Text Sizes", () => {
  it("small button uses text-sm", () => {
    expect(button).toContain("text-sm");
  });

  it("medium button uses text-sm", () => {
    expect(button).toMatch(/md:.*text-sm/s);
  });

  it("large button uses text-base", () => {
    expect(button).toContain("text-base");
  });

  it("button base uses font-medium", () => {
    expect(button).toContain("font-medium");
  });
});

describe("Badge - Text Size", () => {
  it("badge uses text-xs", () => {
    expect(badge).toContain("text-xs");
  });

  it("badge uses font-medium", () => {
    expect(badge).toContain("font-medium");
  });
});

describe("Card - Text Sizes", () => {
  it("card title uses text-lg", () => {
    expect(card).toContain("text-lg");
  });

  it("card title uses font-semibold", () => {
    expect(card).toContain("font-semibold");
  });

  it("card description uses text-sm", () => {
    expect(card).toContain("text-sm");
  });
});

describe("Input - Text Sizes", () => {
  it("input uses text-sm", () => {
    expect(input).toContain("text-sm");
  });

  it("input label uses text-sm font-medium", () => {
    expect(input).toContain("text-sm font-medium");
  });

  it("input error message uses text-sm", () => {
    expect(input).toMatch(/errorMessage[\s\S]*text-sm/);
  });
});

describe("Select - Text Sizes", () => {
  it("select uses text-sm", () => {
    expect(select).toContain("text-sm");
  });

  it("select label uses text-sm font-medium", () => {
    expect(select).toContain("text-sm font-medium");
  });
});

describe("Textarea - Text Sizes", () => {
  it("textarea uses text-sm", () => {
    expect(textarea).toContain("text-sm");
  });

  it("textarea label uses text-sm font-medium", () => {
    expect(textarea).toContain("text-sm font-medium");
  });

  it("textarea character count uses text-xs", () => {
    expect(textarea).toContain("text-xs");
  });
});

describe("Tooltip - Text Size", () => {
  it("tooltip uses text-xs", () => {
    expect(tooltip).toContain("text-xs");
  });
});

describe("StatsCard - Text Sizes", () => {
  it("stats card label uses text-sm font-medium", () => {
    expect(statsCard).toContain("text-sm font-medium");
  });

  it("stats card value uses text-2xl font-bold", () => {
    expect(statsCard).toContain("text-2xl font-bold");
  });

  it("stats card change uses text-sm font-medium", () => {
    expect(statsCard).toMatch(/change[\s\S]*text-sm font-medium/);
  });
});

describe("Modal - Text Sizes", () => {
  it("modal title uses text-lg font-semibold", () => {
    expect(modal).toContain("text-lg font-semibold");
  });

  it("modal description uses text-sm", () => {
    expect(modal).toContain("text-sm");
  });
});

describe("Tabs - Text Sizes", () => {
  it("tab trigger uses text-sm font-medium", () => {
    expect(tabs).toContain("text-sm font-medium");
  });
});

describe("SearchInput - Text Size", () => {
  it("search input uses text-sm", () => {
    expect(searchInput).toContain("text-sm");
  });

  it("search kbd uses text-[10px]", () => {
    expect(searchInput).toContain("text-[10px]");
  });
});

describe("EmptyState - Text Sizes", () => {
  it("empty state title uses text-lg font-semibold", () => {
    expect(emptyState).toContain("text-lg font-semibold");
  });

  it("empty state description uses text-sm", () => {
    expect(emptyState).toContain("text-sm");
  });
});

describe("Sidebar - Text Sizes", () => {
  it("sidebar nav item uses text-sm", () => {
    expect(sidebar).toContain("text-sm");
  });

  it("sidebar section label uses text-[0.75rem]", () => {
    expect(sidebar).toContain("text-[0.75rem]");
  });

  it("sidebar logo uses text-xl font-bold", () => {
    expect(sidebar).toContain("text-xl font-bold");
  });

  it("sidebar section labels use uppercase", () => {
    expect(sidebar).toContain("uppercase");
  });

  it("sidebar section labels have tracking", () => {
    expect(sidebar).toContain("tracking-[0.05em]");
  });
});

describe("Header - Text Sizes", () => {
  it("header search uses text-sm", () => {
    expect(header).toContain("text-sm");
  });

  it("header dropdown section label uses text-[0.75rem]", () => {
    expect(header).toContain("text-[0.75rem]");
  });

  it("header notification count uses text-[10px]", () => {
    expect(header).toContain("text-[10px]");
  });

  it("header user name uses text-sm font-medium", () => {
    expect(header).toContain("text-sm font-medium");
  });

  it("header user email uses text-xs", () => {
    expect(header).toContain("text-xs");
  });

  it("header kbd uses text-xs", () => {
    expect(header).toContain("text-xs");
  });
});

describe("PageHeader - Text Sizes", () => {
  it("page header title uses text-2xl font-bold", () => {
    expect(pageHeader).toContain("text-2xl font-bold");
  });

  it("page header description uses text-sm", () => {
    expect(pageHeader).toContain("text-sm");
  });

  it("page header breadcrumb uses text-sm", () => {
    expect(pageHeader).toMatch(/Breadcrumb[\s\S]*text-sm/);
  });

  it("page header tab uses text-sm font-medium", () => {
    expect(pageHeader).toContain("text-sm font-medium");
  });

  it("page header tab count uses text-xs font-medium", () => {
    expect(pageHeader).toContain("text-xs font-medium");
  });
});

// ---------------------------------------------------------------------------
// 7. Pages consistent heading usage
// ---------------------------------------------------------------------------
describe("Dashboard Page - Heading Usage", () => {
  it("uses text-2xl font-bold for main heading", () => {
    expect(dashboardPage).toContain("text-2xl font-bold");
  });

  it("uses text-sm for subtitle", () => {
    expect(dashboardPage).toContain("text-sm");
  });
});

describe("Contacts Page - Heading Usage", () => {
  it("uses text-2xl font-bold for main heading", () => {
    expect(contactsPage).toContain("text-2xl font-bold");
  });

  it("uses text-sm for subtitle", () => {
    expect(contactsPage).toContain("text-sm");
  });
});

describe("Login Page - Heading Usage", () => {
  it("uses text-3xl font-bold for logo heading", () => {
    expect(loginPage).toContain("text-3xl font-bold");
  });

  it("uses text-sm for subtitle", () => {
    expect(loginPage).toContain("text-sm");
  });

  it("uses text-sm font-medium for labels", () => {
    expect(loginPage).toContain("text-sm font-medium");
  });

  it("uses text-sm font-semibold for submit button", () => {
    expect(loginPage).toContain("text-sm font-semibold");
  });
});

// ---------------------------------------------------------------------------
// 8. Antialiased text rendering
// ---------------------------------------------------------------------------
describe("Text Rendering", () => {
  it("root layout applies antialiased class", () => {
    expect(rootLayout).toContain("antialiased");
  });
});

// ---------------------------------------------------------------------------
// 9. Dropdown typography
// ---------------------------------------------------------------------------
const dropdown = read("components/ui/dropdown-menu.tsx");

describe("Dropdown - Text Sizes", () => {
  it("dropdown items use text-sm", () => {
    expect(dropdown).toContain("text-sm");
  });

  it("dropdown item text is text-gray-700", () => {
    expect(dropdown).toContain("text-gray-700");
  });

  it("dropdown destructive uses text-red-600", () => {
    expect(dropdown).toContain("text-red-600");
  });
});

// ---------------------------------------------------------------------------
// 10. Table typography
// ---------------------------------------------------------------------------
const table = read("components/ui/table.tsx");

describe("Table - Typography", () => {
  it("table base uses text-sm", () => {
    expect(table).toContain("text-sm");
  });

  it("table head uses text-xs", () => {
    expect(table).toContain("text-xs");
  });

  it("table head uses font-semibold", () => {
    expect(table).toContain("font-semibold");
  });

  it("table head uses uppercase", () => {
    expect(table).toContain("uppercase");
  });

  it("table head uses tracking-wider", () => {
    expect(table).toContain("tracking-wider");
  });

  it("table cell uses text-sm", () => {
    expect(table).toContain("text-sm");
  });

  it("table head text color is text-gray-500", () => {
    expect(table).toContain("text-gray-500");
  });

  it("table cell text color is text-gray-700", () => {
    expect(table).toContain("text-gray-700");
  });
});

// ---------------------------------------------------------------------------
// 11. Avatar typography
// ---------------------------------------------------------------------------
const avatar = read("components/ui/avatar.tsx");

describe("Avatar - Text Sizes per Size Variant", () => {
  it("sm uses text-xs for initials", () => {
    expect(avatar).toContain("text-xs");
  });

  it("md uses text-sm for initials", () => {
    expect(avatar).toContain("text-sm");
  });

  it("lg uses text-base for initials", () => {
    expect(avatar).toContain("text-base");
  });

  it("xl uses text-lg for initials", () => {
    expect(avatar).toContain("text-lg");
  });

  it("initials span uses font-medium", () => {
    expect(avatar).toContain("font-medium");
  });
});

// ---------------------------------------------------------------------------
// 12. Deals page typography
// ---------------------------------------------------------------------------
const dealsPage = read("app/(dashboard)/deals/page.tsx");

describe("Deals Page - Heading Usage", () => {
  it("uses text-2xl font-bold for main heading", () => {
    expect(dealsPage).toContain("text-2xl font-bold");
  });

  it("uses text-sm for deal board column headings", () => {
    expect(dealsPage).toContain("text-sm font-semibold");
  });

  it("uses text-xs for stage count", () => {
    expect(dealsPage).toContain("text-xs");
  });

  it("uses text-lg font-bold for deal amount", () => {
    expect(dealsPage).toContain("text-lg font-bold");
  });

  it("uses text-sm for deal card title", () => {
    expect(dealsPage).toContain("text-sm font-medium");
  });

  it("uses font-medium for table deal name", () => {
    expect(dealsPage).toContain("font-medium text-gray-900");
  });
});

// ---------------------------------------------------------------------------
// 13. Globals heading consistency
// ---------------------------------------------------------------------------
describe("Globals - Heading Declarations", () => {
  it("h1 declaration exists", () => {
    expect(globals).toMatch(/^h1\s*\{/m);
  });

  it("h2 declaration exists", () => {
    expect(globals).toMatch(/^h2\s*\{/m);
  });

  it("h3 declaration exists", () => {
    expect(globals).toMatch(/^h3\s*\{/m);
  });
});

// ---------------------------------------------------------------------------
// 14. DashboardLayout typography
// ---------------------------------------------------------------------------
const dashboardLayout = read("components/layout/dashboard-layout.tsx");

describe("DashboardLayout - No Direct Typography Overrides", () => {
  it("does not override font-family", () => {
    expect(dashboardLayout).not.toContain("font-family");
  });

  it("does not override font-size on body/main", () => {
    expect(dashboardLayout).not.toContain("font-size:");
  });
});

// ---------------------------------------------------------------------------
// 15. Globals body font declaration completeness
// ---------------------------------------------------------------------------
describe("Body Font Declaration - Completeness", () => {
  it("body font-family, font-size, font-weight, and line-height are all declared", () => {
    const bodyBlock = globals.match(/body\s*\{([^}]*)\}/)?.[1] || "";
    expect(bodyBlock).toContain("font-family:");
    expect(bodyBlock).toContain("font-size:");
    expect(bodyBlock).toContain("font-weight:");
    expect(bodyBlock).toContain("line-height:");
  });
});
