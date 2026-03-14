import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const sidebarPath = path.resolve(__dirname, "../../components/layout/sidebar.tsx");
const sidebarContent = fs.readFileSync(sidebarPath, "utf-8");

describe("Sidebar Structure - HubSpot 2026 Navigation", () => {
  // =========================================================================
  // Home Link
  // =========================================================================
  describe("Home link", () => {
    it("should have a Home link", () => {
      expect(sidebarContent).toContain("Home");
    });

    it("should link Home to /", () => {
      expect(sidebarContent).toContain('href="/"');
    });

    it("should use the Home icon from lucide-react", () => {
      expect(sidebarContent).toMatch(/import\s*\{[^}]*\bHome\b[^}]*\}\s*from\s*["']lucide-react["']/);
    });

    it("should render Home icon component", () => {
      expect(sidebarContent).toContain("<Home");
    });

    it("should render Home label text", () => {
      expect(sidebarContent).toContain("<span>Home</span>");
    });
  });

  // =========================================================================
  // CRM Section
  // =========================================================================
  describe("CRM section", () => {
    it("should have a CRM section label", () => {
      expect(sidebarContent).toContain('"CRM"');
    });

    it("should have exactly 5 items in CRM section", () => {
      const crmMatch = sidebarContent.match(/label:\s*"CRM"[\s\S]*?items:\s*\[([\s\S]*?)\]/);
      expect(crmMatch).not.toBeNull();
      const items = crmMatch![1].match(/\{[^}]*label:/g);
      expect(items).toHaveLength(5);
    });

    it('should have Contacts item in CRM', () => {
      expect(sidebarContent).toContain('{ label: "Contacts"');
    });

    it('should have Contacts linking to /contacts', () => {
      expect(sidebarContent).toContain('label: "Contacts", href: "/contacts"');
    });

    it('should use Users icon for Contacts', () => {
      expect(sidebarContent).toContain('label: "Contacts", href: "/contacts", icon: Users');
    });

    it('should have Companies item in CRM', () => {
      expect(sidebarContent).toContain('label: "Companies"');
    });

    it('should have Companies linking to /companies', () => {
      expect(sidebarContent).toContain('label: "Companies", href: "/companies"');
    });

    it('should use Building2 icon for Companies', () => {
      expect(sidebarContent).toContain('label: "Companies", href: "/companies", icon: Building2');
    });

    it('should have Deals item in CRM', () => {
      // CRM section has Deals
      const crmSection = sidebarContent.match(/label:\s*"CRM"[\s\S]*?items:\s*\[([\s\S]*?)\]/);
      expect(crmSection![1]).toContain('"Deals"');
    });

    it('should have CRM Deals linking to /deals', () => {
      expect(sidebarContent).toContain('label: "Deals", href: "/deals"');
    });

    it('should use Handshake icon for CRM Deals', () => {
      expect(sidebarContent).toContain('label: "Deals", href: "/deals", icon: Handshake');
    });

    it('should have Tickets item in CRM', () => {
      expect(sidebarContent).toContain('label: "Tickets"');
    });

    it('should have Tickets linking to /tickets', () => {
      expect(sidebarContent).toContain('label: "Tickets", href: "/tickets"');
    });

    it('should use Ticket icon for Tickets', () => {
      expect(sidebarContent).toContain('label: "Tickets", href: "/tickets", icon: Ticket');
    });

    it('should have Lists item in CRM', () => {
      const crmSection = sidebarContent.match(/label:\s*"CRM"[\s\S]*?items:\s*\[([\s\S]*?)\]/);
      expect(crmSection![1]).toContain('"Lists"');
    });

    it('should have CRM Lists linking to /crm/lists', () => {
      expect(sidebarContent).toContain('label: "Lists", href: "/crm/lists"');
    });

    it('should use ListChecks icon for CRM Lists', () => {
      expect(sidebarContent).toContain('label: "Lists", href: "/crm/lists", icon: ListChecks');
    });
  });

  // =========================================================================
  // Marketing Section
  // =========================================================================
  describe("Marketing section", () => {
    it("should have a Marketing section label", () => {
      expect(sidebarContent).toContain('"Marketing"');
    });

    it("should have exactly 6 items in Marketing section", () => {
      const match = sidebarContent.match(/label:\s*"Marketing"[\s\S]*?items:\s*\[([\s\S]*?)\]/);
      expect(match).not.toBeNull();
      const items = match![1].match(/\{[^}]*label:/g);
      expect(items).toHaveLength(6);
    });

    it('should have Email item in Marketing', () => {
      expect(sidebarContent).toContain('label: "Email"');
    });

    it('should have Email linking to /marketing/email', () => {
      expect(sidebarContent).toContain('label: "Email", href: "/marketing/email"');
    });

    it('should use Mail icon for Email', () => {
      expect(sidebarContent).toContain('label: "Email", href: "/marketing/email", icon: Mail');
    });

    it('should have Forms item in Marketing', () => {
      const section = sidebarContent.match(/label:\s*"Marketing"[\s\S]*?items:\s*\[([\s\S]*?)\]/);
      expect(section![1]).toContain('"Forms"');
    });

    it('should have Forms linking to /marketing/forms', () => {
      expect(sidebarContent).toContain('label: "Forms", href: "/marketing/forms"');
    });

    it('should use FileText icon for Forms', () => {
      expect(sidebarContent).toContain('label: "Forms", href: "/marketing/forms", icon: FileText');
    });

    it('should have Landing Pages item in Marketing', () => {
      const section = sidebarContent.match(/label:\s*"Marketing"[\s\S]*?items:\s*\[([\s\S]*?)\]/);
      expect(section![1]).toContain('"Landing Pages"');
    });

    it('should have Landing Pages linking to /marketing/landing-pages', () => {
      expect(sidebarContent).toContain('label: "Landing Pages", href: "/marketing/landing-pages"');
    });

    it('should use FileCode2 icon for Marketing Landing Pages', () => {
      expect(sidebarContent).toContain('label: "Landing Pages", href: "/marketing/landing-pages", icon: FileCode2');
    });

    it('should have Social item in Marketing', () => {
      expect(sidebarContent).toContain('label: "Social"');
    });

    it('should have Social linking to /marketing/social', () => {
      expect(sidebarContent).toContain('label: "Social", href: "/marketing/social"');
    });

    it('should use Megaphone icon for Social', () => {
      expect(sidebarContent).toContain('label: "Social", href: "/marketing/social", icon: Megaphone');
    });

    it('should have Ads item in Marketing', () => {
      expect(sidebarContent).toContain('label: "Ads"');
    });

    it('should have Ads linking to /marketing/ads', () => {
      expect(sidebarContent).toContain('label: "Ads", href: "/marketing/ads"');
    });

    it('should use MousePointerClick icon for Ads', () => {
      expect(sidebarContent).toContain('label: "Ads", href: "/marketing/ads", icon: MousePointerClick');
    });

    it('should have SEO item in Marketing', () => {
      expect(sidebarContent).toContain('label: "SEO"');
    });

    it('should have SEO linking to /marketing/seo', () => {
      expect(sidebarContent).toContain('label: "SEO", href: "/marketing/seo"');
    });

    it('should use SearchIcon for SEO', () => {
      expect(sidebarContent).toContain('label: "SEO", href: "/marketing/seo", icon: SearchIcon');
    });
  });

  // =========================================================================
  // Sales Section
  // =========================================================================
  describe("Sales section", () => {
    it("should have a Sales section label", () => {
      expect(sidebarContent).toContain('"Sales"');
    });

    it("should have exactly 9 items in Sales section", () => {
      const match = sidebarContent.match(/label:\s*"Sales"[\s\S]*?items:\s*\[([\s\S]*?)\]/);
      expect(match).not.toBeNull();
      const items = match![1].match(/\{[^}]*label:/g);
      expect(items).toHaveLength(9);
    });

    it('should have Workspace item in Sales', () => {
      expect(sidebarContent).toContain('label: "Workspace"');
    });

    it('should have Workspace linking to /sales/workspace', () => {
      expect(sidebarContent).toContain('label: "Workspace", href: "/sales/workspace"');
    });

    it('should use Briefcase icon for Workspace', () => {
      expect(sidebarContent).toContain('label: "Workspace", href: "/sales/workspace", icon: Briefcase');
    });

    it('should have Sales Deals item', () => {
      const section = sidebarContent.match(/label:\s*"Sales"[\s\S]*?items:\s*\[([\s\S]*?)\]/);
      expect(section![1]).toContain('"Deals"');
    });

    it('should have Sales Deals linking to /sales/pipeline', () => {
      expect(sidebarContent).toContain('label: "Deals", href: "/sales/pipeline"');
    });

    it('should use Kanban icon for Sales Deals', () => {
      expect(sidebarContent).toContain('label: "Deals", href: "/sales/pipeline", icon: Kanban');
    });

    it('should have Sequences item in Sales', () => {
      expect(sidebarContent).toContain('label: "Sequences"');
    });

    it('should have Sequences linking to /sales/sequences', () => {
      expect(sidebarContent).toContain('label: "Sequences", href: "/sales/sequences"');
    });

    it('should use Send icon for Sequences', () => {
      expect(sidebarContent).toContain('label: "Sequences", href: "/sales/sequences", icon: Send');
    });

    it('should have Meetings item in Sales', () => {
      expect(sidebarContent).toContain('label: "Meetings"');
    });

    it('should have Meetings linking to /sales/meetings', () => {
      expect(sidebarContent).toContain('label: "Meetings", href: "/sales/meetings"');
    });

    it('should use Calendar icon for Meetings', () => {
      expect(sidebarContent).toContain('label: "Meetings", href: "/sales/meetings", icon: Calendar');
    });

    it('should have Sales Quotes item', () => {
      const section = sidebarContent.match(/label:\s*"Sales"[\s\S]*?items:\s*\[([\s\S]*?)\]/);
      expect(section![1]).toContain('"Quotes"');
    });

    it('should have Sales Quotes linking to /sales/quotes', () => {
      expect(sidebarContent).toContain('label: "Quotes", href: "/sales/quotes"');
    });

    it('should use Quote icon for Sales Quotes', () => {
      expect(sidebarContent).toContain('label: "Quotes", href: "/sales/quotes", icon: Quote');
    });

    it('should have Forecasting item in Sales', () => {
      expect(sidebarContent).toContain('label: "Forecasting"');
    });

    it('should have Forecasting linking to /sales/forecasting', () => {
      expect(sidebarContent).toContain('label: "Forecasting", href: "/sales/forecasting"');
    });

    it('should use TrendingUp icon for Forecasting', () => {
      expect(sidebarContent).toContain('label: "Forecasting", href: "/sales/forecasting", icon: TrendingUp');
    });

    it('should have Documents item in Sales', () => {
      expect(sidebarContent).toContain('label: "Documents"');
    });

    it('should have Documents linking to /sales/documents', () => {
      expect(sidebarContent).toContain('label: "Documents", href: "/sales/documents"');
    });

    it('should use FileStack icon for Documents', () => {
      expect(sidebarContent).toContain('label: "Documents", href: "/sales/documents", icon: FileStack');
    });

    it('should have Playbooks item in Sales', () => {
      expect(sidebarContent).toContain('label: "Playbooks"');
    });

    it('should have Playbooks linking to /sales/playbooks', () => {
      expect(sidebarContent).toContain('label: "Playbooks", href: "/sales/playbooks"');
    });

    it('should use BookMarked icon for Playbooks', () => {
      expect(sidebarContent).toContain('label: "Playbooks", href: "/sales/playbooks", icon: BookMarked');
    });

    it('should have Calls item in Sales', () => {
      expect(sidebarContent).toContain('label: "Calls"');
    });

    it('should have Calls linking to /sales/calls', () => {
      expect(sidebarContent).toContain('label: "Calls", href: "/sales/calls"');
    });

    it('should use Phone icon for Calls', () => {
      expect(sidebarContent).toContain('label: "Calls", href: "/sales/calls", icon: Phone');
    });
  });

  // =========================================================================
  // Service Section
  // =========================================================================
  describe("Service section", () => {
    it("should have a Service section label", () => {
      expect(sidebarContent).toContain('"Service"');
    });

    it("should have Help Desk item in Service", () => {
      expect(sidebarContent).toContain('label: "Help Desk"');
    });

    it("should have Help Desk linking to /service/help-desk", () => {
      expect(sidebarContent).toContain('label: "Help Desk", href: "/service/help-desk"');
    });

    it("should use Headphones icon for Help Desk", () => {
      expect(sidebarContent).toContain('label: "Help Desk", href: "/service/help-desk", icon: Headphones');
    });

    it("should have Knowledge Base item in Service", () => {
      expect(sidebarContent).toContain('label: "Knowledge Base"');
    });

    it("should have Knowledge Base linking to /service/knowledge-base", () => {
      expect(sidebarContent).toContain('label: "Knowledge Base", href: "/service/knowledge-base"');
    });

    it("should use BookOpen icon for Knowledge Base", () => {
      expect(sidebarContent).toContain('label: "Knowledge Base", href: "/service/knowledge-base", icon: BookOpen');
    });

    it("should have Feedback item in Service", () => {
      const section = sidebarContent.match(/label:\s*"Service"[\s\S]*?items:\s*\[([\s\S]*?)\]/);
      expect(section![1]).toContain('"Feedback"');
    });

    it("should have Feedback linking to /service/feedback", () => {
      expect(sidebarContent).toContain('label: "Feedback", href: "/service/feedback"');
    });

    it("should use HelpCircle icon for Feedback", () => {
      expect(sidebarContent).toContain('label: "Feedback", href: "/service/feedback", icon: HelpCircle');
    });

    it("should have Chatflows item in Service", () => {
      expect(sidebarContent).toContain('label: "Chatflows"');
    });

    it("should have Chatflows linking to /service/chatflows", () => {
      expect(sidebarContent).toContain('label: "Chatflows", href: "/service/chatflows"');
    });

    it("should use MessageSquare icon for Chatflows", () => {
      expect(sidebarContent).toContain('label: "Chatflows", href: "/service/chatflows", icon: MessageSquare');
    });

    it("should have Customer Portal item in Service", () => {
      expect(sidebarContent).toContain('label: "Customer Portal"');
    });

    it("should have Customer Portal linking to /service/customer-portal", () => {
      expect(sidebarContent).toContain('href: "/service/customer-portal"');
    });

    it("should use DoorOpen icon for Customer Portal", () => {
      expect(sidebarContent).toContain('icon: DoorOpen');
    });
  });

  // =========================================================================
  // Commerce Section
  // =========================================================================
  describe("Commerce section", () => {
    it("should have a Commerce section label", () => {
      expect(sidebarContent).toContain('"Commerce"');
    });

    it("should have exactly 3 items in Commerce section", () => {
      const match = sidebarContent.match(/label:\s*"Commerce"[\s\S]*?items:\s*\[([\s\S]*?)\]/);
      expect(match).not.toBeNull();
      const items = match![1].match(/\{[^}]*label:/g);
      expect(items).toHaveLength(3);
    });

    it("should have Commerce Quotes item", () => {
      expect(sidebarContent).toContain('label: "Quotes", href: "/commerce/quotes"');
    });

    it("should use Quote icon for Commerce Quotes", () => {
      expect(sidebarContent).toContain('label: "Quotes", href: "/commerce/quotes", icon: Quote');
    });

    it("should have Products item in Commerce", () => {
      expect(sidebarContent).toContain('label: "Products"');
    });

    it("should have Products linking to /commerce/products", () => {
      expect(sidebarContent).toContain('label: "Products", href: "/commerce/products"');
    });

    it("should use ShoppingCart icon for Products", () => {
      expect(sidebarContent).toContain('label: "Products", href: "/commerce/products", icon: ShoppingCart');
    });

    it("should have Payments item in Commerce", () => {
      expect(sidebarContent).toContain('label: "Payments"');
    });

    it("should have Payments linking to /commerce/payments", () => {
      expect(sidebarContent).toContain('label: "Payments", href: "/commerce/payments"');
    });

    it("should use CreditCard icon for Payments", () => {
      expect(sidebarContent).toContain('label: "Payments", href: "/commerce/payments", icon: CreditCard');
    });
  });

  // =========================================================================
  // Automations Section
  // =========================================================================
  describe("Automations section", () => {
    it("should have an Automations section label", () => {
      expect(sidebarContent).toContain('"Automations"');
    });

    it("should have exactly 1 item in Automations section", () => {
      const match = sidebarContent.match(/label:\s*"Automations"[\s\S]*?items:\s*\[([\s\S]*?)\]/);
      expect(match).not.toBeNull();
      const items = match![1].match(/\{[^}]*label:/g);
      expect(items).toHaveLength(1);
    });

    it("should have Workflows item in Automations", () => {
      expect(sidebarContent).toContain('label: "Workflows"');
    });

    it("should have Workflows linking to /automations/workflows", () => {
      expect(sidebarContent).toContain('label: "Workflows", href: "/automations/workflows"');
    });

    it("should use Workflow icon for Workflows", () => {
      expect(sidebarContent).toContain('label: "Workflows", href: "/automations/workflows", icon: Workflow');
    });
  });

  // =========================================================================
  // Content Section
  // =========================================================================
  describe("Content section", () => {
    it("should have a Content section label", () => {
      expect(sidebarContent).toContain('"Content"');
    });

    it("should have Content section defined in navSections", () => {
      const match = sidebarContent.match(/label:\s*"Content"[\s\S]*?items:\s*\[([\s\S]*?)\]/);
      expect(match).not.toBeNull();
    });

    it("should have Website Pages item in Content", () => {
      expect(sidebarContent).toContain('label: "Website Pages"');
    });

    it("should have Website Pages linking to /content/website-pages", () => {
      expect(sidebarContent).toContain('href: "/content/website-pages"');
    });

    it("should use Globe icon for Website Pages", () => {
      expect(sidebarContent).toContain('label: "Website Pages", href: "/content/website-pages", icon: Globe');
    });

    it("should have Blog item in Content", () => {
      expect(sidebarContent).toContain('label: "Blog"');
    });

    it("should have Blog linking to /content/blog", () => {
      expect(sidebarContent).toContain('href: "/content/blog"');
    });

    it("should use PenTool icon for Blog", () => {
      expect(sidebarContent).toContain('label: "Blog", href: "/content/blog", icon: PenTool');
    });

    it("should have Content Landing Pages item", () => {
      expect(sidebarContent).toContain('label: "Landing Pages", href: "/content/landing-pages"');
    });

    it("should use FileEdit icon for Content Landing Pages", () => {
      expect(sidebarContent).toContain('label: "Landing Pages", href: "/content/landing-pages", icon: FileEdit');
    });
  });

  // =========================================================================
  // Reporting Section
  // =========================================================================
  describe("Reporting section", () => {
    it("should have a Reporting section label", () => {
      expect(sidebarContent).toContain('"Reporting"');
    });

    it("should have exactly 3 items in Reporting section", () => {
      const match = sidebarContent.match(/label:\s*"Reporting"[\s\S]*?items:\s*\[([\s\S]*?)\]/);
      expect(match).not.toBeNull();
      const items = match![1].match(/\{[^}]*label:/g);
      expect(items).toHaveLength(3);
    });

    it("should have Dashboards item in Reporting", () => {
      expect(sidebarContent).toContain('label: "Dashboards"');
    });

    it("should have Dashboards linking to /reports/dashboards", () => {
      expect(sidebarContent).toContain('label: "Dashboards", href: "/reports/dashboards"');
    });

    it("should use LayoutDashboard icon for Dashboards", () => {
      expect(sidebarContent).toContain('label: "Dashboards", href: "/reports/dashboards", icon: LayoutDashboard');
    });

    it("should have Reports item in Reporting", () => {
      const section = sidebarContent.match(/label:\s*"Reporting"[\s\S]*?items:\s*\[([\s\S]*?)\]/);
      expect(section![1]).toContain('"Reports"');
    });

    it("should have Reports linking to /reports", () => {
      expect(sidebarContent).toContain('label: "Reports", href: "/reports"');
    });

    it("should use BarChart3 icon for Reports", () => {
      expect(sidebarContent).toContain('label: "Reports", href: "/reports", icon: BarChart3');
    });

    it("should have Goals item in Reporting", () => {
      expect(sidebarContent).toContain('label: "Goals"');
    });

    it("should have Goals linking to /reports/goals", () => {
      expect(sidebarContent).toContain('label: "Goals", href: "/reports/goals"');
    });

    it("should use Target icon for Goals", () => {
      expect(sidebarContent).toContain('label: "Goals", href: "/reports/goals", icon: Target');
    });
  });

  // =========================================================================
  // Data Management Section
  // =========================================================================
  describe("Data Management section", () => {
    it("should have a Data Management section label", () => {
      expect(sidebarContent).toContain('"Data Management"');
    });

    it("should have exactly 2 items in Data Management section", () => {
      const match = sidebarContent.match(/label:\s*"Data Management"[\s\S]*?items:\s*\[([\s\S]*?)\]/);
      expect(match).not.toBeNull();
      const items = match![1].match(/\{[^}]*label:/g);
      expect(items).toHaveLength(2);
    });

    it("should have Data Quality item", () => {
      expect(sidebarContent).toContain('label: "Data Quality"');
    });

    it("should have Data Quality linking to /data/quality", () => {
      expect(sidebarContent).toContain('label: "Data Quality", href: "/data/quality"');
    });

    it("should use Database icon for Data Quality", () => {
      expect(sidebarContent).toContain('label: "Data Quality", href: "/data/quality", icon: Database');
    });

    it("should have Data Management Lists item", () => {
      expect(sidebarContent).toContain('label: "Lists", href: "/data/lists"');
    });

    it("should use ListChecks icon for Data Management Lists", () => {
      expect(sidebarContent).toContain('label: "Lists", href: "/data/lists", icon: ListChecks');
    });
  });

  // =========================================================================
  // Settings Link
  // =========================================================================
  describe("Settings link", () => {
    it("should have a Settings link", () => {
      expect(sidebarContent).toContain("Settings");
    });

    it("should link Settings to /settings", () => {
      expect(sidebarContent).toContain('href="/settings"');
    });

    it("should use the Settings icon from lucide-react", () => {
      expect(sidebarContent).toMatch(/import\s*\{[^}]*\bSettings\b[^}]*\}\s*from\s*["']lucide-react["']/);
    });

    it("should render Settings icon component", () => {
      expect(sidebarContent).toContain("<Settings");
    });

    it("should render Settings label text", () => {
      expect(sidebarContent).toContain("<span>Settings</span>");
    });

    it("should place Settings at the bottom of sidebar with border-t", () => {
      expect(sidebarContent).toContain('border-t border-white/10');
    });
  });

  // =========================================================================
  // Section Collapsibility
  // =========================================================================
  describe("Section collapsibility", () => {
    it("should have expandedSections state", () => {
      expect(sidebarContent).toContain("expandedSections");
    });

    it("should have toggleSection function", () => {
      expect(sidebarContent).toContain("toggleSection");
    });

    it("should toggle CRM section", () => {
      expect(sidebarContent).toContain("CRM: true");
    });

    it("should toggle Marketing section", () => {
      expect(sidebarContent).toContain("Marketing: false");
    });

    it("should toggle Sales section", () => {
      expect(sidebarContent).toContain("Sales: true");
    });

    it("should toggle Service section", () => {
      expect(sidebarContent).toContain("Service: false");
    });

    it("should toggle Commerce section", () => {
      expect(sidebarContent).toContain("Commerce: false");
    });

    it("should toggle Automations section", () => {
      expect(sidebarContent).toContain("Automations: false");
    });

    it("should toggle Content section", () => {
      expect(sidebarContent).toContain("Content: false");
    });

    it("should toggle Reporting section", () => {
      expect(sidebarContent).toContain("Reporting: true");
    });

    it("should toggle Data Management section", () => {
      expect(sidebarContent).toContain('"Data Management": false');
    });

    it("should use ChevronDown for expanded sections", () => {
      expect(sidebarContent).toContain("<ChevronDown");
    });

    it("should use ChevronRight for collapsed sections", () => {
      expect(sidebarContent).toContain("<ChevronRight");
    });

    it("should conditionally render items based on expandedSections state", () => {
      expect(sidebarContent).toContain("expandedSections[section.label]");
    });

    it("should call toggleSection on section header click", () => {
      expect(sidebarContent).toContain("onClick={() => toggleSection(section.label)}");
    });
  });

  // =========================================================================
  // Section Headers - Uppercase
  // =========================================================================
  describe("Section headers are uppercase", () => {
    it("should apply uppercase class to section headers", () => {
      expect(sidebarContent).toContain("uppercase");
    });

    it("should apply tracking class to section headers", () => {
      expect(sidebarContent).toContain('tracking-[0.05em]');
    });

    it("should use 0.75rem font size for section headers", () => {
      expect(sidebarContent).toContain('text-[0.75rem]');
    });

    it("should apply font-medium to section headers", () => {
      expect(sidebarContent).toMatch(/text-\[0\.75rem\]\s+font-medium\s+uppercase/);
    });
  });

  // =========================================================================
  // Icon Imports
  // =========================================================================
  describe("Correct icons imported from lucide-react", () => {
    it("should import Home icon", () => {
      expect(sidebarContent).toMatch(/import\s*\{[^}]*\bHome\b/);
    });

    it("should import Users icon", () => {
      expect(sidebarContent).toMatch(/import\s*\{[^}]*\bUsers\b/);
    });

    it("should import Building2 icon", () => {
      expect(sidebarContent).toMatch(/import\s*\{[^}]*\bBuilding2\b/);
    });

    it("should import Handshake icon", () => {
      expect(sidebarContent).toMatch(/import\s*\{[^}]*\bHandshake\b/);
    });

    it("should import Ticket icon", () => {
      expect(sidebarContent).toMatch(/import\s*\{[^}]*\bTicket\b/);
    });

    it("should import Mail icon", () => {
      expect(sidebarContent).toMatch(/import\s*\{[^}]*\bMail\b/);
    });

    it("should import Kanban icon", () => {
      expect(sidebarContent).toMatch(/import\s*\{[^}]*\bKanban\b/);
    });

    it("should import Calendar icon", () => {
      expect(sidebarContent).toMatch(/import\s*\{[^}]*\bCalendar\b/);
    });

    it("should import LayoutDashboard icon", () => {
      expect(sidebarContent).toMatch(/import\s*\{[^}]*\bLayoutDashboard\b/);
    });

    it("should import BarChart3 icon", () => {
      expect(sidebarContent).toMatch(/import\s*\{[^}]*\bBarChart3\b/);
    });

    it("should import Settings icon", () => {
      expect(sidebarContent).toMatch(/import\s*\{[^}]*\bSettings\b/);
    });

    it("should import Workflow icon", () => {
      expect(sidebarContent).toMatch(/import\s*\{[^}]*\bWorkflow\b/);
    });

    it("should import Database icon", () => {
      expect(sidebarContent).toMatch(/import\s*\{[^}]*\bDatabase\b/);
    });

    it("should import Target icon", () => {
      expect(sidebarContent).toMatch(/import\s*\{[^}]*\bTarget\b/);
    });

    it("should import ShoppingCart icon", () => {
      expect(sidebarContent).toMatch(/import\s*\{[^}]*\bShoppingCart\b/);
    });

    it("should import CreditCard icon", () => {
      expect(sidebarContent).toMatch(/import\s*\{[^}]*\bCreditCard\b/);
    });

    it("should import all icons from lucide-react", () => {
      expect(sidebarContent).toContain("from \"lucide-react\"");
    });
  });

  // =========================================================================
  // Total Section Count
  // =========================================================================
  describe("Total navigation structure", () => {
    it("should have exactly 9 navigation sections", () => {
      const sections = sidebarContent.match(/label:\s*"(CRM|Marketing|Sales|Service|Commerce|Automations|Content|Reporting|Data Management)"/g);
      expect(sections).toHaveLength(9);
    });

    it("should define navSections as NavSection array", () => {
      expect(sidebarContent).toContain("const navSections: NavSection[]");
    });

    it("should define NavItem interface", () => {
      expect(sidebarContent).toContain("interface NavItem");
    });

    it("should define NavSection interface", () => {
      expect(sidebarContent).toContain("interface NavSection");
    });

    it("should iterate over navSections with map", () => {
      expect(sidebarContent).toContain("navSections.map");
    });

    it("should use section.label as key", () => {
      expect(sidebarContent).toContain("key={section.label}");
    });
  });

  // =========================================================================
  // Sidebar Layout & Styling
  // =========================================================================
  describe("Sidebar layout and styling", () => {
    it("should be a fixed aside element", () => {
      expect(sidebarContent).toContain("<aside");
    });

    it("should have fixed left-0 top-0 positioning", () => {
      expect(sidebarContent).toContain("fixed left-0 top-0");
    });

    it("should have dark background color #1f1f1f", () => {
      expect(sidebarContent).toContain("bg-[#1f1f1f]");
    });

    it("should have light text color #f8f5ee", () => {
      expect(sidebarContent).toContain("text-[#f8f5ee]");
    });

    it("should have transition-all duration-300 for animation", () => {
      expect(sidebarContent).toContain("transition-all duration-300");
    });

    it("should have w-14 when collapsed", () => {
      expect(sidebarContent).toContain('collapsed ? "w-14" : "w-[240px]"');
    });

    it("should have w-[240px] when expanded", () => {
      expect(sidebarContent).toContain('w-[240px]');
    });

    it("should have overflow-y-auto nav section", () => {
      expect(sidebarContent).toContain("overflow-y-auto");
    });

    it("should have h-screen height", () => {
      expect(sidebarContent).toContain("h-screen");
    });

    it("should have z-40 layer", () => {
      expect(sidebarContent).toContain("z-40");
    });

    it("should use border-l-[3px] border-[#ff4800] for active items", () => {
      expect(sidebarContent).toContain('border-l-[3px] border-[#ff4800]');
    });

    it("should have HubSpot branding text in logo area", () => {
      expect(sidebarContent).toContain("HubSpot");
    });

    it("should have a collapse/expand toggle button with aria-label", () => {
      expect(sidebarContent).toContain('aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}');
    });
  });
});
