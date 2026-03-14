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
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            owner: { select: { id: true, name: true, email: true, image: true } },
          },
        },
        tasks: {
          take: 10,
          orderBy: { dueDate: "asc" },
          include: {
            owner: { select: { id: true, name: true, email: true, image: true } },
          },
        },
        activities: {
          take: 20,
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { id: true, name: true, email: true, image: true } },
          },
        },
        notes: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { id: true, name: true, email: true, image: true } },
          },
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
        { status: "error", message: "Contact not found" },
        { status: 404 }
      );
    }

    const formattedDeals = contact.deals.map((dc) => ({
      deal: {
        ...dc.deal,
        stage: dc.deal.stage
          ? { id: dc.deal.stage.id, name: dc.deal.stage.name, color: dc.deal.stage.color }
          : null,
        pipeline: dc.deal.pipeline
          ? { id: dc.deal.pipeline.id, name: dc.deal.pipeline.name }
          : null,
      },
    }));

    return NextResponse.json({
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
      // Expanded data for frontend
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      jobTitle: contact.jobTitle,
      avatar: contact.avatar,
      lifecycleStage: contact.lifecycleStage,
      leadStatus: contact.leadStatus,
      source: contact.source,
      ownerId: contact.ownerId,
      companyId: contact.companyId,
      company: contact.company,
      owner: contact.owner,
      deals: formattedDeals,
      tickets: contact.tickets,
      tasks: contact.tasks,
      activities: contact.activities,
      notes: contact.notes,
      _count: contact._count,
    });
  } catch (error) {
    console.error("Error fetching contact:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch contact" },
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

    const existing = await prisma.contact.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { status: "error", message: "Contact not found" },
        { status: 404 }
      );
    }

    const props = body.properties || body;

    const updateData: Record<string, unknown> = {};

    if (props.firstname !== undefined || props.firstName !== undefined)
      updateData.firstName = props.firstname ?? props.firstName;
    if (props.lastname !== undefined || props.lastName !== undefined)
      updateData.lastName = props.lastname ?? props.lastName;
    if (props.email !== undefined) updateData.email = props.email || null;
    if (props.phone !== undefined) updateData.phone = props.phone || null;
    if (props.jobtitle !== undefined || props.jobTitle !== undefined)
      updateData.jobTitle = props.jobtitle ?? props.jobTitle ?? null;
    if (props.avatar !== undefined) updateData.avatar = props.avatar || null;
    if (props.lifecyclestage !== undefined || props.lifecycleStage !== undefined)
      updateData.lifecycleStage = props.lifecyclestage ?? props.lifecycleStage;
    if (props.leadstatus !== undefined || props.leadStatus !== undefined)
      updateData.leadStatus = props.leadstatus ?? props.leadStatus ?? null;
    if (props.source !== undefined) updateData.source = props.source || null;
    if (props.ownerId !== undefined) updateData.ownerId = props.ownerId || null;
    if (props.companyId !== undefined) updateData.companyId = props.companyId || null;

    const contact = await prisma.contact.update({
      where: { id },
      data: updateData,
      include: {
        company: { select: { id: true, name: true, domain: true, industry: true } },
        owner: { select: { id: true, name: true, email: true, image: true } },
        _count: {
          select: { deals: true, tickets: true, tasks: true, activities: true },
        },
      },
    });

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error("Error updating contact:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to update contact" },
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

    const existing = await prisma.contact.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { status: "error", message: "Contact not found" },
        { status: 404 }
      );
    }

    await prisma.contact.delete({ where: { id } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to delete contact" },
      { status: 500 }
    );
  }
}
