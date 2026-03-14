import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const headerPath = path.resolve(__dirname, "../../components/layout/header.tsx");
const headerContent = fs.readFileSync(headerPath, "utf-8");

describe("Header Structure - HubSpot 2026", () => {
  // =========================================================================
  // Search Bar
  // =========================================================================
  describe("Search bar", () => {
    it("should have a search input present", () => {
      expect(headerContent).toContain('<input');
    });

    it("should have search input with type text", () => {
      expect(headerContent).toContain('type="text"');
    });

    it("should have search placeholder text", () => {
      expect(headerContent).toContain('placeholder="Search..."');
    });

    it("should display Cmd+K keyboard shortcut hint", () => {
      expect(headerContent).toContain("Cmd+K");
    });

    it("should use kbd element for keyboard shortcut", () => {
      expect(headerContent).toContain("<kbd");
    });

    it("should use the Search icon from lucide-react", () => {
      expect(headerContent).toMatch(/import\s*\{[^}]*\bSearch\b/);
    });

    it("should render Search icon component", () => {
      expect(headerContent).toContain("<Search");
    });

    it("should have max-w-lg width constraint on search container", () => {
      expect(headerContent).toContain("max-w-lg");
    });

    it("should have search icon positioned absolutely inside input", () => {
      expect(headerContent).toContain("absolute left-3 top-1/2");
    });

    it("should have search input with padding-left for icon space", () => {
      expect(headerContent).toContain("pl-10");
    });

    it("should have search input with border styling", () => {
      expect(headerContent).toContain('border border-[rgba(0,0,0,0.11)]');
    });

    it("should have search input with focus ring for #2f7579", () => {
      expect(headerContent).toContain("focus:ring-[#2f7579]");
    });

    it("should have search input with focus border color", () => {
      expect(headerContent).toContain("focus:border-[#2f7579]");
    });

    it("should have rounded-[4px] on search input", () => {
      expect(headerContent).toContain("rounded-[4px]");
    });

    it("should have h-10 height on search input", () => {
      expect(headerContent).toContain("h-10 w-full");
    });

    it("should have bg-[#fcfcfa] background on search input", () => {
      expect(headerContent).toContain("bg-[#fcfcfa]");
    });

    it("should have kbd shortcut styled with border and bg", () => {
      expect(headerContent).toContain("bg-[#f8f5ee]");
    });

    it("should position kbd absolutely on the right side", () => {
      expect(headerContent).toContain("absolute right-3 top-1/2 -translate-y-1/2");
    });
  });

  // =========================================================================
  // Quick Create Button
  // =========================================================================
  describe("Quick create button", () => {
    it("should have a quick create button", () => {
      expect(headerContent).toContain('aria-label="Quick create"');
    });

    it("should use the Plus icon for quick create", () => {
      expect(headerContent).toMatch(/import\s*\{[^}]*\bPlus\b/);
    });

    it("should render Plus icon in the button", () => {
      expect(headerContent).toContain("<Plus");
    });

    it("should have orange background color #ff4800", () => {
      expect(headerContent).toContain("bg-[#ff4800]");
    });

    it("should have white text color on quick create button", () => {
      expect(headerContent).toContain("bg-[#ff4800] text-white");
    });

    it("should have hover state with darker orange", () => {
      expect(headerContent).toContain("hover:bg-[#c93700]");
    });

    it("should have active state with even darker orange", () => {
      expect(headerContent).toContain("active:bg-[#9f2800]");
    });

    it("should have h-9 w-9 dimensions", () => {
      expect(headerContent).toContain("h-9 w-9");
    });

    it("should have rounded-[8px] border radius", () => {
      expect(headerContent).toContain("rounded-[8px]");
    });

    it("should toggle quickCreateOpen state on click", () => {
      expect(headerContent).toContain("setQuickCreateOpen(!quickCreateOpen)");
    });

    it("should close user menu when opening quick create", () => {
      expect(headerContent).toContain("setUserMenuOpen(false)");
    });
  });

  // =========================================================================
  // Quick Create Dropdown
  // =========================================================================
  describe("Quick create dropdown", () => {
    it("should have quickCreateItems array defined", () => {
      expect(headerContent).toContain("const quickCreateItems");
    });

    it("should conditionally render dropdown when open", () => {
      expect(headerContent).toContain("quickCreateOpen && (");
    });

    it('should have Contact item in quick create', () => {
      expect(headerContent).toContain('label: "Contact"');
    });

    it('should have Contact linking to /contacts/new', () => {
      expect(headerContent).toContain('label: "Contact", href: "/contacts/new"');
    });

    it("should use Users icon for Contact quick create", () => {
      expect(headerContent).toContain('label: "Contact", href: "/contacts/new", icon: Users');
    });

    it('should have Company item in quick create', () => {
      expect(headerContent).toContain('label: "Company"');
    });

    it('should have Company linking to /companies/new', () => {
      expect(headerContent).toContain('label: "Company", href: "/companies/new"');
    });

    it("should use Building2 icon for Company quick create", () => {
      expect(headerContent).toContain('label: "Company", href: "/companies/new", icon: Building2');
    });

    it('should have Deal item in quick create', () => {
      expect(headerContent).toContain('label: "Deal"');
    });

    it('should have Deal linking to /deals/new', () => {
      expect(headerContent).toContain('label: "Deal", href: "/deals/new"');
    });

    it("should use Handshake icon for Deal quick create", () => {
      expect(headerContent).toContain('label: "Deal", href: "/deals/new", icon: Handshake');
    });

    it('should have Ticket item in quick create', () => {
      expect(headerContent).toContain('label: "Ticket"');
    });

    it('should have Ticket linking to /tickets/new', () => {
      expect(headerContent).toContain('label: "Ticket", href: "/tickets/new"');
    });

    it("should use Ticket icon for Ticket quick create", () => {
      expect(headerContent).toContain('label: "Ticket", href: "/tickets/new", icon: Ticket');
    });

    it("should have exactly 4 quick create items", () => {
      const items = headerContent.match(/quickCreateItems\s*=\s*\[([\s\S]*?)\]/);
      expect(items).not.toBeNull();
      const count = items![1].match(/\{[^}]*label:/g);
      expect(count).toHaveLength(4);
    });

    it('should show "Create new" label in dropdown', () => {
      expect(headerContent).toContain("Create new");
    });

    it("should have dropdown shadow styling", () => {
      expect(headerContent).toContain("shadow-[0_4px_16px_rgba(0,0,0,0.12)]");
    });

    it("should have w-48 width on dropdown", () => {
      expect(headerContent).toContain("w-48");
    });

    it("should close dropdown on item click", () => {
      expect(headerContent).toContain("onClick={() => setQuickCreateOpen(false)}");
    });
  });

  // =========================================================================
  // Notifications Bell
  // =========================================================================
  describe("Notifications bell", () => {
    it("should have a notifications button", () => {
      expect(headerContent).toContain('aria-label="Notifications"');
    });

    it("should use the Bell icon from lucide-react", () => {
      expect(headerContent).toMatch(/import\s*\{[^}]*\bBell\b/);
    });

    it("should render Bell icon component", () => {
      expect(headerContent).toContain("<Bell");
    });

    it("should have notification count state", () => {
      expect(headerContent).toContain("notificationCount");
    });

    it("should display badge when count > 0", () => {
      expect(headerContent).toContain("notificationCount > 0");
    });

    it("should show 9+ when count exceeds 9", () => {
      expect(headerContent).toContain('notificationCount > 9 ? "9+"');
    });

    it("should have red badge color #d9002b", () => {
      expect(headerContent).toContain("bg-[#d9002b]");
    });

    it("should have notification badge positioned absolutely", () => {
      expect(headerContent).toContain("absolute -right-0.5 -top-0.5");
    });

    it("should have rounded-full on notification badge", () => {
      expect(headerContent).toContain("rounded-full bg-[#d9002b]");
    });

    it("should have hover background on bell button", () => {
      expect(headerContent).toContain("hover:bg-[#f8f5ee]");
    });
  });

  // =========================================================================
  // User Avatar / Dropdown
  // =========================================================================
  describe("User avatar and dropdown", () => {
    it("should have a user menu button", () => {
      expect(headerContent).toContain('aria-label="User menu"');
    });

    it("should have user avatar circle with initials", () => {
      expect(headerContent).toContain("rounded-full bg-[#1f1f1f]");
    });

    it("should have h-8 w-8 dimensions for avatar", () => {
      expect(headerContent).toContain("h-8 w-8");
    });

    it("should display initial U in avatar", () => {
      expect(headerContent).toMatch(/>[\s\n]*U[\s\n]*</);
    });

    it("should use ChevronDown icon next to avatar", () => {
      expect(headerContent).toContain("<ChevronDown");
    });

    it("should toggle userMenuOpen state on click", () => {
      expect(headerContent).toContain("setUserMenuOpen(!userMenuOpen)");
    });

    it("should conditionally render user dropdown when open", () => {
      expect(headerContent).toContain("userMenuOpen && (");
    });

    it("should have user info section with name", () => {
      expect(headerContent).toContain("User Name");
    });

    it("should have user info section with email", () => {
      expect(headerContent).toContain("user@example.com");
    });

    it("should have Profile item in user menu", () => {
      expect(headerContent).toContain('label: "Profile"');
    });

    it("should have Profile linking to /settings/profile", () => {
      expect(headerContent).toContain('label: "Profile", href: "/settings/profile"');
    });

    it("should have Settings item in user menu", () => {
      expect(headerContent).toContain('label: "Settings", href: "/settings"');
    });

    it("should have Logout button in user dropdown", () => {
      expect(headerContent).toContain("Log out");
    });

    it("should use LogOut icon for logout", () => {
      expect(headerContent).toMatch(/import\s*\{[^}]*\bLogOut\b/);
    });

    it("should render LogOut icon", () => {
      expect(headerContent).toContain("<LogOut");
    });

    it("should have red text color on logout button", () => {
      expect(headerContent).toContain("text-[#d9002b]");
    });

    it("should have w-56 width on user dropdown", () => {
      expect(headerContent).toContain("w-56");
    });

    it("should have border divider in user dropdown", () => {
      expect(headerContent).toContain("border-t border-[rgba(0,0,0,0.11)]");
    });

    it("should have user info bordered bottom section", () => {
      expect(headerContent).toContain("border-b border-[rgba(0,0,0,0.11)]");
    });
  });

  // =========================================================================
  // Header Background & Border
  // =========================================================================
  describe("Header background and border", () => {
    it("should have white background", () => {
      expect(headerContent).toContain("bg-white");
    });

    it("should have border-bottom", () => {
      expect(headerContent).toContain("border-b border-[rgba(0,0,0,0.11)]");
    });

    it("should be a header element", () => {
      expect(headerContent).toContain("<header");
    });

    it("should have fixed positioning", () => {
      expect(headerContent).toContain("fixed right-0 top-0");
    });

    it("should have h-16 height", () => {
      expect(headerContent).toContain("h-16");
    });

    it("should have z-30 layer", () => {
      expect(headerContent).toContain("z-30");
    });

    it("should have px-6 horizontal padding", () => {
      expect(headerContent).toContain("px-6");
    });

    it("should have flex items-center justify-between layout", () => {
      expect(headerContent).toContain("flex h-16 items-center justify-between");
    });

    it("should adjust left position based on sidebar state", () => {
      expect(headerContent).toContain('sidebarCollapsed ? "left-14" : "left-[240px]"');
    });

    it("should have transition-all duration-300 for sidebar responsive offset", () => {
      expect(headerContent).toContain("transition-all duration-300");
    });
  });

  // =========================================================================
  // Click Outside Handling (Responsive Behavior)
  // =========================================================================
  describe("Responsive behavior and click outside handling", () => {
    it("should close dropdowns when clicking outside", () => {
      expect(headerContent).toContain("handleClickOutside");
    });

    it("should add mousedown event listener", () => {
      expect(headerContent).toContain('document.addEventListener("mousedown"');
    });

    it("should remove event listener on cleanup", () => {
      expect(headerContent).toContain('document.removeEventListener("mousedown"');
    });

    it("should use useRef for quickCreateRef", () => {
      expect(headerContent).toContain("quickCreateRef");
    });

    it("should use useRef for userMenuRef", () => {
      expect(headerContent).toContain("userMenuRef");
    });

    it("should check if click target is outside quick create dropdown", () => {
      expect(headerContent).toContain("quickCreateRef.current");
    });

    it("should check if click target is outside user menu dropdown", () => {
      expect(headerContent).toContain("userMenuRef.current");
    });

    it("should use useEffect for side effect setup", () => {
      expect(headerContent).toContain("useEffect");
    });

    it("should import useRef from react", () => {
      expect(headerContent).toContain("useRef");
    });

    it("should import useState from react", () => {
      expect(headerContent).toContain("useState");
    });
  });

  // =========================================================================
  // Icons from lucide-react
  // =========================================================================
  describe("Icon imports", () => {
    it("should import Search icon", () => {
      expect(headerContent).toMatch(/import\s*\{[^}]*\bSearch\b/);
    });

    it("should import Plus icon", () => {
      expect(headerContent).toMatch(/import\s*\{[^}]*\bPlus\b/);
    });

    it("should import Bell icon", () => {
      expect(headerContent).toMatch(/import\s*\{[^}]*\bBell\b/);
    });

    it("should import User icon", () => {
      expect(headerContent).toMatch(/import\s*\{[^}]*\bUser\b/);
    });

    it("should import Users icon", () => {
      expect(headerContent).toMatch(/import\s*\{[^}]*\bUsers\b/);
    });

    it("should import Building2 icon", () => {
      expect(headerContent).toMatch(/import\s*\{[^}]*\bBuilding2\b/);
    });

    it("should import Handshake icon", () => {
      expect(headerContent).toMatch(/import\s*\{[^}]*\bHandshake\b/);
    });

    it("should import Ticket icon", () => {
      expect(headerContent).toMatch(/import\s*\{[^}]*\bTicket\b/);
    });

    it("should import Settings icon", () => {
      expect(headerContent).toMatch(/import\s*\{[^}]*\bSettings\b/);
    });

    it("should import LogOut icon", () => {
      expect(headerContent).toMatch(/import\s*\{[^}]*\bLogOut\b/);
    });

    it("should import ChevronDown icon", () => {
      expect(headerContent).toMatch(/import\s*\{[^}]*\bChevronDown\b/);
    });

    it("should import all icons from lucide-react", () => {
      expect(headerContent).toContain('from "lucide-react"');
    });
  });
});
