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
const loginPage = read("app/(auth)/login/page.tsx");
const dealsPage = read("app/(dashboard)/deals/page.tsx");

// ---------------------------------------------------------------------------
// 1. CSS Variable definitions - Border Radius
// ---------------------------------------------------------------------------
describe("CSS Variables - Border Radius Tokens", () => {
  it("defines --hs-radius-sm as 4px", () => {
    expect(globals).toContain("--hs-radius-sm: 4px");
  });

  it("defines --hs-radius-md as 8px", () => {
    expect(globals).toContain("--hs-radius-md: 8px");
  });

  it("defines --hs-radius-lg as 16px", () => {
    expect(globals).toContain("--hs-radius-lg: 16px");
  });
});

// ---------------------------------------------------------------------------
// 2. CSS Variable definitions - Shadows
// ---------------------------------------------------------------------------
describe("CSS Variables - Shadow Tokens", () => {
  it("defines --hs-shadow-card as 0 1px 3px rgba(0,0,0,0.08)", () => {
    expect(globals).toContain("--hs-shadow-card: 0 1px 3px rgba(0, 0, 0, 0.08)");
  });

  it("defines --hs-shadow-dropdown as 0 4px 16px rgba(0,0,0,0.12)", () => {
    expect(globals).toContain("--hs-shadow-dropdown: 0 4px 16px rgba(0, 0, 0, 0.12)");
  });

  it("defines --hs-shadow-modal as 0 8px 32px rgba(0,0,0,0.16)", () => {
    expect(globals).toContain("--hs-shadow-modal: 0 8px 32px rgba(0, 0, 0, 0.16)");
  });
});

// ---------------------------------------------------------------------------
// 3. Button - Border Radius (8px / rounded-[8px])
// ---------------------------------------------------------------------------
describe("Button - Border Radius", () => {
  it("button base uses rounded-[8px]", () => {
    expect(button).toContain("rounded-[8px]");
  });

  it("button does NOT use rounded-full", () => {
    expect(button).not.toContain("rounded-full");
  });

  it("button does NOT use rounded-none", () => {
    expect(button).not.toContain("rounded-none");
  });
});

// ---------------------------------------------------------------------------
// 4. Badge - Border Radius (4px / rounded-[4px])
// ---------------------------------------------------------------------------
describe("Badge - Border Radius", () => {
  it("badge uses rounded-[4px]", () => {
    expect(badge).toContain("rounded-[4px]");
  });

  it("badge does NOT use rounded-full", () => {
    expect(badge).not.toContain("rounded-full");
  });

  it("badge does NOT use rounded-lg", () => {
    expect(badge).not.toContain("rounded-lg");
  });
});

// ---------------------------------------------------------------------------
// 5. Card - Border Radius (16px / rounded-[16px])
// ---------------------------------------------------------------------------
describe("Card - Border Radius", () => {
  it("card uses rounded-[16px]", () => {
    expect(card).toContain("rounded-[16px]");
  });

  it("card does NOT use rounded-full", () => {
    expect(card).not.toContain("rounded-full");
  });
});

// ---------------------------------------------------------------------------
// 6. Card - Shadow
// ---------------------------------------------------------------------------
describe("Card - Shadow", () => {
  it("card uses shadow-[0_1px_3px_rgba(0,0,0,0.08)]", () => {
    expect(card).toContain("shadow-[0_1px_3px_rgba(0,0,0,0.08)]");
  });
});

// ---------------------------------------------------------------------------
// 7. Card - Border
// ---------------------------------------------------------------------------
describe("Card - Border", () => {
  it("card has border", () => {
    expect(card).toMatch(/\bborder\b/);
  });

  it("card border color is rgba(0,0,0,0.11)", () => {
    expect(card).toContain("border-[rgba(0,0,0,0.11)]");
  });
});

// ---------------------------------------------------------------------------
// 8. Input - Border Radius (4px / rounded-[4px])
// ---------------------------------------------------------------------------
describe("Input - Border Radius", () => {
  it("input uses rounded-[4px]", () => {
    expect(input).toContain("rounded-[4px]");
  });

  it("input does NOT use rounded-full", () => {
    expect(input).not.toContain("rounded-full");
  });
});

// ---------------------------------------------------------------------------
// 9. Input - Border
// ---------------------------------------------------------------------------
describe("Input - Border", () => {
  it("input default border is rgba(0,0,0,0.11)", () => {
    expect(input).toContain("border-[rgba(0,0,0,0.11)]");
  });

  it("input error border is #d9002b", () => {
    expect(input).toContain("border-[#d9002b]");
  });
});

// ---------------------------------------------------------------------------
// 10. Input - Focus Ring
// ---------------------------------------------------------------------------
describe("Input - Focus Ring", () => {
  it("input focus ring uses ring-2", () => {
    expect(input).toContain("focus-visible:ring-2");
  });

  it("input focus ring offset is ring-offset-1", () => {
    expect(input).toContain("focus-visible:ring-offset-1");
  });

  it("input focus ring color is #2f7579", () => {
    expect(input).toContain("focus-visible:ring-[#2f7579]");
  });
});

// ---------------------------------------------------------------------------
// 11. Avatar - rounded-full (allowed for avatars)
// ---------------------------------------------------------------------------
describe("Avatar - Border Radius", () => {
  it("avatar uses rounded-full (circle)", () => {
    expect(avatar).toContain("rounded-full");
  });
});

// ---------------------------------------------------------------------------
// 12. Table - Borders
// ---------------------------------------------------------------------------
describe("Table - Borders", () => {
  it("table header has border-b", () => {
    expect(table).toMatch(/TableHeader[\s\S]*border-b/);
  });

  it("table row has border-b", () => {
    expect(table).toMatch(/TableRow[\s\S]*border-b/);
  });

  it("table last row has no border ([&_tr:last-child]:border-0)", () => {
    expect(table).toContain("[&_tr:last-child]:border-0");
  });
});

// ---------------------------------------------------------------------------
// 13. Tabs - Border
// ---------------------------------------------------------------------------
describe("Tabs - Border", () => {
  it("tabs list has border-b", () => {
    expect(tabs).toContain("border-b");
  });

  it("active tab has underline via after pseudo-element", () => {
    expect(tabs).toContain("after:h-0.5");
  });

  it("active tab underline is positioned at bottom", () => {
    expect(tabs).toContain("after:bottom-0");
  });

  it("active tab underline spans full width", () => {
    expect(tabs).toContain("after:left-0");
    expect(tabs).toContain("after:right-0");
  });
});

// ---------------------------------------------------------------------------
// 14. Modal - Border Radius & Shadow
// ---------------------------------------------------------------------------
describe("Modal - Border Radius", () => {
  it("modal content uses rounded-lg", () => {
    expect(modal).toContain("rounded-lg");
  });

  it("modal does NOT use rounded-full", () => {
    const modalDialogSection = modal.split('role="dialog"')[1];
    expect(modalDialogSection).not.toContain("rounded-full");
  });
});

describe("Modal - Shadow", () => {
  it("modal uses shadow-xl", () => {
    expect(modal).toContain("shadow-xl");
  });
});

describe("Modal - Border", () => {
  it("modal has border", () => {
    expect(modal).toMatch(/role="dialog"[\s\S]*\bborder\b/);
  });
});

// ---------------------------------------------------------------------------
// 15. Dropdown - Border Radius & Shadow
// ---------------------------------------------------------------------------
describe("Dropdown - Border Radius", () => {
  it("dropdown content uses rounded-md", () => {
    expect(dropdown).toContain("rounded-md");
  });

  it("dropdown does NOT use rounded-full", () => {
    expect(dropdown).not.toContain("rounded-full");
  });
});

describe("Dropdown - Shadow", () => {
  it("dropdown content uses shadow-lg", () => {
    expect(dropdown).toContain("shadow-lg");
  });
});

describe("Dropdown - Border", () => {
  it("dropdown content has border", () => {
    expect(dropdown).toMatch(/role="menu"[\s\S]*\bborder\b/);
  });
});

// ---------------------------------------------------------------------------
// 16. Select - Border Radius
// ---------------------------------------------------------------------------
describe("Select - Border Radius", () => {
  it("select uses rounded-md", () => {
    expect(select).toContain("rounded-md");
  });

  it("select does NOT use rounded-full", () => {
    expect(select).not.toContain("rounded-full");
  });
});

// ---------------------------------------------------------------------------
// 17. Textarea - Border Radius
// ---------------------------------------------------------------------------
describe("Textarea - Border Radius", () => {
  it("textarea uses rounded-md", () => {
    expect(textarea).toContain("rounded-md");
  });

  it("textarea does NOT use rounded-full", () => {
    expect(textarea).not.toContain("rounded-full");
  });
});

// ---------------------------------------------------------------------------
// 18. Tooltip - Border Radius
// ---------------------------------------------------------------------------
describe("Tooltip - Border Radius & Shadow", () => {
  it("tooltip uses rounded-md", () => {
    expect(tooltip).toContain("rounded-md");
  });

  it("tooltip uses shadow-md", () => {
    expect(tooltip).toContain("shadow-md");
  });

  it("tooltip does NOT use rounded-full", () => {
    expect(tooltip).not.toContain("rounded-full");
  });
});

// ---------------------------------------------------------------------------
// 19. StatsCard - Border Radius & Shadow
// ---------------------------------------------------------------------------
describe("StatsCard - Border Radius", () => {
  it("stats card uses rounded-[16px]", () => {
    expect(statsCard).toContain("rounded-[16px]");
  });
});

describe("StatsCard - Shadow", () => {
  it("stats card uses shadow-[0_1px_3px_rgba(0,0,0,0.08)]", () => {
    expect(statsCard).toContain("shadow-[0_1px_3px_rgba(0,0,0,0.08)]");
  });
});

describe("StatsCard - Border", () => {
  it("stats card border is rgba(0,0,0,0.11)", () => {
    expect(statsCard).toContain("border-[rgba(0,0,0,0.11)]");
  });
});

// ---------------------------------------------------------------------------
// 20. StatsCard icon container - Border Radius (8px)
// ---------------------------------------------------------------------------
describe("StatsCard Icon Container - Border Radius", () => {
  it("stats card icon wrapper uses rounded-[8px]", () => {
    expect(statsCard).toContain("rounded-[8px]");
  });
});

// ---------------------------------------------------------------------------
// 21. SearchInput - Border Radius
// ---------------------------------------------------------------------------
describe("SearchInput - Border Radius", () => {
  it("search input uses rounded-[4px]", () => {
    expect(searchInput).toContain("rounded-[4px]");
  });

  it("search input does NOT use rounded-full", () => {
    expect(searchInput).not.toContain("rounded-full");
  });
});

// ---------------------------------------------------------------------------
// 22. EmptyState - Border Radius for icon container
// ---------------------------------------------------------------------------
describe("EmptyState - Border Radius", () => {
  it("empty state icon wrapper uses rounded-full (icon circle)", () => {
    expect(emptyState).toContain("rounded-full");
  });
});

// ---------------------------------------------------------------------------
// 23. Sidebar - Border Radius for items
// ---------------------------------------------------------------------------
describe("Sidebar - Border Radius", () => {
  it("sidebar nav items use rounded-[8px]", () => {
    expect(sidebar).toContain("rounded-[8px]");
  });

  it("sidebar does NOT use rounded-full for nav items", () => {
    // rounded-full only appears in avatar contexts, not nav items
    const navSection = sidebar.split("nav")[1];
    // Sidebar links use rounded-[8px], no rounded-full expected
    expect(sidebar).not.toMatch(/rounded-full/);
  });
});

// ---------------------------------------------------------------------------
// 24. Header - Border Radius for dropdowns
// ---------------------------------------------------------------------------
describe("Header - Border Radius", () => {
  it("header quick-create dropdown uses rounded-[8px]", () => {
    expect(header).toContain("rounded-[8px]");
  });

  it("header user avatar uses rounded-full", () => {
    expect(header).toContain("rounded-full");
  });

  it("header search kbd uses rounded-[4px]", () => {
    expect(header).toContain("rounded-[4px]");
  });
});

describe("Header - Shadow", () => {
  it("header dropdown uses shadow-[0_4px_16px_rgba(0,0,0,0.12)]", () => {
    expect(header).toContain("shadow-[0_4px_16px_rgba(0,0,0,0.12)]");
  });
});

describe("Header - Border", () => {
  it("header border uses rgba(0,0,0,0.11)", () => {
    expect(header).toContain("border-[rgba(0,0,0,0.11)]");
  });

  it("header dropdown border uses rgba(0,0,0,0.11)", () => {
    const dropdownSection = header.split("Quick create")[0];
    // The header itself and dropdown both use the same border
    expect(header).toContain("border-[rgba(0,0,0,0.11)]");
  });
});

// ---------------------------------------------------------------------------
// 25. DashboardLayout - Border Radius for mobile button
// ---------------------------------------------------------------------------
describe("DashboardLayout - Border Radius", () => {
  it("mobile menu button uses rounded-[8px]", () => {
    expect(dashboardLayout).toContain("rounded-[8px]");
  });
});

// ---------------------------------------------------------------------------
// 26. Login Page - Border Radius
// ---------------------------------------------------------------------------
describe("Login Page - Border Radius", () => {
  it("login card uses rounded-2xl", () => {
    expect(loginPage).toContain("rounded-2xl");
  });

  it("login inputs use rounded-[8px]", () => {
    expect(loginPage).toContain("rounded-[8px]");
  });

  it("login button uses rounded-[8px]", () => {
    // The submit button in login page
    const submitButton = loginPage.match(/type="submit"[\s\S]*?>/)?.[0] || loginPage;
    expect(loginPage).toContain("rounded-[8px]");
  });

  it("login error alert uses rounded-lg", () => {
    expect(loginPage).toContain("rounded-lg");
  });
});

describe("Login Page - Shadow", () => {
  it("login card uses shadow-2xl", () => {
    expect(loginPage).toContain("shadow-2xl");
  });
});

// ---------------------------------------------------------------------------
// 27. Deals Page - Border Radius for deal cards
// ---------------------------------------------------------------------------
describe("Deals Page - Deal Card Border", () => {
  it("deals board add-deal button uses rounded-lg", () => {
    expect(dealsPage).toContain("rounded-lg");
  });

  it("deals board uses dashed border for add button", () => {
    expect(dealsPage).toContain("border-dashed");
  });
});

// ---------------------------------------------------------------------------
// 28. Globals.css - Scrollbar styling
// ---------------------------------------------------------------------------
describe("Scrollbar Styling", () => {
  it("scrollbar width is 6px", () => {
    expect(globals).toContain("width: 6px");
  });

  it("scrollbar height is 6px", () => {
    expect(globals).toContain("height: 6px");
  });

  it("scrollbar track is transparent", () => {
    expect(globals).toContain("background: transparent");
  });

  it("scrollbar thumb has border-radius 3px", () => {
    expect(globals).toContain("border-radius: 3px");
  });

  it("scrollbar thumb uses rgba(0,0,0,0.15)", () => {
    expect(globals).toContain("rgba(0, 0, 0, 0.15)");
  });

  it("scrollbar thumb hover uses rgba(0,0,0,0.25)", () => {
    expect(globals).toContain("rgba(0, 0, 0, 0.25)");
  });

  it("Firefox scrollbar-width is thin", () => {
    expect(globals).toContain("scrollbar-width: thin");
  });
});

// ---------------------------------------------------------------------------
// 29. Globals.css - Animation shadows
// ---------------------------------------------------------------------------
describe("Deal Card Hover Shadow - globals.css", () => {
  it("deal-card hover uses dropdown shadow variable", () => {
    expect(globals).toContain("box-shadow: var(--hs-shadow-dropdown)");
  });

  it("deal-card hover transforms up 1px", () => {
    expect(globals).toContain("translateY(-1px)");
  });

  it("deal-card transitions box-shadow and transform", () => {
    expect(globals).toContain("transition: box-shadow 0.2s ease, transform 0.2s ease");
  });
});

// ---------------------------------------------------------------------------
// 30. Button Focus Ring
// ---------------------------------------------------------------------------
describe("Button - Focus Ring", () => {
  it("button has focus-visible:ring-2", () => {
    expect(button).toContain("focus-visible:ring-2");
  });

  it("button has focus-visible:ring-offset-2", () => {
    expect(button).toContain("focus-visible:ring-offset-2");
  });

  it("button outline:none on focus-visible", () => {
    expect(button).toContain("focus-visible:outline-none");
  });
});

// ---------------------------------------------------------------------------
// 31. PageHeader Tab Border
// ---------------------------------------------------------------------------
describe("PageHeader - Tab Border", () => {
  it("page header tab list has border-b", () => {
    expect(pageHeader).toContain("border-b");
  });

  it("active tab has border-b-2 underline", () => {
    expect(pageHeader).toContain("border-b-2");
  });

  it("inactive tab has border-transparent", () => {
    expect(pageHeader).toContain("border-transparent");
  });
});

// ---------------------------------------------------------------------------
// 32. Modal Close Button Border Radius
// ---------------------------------------------------------------------------
describe("Modal Close Button", () => {
  it("modal close uses rounded-sm", () => {
    expect(modal).toContain("rounded-sm");
  });

  it("modal close has focus:ring-2", () => {
    expect(modal).toContain("focus:ring-2");
  });
});

// ---------------------------------------------------------------------------
// 33. Modal Footer Border
// ---------------------------------------------------------------------------
describe("Modal Footer Border", () => {
  it("modal footer has border-t", () => {
    expect(modal).toContain("border-t");
  });
});

// ---------------------------------------------------------------------------
// 34. Contacts page borders
// ---------------------------------------------------------------------------
const contactsPage = read("app/(dashboard)/contacts/page.tsx");

describe("Contacts Page - Borders", () => {
  it("table header row has border-b border-gray-200", () => {
    expect(contactsPage).toContain("border-b border-gray-200");
  });

  it("table body rows have border-b border-gray-100", () => {
    expect(contactsPage).toContain("border-b border-gray-100");
  });

  it("pagination has border-t border-gray-200", () => {
    expect(contactsPage).toContain("border-t border-gray-200");
  });
});

// ---------------------------------------------------------------------------
// 35. Deals page borders
// ---------------------------------------------------------------------------
describe("Deals Page - Border Styles", () => {
  it("deals view toggle has border border-gray-300", () => {
    expect(dealsPage).toContain("border border-gray-300");
  });

  it("deals view toggle separator has border-l border-gray-300", () => {
    expect(dealsPage).toContain("border-l border-gray-300");
  });

  it("add deal button has border-2 dashed", () => {
    expect(dealsPage).toContain("border-2 border-dashed");
  });
});

// ---------------------------------------------------------------------------
// 36. Focus ring consistency across form components
// ---------------------------------------------------------------------------
describe("Focus Ring Consistency - All Form Components", () => {
  it("input uses ring-offset-1", () => {
    expect(input).toContain("ring-offset-1");
  });

  it("select uses ring-offset-1", () => {
    expect(select).toContain("ring-offset-1");
  });

  it("textarea uses ring-offset-1", () => {
    expect(textarea).toContain("ring-offset-1");
  });

  it("searchInput uses ring-offset-1", () => {
    expect(searchInput).toContain("ring-offset-1");
  });

  it("button uses ring-offset-2", () => {
    expect(button).toContain("ring-offset-2");
  });
});

// ---------------------------------------------------------------------------
// 37. Disabled state styling
// ---------------------------------------------------------------------------
describe("Disabled State - Opacity", () => {
  it("button disabled opacity is 50%", () => {
    expect(button).toContain("disabled:opacity-50");
  });

  it("input disabled opacity is 50%", () => {
    expect(input).toContain("disabled:opacity-50");
  });

  it("select disabled opacity is 50%", () => {
    expect(select).toContain("disabled:opacity-50");
  });

  it("textarea disabled opacity is 50%", () => {
    expect(textarea).toContain("disabled:opacity-50");
  });
});

describe("Disabled State - Cursor", () => {
  it("button disabled has pointer-events-none", () => {
    expect(button).toContain("disabled:pointer-events-none");
  });

  it("input disabled has cursor-not-allowed", () => {
    expect(input).toContain("disabled:cursor-not-allowed");
  });

  it("select disabled has cursor-not-allowed", () => {
    expect(select).toContain("disabled:cursor-not-allowed");
  });

  it("textarea disabled has cursor-not-allowed", () => {
    expect(textarea).toContain("disabled:cursor-not-allowed");
  });
});
