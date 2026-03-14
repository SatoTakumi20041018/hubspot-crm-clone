import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const schemaPath = path.resolve(__dirname, "../../../prisma/schema.prisma");
const schema = fs.readFileSync(schemaPath, "utf-8");

// Helper: extract a model block from the schema
function getModelBlock(modelName: string): string {
  const regex = new RegExp(`model\\s+${modelName}\\s*\\{([\\s\\S]*?)\\n\\}`, "m");
  const match = schema.match(regex);
  return match ? match[1] : "";
}

// Helper: get field definition line
function getFieldLine(modelName: string, fieldName: string): string {
  const block = getModelBlock(modelName);
  const regex = new RegExp(`^\\s+(${fieldName}\\s+.*)$`, "m");
  const match = block.match(regex);
  return match ? match[1].trim() : "";
}

// ===================================================================
// 1. Contact -> Company: many-to-one (companyId)
// ===================================================================
describe("Contact -> Company association (many-to-one)", () => {
  it("should have companyId foreign key on Contact", () => {
    const line = getFieldLine("Contact", "companyId");
    expect(line).toContain("String?");
  });

  it("should have company relation on Contact referencing Company", () => {
    const line = getFieldLine("Contact", "company");
    expect(line).toContain("Company?");
    expect(line).toContain("@relation");
    expect(line).toContain("companyId");
  });

  it("should have contacts array on Company (reverse)", () => {
    const line = getFieldLine("Company", "contacts");
    expect(line).toContain("Contact[]");
  });

  it("should allow a Contact to exist without a Company (optional)", () => {
    const line = getFieldLine("Contact", "companyId");
    expect(line).toContain("?");
  });

  it("should index companyId on Contact for performance", () => {
    const block = getModelBlock("Contact");
    expect(block).toContain("@@index([companyId])");
  });
});

// ===================================================================
// 2. Contact -> Deal: many-to-many (DealContact)
// ===================================================================
describe("Contact -> Deal association (many-to-many via DealContact)", () => {
  it("should have DealContact junction model", () => {
    expect(schema).toContain("model DealContact {");
  });

  it("should have dealId on DealContact", () => {
    const line = getFieldLine("DealContact", "dealId");
    expect(line).toMatch(/dealId\s+String\b/);
  });

  it("should have contactId on DealContact", () => {
    const line = getFieldLine("DealContact", "contactId");
    expect(line).toMatch(/contactId\s+String\b/);
  });

  it("should have composite primary key @@id([dealId, contactId])", () => {
    const block = getModelBlock("DealContact");
    expect(block).toContain("@@id([dealId, contactId])");
  });

  it("should have deal relation on DealContact with cascade delete", () => {
    const line = getFieldLine("DealContact", "deal");
    expect(line).toContain("Deal");
    expect(line).toContain("onDelete: Cascade");
  });

  it("should have contact relation on DealContact with cascade delete", () => {
    const line = getFieldLine("DealContact", "contact");
    expect(line).toContain("Contact");
    expect(line).toContain("onDelete: Cascade");
  });

  it("should have deals (DealContact[]) on Contact", () => {
    const line = getFieldLine("Contact", "deals");
    expect(line).toContain("DealContact[]");
  });

  it("should have contacts (DealContact[]) on Deal", () => {
    const line = getFieldLine("Deal", "contacts");
    expect(line).toContain("DealContact[]");
  });
});

// ===================================================================
// 3. Deal -> Company: many-to-one
// ===================================================================
describe("Deal -> Company association (many-to-one)", () => {
  it("should have companyId foreign key on Deal", () => {
    const line = getFieldLine("Deal", "companyId");
    expect(line).toContain("String?");
  });

  it("should have company relation on Deal referencing Company", () => {
    const line = getFieldLine("Deal", "company");
    expect(line).toContain("Company?");
    expect(line).toContain("@relation");
  });

  it("should have deals array on Company (reverse)", () => {
    const line = getFieldLine("Company", "deals");
    expect(line).toContain("Deal[]");
  });
});

// ===================================================================
// 4. Ticket -> Contact: many-to-one
// ===================================================================
describe("Ticket -> Contact association (many-to-one)", () => {
  it("should have contactId foreign key on Ticket", () => {
    const line = getFieldLine("Ticket", "contactId");
    expect(line).toContain("String?");
  });

  it("should have contact relation on Ticket referencing Contact", () => {
    const line = getFieldLine("Ticket", "contact");
    expect(line).toContain("Contact?");
    expect(line).toContain("@relation");
  });

  it("should have tickets array on Contact (reverse)", () => {
    const line = getFieldLine("Contact", "tickets");
    expect(line).toContain("Ticket[]");
  });

  it("should index contactId on Ticket", () => {
    const block = getModelBlock("Ticket");
    expect(block).toContain("@@index([contactId])");
  });
});

// ===================================================================
// 5. Ticket -> Company: many-to-one
// ===================================================================
describe("Ticket -> Company association (many-to-one)", () => {
  it("should have companyId foreign key on Ticket", () => {
    const line = getFieldLine("Ticket", "companyId");
    expect(line).toContain("String?");
  });

  it("should have company relation on Ticket referencing Company", () => {
    const line = getFieldLine("Ticket", "company");
    expect(line).toContain("Company?");
    expect(line).toContain("@relation");
  });

  it("should have tickets array on Company (reverse)", () => {
    const line = getFieldLine("Company", "tickets");
    expect(line).toContain("Ticket[]");
  });
});

// ===================================================================
// 6. Deal -> Pipeline: many-to-one
// ===================================================================
describe("Deal -> Pipeline association (many-to-one)", () => {
  it("should have pipelineId foreign key on Deal", () => {
    const line = getFieldLine("Deal", "pipelineId");
    expect(line).toMatch(/pipelineId\s+String\b/);
  });

  it("should have pipeline relation on Deal referencing Pipeline", () => {
    const line = getFieldLine("Deal", "pipeline");
    expect(line).toContain("Pipeline");
    expect(line).toContain("@relation");
    expect(line).toContain("pipelineId");
  });

  it("should have deals array on Pipeline (reverse)", () => {
    const line = getFieldLine("Pipeline", "deals");
    expect(line).toContain("Deal[]");
  });
});

// ===================================================================
// 7. Deal -> PipelineStage: many-to-one
// ===================================================================
describe("Deal -> PipelineStage association (many-to-one)", () => {
  it("should have stageId foreign key on Deal", () => {
    const line = getFieldLine("Deal", "stageId");
    expect(line).toMatch(/stageId\s+String\b/);
  });

  it("should have stage relation on Deal referencing PipelineStage", () => {
    const line = getFieldLine("Deal", "stage");
    expect(line).toContain("PipelineStage");
    expect(line).toContain("@relation");
    expect(line).toContain("stageId");
  });

  it("should have deals array on PipelineStage (reverse)", () => {
    const line = getFieldLine("PipelineStage", "deals");
    expect(line).toContain("Deal[]");
  });

  it("should index stageId on Deal", () => {
    const block = getModelBlock("Deal");
    expect(block).toContain("@@index([stageId])");
  });
});

// ===================================================================
// 8. Activity -> all objects (Contact, Company, Deal, Ticket)
// ===================================================================
describe("Activity -> all object associations", () => {
  it("should have contactId on Activity", () => {
    const line = getFieldLine("Activity", "contactId");
    expect(line).toContain("String?");
  });

  it("should have contact relation on Activity", () => {
    const line = getFieldLine("Activity", "contact");
    expect(line).toContain("Contact?");
  });

  it("should have companyId on Activity", () => {
    const line = getFieldLine("Activity", "companyId");
    expect(line).toContain("String?");
  });

  it("should have company relation on Activity", () => {
    const line = getFieldLine("Activity", "company");
    expect(line).toContain("Company?");
  });

  it("should have dealId on Activity", () => {
    const line = getFieldLine("Activity", "dealId");
    expect(line).toContain("String?");
  });

  it("should have deal relation on Activity", () => {
    const line = getFieldLine("Activity", "deal");
    expect(line).toContain("Deal?");
  });

  it("should have ticketId on Activity", () => {
    const line = getFieldLine("Activity", "ticketId");
    expect(line).toContain("String?");
  });

  it("should have ticket relation on Activity", () => {
    const line = getFieldLine("Activity", "ticket");
    expect(line).toContain("Ticket?");
  });
});

// ===================================================================
// 9. Note -> all objects (Contact, Company, Deal, Ticket)
// ===================================================================
describe("Note -> all object associations", () => {
  it("should have contactId on Note", () => {
    expect(getFieldLine("Note", "contactId")).toContain("String?");
  });

  it("should have contact relation on Note", () => {
    expect(getFieldLine("Note", "contact")).toContain("Contact?");
  });

  it("should have companyId on Note", () => {
    expect(getFieldLine("Note", "companyId")).toContain("String?");
  });

  it("should have company relation on Note", () => {
    expect(getFieldLine("Note", "company")).toContain("Company?");
  });

  it("should have dealId on Note", () => {
    expect(getFieldLine("Note", "dealId")).toContain("String?");
  });

  it("should have deal relation on Note", () => {
    expect(getFieldLine("Note", "deal")).toContain("Deal?");
  });

  it("should have ticketId on Note", () => {
    expect(getFieldLine("Note", "ticketId")).toContain("String?");
  });

  it("should have ticket relation on Note", () => {
    expect(getFieldLine("Note", "ticket")).toContain("Ticket?");
  });
});

// ===================================================================
// 10. User -> owned records
// ===================================================================
describe("User -> owned records associations", () => {
  it("should own Contact records (contacts relation)", () => {
    const line = getFieldLine("User", "contacts");
    expect(line).toContain("Contact[]");
  });

  it("should own Company records (companies relation)", () => {
    const line = getFieldLine("User", "companies");
    expect(line).toContain("Company[]");
  });

  it("should own Deal records (deals relation)", () => {
    const line = getFieldLine("User", "deals");
    expect(line).toContain("Deal[]");
  });

  it("should own Ticket records (tickets relation)", () => {
    const line = getFieldLine("User", "tickets");
    expect(line).toContain("Ticket[]");
  });

  it("should own Task records (tasks relation)", () => {
    const line = getFieldLine("User", "tasks");
    expect(line).toContain("Task[]");
  });
});
