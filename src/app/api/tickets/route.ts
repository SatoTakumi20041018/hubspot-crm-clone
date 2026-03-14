import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { subject: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    if (ownerId) {
      where.ownerId = ownerId;
    }

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          owner: { select: { id: true, name: true } },
          contact: { select: { id: true, firstName: true, lastName: true } },
          company: { select: { id: true, name: true } },
          pipeline: { select: { id: true, name: true } },
          stage: { select: { id: true, name: true, color: true } },
        },
      }),
      prisma.ticket.count({ where }),
    ]);

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
    const body = await request.json();
    const { subject, description, status, priority, category, ownerId, contactId, companyId, pipelineId, stageId } = body;

    if (!subject) {
      return NextResponse.json(
        { error: "件名は必須です" },
        { status: 400 }
      );
    }

    const ticket = await prisma.ticket.create({
      data: {
        subject,
        description: description || null,
        status: status || "OPEN",
        priority: priority || "MEDIUM",
        category: category || null,
        ownerId: ownerId || null,
        contactId: contactId || null,
        companyId: companyId || null,
        pipelineId: pipelineId || null,
        stageId: stageId || null,
      },
      include: {
        owner: { select: { id: true, name: true } },
        contact: { select: { id: true, firstName: true, lastName: true } },
        company: { select: { id: true, name: true } },
        pipeline: { select: { id: true, name: true } },
        stage: { select: { id: true, name: true, color: true } },
      },
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { error: "チケットの作成に失敗しました" },
      { status: 500 }
    );
  }
}
