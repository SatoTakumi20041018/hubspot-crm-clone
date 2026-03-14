import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const dealsRoutePath = path.resolve(__dirname, "../../app/api/deals/route.ts");
const dealsRoute = fs.readFileSync(dealsRoutePath, "utf-8");

// ===================================================================
// 1. GET /api/deals - List Endpoint
// ===================================================================
describe("GET /api/deals - List endpoint", () => {
  it("should export a GET function", () => {
    expect(dealsRoute).toMatch(/export\s+async\s+function\s+GET/);
  });

  it("should accept NextRequest parameter", () => {
    expect(dealsRoute).toContain("request: NextRequest");
  });

  it("should parse page query parameter", () => {
    expect(dealsRoute).toContain('searchParams.get("page")');
  });

  it("should parse limit query parameter", () => {
    expect(dealsRoute).toContain('searchParams.get("limit")');
  });

  it("should default limit to 50", () => {
    expect(dealsRoute).toContain('"limit") || "50"');
  });

  it("should parse search query parameter", () => {
    expect(dealsRoute).toContain('searchParams.get("search")');
  });

  it("should parse pipelineId filter parameter", () => {
    expect(dealsRoute).toContain('searchParams.get("pipelineId")');
  });

  it("should parse stageId filter parameter", () => {
    expect(dealsRoute).toContain('searchParams.get("stageId")');
  });

  it("should parse ownerId filter parameter", () => {
    expect(dealsRoute).toContain('searchParams.get("ownerId")');
  });

  it("should filter by pipelineId when provided", () => {
    expect(dealsRoute).toContain("where.pipelineId = pipelineId");
  });

  it("should filter by stageId when provided", () => {
    expect(dealsRoute).toContain("where.stageId = stageId");
  });

  it("should filter by ownerId when provided", () => {
    expect(dealsRoute).toContain("where.ownerId = ownerId");
  });

  it("should search by deal name case insensitively", () => {
    expect(dealsRoute).toContain("name:");
    expect(dealsRoute).toContain("contains: search");
    expect(dealsRoute).toContain('"insensitive"');
  });

  it("should include stage relation with id, name, color, probability", () => {
    const getSection = dealsRoute.split("export async function POST")[0];
    expect(getSection).toContain("stage:");
    expect(getSection).toMatch(/stage.*select.*id.*name.*color.*probability/s);
  });

  it("should include pipeline relation with id, name", () => {
    const getSection = dealsRoute.split("export async function POST")[0];
    expect(getSection).toContain("pipeline:");
  });

  it("should include owner relation with id, name", () => {
    const getSection = dealsRoute.split("export async function POST")[0];
    expect(getSection).toContain("owner:");
  });

  it("should include company relation with id, name", () => {
    const getSection = dealsRoute.split("export async function POST")[0];
    expect(getSection).toContain("company:");
  });

  it("should include contacts relation through DealContact", () => {
    const getSection = dealsRoute.split("export async function POST")[0];
    expect(getSection).toContain("contacts:");
    expect(getSection).toContain("contact:");
  });

  it("should order by createdAt desc", () => {
    expect(dealsRoute).toContain('orderBy: { createdAt: "desc" }');
  });

  it("should return pagination metadata", () => {
    expect(dealsRoute).toContain("pagination:");
    expect(dealsRoute).toContain("totalPages:");
  });

  it("should use prisma.deal.count for total", () => {
    expect(dealsRoute).toContain("prisma.deal.count");
  });

  it("should return 500 status on error", () => {
    expect(dealsRoute).toContain("status: 500");
  });
});

// ===================================================================
// 2. POST /api/deals - Create Endpoint
// ===================================================================
describe("POST /api/deals - Create endpoint", () => {
  it("should export a POST function", () => {
    expect(dealsRoute).toMatch(/export\s+async\s+function\s+POST/);
  });

  it("should parse request body as JSON", () => {
    expect(dealsRoute).toContain("request.json()");
  });

  it("should require name (return 400 if missing)", () => {
    expect(dealsRoute).toContain("!name");
    expect(dealsRoute).toContain("status: 400");
  });

  it("should require stageId (return 400 if missing)", () => {
    expect(dealsRoute).toContain("!stageId");
  });

  it("should require pipelineId (return 400 if missing)", () => {
    expect(dealsRoute).toContain("!pipelineId");
  });

  it("should accept amount in body", () => {
    const postSection = dealsRoute.split("export async function POST")[1];
    expect(postSection).toContain("amount");
  });

  it("should parse amount as float", () => {
    expect(dealsRoute).toContain("parseFloat(amount)");
  });

  it("should accept currency with default JPY", () => {
    expect(dealsRoute).toContain('currency || "JPY"');
  });

  it("should accept closeDate and convert to Date", () => {
    expect(dealsRoute).toContain("new Date(closeDate)");
  });

  it("should accept probability and parse as float", () => {
    expect(dealsRoute).toContain("parseFloat(probability)");
  });

  it("should accept ownerId in body", () => {
    expect(dealsRoute).toContain("ownerId");
  });

  it("should accept companyId in body", () => {
    expect(dealsRoute).toContain("companyId");
  });

  it("should accept priority with default MEDIUM", () => {
    expect(dealsRoute).toContain('priority || "MEDIUM"');
  });

  it("should accept contactIds for many-to-many creation", () => {
    expect(dealsRoute).toContain("contactIds");
  });

  it("should create DealContact records when contactIds provided", () => {
    expect(dealsRoute).toContain("contactIds?.length");
    expect(dealsRoute).toContain("create: contactIds.map");
  });

  it("should map contactIds to DealContact create objects", () => {
    expect(dealsRoute).toContain("contactId: string");
    expect(dealsRoute).toContain("contactId,");
  });

  it("should return 201 status on successful creation", () => {
    expect(dealsRoute).toContain("status: 201");
  });

  it("should include stage in created deal response", () => {
    const postSection = dealsRoute.split("export async function POST")[1];
    expect(postSection).toContain("stage:");
  });

  it("should include pipeline in created deal response", () => {
    const postSection = dealsRoute.split("export async function POST")[1];
    expect(postSection).toContain("pipeline:");
  });

  it("should include owner in created deal response", () => {
    const postSection = dealsRoute.split("export async function POST")[1];
    expect(postSection).toContain("owner:");
  });

  it("should include company in created deal response", () => {
    const postSection = dealsRoute.split("export async function POST")[1];
    expect(postSection).toContain("company:");
  });

  it("should include contacts in created deal response", () => {
    const postSection = dealsRoute.split("export async function POST")[1];
    expect(postSection).toContain("contacts:");
  });

  it("should use prisma.deal.create", () => {
    expect(dealsRoute).toContain("prisma.deal.create");
  });

  it("should destructure all expected fields from body", () => {
    expect(dealsRoute).toContain("name");
    expect(dealsRoute).toContain("amount");
    expect(dealsRoute).toContain("currency");
    expect(dealsRoute).toContain("closeDate");
    expect(dealsRoute).toContain("probability");
    expect(dealsRoute).toContain("stageId");
    expect(dealsRoute).toContain("pipelineId");
    expect(dealsRoute).toContain("ownerId");
    expect(dealsRoute).toContain("companyId");
    expect(dealsRoute).toContain("priority");
    expect(dealsRoute).toContain("contactIds");
  });

  it("should include contact firstName and lastName in response contacts", () => {
    expect(dealsRoute).toContain("firstName");
    expect(dealsRoute).toContain("lastName");
  });

  it("should handle errors with 500 status", () => {
    const postSection = dealsRoute.split("export async function POST")[1];
    expect(postSection).toContain("status: 500");
  });
});
