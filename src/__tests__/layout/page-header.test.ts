import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const pageHeaderPath = path.resolve(
  __dirname,
  "../../components/layout/page-header.tsx"
);
const pageHeaderContent = fs.readFileSync(pageHeaderPath, "utf-8");

describe("PageHeader Component", () => {
  // =========================================================================
  // Breadcrumbs Support
  // =========================================================================
  describe("Breadcrumbs support", () => {
    it("should accept breadcrumbs prop", () => {
      expect(pageHeaderContent).toContain("breadcrumbs");
    });

    it("should define BreadcrumbItem interface", () => {
      expect(pageHeaderContent).toContain("interface BreadcrumbItem");
    });

    it("should have label field in BreadcrumbItem", () => {
      expect(pageHeaderContent).toContain("label: string");
    });

    it("should have optional href field in BreadcrumbItem", () => {
      expect(pageHeaderContent).toContain("href?: string");
    });

    it("should render breadcrumb nav element", () => {
      expect(pageHeaderContent).toContain('aria-label="Breadcrumb"');
    });

    it("should render breadcrumbs as ordered list", () => {
      expect(pageHeaderContent).toContain("<ol");
    });

    it("should conditionally render breadcrumbs when present", () => {
      expect(pageHeaderContent).toContain("breadcrumbs && breadcrumbs.length > 0");
    });

    it("should render Link for breadcrumbs with href", () => {
      expect(pageHeaderContent).toContain("crumb.href && !isLast");
    });

    it("should render span for last breadcrumb", () => {
      expect(pageHeaderContent).toContain("isLast");
    });

    it("should use ChevronRight separator between breadcrumbs", () => {
      expect(pageHeaderContent).toContain("<ChevronRight");
    });

    it("should not show separator before first breadcrumb", () => {
      expect(pageHeaderContent).toContain("index > 0 && (");
    });

    it("should use crumb.label as key", () => {
      expect(pageHeaderContent).toContain("key={crumb.label}");
    });

    it("should have breadcrumb text styling", () => {
      expect(pageHeaderContent).toContain("text-gray-500 hover:text-gray-700");
    });

    it("should have last breadcrumb with font-medium", () => {
      expect(pageHeaderContent).toContain("text-gray-700 font-medium");
    });
  });

  // =========================================================================
  // Title
  // =========================================================================
  describe("Title", () => {
    it("should accept title prop", () => {
      expect(pageHeaderContent).toContain("title: string");
    });

    it("should render title in h1 element", () => {
      expect(pageHeaderContent).toContain("<h1");
    });

    it("should render title text", () => {
      expect(pageHeaderContent).toContain("{title}");
    });

    it("should have title with text-2xl font size", () => {
      expect(pageHeaderContent).toContain("text-2xl");
    });

    it("should have title with font-bold", () => {
      expect(pageHeaderContent).toContain("font-bold");
    });

    it("should have title with text-gray-900 color", () => {
      expect(pageHeaderContent).toContain("text-gray-900");
    });
  });

  // =========================================================================
  // Optional Description
  // =========================================================================
  describe("Optional description", () => {
    it("should accept optional description prop", () => {
      expect(pageHeaderContent).toContain("description?: string");
    });

    it("should conditionally render description", () => {
      expect(pageHeaderContent).toContain("description && (");
    });

    it("should render description in p element", () => {
      expect(pageHeaderContent).toContain("{description}");
    });

    it("should have description with text-sm", () => {
      expect(pageHeaderContent).toContain("text-sm text-gray-500");
    });

    it("should have description with mt-1 margin", () => {
      expect(pageHeaderContent).toContain("mt-1 text-sm");
    });
  });

  // =========================================================================
  // Action Buttons Area
  // =========================================================================
  describe("Action buttons area", () => {
    it("should accept optional actions prop", () => {
      expect(pageHeaderContent).toContain("actions?: React.ReactNode");
    });

    it("should conditionally render actions", () => {
      expect(pageHeaderContent).toContain("actions && (");
    });

    it("should render actions in a flex container", () => {
      expect(pageHeaderContent).toContain("flex shrink-0 items-center gap-2");
    });

    it("should render actions content", () => {
      expect(pageHeaderContent).toContain("{actions}");
    });

    it("should have title row with flex justify-between", () => {
      expect(pageHeaderContent).toContain("flex items-start justify-between gap-4");
    });
  });

  // =========================================================================
  // Optional Tabs
  // =========================================================================
  describe("Optional tabs", () => {
    it("should accept optional tabs prop", () => {
      expect(pageHeaderContent).toContain("tabs?: Tab[]");
    });

    it("should define Tab interface", () => {
      expect(pageHeaderContent).toContain("interface Tab");
    });

    it("should have label field in Tab", () => {
      expect(pageHeaderContent).toMatch(/interface Tab[\s\S]*?label:\s*string/);
    });

    it("should have href field in Tab", () => {
      expect(pageHeaderContent).toMatch(/interface Tab[\s\S]*?href:\s*string/);
    });

    it("should have optional active field in Tab", () => {
      expect(pageHeaderContent).toContain("active?: boolean");
    });

    it("should have optional count field in Tab", () => {
      expect(pageHeaderContent).toContain("count?: number");
    });

    it("should conditionally render tabs when present", () => {
      expect(pageHeaderContent).toContain("tabs && tabs.length > 0");
    });

    it("should render tabs in a nav element", () => {
      expect(pageHeaderContent).toContain('aria-label="Tabs"');
    });

    it("should render tabs with border-b", () => {
      expect(pageHeaderContent).toContain("border-b border-gray-200");
    });

    it("should have active tab styling with #ff4800", () => {
      expect(pageHeaderContent).toContain("border-[#ff4800] text-[#ff4800]");
    });

    it("should have inactive tab styling with border-transparent", () => {
      expect(pageHeaderContent).toContain("border-transparent text-gray-500");
    });

    it("should render tab label text", () => {
      expect(pageHeaderContent).toContain("{tab.label}");
    });

    it("should render optional tab count badge", () => {
      expect(pageHeaderContent).toContain("tab.count !== undefined");
    });

    it("should have count badge with rounded-full styling", () => {
      expect(pageHeaderContent).toContain("rounded-full px-2 py-0.5");
    });

    it("should have active count badge with #ff4800 colors", () => {
      expect(pageHeaderContent).toContain("bg-[#ff4800]/10 text-[#ff4800]");
    });

    it("should render tabs using map", () => {
      expect(pageHeaderContent).toContain("tabs.map");
    });

    it("should use tab.href as key", () => {
      expect(pageHeaderContent).toContain("key={tab.href}");
    });

    it("should render tabs as Link components", () => {
      expect(pageHeaderContent).toContain("href={tab.href}");
    });
  });

  // =========================================================================
  // Component Structure & Props
  // =========================================================================
  describe("Component structure and props", () => {
    it("should define PageHeaderProps interface", () => {
      expect(pageHeaderContent).toContain("interface PageHeaderProps");
    });

    it("should export PageHeader function", () => {
      expect(pageHeaderContent).toContain("export function PageHeader");
    });

    it("should import Link from next/link", () => {
      expect(pageHeaderContent).toContain('from "next/link"');
    });

    it("should import ChevronRight from lucide-react", () => {
      expect(pageHeaderContent).toContain("ChevronRight");
    });

    it("should import cn utility", () => {
      expect(pageHeaderContent).toContain("cn");
    });

    it("should have mb-6 wrapper margin", () => {
      expect(pageHeaderContent).toContain("mb-6");
    });

    it("should have mb-3 on breadcrumbs section", () => {
      expect(pageHeaderContent).toContain("mb-3");
    });

    it("should have mt-4 on tabs section", () => {
      expect(pageHeaderContent).toContain("mt-4");
    });
  });
});
