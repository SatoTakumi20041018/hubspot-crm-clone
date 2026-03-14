import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const dashboardLayoutPath = path.resolve(
  __dirname,
  "../../components/layout/dashboard-layout.tsx"
);
const sidebarPath = path.resolve(
  __dirname,
  "../../components/layout/sidebar.tsx"
);
const headerPath = path.resolve(
  __dirname,
  "../../components/layout/header.tsx"
);

const dashboardContent = fs.readFileSync(dashboardLayoutPath, "utf-8");
const sidebarContent = fs.readFileSync(sidebarPath, "utf-8");
const headerContent = fs.readFileSync(headerPath, "utf-8");

describe("Dashboard Layout", () => {
  // =========================================================================
  // Sidebar Width - Expanded and Collapsed
  // =========================================================================
  describe("Sidebar width", () => {
    it("should have 240px width when expanded", () => {
      expect(sidebarContent).toContain('w-[240px]');
    });

    it("should have w-14 (56px) width when collapsed", () => {
      expect(sidebarContent).toContain("w-14");
    });

    it("should toggle between collapsed and expanded based on prop", () => {
      expect(sidebarContent).toContain('collapsed ? "w-14" : "w-[240px]"');
    });

    it("should have main content left padding lg:pl-[240px] when expanded", () => {
      expect(dashboardContent).toContain('lg:pl-[240px]');
    });

    it("should have main content left padding lg:pl-14 when collapsed", () => {
      expect(dashboardContent).toContain('lg:pl-14');
    });

    it("should toggle main content padding based on sidebar state", () => {
      expect(dashboardContent).toContain('sidebarCollapsed ? "lg:pl-14" : "lg:pl-[240px]"');
    });

    it("should have header left offset left-[240px] when expanded", () => {
      expect(headerContent).toContain('left-[240px]');
    });

    it("should have header left offset left-14 when collapsed", () => {
      expect(headerContent).toContain('left-14');
    });

    it("should toggle header offset based on sidebar state", () => {
      expect(headerContent).toContain('sidebarCollapsed ? "left-14" : "left-[240px]"');
    });
  });

  // =========================================================================
  // Fixed Header
  // =========================================================================
  describe("Fixed header", () => {
    it("should render Header component", () => {
      expect(dashboardContent).toContain("<Header");
    });

    it("should pass sidebarCollapsed prop to Header", () => {
      expect(dashboardContent).toContain("sidebarCollapsed={sidebarCollapsed}");
    });

    it("should have header with fixed positioning", () => {
      expect(headerContent).toContain("fixed right-0 top-0");
    });

    it("should have header with z-30 layer", () => {
      expect(headerContent).toContain("z-30");
    });

    it("should have header with h-16 height", () => {
      expect(headerContent).toContain("h-16");
    });

    it("should offset main content with pt-16 for fixed header", () => {
      expect(dashboardContent).toContain("pt-16");
    });
  });

  // =========================================================================
  // Scrollable Main Content Area
  // =========================================================================
  describe("Scrollable main content area", () => {
    it("should have a main element", () => {
      expect(dashboardContent).toContain("<main");
    });

    it("should have min-h-screen on main content", () => {
      expect(dashboardContent).toContain("min-h-screen");
    });

    it("should have padding on main content area", () => {
      expect(dashboardContent).toContain("p-6");
    });

    it("should wrap children in a padded div", () => {
      expect(dashboardContent).toContain("{children}");
    });

    it("should have transition-all on main for sidebar animation", () => {
      expect(dashboardContent).toContain("transition-all duration-300");
    });
  });

  // =========================================================================
  // Responsive Mobile Handling
  // =========================================================================
  describe("Responsive mobile handling", () => {
    it("should have mobile menu state", () => {
      expect(dashboardContent).toContain("mobileMenuOpen");
    });

    it("should have mobile menu toggle button", () => {
      expect(dashboardContent).toContain("setMobileMenuOpen");
    });

    it("should have mobile overlay when menu is open", () => {
      expect(dashboardContent).toContain("mobileMenuOpen && (");
    });

    it("should have overlay with bg-black/50 and inset-0", () => {
      expect(dashboardContent).toContain("fixed inset-0 z-30 bg-black/50");
    });

    it("should restrict overlay to mobile with lg:hidden", () => {
      expect(dashboardContent).toContain("lg:hidden");
    });

    it("should close overlay on click", () => {
      expect(dashboardContent).toContain("onClick={() => setMobileMenuOpen(false)}");
    });

    it("should use Menu icon for mobile toggle", () => {
      expect(dashboardContent).toContain("<Menu");
    });

    it("should use X icon for mobile close", () => {
      expect(dashboardContent).toContain("<X");
    });

    it("should have mobile toggle with aria-label for open", () => {
      expect(dashboardContent).toContain('"Open menu"');
    });

    it("should have mobile toggle with aria-label for close", () => {
      expect(dashboardContent).toContain('"Close menu"');
    });

    it("should hide sidebar off-screen on mobile by default", () => {
      expect(dashboardContent).toContain("-translate-x-full");
    });

    it("should show sidebar on mobile when menu is open", () => {
      expect(dashboardContent).toContain("translate-x-0");
    });

    it("should always show sidebar on lg screens", () => {
      expect(dashboardContent).toContain("lg:translate-x-0");
    });

    it("should have mobile toggle button fixed positioning", () => {
      expect(dashboardContent).toContain("fixed left-4 top-4 z-50");
    });

    it("should have mobile toggle hidden on lg screens", () => {
      // The mobile toggle button itself has lg:hidden
      expect(dashboardContent).toMatch(/z-50.*lg:hidden/s);
    });

    it("should default pl-0 on mobile (no sidebar offset)", () => {
      expect(dashboardContent).toContain('"pl-0"');
    });
  });

  // =========================================================================
  // CSS Transitions
  // =========================================================================
  describe("CSS transitions", () => {
    it("should have transition-all on sidebar", () => {
      expect(sidebarContent).toContain("transition-all duration-300");
    });

    it("should have transition-all on header", () => {
      expect(headerContent).toContain("transition-all duration-300");
    });

    it("should have transition-all on main content", () => {
      expect(dashboardContent).toContain("transition-all duration-300");
    });

    it("should have transition-transform on sidebar wrapper", () => {
      expect(dashboardContent).toContain("transition-transform duration-300");
    });

    it("should use duration-300 consistently", () => {
      const sidebarTransitions = (sidebarContent.match(/duration-300/g) || []).length;
      expect(sidebarTransitions).toBeGreaterThan(0);
    });
  });

  // =========================================================================
  // Component Composition
  // =========================================================================
  describe("Component composition", () => {
    it("should import Sidebar component", () => {
      expect(dashboardContent).toContain('import { Sidebar }');
    });

    it("should import Header component", () => {
      expect(dashboardContent).toContain('import { Header }');
    });

    it("should import from ./sidebar", () => {
      expect(dashboardContent).toContain('from "./sidebar"');
    });

    it("should import from ./header", () => {
      expect(dashboardContent).toContain('from "./header"');
    });

    it("should export default DashboardLayout", () => {
      expect(dashboardContent).toContain("export default function DashboardLayout");
    });

    it("should accept children prop", () => {
      expect(dashboardContent).toContain("children");
    });

    it("should have DashboardLayoutProps interface", () => {
      expect(dashboardContent).toContain("DashboardLayoutProps");
    });

    it("should be a client component", () => {
      expect(dashboardContent).toContain('"use client"');
    });

    it("should have min-h-screen on root wrapper div", () => {
      expect(dashboardContent).toContain("min-h-screen bg-gray-50");
    });
  });
});
