import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
    const after = searchParams.get("after");
    const search = searchParams.get("search") || "";
    const pipelineId = searchParams.get("pipelineId");
    const stageId = searchParams.get("stageId");
    const ownerId = searchParams.get("ownerId");

    const where: Prisma.DealWhereInput = {};

    if (search) {
      where.name = { contains: search, mode: "insensitive" };
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

    const findArgs: Prisma.DealFindManyArgs = {
      where,
      take: limit + 1,
      orderBy: { createdAt: "desc" },
      include: {
        stage: { select: { id: true, name: true, color: true, probability: true } },
        pipeline: { select: { id: true, name: true } },
        owner: { select: { id: true, name: true, email: true, image: true } },
        company: { select: { id: true, name: true, domain: true } },
        contacts: {
          include: {
            contact: { select: { id: true, firstName: true, lastName: true, email: true } },
          },
        },
      },
    };

    if (after) {
      findArgs.cursor = { id: after };
      findArgs.skip = 1;
    }

    const deals = await prisma.deal.findMany(findArgs);

    const hasMore = deals.length > limit;
    const results = deals.slice(0, limit);

    const formattedResults = results.map((d: Record<string, unknown>) => ({
      id: d.id,
      properties: {
        dealname: d.name,
        amount: d.amount,
        dealstage: d.stageId,
        pipeline: d.pipelineId,
        closedate: d.closeDate ? (d.closeDate as Date).toISOString() : null,
        hs_deal_stage_probability: d.probability,
        deal_currency_code: d.currency,
        hs_priority: d.priority,
        hs_object_id: d.id,
      },
      createdAt: (d.createdAt as Date).toISOString(),
      updatedAt: (d.updatedAt as Date).toISOString(),
      archived: false,
      stage: d.stage,
      pipeline: d.pipeline,
      owner: d.owner || null,
      company: d.company || null,
      contacts: (d.contacts as Array<{ contact: unknown }>).map((dc) => ({ contact: dc.contact })),
    }));

    return NextResponse.json({
      results: formattedResults,
      paging: hasMore
        ? { next: { after: (results[results.length - 1] as Record<string, unknown>).id } }
        : undefined,
    });
  } catch (error) {
    console.error("Error fetching deals:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch deals" },
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

    const name = props.dealname || props.name;
    const stageId = props.dealstage || props.stageId;
    const pipelineId = props.pipeline || props.pipelineId;

    if (!name) {
      return NextResponse.json(
        { status: "error", message: "dealname is required" },
        { status: 400 }
      );
    }

    if (!stageId || !pipelineId) {
      return NextResponse.json(
        { status: "error", message: "dealstage and pipeline are required" },
        { status: 400 }
      );
    }

    const amount = props.amount;
    const closeDate = props.closedate || props.closeDate;
    const contactIds: string[] = body.contactIds || props.contactIds || [];
    const probabilityRaw = props.hs_deal_stage_probability || props.probability;

    const deal = await prisma.deal.create({
      data: {
        name,
        amount: amount !== undefined && amount !== null && amount !== ""
          ? parseFloat(String(amount))
          : null,
        currency: props.deal_currency_code || props.currency || "JPY",
        closeDate: closeDate ? new Date(closeDate) : null,
        probability: probabilityRaw ? parseFloat(String(probabilityRaw)) : null,
        stageId,
        pipelineId,
        ownerId: props.ownerId || null,
        companyId: props.companyId || null,
        priority: props.hs_priority || props.priority || "MEDIUM",
        ...(contactIds.length > 0
          ? {
              contacts: {
                create: contactIds.map((cid) => ({ contactId: cid })),
              },
            }
          : {}),
      },
      include: {
        stage: { select: { id: true, name: true, color: true, probability: true } },
        pipeline: { select: { id: true, name: true } },
        owner: { select: { id: true, name: true, email: true, image: true } },
        company: { select: { id: true, name: true, domain: true } },
        contacts: {
          include: {
            contact: { select: { id: true, firstName: true, lastName: true, email: true } },
          },
        },
      },
    });

    return NextResponse.json(
      {
        id: deal.id,
        properties: {
          dealname: deal.name,
          amount: deal.amount,
          dealstage: deal.stageId,
          pipeline: deal.pipelineId,
          closedate: deal.closeDate?.toISOString() || null,
          hs_deal_stage_probability: deal.probability,
          deal_currency_code: deal.currency,
          hs_priority: deal.priority,
          hs_object_id: deal.id,
        },
        createdAt: deal.createdAt.toISOString(),
        updatedAt: deal.updatedAt.toISOString(),
        archived: false,
        stage: deal.stage,
        pipeline: deal.pipeline,
        owner: deal.owner || null,
        company: deal.company || null,
        contacts: deal.contacts.map((dc) => ({ contact: dc.contact })),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating deal:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to create deal" },
      { status: 500 }
    );
  }
}
