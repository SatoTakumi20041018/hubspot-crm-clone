import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const after = searchParams.get("after");
    const status = searchParams.get("status");
    const ownerId = searchParams.get("ownerId");
    const dueDateFrom = searchParams.get("dueDateFrom");
    const dueDateTo = searchParams.get("dueDateTo");

    const where: Prisma.TaskWhereInput = {};

    if (status) {
      where.status = status as Prisma.EnumTaskStatusFilter;
    }

    if (ownerId) {
      where.ownerId = ownerId;
    }

    if (dueDateFrom || dueDateTo) {
      const dueDateFilter: Record<string, Date> = {};
      if (dueDateFrom) dueDateFilter.gte = new Date(dueDateFrom);
      if (dueDateTo) dueDateFilter.lte = new Date(dueDateTo);
      where.dueDate = dueDateFilter;
    }

    const findArgs: Prisma.TaskFindManyArgs = {
      where,
      take: limit + 1,
      orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
      include: {
        owner: { select: { id: true, name: true, email: true, image: true } },
        contact: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    };

    if (after) {
      findArgs.cursor = { id: after };
      findArgs.skip = 1;
    }

    const tasks = await prisma.task.findMany(findArgs);

    const hasMore = tasks.length > limit;
    const results = tasks.slice(0, limit);

    const formattedResults = results.map((t: Record<string, unknown>) => ({
      id: t.id,
      properties: {
        hs_task_subject: t.title,
        hs_task_body: t.description,
        hs_task_status: t.status,
        hs_task_priority: t.priority,
        hs_task_type: t.type,
        hs_timestamp: t.dueDate ? (t.dueDate as Date).toISOString() : null,
        hs_object_id: t.id,
      },
      createdAt: (t.createdAt as Date).toISOString(),
      updatedAt: (t.updatedAt as Date).toISOString(),
      archived: false,
      title: t.title,
      description: t.description,
      dueDate: t.dueDate,
      priority: t.priority,
      status: t.status,
      type: t.type,
      owner: t.owner || null,
      contact: t.contact || null,
    }));

    return NextResponse.json({
      results: formattedResults,
      paging: hasMore
        ? { next: { after: (results[results.length - 1] as Record<string, unknown>).id } }
        : undefined,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch tasks" },
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

    const title = props.hs_task_subject || props.title;
    if (!title) {
      return NextResponse.json(
        { status: "error", message: "Task title is required" },
        { status: 400 }
      );
    }

    const dueDate = props.hs_timestamp || props.dueDate;

    const task = await prisma.task.create({
      data: {
        title,
        description: props.hs_task_body || props.description || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: props.hs_task_priority || props.priority || "MEDIUM",
        status: props.hs_task_status || props.status || "NOT_STARTED",
        type: props.hs_task_type || props.type || "TODO",
        ownerId: props.ownerId || null,
        contactId: props.contactId || null,
      },
      include: {
        owner: { select: { id: true, name: true, email: true, image: true } },
        contact: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    return NextResponse.json(
      {
        id: task.id,
        properties: {
          hs_task_subject: task.title,
          hs_task_body: task.description,
          hs_task_status: task.status,
          hs_task_priority: task.priority,
          hs_task_type: task.type,
          hs_timestamp: task.dueDate?.toISOString() || null,
          hs_object_id: task.id,
        },
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
        archived: false,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        status: task.status,
        type: task.type,
        owner: task.owner || null,
        contact: task.contact || null,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to create task" },
      { status: 500 }
    );
  }
}
