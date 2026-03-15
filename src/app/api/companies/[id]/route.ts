import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, email: true, image: true } },
        contacts: {
          take: 20,
          orderBy: { createdAt: "desc" },
          include: {
            owner: { select: { id: true, name: true, email: true, image: true } },
          },
        },
        deals: {
          take: 20,
          orderBy: { createdAt: "desc" },
          include: {
            stage: { select: { id: true, name: true, color: true } },
            pipeline: { select: { id: true, name: true } },
            owner: { select: { id: true, name: true, email: true, image: true } },
          },
        },
        tickets: {
          take: 20,
          orderBy: { createdAt: "desc" },
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
          take: 20,
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { id: true, name: true, email: true, image: true } },
          },
        },
        properties: true,
        _count: {
          select: {
            contacts: true,
            deals: true,
            tickets: true,
            activities: true,
            notes: true,
          },
        },
      },
    });

    if (!company) {
      return NextResponse.json(
        { status: "error", message: "Company not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: company.id,
      properties: {
        name: company.name,
        domain: company.domain,
        industry: company.industry,
        phone: company.phone,
        city: company.city,
        state: company.state,
        country: company.country,
        description: company.description,
        annualrevenue: company.annualRevenue,
        numberofemployees: company.employeeCount,
        hs_object_id: company.id,
      },
      createdAt: company.createdAt.toISOString(),
      updatedAt: company.updatedAt.toISOString(),
      archived: false,
      // Expanded data for frontend
      name: company.name,
      domain: company.domain,
      industry: company.industry,
      phone: company.phone,
      city: company.city,
      state: company.state,
      country: company.country,
      description: company.description,
      annualRevenue: company.annualRevenue,
      employeeCount: company.employeeCount,
      ownerId: company.ownerId,
      owner: company.owner,
      contacts: company.contacts,
      deals: company.deals,
      tickets: company.tickets,
      activities: company.activities,
      notes: company.notes,
      _count: company._count,
    });
  } catch (error) {
    console.error("Error fetching company:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch company" },
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

    const existing = await prisma.company.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { status: "error", message: "Company not found" },
        { status: 404 }
      );
    }

    const props = body.properties || body;

    const updateData: Record<string, unknown> = {};

    if (props.name !== undefined) updateData.name = props.name;
    if (props.domain !== undefined) updateData.domain = props.domain || null;
    if (props.industry !== undefined) updateData.industry = props.industry || null;
    if (props.phone !== undefined) updateData.phone = props.phone || null;
    if (props.city !== undefined) updateData.city = props.city || null;
    if (props.state !== undefined) updateData.state = props.state || null;
    if (props.country !== undefined) updateData.country = props.country || null;
    if (props.description !== undefined) updateData.description = props.description || null;
    if (props.annualRevenue !== undefined || props.annualrevenue !== undefined) {
      const raw = props.annualRevenue ?? props.annualrevenue;
      updateData.annualRevenue = raw ? parseFloat(String(raw)) : null;
    }
    if (props.employeeCount !== undefined || props.numberofemployees !== undefined) {
      const raw = props.employeeCount ?? props.numberofemployees;
      updateData.employeeCount = raw ? parseInt(String(raw)) : null;
    }
    if (props.ownerId !== undefined) updateData.ownerId = props.ownerId || null;

    const company = await prisma.company.update({
      where: { id },
      data: updateData,
      include: {
        owner: { select: { id: true, name: true, email: true, image: true } },
        _count: {
          select: { contacts: true, deals: true, tickets: true, activities: true },
        },
      },
    });

    return NextResponse.json({
      id: company.id,
      properties: {
        name: company.name,
        domain: company.domain,
        industry: company.industry,
        phone: company.phone,
        city: company.city,
        state: company.state,
        country: company.country,
        description: company.description,
        annualrevenue: company.annualRevenue,
        numberofemployees: company.employeeCount,
        hs_object_id: company.id,
      },
      createdAt: company.createdAt.toISOString(),
      updatedAt: company.updatedAt.toISOString(),
      archived: false,
      owner: company.owner || null,
      _count: company._count,
    });
  } catch (error) {
    console.error("Error updating company:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to update company" },
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

    const existing = await prisma.company.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { status: "error", message: "Company not found" },
        { status: 404 }
      );
    }

    await prisma.company.delete({ where: { id } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting company:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to delete company" },
      { status: 500 }
    );
  }
}
