import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

// Read all API route files
const apiBasePath = path.resolve(__dirname, "../../app/api");

const companiesRoute = fs.readFileSync(path.join(apiBasePath, "companies/route.ts"), "utf-8");
const ticketsRoute = fs.readFileSync(path.join(apiBasePath, "tickets/route.ts"), "utf-8");
const tasksRoute = fs.readFileSync(path.join(apiBasePath, "tasks/route.ts"), "utf-8");
const dashboardRoute = fs.readFileSync(path.join(apiBasePath, "dashboard/route.ts"), "utf-8");
const activitiesRoute = fs.readFileSync(path.join(apiBasePath, "activities/route.ts"), "utf-8");
const pipelinesRoute = fs.readFileSync(path.join(apiBasePath, "pipelines/route.ts"), "utf-8");
const workflowsRoute = fs.readFileSync(path.join(apiBasePath, "workflows/route.ts"), "utf-8");
const sequencesRoute = fs.readFileSync(path.join(apiBasePath, "sequences/route.ts"), "utf-8");
const nextAuthRoute = fs.readFileSync(path.join(apiBasePath, "auth/[...nextauth]/route.ts"), "utf-8");
const registerRoute = fs.readFileSync(path.join(apiBasePath, "auth/register/route.ts"), "utf-8");

// ===================================================================
// 1. /api/companies (15 tests)
// ===================================================================
describe("/api/companies", () => {
  it("should export a GET function", () => {
    expect(companiesRoute).toMatch(/export\s+async\s+function\s+GET/);
  });

  it("should export a POST function", () => {
    expect(companiesRoute).toMatch(/export\s+async\s+function\s+POST/);
  });

  it("should support search query parameter", () => {
    expect(companiesRoute).toContain('searchParams.get("search")');
  });

  it("should search by name, domain, and industry", () => {
    expect(companiesRoute).toContain("name:");
    expect(companiesRoute).toContain("domain:");
    expect(companiesRoute).toContain("industry:");
  });

  it("should support pagination with page and limit", () => {
    expect(companiesRoute).toContain('searchParams.get("page")');
    expect(companiesRoute).toContain('searchParams.get("limit")');
  });

  it("should default limit to 20", () => {
    expect(companiesRoute).toContain('"limit") || "20"');
  });

  it("should include owner relation in GET response", () => {
    expect(companiesRoute).toContain("owner:");
  });

  it("should include _count for contacts, deals, tickets", () => {
    expect(companiesRoute).toContain("_count:");
    expect(companiesRoute).toContain("contacts: true");
    expect(companiesRoute).toContain("deals: true");
    expect(companiesRoute).toContain("tickets: true");
  });

  it("should require name in POST", () => {
    expect(companiesRoute).toContain("!name");
    expect(companiesRoute).toContain("status: 400");
  });

  it("should accept domain, industry, phone in POST", () => {
    const postSection = companiesRoute.split("export async function POST")[1];
    expect(postSection).toContain("domain");
    expect(postSection).toContain("industry");
    expect(postSection).toContain("phone");
  });

  it("should accept city, state, country in POST", () => {
    expect(companiesRoute).toContain("city");
    expect(companiesRoute).toContain("state");
    expect(companiesRoute).toContain("country");
  });

  it("should accept description in POST", () => {
    expect(companiesRoute).toContain("description");
  });

  it("should accept annualRevenue and parse as float", () => {
    expect(companiesRoute).toContain("annualRevenue");
    expect(companiesRoute).toContain("parseFloat(annualRevenue)");
  });

  it("should accept employeeCount and parse as int", () => {
    expect(companiesRoute).toContain("employeeCount");
    expect(companiesRoute).toContain("parseInt(employeeCount)");
  });

  it("should return 201 on successful company creation", () => {
    expect(companiesRoute).toContain("status: 201");
  });
});

// ===================================================================
// 2. /api/tickets (15 tests)
// ===================================================================
describe("/api/tickets", () => {
  it("should export a GET function", () => {
    expect(ticketsRoute).toMatch(/export\s+async\s+function\s+GET/);
  });

  it("should export a POST function", () => {
    expect(ticketsRoute).toMatch(/export\s+async\s+function\s+POST/);
  });

  it("should support status filter parameter", () => {
    expect(ticketsRoute).toContain('searchParams.get("status")');
  });

  it("should support priority filter parameter", () => {
    expect(ticketsRoute).toContain('searchParams.get("priority")');
  });

  it("should support ownerId filter parameter", () => {
    expect(ticketsRoute).toContain('searchParams.get("ownerId")');
  });

  it("should filter by status when provided", () => {
    expect(ticketsRoute).toContain("where.status = status");
  });

  it("should filter by priority when provided", () => {
    expect(ticketsRoute).toContain("where.priority = priority");
  });

  it("should include owner, contact, company, pipeline, stage in GET", () => {
    const getSection = ticketsRoute.split("export async function POST")[0];
    expect(getSection).toContain("owner:");
    expect(getSection).toContain("contact:");
    expect(getSection).toContain("company:");
    expect(getSection).toContain("pipeline:");
    expect(getSection).toContain("stage:");
  });

  it("should search by subject and description", () => {
    expect(ticketsRoute).toContain("subject:");
    expect(ticketsRoute).toContain("description:");
  });

  it("should require subject in POST", () => {
    expect(ticketsRoute).toContain("!subject");
    expect(ticketsRoute).toContain("status: 400");
  });

  it("should accept status with default OPEN in POST", () => {
    expect(ticketsRoute).toContain('status || "OPEN"');
  });

  it("should accept priority with default MEDIUM in POST", () => {
    expect(ticketsRoute).toContain('priority || "MEDIUM"');
  });

  it("should accept category, contactId, companyId in POST", () => {
    expect(ticketsRoute).toContain("category");
    expect(ticketsRoute).toContain("contactId");
    expect(ticketsRoute).toContain("companyId");
  });

  it("should accept pipelineId and stageId in POST", () => {
    expect(ticketsRoute).toContain("pipelineId");
    expect(ticketsRoute).toContain("stageId");
  });

  it("should return 201 on successful ticket creation", () => {
    expect(ticketsRoute).toContain("status: 201");
  });
});

// ===================================================================
// 3. /api/tasks (15 tests)
// ===================================================================
describe("/api/tasks", () => {
  it("should export a GET function", () => {
    expect(tasksRoute).toMatch(/export\s+async\s+function\s+GET/);
  });

  it("should export a POST function", () => {
    expect(tasksRoute).toMatch(/export\s+async\s+function\s+POST/);
  });

  it("should export a PATCH function", () => {
    expect(tasksRoute).toMatch(/export\s+async\s+function\s+PATCH/);
  });

  it("should support status filter parameter", () => {
    expect(tasksRoute).toContain('searchParams.get("status")');
  });

  it("should support ownerId filter parameter", () => {
    expect(tasksRoute).toContain('searchParams.get("ownerId")');
  });

  it("should support dueDateFrom filter parameter (date range)", () => {
    expect(tasksRoute).toContain('searchParams.get("dueDateFrom")');
  });

  it("should support dueDateTo filter parameter (date range)", () => {
    expect(tasksRoute).toContain('searchParams.get("dueDateTo")');
  });

  it("should filter dueDate with gte for dueDateFrom", () => {
    expect(tasksRoute).toContain("gte");
    expect(tasksRoute).toContain("new Date(dueDateFrom)");
  });

  it("should filter dueDate with lte for dueDateTo", () => {
    expect(tasksRoute).toContain("lte");
    expect(tasksRoute).toContain("new Date(dueDateTo)");
  });

  it("should include owner and contact in GET response", () => {
    expect(tasksRoute).toContain("owner:");
    expect(tasksRoute).toContain("contact:");
  });

  it("should require title in POST", () => {
    expect(tasksRoute).toContain("!title");
    expect(tasksRoute).toContain("status: 400");
  });

  it("should accept priority, status, type with defaults in POST", () => {
    expect(tasksRoute).toContain('priority || "MEDIUM"');
    expect(tasksRoute).toContain('status || "NOT_STARTED"');
    expect(tasksRoute).toContain('type || "TODO"');
  });

  it("should require id in PATCH", () => {
    const patchSection = tasksRoute.split("export async function PATCH")[1];
    expect(patchSection).toContain("!id");
    expect(patchSection).toContain("status: 400");
  });

  it("should support updating all task fields in PATCH", () => {
    const patchSection = tasksRoute.split("export async function PATCH")[1];
    expect(patchSection).toContain("data.title");
    expect(patchSection).toContain("data.description");
    expect(patchSection).toContain("data.dueDate");
    expect(patchSection).toContain("data.priority");
    expect(patchSection).toContain("data.status");
    expect(patchSection).toContain("data.type");
    expect(patchSection).toContain("data.ownerId");
    expect(patchSection).toContain("data.contactId");
  });

  it("should return 201 on successful task creation", () => {
    expect(tasksRoute).toContain("status: 201");
  });
});

// ===================================================================
// 4. /api/dashboard (12 tests)
// ===================================================================
describe("/api/dashboard", () => {
  it("should export a GET function", () => {
    expect(dashboardRoute).toMatch(/export\s+async\s+function\s+GET/);
  });

  it("should return totalContacts stat", () => {
    expect(dashboardRoute).toContain("totalContacts");
    expect(dashboardRoute).toContain("prisma.contact.count()");
  });

  it("should return totalCompanies stat", () => {
    expect(dashboardRoute).toContain("totalCompanies");
    expect(dashboardRoute).toContain("prisma.company.count()");
  });

  it("should return activeDeals stat", () => {
    expect(dashboardRoute).toContain("activeDeals");
    expect(dashboardRoute).toContain("prisma.deal.count()");
  });

  it("should return totalRevenue (sum of deal amounts)", () => {
    expect(dashboardRoute).toContain("totalRevenue");
    expect(dashboardRoute).toContain("prisma.deal.aggregate");
    expect(dashboardRoute).toContain("_sum: { amount: true }");
  });

  it("should return openTickets stat", () => {
    expect(dashboardRoute).toContain("openTickets");
    expect(dashboardRoute).toContain("prisma.ticket.count");
  });

  it("should count open, in_progress, waiting tickets", () => {
    expect(dashboardRoute).toContain('"OPEN"');
    expect(dashboardRoute).toContain('"IN_PROGRESS"');
    expect(dashboardRoute).toContain('"WAITING"');
  });

  it("should return totalTasks stat", () => {
    expect(dashboardRoute).toContain("totalTasks");
    expect(dashboardRoute).toContain("prisma.task.count()");
  });

  it("should return completedTasks stat", () => {
    expect(dashboardRoute).toContain("completedTasks");
    expect(dashboardRoute).toContain('"COMPLETED"');
  });

  it("should calculate taskCompletionRate", () => {
    expect(dashboardRoute).toContain("taskCompletionRate");
    expect(dashboardRoute).toContain("completedTasks / totalTasks");
  });

  it("should return recentActivities", () => {
    expect(dashboardRoute).toContain("recentActivities");
    expect(dashboardRoute).toContain("prisma.activity.findMany");
  });

  it("should return dealsByStage with groupBy", () => {
    expect(dashboardRoute).toContain("dealsByStage");
    expect(dashboardRoute).toContain("prisma.deal.groupBy");
    expect(dashboardRoute).toContain('by: ["stageId"]');
  });
});

// ===================================================================
// 5. /api/activities (10 tests)
// ===================================================================
describe("/api/activities", () => {
  it("should export a GET function", () => {
    expect(activitiesRoute).toMatch(/export\s+async\s+function\s+GET/);
  });

  it("should export a POST function", () => {
    expect(activitiesRoute).toMatch(/export\s+async\s+function\s+POST/);
  });

  it("should support contactId filter", () => {
    expect(activitiesRoute).toContain('searchParams.get("contactId")');
  });

  it("should support dealId filter", () => {
    expect(activitiesRoute).toContain('searchParams.get("dealId")');
  });

  it("should support ticketId filter", () => {
    expect(activitiesRoute).toContain('searchParams.get("ticketId")');
  });

  it("should support companyId filter", () => {
    expect(activitiesRoute).toContain('searchParams.get("companyId")');
  });

  it("should include user, contact, deal, ticket, company in GET", () => {
    expect(activitiesRoute).toContain("user:");
    expect(activitiesRoute).toContain("contact:");
    expect(activitiesRoute).toContain("deal:");
    expect(activitiesRoute).toContain("ticket:");
    expect(activitiesRoute).toContain("company:");
  });

  it("should require type in POST", () => {
    expect(activitiesRoute).toContain("!type");
    expect(activitiesRoute).toContain("status: 400");
  });

  it("should accept subject, body, metadata in POST", () => {
    const postSection = activitiesRoute.split("export async function POST")[1];
    expect(postSection).toContain("subject");
    expect(postSection).toContain("activityBody");
    expect(postSection).toContain("metadata");
  });

  it("should return 201 on successful activity creation", () => {
    expect(activitiesRoute).toContain("status: 201");
  });
});

// ===================================================================
// 6. /api/pipelines (10 tests)
// ===================================================================
describe("/api/pipelines", () => {
  it("should export a GET function", () => {
    expect(pipelinesRoute).toMatch(/export\s+async\s+function\s+GET/);
  });

  it("should export a POST function", () => {
    expect(pipelinesRoute).toMatch(/export\s+async\s+function\s+POST/);
  });

  it("should include stages in GET ordered by order asc", () => {
    expect(pipelinesRoute).toContain("stages:");
    expect(pipelinesRoute).toContain('orderBy: { order: "asc" }');
  });

  it("should include _count for deals in stages", () => {
    expect(pipelinesRoute).toContain("_count:");
    expect(pipelinesRoute).toContain("deals: true");
  });

  it("should include pipeline-level _count for deals", () => {
    // There are two _count blocks - one inside stages, one at pipeline level
    const matches = pipelinesRoute.match(/_count:/g);
    expect(matches!.length).toBeGreaterThanOrEqual(2);
  });

  it("should require name in POST", () => {
    expect(pipelinesRoute).toContain("!name");
    expect(pipelinesRoute).toContain("status: 400");
  });

  it("should require at least one stage in POST", () => {
    expect(pipelinesRoute).toContain("!stages || !Array.isArray(stages) || stages.length === 0");
  });

  it("should create stages with name, probability, color, order", () => {
    const postSection = pipelinesRoute.split("export async function POST")[1];
    expect(postSection).toContain("stage.name");
    expect(postSection).toContain("stage.probability");
    expect(postSection).toContain("stage.color");
    expect(postSection).toContain("order: index");
  });

  it("should calculate max order for new pipeline", () => {
    expect(pipelinesRoute).toContain("prisma.pipeline.aggregate");
    expect(pipelinesRoute).toContain("_max: { order: true }");
  });

  it("should return 201 on successful pipeline creation", () => {
    expect(pipelinesRoute).toContain("status: 201");
  });
});

// ===================================================================
// 7. /api/workflows (10 tests)
// ===================================================================
describe("/api/workflows", () => {
  it("should export a GET function", () => {
    expect(workflowsRoute).toMatch(/export\s+async\s+function\s+GET/);
  });

  it("should export a POST function", () => {
    expect(workflowsRoute).toMatch(/export\s+async\s+function\s+POST/);
  });

  it("should support type filter in GET", () => {
    expect(workflowsRoute).toContain('searchParams.get("type")');
  });

  it("should support active filter in GET", () => {
    expect(workflowsRoute).toContain('searchParams.get("active")');
  });

  it("should support search filter in GET", () => {
    expect(workflowsRoute).toContain('searchParams.get("search")');
  });

  it("should return workflows array and total", () => {
    expect(workflowsRoute).toContain("workflows:");
    expect(workflowsRoute).toContain("total:");
  });

  it("should require name and type in POST", () => {
    expect(workflowsRoute).toContain("!name || !type");
  });

  it("should validate workflow type (contact, deal, ticket, company)", () => {
    expect(workflowsRoute).toContain('"contact"');
    expect(workflowsRoute).toContain('"deal"');
    expect(workflowsRoute).toContain('"ticket"');
    expect(workflowsRoute).toContain('"company"');
    expect(workflowsRoute).toContain("validTypes");
  });

  it("should return 400 for invalid workflow type", () => {
    const postSection = workflowsRoute.split("export async function POST")[1];
    expect(postSection).toContain("status: 400");
  });

  it("should return 201 on successful workflow creation", () => {
    expect(workflowsRoute).toContain("status: 201");
  });
});

// ===================================================================
// 8. /api/sequences (10 tests)
// ===================================================================
describe("/api/sequences", () => {
  it("should export a GET function", () => {
    expect(sequencesRoute).toMatch(/export\s+async\s+function\s+GET/);
  });

  it("should export a POST function", () => {
    expect(sequencesRoute).toMatch(/export\s+async\s+function\s+POST/);
  });

  it("should support search filter in GET", () => {
    expect(sequencesRoute).toContain('searchParams.get("search")');
  });

  it("should support active filter in GET", () => {
    expect(sequencesRoute).toContain('searchParams.get("active")');
  });

  it("should support ownerId filter in GET", () => {
    expect(sequencesRoute).toContain('searchParams.get("ownerId")');
  });

  it("should return sequences, total, and stats in GET response", () => {
    expect(sequencesRoute).toContain("sequences:");
    expect(sequencesRoute).toContain("total:");
    expect(sequencesRoute).toContain("stats:");
  });

  it("should return stats with totalEnrolled, avgReplyRate, avgMeetingRate", () => {
    expect(sequencesRoute).toContain("totalEnrolled");
    expect(sequencesRoute).toContain("avgReplyRate");
    expect(sequencesRoute).toContain("avgMeetingRate");
  });

  it("should require name in POST", () => {
    expect(sequencesRoute).toContain("!name");
  });

  it("should require at least one step in POST", () => {
    expect(sequencesRoute).toContain("!steps || !Array.isArray(steps) || steps.length === 0");
  });

  it("should validate step types (email, wait, task, call)", () => {
    expect(sequencesRoute).toContain("validStepTypes");
    expect(sequencesRoute).toContain('"email"');
    expect(sequencesRoute).toContain('"wait"');
    expect(sequencesRoute).toContain('"task"');
    expect(sequencesRoute).toContain('"call"');
  });
});

// ===================================================================
// 9. /api/auth/[...nextauth] (3 tests)
// ===================================================================
describe("/api/auth/[...nextauth]", () => {
  it("should import NextAuth", () => {
    expect(nextAuthRoute).toContain("NextAuth");
  });

  it("should export GET handler", () => {
    expect(nextAuthRoute).toContain("handler as GET");
  });

  it("should export POST handler", () => {
    expect(nextAuthRoute).toContain("handler as POST");
  });
});

// ===================================================================
// 10. /api/auth/register (10 tests) - moved to auth.test.ts partially, but keeping route-level tests
// ===================================================================
describe("/api/auth/register route", () => {
  it("should export a POST function", () => {
    expect(registerRoute).toMatch(/export\s+async\s+function\s+POST/);
  });

  it("should require name, email, password", () => {
    expect(registerRoute).toContain("!name || !email || !password");
    expect(registerRoute).toContain("status: 400");
  });

  it("should validate password minimum length of 8", () => {
    expect(registerRoute).toContain("password.length < 8");
    expect(registerRoute).toContain("status: 400");
  });

  it("should check for existing user by email", () => {
    expect(registerRoute).toContain("prisma.user.findUnique");
    expect(registerRoute).toContain("where: { email }");
  });

  it("should return 409 for duplicate email", () => {
    expect(registerRoute).toContain("status: 409");
  });

  it("should hash password with bcrypt", () => {
    expect(registerRoute).toContain("bcrypt.hash");
    expect(registerRoute).toContain("hashedPassword");
  });

  it("should use salt rounds of 12", () => {
    expect(registerRoute).toContain("bcrypt.hash(password, 12)");
  });

  it("should create user with prisma", () => {
    expect(registerRoute).toContain("prisma.user.create");
  });

  it("should return 201 on successful registration", () => {
    expect(registerRoute).toContain("status: 201");
  });

  it("should return user id, name, email in response (not password)", () => {
    expect(registerRoute).toContain("user.id");
    expect(registerRoute).toContain("user.name");
    expect(registerRoute).toContain("user.email");
    expect(registerRoute).not.toContain("user.hashedPassword");
  });
});
