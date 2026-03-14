import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const lifecycleStage = searchParams.get("lifecycleStage");
    const leadStatus = searchParams.get("leadStatus");
    const ownerId = searchParams.get("ownerId");

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    if (lifecycleStage) {
      where.lifecycleStage = lifecycleStage;
    }

    if (leadStatus) {
      where.leadStatus = leadStatus;
    }

    if (ownerId) {
      where.ownerId = ownerId;
    }

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          company: { select: { id: true, name: true } },
          owner: { select: { id: true, name: true } },
          _count: {
            select: {
              deals: true,
              tickets: true,
              tasks: true,
              activities: true,
            },
          },
        },
      }),
      prisma.contact.count({ where }),
    ]);

    return NextResponse.json({
      contacts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "コンタクトの取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, jobTitle, lifecycleStage, leadStatus, source, ownerId, companyId } = body;

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: "姓と名は必須です" },
        { status: 400 }
      );
    }

    if (email) {
      const existing = await prisma.contact.findFirst({
        where: { email },
      });
      if (existing) {
        return NextResponse.json(
          { error: "このメールアドレスのコンタクトは既に存在します" },
          { status: 409 }
        );
      }
    }

    const contact = await prisma.contact.create({
      data: {
        firstName,
        lastName,
        email: email || null,
        phone: phone || null,
        jobTitle: jobTitle || null,
        lifecycleStage: lifecycleStage || "SUBSCRIBER",
        leadStatus: leadStatus || null,
        source: source || null,
        ownerId: ownerId || null,
        companyId: companyId || null,
      },
      include: {
        company: { select: { id: true, name: true } },
        owner: { select: { id: true, name: true } },
        _count: {
          select: {
            deals: true,
            tickets: true,
            tasks: true,
            activities: true,
          },
        },
      },
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      { error: "コンタクトの作成に失敗しました" },
      { status: 500 }
    );
  }
}
