import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, email: true, image: true } },
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
        company: {
          select: {
            id: true,
            name: true,
            domain: true,
            industry: true,
            phone: true,
          },
        },
        pipeline: { select: { id: true, name: true } },
        stage: { select: { id: true, name: true, color: true, order: true } },
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
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { status: "error", message: "Ticket not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: ticket.id,
      properties: {
        subject: ticket.subject,
        content: ticket.description,
        hs_ticket_priority: ticket.priority,
        hs_pipeline: ticket.pipelineId,
        hs_pipeline_stage: ticket.stageId,
        hs_object_id: ticket.id,
      },
      createdAt: ticket.createdAt.toISOString(),
      updatedAt: ticket.updatedAt.toISOString(),
      archived: false,
      // Expanded data for frontend
      subject: ticket.subject,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      category: ticket.category,
      slaDeadline: ticket.slaDeadline,
      closedAt: ticket.closedAt,
      ownerId: ticket.ownerId,
      contactId: ticket.contactId,
      companyId: ticket.companyId,
      pipelineId: ticket.pipelineId,
      stageId: ticket.stageId,
      owner: ticket.owner,
      contact: ticket.contact,
      company: ticket.company,
      pipeline: ticket.pipeline,
      stage: ticket.stage,
      activities: ticket.activities,
      notes: ticket.notes,
    });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch ticket" },
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

    const existing = await prisma.ticket.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { status: "error", message: "Ticket not found" },
        { status: 404 }
      );
    }

    const props = body.properties || body;
    const updateData: Record<string, unknown> = {};

    if (props.subject !== undefined) updateData.subject = props.subject;
    if (props.description !== undefined || props.content !== undefined)
      updateData.description = props.description ?? props.content ?? null;
    if (props.status !== undefined) updateData.status = props.status;
    if (props.priority !== undefined || props.hs_ticket_priority !== undefined)
      updateData.priority = props.priority ?? props.hs_ticket_priority;
    if (props.category !== undefined) updateData.category = props.category || null;
    if (props.ownerId !== undefined) updateData.ownerId = props.ownerId || null;
    if (props.contactId !== undefined) updateData.contactId = props.contactId || null;
    if (props.companyId !== undefined) updateData.companyId = props.companyId || null;
    if (props.pipelineId !== undefined || props.hs_pipeline !== undefined)
      updateData.pipelineId = props.pipelineId ?? props.hs_pipeline ?? null;
    if (props.stageId !== undefined || props.hs_pipeline_stage !== undefined)
      updateData.stageId = props.stageId ?? props.hs_pipeline_stage ?? null;
    if (props.slaDeadline !== undefined) {
      if (props.slaDeadline) {
        try {
          const d = new Date(props.slaDeadline);
          updateData.slaDeadline = isNaN(d.getTime()) ? null : d;
        } catch {
          updateData.slaDeadline = null;
        }
      } else {
        updateData.slaDeadline = null;
      }
    }
    if (props.closedAt !== undefined) {
      if (props.closedAt) {
        try {
          const d = new Date(props.closedAt);
          updateData.closedAt = isNaN(d.getTime()) ? null : d;
        } catch {
          updateData.closedAt = null;
        }
      } else {
        updateData.closedAt = null;
      }
    }

    // Auto-set closedAt when status changes to CLOSED
    if (props.status === "CLOSED" && !existing.closedAt && updateData.closedAt === undefined) {
      updateData.closedAt = new Date();
    }

    const ticket = await prisma.ticket.update({
      where: { id },
      data: updateData,
      include: {
        owner: { select: { id: true, name: true, email: true, image: true } },
        contact: { select: { id: true, firstName: true, lastName: true, email: true } },
        company: { select: { id: true, name: true, domain: true } },
        pipeline: { select: { id: true, name: true } },
        stage: { select: { id: true, name: true, color: true } },
      },
    });

    return NextResponse.json({
      id: ticket.id,
      properties: {
        subject: ticket.subject,
        content: ticket.description,
        hs_ticket_priority: ticket.priority,
        hs_pipeline: ticket.pipelineId,
        hs_pipeline_stage: ticket.stageId,
        hs_object_id: ticket.id,
      },
      createdAt: ticket.createdAt.toISOString(),
      updatedAt: ticket.updatedAt.toISOString(),
      archived: false,
      subject: ticket.subject,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      category: ticket.category,
      owner: ticket.owner || null,
      contact: ticket.contact || null,
      company: ticket.company || null,
      pipeline: ticket.pipeline || null,
      stage: ticket.stage || null,
    });
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to update ticket" },
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

    const existing = await prisma.ticket.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { status: "error", message: "Ticket not found" },
        { status: 404 }
      );
    }

    await prisma.ticket.delete({ where: { id } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to delete ticket" },
      { status: 500 }
    );
  }
}
