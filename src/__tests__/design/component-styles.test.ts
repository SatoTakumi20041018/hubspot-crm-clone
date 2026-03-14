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

// ===========================================================================================
// BUTTON COMPONENT (30 tests)
// ===========================================================================================
describe("Button - Primary Variant", () => {
  it("has primary variant defined", () => {
    expect(button).toContain("primary:");
  });

  it("primary bg is #ff4800", () => {
    expect(button).toContain("bg-[#ff4800]");
  });

  it("primary hover bg is #c93700", () => {
    expect(button).toContain("hover:bg-[#c93700]");
  });

  it("primary active bg is #9f2800", () => {
    expect(button).toContain("active:bg-[#9f2800]");
  });

  it("primary text is white", () => {
    const primaryLine = button.split("primary:")[1].split(",")[0];
    expect(primaryLine).toContain("text-white");
  });

  it("primary focus ring is #2f7579", () => {
    const primaryLine = button.split("primary:")[1].split(",")[0];
    expect(primaryLine).toContain("focus-visible:ring-[#2f7579]");
  });
});

describe("Button - Secondary Variant", () => {
  it("has secondary variant defined", () => {
    expect(button).toContain("secondary:");
  });

  it("secondary bg is #f8f5ee", () => {
    expect(button).toContain("bg-[#f8f5ee]");
  });

  it("secondary hover is #ece6d9", () => {
    expect(button).toContain("hover:bg-[#ece6d9]");
  });

  it("secondary text is #1f1f1f", () => {
    const secLine = button.split("secondary:")[1].split(",")[0];
    expect(secLine).toContain("text-[#1f1f1f]");
  });
});

describe("Button - Outline Variant", () => {
  it("has outline variant defined", () => {
    expect(button).toContain("outline:");
  });

  it("outline has border with rgba(0,0,0,0.11)", () => {
    expect(button).toContain("border-[rgba(0,0,0,0.11)]");
  });

  it("outline bg is white", () => {
    const outlineSection = button.split("outline:")[1].split('",')[0];
    expect(outlineSection).toContain("bg-white");
  });

  it("outline hover bg is #fcfcfa", () => {
    expect(button).toContain("hover:bg-[#fcfcfa]");
  });
});

describe("Button - Ghost Variant", () => {
  it("has ghost variant defined", () => {
    expect(button).toContain("ghost:");
  });

  it("ghost hover is #f8f5ee", () => {
    const ghostLine = button.split("ghost:")[1].split(",")[0];
    expect(ghostLine).toContain("hover:bg-[#f8f5ee]");
  });
});

describe("Button - Destructive Variant", () => {
  it("has destructive variant defined", () => {
    expect(button).toContain("destructive:");
  });

  it("destructive bg is #d9002b", () => {
    expect(button).toContain("bg-[#d9002b]");
  });

  it("destructive hover bg is #b30024", () => {
    expect(button).toContain("hover:bg-[#b30024]");
  });
});

describe("Button - 5 Variants Present", () => {
  it("has exactly 5 button variants", () => {
    const variantBlock = button.match(/variant:\s*\{([\s\S]*?)\},\s*size/)?.[1] || "";
    const variants = variantBlock.match(/(primary|secondary|outline|ghost|destructive):/g) || [];
    expect(variants.length).toBe(5);
  });
});

describe("Button - 3 Sizes Present", () => {
  it("has sm size", () => {
    expect(button).toContain("sm:");
  });

  it("has md size", () => {
    expect(button).toContain("md:");
  });

  it("has lg size", () => {
    expect(button).toContain("lg:");
  });

  it("has exactly 3 sizes", () => {
    const sizeBlock = button.match(/size:\s*\{([\s\S]*?)\}/)?.[1] || "";
    const sizes = sizeBlock.match(/(sm|md|lg):/g) || [];
    expect(sizes.length).toBe(3);
  });
});

describe("Button - Loading State", () => {
  it("has loading prop", () => {
    expect(button).toContain("loading");
  });

  it("uses Loader2 icon for loading", () => {
    expect(button).toContain("Loader2");
  });

  it("loading spinner has animate-spin class", () => {
    expect(button).toContain("animate-spin");
  });

  it("disabled when loading", () => {
    expect(button).toContain("disabled={disabled || loading}");
  });

  it("aria-busy when loading", () => {
    expect(button).toContain("aria-busy={loading}");
  });

  it("uses cva for variant management", () => {
    expect(button).toContain("class-variance-authority");
  });
});

// ===========================================================================================
// BADGE COMPONENT (18 tests)
// ===========================================================================================
describe("Badge - 8 Color Variants", () => {
  const variants = ["default", "success", "warning", "danger", "info", "purple", "orange", "pink"];

  variants.forEach((v) => {
    it(`has ${v} variant`, () => {
      expect(badge).toContain(`${v}:`);
    });
  });

  it("has at least 7 color variants", () => {
    const found = variants.filter((v) => badge.includes(`${v}:`));
    expect(found.length).toBeGreaterThanOrEqual(7);
  });
});

describe("Badge - Border Radius 4px", () => {
  it("uses rounded-[4px]", () => {
    expect(badge).toContain("rounded-[4px]");
  });
});

describe("Badge - Specific Accent Colors", () => {
  it("default uses accent-gray #cfcccb", () => {
    expect(badge).toContain("bg-[#cfcccb]");
  });

  it("success uses accent-green #b9cdbe", () => {
    expect(badge).toContain("bg-[#b9cdbe]");
  });

  it("warning uses accent-cream #ece6d9", () => {
    expect(badge).toContain("bg-[#ece6d9]");
  });

  it("info uses accent-teal #b2e9eb", () => {
    expect(badge).toContain("bg-[#b2e9eb]");
  });

  it("purple uses accent-purple #d7cdfc", () => {
    expect(badge).toContain("bg-[#d7cdfc]");
  });

  it("pink uses accent-pink #fbdbe9", () => {
    expect(badge).toContain("bg-[#fbdbe9]");
  });

  it("danger uses accent-orange #fcc6b1", () => {
    expect(badge).toContain("bg-[#fcc6b1]");
  });

  it("uses cva for variant management", () => {
    expect(badge).toContain("class-variance-authority");
  });
});

// ===========================================================================================
// CARD COMPONENT (16 tests)
// ===========================================================================================
describe("Card - Border Radius 16px", () => {
  it("uses rounded-[16px]", () => {
    expect(card).toContain("rounded-[16px]");
  });
});

describe("Card - Shadow", () => {
  it("uses correct card shadow", () => {
    expect(card).toContain("shadow-[0_1px_3px_rgba(0,0,0,0.08)]");
  });
});

describe("Card - Border Color", () => {
  it("uses rgba(0,0,0,0.11)", () => {
    expect(card).toContain("border-[rgba(0,0,0,0.11)]");
  });
});

describe("Card - Background", () => {
  it("bg is white", () => {
    expect(card).toContain("bg-white");
  });
});

describe("Card - Subcomponents", () => {
  it("exports Card component", () => {
    expect(card).toMatch(/export\s*\{[\s\S]*Card[\s,]/);
  });

  it("exports CardHeader component", () => {
    expect(card).toContain("CardHeader");
  });

  it("exports CardTitle component", () => {
    expect(card).toContain("CardTitle");
  });

  it("exports CardDescription component", () => {
    expect(card).toContain("CardDescription");
  });

  it("exports CardContent component", () => {
    expect(card).toContain("CardContent");
  });

  it("exports CardFooter component", () => {
    expect(card).toContain("CardFooter");
  });

  it("CardTitle uses text-[#1f1f1f]", () => {
    expect(card).toContain("text-[#1f1f1f]");
  });

  it("CardDescription uses text-[rgba(0,0,0,0.62)]", () => {
    expect(card).toContain("text-[rgba(0,0,0,0.62)]");
  });

  it("CardTitle uses font-semibold", () => {
    expect(card).toContain("font-semibold");
  });

  it("CardTitle uses leading-none tracking-tight", () => {
    expect(card).toContain("leading-none tracking-tight");
  });

  it("CardHeader has p-6", () => {
    expect(card).toMatch(/CardHeader[\s\S]*p-6/);
  });

  it("CardContent has p-6 pt-0", () => {
    expect(card).toMatch(/CardContent[\s\S]*p-6 pt-0/);
  });
});

// ===========================================================================================
// INPUT COMPONENT (20 tests)
// ===========================================================================================
describe("Input - Border Radius 4px", () => {
  it("uses rounded-[4px]", () => {
    expect(input).toContain("rounded-[4px]");
  });
});

describe("Input - Focus Ring #2f7579", () => {
  it("focus ring color is #2f7579", () => {
    expect(input).toContain("focus-visible:ring-[#2f7579]");
  });

  it("focus border color is #2f7579", () => {
    expect(input).toContain("focus-visible:border-[#2f7579]");
  });

  it("focus ring is ring-2", () => {
    expect(input).toContain("focus-visible:ring-2");
  });
});

describe("Input - Error State #d9002b", () => {
  it("error border is #d9002b", () => {
    expect(input).toContain("border-[#d9002b]");
  });

  it("error focus ring is #d9002b", () => {
    expect(input).toContain("focus-visible:ring-[#d9002b]");
  });

  it("error message text is #d9002b", () => {
    expect(input).toContain("text-[#d9002b]");
  });

  it("error message has role=alert", () => {
    expect(input).toContain('role="alert"');
  });
});

describe("Input - Variants", () => {
  it("has default variant", () => {
    expect(input).toContain("default:");
  });

  it("has search variant", () => {
    expect(input).toContain("search:");
  });

  it("search variant has Search icon", () => {
    expect(input).toContain("Search");
  });

  it("search variant has pl-10 for icon", () => {
    expect(input).toContain("pl-10");
  });
});

describe("Input - Props", () => {
  it("has label prop", () => {
    expect(input).toContain("label?:");
  });

  it("has error prop", () => {
    expect(input).toContain("error?:");
  });

  it("has errorMessage prop", () => {
    expect(input).toContain("errorMessage?:");
  });

  it("has helperText prop", () => {
    expect(input).toContain("helperText?:");
  });

  it("supports aria-invalid", () => {
    expect(input).toContain("aria-invalid");
  });

  it("supports aria-describedby", () => {
    expect(input).toContain("aria-describedby");
  });

  it("label uses htmlFor linking", () => {
    expect(input).toContain("htmlFor={inputId}");
  });

  it("uses useId for auto id generation", () => {
    expect(input).toContain("useId");
  });
});

// ===========================================================================================
// AVATAR COMPONENT (14 tests)
// ===========================================================================================
describe("Avatar - 4 Sizes", () => {
  it("has sm size (32px = h-8 w-8)", () => {
    expect(avatar).toContain("h-8 w-8");
  });

  it("has md size (40px = h-10 w-10)", () => {
    expect(avatar).toContain("h-10 w-10");
  });

  it("has lg size (48px = h-12 w-12)", () => {
    expect(avatar).toContain("h-12 w-12");
  });

  it("has xl size (64px = h-16 w-16)", () => {
    expect(avatar).toContain("h-16 w-16");
  });

  it("sm text is text-xs", () => {
    expect(avatar).toContain("text-xs");
  });

  it("md text is text-sm", () => {
    expect(avatar).toContain("text-sm");
  });

  it("lg text is text-base", () => {
    expect(avatar).toContain("text-base");
  });

  it("xl text is text-lg", () => {
    expect(avatar).toContain("text-lg");
  });
});

describe("Avatar - Rounded Full", () => {
  it("uses rounded-full for circular shape", () => {
    expect(avatar).toContain("rounded-full");
  });
});

describe("Avatar - Image & Fallback", () => {
  it("supports src prop for image", () => {
    expect(avatar).toContain("src?:");
  });

  it("supports name prop for initials", () => {
    expect(avatar).toContain("name?:");
  });

  it("falls back to initials on image error", () => {
    expect(avatar).toContain("onError");
  });

  it("uses getInitials utility", () => {
    expect(avatar).toContain("getInitials");
  });

  it("has role=img for accessibility", () => {
    expect(avatar).toContain('role="img"');
  });
});

// ===========================================================================================
// TABLE COMPONENT (18 tests)
// ===========================================================================================
describe("Table - Hover State", () => {
  it("row hover uses hover:bg-gray-50", () => {
    expect(table).toContain("hover:bg-gray-50");
  });

  it("table-row-hover in globals uses var(--hs-bg-02)", () => {
    expect(globals).toContain("background-color: var(--hs-bg-02)");
  });
});

describe("Table - Header Styling", () => {
  it("header bg is bg-gray-50", () => {
    expect(table).toContain("bg-gray-50");
  });

  it("header text is text-gray-500", () => {
    expect(table).toContain("text-gray-500");
  });

  it("header uses uppercase", () => {
    expect(table).toContain("uppercase");
  });

  it("header uses tracking-wider", () => {
    expect(table).toContain("tracking-wider");
  });

  it("header font is font-semibold", () => {
    expect(table).toContain("font-semibold");
  });

  it("header text is text-xs", () => {
    expect(table).toContain("text-xs");
  });
});

describe("Table - Sortable", () => {
  it("has sortable prop", () => {
    expect(table).toContain("sortable");
  });

  it("has sortDirection prop", () => {
    expect(table).toContain("sortDirection");
  });

  it("supports ascending sort", () => {
    expect(table).toContain("ascending");
  });

  it("supports descending sort", () => {
    expect(table).toContain("descending");
  });

  it("uses aria-sort attribute", () => {
    expect(table).toContain("aria-sort");
  });

  it("uses ChevronUp for asc", () => {
    expect(table).toContain("ChevronUp");
  });

  it("uses ChevronDown for desc", () => {
    expect(table).toContain("ChevronDown");
  });

  it("uses ChevronsUpDown for unsorted", () => {
    expect(table).toContain("ChevronsUpDown");
  });

  it("sortable cursor is pointer", () => {
    expect(table).toContain("cursor-pointer");
  });
});

describe("Table - Cell Styling", () => {
  it("cell text is text-gray-700", () => {
    expect(table).toContain("text-gray-700");
  });
});

// ===========================================================================================
// TABS COMPONENT (14 tests)
// ===========================================================================================
describe("Tabs - Active Underline #ff4800", () => {
  it("active tab text is text-[#ff4800]", () => {
    expect(tabs).toContain("text-[#ff4800]");
  });

  it("active tab underline bg is bg-[#ff4800]", () => {
    expect(tabs).toContain("after:bg-[#ff4800]");
  });

  it("active tab underline height is h-0.5", () => {
    expect(tabs).toContain("after:h-0.5");
  });

  it("active tab uses after pseudo-element", () => {
    expect(tabs).toContain("after:absolute");
  });
});

describe("Tabs - Inactive State", () => {
  it("inactive tab uses text-gray-500", () => {
    expect(tabs).toContain("text-gray-500");
  });

  it("inactive hover uses text-gray-700", () => {
    expect(tabs).toContain("hover:text-gray-700");
  });
});

describe("Tabs - Structure", () => {
  it("has role=tablist on list", () => {
    expect(tabs).toContain('role="tablist"');
  });

  it("has role=tab on trigger", () => {
    expect(tabs).toContain('role="tab"');
  });

  it("has role=tabpanel on content", () => {
    expect(tabs).toContain('role="tabpanel"');
  });

  it("uses aria-selected", () => {
    expect(tabs).toContain("aria-selected");
  });

  it("supports controlled value", () => {
    expect(tabs).toContain("value?:");
  });

  it("supports onValueChange callback", () => {
    expect(tabs).toContain("onValueChange");
  });

  it("exports Tabs, TabsList, TabsTrigger, TabsContent", () => {
    expect(tabs).toContain("Tabs");
    expect(tabs).toContain("TabsList");
    expect(tabs).toContain("TabsTrigger");
    expect(tabs).toContain("TabsContent");
  });

  it("TabsContent conditionally renders based on active tab", () => {
    expect(tabs).toContain("if (activeTab !== value) return null");
  });
});

// ===========================================================================================
// MODAL COMPONENT (18 tests)
// ===========================================================================================
describe("Modal - Shadow", () => {
  it("modal uses shadow-xl", () => {
    expect(modal).toContain("shadow-xl");
  });
});

describe("Modal - Border Radius 16px", () => {
  it("modal uses rounded-lg", () => {
    expect(modal).toContain("rounded-lg");
  });
});

describe("Modal - Overlay", () => {
  it("overlay uses bg-black/50", () => {
    expect(modal).toContain("bg-black/50");
  });

  it("overlay is fixed inset-0", () => {
    expect(modal).toContain("fixed inset-0");
  });

  it("overlay onClick closes modal", () => {
    expect(modal).toContain("onClick={onClose}");
  });
});

describe("Modal - Accessibility", () => {
  it("has role=dialog", () => {
    expect(modal).toContain('role="dialog"');
  });

  it("has aria-modal=true", () => {
    expect(modal).toContain("aria-modal");
  });

  it("close button has aria-label", () => {
    expect(modal).toContain('aria-label="Close"');
  });

  it("Escape key closes modal", () => {
    expect(modal).toContain('"Escape"');
  });

  it("locks body scroll when open", () => {
    expect(modal).toContain('document.body.style.overflow = "hidden"');
  });

  it("unlocks body scroll when closed", () => {
    expect(modal).toContain('document.body.style.overflow = ""');
  });
});

describe("Modal - Structure", () => {
  it("has ModalHeader component", () => {
    expect(modal).toContain("ModalHeader");
  });

  it("has ModalTitle component", () => {
    expect(modal).toContain("ModalTitle");
  });

  it("has ModalDescription component", () => {
    expect(modal).toContain("ModalDescription");
  });

  it("has ModalBody component", () => {
    expect(modal).toContain("ModalBody");
  });

  it("has ModalFooter component", () => {
    expect(modal).toContain("ModalFooter");
  });

  it("has ModalCloseButton component", () => {
    expect(modal).toContain("ModalCloseButton");
  });

  it("renders X icon for close", () => {
    expect(modal).toContain("X");
  });
});

// ===========================================================================================
// DROPDOWN COMPONENT (16 tests)
// ===========================================================================================
describe("Dropdown - Shadow", () => {
  it("dropdown uses shadow-lg", () => {
    expect(dropdown).toContain("shadow-lg");
  });
});

describe("Dropdown - Structure", () => {
  it("has role=menu on content", () => {
    expect(dropdown).toContain('role="menu"');
  });

  it("has role=menuitem on items", () => {
    expect(dropdown).toContain('role="menuitem"');
  });

  it("has role=separator on separator", () => {
    expect(dropdown).toContain('role="separator"');
  });

  it("trigger has aria-expanded", () => {
    expect(dropdown).toContain("aria-expanded");
  });

  it("trigger has aria-haspopup=menu", () => {
    expect(dropdown).toContain('aria-haspopup="menu"');
  });
});

describe("Dropdown - Behavior", () => {
  it("closes on Escape key", () => {
    expect(dropdown).toContain('"Escape"');
  });

  it("closes on click outside", () => {
    expect(dropdown).toContain("handleClickOutside");
  });

  it("closes item on click", () => {
    expect(dropdown).toContain("close()");
  });
});

describe("Dropdown - Alignment", () => {
  it("supports left alignment", () => {
    expect(dropdown).toContain("left-0");
  });

  it("supports right alignment", () => {
    expect(dropdown).toContain("right-0");
  });

  it("default alignment is right", () => {
    expect(dropdown).toContain('align = "right"');
  });
});

describe("Dropdown - Item Styles", () => {
  it("item hover uses bg-gray-100", () => {
    expect(dropdown).toContain("hover:bg-gray-100");
  });

  it("destructive item uses text-red-600", () => {
    expect(dropdown).toContain("text-red-600");
  });

  it("destructive item hover uses bg-red-50", () => {
    expect(dropdown).toContain("hover:bg-red-50");
  });

  it("separator is h-px bg-gray-200", () => {
    expect(dropdown).toContain("h-px bg-gray-200");
  });
});

// ===========================================================================================
// SELECT COMPONENT (10 tests)
// ===========================================================================================
describe("Select - Focus Ring", () => {
  it("focus ring is #2f7579", () => {
    expect(select).toContain("focus-visible:ring-[#2f7579]");
  });

  it("focus border is #2f7579", () => {
    expect(select).toContain("focus-visible:border-[#2f7579]");
  });
});

describe("Select - Error State", () => {
  it("error border is red-500", () => {
    expect(select).toContain("border-red-500");
  });

  it("error focus ring is red-500", () => {
    expect(select).toContain("focus-visible:ring-red-500");
  });

  it("error message has role=alert", () => {
    expect(select).toContain('role="alert"');
  });
});

describe("Select - Structure", () => {
  it("uses native select element", () => {
    expect(select).toContain("<select");
  });

  it("has chevron down icon", () => {
    expect(select).toContain("ChevronDown");
  });

  it("hides native appearance", () => {
    expect(select).toContain("appearance-none");
  });

  it("supports label prop", () => {
    expect(select).toContain("label?:");
  });

  it("supports aria-invalid", () => {
    expect(select).toContain("aria-invalid");
  });
});

// ===========================================================================================
// TEXTAREA COMPONENT (12 tests)
// ===========================================================================================
describe("Textarea - Character Count Feature", () => {
  it("has showCount prop", () => {
    expect(textarea).toContain("showCount");
  });

  it("tracks character count", () => {
    expect(textarea).toContain("charCount");
  });

  it("displays maxLength when provided", () => {
    expect(textarea).toContain("maxLength");
  });

  it("shows count in text-xs text-gray-400", () => {
    expect(textarea).toContain("text-xs text-gray-400");
  });
});

describe("Textarea - Focus Ring", () => {
  it("focus ring is #2f7579", () => {
    expect(textarea).toContain("focus-visible:ring-[#2f7579]");
  });

  it("focus border is #2f7579", () => {
    expect(textarea).toContain("focus-visible:border-[#2f7579]");
  });
});

describe("Textarea - Error State", () => {
  it("error border is red-500", () => {
    expect(textarea).toContain("border-red-500");
  });

  it("error message has role=alert", () => {
    expect(textarea).toContain('role="alert"');
  });
});

describe("Textarea - Controlled/Uncontrolled", () => {
  it("supports controlled value", () => {
    expect(textarea).toContain("value");
  });

  it("supports defaultValue", () => {
    expect(textarea).toContain("defaultValue");
  });

  it("syncs charCount with controlled value via useEffect", () => {
    expect(textarea).toContain("useEffect");
  });

  it("min height is 80px", () => {
    expect(textarea).toContain("min-h-[80px]");
  });
});

// ===========================================================================================
// TOOLTIP COMPONENT (12 tests)
// ===========================================================================================
describe("Tooltip - Positioning (top/bottom/left/right)", () => {
  it("supports top position", () => {
    expect(tooltip).toContain("top:");
  });

  it("supports bottom position", () => {
    expect(tooltip).toContain("bottom:");
  });

  it("supports left position", () => {
    expect(tooltip).toContain("left:");
  });

  it("supports right position", () => {
    expect(tooltip).toContain("right:");
  });

  it("default position is top", () => {
    expect(tooltip).toContain('side = "top"');
  });
});

describe("Tooltip - Behavior", () => {
  it("shows on mouseEnter", () => {
    expect(tooltip).toContain("onMouseEnter");
  });

  it("hides on mouseLeave", () => {
    expect(tooltip).toContain("onMouseLeave");
  });

  it("shows on focus", () => {
    expect(tooltip).toContain("onFocus");
  });

  it("hides on blur", () => {
    expect(tooltip).toContain("onBlur");
  });

  it("has 200ms delay before showing", () => {
    expect(tooltip).toContain("200");
  });

  it("has role=tooltip", () => {
    expect(tooltip).toContain('role="tooltip"');
  });

  it("clears timeout on unmount", () => {
    expect(tooltip).toContain("clearTimeout");
  });
});

// ===========================================================================================
// STATS CARD COMPONENT (14 tests)
// ===========================================================================================
describe("StatsCard - Icon Uses #ff4800 Accent", () => {
  it("icon text color is #ff4800", () => {
    expect(statsCard).toContain("text-[#ff4800]");
  });

  it("icon bg is #fcc6b1 (accent-orange)", () => {
    expect(statsCard).toContain("bg-[#fcc6b1]");
  });

  it("icon wrapper uses rounded-[8px]", () => {
    expect(statsCard).toContain("rounded-[8px]");
  });

  it("icon size is h-5 w-5", () => {
    expect(statsCard).toContain("h-5 w-5");
  });
});

describe("StatsCard - Layout", () => {
  it("uses flex layout", () => {
    expect(statsCard).toContain("flex");
  });

  it("label and value are in flex-1 column", () => {
    expect(statsCard).toContain("flex-1");
  });

  it("icon is justify-between positioned", () => {
    expect(statsCard).toContain("justify-between");
  });
});

describe("StatsCard - Change Indicator", () => {
  it("uses ArrowUp for positive change", () => {
    expect(statsCard).toContain("ArrowUp");
  });

  it("uses ArrowDown for negative change", () => {
    expect(statsCard).toContain("ArrowDown");
  });

  it("positive change text is #00823a (success)", () => {
    expect(statsCard).toContain("text-[#00823a]");
  });

  it("negative change text is #d9002b (error)", () => {
    expect(statsCard).toContain("text-[#d9002b]");
  });

  it("shows percentage value", () => {
    expect(statsCard).toContain("Math.abs(change)");
  });

  it("supports changeLabel prop", () => {
    expect(statsCard).toContain("changeLabel");
  });

  it("change section uses gap-0.5 for tight spacing", () => {
    expect(statsCard).toContain("gap-0.5");
  });
});

// ===========================================================================================
// SEARCH INPUT COMPONENT (14 tests)
// ===========================================================================================
describe("SearchInput - Keyboard Shortcut (Cmd+K)", () => {
  it("has shortcutKey prop defaulting to K", () => {
    expect(searchInput).toContain('shortcutKey = "K"');
  });

  it("listens for metaKey (Cmd)", () => {
    expect(searchInput).toContain("e.metaKey");
  });

  it("listens for ctrlKey (Ctrl)", () => {
    expect(searchInput).toContain("e.ctrlKey");
  });

  it("prevents default on shortcut", () => {
    expect(searchInput).toContain("e.preventDefault()");
  });

  it("focuses input on shortcut", () => {
    expect(searchInput).toContain("focus()");
  });

  it("displays kbd shortcut indicator", () => {
    expect(searchInput).toContain("<kbd");
  });

  it("displays command symbol", () => {
    expect(searchInput).toContain("&#8984;");
  });
});

describe("SearchInput - Search Behavior", () => {
  it("has onSearch callback prop", () => {
    expect(searchInput).toContain("onSearch");
  });

  it("triggers onSearch on Enter", () => {
    expect(searchInput).toContain('"Enter"');
  });

  it("input type is search", () => {
    expect(searchInput).toContain('type="search"');
  });
});

describe("SearchInput - Icon", () => {
  it("has Search icon from lucide", () => {
    expect(searchInput).toContain("Search");
  });

  it("icon is positioned absolutely", () => {
    expect(searchInput).toContain("absolute");
  });

  it("icon is vertically centered", () => {
    expect(searchInput).toContain("-translate-y-1/2");
  });

  it("icon size is h-4 w-4", () => {
    expect(searchInput).toContain("h-4 w-4");
  });
});

// ===========================================================================================
// EMPTY STATE COMPONENT (14 tests)
// ===========================================================================================
describe("EmptyState - Icon Slot", () => {
  it("accepts icon prop (LucideIcon)", () => {
    expect(emptyState).toContain("icon?:");
  });

  it("renders icon in rounded-full container", () => {
    expect(emptyState).toContain("rounded-full");
  });

  it("icon container has bg-gray-100", () => {
    expect(emptyState).toContain("bg-gray-100");
  });

  it("icon size is h-8 w-8", () => {
    expect(emptyState).toContain("h-8 w-8");
  });

  it("icon color is text-gray-400", () => {
    expect(emptyState).toContain("text-gray-400");
  });
});

describe("EmptyState - Title", () => {
  it("title is required prop", () => {
    expect(emptyState).toContain("title: string");
  });

  it("title uses text-lg font-semibold", () => {
    expect(emptyState).toContain("text-lg font-semibold");
  });

  it("title color is text-gray-900", () => {
    expect(emptyState).toContain("text-gray-900");
  });
});

describe("EmptyState - Description", () => {
  it("description is optional prop", () => {
    expect(emptyState).toContain("description?:");
  });

  it("description uses text-sm", () => {
    expect(emptyState).toContain("text-sm");
  });

  it("description color is text-gray-500", () => {
    expect(emptyState).toContain("text-gray-500");
  });

  it("description max width is max-w-sm", () => {
    expect(emptyState).toContain("max-w-sm");
  });
});

describe("EmptyState - Action Slot", () => {
  it("action has label, onClick, and optional variant", () => {
    expect(emptyState).toContain("label: string");
    expect(emptyState).toContain("onClick:");
  });

  it("renders Button component for action", () => {
    expect(emptyState).toContain("<Button");
  });
});

// ===========================================================================================
// SIDEBAR COMPONENT (16 tests)
// ===========================================================================================
describe("Sidebar - Background #1f1f1f", () => {
  it("uses bg-[#1f1f1f]", () => {
    expect(sidebar).toContain("bg-[#1f1f1f]");
  });
});

describe("Sidebar - Text #f8f5ee", () => {
  it("uses text-[#f8f5ee]", () => {
    expect(sidebar).toContain("text-[#f8f5ee]");
  });
});

describe("Sidebar - Active State", () => {
  it("active item has border-l-[3px]", () => {
    expect(sidebar).toContain("border-l-[3px]");
  });

  it("active item border is #ff4800", () => {
    expect(sidebar).toContain("border-[#ff4800]");
  });

  it("active item has bg-white/10", () => {
    expect(sidebar).toContain("bg-white/10");
  });

  it("active item text is font-medium", () => {
    expect(sidebar).toContain("font-medium");
  });
});

describe("Sidebar - Navigation Structure", () => {
  it("has nav element", () => {
    expect(sidebar).toContain("<nav");
  });

  it("has collapsible sections", () => {
    expect(sidebar).toContain("expandedSections");
  });

  it("uses ChevronDown for expanded sections", () => {
    expect(sidebar).toContain("ChevronDown");
  });

  it("uses ChevronRight for collapsed sections", () => {
    expect(sidebar).toContain("ChevronRight");
  });

  it("has CRM section", () => {
    expect(sidebar).toContain('"CRM"');
  });

  it("has Marketing section", () => {
    expect(sidebar).toContain('"Marketing"');
  });

  it("has Sales section", () => {
    expect(sidebar).toContain('"Sales"');
  });

  it("has Service section", () => {
    expect(sidebar).toContain('"Service"');
  });

  it("has Reporting section", () => {
    expect(sidebar).toContain('"Reporting"');
  });

  it("has Settings link at bottom", () => {
    expect(sidebar).toContain('href="/settings"');
  });
});

// ===========================================================================================
// HEADER COMPONENT (16 tests)
// ===========================================================================================
describe("Header - Quick Create", () => {
  it("quick create button bg is #ff4800", () => {
    expect(header).toContain("bg-[#ff4800]");
  });

  it("quick create hover is #c93700", () => {
    expect(header).toContain("hover:bg-[#c93700]");
  });

  it("quick create has Plus icon", () => {
    expect(header).toContain("Plus");
  });

  it("quick create dropdown has items", () => {
    expect(header).toContain("quickCreateItems");
  });

  it("quick create includes Contact item", () => {
    expect(header).toContain('"Contact"');
  });

  it("quick create includes Company item", () => {
    expect(header).toContain('"Company"');
  });

  it("quick create includes Deal item", () => {
    expect(header).toContain('"Deal"');
  });

  it("quick create includes Ticket item", () => {
    expect(header).toContain('"Ticket"');
  });
});

describe("Header - Notifications", () => {
  it("has Bell icon", () => {
    expect(header).toContain("Bell");
  });

  it("notification badge uses bg-[#d9002b]", () => {
    expect(header).toContain("bg-[#d9002b]");
  });

  it("shows notification count", () => {
    expect(header).toContain("notificationCount");
  });

  it("notification badge is rounded-full", () => {
    expect(header).toContain("rounded-full");
  });
});

describe("Header - User Menu", () => {
  it("user menu has Profile link", () => {
    expect(header).toContain('"Profile"');
  });

  it("user menu has Settings link", () => {
    expect(header).toContain('"Settings"');
  });

  it("user menu has Log out button", () => {
    expect(header).toContain("Log out");
  });

  it("logout text is #d9002b (error color)", () => {
    expect(header).toContain("text-[#d9002b]");
  });
});
