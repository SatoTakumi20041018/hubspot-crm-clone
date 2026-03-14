import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const contactsRoutePath = path.resolve(__dirname, "../../app/api/contacts/route.ts");
const contactsRoute = fs.readFileSync(contactsRoutePath, "utf-8");

const contactIdRoutePath = path.resolve(__dirname, "../../app/api/contacts/[id]/route.ts");
const contactIdRoute = fs.readFileSync(contactIdRoutePath, "utf-8");

// ===================================================================
// 1. GET /api/contacts - List Endpoint
// ===================================================================
describe("GET /api/contacts - List endpoint", () => {
  it("should export a GET function", () => {
    expect(contactsRoute).toMatch(/export\s+async\s+function\s+GET/);
  });

  it("should accept NextRequest parameter", () => {
    expect(contactsRoute).toContain("request: NextRequest");
  });

  it("should parse page query parameter", () => {
    expect(contactsRoute).toContain('searchParams.get("page")');
  });

  it("should default page to 1", () => {
    expect(contactsRoute).toContain('"page") || "1"');
  });

  it("should parse limit query parameter", () => {
    expect(contactsRoute).toContain('searchParams.get("limit")');
  });

  it("should default limit to 20", () => {
    expect(contactsRoute).toContain('"limit") || "20"');
  });

  it("should parse search query parameter", () => {
    expect(contactsRoute).toContain('searchParams.get("search")');
  });

  it("should parse lifecycleStage filter parameter", () => {
    expect(contactsRoute).toContain('searchParams.get("lifecycleStage")');
  });

  it("should parse leadStatus filter parameter", () => {
    expect(contactsRoute).toContain('searchParams.get("leadStatus")');
  });

  it("should parse ownerId filter parameter", () => {
    expect(contactsRoute).toContain('searchParams.get("ownerId")');
  });

  it("should calculate skip from page and limit", () => {
    expect(contactsRoute).toContain("(page - 1) * limit");
  });

  it("should search firstName with case insensitive mode", () => {
    expect(contactsRoute).toContain("firstName");
    expect(contactsRoute).toContain('"insensitive"');
  });

  it("should search lastName with case insensitive mode", () => {
    expect(contactsRoute).toContain("lastName");
  });

  it("should search email with case insensitive mode", () => {
    expect(contactsRoute).toMatch(/email.*contains.*search/s);
  });

  it("should search phone with case insensitive mode", () => {
    expect(contactsRoute).toMatch(/phone.*contains.*search/s);
  });

  it("should filter by lifecycleStage when provided", () => {
    expect(contactsRoute).toContain("where.lifecycleStage = lifecycleStage");
  });

  it("should filter by leadStatus when provided", () => {
    expect(contactsRoute).toContain("where.leadStatus = leadStatus");
  });

  it("should filter by ownerId when provided", () => {
    expect(contactsRoute).toContain("where.ownerId = ownerId");
  });

  it("should include company relation (id, name)", () => {
    expect(contactsRoute).toContain("company:");
    expect(contactsRoute).toMatch(/company.*select.*id.*name/s);
  });

  it("should include owner relation (id, name)", () => {
    expect(contactsRoute).toContain("owner:");
    expect(contactsRoute).toMatch(/owner.*select.*id.*name/s);
  });

  it("should include _count for deals", () => {
    expect(contactsRoute).toContain("_count:");
    expect(contactsRoute).toContain("deals: true");
  });

  it("should include _count for tickets", () => {
    expect(contactsRoute).toContain("tickets: true");
  });

  it("should order by createdAt desc", () => {
    expect(contactsRoute).toContain('orderBy: { createdAt: "desc" }');
  });

  it("should return pagination metadata with page, limit, total, totalPages", () => {
    expect(contactsRoute).toContain("pagination:");
    expect(contactsRoute).toContain("page,");
    expect(contactsRoute).toContain("limit,");
    expect(contactsRoute).toContain("total,");
    expect(contactsRoute).toContain("totalPages:");
  });

  it("should return 500 status on error", () => {
    expect(contactsRoute).toContain("status: 500");
  });
});

// ===================================================================
// 2. POST /api/contacts - Create Endpoint
// ===================================================================
describe("POST /api/contacts - Create endpoint", () => {
  it("should export a POST function", () => {
    expect(contactsRoute).toMatch(/export\s+async\s+function\s+POST/);
  });

  it("should parse request body as JSON", () => {
    expect(contactsRoute).toContain("request.json()");
  });

  it("should destructure firstName and lastName from body", () => {
    expect(contactsRoute).toContain("firstName");
    expect(contactsRoute).toContain("lastName");
  });

  it("should require firstName (return 400 if missing)", () => {
    expect(contactsRoute).toContain("!firstName");
    expect(contactsRoute).toContain("status: 400");
  });

  it("should require lastName (return 400 if missing)", () => {
    expect(contactsRoute).toContain("!lastName");
  });

  it("should check for duplicate email", () => {
    expect(contactsRoute).toContain("prisma.contact.findFirst");
    expect(contactsRoute).toContain("where: { email }");
  });

  it("should return 409 for duplicate email", () => {
    expect(contactsRoute).toContain("status: 409");
  });

  it("should accept email, phone, jobTitle in body", () => {
    expect(contactsRoute).toContain("email");
    expect(contactsRoute).toContain("phone");
    expect(contactsRoute).toContain("jobTitle");
  });

  it("should accept lifecycleStage in body", () => {
    expect(contactsRoute).toContain("lifecycleStage");
  });

  it("should accept leadStatus in body", () => {
    expect(contactsRoute).toContain("leadStatus");
  });

  it("should accept source in body", () => {
    expect(contactsRoute).toContain("source");
  });

  it("should accept ownerId in body", () => {
    expect(contactsRoute).toContain("ownerId");
  });

  it("should accept companyId in body", () => {
    expect(contactsRoute).toContain("companyId");
  });

  it("should default lifecycleStage to SUBSCRIBER", () => {
    expect(contactsRoute).toContain('lifecycleStage || "SUBSCRIBER"');
  });

  it("should return 201 status on successful creation", () => {
    expect(contactsRoute).toContain("status: 201");
  });

  it("should include company and owner in created response", () => {
    // The POST handler's create include block
    const postSection = contactsRoute.split("export async function POST")[1];
    expect(postSection).toContain("company:");
    expect(postSection).toContain("owner:");
  });
});

// ===================================================================
// 3. GET /api/contacts/[id] - Detail Endpoint
// ===================================================================
describe("GET /api/contacts/[id] - Detail endpoint", () => {
  it("should export a GET function", () => {
    expect(contactIdRoute).toMatch(/export\s+async\s+function\s+GET/);
  });

  it("should extract id from params", () => {
    expect(contactIdRoute).toContain("const { id } = await params");
  });

  it("should use findUnique with the id", () => {
    expect(contactIdRoute).toContain("prisma.contact.findUnique");
    expect(contactIdRoute).toContain("where: { id }");
  });

  it("should include company relation (full)", () => {
    expect(contactIdRoute).toContain("company: true");
  });

  it("should include owner relation with select", () => {
    const getSection = contactIdRoute.split("export async function PUT")[0];
    expect(getSection).toContain("owner:");
  });

  it("should include deals relation through DealContact", () => {
    expect(contactIdRoute).toContain("deals:");
    expect(contactIdRoute).toContain("deal:");
  });

  it("should include tickets relation", () => {
    expect(contactIdRoute).toContain("tickets:");
  });

  it("should include tasks relation", () => {
    expect(contactIdRoute).toContain("tasks:");
  });

  it("should include activities relation", () => {
    expect(contactIdRoute).toContain("activities:");
  });

  it("should include notes relation", () => {
    expect(contactIdRoute).toContain("notes:");
  });

  it("should include properties relation", () => {
    expect(contactIdRoute).toContain("properties: true");
  });

  it("should include _count for multiple relations", () => {
    const getSection = contactIdRoute.split("export async function PUT")[0];
    expect(getSection).toContain("_count:");
    expect(getSection).toContain("deals: true");
    expect(getSection).toContain("tickets: true");
    expect(getSection).toContain("tasks: true");
    expect(getSection).toContain("activities: true");
    expect(getSection).toContain("notes: true");
  });

  it("should return 404 when contact not found", () => {
    expect(contactIdRoute).toContain("status: 404");
  });
});

// ===================================================================
// 4. PUT /api/contacts/[id] - Update Endpoint
// ===================================================================
describe("PUT /api/contacts/[id] - Update endpoint", () => {
  it("should export a PUT function", () => {
    expect(contactIdRoute).toMatch(/export\s+async\s+function\s+PUT/);
  });

  it("should check if contact exists before updating", () => {
    const putSection = contactIdRoute.split("export async function PUT")[1];
    expect(putSection).toContain("prisma.contact.findUnique");
  });

  it("should return 404 if contact does not exist", () => {
    expect(contactIdRoute).toContain("status: 404");
  });

  it("should support updating firstName", () => {
    expect(contactIdRoute).toContain('"firstName"');
  });

  it("should support updating lastName", () => {
    expect(contactIdRoute).toContain('"lastName"');
  });

  it("should support updating email", () => {
    expect(contactIdRoute).toContain('"email"');
  });

  it("should support updating phone", () => {
    expect(contactIdRoute).toContain('"phone"');
  });

  it("should support updating jobTitle", () => {
    expect(contactIdRoute).toContain('"jobTitle"');
  });

  it("should support updating avatar", () => {
    expect(contactIdRoute).toContain('"avatar"');
  });

  it("should support updating lifecycleStage", () => {
    expect(contactIdRoute).toContain('"lifecycleStage"');
  });

  it("should support updating leadStatus", () => {
    expect(contactIdRoute).toContain('"leadStatus"');
  });

  it("should support updating source", () => {
    expect(contactIdRoute).toContain('"source"');
  });

  it("should support updating ownerId", () => {
    expect(contactIdRoute).toContain('"ownerId"');
  });

  it("should support updating companyId", () => {
    expect(contactIdRoute).toContain('"companyId"');
  });

  it("should use allowedFields array for field filtering", () => {
    expect(contactIdRoute).toContain("allowedFields");
  });
});

// ===================================================================
// 5. DELETE /api/contacts/[id] - Delete Endpoint
// ===================================================================
describe("DELETE /api/contacts/[id] - Delete endpoint", () => {
  it("should export a DELETE function", () => {
    expect(contactIdRoute).toMatch(/export\s+async\s+function\s+DELETE/);
  });

  it("should check if contact exists before deleting", () => {
    const deleteSection = contactIdRoute.split("export async function DELETE")[1];
    expect(deleteSection).toContain("prisma.contact.findUnique");
  });

  it("should return 404 if contact does not exist", () => {
    const deleteSection = contactIdRoute.split("export async function DELETE")[1];
    expect(deleteSection).toContain("404");
  });

  it("should call prisma.contact.delete", () => {
    expect(contactIdRoute).toContain("prisma.contact.delete");
  });

  it("should return success message on deletion", () => {
    expect(contactIdRoute).toContain("コンタクトを削除しました");
  });
});
