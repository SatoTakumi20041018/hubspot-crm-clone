import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const appDir = path.resolve(__dirname, "../../app");

/**
 * Helper to check if a page file exists at a given route path within the (dashboard) group.
 */
function dashboardPageExists(route: string): boolean {
  const filePath = path.join(appDir, "(dashboard)", route, "page.tsx");
  return fs.existsSync(filePath);
}

/**
 * Helper to read page content from (dashboard) group.
 */
function readDashboardPage(route: string): string {
  const filePath = path.join(appDir, "(dashboard)", route, "page.tsx");
  return fs.readFileSync(filePath, "utf-8");
}

/**
 * Helper to check if a page file exists at a given route path within the (auth) group.
 */
function authPageExists(route: string): boolean {
  const filePath = path.join(appDir, "(auth)", route, "page.tsx");
  return fs.existsSync(filePath);
}

/**
 * Helper to read page content from (auth) group.
 */
function readAuthPage(route: string): string {
  const filePath = path.join(appDir, "(auth)", route, "page.tsx");
  return fs.readFileSync(filePath, "utf-8");
}

describe("Routing - Page Files Exist for All Routes", () => {
  // =========================================================================
  // CRM Routes
  // =========================================================================
  describe("CRM routes", () => {
    it("should have /contacts page", () => {
      expect(dashboardPageExists("contacts")).toBe(true);
    });

    it("should have /contacts/[id] detail page", () => {
      const filePath = path.join(appDir, "(dashboard)", "contacts", "[id]", "page.tsx");
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it("should have /companies page", () => {
      expect(dashboardPageExists("companies")).toBe(true);
    });

    it("should have /companies/[id] detail page", () => {
      const filePath = path.join(appDir, "(dashboard)", "companies", "[id]", "page.tsx");
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it("should have /deals page", () => {
      expect(dashboardPageExists("deals")).toBe(true);
    });

    it("should have /tickets page", () => {
      expect(dashboardPageExists("tickets")).toBe(true);
    });

    it("should have /tasks page", () => {
      expect(dashboardPageExists("tasks")).toBe(true);
    });
  });

  // =========================================================================
  // Marketing Routes
  // =========================================================================
  describe("Marketing routes", () => {
    it("should have /marketing page", () => {
      expect(dashboardPageExists("marketing")).toBe(true);
    });

    it("should have /email page", () => {
      expect(dashboardPageExists("email")).toBe(true);
    });

    it("should have /forms page", () => {
      expect(dashboardPageExists("forms")).toBe(true);
    });

    it("should have /landing-pages page", () => {
      expect(dashboardPageExists("landing-pages")).toBe(true);
    });

    it("should have /social page", () => {
      expect(dashboardPageExists("social")).toBe(true);
    });

    it("should have /ads page", () => {
      expect(dashboardPageExists("ads")).toBe(true);
    });

    it("should have /seo page", () => {
      expect(dashboardPageExists("seo")).toBe(true);
    });
  });

  // =========================================================================
  // Sales Routes
  // =========================================================================
  describe("Sales routes", () => {
    it("should have /sales page", () => {
      expect(dashboardPageExists("sales")).toBe(true);
    });

    it("should have /sequences page", () => {
      expect(dashboardPageExists("sequences")).toBe(true);
    });

    it("should have /meetings page", () => {
      expect(dashboardPageExists("meetings")).toBe(true);
    });

    it("should have /quotes page", () => {
      expect(dashboardPageExists("quotes")).toBe(true);
    });

    it("should have /forecasting page", () => {
      expect(dashboardPageExists("forecasting")).toBe(true);
    });

    it("should have /documents page", () => {
      expect(dashboardPageExists("documents")).toBe(true);
    });

    it("should have /playbooks page", () => {
      expect(dashboardPageExists("playbooks")).toBe(true);
    });

    it("should have /calls page", () => {
      expect(dashboardPageExists("calls")).toBe(true);
    });
  });

  // =========================================================================
  // Service Routes
  // =========================================================================
  describe("Service routes", () => {
    it("should have /service page", () => {
      expect(dashboardPageExists("service")).toBe(true);
    });

    it("should have /knowledge-base page", () => {
      expect(dashboardPageExists("knowledge-base")).toBe(true);
    });

    it("should have /feedback page", () => {
      expect(dashboardPageExists("feedback")).toBe(true);
    });

    it("should have /chatflows page", () => {
      expect(dashboardPageExists("chatflows")).toBe(true);
    });
  });

  // =========================================================================
  // Commerce Routes
  // =========================================================================
  describe("Commerce routes", () => {
    it("should have /products page", () => {
      expect(dashboardPageExists("products")).toBe(true);
    });
  });

  // =========================================================================
  // Automation & Content Routes
  // =========================================================================
  describe("Automation and content routes", () => {
    it("should have /workflows page", () => {
      expect(dashboardPageExists("workflows")).toBe(true);
    });

    it("should have /inbox page", () => {
      expect(dashboardPageExists("inbox")).toBe(true);
    });

    it("should have /lists page", () => {
      expect(dashboardPageExists("lists")).toBe(true);
    });
  });

  // =========================================================================
  // Reporting & Data Routes
  // =========================================================================
  describe("Reporting and data routes", () => {
    it("should have /dashboards page", () => {
      expect(dashboardPageExists("dashboards")).toBe(true);
    });

    it("should have /reports page", () => {
      expect(dashboardPageExists("reports")).toBe(true);
    });

    it("should have /goals page", () => {
      expect(dashboardPageExists("goals")).toBe(true);
    });

    it("should have /data-quality page", () => {
      expect(dashboardPageExists("data-quality")).toBe(true);
    });
  });

  // =========================================================================
  // Settings Route
  // =========================================================================
  describe("Settings route", () => {
    it("should have /settings page", () => {
      expect(dashboardPageExists("settings")).toBe(true);
    });
  });

  // =========================================================================
  // Auth Routes
  // =========================================================================
  describe("Auth routes", () => {
    it("should have /login page", () => {
      expect(authPageExists("login")).toBe(true);
    });

    it("should have /register page", () => {
      expect(authPageExists("register")).toBe(true);
    });
  });

  // =========================================================================
  // Dashboard index page
  // =========================================================================
  describe("Dashboard index page", () => {
    it("should have dashboard index page.tsx", () => {
      const filePath = path.join(appDir, "(dashboard)", "page.tsx");
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it("should have dashboard index page with use client directive", () => {
      const filePath = path.join(appDir, "(dashboard)", "page.tsx");
      const content = fs.readFileSync(filePath, "utf-8");
      expect(content).toContain('"use client"');
    });
  });

  // =========================================================================
  // Root / redirects to /contacts
  // =========================================================================
  describe("Root redirect", () => {
    it("should have a root page.tsx", () => {
      const filePath = path.join(appDir, "page.tsx");
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it("should redirect root / to /contacts", () => {
      const rootContent = fs.readFileSync(path.join(appDir, "page.tsx"), "utf-8");
      expect(rootContent).toContain('redirect("/contacts")');
    });

    it("should import redirect from next/navigation", () => {
      const rootContent = fs.readFileSync(path.join(appDir, "page.tsx"), "utf-8");
      expect(rootContent).toContain("from \"next/navigation\"");
    });

    it("should export a default function in root page", () => {
      const rootContent = fs.readFileSync(path.join(appDir, "page.tsx"), "utf-8");
      expect(rootContent).toContain("export default function");
    });
  });

  // =========================================================================
  // "use client" Directive Verification
  // =========================================================================
  describe("'use client' directive on dashboard pages", () => {
    it("contacts page should have use client directive", () => {
      expect(readDashboardPage("contacts")).toContain('"use client"');
    });

    it("companies page should have use client directive", () => {
      expect(readDashboardPage("companies")).toContain('"use client"');
    });

    it("deals page should have use client directive", () => {
      expect(readDashboardPage("deals")).toContain('"use client"');
    });

    it("tickets page should have use client directive", () => {
      expect(readDashboardPage("tickets")).toContain('"use client"');
    });

    it("tasks page should have use client directive", () => {
      expect(readDashboardPage("tasks")).toContain('"use client"');
    });

    it("workflows page should have use client directive", () => {
      expect(readDashboardPage("workflows")).toContain('"use client"');
    });

    it("sequences page should have use client directive", () => {
      expect(readDashboardPage("sequences")).toContain('"use client"');
    });

    it("meetings page should have use client directive", () => {
      expect(readDashboardPage("meetings")).toContain('"use client"');
    });

    it("calls page should have use client directive", () => {
      expect(readDashboardPage("calls")).toContain('"use client"');
    });

    it("documents page should have use client directive", () => {
      expect(readDashboardPage("documents")).toContain('"use client"');
    });

    it("quotes page should have use client directive", () => {
      expect(readDashboardPage("quotes")).toContain('"use client"');
    });

    it("products page should have use client directive", () => {
      expect(readDashboardPage("products")).toContain('"use client"');
    });

    it("forecasting page should have use client directive", () => {
      expect(readDashboardPage("forecasting")).toContain('"use client"');
    });

    it("knowledge-base page should have use client directive", () => {
      expect(readDashboardPage("knowledge-base")).toContain('"use client"');
    });

    it("feedback page should have use client directive", () => {
      expect(readDashboardPage("feedback")).toContain('"use client"');
    });

    it("chatflows page should have use client directive", () => {
      expect(readDashboardPage("chatflows")).toContain('"use client"');
    });

    it("forms page should have use client directive", () => {
      expect(readDashboardPage("forms")).toContain('"use client"');
    });

    it("email page should have use client directive", () => {
      expect(readDashboardPage("email")).toContain('"use client"');
    });

    it("social page should have use client directive", () => {
      expect(readDashboardPage("social")).toContain('"use client"');
    });

    it("ads page should have use client directive", () => {
      expect(readDashboardPage("ads")).toContain('"use client"');
    });

    it("seo page should have use client directive", () => {
      expect(readDashboardPage("seo")).toContain('"use client"');
    });

    it("landing-pages page should have use client directive", () => {
      expect(readDashboardPage("landing-pages")).toContain('"use client"');
    });

    it("lists page should have use client directive", () => {
      expect(readDashboardPage("lists")).toContain('"use client"');
    });

    it("inbox page should have use client directive", () => {
      expect(readDashboardPage("inbox")).toContain('"use client"');
    });

    it("playbooks page should have use client directive", () => {
      expect(readDashboardPage("playbooks")).toContain('"use client"');
    });

    it("goals page should have use client directive", () => {
      expect(readDashboardPage("goals")).toContain('"use client"');
    });

    it("dashboards page should have use client directive", () => {
      expect(readDashboardPage("dashboards")).toContain('"use client"');
    });

    it("data-quality page should have use client directive", () => {
      expect(readDashboardPage("data-quality")).toContain('"use client"');
    });

    it("marketing page should have use client directive", () => {
      expect(readDashboardPage("marketing")).toContain('"use client"');
    });

    it("sales page should have use client directive", () => {
      expect(readDashboardPage("sales")).toContain('"use client"');
    });

    it("service page should have use client directive", () => {
      expect(readDashboardPage("service")).toContain('"use client"');
    });

    it("reports page should have use client directive", () => {
      expect(readDashboardPage("reports")).toContain('"use client"');
    });

    it("settings page should have use client directive", () => {
      expect(readDashboardPage("settings")).toContain('"use client"');
    });
  });

  // =========================================================================
  // "use client" Directive on Auth Pages
  // =========================================================================
  describe("'use client' directive on auth pages", () => {
    it("login page should have use client directive", () => {
      expect(readAuthPage("login")).toContain('"use client"');
    });

    it("register page should have use client directive", () => {
      expect(readAuthPage("register")).toContain('"use client"');
    });
  });

  // =========================================================================
  // Layout Files
  // =========================================================================
  describe("Layout files", () => {
    it("should have root layout.tsx", () => {
      const filePath = path.join(appDir, "layout.tsx");
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it("should have dashboard group layout.tsx", () => {
      const filePath = path.join(appDir, "(dashboard)", "layout.tsx");
      expect(fs.existsSync(filePath)).toBe(true);
    });

    it("should have auth group layout.tsx", () => {
      const filePath = path.join(appDir, "(auth)", "layout.tsx");
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });

  // =========================================================================
  // Default Export Verification
  // =========================================================================
  describe("Default export on each page", () => {
    const dashboardRoutes = [
      "contacts", "companies", "deals", "tickets", "tasks",
      "workflows", "sequences", "meetings", "calls", "documents",
      "quotes", "products", "forecasting", "knowledge-base", "feedback",
      "chatflows", "forms", "email", "social", "ads", "seo",
      "landing-pages", "lists", "inbox", "playbooks", "goals",
      "dashboards", "data-quality", "marketing", "sales", "service",
      "reports", "settings",
    ];

    dashboardRoutes.forEach((route) => {
      it(`${route} page should export a default function`, () => {
        const content = readDashboardPage(route);
        expect(content).toMatch(/export\s+default\s+function/);
      });
    });
  });
});
