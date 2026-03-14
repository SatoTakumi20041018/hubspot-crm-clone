import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const after = searchParams.get("after");
    const search = searchParams.get("search") || "";
    const lifecycleStage = searchParams.get("lifecycleStage");
    const leadStatus = searchParams.get("leadStatus");
    const ownerId = searchParams.get("ownerId");
    const associations = searchParams.get("associations")?.split(",") || [];

    const where: Prisma.ContactWhereInput = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    if (lifecycleStage) {
      where.lifecycleStage = lifecycleStage as Prisma.EnumLifecycleStageFilter;
    }

    if (leadStatus) {
      where.leadStatus = leadStatus as Prisma.EnumLeadStatusNullableFilter;
    }

    if (ownerId) {
      where.ownerId = ownerId;
    }

    const findArgs: Prisma.ContactFindManyArgs = {
      where,
      take: limit + 1,
      orderBy: { createdAt: "desc" },
      include: {
        company: associations.includes("company") ? {
          select: { id: true, name: true, domain: true, industry: true },
        } : false,
        owner: associations.includes("owner") ? {
          select: { id: true, name: true, email: true, image: true },
        } : false,
        _count: {
          select: {
            deals: true,
            tickets: true,
            tasks: true,
            activities: true,
          },
        },
      },
    };

    if (after) {
      findArgs.cursor = { id: after };
      findArgs.skip = 1;
    }

    const contacts = await prisma.contact.findMany(findArgs);

    const hasMore = contacts.length > limit;
    const results = contacts.slice(0, limit);

    const formattedResults = results.map((c: Record<string, unknown>) => ({
      id: c.id,
      properties: {
        email: c.email,
        firstname: c.firstName,
        lastname: c.lastName,
        phone: c.phone,
        jobtitle: c.jobTitle,
        avatar: c.avatar,
        lifecyclestage: c.lifecycleStage,
        leadstatus: c.leadStatus,
        source: c.source,
        hs_object_id: c.id,
      },
      createdAt: (c.createdAt as Date).toISOString(),
      updatedAt: (c.updatedAt as Date).toISOString(),
      archived: false,
      associations: {
        ...(associations.includes("company") && c.company
          ? { companies: { results: [{ id: (c.company as Record<string, unknown>).id, type: "contact_to_company" }] } }
          : {}),
        ...(associations.includes("owner") && c.owner
          ? { owners: { results: [{ id: (c.owner as Record<string, unknown>).id, type: "contact_to_owner" }] } }
          : {}),
      },
      company: c.company || null,
      owner: c.owner || null,
      _count: c._count,
    }));

    return NextResponse.json({
      results: formattedResults,
      paging: hasMore
        ? { next: { after: (results[results.length - 1] as Record<string, unknown>).id } }
        : undefined,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch contacts" },
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

    const { properties, associations } = body;
    const props = properties || body;

    const firstName = props.firstname || props.firstName;
    const lastName = props.lastname || props.lastName;

    if (!firstName || !lastName) {
      return NextResponse.json(
        { status: "error", message: "firstname and lastname are required" },
        { status: 400 }
      );
    }

    const email = props.email || null;

    if (email) {
      const existing = await prisma.contact.findFirst({
        where: { email },
      });
      if (existing) {
        return NextResponse.json(
          { status: "error", message: "Contact with this email already exists" },
          { status: 409 }
        );
      }
    }

    const companyIdFromAssoc = associations?.find(
      (a: { to?: { id?: string }; type?: string }) => a.type === "contact_to_company"
    )?.to?.id;

    const contact = await prisma.contact.create({
      data: {
        firstName,
        lastName,
        email,
        phone: props.phone || null,
        jobTitle: props.jobtitle || props.jobTitle || null,
        lifecycleStage: props.lifecyclestage || props.lifecycleStage || "SUBSCRIBER",
        leadStatus: props.leadstatus || props.leadStatus || null,
        source: props.source || null,
        ownerId: props.ownerId || null,
        companyId: props.companyId || companyIdFromAssoc || null,
      },
      include: {
        company: { select: { id: true, name: true, domain: true, industry: true } },
        owner: { select: { id: true, name: true, email: true, image: true } },
        _count: {
          select: { deals: true, tickets: true, tasks: true, activities: true },
        },
      },
    });

    return NextResponse.json(
      {
        id: contact.id,
        properties: {
          email: contact.email,
          firstname: contact.firstName,
          lastname: contact.lastName,
          phone: contact.phone,
          jobtitle: contact.jobTitle,
          avatar: contact.avatar,
          lifecyclestage: contact.lifecycleStage,
          leadstatus: contact.leadStatus,
          source: contact.source,
          hs_object_id: contact.id,
        },
        createdAt: contact.createdAt.toISOString(),
        updatedAt: contact.updatedAt.toISOString(),
        archived: false,
        company: contact.company || null,
        owner: contact.owner || null,
        _count: contact._count,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to create contact" },
      { status: 500 }
    );
  }
}
