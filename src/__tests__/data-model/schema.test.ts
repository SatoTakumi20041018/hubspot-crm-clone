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

// Helper: extract an enum block from the schema
function getEnumBlock(enumName: string): string {
  const regex = new RegExp(`enum\\s+${enumName}\\s*\\{([\\s\\S]*?)\\n\\}`, "m");
  const match = schema.match(regex);
  return match ? match[1] : "";
}

// Helper: get enum values
function getEnumValues(enumName: string): string[] {
  const block = getEnumBlock(enumName);
  return block
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("//"));
}

// Helper: check if field exists in model
function modelHasField(modelName: string, fieldName: string): boolean {
  const block = getModelBlock(modelName);
  const regex = new RegExp(`^\\s+${fieldName}\\s+`, "m");
  return regex.test(block);
}

// Helper: get field definition line
function getFieldLine(modelName: string, fieldName: string): string {
  const block = getModelBlock(modelName);
  const regex = new RegExp(`^\\s+(${fieldName}\\s+.*)$`, "m");
  const match = block.match(regex);
  return match ? match[1].trim() : "";
}

// ===================================================================
// 1. USER MODEL (20 tests)
// ===================================================================
describe("User model", () => {
  it("should exist in the schema", () => {
    expect(schema).toContain("model User {");
  });

  it("should have id field as cuid", () => {
    const line = getFieldLine("User", "id");
    expect(line).toContain("String");
    expect(line).toContain("@id");
    expect(line).toContain("@default(cuid())");
  });

  it("should have name field as optional String", () => {
    const line = getFieldLine("User", "name");
    expect(line).toContain("String?");
  });

  it("should have email field as unique String", () => {
    const line = getFieldLine("User", "email");
    expect(line).toContain("String");
    expect(line).toContain("@unique");
  });

  it("should have emailVerified field as optional DateTime", () => {
    const line = getFieldLine("User", "emailVerified");
    expect(line).toContain("DateTime?");
  });

  it("should have hashedPassword field as optional String", () => {
    const line = getFieldLine("User", "hashedPassword");
    expect(line).toContain("String?");
  });

  it("should have image field as optional String", () => {
    const line = getFieldLine("User", "image");
    expect(line).toContain("String?");
  });

  it("should have role field with default MEMBER", () => {
    const line = getFieldLine("User", "role");
    expect(line).toContain("UserRole");
    expect(line).toContain("@default(MEMBER)");
  });

  it("should have createdAt field with default now()", () => {
    const line = getFieldLine("User", "createdAt");
    expect(line).toContain("DateTime");
    expect(line).toContain("@default(now())");
  });

  it("should have updatedAt field", () => {
    const line = getFieldLine("User", "updatedAt");
    expect(line).toContain("DateTime");
    expect(line).toContain("@updatedAt");
  });

  it("should have accounts relation", () => {
    expect(modelHasField("User", "accounts")).toBe(true);
    const line = getFieldLine("User", "accounts");
    expect(line).toContain("Account[]");
  });

  it("should have sessions relation", () => {
    expect(modelHasField("User", "sessions")).toBe(true);
    const line = getFieldLine("User", "sessions");
    expect(line).toContain("Session[]");
  });

  it("should have contacts relation", () => {
    const line = getFieldLine("User", "contacts");
    expect(line).toContain("Contact[]");
  });

  it("should have companies relation", () => {
    const line = getFieldLine("User", "companies");
    expect(line).toContain("Company[]");
  });

  it("should have deals relation", () => {
    const line = getFieldLine("User", "deals");
    expect(line).toContain("Deal[]");
  });

  it("should have tickets relation", () => {
    const line = getFieldLine("User", "tickets");
    expect(line).toContain("Ticket[]");
  });

  it("should have tasks relation", () => {
    const line = getFieldLine("User", "tasks");
    expect(line).toContain("Task[]");
  });

  it("should have activities relation", () => {
    const line = getFieldLine("User", "activities");
    expect(line).toContain("Activity[]");
  });

  it("should have notes relation", () => {
    const line = getFieldLine("User", "notes");
    expect(line).toContain("Note[]");
  });

  it("should have all 10 scalar fields + 8 relations", () => {
    const block = getModelBlock("User");
    // scalar: id, name, email, emailVerified, hashedPassword, image, role, createdAt, updatedAt
    expect(modelHasField("User", "id")).toBe(true);
    expect(modelHasField("User", "name")).toBe(true);
    expect(modelHasField("User", "email")).toBe(true);
    expect(modelHasField("User", "emailVerified")).toBe(true);
    expect(modelHasField("User", "hashedPassword")).toBe(true);
    expect(modelHasField("User", "image")).toBe(true);
    expect(modelHasField("User", "role")).toBe(true);
    expect(modelHasField("User", "createdAt")).toBe(true);
    expect(modelHasField("User", "updatedAt")).toBe(true);
    // relations
    expect(block).toContain("Account[]");
    expect(block).toContain("Session[]");
    expect(block).toContain("Contact[]");
    expect(block).toContain("Company[]");
    expect(block).toContain("Deal[]");
    expect(block).toContain("Ticket[]");
    expect(block).toContain("Task[]");
    expect(block).toContain("Activity[]");
  });
});

// ===================================================================
// 2. CONTACT MODEL (25 tests)
// ===================================================================
describe("Contact model", () => {
  it("should exist in the schema", () => {
    expect(schema).toContain("model Contact {");
  });

  it("should have id field as cuid", () => {
    const line = getFieldLine("Contact", "id");
    expect(line).toContain("@id");
    expect(line).toContain("@default(cuid())");
  });

  it("should have email as optional String", () => {
    const line = getFieldLine("Contact", "email");
    expect(line).toContain("String?");
  });

  it("should have firstName as required String", () => {
    const line = getFieldLine("Contact", "firstName");
    expect(line).toMatch(/firstName\s+String\b/);
  });

  it("should have lastName as required String", () => {
    const line = getFieldLine("Contact", "lastName");
    expect(line).toMatch(/lastName\s+String\b/);
  });

  it("should have phone as optional", () => {
    const line = getFieldLine("Contact", "phone");
    expect(line).toContain("String?");
  });

  it("should have jobTitle as optional", () => {
    const line = getFieldLine("Contact", "jobTitle");
    expect(line).toContain("String?");
  });

  it("should have avatar as optional", () => {
    const line = getFieldLine("Contact", "avatar");
    expect(line).toContain("String?");
  });

  it("should have lifecycleStage with default SUBSCRIBER", () => {
    const line = getFieldLine("Contact", "lifecycleStage");
    expect(line).toContain("LifecycleStage");
    expect(line).toContain("@default(SUBSCRIBER)");
  });

  it("should have leadStatus as optional LeadStatus", () => {
    const line = getFieldLine("Contact", "leadStatus");
    expect(line).toContain("LeadStatus?");
  });

  it("should have source as optional", () => {
    const line = getFieldLine("Contact", "source");
    expect(line).toContain("String?");
  });

  it("should have ownerId as optional foreign key", () => {
    const line = getFieldLine("Contact", "ownerId");
    expect(line).toContain("String?");
  });

  it("should have companyId as optional foreign key", () => {
    const line = getFieldLine("Contact", "companyId");
    expect(line).toContain("String?");
  });

  it("should have owner relation to User", () => {
    const line = getFieldLine("Contact", "owner");
    expect(line).toContain("User?");
    expect(line).toContain("@relation");
    expect(line).toContain("ownerId");
  });

  it("should have company relation to Company", () => {
    const line = getFieldLine("Contact", "company");
    expect(line).toContain("Company?");
    expect(line).toContain("@relation");
    expect(line).toContain("companyId");
  });

  it("should have deals relation through DealContact", () => {
    const line = getFieldLine("Contact", "deals");
    expect(line).toContain("DealContact[]");
  });

  it("should have tickets relation", () => {
    const line = getFieldLine("Contact", "tickets");
    expect(line).toContain("Ticket[]");
  });

  it("should have tasks relation", () => {
    const line = getFieldLine("Contact", "tasks");
    expect(line).toContain("Task[]");
  });

  it("should have activities relation", () => {
    const line = getFieldLine("Contact", "activities");
    expect(line).toContain("Activity[]");
  });

  it("should have notes relation", () => {
    const line = getFieldLine("Contact", "notes");
    expect(line).toContain("Note[]");
  });

  it("should have properties relation to ContactProperty", () => {
    const line = getFieldLine("Contact", "properties");
    expect(line).toContain("ContactProperty[]");
  });

  it("should have index on email", () => {
    const block = getModelBlock("Contact");
    expect(block).toContain("@@index([email])");
  });

  it("should have index on ownerId", () => {
    const block = getModelBlock("Contact");
    expect(block).toContain("@@index([ownerId])");
  });

  it("should have index on companyId", () => {
    const block = getModelBlock("Contact");
    expect(block).toContain("@@index([companyId])");
  });

  it("should have createdAt and updatedAt timestamps", () => {
    const createdAt = getFieldLine("Contact", "createdAt");
    const updatedAt = getFieldLine("Contact", "updatedAt");
    expect(createdAt).toContain("@default(now())");
    expect(updatedAt).toContain("@updatedAt");
  });
});

// ===================================================================
// 3. COMPANY MODEL (20 tests)
// ===================================================================
describe("Company model", () => {
  it("should exist in the schema", () => {
    expect(schema).toContain("model Company {");
  });

  it("should have id field as cuid", () => {
    const line = getFieldLine("Company", "id");
    expect(line).toContain("@id");
    expect(line).toContain("@default(cuid())");
  });

  it("should have name as required String", () => {
    const line = getFieldLine("Company", "name");
    expect(line).toMatch(/^\s*name\s+String\b/);
  });

  it("should have domain as optional", () => {
    const line = getFieldLine("Company", "domain");
    expect(line).toContain("String?");
  });

  it("should have industry as optional", () => {
    const line = getFieldLine("Company", "industry");
    expect(line).toContain("String?");
  });

  it("should have phone as optional", () => {
    const line = getFieldLine("Company", "phone");
    expect(line).toContain("String?");
  });

  it("should have city as optional", () => {
    const line = getFieldLine("Company", "city");
    expect(line).toContain("String?");
  });

  it("should have state as optional", () => {
    const line = getFieldLine("Company", "state");
    expect(line).toContain("String?");
  });

  it("should have country as optional", () => {
    const line = getFieldLine("Company", "country");
    expect(line).toContain("String?");
  });

  it("should have description as optional", () => {
    const line = getFieldLine("Company", "description");
    expect(line).toContain("String?");
  });

  it("should have annualRevenue as optional Float", () => {
    const line = getFieldLine("Company", "annualRevenue");
    expect(line).toContain("Float?");
  });

  it("should have employeeCount as optional Int", () => {
    const line = getFieldLine("Company", "employeeCount");
    expect(line).toContain("Int?");
  });

  it("should have ownerId as optional", () => {
    const line = getFieldLine("Company", "ownerId");
    expect(line).toContain("String?");
  });

  it("should have owner relation to User", () => {
    const line = getFieldLine("Company", "owner");
    expect(line).toContain("User?");
  });

  it("should have contacts relation", () => {
    const line = getFieldLine("Company", "contacts");
    expect(line).toContain("Contact[]");
  });

  it("should have deals relation", () => {
    const line = getFieldLine("Company", "deals");
    expect(line).toContain("Deal[]");
  });

  it("should have tickets relation", () => {
    const line = getFieldLine("Company", "tickets");
    expect(line).toContain("Ticket[]");
  });

  it("should have activities and notes relations", () => {
    const activities = getFieldLine("Company", "activities");
    const notes = getFieldLine("Company", "notes");
    expect(activities).toContain("Activity[]");
    expect(notes).toContain("Note[]");
  });

  it("should have properties relation to CompanyProperty", () => {
    const line = getFieldLine("Company", "properties");
    expect(line).toContain("CompanyProperty[]");
  });

  it("should have indexes on domain and ownerId", () => {
    const block = getModelBlock("Company");
    expect(block).toContain("@@index([domain])");
    expect(block).toContain("@@index([ownerId])");
  });
});

// ===================================================================
// 4. DEAL MODEL (20 tests)
// ===================================================================
describe("Deal model", () => {
  it("should exist in the schema", () => {
    expect(schema).toContain("model Deal {");
  });

  it("should have id field as cuid", () => {
    const line = getFieldLine("Deal", "id");
    expect(line).toContain("@id");
    expect(line).toContain("@default(cuid())");
  });

  it("should have name as required String", () => {
    const line = getFieldLine("Deal", "name");
    expect(line).toMatch(/^\s*name\s+String\b/);
  });

  it("should have amount as optional Float", () => {
    const line = getFieldLine("Deal", "amount");
    expect(line).toContain("Float?");
  });

  it("should have currency with default JPY", () => {
    const line = getFieldLine("Deal", "currency");
    expect(line).toContain("String");
    expect(line).toContain('@default("JPY")');
  });

  it("should have closeDate as optional DateTime", () => {
    const line = getFieldLine("Deal", "closeDate");
    expect(line).toContain("DateTime?");
  });

  it("should have probability with default 0", () => {
    const line = getFieldLine("Deal", "probability");
    expect(line).toContain("Float?");
    expect(line).toContain("@default(0)");
  });

  it("should have stageId as required String", () => {
    const line = getFieldLine("Deal", "stageId");
    expect(line).toMatch(/stageId\s+String\b/);
  });

  it("should have pipelineId as required String", () => {
    const line = getFieldLine("Deal", "pipelineId");
    expect(line).toMatch(/pipelineId\s+String\b/);
  });

  it("should have ownerId as optional", () => {
    const line = getFieldLine("Deal", "ownerId");
    expect(line).toContain("String?");
  });

  it("should have companyId as optional", () => {
    const line = getFieldLine("Deal", "companyId");
    expect(line).toContain("String?");
  });

  it("should have priority with default MEDIUM", () => {
    const line = getFieldLine("Deal", "priority");
    expect(line).toContain("Priority");
    expect(line).toContain("@default(MEDIUM)");
  });

  it("should have stage relation to PipelineStage", () => {
    const line = getFieldLine("Deal", "stage");
    expect(line).toContain("PipelineStage");
    expect(line).toContain("stageId");
  });

  it("should have pipeline relation to Pipeline", () => {
    const line = getFieldLine("Deal", "pipeline");
    expect(line).toContain("Pipeline");
    expect(line).toContain("pipelineId");
  });

  it("should have owner relation to User", () => {
    const line = getFieldLine("Deal", "owner");
    expect(line).toContain("User?");
  });

  it("should have company relation to Company", () => {
    const line = getFieldLine("Deal", "company");
    expect(line).toContain("Company?");
  });

  it("should have contacts relation through DealContact", () => {
    const line = getFieldLine("Deal", "contacts");
    expect(line).toContain("DealContact[]");
  });

  it("should have activities and notes relations", () => {
    const activities = getFieldLine("Deal", "activities");
    const notes = getFieldLine("Deal", "notes");
    expect(activities).toContain("Activity[]");
    expect(notes).toContain("Note[]");
  });

  it("should have properties relation to DealProperty", () => {
    const line = getFieldLine("Deal", "properties");
    expect(line).toContain("DealProperty[]");
  });

  it("should have indexes on stageId, pipelineId, ownerId", () => {
    const block = getModelBlock("Deal");
    expect(block).toContain("@@index([stageId])");
    expect(block).toContain("@@index([pipelineId])");
    expect(block).toContain("@@index([ownerId])");
  });
});

// ===================================================================
// 5. TICKET MODEL (20 tests)
// ===================================================================
describe("Ticket model", () => {
  it("should exist in the schema", () => {
    expect(schema).toContain("model Ticket {");
  });

  it("should have id field as cuid", () => {
    const line = getFieldLine("Ticket", "id");
    expect(line).toContain("@id");
    expect(line).toContain("@default(cuid())");
  });

  it("should have subject as required String", () => {
    const line = getFieldLine("Ticket", "subject");
    expect(line).toMatch(/subject\s+String\b/);
  });

  it("should have description as optional", () => {
    const line = getFieldLine("Ticket", "description");
    expect(line).toContain("String?");
  });

  it("should have status with default OPEN", () => {
    const line = getFieldLine("Ticket", "status");
    expect(line).toContain("TicketStatus");
    expect(line).toContain("@default(OPEN)");
  });

  it("should have priority with default MEDIUM", () => {
    const line = getFieldLine("Ticket", "priority");
    expect(line).toContain("Priority");
    expect(line).toContain("@default(MEDIUM)");
  });

  it("should have category as optional", () => {
    const line = getFieldLine("Ticket", "category");
    expect(line).toContain("String?");
  });

  it("should have ownerId as optional", () => {
    const line = getFieldLine("Ticket", "ownerId");
    expect(line).toContain("String?");
  });

  it("should have contactId as optional", () => {
    const line = getFieldLine("Ticket", "contactId");
    expect(line).toContain("String?");
  });

  it("should have companyId as optional", () => {
    const line = getFieldLine("Ticket", "companyId");
    expect(line).toContain("String?");
  });

  it("should have pipelineId as optional", () => {
    const line = getFieldLine("Ticket", "pipelineId");
    expect(line).toContain("String?");
  });

  it("should have stageId as optional", () => {
    const line = getFieldLine("Ticket", "stageId");
    expect(line).toContain("String?");
  });

  it("should have slaDeadline as optional DateTime", () => {
    const line = getFieldLine("Ticket", "slaDeadline");
    expect(line).toContain("DateTime?");
  });

  it("should have closedAt as optional DateTime", () => {
    const line = getFieldLine("Ticket", "closedAt");
    expect(line).toContain("DateTime?");
  });

  it("should have owner relation to User", () => {
    const line = getFieldLine("Ticket", "owner");
    expect(line).toContain("User?");
  });

  it("should have contact relation to Contact", () => {
    const line = getFieldLine("Ticket", "contact");
    expect(line).toContain("Contact?");
  });

  it("should have company relation to Company", () => {
    const line = getFieldLine("Ticket", "company");
    expect(line).toContain("Company?");
  });

  it("should have pipeline relation to TicketPipeline", () => {
    const line = getFieldLine("Ticket", "pipeline");
    expect(line).toContain("TicketPipeline?");
  });

  it("should have stage relation to TicketStage", () => {
    const line = getFieldLine("Ticket", "stage");
    expect(line).toContain("TicketStage?");
  });

  it("should have indexes on status, ownerId, contactId", () => {
    const block = getModelBlock("Ticket");
    expect(block).toContain("@@index([status])");
    expect(block).toContain("@@index([ownerId])");
    expect(block).toContain("@@index([contactId])");
  });
});

// ===================================================================
// 6. PIPELINE & PIPELINE STAGE MODELS (15 tests)
// ===================================================================
describe("Pipeline model", () => {
  it("should exist in the schema", () => {
    expect(schema).toContain("model Pipeline {");
  });

  it("should have id field as cuid", () => {
    const line = getFieldLine("Pipeline", "id");
    expect(line).toContain("@id");
    expect(line).toContain("@default(cuid())");
  });

  it("should have name as required String", () => {
    expect(modelHasField("Pipeline", "name")).toBe(true);
  });

  it("should have isDefault with default false", () => {
    const line = getFieldLine("Pipeline", "isDefault");
    expect(line).toContain("Boolean");
    expect(line).toContain("@default(false)");
  });

  it("should have order with default 0", () => {
    const line = getFieldLine("Pipeline", "order");
    expect(line).toContain("Int");
    expect(line).toContain("@default(0)");
  });

  it("should have stages relation to PipelineStage", () => {
    const line = getFieldLine("Pipeline", "stages");
    expect(line).toContain("PipelineStage[]");
  });

  it("should have deals relation", () => {
    const line = getFieldLine("Pipeline", "deals");
    expect(line).toContain("Deal[]");
  });
});

describe("PipelineStage model", () => {
  it("should exist in the schema", () => {
    expect(schema).toContain("model PipelineStage {");
  });

  it("should have name as required String", () => {
    expect(modelHasField("PipelineStage", "name")).toBe(true);
  });

  it("should have probability with default 0", () => {
    const line = getFieldLine("PipelineStage", "probability");
    expect(line).toContain("Float");
    expect(line).toContain("@default(0)");
  });

  it("should have order with default 0", () => {
    const line = getFieldLine("PipelineStage", "order");
    expect(line).toContain("Int");
    expect(line).toContain("@default(0)");
  });

  it("should have color with default #3B82F6", () => {
    const line = getFieldLine("PipelineStage", "color");
    expect(line).toContain("String");
    expect(line).toContain('#3B82F6');
  });

  it("should have pipelineId as required", () => {
    const line = getFieldLine("PipelineStage", "pipelineId");
    expect(line).toMatch(/pipelineId\s+String\b/);
  });

  it("should have pipeline relation with cascade delete", () => {
    const line = getFieldLine("PipelineStage", "pipeline");
    expect(line).toContain("Pipeline");
    expect(line).toContain("onDelete: Cascade");
  });

  it("should have index on pipelineId", () => {
    const block = getModelBlock("PipelineStage");
    expect(block).toContain("@@index([pipelineId])");
  });
});

// ===================================================================
// 7. TICKET PIPELINE & STAGE (8 tests)
// ===================================================================
describe("TicketPipeline model", () => {
  it("should exist in the schema", () => {
    expect(schema).toContain("model TicketPipeline {");
  });

  it("should have id, name, isDefault fields", () => {
    expect(modelHasField("TicketPipeline", "id")).toBe(true);
    expect(modelHasField("TicketPipeline", "name")).toBe(true);
    expect(modelHasField("TicketPipeline", "isDefault")).toBe(true);
  });

  it("should have isDefault with default false", () => {
    const line = getFieldLine("TicketPipeline", "isDefault");
    expect(line).toContain("@default(false)");
  });

  it("should have stages and tickets relations", () => {
    const stages = getFieldLine("TicketPipeline", "stages");
    const tickets = getFieldLine("TicketPipeline", "tickets");
    expect(stages).toContain("TicketStage[]");
    expect(tickets).toContain("Ticket[]");
  });
});

describe("TicketStage model", () => {
  it("should exist in the schema", () => {
    expect(schema).toContain("model TicketStage {");
  });

  it("should have name, order, color, pipelineId fields", () => {
    expect(modelHasField("TicketStage", "name")).toBe(true);
    expect(modelHasField("TicketStage", "order")).toBe(true);
    expect(modelHasField("TicketStage", "color")).toBe(true);
    expect(modelHasField("TicketStage", "pipelineId")).toBe(true);
  });

  it("should have pipeline relation with cascade delete", () => {
    const line = getFieldLine("TicketStage", "pipeline");
    expect(line).toContain("TicketPipeline");
    expect(line).toContain("onDelete: Cascade");
  });

  it("should have tickets relation", () => {
    const line = getFieldLine("TicketStage", "tickets");
    expect(line).toContain("Ticket[]");
  });
});

// ===================================================================
// 8. TASK MODEL (12 tests)
// ===================================================================
describe("Task model", () => {
  it("should exist in the schema", () => {
    expect(schema).toContain("model Task {");
  });

  it("should have id field as cuid", () => {
    const line = getFieldLine("Task", "id");
    expect(line).toContain("@id");
    expect(line).toContain("@default(cuid())");
  });

  it("should have title as required String", () => {
    const line = getFieldLine("Task", "title");
    expect(line).toMatch(/title\s+String\b/);
  });

  it("should have description as optional", () => {
    const line = getFieldLine("Task", "description");
    expect(line).toContain("String?");
  });

  it("should have dueDate as optional DateTime", () => {
    const line = getFieldLine("Task", "dueDate");
    expect(line).toContain("DateTime?");
  });

  it("should have priority with default MEDIUM", () => {
    const line = getFieldLine("Task", "priority");
    expect(line).toContain("Priority");
    expect(line).toContain("@default(MEDIUM)");
  });

  it("should have status with default NOT_STARTED", () => {
    const line = getFieldLine("Task", "status");
    expect(line).toContain("TaskStatus");
    expect(line).toContain("@default(NOT_STARTED)");
  });

  it("should have type with default TODO", () => {
    const line = getFieldLine("Task", "type");
    expect(line).toContain("TaskType");
    expect(line).toContain("@default(TODO)");
  });

  it("should have ownerId as optional", () => {
    const line = getFieldLine("Task", "ownerId");
    expect(line).toContain("String?");
  });

  it("should have contactId as optional", () => {
    const line = getFieldLine("Task", "contactId");
    expect(line).toContain("String?");
  });

  it("should have owner and contact relations", () => {
    const owner = getFieldLine("Task", "owner");
    const contact = getFieldLine("Task", "contact");
    expect(owner).toContain("User?");
    expect(contact).toContain("Contact?");
  });

  it("should have indexes on ownerId and status", () => {
    const block = getModelBlock("Task");
    expect(block).toContain("@@index([ownerId])");
    expect(block).toContain("@@index([status])");
  });
});

// ===================================================================
// 9. ACTIVITY MODEL (12 tests)
// ===================================================================
describe("Activity model", () => {
  it("should exist in the schema", () => {
    expect(schema).toContain("model Activity {");
  });

  it("should have id field as cuid", () => {
    const line = getFieldLine("Activity", "id");
    expect(line).toContain("@id");
    expect(line).toContain("@default(cuid())");
  });

  it("should have type as required ActivityType", () => {
    const line = getFieldLine("Activity", "type");
    expect(line).toContain("ActivityType");
    expect(line).not.toContain("?");
  });

  it("should have subject as optional", () => {
    const line = getFieldLine("Activity", "subject");
    expect(line).toContain("String?");
  });

  it("should have body as optional", () => {
    const line = getFieldLine("Activity", "body");
    expect(line).toContain("String?");
  });

  it("should have metadata as optional Json", () => {
    const line = getFieldLine("Activity", "metadata");
    expect(line).toContain("Json?");
  });

  it("should have userId, contactId, companyId, dealId, ticketId as optional", () => {
    expect(getFieldLine("Activity", "userId")).toContain("String?");
    expect(getFieldLine("Activity", "contactId")).toContain("String?");
    expect(getFieldLine("Activity", "companyId")).toContain("String?");
    expect(getFieldLine("Activity", "dealId")).toContain("String?");
    expect(getFieldLine("Activity", "ticketId")).toContain("String?");
  });

  it("should have user relation", () => {
    const line = getFieldLine("Activity", "user");
    expect(line).toContain("User?");
  });

  it("should have contact relation", () => {
    const line = getFieldLine("Activity", "contact");
    expect(line).toContain("Contact?");
  });

  it("should have company relation", () => {
    const line = getFieldLine("Activity", "company");
    expect(line).toContain("Company?");
  });

  it("should have deal and ticket relations", () => {
    const deal = getFieldLine("Activity", "deal");
    const ticket = getFieldLine("Activity", "ticket");
    expect(deal).toContain("Deal?");
    expect(ticket).toContain("Ticket?");
  });

  it("should have indexes on contactId, dealId, ticketId, createdAt", () => {
    const block = getModelBlock("Activity");
    expect(block).toContain("@@index([contactId])");
    expect(block).toContain("@@index([dealId])");
    expect(block).toContain("@@index([ticketId])");
    expect(block).toContain("@@index([createdAt])");
  });
});

// ===================================================================
// 10. NOTE MODEL (8 tests)
// ===================================================================
describe("Note model", () => {
  it("should exist in the schema", () => {
    expect(schema).toContain("model Note {");
  });

  it("should have id field as cuid", () => {
    const line = getFieldLine("Note", "id");
    expect(line).toContain("@id");
    expect(line).toContain("@default(cuid())");
  });

  it("should have body as required String", () => {
    const line = getFieldLine("Note", "body");
    expect(line).toMatch(/body\s+String\b/);
  });

  it("should have userId as optional", () => {
    const line = getFieldLine("Note", "userId");
    expect(line).toContain("String?");
  });

  it("should have contactId, companyId, dealId, ticketId as optional", () => {
    expect(getFieldLine("Note", "contactId")).toContain("String?");
    expect(getFieldLine("Note", "companyId")).toContain("String?");
    expect(getFieldLine("Note", "dealId")).toContain("String?");
    expect(getFieldLine("Note", "ticketId")).toContain("String?");
  });

  it("should have user relation", () => {
    const line = getFieldLine("Note", "user");
    expect(line).toContain("User?");
  });

  it("should have contact, company, deal, ticket relations", () => {
    expect(getFieldLine("Note", "contact")).toContain("Contact?");
    expect(getFieldLine("Note", "company")).toContain("Company?");
    expect(getFieldLine("Note", "deal")).toContain("Deal?");
    expect(getFieldLine("Note", "ticket")).toContain("Ticket?");
  });

  it("should have createdAt and updatedAt", () => {
    const createdAt = getFieldLine("Note", "createdAt");
    const updatedAt = getFieldLine("Note", "updatedAt");
    expect(createdAt).toContain("@default(now())");
    expect(updatedAt).toContain("@updatedAt");
  });
});

// ===================================================================
// 11. CUSTOM PROPERTIES (12 tests)
// ===================================================================
describe("ContactProperty model", () => {
  it("should exist in the schema", () => {
    expect(schema).toContain("model ContactProperty {");
  });

  it("should have id, contactId, key, value fields", () => {
    expect(modelHasField("ContactProperty", "id")).toBe(true);
    expect(modelHasField("ContactProperty", "contactId")).toBe(true);
    expect(modelHasField("ContactProperty", "key")).toBe(true);
    expect(modelHasField("ContactProperty", "value")).toBe(true);
  });

  it("should have unique constraint on contactId + key", () => {
    const block = getModelBlock("ContactProperty");
    expect(block).toContain("@@unique([contactId, key])");
  });

  it("should have cascade delete on contact relation", () => {
    const line = getFieldLine("ContactProperty", "contact");
    expect(line).toContain("onDelete: Cascade");
  });
});

describe("CompanyProperty model", () => {
  it("should exist in the schema", () => {
    expect(schema).toContain("model CompanyProperty {");
  });

  it("should have id, companyId, key, value fields", () => {
    expect(modelHasField("CompanyProperty", "id")).toBe(true);
    expect(modelHasField("CompanyProperty", "companyId")).toBe(true);
    expect(modelHasField("CompanyProperty", "key")).toBe(true);
    expect(modelHasField("CompanyProperty", "value")).toBe(true);
  });

  it("should have unique constraint on companyId + key", () => {
    const block = getModelBlock("CompanyProperty");
    expect(block).toContain("@@unique([companyId, key])");
  });

  it("should have cascade delete on company relation", () => {
    const line = getFieldLine("CompanyProperty", "company");
    expect(line).toContain("onDelete: Cascade");
  });
});

describe("DealProperty model", () => {
  it("should exist in the schema", () => {
    expect(schema).toContain("model DealProperty {");
  });

  it("should have id, dealId, key, value fields", () => {
    expect(modelHasField("DealProperty", "id")).toBe(true);
    expect(modelHasField("DealProperty", "dealId")).toBe(true);
    expect(modelHasField("DealProperty", "key")).toBe(true);
    expect(modelHasField("DealProperty", "value")).toBe(true);
  });

  it("should have unique constraint on dealId + key", () => {
    const block = getModelBlock("DealProperty");
    expect(block).toContain("@@unique([dealId, key])");
  });

  it("should have cascade delete on deal relation", () => {
    const line = getFieldLine("DealProperty", "deal");
    expect(line).toContain("onDelete: Cascade");
  });
});

// ===================================================================
// 12. DEAL CONTACT JUNCTION TABLE (5 tests)
// ===================================================================
describe("DealContact junction table", () => {
  it("should exist in the schema", () => {
    expect(schema).toContain("model DealContact {");
  });

  it("should have dealId and contactId fields", () => {
    expect(modelHasField("DealContact", "dealId")).toBe(true);
    expect(modelHasField("DealContact", "contactId")).toBe(true);
  });

  it("should have composite primary key @@id([dealId, contactId])", () => {
    const block = getModelBlock("DealContact");
    expect(block).toContain("@@id([dealId, contactId])");
  });

  it("should have deal relation with cascade delete", () => {
    const line = getFieldLine("DealContact", "deal");
    expect(line).toContain("Deal");
    expect(line).toContain("onDelete: Cascade");
  });

  it("should have contact relation with cascade delete", () => {
    const line = getFieldLine("DealContact", "contact");
    expect(line).toContain("Contact");
    expect(line).toContain("onDelete: Cascade");
  });
});

// ===================================================================
// 13. MARKETING MODELS (18 tests)
// ===================================================================
describe("EmailTemplate model", () => {
  it("should exist in the schema", () => {
    expect(schema).toContain("model EmailTemplate {");
  });

  it("should have id, name, subject, body fields", () => {
    expect(modelHasField("EmailTemplate", "id")).toBe(true);
    expect(modelHasField("EmailTemplate", "name")).toBe(true);
    expect(modelHasField("EmailTemplate", "subject")).toBe(true);
    expect(modelHasField("EmailTemplate", "body")).toBe(true);
  });

  it("should have category as optional", () => {
    const line = getFieldLine("EmailTemplate", "category");
    expect(line).toContain("String?");
  });

  it("should have campaigns relation", () => {
    const line = getFieldLine("EmailTemplate", "campaigns");
    expect(line).toContain("EmailCampaign[]");
  });
});

describe("EmailCampaign model", () => {
  it("should exist in the schema", () => {
    expect(schema).toContain("model EmailCampaign {");
  });

  it("should have id, name fields", () => {
    expect(modelHasField("EmailCampaign", "id")).toBe(true);
    expect(modelHasField("EmailCampaign", "name")).toBe(true);
  });

  it("should have status with default DRAFT", () => {
    const line = getFieldLine("EmailCampaign", "status");
    expect(line).toContain("CampaignStatus");
    expect(line).toContain("@default(DRAFT)");
  });

  it("should have templateId as optional", () => {
    const line = getFieldLine("EmailCampaign", "templateId");
    expect(line).toContain("String?");
  });

  it("should have scheduledAt and sentAt as optional DateTime", () => {
    expect(getFieldLine("EmailCampaign", "scheduledAt")).toContain("DateTime?");
    expect(getFieldLine("EmailCampaign", "sentAt")).toContain("DateTime?");
  });

  it("should have template relation", () => {
    const line = getFieldLine("EmailCampaign", "template");
    expect(line).toContain("EmailTemplate?");
  });

  it("should have stats relation", () => {
    const line = getFieldLine("EmailCampaign", "stats");
    expect(line).toContain("EmailCampaignStats?");
  });
});

describe("EmailCampaignStats model", () => {
  it("should exist in the schema", () => {
    expect(schema).toContain("model EmailCampaignStats {");
  });

  it("should have campaignId as unique", () => {
    const line = getFieldLine("EmailCampaignStats", "campaignId");
    expect(line).toContain("@unique");
  });

  it("should have stat fields with default 0", () => {
    const fields = ["sent", "delivered", "opened", "clicked", "bounced", "unsubscribed"];
    for (const field of fields) {
      const line = getFieldLine("EmailCampaignStats", field);
      expect(line).toContain("Int");
      expect(line).toContain("@default(0)");
    }
  });

  it("should have campaign relation with cascade delete", () => {
    const line = getFieldLine("EmailCampaignStats", "campaign");
    expect(line).toContain("EmailCampaign");
    expect(line).toContain("onDelete: Cascade");
  });
});

describe("Form model", () => {
  it("should exist in the schema", () => {
    expect(schema).toContain("model Form {");
  });

  it("should have name, fields (Json), settings (Json?), submissions fields", () => {
    expect(modelHasField("Form", "name")).toBe(true);
    const fieldsLine = getFieldLine("Form", "fields");
    expect(fieldsLine).toContain("Json");
    const settingsLine = getFieldLine("Form", "settings");
    expect(settingsLine).toContain("Json?");
    const submissionsLine = getFieldLine("Form", "submissions");
    expect(submissionsLine).toContain("Int");
    expect(submissionsLine).toContain("@default(0)");
  });
});

describe("LandingPage model", () => {
  it("should exist in the schema", () => {
    expect(schema).toContain("model LandingPage {");
  });

  it("should have title and slug (unique) fields", () => {
    expect(modelHasField("LandingPage", "title")).toBe(true);
    const slugLine = getFieldLine("LandingPage", "slug");
    expect(slugLine).toContain("@unique");
  });

  it("should have content as optional Json", () => {
    const line = getFieldLine("LandingPage", "content");
    expect(line).toContain("Json?");
  });

  it("should have published (default false), views, conversions fields", () => {
    const published = getFieldLine("LandingPage", "published");
    expect(published).toContain("Boolean");
    expect(published).toContain("@default(false)");
    const views = getFieldLine("LandingPage", "views");
    expect(views).toContain("@default(0)");
    const conversions = getFieldLine("LandingPage", "conversions");
    expect(conversions).toContain("@default(0)");
  });
});

// ===================================================================
// 14. KNOWLEDGE BASE (4 tests)
// ===================================================================
describe("KnowledgeBaseArticle model", () => {
  it("should exist in the schema", () => {
    expect(schema).toContain("model KnowledgeBaseArticle {");
  });

  it("should have title and body as required", () => {
    const title = getFieldLine("KnowledgeBaseArticle", "title");
    const body = getFieldLine("KnowledgeBaseArticle", "body");
    expect(title).toMatch(/title\s+String\b/);
    expect(body).toMatch(/body\s+String\b/);
  });

  it("should have category as optional, published with default false", () => {
    const category = getFieldLine("KnowledgeBaseArticle", "category");
    expect(category).toContain("String?");
    const published = getFieldLine("KnowledgeBaseArticle", "published");
    expect(published).toContain("@default(false)");
  });

  it("should have views, helpful, notHelpful with default 0", () => {
    const views = getFieldLine("KnowledgeBaseArticle", "views");
    const helpful = getFieldLine("KnowledgeBaseArticle", "helpful");
    const notHelpful = getFieldLine("KnowledgeBaseArticle", "notHelpful");
    expect(views).toContain("@default(0)");
    expect(helpful).toContain("@default(0)");
    expect(notHelpful).toContain("@default(0)");
  });
});

// ===================================================================
// 15. AUTH MODELS (6 tests)
// ===================================================================
describe("Account model", () => {
  it("should exist in the schema", () => {
    expect(schema).toContain("model Account {");
  });

  it("should have user relation with cascade delete", () => {
    const line = getFieldLine("Account", "user");
    expect(line).toContain("User");
    expect(line).toContain("onDelete: Cascade");
  });

  it("should have unique constraint on provider + providerAccountId", () => {
    const block = getModelBlock("Account");
    expect(block).toContain("@@unique([provider, providerAccountId])");
  });
});

describe("Session model", () => {
  it("should exist in the schema", () => {
    expect(schema).toContain("model Session {");
  });

  it("should have sessionToken as unique", () => {
    const line = getFieldLine("Session", "sessionToken");
    expect(line).toContain("@unique");
  });

  it("should have user relation with cascade delete", () => {
    const line = getFieldLine("Session", "user");
    expect(line).toContain("onDelete: Cascade");
  });
});

describe("VerificationToken model", () => {
  it("should exist with unique constraint on identifier + token", () => {
    expect(schema).toContain("model VerificationToken {");
    const block = getModelBlock("VerificationToken");
    expect(block).toContain("@@unique([identifier, token])");
  });
});

// ===================================================================
// 16. ENUMS (40 tests)
// ===================================================================
describe("LifecycleStage enum", () => {
  const values = getEnumValues("LifecycleStage");

  it("should exist in the schema", () => {
    expect(schema).toContain("enum LifecycleStage {");
  });

  it("should have exactly 8 values", () => {
    expect(values).toHaveLength(8);
  });

  it("should contain SUBSCRIBER", () => {
    expect(values).toContain("SUBSCRIBER");
  });

  it("should contain LEAD", () => {
    expect(values).toContain("LEAD");
  });

  it("should contain MQL", () => {
    expect(values).toContain("MQL");
  });

  it("should contain SQL", () => {
    expect(values).toContain("SQL");
  });

  it("should contain OPPORTUNITY", () => {
    expect(values).toContain("OPPORTUNITY");
  });

  it("should contain CUSTOMER", () => {
    expect(values).toContain("CUSTOMER");
  });

  it("should contain EVANGELIST", () => {
    expect(values).toContain("EVANGELIST");
  });

  it("should contain OTHER", () => {
    expect(values).toContain("OTHER");
  });
});

describe("LeadStatus enum", () => {
  const values = getEnumValues("LeadStatus");

  it("should exist in the schema", () => {
    expect(schema).toContain("enum LeadStatus {");
  });

  it("should have exactly 8 values", () => {
    expect(values).toHaveLength(8);
  });

  it("should contain NEW", () => {
    expect(values).toContain("NEW");
  });

  it("should contain OPEN", () => {
    expect(values).toContain("OPEN");
  });

  it("should contain IN_PROGRESS", () => {
    expect(values).toContain("IN_PROGRESS");
  });

  it("should contain OPEN_DEAL", () => {
    expect(values).toContain("OPEN_DEAL");
  });

  it("should contain UNQUALIFIED", () => {
    expect(values).toContain("UNQUALIFIED");
  });

  it("should contain ATTEMPTED_TO_CONTACT", () => {
    expect(values).toContain("ATTEMPTED_TO_CONTACT");
  });

  it("should contain CONNECTED", () => {
    expect(values).toContain("CONNECTED");
  });

  it("should contain BAD_TIMING", () => {
    expect(values).toContain("BAD_TIMING");
  });
});

describe("TicketStatus enum", () => {
  const values = getEnumValues("TicketStatus");

  it("should have exactly 4 values", () => {
    expect(values).toHaveLength(4);
  });

  it("should contain OPEN, IN_PROGRESS, WAITING, CLOSED", () => {
    expect(values).toContain("OPEN");
    expect(values).toContain("IN_PROGRESS");
    expect(values).toContain("WAITING");
    expect(values).toContain("CLOSED");
  });
});

describe("Priority enum", () => {
  const values = getEnumValues("Priority");

  it("should have exactly 4 values", () => {
    expect(values).toHaveLength(4);
  });

  it("should contain LOW", () => {
    expect(values).toContain("LOW");
  });

  it("should contain MEDIUM", () => {
    expect(values).toContain("MEDIUM");
  });

  it("should contain HIGH", () => {
    expect(values).toContain("HIGH");
  });

  it("should contain URGENT", () => {
    expect(values).toContain("URGENT");
  });
});

describe("TaskStatus enum", () => {
  const values = getEnumValues("TaskStatus");

  it("should have exactly 4 values", () => {
    expect(values).toHaveLength(4);
  });

  it("should contain NOT_STARTED, IN_PROGRESS, COMPLETED, DEFERRED", () => {
    expect(values).toContain("NOT_STARTED");
    expect(values).toContain("IN_PROGRESS");
    expect(values).toContain("COMPLETED");
    expect(values).toContain("DEFERRED");
  });
});

describe("TaskType enum", () => {
  const values = getEnumValues("TaskType");

  it("should have exactly 5 values", () => {
    expect(values).toHaveLength(5);
  });

  it("should contain TODO, CALL, EMAIL, MEETING, FOLLOW_UP", () => {
    expect(values).toContain("TODO");
    expect(values).toContain("CALL");
    expect(values).toContain("EMAIL");
    expect(values).toContain("MEETING");
    expect(values).toContain("FOLLOW_UP");
  });
});

describe("ActivityType enum", () => {
  const values = getEnumValues("ActivityType");

  it("should have exactly 11 values", () => {
    expect(values).toHaveLength(11);
  });

  it("should contain EMAIL", () => {
    expect(values).toContain("EMAIL");
  });

  it("should contain CALL", () => {
    expect(values).toContain("CALL");
  });

  it("should contain MEETING", () => {
    expect(values).toContain("MEETING");
  });

  it("should contain NOTE", () => {
    expect(values).toContain("NOTE");
  });

  it("should contain TASK", () => {
    expect(values).toContain("TASK");
  });

  it("should contain DEAL_CREATED", () => {
    expect(values).toContain("DEAL_CREATED");
  });

  it("should contain DEAL_STAGE_CHANGED", () => {
    expect(values).toContain("DEAL_STAGE_CHANGED");
  });

  it("should contain TICKET_CREATED", () => {
    expect(values).toContain("TICKET_CREATED");
  });

  it("should contain FORM_SUBMISSION", () => {
    expect(values).toContain("FORM_SUBMISSION");
  });

  it("should contain PAGE_VIEW", () => {
    expect(values).toContain("PAGE_VIEW");
  });

  it("should contain LIFECYCLE_CHANGE", () => {
    expect(values).toContain("LIFECYCLE_CHANGE");
  });
});

describe("CampaignStatus enum", () => {
  const values = getEnumValues("CampaignStatus");

  it("should have exactly 5 values", () => {
    expect(values).toHaveLength(5);
  });

  it("should contain DRAFT, SCHEDULED, SENDING, SENT, CANCELLED", () => {
    expect(values).toContain("DRAFT");
    expect(values).toContain("SCHEDULED");
    expect(values).toContain("SENDING");
    expect(values).toContain("SENT");
    expect(values).toContain("CANCELLED");
  });
});

describe("UserRole enum", () => {
  const values = getEnumValues("UserRole");

  it("should have exactly 3 values", () => {
    expect(values).toHaveLength(3);
  });

  it("should contain ADMIN, MANAGER, MEMBER", () => {
    expect(values).toContain("ADMIN");
    expect(values).toContain("MANAGER");
    expect(values).toContain("MEMBER");
  });
});

// ===================================================================
// 17. SCHEMA-LEVEL CHECKS (10 tests)
// ===================================================================
describe("Schema-level configuration", () => {
  it("should use postgresql as the datasource provider", () => {
    expect(schema).toContain('provider = "postgresql"');
  });

  it("should use prisma-client generator", () => {
    expect(schema).toContain('provider = "prisma-client"');
  });

  it("should output to ../src/generated/prisma", () => {
    expect(schema).toContain('output   = "../src/generated/prisma"');
  });

  it("should have exactly 9 enums", () => {
    const enumMatches = schema.match(/^enum\s+\w+\s*\{/gm);
    expect(enumMatches).toHaveLength(9);
  });

  it("should have all CRM core models", () => {
    const coreModels = ["Contact", "Company", "Deal", "Ticket", "Task", "Activity", "Note"];
    for (const model of coreModels) {
      expect(schema).toContain(`model ${model} {`);
    }
  });

  it("should have all auth models", () => {
    const authModels = ["User", "Account", "Session", "VerificationToken"];
    for (const model of authModels) {
      expect(schema).toContain(`model ${model} {`);
    }
  });

  it("should have all pipeline models", () => {
    const pipelineModels = ["Pipeline", "PipelineStage", "TicketPipeline", "TicketStage"];
    for (const model of pipelineModels) {
      expect(schema).toContain(`model ${model} {`);
    }
  });

  it("should have all marketing models", () => {
    const marketingModels = ["EmailTemplate", "EmailCampaign", "EmailCampaignStats", "Form", "LandingPage"];
    for (const model of marketingModels) {
      expect(schema).toContain(`model ${model} {`);
    }
  });

  it("should have KnowledgeBaseArticle model", () => {
    expect(schema).toContain("model KnowledgeBaseArticle {");
  });

  it("should have all custom property models", () => {
    const propertyModels = ["ContactProperty", "CompanyProperty", "DealProperty"];
    for (const model of propertyModels) {
      expect(schema).toContain(`model ${model} {`);
    }
  });
});
