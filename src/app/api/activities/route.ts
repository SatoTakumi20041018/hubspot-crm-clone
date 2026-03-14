import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    const where: Record<string, unknown> = {};

    if (contactId) {
      where.contactId = contactId;
    }

    if (dealId) {
      where.dealId = dealId;
    }

    if (ticketId) {
      where.ticketId = ticketId;
    }

    if (companyId) {
      where.companyId = companyId;
    }

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true } },
          contact: { select: { id: true, firstName: true, lastName: true } },
          deal: { select: { id: true, name: true } },
          ticket: { select: { id: true, subject: true } },
          company: { select: { id: true, name: true } },
        },
      }),
      prisma.activity.count({ where }),
    ]);

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
    const body = await request.json();
    const { type, subject, body: activityBody, metadata, userId, contactId, companyId, dealId, ticketId } = body;

    if (!type) {
      return NextResponse.json(
        { error: "アクティビティタイプは必須です" },
        { status: 400 }
      );
    }

    const activity = await prisma.activity.create({
      data: {
        type,
        subject: subject || null,
        body: activityBody || null,
        metadata: metadata || null,
        userId: userId || null,
        contactId: contactId || null,
        companyId: companyId || null,
        dealId: dealId || null,
        ticketId: ticketId || null,
      },
      include: {
        user: { select: { id: true, name: true } },
        contact: { select: { id: true, firstName: true, lastName: true } },
        deal: { select: { id: true, name: true } },
        ticket: { select: { id: true, subject: true } },
        company: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error("Error creating activity:", error);
    return NextResponse.json(
      { error: "アクティビティの作成に失敗しました" },
      { status: 500 }
    );
  }
}
