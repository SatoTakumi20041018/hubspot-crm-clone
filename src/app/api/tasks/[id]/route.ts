import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, email: true, image: true } },
        contact: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    if (!task) {
      return NextResponse.json(
        { status: "error", message: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch task" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { status: "error", message: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { status: "error", message: "Task not found" },
        { status: 404 }
      );
    }

    const props = body.properties || body;
    const updateData: Record<string, unknown> = {};

    if (props.hs_task_subject !== undefined || props.title !== undefined)
      updateData.title = props.hs_task_subject ?? props.title;
    if (props.hs_task_body !== undefined || props.description !== undefined)
      updateData.description = props.hs_task_body ?? props.description ?? null;

    const dueDate = props.hs_timestamp ?? props.dueDate;
    if (dueDate !== undefined) {
      if (dueDate) {
        try {
          const d = new Date(dueDate);
          updateData.dueDate = isNaN(d.getTime()) ? null : d;
        } catch {
          updateData.dueDate = null;
        }
      } else {
        updateData.dueDate = null;
      }
    }

    if (props.hs_task_priority !== undefined || props.priority !== undefined)
      updateData.priority = props.hs_task_priority ?? props.priority;
    if (props.hs_task_status !== undefined || props.status !== undefined)
      updateData.status = props.hs_task_status ?? props.status;
    if (props.hs_task_type !== undefined || props.type !== undefined)
      updateData.type = props.hs_task_type ?? props.type;
    if (props.ownerId !== undefined)
      updateData.ownerId = props.ownerId || null;
    if (props.contactId !== undefined)
      updateData.contactId = props.contactId || null;

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        owner: { select: { id: true, name: true, email: true, image: true } },
        contact: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to update task" },
      { status: 500 }
    );
  }
}
