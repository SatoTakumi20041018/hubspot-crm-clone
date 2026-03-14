import { NextRequest, NextResponse } from "next/server";
import {
  mockTickets,
  getUserSelect,
  getContactSelect,
  getCompanySelect,
  includesCI,
} from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const ownerId = searchParams.get("ownerId");

    const skip = (page - 1) * limit;

    let filtered = [...mockTickets];

    if (search) {
      filtered = filtered.filter(
        (t) =>
          includesCI(t.subject, search) ||
          includesCI(t.description, search)
      );
    }

    if (status) {
      filtered = filtered.filter((t) => t.status === status);
    }

    if (priority) {
      filtered = filtered.filter((t) => t.priority === priority);
    }

    if (ownerId) {
      filtered = filtered.filter((t) => t.ownerId === ownerId);
    }

    // Sort by createdAt desc
    filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);

    const tickets = paginated.map((t) => ({
      ...t,
      owner: getUserSelect(t.ownerId),
      contact: getContactSelect(t.contactId),
      company: getCompanySelect(t.companyId),
      pipeline: null,
      stage: null,
    }));

    return NextResponse.json({
      tickets,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { error: "チケットの取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    const {
      subject,
      description,
      status,
      priority,
      category,
      ownerId,
      contactId,
      companyId,
      pipelineId,
      stageId,
    } = body;

    if (!subject) {
      return NextResponse.json(
        { error: "件名は必須です" },
        { status: 400 }
      );
    }

    const newTicket = {
      id: `ticket-${Date.now()}`,
      subject,
      description: description || null,
      status: (status || "OPEN") as "OPEN" | "IN_PROGRESS" | "WAITING" | "CLOSED",
      priority: (priority || "MEDIUM") as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
      category: category || null,
      ownerId: ownerId || null,
      contactId: contactId || null,
      companyId: companyId || null,
      pipelineId: pipelineId || null,
      stageId: stageId || null,
      slaDeadline: null,
      closedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockTickets.push(newTicket);

    const ticket = {
      ...newTicket,
      owner: getUserSelect(newTicket.ownerId),
      contact: getContactSelect(newTicket.contactId),
      company: getCompanySelect(newTicket.companyId),
      pipeline: null,
      stage: null,
    };

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { error: "チケットの作成に失敗しました" },
      { status: 500 }
    );
  }
}
