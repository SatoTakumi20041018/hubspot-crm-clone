import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const contactDetailPath = path.resolve(
  __dirname,
  "../../app/(dashboard)/contacts/[id]/page.tsx"
);
const companyDetailPath = path.resolve(
  __dirname,
  "../../app/(dashboard)/companies/[id]/page.tsx"
);

const contactDetailContent = fs.readFileSync(contactDetailPath, "utf-8");
const companyDetailContent = fs.readFileSync(companyDetailPath, "utf-8");

describe("Three-Column Layout - Contact Detail Page", () => {
  // =========================================================================
  // Left Sidebar - About Section
  // =========================================================================
  describe("Left sidebar with About section", () => {
    it("should have a left sidebar column", () => {
      expect(contactDetailContent).toContain("w-72 flex-shrink-0");
    });

    it("should have left sidebar with border-r", () => {
      expect(contactDetailContent).toContain("border-r border-gray-200");
    });

    it("should have left sidebar with white background", () => {
      expect(contactDetailContent).toContain("border-r border-gray-200 bg-white");
    });

    it("should have left sidebar with padding p-4", () => {
      expect(contactDetailContent).toContain("border-r border-gray-200 bg-white p-4");
    });

    it("should have left sidebar with overflow-y-auto", () => {
      expect(contactDetailContent).toMatch(/w-72\s+flex-shrink-0\s+overflow-y-auto\s+border-r/);
    });

    it("should have About/Overview section header", () => {
      // Japanese: 概要 (Overview/About)
      expect(contactDetailContent).toContain("概要");
    });

    it("should have uppercase tracking on About header", () => {
      expect(contactDetailContent).toContain("uppercase tracking-wide");
    });

    it("should have edit button for About section", () => {
      expect(contactDetailContent).toContain("Edit3");
    });

    it("should display email field", () => {
      expect(contactDetailContent).toContain("メールアドレス");
    });

    it("should display phone field", () => {
      expect(contactDetailContent).toContain("電話番号");
    });

    it("should display job title field", () => {
      expect(contactDetailContent).toContain("役職");
    });

    it("should display lifecycle stage field", () => {
      expect(contactDetailContent).toContain("ライフサイクルステージ");
    });

    it("should display lead status field", () => {
      expect(contactDetailContent).toContain("リードステータス");
    });

    it("should display owner field", () => {
      expect(contactDetailContent).toContain("担当者");
    });

    it("should display company link", () => {
      expect(contactDetailContent).toContain("会社");
    });

    it("should display created date", () => {
      expect(contactDetailContent).toContain("作成日");
    });

    it("should display last activity date", () => {
      expect(contactDetailContent).toContain("最終アクティビティ");
    });
  });

  // =========================================================================
  // Middle Column - Activity Timeline with Tabs
  // =========================================================================
  describe("Middle column with activity timeline tabs", () => {
    it("should have a flex-1 middle column", () => {
      expect(contactDetailContent).toContain("flex-1 overflow-y-auto");
    });

    it("should have gray background on middle column", () => {
      expect(contactDetailContent).toContain("flex-1 overflow-y-auto bg-gray-50");
    });

    it("should have activity tabs", () => {
      expect(contactDetailContent).toContain("activityTabs");
    });

    it("should have Activity tab", () => {
      expect(contactDetailContent).toContain("アクティビティ");
    });

    it("should have Notes tab", () => {
      expect(contactDetailContent).toContain("メモ");
    });

    it("should have Email tab", () => {
      expect(contactDetailContent).toContain("メール");
    });

    it("should have Calls tab", () => {
      expect(contactDetailContent).toContain("通話");
    });

    it("should have Tasks tab", () => {
      expect(contactDetailContent).toContain("タスク");
    });

    it("should have active tab styling with #ff4800", () => {
      expect(contactDetailContent).toContain('border-[#ff4800] text-[#ff4800]');
    });

    it("should have inactive tab styling", () => {
      expect(contactDetailContent).toContain("border-transparent text-gray-500");
    });

    it("should manage activeTab state", () => {
      expect(contactDetailContent).toContain("activeTab");
    });

    it("should render activity timeline items", () => {
      expect(contactDetailContent).toContain("activities.map");
    });
  });

  // =========================================================================
  // Right Sidebar - Associated Records
  // =========================================================================
  describe("Right sidebar with associated records", () => {
    it("should have a right sidebar column", () => {
      // The right sidebar has border-l instead of border-r
      expect(contactDetailContent).toContain("border-l border-gray-200");
    });

    it("should have right sidebar with w-72 width", () => {
      expect(contactDetailContent).toMatch(/w-72\s+flex-shrink-0\s+overflow-y-auto\s+border-l/);
    });

    it("should have right sidebar with white background", () => {
      expect(contactDetailContent).toContain("border-l border-gray-200 bg-white p-4");
    });

    it("should have associated company section", () => {
      // Japanese: 会社
      expect(contactDetailContent).toContain("会社");
    });

    it("should have associated deals section", () => {
      // Japanese: 取引
      expect(contactDetailContent).toContain("取引");
    });

    it("should have associated tickets section", () => {
      // Japanese: チケット
      expect(contactDetailContent).toContain("チケット");
    });

    it("should have add button for deals", () => {
      expect(contactDetailContent).toContain("追加");
    });

    it("should render associated deals", () => {
      expect(contactDetailContent).toContain("associatedDeals");
    });

    it("should render associated tickets", () => {
      expect(contactDetailContent).toContain("associatedTickets");
    });
  });

  // =========================================================================
  // Overall 3-Column Structure
  // =========================================================================
  describe("Overall three-column flex structure", () => {
    it("should use flex layout for 3 columns", () => {
      expect(contactDetailContent).toContain("flex flex-1 overflow-hidden");
    });

    it("should have a top bar above the 3-column layout", () => {
      expect(contactDetailContent).toContain("flex items-center justify-between border-b");
    });

    it("should have back navigation link to /contacts", () => {
      expect(contactDetailContent).toContain('href="/contacts"');
    });

    it("should have ChevronLeft for back navigation", () => {
      expect(contactDetailContent).toContain("ChevronLeft");
    });

    it("should use full viewport height minus header", () => {
      expect(contactDetailContent).toContain('height: "calc(100vh - 4rem)"');
    });
  });
});

describe("Three-Column Layout - Company Detail Page", () => {
  // =========================================================================
  // Left Sidebar
  // =========================================================================
  describe("Left sidebar with About section", () => {
    it("should have a left sidebar column", () => {
      expect(companyDetailContent).toContain("w-72 flex-shrink-0");
    });

    it("should have left sidebar with border-r", () => {
      expect(companyDetailContent).toContain("border-r border-gray-200");
    });

    it("should have About/Overview section header", () => {
      expect(companyDetailContent).toContain("概要");
    });

    it("should display domain field", () => {
      expect(companyDetailContent).toContain("ドメイン");
    });

    it("should display phone field", () => {
      expect(companyDetailContent).toContain("電話番号");
    });

    it("should display industry field", () => {
      expect(companyDetailContent).toContain("業界");
    });

    it("should display annual revenue field", () => {
      expect(companyDetailContent).toContain("年間売上");
    });

    it("should display employee count field", () => {
      expect(companyDetailContent).toContain("従業員数");
    });

    it("should display address field", () => {
      expect(companyDetailContent).toContain("住所");
    });
  });

  // =========================================================================
  // Middle Column
  // =========================================================================
  describe("Middle column with activity timeline tabs", () => {
    it("should have a flex-1 middle column", () => {
      expect(companyDetailContent).toContain("flex-1 overflow-y-auto");
    });

    it("should have activity tabs", () => {
      expect(companyDetailContent).toContain("activityTabs");
    });

    it("should render activity items", () => {
      expect(companyDetailContent).toContain("activities.map");
    });
  });

  // =========================================================================
  // Right Sidebar
  // =========================================================================
  describe("Right sidebar with associated records", () => {
    it("should have a right sidebar column with border-l", () => {
      expect(companyDetailContent).toContain("border-l border-gray-200");
    });

    it("should have associated contacts section", () => {
      expect(companyDetailContent).toContain("コンタクト");
    });

    it("should have associated deals section", () => {
      expect(companyDetailContent).toContain("取引");
    });

    it("should have associated tickets section", () => {
      expect(companyDetailContent).toContain("チケット");
    });

    it("should render associated contacts", () => {
      expect(companyDetailContent).toContain("associatedContacts");
    });

    it("should render associated deals", () => {
      expect(companyDetailContent).toContain("associatedDeals");
    });

    it("should render associated tickets", () => {
      expect(companyDetailContent).toContain("associatedTickets");
    });
  });

  // =========================================================================
  // Overall Structure
  // =========================================================================
  describe("Overall three-column flex structure", () => {
    it("should use flex layout for 3 columns", () => {
      expect(companyDetailContent).toContain("flex flex-1 overflow-hidden");
    });

    it("should have back navigation link to /companies", () => {
      expect(companyDetailContent).toContain('href="/companies"');
    });

    it("should use full viewport height minus header", () => {
      expect(companyDetailContent).toContain('height: "calc(100vh - 4rem)"');
    });
  });
});
