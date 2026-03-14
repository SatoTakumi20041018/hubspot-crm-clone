import { NextResponse } from "next/server";
import {
  mockTasks,
  getUserSelect,
  getContactSelect,
} from "@/lib/mock-data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const task = mockTasks.find((t) => t.id === id);

    if (!task) {
      return NextResponse.json(
        { error: "タスクが見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...task,
      owner: getUserSelect(task.ownerId),
      contact: getContactSelect(task.contactId),
    });
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json(
      { error: "タスクの取得に失敗しました" },
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
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const index = mockTasks.findIndex((t) => t.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "タスクが見つかりません" },
        { status: 404 }
      );
    }

    const existing = mockTasks[index];
    const updateData: Record<string, unknown> = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.dueDate !== undefined) {
      if (body.dueDate) {
        try {
          const d = new Date(body.dueDate);
          updateData.dueDate = isNaN(d.getTime()) ? null : d.toISOString();
        } catch {
          updateData.dueDate = null;
        }
      } else {
        updateData.dueDate = null;
      }
    }
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.ownerId !== undefined) updateData.ownerId = body.ownerId || null;
    if (body.contactId !== undefined) updateData.contactId = body.contactId || null;

    const updated = {
      ...existing,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    mockTasks[index] = updated as typeof existing;

    const task = {
      ...updated,
      owner: getUserSelect(updated.ownerId as string | null),
      contact: getContactSelect(updated.contactId as string | null),
    };

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "タスクの更新に失敗しました" },
      { status: 500 }
    );
  }
}
