import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search") || "";
    const pipelineId = searchParams.get("pipelineId");
    const stageId = searchParams.get("stageId");
    const ownerId = searchParams.get("ownerId");

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
      ];
    }

    if (pipelineId) {
      where.pipelineId = pipelineId;
    }

    if (stageId) {
      where.stageId = stageId;
    }

    if (ownerId) {
      where.ownerId = ownerId;
    }

    const [deals, total] = await Promise.all([
      prisma.deal.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          stage: {
            select: { id: true, name: true, color: true, probability: true },
          },
          pipeline: {
            select: { id: true, name: true },
          },
          owner: { select: { id: true, name: true } },
          company: { select: { id: true, name: true } },
          contacts: {
            include: {
              contact: {
                select: { id: true, firstName: true, lastName: true },
              },
            },
          },
        },
      }),
      prisma.deal.count({ where }),
    ]);

    return NextResponse.json({
      deals,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching deals:", error);
    return NextResponse.json(
      { error: "取引の取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, amount, currency, closeDate, probability, stageId, pipelineId, ownerId, companyId, priority, contactIds } = body;

    if (!name) {
      return NextResponse.json(
        { error: "取引名は必須です" },
        { status: 400 }
      );
    }

    if (!stageId || !pipelineId) {
      return NextResponse.json(
        { error: "パイプラインとステージは必須です" },
        { status: 400 }
      );
    }

    const deal = await prisma.deal.create({
      data: {
        name,
        amount: amount ? parseFloat(amount) : null,
        currency: currency || "JPY",
        closeDate: closeDate ? new Date(closeDate) : null,
        probability: probability ? parseFloat(probability) : null,
        stageId,
        pipelineId,
        ownerId: ownerId || null,
        companyId: companyId || null,
        priority: priority || "MEDIUM",
        contacts: contactIds?.length
          ? {
              create: contactIds.map((contactId: string) => ({
                contactId,
              })),
            }
          : undefined,
      },
      include: {
        stage: {
          select: { id: true, name: true, color: true, probability: true },
        },
        pipeline: {
          select: { id: true, name: true },
        },
        owner: { select: { id: true, name: true } },
        company: { select: { id: true, name: true } },
        contacts: {
          include: {
            contact: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
      },
    });

    return NextResponse.json(deal, { status: 201 });
  } catch (error) {
    console.error("Error creating deal:", error);
    return NextResponse.json(
      { error: "取引の作成に失敗しました" },
      { status: 500 }
    );
  }
}
