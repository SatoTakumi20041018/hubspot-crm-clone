import { NextResponse } from "next/server";
import {
  mockContacts,
  mockDealContacts,
  mockDeals,
  mockTickets,
  mockTasks,
  mockActivities,
  mockNotes,
  mockUsers,
  getUserSelect,
  getCompanyById,
  getCompanySelect,
  getStageById,
  getPipelineById,
} from "@/lib/mock-data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const contact = mockContacts.find((c) => c.id === id);

    if (!contact) {
      return NextResponse.json(
        { error: "コンタクトが見つかりません" },
        { status: 404 }
      );
    }

    const company = contact.companyId
      ? getCompanyById(contact.companyId)
      : null;

    const ownerUser = contact.ownerId
      ? mockUsers.find((u) => u.id === contact.ownerId)
      : null;
    const owner = ownerUser
      ? { id: ownerUser.id, name: ownerUser.name, email: ownerUser.email, image: ownerUser.image }
      : null;

    const dealContacts = mockDealContacts.filter(
      (dc) => dc.contactId === id
    );
    const deals = dealContacts
      .map((dc) => {
        const deal = mockDeals.find((d) => d.id === dc.dealId);
        if (!deal) return null;
        const stage = getStageById(deal.stageId);
        const pipeline = getPipelineById(deal.pipelineId);
        return {
          deal: {
            ...deal,
            stage: stage
              ? { id: stage.id, name: stage.name, color: stage.color }
              : null,
            pipeline: pipeline
              ? { id: pipeline.id, name: pipeline.name }
              : null,
          },
        };
      })
      .filter(Boolean);

    const tickets = mockTickets
      .filter((t) => t.contactId === id)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 10)
      .map((t) => ({
        ...t,
        owner: getUserSelect(t.ownerId),
      }));

    const tasks = mockTasks
      .filter((t) => t.contactId === id)
      .sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return (
          new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        );
      })
      .slice(0, 10)
      .map((t) => ({
        ...t,
        owner: getUserSelect(t.ownerId),
      }));

    const activities = mockActivities
      .filter((a) => a.contactId === id)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 20)
      .map((a) => ({
        ...a,
        user: getUserSelect(a.userId),
      }));

    const notes = mockNotes
      .filter((n) => n.contactId === id)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 10)
      .map((n) => ({
        ...n,
        user: getUserSelect(n.userId),
      }));

    return NextResponse.json({
      ...contact,
      company,
      owner,
      deals,
      tickets,
      tasks,
      activities,
      notes,
      properties: [],
      _count: {
        deals: dealContacts.length,
        tickets: mockTickets.filter((t) => t.contactId === id).length,
        tasks: mockTasks.filter((t) => t.contactId === id).length,
        activities: mockActivities.filter((a) => a.contactId === id).length,
        notes: mockNotes.filter((n) => n.contactId === id).length,
      },
    });
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

    const index = mockContacts.findIndex((c) => c.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "コンタクトが見つかりません" },
        { status: 404 }
      );
    }

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

    const existing = mockContacts[index];
    const updateData: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field] || null;
      }
    }

    // firstName and lastName should not be null
    if (body.firstName !== undefined) updateData.firstName = body.firstName;
    if (body.lastName !== undefined) updateData.lastName = body.lastName;

    const updated = {
      ...existing,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    mockContacts[index] = updated as typeof existing;

    const contact = {
      ...updated,
      company: getCompanySelect(updated.companyId as string | null),
      owner: getUserSelect(updated.ownerId as string | null),
      _count: {
        deals: mockDealContacts.filter((dc) => dc.contactId === id).length,
        tickets: mockTickets.filter((t) => t.contactId === id).length,
        tasks: mockTasks.filter((t) => t.contactId === id).length,
        activities: mockActivities.filter((a) => a.contactId === id).length,
      },
    };

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

    const index = mockContacts.findIndex((c) => c.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "コンタクトが見つかりません" },
        { status: 404 }
      );
    }

    mockContacts.splice(index, 1);

    return NextResponse.json({ message: "コンタクトを削除しました" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return NextResponse.json(
      { error: "コンタクトの削除に失敗しました" },
      { status: 500 }
    );
  }
}
