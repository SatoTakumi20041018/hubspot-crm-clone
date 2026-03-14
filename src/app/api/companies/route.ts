import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const after = searchParams.get("after");
    const search = searchParams.get("search") || "";

    const where: Prisma.CompanyWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { domain: { contains: search, mode: "insensitive" } },
        { industry: { contains: search, mode: "insensitive" } },
      ];
    }

    const findArgs: Prisma.CompanyFindManyArgs = {
      where,
      take: limit + 1,
      orderBy: { createdAt: "desc" },
      include: {
        owner: { select: { id: true, name: true, email: true, image: true } },
        _count: {
          select: { contacts: true, deals: true, tickets: true },
        },
      },
    };

    if (after) {
      findArgs.cursor = { id: after };
      findArgs.skip = 1;
    }

    const companies = await prisma.company.findMany(findArgs);

    const hasMore = companies.length > limit;
    const results = companies.slice(0, limit);

    const formattedResults = results.map((c: Record<string, unknown>) => ({
      id: c.id,
      properties: {
        name: c.name,
        domain: c.domain,
        industry: c.industry,
        phone: c.phone,
        city: c.city,
        state: c.state,
        country: c.country,
        description: c.description,
        annualrevenue: c.annualRevenue,
        numberofemployees: c.employeeCount,
        hs_object_id: c.id,
      },
      createdAt: (c.createdAt as Date).toISOString(),
      updatedAt: (c.updatedAt as Date).toISOString(),
      archived: false,
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
    console.error("Error fetching companies:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch companies" },
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

    const props = body.properties || body;

    if (!props.name) {
      return NextResponse.json(
        { status: "error", message: "Company name is required" },
        { status: 400 }
      );
    }

    const annualRevenueRaw = props.annualRevenue || props.annualrevenue;
    const employeeCountRaw = props.employeeCount || props.numberofemployees;

    const company = await prisma.company.create({
      data: {
        name: props.name,
        domain: props.domain || null,
        industry: props.industry || null,
        phone: props.phone || null,
        city: props.city || null,
        state: props.state || null,
        country: props.country || null,
        description: props.description || null,
        annualRevenue: annualRevenueRaw ? parseFloat(String(annualRevenueRaw)) : null,
        employeeCount: employeeCountRaw ? parseInt(String(employeeCountRaw)) : null,
        ownerId: props.ownerId || null,
      },
      include: {
        owner: { select: { id: true, name: true, email: true, image: true } },
        _count: {
          select: { contacts: true, deals: true, tickets: true },
        },
      },
    });

    return NextResponse.json(
      {
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
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to create company" },
      { status: 500 }
    );
  }
}
