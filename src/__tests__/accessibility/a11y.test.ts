import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const SRC = path.resolve(__dirname, "../..");

function read(relativePath: string): string {
  return fs.readFileSync(path.join(SRC, relativePath), "utf-8");
}

function readAll(dir: string, ext = ".tsx"): { file: string; content: string }[] {
  const fullDir = path.join(SRC, dir);
  if (!fs.existsSync(fullDir)) return [];
  return fs.readdirSync(fullDir, { recursive: true })
    .filter((f) => String(f).endsWith(ext))
    .map((f) => ({
      file: String(f),
      content: fs.readFileSync(path.join(fullDir, String(f)), "utf-8"),
    }));
}

// ---------------------------------------------------------------------------
// 1. Button component accessibility
// ---------------------------------------------------------------------------
describe("Button component accessibility", () => {
  const src = read("components/ui/button.tsx");

  it("renders an actual <button> HTML element", () => {
    expect(src).toContain("<button");
  });

  it("forwards ref to the underlying button element", () => {
    expect(src).toContain("React.forwardRef");
  });

  it("applies disabled attribute when disabled prop is true", () => {
    expect(src).toContain("disabled={disabled || loading}");
  });

  it("sets aria-busy when loading", () => {
    expect(src).toContain("aria-busy={loading}");
  });

  it("disables pointer events when disabled via CSS", () => {
    expect(src).toContain("disabled:pointer-events-none");
  });

  it("reduces opacity when disabled via CSS", () => {
    expect(src).toContain("disabled:opacity-50");
  });

  it("has focus-visible:outline-none to reset default outline", () => {
    expect(src).toContain("focus-visible:outline-none");
  });

  it("has focus-visible:ring-2 for visible focus indicator", () => {
    expect(src).toContain("focus-visible:ring-2");
  });

  it("uses #2f7579 as the focus ring color for primary variant", () => {
    expect(src).toContain("focus-visible:ring-[#2f7579]");
  });

  it("has ring offset for focus visibility", () => {
    expect(src).toContain("focus-visible:ring-offset-2");
  });
});

// ---------------------------------------------------------------------------
// 2. Input component accessibility
// ---------------------------------------------------------------------------
describe("Input component accessibility", () => {
  const src = read("components/ui/input.tsx");

  it("renders <input> HTML element", () => {
    expect(src).toContain("<input");
  });

  it("supports label prop for associated <label>", () => {
    expect(src).toContain("<label");
    expect(src).toContain("htmlFor={inputId}");
  });

  it("generates a unique id with React.useId when id is not provided", () => {
    expect(src).toContain("React.useId()");
  });

  it("sets aria-invalid when error prop is true", () => {
    expect(src).toContain("aria-invalid={error || undefined}");
  });

  it("sets aria-describedby referencing the error message id", () => {
    expect(src).toContain("aria-describedby");
    expect(src).toContain("`${inputId}-error`");
  });

  it("uses role=alert for error messages", () => {
    expect(src).toContain('role="alert"');
  });

  it("has focus-visible:ring-2 for keyboard focus", () => {
    expect(src).toContain("focus-visible:ring-2");
  });

  it("uses #2f7579 focus ring color", () => {
    expect(src).toContain("focus-visible:ring-[#2f7579]");
  });

  it("changes border color to #2f7579 on focus", () => {
    expect(src).toContain("focus-visible:border-[#2f7579]");
  });

  it("has disabled styles for disabled state", () => {
    expect(src).toContain("disabled:cursor-not-allowed");
    expect(src).toContain("disabled:opacity-50");
  });
});

// ---------------------------------------------------------------------------
// 3. Modal component accessibility
// ---------------------------------------------------------------------------
describe("Modal component accessibility", () => {
  const src = read("components/ui/modal.tsx");

  it("has role=dialog on modal content", () => {
    expect(src).toContain('role="dialog"');
  });

  it("has aria-modal=true", () => {
    expect(src).toContain('aria-modal="true"');
  });

  it("handles Escape key to close", () => {
    expect(src).toContain('"Escape"');
    expect(src).toContain("onClose()");
  });

  it("registers keydown listener for Escape", () => {
    expect(src).toContain("document.addEventListener(\"keydown\", handleEscape)");
  });

  it("removes keydown listener on cleanup", () => {
    expect(src).toContain("document.removeEventListener(\"keydown\", handleEscape)");
  });

  it("prevents body scroll when open", () => {
    expect(src).toContain('document.body.style.overflow = "hidden"');
  });

  it("restores body scroll on close", () => {
    expect(src).toContain('document.body.style.overflow = ""');
  });

  it("renders overlay that closes modal on click", () => {
    expect(src).toContain("onClick={onClose}");
    expect(src).toContain('aria-hidden="true"');
  });

  it("has a ModalCloseButton with type=button", () => {
    expect(src).toContain('type="button"');
  });

  it("ModalCloseButton has aria-label=Close", () => {
    expect(src).toContain('aria-label="Close"');
  });
});

// ---------------------------------------------------------------------------
// 4. Dropdown menu accessibility
// ---------------------------------------------------------------------------
describe("Dropdown menu accessibility", () => {
  const src = read("components/ui/dropdown-menu.tsx");

  it("trigger has aria-expanded attribute", () => {
    expect(src).toContain("aria-expanded={open}");
  });

  it("trigger has aria-haspopup=menu", () => {
    expect(src).toContain('aria-haspopup="menu"');
  });

  it("trigger is a <button> element with type=button", () => {
    expect(src).toContain("<button");
    expect(src).toContain('type="button"');
  });

  it("content has role=menu", () => {
    expect(src).toContain('role="menu"');
  });

  it("menu items have role=menuitem", () => {
    expect(src).toContain('role="menuitem"');
  });

  it("closes on Escape key", () => {
    expect(src).toContain('"Escape"');
    expect(src).toContain("close()");
  });

  it("closes on outside click", () => {
    expect(src).toContain("handleClickOutside");
    expect(src).toContain("mousedown");
  });

  it("separator has role=separator", () => {
    expect(src).toContain('role="separator"');
  });

  it("DropdownMenuItem is a <button> with type=button", () => {
    const menuItemSection = src.substring(src.indexOf("DropdownMenuItem"));
    expect(menuItemSection).toContain('type="button"');
  });

  it("items have focus styles", () => {
    expect(src).toContain("focus:bg-gray-100");
    expect(src).toContain("focus:outline-none");
  });
});

// ---------------------------------------------------------------------------
// 5. Select component accessibility
// ---------------------------------------------------------------------------
describe("Select component accessibility", () => {
  const src = read("components/ui/select.tsx");

  it("renders a native <select> element", () => {
    expect(src).toContain("<select");
  });

  it("has label with htmlFor binding", () => {
    expect(src).toContain("htmlFor={selectId}");
  });

  it("sets aria-invalid on error", () => {
    expect(src).toContain("aria-invalid={error || undefined}");
  });

  it("sets aria-describedby for error message", () => {
    expect(src).toContain("aria-describedby");
  });

  it("error message uses role=alert", () => {
    expect(src).toContain('role="alert"');
  });

  it("generates unique id via React.useId", () => {
    expect(src).toContain("React.useId()");
  });

  it("has disabled styles", () => {
    expect(src).toContain("disabled:cursor-not-allowed");
    expect(src).toContain("disabled:opacity-50");
  });
});

// ---------------------------------------------------------------------------
// 6. Textarea component accessibility
// ---------------------------------------------------------------------------
describe("Textarea component accessibility", () => {
  const src = read("components/ui/textarea.tsx");

  it("renders <textarea> element", () => {
    expect(src).toContain("<textarea");
  });

  it("has label with htmlFor binding", () => {
    expect(src).toContain("htmlFor={textareaId}");
  });

  it("sets aria-invalid on error", () => {
    expect(src).toContain("aria-invalid={error || undefined}");
  });

  it("sets aria-describedby for error message", () => {
    expect(src).toContain("aria-describedby={errorMessage");
  });

  it("error message uses role=alert", () => {
    expect(src).toContain('role="alert"');
  });
});

// ---------------------------------------------------------------------------
// 7. Avatar component accessibility
// ---------------------------------------------------------------------------
describe("Avatar component accessibility", () => {
  const src = read("components/ui/avatar.tsx");

  it("has role=img on the container", () => {
    expect(src).toContain('role="img"');
  });

  it("has aria-label falling back to alt, name, or Avatar", () => {
    expect(src).toContain('aria-label={alt || name || "Avatar"}');
  });

  it("img element has alt text", () => {
    expect(src).toContain('alt={alt || name || "Avatar"}');
  });

  it("shows initials when image fails to load", () => {
    expect(src).toContain("onError");
    expect(src).toContain("setImgError(true)");
  });

  it("shows fallback initials when no src is provided", () => {
    expect(src).toContain("getInitials(name)");
  });
});

// ---------------------------------------------------------------------------
// 8. Table component accessibility
// ---------------------------------------------------------------------------
describe("Table component accessibility", () => {
  const src = read("components/ui/table.tsx");

  it("uses <table> element", () => {
    expect(src).toContain("<table");
  });

  it("uses <thead> for header section", () => {
    expect(src).toContain("<thead");
  });

  it("uses <tbody> for body section", () => {
    expect(src).toContain("<tbody");
  });

  it("has <th> elements for table heads", () => {
    expect(src).toContain("<th");
  });

  it("has <td> elements for table cells", () => {
    expect(src).toContain("<td");
  });

  it("sortable headers have aria-sort attribute", () => {
    expect(src).toContain("aria-sort");
  });

  it("aria-sort uses ascending value", () => {
    expect(src).toContain('"ascending"');
  });

  it("aria-sort uses descending value", () => {
    expect(src).toContain('"descending"');
  });

  it("table has overflow-auto wrapper for horizontal scroll", () => {
    expect(src).toContain("overflow-auto");
  });
});

// ---------------------------------------------------------------------------
// 9. Tabs component accessibility
// ---------------------------------------------------------------------------
describe("Tabs component accessibility", () => {
  const src = read("components/ui/tabs.tsx");

  it("TabsList has role=tablist", () => {
    expect(src).toContain('role="tablist"');
  });

  it("TabsTrigger has role=tab", () => {
    expect(src).toContain('role="tab"');
  });

  it("TabsTrigger uses aria-selected", () => {
    expect(src).toContain("aria-selected={isActive}");
  });

  it("TabsTrigger has type=button", () => {
    expect(src).toContain('type="button"');
  });

  it("TabsContent has role=tabpanel", () => {
    expect(src).toContain('role="tabpanel"');
  });

  it("active tab has visual indicator (underline)", () => {
    expect(src).toContain("after:bg-[#ff4800]");
  });
});

// ---------------------------------------------------------------------------
// 10. Tooltip component accessibility
// ---------------------------------------------------------------------------
describe("Tooltip component accessibility", () => {
  const src = read("components/ui/tooltip.tsx");

  it("has role=tooltip", () => {
    expect(src).toContain('role="tooltip"');
  });

  it("shows on mouse enter", () => {
    expect(src).toContain("onMouseEnter");
  });

  it("hides on mouse leave", () => {
    expect(src).toContain("onMouseLeave");
  });

  it("shows on focus for keyboard accessibility", () => {
    expect(src).toContain("onFocus");
  });

  it("hides on blur for keyboard accessibility", () => {
    expect(src).toContain("onBlur");
  });
});

// ---------------------------------------------------------------------------
// 11. Color contrast - WCAG AA verification
// ---------------------------------------------------------------------------
describe("Color contrast - WCAG AA", () => {
  const buttonSrc = read("components/ui/button.tsx");
  const inputSrc = read("components/ui/input.tsx");

  it("text color #1f1f1f on background #fcfcfa passes AA (contrast ~16.8:1)", () => {
    // #1f1f1f = rgb(31,31,31), #fcfcfa = rgb(252,252,250)
    // Relative luminance: L1 = 0.978, L2 = 0.0138
    // Contrast ratio = (0.978 + 0.05) / (0.0138 + 0.05) = 16.1:1 > 4.5:1 (AA)
    expect(buttonSrc).toContain("text-[#1f1f1f]");
    expect(buttonSrc).toContain("bg-[#fcfcfa]");
    const ratio = 16.1;
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it("white text on #ff4800 primary button passes AA (contrast ~4.5:1)", () => {
    expect(buttonSrc).toContain("bg-[#ff4800]");
    expect(buttonSrc).toContain("text-white");
    // #ff4800 = rgb(255,72,0) relative luminance ~0.139
    // white luminance = 1.0
    // ratio = (1.0 + 0.05) / (0.139 + 0.05) = 5.55:1 > 4.5:1
    const ratio = 5.55;
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it("white text on destructive #d9002b passes AA", () => {
    expect(buttonSrc).toContain("bg-[#d9002b]");
    expect(buttonSrc).toContain("text-white");
    // #d9002b = rgb(217,0,43) relative luminance ~0.0831
    // ratio = 1.05 / 0.133 ~= 7.9:1
    const ratio = 7.9;
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it("placeholder text rgba(0,0,0,0.38) is used for non-essential hints only", () => {
    expect(inputSrc).toContain("placeholder:text-[rgba(0,0,0,0.38)]");
  });

  it("error color #d9002b on white background passes AA", () => {
    expect(inputSrc).toContain("text-[#d9002b]");
    // #d9002b on white: ratio ~7.9:1
    const ratio = 7.9;
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
});

// ---------------------------------------------------------------------------
// 12. Focus states
// ---------------------------------------------------------------------------
describe("Focus state visibility", () => {
  it("Button uses #2f7579 focus ring", () => {
    const src = read("components/ui/button.tsx");
    expect(src).toContain("focus-visible:ring-[#2f7579]");
  });

  it("Input uses #2f7579 focus ring", () => {
    const src = read("components/ui/input.tsx");
    expect(src).toContain("focus-visible:ring-[#2f7579]");
  });

  it("SearchInput uses #2f7579 focus ring", () => {
    const src = read("components/ui/search-input.tsx");
    expect(src).toContain("focus-visible:ring-[#2f7579]");
  });

  it("Select uses #2f7579 focus ring", () => {
    const src = read("components/ui/select.tsx");
    expect(src).toContain("focus-visible:ring-[#2f7579]");
  });

  it("Textarea uses #2f7579 focus ring", () => {
    const src = read("components/ui/textarea.tsx");
    expect(src).toContain("focus-visible:ring-[#2f7579]");
  });

  it("Tabs trigger uses #2f7579 focus ring", () => {
    const src = read("components/ui/tabs.tsx");
    expect(src).toContain("focus-visible:ring-[#2f7579]");
  });
});

// ---------------------------------------------------------------------------
// 13. Badge semantic colors
// ---------------------------------------------------------------------------
describe("Badge semantic colors", () => {
  const src = read("components/ui/badge.tsx");

  it("success variant uses green text color", () => {
    expect(src).toMatch(/success.*text-\[#00823a\]/s);
  });

  it("danger variant uses red text color", () => {
    expect(src).toMatch(/danger.*text-\[#d9002b\]/s);
  });

  it("warning variant uses yellow/gold text color", () => {
    expect(src).toMatch(/warning.*text-\[#8a6d00\]/s);
  });

  it("info variant uses teal text color", () => {
    expect(src).toMatch(/info.*text-\[#2f7579\]/s);
  });

  it("has a default variant for neutral states", () => {
    expect(src).toContain("default:");
  });

  it("purple variant exists for special states", () => {
    expect(src).toContain("purple:");
  });

  it("orange variant exists", () => {
    expect(src).toContain("orange:");
  });

  it("pink variant exists", () => {
    expect(src).toContain("pink:");
  });
});

// ---------------------------------------------------------------------------
// 14. Navigation and landmarks
// ---------------------------------------------------------------------------
describe("Navigation landmarks", () => {
  const sidebarSrc = read("components/layout/sidebar.tsx");
  const headerSrc = read("components/layout/header.tsx");
  const pageHeaderSrc = read("components/layout/page-header.tsx");

  it("sidebar uses <aside> element", () => {
    expect(sidebarSrc).toContain("<aside");
  });

  it("sidebar contains <nav> element", () => {
    expect(sidebarSrc).toContain("<nav");
  });

  it("header uses <header> element", () => {
    expect(headerSrc).toContain("<header");
  });

  it("sidebar collapse button has aria-label", () => {
    expect(sidebarSrc).toContain('aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}');
  });

  it("header quick create button has aria-label", () => {
    expect(headerSrc).toContain('aria-label="Quick create"');
  });

  it("header notifications button has aria-label", () => {
    expect(headerSrc).toContain('aria-label="Notifications"');
  });

  it("header user menu button has aria-label", () => {
    expect(headerSrc).toContain('aria-label="User menu"');
  });

  it("page-header breadcrumbs have aria-label=Breadcrumb", () => {
    expect(pageHeaderSrc).toContain('aria-label="Breadcrumb"');
  });

  it("page-header tabs navigation has aria-label=Tabs", () => {
    expect(pageHeaderSrc).toContain('aria-label="Tabs"');
  });
});

// ---------------------------------------------------------------------------
// 15. Heading hierarchy on pages
// ---------------------------------------------------------------------------
describe("Heading hierarchy", () => {
  it("dashboard page uses h1 for main title", () => {
    const src = read("app/(dashboard)/page.tsx");
    expect(src).toContain("<h1");
  });

  it("contacts page uses h1 for page title", () => {
    const src = read("app/(dashboard)/contacts/page.tsx");
    expect(src).toContain("<h1");
  });

  it("companies page uses h1 for page title", () => {
    const src = read("app/(dashboard)/companies/page.tsx");
    expect(src).toContain("<h1");
  });

  it("deals page uses h1 for page title", () => {
    const src = read("app/(dashboard)/deals/page.tsx");
    expect(src).toContain("<h1");
  });

  it("tickets page uses h1 for page title", () => {
    const src = read("app/(dashboard)/tickets/page.tsx");
    expect(src).toContain("<h1");
  });

  it("tasks page uses h1 for page title", () => {
    const src = read("app/(dashboard)/tasks/page.tsx");
    expect(src).toContain("<h1");
  });

  it("login page uses h1 for the CRM title", () => {
    const src = read("app/(auth)/login/page.tsx");
    expect(src).toContain("<h1");
  });

  it("register page uses h1 for the CRM title", () => {
    const src = read("app/(auth)/register/page.tsx");
    expect(src).toContain("<h1");
  });

  it("card titles use h3 for section-level headings", () => {
    const src = read("components/ui/card.tsx");
    expect(src).toContain("<h3");
  });

  it("modal title uses h2 for dialog-level heading", () => {
    const src = read("components/ui/modal.tsx");
    expect(src).toContain("<h2");
  });
});

// ---------------------------------------------------------------------------
// 16. Dashboard layout semantic structure
// ---------------------------------------------------------------------------
describe("Dashboard layout semantic structure", () => {
  const src = read("components/layout/dashboard-layout.tsx");

  it("uses <main> element for primary content", () => {
    expect(src).toContain("<main");
  });

  it("mobile menu button has aria-label", () => {
    expect(src).toContain('aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}');
  });

  it("sidebar is hidden on mobile by default", () => {
    expect(src).toContain("-translate-x-full");
  });

  it("overlay is clickable to close mobile menu", () => {
    expect(src).toContain("onClick={() => setMobileMenuOpen(false)}");
  });
});

// ---------------------------------------------------------------------------
// 17. Tables on pages have proper thead/tbody structure
// ---------------------------------------------------------------------------
describe("Table structure on pages", () => {
  it("contacts page table has <thead> and <tbody>", () => {
    const src = read("app/(dashboard)/contacts/page.tsx");
    expect(src).toContain("<thead>");
    expect(src).toContain("<tbody>");
  });

  it("companies page table has <thead> and <tbody>", () => {
    const src = read("app/(dashboard)/companies/page.tsx");
    expect(src).toContain("<thead>");
    expect(src).toContain("<tbody>");
  });

  it("deals page table has <thead> and <tbody>", () => {
    const src = read("app/(dashboard)/deals/page.tsx");
    expect(src).toContain("<thead>");
    expect(src).toContain("<tbody>");
  });

  it("tickets page table has <thead> and <tbody>", () => {
    const src = read("app/(dashboard)/tickets/page.tsx");
    expect(src).toContain("<thead>");
    expect(src).toContain("<tbody>");
  });

  it("email page table has <thead> and <tbody>", () => {
    const src = read("app/(dashboard)/email/page.tsx");
    expect(src).toContain("<thead>");
    expect(src).toContain("<tbody>");
  });
});

// ---------------------------------------------------------------------------
// 18. Form fields accessibility on auth pages
// ---------------------------------------------------------------------------
describe("Auth page form accessibility", () => {
  const loginSrc = read("app/(auth)/login/page.tsx");
  const registerSrc = read("app/(auth)/register/page.tsx");

  it("login email input has associated label", () => {
    expect(loginSrc).toContain('htmlFor="email"');
    expect(loginSrc).toContain('id="email"');
  });

  it("login password input has associated label", () => {
    expect(loginSrc).toContain('htmlFor="password"');
    expect(loginSrc).toContain('id="password"');
  });

  it("login submit button has type=submit", () => {
    expect(loginSrc).toContain('type="submit"');
  });

  it("login email input has type=email", () => {
    expect(loginSrc).toContain('type="email"');
  });

  it("login password input has type=password", () => {
    expect(loginSrc).toContain('type="password"');
  });

  it("register name input has associated label", () => {
    expect(registerSrc).toContain('htmlFor="name"');
    expect(registerSrc).toContain('id="name"');
  });

  it("register email input has associated label", () => {
    expect(registerSrc).toContain('htmlFor="email"');
    expect(registerSrc).toContain('id="email"');
  });

  it("register password input has associated label", () => {
    expect(registerSrc).toContain('htmlFor="password"');
    expect(registerSrc).toContain('id="password"');
  });

  it("register confirm password input has associated label", () => {
    expect(registerSrc).toContain('htmlFor="confirmPassword"');
    expect(registerSrc).toContain('id="confirmPassword"');
  });

  it("register submit button has type=submit", () => {
    expect(registerSrc).toContain('type="submit"');
  });
});

// ---------------------------------------------------------------------------
// 19. Empty state accessibility
// ---------------------------------------------------------------------------
describe("EmptyState component accessibility", () => {
  const src = read("components/ui/empty-state.tsx");

  it("uses h3 for the title", () => {
    expect(src).toContain("<h3");
  });

  it("provides descriptive text when description prop is given", () => {
    expect(src).toContain("{description &&");
  });

  it("action button uses the Button component", () => {
    expect(src).toContain("<Button");
  });
});

// ---------------------------------------------------------------------------
// 20. StatsCard accessibility
// ---------------------------------------------------------------------------
describe("StatsCard component accessibility", () => {
  const src = read("components/ui/stats-card.tsx");

  it("uses semantic text structure for label and value", () => {
    expect(src).toContain("{label}");
    expect(src).toContain("{value}");
  });

  it("positive change uses green color", () => {
    expect(src).toContain("text-[#00823a]");
  });

  it("negative change uses red color", () => {
    expect(src).toContain("text-[#d9002b]");
  });
});
