import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { domain: { contains: search, mode: "insensitive" } },
        { industry: { contains: search, mode: "insensitive" } },
      ];
    }

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          owner: { select: { id: true, name: true } },
          _count: {
            select: {
              contacts: true,
              deals: true,
              tickets: true,
            },
          },
        },
      }),
      prisma.company.count({ where }),
    ]);

    return NextResponse.json({
      companies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json(
      { error: "会社の取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, domain, industry, phone, city, state, country, description, annualRevenue, employeeCount, ownerId } = body;

    if (!name) {
      return NextResponse.json(
        { error: "会社名は必須です" },
        { status: 400 }
      );
    }

    const company = await prisma.company.create({
      data: {
        name,
        domain: domain || null,
        industry: industry || null,
        phone: phone || null,
        city: city || null,
        state: state || null,
        country: country || null,
        description: description || null,
        annualRevenue: annualRevenue ? parseFloat(annualRevenue) : null,
        employeeCount: employeeCount ? parseInt(employeeCount) : null,
        ownerId: ownerId || null,
      },
      include: {
        owner: { select: { id: true, name: true } },
        _count: {
          select: {
            contacts: true,
            deals: true,
            tickets: true,
          },
        },
      },
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json(
      { error: "会社の作成に失敗しました" },
      { status: 500 }
    );
  }
}
