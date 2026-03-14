import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const after = searchParams.get("after");
    const contactId = searchParams.get("contactId");
    const dealId = searchParams.get("dealId");
    const ticketId = searchParams.get("ticketId");
    const companyId = searchParams.get("companyId");

    const where: Prisma.ActivityWhereInput = {};

    if (contactId) where.contactId = contactId;
    if (dealId) where.dealId = dealId;
    if (ticketId) where.ticketId = ticketId;
    if (companyId) where.companyId = companyId;

    const findArgs: Prisma.ActivityFindManyArgs = {
      where,
      take: limit + 1,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        contact: { select: { id: true, firstName: true, lastName: true, email: true } },
        deal: { select: { id: true, name: true } },
        ticket: { select: { id: true, subject: true } },
        company: { select: { id: true, name: true, domain: true } },
      },
    };

    if (after) {
      findArgs.cursor = { id: after };
      findArgs.skip = 1;
    }

    const activities = await prisma.activity.findMany(findArgs);

    const hasMore = activities.length > limit;
    const results = activities.slice(0, limit);

    const formattedResults = results.map((a: Record<string, unknown>) => ({
      id: a.id,
      properties: {
        hs_activity_type: a.type,
        hs_body_preview: a.subject,
        hs_object_id: a.id,
      },
      createdAt: (a.createdAt as Date).toISOString(),
      archived: false,
      type: a.type,
      subject: a.subject,
      body: a.body,
      metadata: a.metadata,
      user: a.user || null,
      contact: a.contact || null,
      deal: a.deal || null,
      ticket: a.ticket || null,
      company: a.company || null,
    }));

    return NextResponse.json({
      results: formattedResults,
      paging: hasMore
        ? { next: { after: (results[results.length - 1] as Record<string, unknown>).id } }
        : undefined,
    });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch activities" },
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
        { status: "error", message: "Activity type is required" },
        { status: 400 }
      );
    }

    const activity = await prisma.activity.create({
      data: {
        type,
        subject: subject || null,
        body: activityBody || null,
        metadata: metadata || undefined,
        userId: userId || null,
        contactId: contactId || null,
        companyId: companyId || null,
        dealId: dealId || null,
        ticketId: ticketId || null,
      },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        contact: { select: { id: true, firstName: true, lastName: true, email: true } },
        deal: { select: { id: true, name: true } },
        ticket: { select: { id: true, subject: true } },
        company: { select: { id: true, name: true, domain: true } },
      },
    });

    return NextResponse.json(
      {
        id: activity.id,
        properties: {
          hs_activity_type: activity.type,
          hs_body_preview: activity.subject,
          hs_object_id: activity.id,
        },
        createdAt: activity.createdAt.toISOString(),
        archived: false,
        type: activity.type,
        subject: activity.subject,
        body: activity.body,
        metadata: activity.metadata,
        user: activity.user || null,
        contact: activity.contact || null,
        deal: activity.deal || null,
        ticket: activity.ticket || null,
        company: activity.company || null,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating activity:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to create activity" },
      { status: 500 }
    );
  }
}
