import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const deal = await prisma.deal.findUnique({
      where: { id },
      include: {
        stage: { select: { id: true, name: true, color: true, probability: true } },
        pipeline: { select: { id: true, name: true } },
        owner: { select: { id: true, name: true, email: true, image: true } },
        company: {
          select: {
            id: true,
            name: true,
            domain: true,
            industry: true,
            phone: true,
          },
        },
        contacts: {
          include: {
            contact: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                jobTitle: true,
              },
            },
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
            contacts: true,
            activities: true,
            notes: true,
          },
        },
      },
    });

    if (!deal) {
      return NextResponse.json(
        { status: "error", message: "Deal not found" },
        { status: 404 }
      );
    }

    const formattedContacts = deal.contacts.map((dc) => ({
      id: dc.contact.id,
      firstName: dc.contact.firstName,
      lastName: dc.contact.lastName,
      email: dc.contact.email,
      phone: dc.contact.phone,
      jobTitle: dc.contact.jobTitle,
    }));

    return NextResponse.json({
      id: deal.id,
      properties: {
        dealname: deal.name,
        amount: deal.amount,
        closedate: deal.closeDate?.toISOString() || null,
        dealstage: deal.stageId,
        pipeline: deal.pipelineId,
        hs_object_id: deal.id,
      },
      createdAt: deal.createdAt.toISOString(),
      updatedAt: deal.updatedAt.toISOString(),
      archived: false,
      // Expanded data for frontend
      name: deal.name,
      amount: deal.amount,
      currency: deal.currency,
      closeDate: deal.closeDate,
      probability: deal.probability,
      priority: deal.priority,
      stageId: deal.stageId,
      pipelineId: deal.pipelineId,
      ownerId: deal.ownerId,
      companyId: deal.companyId,
      stage: deal.stage,
      pipeline: deal.pipeline,
      owner: deal.owner,
      company: deal.company,
      contacts: formattedContacts,
      activities: deal.activities,
      notes: deal.notes,
      _count: deal._count,
    });
  } catch (error) {
    console.error("Error fetching deal:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch deal" },
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

    const existing = await prisma.deal.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { status: "error", message: "Deal not found" },
        { status: 404 }
      );
    }

    const props = body.properties || body;
    const updateData: Record<string, unknown> = {};

    if (props.dealname !== undefined || props.name !== undefined)
      updateData.name = props.dealname ?? props.name;
    if (props.amount !== undefined) {
      updateData.amount = props.amount ? parseFloat(String(props.amount)) : null;
    }
    if (props.closedate !== undefined || props.closeDate !== undefined) {
      const raw = props.closedate ?? props.closeDate;
      if (raw) {
        try {
          const d = new Date(raw);
          updateData.closeDate = isNaN(d.getTime()) ? null : d;
        } catch {
          updateData.closeDate = null;
        }
      } else {
        updateData.closeDate = null;
      }
    }
    if (props.probability !== undefined) {
      updateData.probability = props.probability ? parseFloat(String(props.probability)) : null;
    }
    if (props.priority !== undefined) updateData.priority = props.priority;
    if (props.stageId !== undefined || props.dealstage !== undefined)
      updateData.stageId = props.stageId ?? props.dealstage;
    if (props.pipelineId !== undefined || props.pipeline !== undefined)
      updateData.pipelineId = props.pipelineId ?? props.pipeline;
    if (props.ownerId !== undefined) updateData.ownerId = props.ownerId || null;
    if (props.companyId !== undefined) updateData.companyId = props.companyId || null;

    const deal = await prisma.deal.update({
      where: { id },
      data: updateData,
      include: {
        stage: { select: { id: true, name: true, color: true } },
        pipeline: { select: { id: true, name: true } },
        owner: { select: { id: true, name: true, email: true, image: true } },
        company: { select: { id: true, name: true, domain: true } },
        _count: {
          select: { contacts: true, activities: true, notes: true },
        },
      },
    });

    return NextResponse.json({
      id: deal.id,
      properties: {
        dealname: deal.name,
        amount: deal.amount,
        closedate: deal.closeDate?.toISOString() || null,
        dealstage: deal.stageId,
        pipeline: deal.pipelineId,
        hs_object_id: deal.id,
      },
      createdAt: deal.createdAt.toISOString(),
      updatedAt: deal.updatedAt.toISOString(),
      archived: false,
      name: deal.name,
      amount: deal.amount,
      priority: deal.priority,
      stage: deal.stage,
      pipeline: deal.pipeline,
      owner: deal.owner || null,
      company: deal.company || null,
      _count: deal._count,
    });
  } catch (error) {
    console.error("Error updating deal:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to update deal" },
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

    const existing = await prisma.deal.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { status: "error", message: "Deal not found" },
        { status: 404 }
      );
    }

    await prisma.deal.delete({ where: { id } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting deal:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to delete deal" },
      { status: 500 }
    );
  }
}
