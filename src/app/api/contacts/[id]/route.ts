import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const contact = await prisma.contact.findUnique({
      where: { id },
      include: {
        company: true,
        owner: { select: { id: true, name: true, email: true, image: true } },
        deals: {
          include: {
            deal: {
              include: {
                stage: { select: { id: true, name: true, color: true } },
                pipeline: { select: { id: true, name: true } },
              },
            },
          },
        },
        tickets: {
          include: {
            owner: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        tasks: {
          include: {
            owner: { select: { id: true, name: true } },
          },
          orderBy: { dueDate: "asc" },
          take: 10,
        },
        activities: {
          include: {
            user: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
        notes: {
          include: {
            user: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        properties: true,
        _count: {
          select: {
            deals: true,
            tickets: true,
            tasks: true,
            activities: true,
            notes: true,
          },
        },
      },
    });

    if (!contact) {
      return NextResponse.json(
        { error: "コンタクトが見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json(contact);
  } catch (error) {
    console.error("Error fetching contact:", error);
    return NextResponse.json(
      { error: "コンタクトの取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.contact.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "コンタクトが見つかりません" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};
    const allowedFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "jobTitle",
      "avatar",
      "lifecycleStage",
      "leadStatus",
      "source",
      "ownerId",
      "companyId",
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field] || null;
      }
    }

    // firstName and lastName should not be null
    if (body.firstName !== undefined) updateData.firstName = body.firstName;
    if (body.lastName !== undefined) updateData.lastName = body.lastName;

    const contact = await prisma.contact.update({
      where: { id },
      data: updateData,
      include: {
        company: { select: { id: true, name: true } },
        owner: { select: { id: true, name: true } },
        _count: {
          select: {
            deals: true,
            tickets: true,
            tasks: true,
            activities: true,
          },
        },
      },
    });

    return NextResponse.json(contact);
  } catch (error) {
    console.error("Error updating contact:", error);
    return NextResponse.json(
      { error: "コンタクトの更新に失敗しました" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.contact.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "コンタクトが見つかりません" },
        { status: 404 }
      );
    }

    await prisma.contact.delete({
      where: { id },
    });

    return NextResponse.json({ message: "コンタクトを削除しました" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return NextResponse.json(
      { error: "コンタクトの削除に失敗しました" },
      { status: 500 }
    );
  }
}
