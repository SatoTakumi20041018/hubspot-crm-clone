import { NextRequest, NextResponse } from "next/server";
import {
  mockActivities,
  mockDeals,
  mockTickets,
  getUserSelect,
  getContactSelect,
  getCompanySelect,
} from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const contactId = searchParams.get("contactId");
    const dealId = searchParams.get("dealId");
    const ticketId = searchParams.get("ticketId");
    const companyId = searchParams.get("companyId");

    const skip = (page - 1) * limit;

    let filtered = [...mockActivities];

    if (contactId) {
      filtered = filtered.filter((a) => a.contactId === contactId);
    }

    if (dealId) {
      filtered = filtered.filter((a) => a.dealId === dealId);
    }

    if (ticketId) {
      filtered = filtered.filter((a) => a.ticketId === ticketId);
    }

    if (companyId) {
      filtered = filtered.filter((a) => a.companyId === companyId);
    }

    // Sort by createdAt desc
    filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);

    const activities = paginated.map((a) => {
      const deal = a.dealId
        ? mockDeals.find((d) => d.id === a.dealId)
        : null;
      const ticket = a.ticketId
        ? mockTickets.find((t) => t.id === a.ticketId)
        : null;

      return {
        ...a,
        user: getUserSelect(a.userId),
        contact: getContactSelect(a.contactId),
        deal: deal ? { id: deal.id, name: deal.name } : null,
        ticket: ticket ? { id: ticket.id, subject: ticket.subject } : null,
        company: getCompanySelect(a.companyId),
      };
    });

    return NextResponse.json({
      activities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "アクティビティの取得に失敗しました" },
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
      type,
      subject,
      body: activityBody,
      metadata,
      userId,
      contactId,
      companyId,
      dealId,
      ticketId,
    } = body;

    if (!type) {
      return NextResponse.json(
        { error: "アクティビティタイプは必須です" },
        { status: 400 }
      );
    }

    const newActivity = {
      id: `activity-${Date.now()}`,
      type,
      subject: subject || null,
      body: activityBody || null,
      metadata: metadata || null,
      userId: userId || null,
      contactId: contactId || null,
      companyId: companyId || null,
      dealId: dealId || null,
      ticketId: ticketId || null,
      createdAt: new Date().toISOString(),
    };

    mockActivities.push(newActivity);

    const deal = newActivity.dealId
      ? mockDeals.find((d) => d.id === newActivity.dealId)
      : null;
    const ticket = newActivity.ticketId
      ? mockTickets.find((t) => t.id === newActivity.ticketId)
      : null;

    const activity = {
      ...newActivity,
      user: getUserSelect(newActivity.userId),
      contact: getContactSelect(newActivity.contactId),
      deal: deal ? { id: deal.id, name: deal.name } : null,
      ticket: ticket ? { id: ticket.id, subject: ticket.subject } : null,
      company: getCompanySelect(newActivity.companyId),
    };

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error("Error creating activity:", error);
    return NextResponse.json(
      { error: "アクティビティの作成に失敗しました" },
      { status: 500 }
    );
  }
}
