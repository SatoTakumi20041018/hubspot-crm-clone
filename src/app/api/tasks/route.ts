import { NextRequest, NextResponse } from "next/server";
import {
  mockTasks,
  getUserSelect,
  getContactSelect,
} from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const ownerId = searchParams.get("ownerId");
    const dueDateFrom = searchParams.get("dueDateFrom");
    const dueDateTo = searchParams.get("dueDateTo");

    const skip = (page - 1) * limit;

    let filtered = [...mockTasks];

    if (status) {
      filtered = filtered.filter((t) => t.status === status);
    }

    if (ownerId) {
      filtered = filtered.filter((t) => t.ownerId === ownerId);
    }

    if (dueDateFrom) {
      const from = new Date(dueDateFrom).getTime();
      filtered = filtered.filter(
        (t) => t.dueDate && new Date(t.dueDate).getTime() >= from
      );
    }

    if (dueDateTo) {
      const to = new Date(dueDateTo).getTime();
      filtered = filtered.filter(
        (t) => t.dueDate && new Date(t.dueDate).getTime() <= to
      );
    }

    // Sort by dueDate asc, then createdAt desc
    filtered.sort((a, b) => {
      if (a.dueDate && b.dueDate) {
        const diff =
          new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        if (diff !== 0) return diff;
      }
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return (
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);

    const tasks = paginated.map((t) => ({
      ...t,
      owner: getUserSelect(t.ownerId),
      contact: getContactSelect(t.contactId),
    }));

    return NextResponse.json({
      tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "タスクの取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, dueDate, priority, status, type, ownerId, contactId } =
      body;

    if (!title) {
      return NextResponse.json(
        { error: "タスク名は必須です" },
        { status: 400 }
      );
    }

    const newTask = {
      id: `task-${Date.now()}`,
      title,
      description: description || null,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      priority: (priority || "MEDIUM") as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
      status: (status || "NOT_STARTED") as "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "DEFERRED",
      type: (type || "TODO") as "TODO" | "CALL" | "EMAIL" | "MEETING" | "FOLLOW_UP",
      ownerId: ownerId || null,
      contactId: contactId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockTasks.push(newTask);

    const task = {
      ...newTask,
      owner: getUserSelect(newTask.ownerId),
      contact: getContactSelect(newTask.contactId),
    };

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "タスクの作成に失敗しました" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { error: "タスクIDは必須です" },
        { status: 400 }
      );
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

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.dueDate !== undefined)
      updateData.dueDate = data.dueDate
        ? new Date(data.dueDate).toISOString()
        : null;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.ownerId !== undefined) updateData.ownerId = data.ownerId || null;
    if (data.contactId !== undefined)
      updateData.contactId = data.contactId || null;

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
