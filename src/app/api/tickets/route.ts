import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const after = searchParams.get("after");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const ownerId = searchParams.get("ownerId");

    const where: Prisma.TicketWhereInput = {};

    if (search) {
      where.OR = [
        { subject: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.status = status as Prisma.EnumTicketStatusFilter;
    }

    if (priority) {
      where.priority = priority as Prisma.EnumPriorityFilter;
    }

    if (ownerId) {
      where.ownerId = ownerId;
    }

    const findArgs: Prisma.TicketFindManyArgs = {
      where,
      take: limit + 1,
      orderBy: { createdAt: "desc" },
      include: {
        owner: { select: { id: true, name: true, email: true, image: true } },
        contact: { select: { id: true, firstName: true, lastName: true, email: true } },
        company: { select: { id: true, name: true, domain: true } },
        pipeline: { select: { id: true, name: true } },
        stage: { select: { id: true, name: true, color: true } },
      },
    };

    if (after) {
      findArgs.cursor = { id: after };
      findArgs.skip = 1;
    }

    const tickets = await prisma.ticket.findMany(findArgs);

    const hasMore = tickets.length > limit;
    const results = tickets.slice(0, limit);

    const formattedResults = results.map((t: Record<string, unknown>) => ({
      id: t.id,
      properties: {
        subject: t.subject,
        content: t.description,
        hs_ticket_priority: t.priority,
        hs_pipeline: t.pipelineId,
        hs_pipeline_stage: t.stageId,
        hs_ticket_category: t.category,
        hs_object_id: t.id,
      },
      createdAt: (t.createdAt as Date).toISOString(),
      updatedAt: (t.updatedAt as Date).toISOString(),
      archived: false,
      subject: t.subject,
      description: t.description,
      status: t.status,
      priority: t.priority,
      category: t.category,
      slaDeadline: t.slaDeadline,
      closedAt: t.closedAt,
      owner: t.owner || null,
      contact: t.contact || null,
      company: t.company || null,
      pipeline: t.pipeline || null,
      stage: t.stage || null,
    }));

    return NextResponse.json({
      results: formattedResults,
      paging: hasMore
        ? { next: { after: (results[results.length - 1] as Record<string, unknown>).id } }
        : undefined,
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch tickets" },
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
      return NextResponse.json(
        { status: "error", message: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const props = body.properties || body;

    const subject = props.subject;
    if (!subject) {
      return NextResponse.json(
        { status: "error", message: "subject is required" },
        { status: 400 }
      );
    }

    const ticket = await prisma.ticket.create({
      data: {
        subject,
        description: props.content || props.description || null,
        status: props.status || "OPEN",
        priority: props.hs_ticket_priority || props.priority || "MEDIUM",
        category: props.hs_ticket_category || props.category || null,
        ownerId: props.ownerId || null,
        contactId: props.contactId || null,
        companyId: props.companyId || null,
        pipelineId: props.hs_pipeline || props.pipelineId || null,
        stageId: props.hs_pipeline_stage || props.stageId || null,
      },
      include: {
        owner: { select: { id: true, name: true, email: true, image: true } },
        contact: { select: { id: true, firstName: true, lastName: true, email: true } },
        company: { select: { id: true, name: true, domain: true } },
        pipeline: { select: { id: true, name: true } },
        stage: { select: { id: true, name: true, color: true } },
      },
    });

    return NextResponse.json(
      {
        id: ticket.id,
        properties: {
          subject: ticket.subject,
          content: ticket.description,
          hs_ticket_priority: ticket.priority,
          hs_pipeline: ticket.pipelineId,
          hs_pipeline_stage: ticket.stageId,
          hs_ticket_category: ticket.category,
          hs_object_id: ticket.id,
        },
        createdAt: ticket.createdAt.toISOString(),
        updatedAt: ticket.updatedAt.toISOString(),
        archived: false,
        subject: ticket.subject,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        category: ticket.category,
        slaDeadline: ticket.slaDeadline,
        closedAt: ticket.closedAt,
        owner: ticket.owner || null,
        contact: ticket.contact || null,
        company: ticket.company || null,
        pipeline: ticket.pipeline || null,
        stage: ticket.stage || null,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to create ticket" },
      { status: 500 }
    );
  }
}
